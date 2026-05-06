const collections = [
  {
    name: 'Lentes de receta',
    detail: 'Monturas ligeras en acetato y titanio',
    price: 'Desde $89.000',
    image:
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Sol urbano',
    detail: 'Proteccion UV400 con cristales premium',
    price: 'Desde $76.000',
    image:
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Blue control',
    detail: 'Descanso visual para pantallas',
    price: 'Desde $62.000',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Lineas minimal',
    detail: 'Diseno silencioso para todos los dias',
    price: 'Desde $98.000',
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=85',
  },
]

const services = [
  ['Graduacion precisa', 'Medicion optometrica con equipamiento digital.'],
  ['Ajuste perfecto', 'Calibramos tus anteojos para uso real, no solo para vidriera.'],
  ['Cristales a medida', 'Monofocales, ocupacionales, progresivos y filtros especiales.'],
  ['Postventa cercana', 'Limpieza, ajuste y mantenimiento incluidos.'],
]

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar" aria-label="Navegacion principal">
        <a className="brand" href="#inicio" aria-label="Optica Occhio">
          <span>Optica</span>
          <strong>Occhio</strong>
        </a>
        <nav>
          <a href="#coleccion">Coleccion</a>
          <a href="#servicios">Servicios</a>
          <a href="#turnos">Turnos</a>
        </nav>
      </header>

      <section
        id="inicio"
        className="hero parallax"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10, 13, 16, .56), rgba(10, 13, 16, .62)), url('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="hero-content">
          <p className="eyebrow">Vision clara, estilo propio</p>
          <h1>
            <span>Anteojos</span>
            <span>que cambian</span>
            <span>como cambia</span>
            <span>la luz.</span>
          </h1>
          <p className="intro">
            Monturas seleccionadas, cristales de precision y una experiencia de
            atencion pensada para que veas bien y te reconozcas en el espejo.
          </p>
          <a className="outline-button" href="#turnos">
            Reservar examen visual
          </a>
        </div>
      </section>

      <section id="coleccion" className="product-section">
        <p className="section-kicker">Seleccion curada</p>
        <h2>Modelos destacados</h2>
        <div className="product-grid">
          {collections.map((item) => (
            <article className="product-card" key={item.name}>
              <img src={item.image} alt={item.name} />
              <p>{item.detail}</p>
              <h3>{item.name}</h3>
              <span>{item.price}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="editorial-panel parallax"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7, 10, 12, .86), rgba(7, 10, 12, .42)), url('https://images.unsplash.com/photo-1512099053734-e6767b535838?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="panel-copy">
          <p className="eyebrow">Optometria + diseno</p>
          <h2>Probate marcos con tiempo, luz natural y criterio profesional.</h2>
          <p>
            Te acompanamos desde la receta hasta el ajuste final, cuidando
            distancia pupilar, altura de montaje, uso diario y personalidad.
          </p>
        </div>
      </section>

      <section className="lookbook">
        <div className="lookbook-copy">
          <p className="section-kicker">Cristales inteligentes</p>
          <h2>Menos esfuerzo visual, mas nitidez en cada rutina.</h2>
          <p>
            Para manejar, trabajar frente a pantallas, leer o pasar del sol al
            interior: elegimos el cristal correcto antes de elegir el marco.
          </p>
          <a className="dark-button" href="#turnos">
            Consultar opciones
          </a>
        </div>
        <div className="image-stack" aria-hidden="true">
          <img
            className="stack-large"
            src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=1000&q=85"
            alt=""
          />
          <img
            className="stack-small"
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85"
            alt=""
          />
        </div>
      </section>

      <section id="servicios" className="services">
        {services.map(([title, text]) => (
          <article key={title}>
            <span />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section
        id="turnos"
        className="final-panel parallax"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8, 10, 12, .5), rgba(8, 10, 12, .78)), url('https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="hero-content">
          <p className="eyebrow">Turnos y asesoramiento</p>
          <h2>
            <span>Tu proximo par</span>
            <span>empieza con una</span>
            <span>mirada de cerca.</span>
          </h2>
          <p className="intro">
            Agenda una visita, trae tu receta o hacete el control visual en el
            local. Nosotros nos ocupamos del resto.
          </p>
          <a className="outline-button" href="tel:+540000000000">
            Llamar a la optica
          </a>
        </div>
      </section>
    </main>
  )
}
