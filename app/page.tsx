const collections = [
  {
    name: 'Receta diaria',
    detail: 'Marcos livianos para todos los dias',
    price: 'Desde $89.000',
    image:
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Sol premium',
    detail: 'Proteccion UV400 y diseno urbano',
    price: 'Desde $76.000',
    image:
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Blue filter',
    detail: 'Cristales para pantallas y oficina',
    price: 'Desde $62.000',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
  },
  {
    name: 'Lineas de autor',
    detail: 'Modelos seleccionados en local',
    price: 'Desde $98.000',
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=85',
  },
]

const services = [
  ['Receta y sol', 'Anteojos para uso diario, lectura, manejo y exterior.'],
  ['Asesoramiento', 'Elegimos el marco segun rostro, estilo y graduacion.'],
  ['Cristales a medida', 'Monofocales, ocupacionales, progresivos y filtros especiales.'],
  ['Ajuste en local', 'Calibracion, limpieza y mantenimiento de tus anteojos.'],
]

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar" aria-label="Navegacion principal">
        <a className="brand" href="#inicio" aria-label="occhio optica">
          <span className="brand-kicker">Optica</span>
          <strong className="occhio-logo">
            <span>o</span>
            <span className="lens-pair" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>hio</span>
          </strong>
        </a>
        <nav>
          <a href="#coleccion">Coleccion</a>
          <a href="#servicios">Servicios</a>
          <a href="#turnos">Turnos</a>
        </nav>
      </header>

      <section
        id="inicio"
        className="hero hero-primary parallax"
        style={{
          backgroundImage:
            "linear-gradient(rgba(24, 25, 24, .38), rgba(24, 25, 24, .68)), url('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="hero-content">
          <p className="eyebrow">occhio optica</p>
          <h1>
            <span>Mirar bien</span>
            <span>tambien es</span>
            <span>parte del estilo.</span>
          </h1>
          <p className="intro">
            Lentes de receta, sol y cristales a medida en una optica de calle:
            luminosa, cercana y con seleccion de marcas para todos los dias.
          </p>
          <a className="outline-button" href="#turnos">
            Reservar examen visual
          </a>
        </div>
      </section>

      <section id="coleccion" className="product-section">
        <p className="section-kicker">Vidriera occhio</p>
        <h2>Elegidos del local</h2>
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
            "linear-gradient(90deg, rgba(43, 39, 35, .86), rgba(43, 39, 35, .34)), url('https://images.unsplash.com/photo-1512099053734-e6767b535838?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="panel-copy">
          <p className="eyebrow">Frente a frente</p>
          <h2>Probate marcos con luz real y asesoramiento cercano.</h2>
          <p>
            Como en el local: miramos proporcion, comodidad, graduacion y uso
            cotidiano antes de recomendar un par.
          </p>
        </div>
      </section>

      <section className="lookbook">
        <div className="lookbook-copy">
          <p className="section-kicker">Cristales inteligentes</p>
          <h2>Receta, sol y descanso visual con terminacion precisa.</h2>
          <p>
            Para manejar, trabajar frente a pantallas, leer o salir al sol:
            elegimos el cristal correcto antes de cerrar el marco.
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
            "linear-gradient(rgba(10, 12, 13, .42), rgba(10, 12, 13, .78)), url('https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1800&q=90')",
        }}
      >
        <div className="hero-content">
          <p className="eyebrow">Turnos y consultas</p>
          <h2>
            <span>Pasate por</span>
            <span>occhio y elegi</span>
            <span>tu proximo par.</span>
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
