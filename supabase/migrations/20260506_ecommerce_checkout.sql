create or replace function public.ecommerce_checkout(
  p_kiosco_id uuid,
  p_payment_method_id text,
  payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_customer jsonb := coalesce(payload -> 'customer', '{}'::jsonb);
  v_items jsonb := coalesce(payload -> 'items', '[]'::jsonb);
  v_item jsonb;
  v_cliente_id bigint;
  v_vendedor_id bigint;
  v_venta_id bigint;
  v_item_id bigint;
  v_producto_id bigint;
  v_qty integer;
  v_producto record;
  v_total numeric(10, 2) := 0;
  v_puntos_ganados integer := 0;
  v_email text := lower(nullif(trim(coalesce(v_customer ->> 'email', '')), ''));
  v_nombre text := nullif(trim(coalesce(v_customer ->> 'nombre', '')), '');
  v_apellido text := nullif(trim(coalesce(v_customer ->> 'apellido', '')), '');
  v_telefono text := nullif(trim(coalesce(v_customer ->> 'telefono', '')), '');
  v_payment_method_id text;
  v_sistema_puntos boolean := false;
begin
  if p_kiosco_id is null then
    raise exception 'Comercio invalido';
  end if;

  if v_nombre is null or length(v_nombre) < 2 then
    raise exception 'Ingresa un nombre valido';
  end if;

  if v_email is null or position('@' in v_email) = 0 then
    raise exception 'Ingresa un email valido';
  end if;

  if jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) = 0 then
    raise exception 'El carrito esta vacio';
  end if;

  select coalesce(sistema_puntos_activo, false)
  into v_sistema_puntos
  from public.kioscos
  where id = p_kiosco_id;

  if not found then
    raise exception 'Comercio no encontrado';
  end if;

  select id
  into v_vendedor_id
  from public.vendedor
  where kiosco_id = p_kiosco_id
    and deleted = false
  order by id
  limit 1;

  if v_vendedor_id is null then
    raise exception 'No hay vendedor configurado para el comercio';
  end if;

  select id
  into v_payment_method_id
  from public.metodo_pago
  where lower(id) = lower(coalesce(p_payment_method_id, 'DEFAULT_PENDIENTE'))
    and deleted = false
    and (kiosco_id = p_kiosco_id or kiosco_id is null)
  order by kiosco_id nulls last
  limit 1;

  if v_payment_method_id is null then
    raise exception 'Metodo de pago no encontrado';
  end if;

  select id
  into v_cliente_id
  from public.cliente
  where kiosco_id = p_kiosco_id
    and deleted = false
    and lower(email) = v_email
  order by id
  limit 1;

  if v_cliente_id is null then
    insert into public.cliente (
      nombre,
      apellido,
      email,
      telefono,
      deleted,
      kiosco_id,
      puntos
    )
    values (
      v_nombre,
      coalesce(v_apellido, ''),
      v_email,
      v_telefono,
      false,
      p_kiosco_id,
      0
    )
    returning id into v_cliente_id;
  end if;

  for v_item in select * from jsonb_array_elements(v_items)
  loop
    v_producto_id := nullif(v_item ->> 'productId', '')::bigint;
    v_qty := coalesce((v_item ->> 'quantity')::integer, 0);

    if v_producto_id is null or v_qty <= 0 then
      raise exception 'Item de carrito invalido';
    end if;

    select id, codigo, nombre, descripcion, precio, stock, coalesce(puntos, 0) as puntos
    into v_producto
    from public.producto
    where id = v_producto_id
      and kiosco_id = p_kiosco_id
      and deleted = false
    for update;

    if v_producto.id is null then
      raise exception 'Producto no encontrado';
    end if;

    if v_producto.stock < v_qty then
      raise exception 'Stock insuficiente para "%"', v_producto.nombre;
    end if;

    v_total := v_total + (v_producto.precio * v_qty);
    v_puntos_ganados := v_puntos_ganados + greatest(0, v_producto.puntos) * v_qty;
  end loop;

  insert into public.venta (
    cliente_id,
    vendedor_id,
    total,
    deleted,
    kiosco_id,
    factura_estado,
    idempotency_key
  )
  values (
    v_cliente_id,
    v_vendedor_id,
    round(v_total, 2),
    false,
    p_kiosco_id,
    'sin_factura',
    gen_random_uuid()
  )
  returning id into v_venta_id;

  for v_item in select * from jsonb_array_elements(v_items)
  loop
    v_producto_id := (v_item ->> 'productId')::bigint;
    v_qty := (v_item ->> 'quantity')::integer;

    select id, codigo, nombre, descripcion, precio, stock, coalesce(puntos, 0) as puntos
    into v_producto
    from public.producto
    where id = v_producto_id
      and kiosco_id = p_kiosco_id
      and deleted = false
    for update;

    update public.producto
    set stock = stock - v_qty
    where id = v_producto.id
      and kiosco_id = p_kiosco_id;

    insert into public.item_venta (
      codigo,
      nombre,
      descripcion,
      precio,
      cantidad,
      kiosco_id
    )
    values (
      v_producto.codigo,
      v_producto.nombre,
      coalesce(v_producto.descripcion, ''),
      v_producto.precio,
      v_qty,
      p_kiosco_id
    )
    returning id into v_item_id;

    insert into public.venta_detalle (venta_id, item_id, kiosco_id)
    values (v_venta_id, v_item_id, p_kiosco_id);
  end loop;

  insert into public.venta_pago (
    venta_id,
    metodo_id,
    monto,
    cuotas,
    kiosco_id
  )
  values (
    v_venta_id,
    v_payment_method_id,
    round(v_total, 2),
    null,
    p_kiosco_id
  );

  if v_sistema_puntos and v_puntos_ganados > 0 then
    update public.cliente
    set puntos = coalesce(puntos, 0) + v_puntos_ganados
    where id = v_cliente_id
      and kiosco_id = p_kiosco_id;

    insert into public.cliente_puntos_movimiento (
      cliente_id,
      venta_id,
      puntos,
      tipo,
      motivo,
      created_by,
      kiosco_id
    )
    values (
      v_cliente_id,
      v_venta_id,
      v_puntos_ganados,
      'ganancia',
      'Compra web #' || v_venta_id,
      null,
      p_kiosco_id
    );
  end if;

  return jsonb_build_object(
    'ok', true,
    'orderId', v_venta_id,
    'customerId', v_cliente_id,
    'total', round(v_total, 2),
    'pointsEarned', case when v_sistema_puntos then v_puntos_ganados else 0 end
  );
end;
$function$;

revoke all on function public.ecommerce_checkout(uuid, text, jsonb) from public;
grant execute on function public.ecommerce_checkout(uuid, text, jsonb) to service_role;
