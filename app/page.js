export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div>
          <h1>San Rafael, un territorio único por naturaleza</h1>
          <p>
            Montañas, ríos y una comunidad campesina que ha hecho del turismo una forma de
            cuidar su tierra. Descubre un destino donde la aventura, la naturaleza y la
            cultura se encuentran.
          </p>
          <div className="hero__acciones">
            <a href="/experiencias" className="boton boton-primario">
              Ver qué hacer
            </a>
            <a href="/encuesta" className="boton boton-secundario">
              Cuéntanos tu experiencia
            </a>
          </div>
        </div>

        {/* Ilustración de curvas de nivel, evocando las montañas del territorio */}
        <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 210 Q 80 140, 150 170 T 290 130" stroke="#1F4D3A" strokeWidth="2" opacity="0.5" />
          <path d="M10 180 Q 80 110, 150 140 T 290 100" stroke="#1F4D3A" strokeWidth="2" opacity="0.6" />
          <path d="M10 150 Q 80 80, 150 110 T 290 70" stroke="#1F4D3A" strokeWidth="2" opacity="0.75" />
          <path d="M10 120 Q 80 50, 150 80 T 290 40" stroke="#C99A2E" strokeWidth="2.5" opacity="0.9" />
          <path d="M10 90 Q 80 20, 150 50 T 290 10" stroke="#1F4D3A" strokeWidth="2" />
        </svg>
      </section>

      {/* Cifras de biodiversidad, estilo bitácora de campo */}
      <section className="cifras">
        <Cifra numero="350" texto="Especies de aves" />
        <Cifra numero="40" texto="Especies de anfibios" />
        <Cifra numero="41" texto="Especies de reptiles" />
        <Cifra numero="36" texto="Especies de mamíferos" />
      </section>

      {/* Categorías de turismo */}
      <section style={{ margin: "2rem 0" }}>
        <h2>Tres formas de vivir San Rafael</h2>
        <div className="grid-tarjetas">
          <div className="tarjeta tarjeta--aventura">
            <h3>Turismo de Aventura</h3>
            <p>Canyoning, tubing, senderismo y mucho más para quienes buscan adrenalina.</p>
          </div>
          <div className="tarjeta tarjeta--eco">
            <h3>Ecoturismo</h3>
            <p>Avistamiento de aves, senderos ecológicos y experiencias con la naturaleza.</p>
          </div>
          <div className="tarjeta tarjeta--agro">
            <h3>Agroturismo</h3>
            <p>Cacao, panela y café: conoce de cerca la producción local del territorio.</p>
          </div>
        </div>
        <p style={{ marginTop: "1rem" }}>
          <a href="/experiencias">Ver todas las actividades →</a>
        </p>
      </section>

      {/* Turismo comunitario */}
      <section style={{ margin: "2rem 0" }}>
        <h2>Turismo comunitario, desde el año 2010</h2>
        <p>
          La Red Local de Turismo trabaja junto a la comunidad para que cada visita fortalezca
          el territorio en lo económico, lo social y lo ambiental.
        </p>
        <p>
          <a href="/la-red">Conoce más sobre la Red →</a>
        </p>
      </section>
    </div>
  );
}

function Cifra({ numero, texto }) {
  return (
    <div>
      <p className="cifra__numero">{numero}</p>
      <p className="cifra__texto">{texto}</p>
    </div>
  );
}
