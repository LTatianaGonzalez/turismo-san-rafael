export default function SostenibilidadPage() {
  return (
    <div className="pagina">
      <section className="pagina__intro">
        <span className="eyebrow">Turismo responsable</span>
        <h1>Sostenibilidad en San Rafael</h1>
        <p>
          El turismo debe contribuir al bienestar del territorio. Por eso
          medimos sus dimensiones económica, social y ambiental.
        </p>
      </section>

      <div className="grid-tarjetas">
        <article className="tarjeta">
          <span className="icono-grande">💰</span>
          <h2>Dimensión económica</h2>
          <p>Seguimiento a gasto, estadía, consumo local y dinámica turística.</p>
        </article>
        <article className="tarjeta">
          <span className="icono-grande">🤝</span>
          <h2>Dimensión social</h2>
          <p>Percepción, satisfacción, seguridad e interacción con la comunidad.</p>
        </article>
        <article className="tarjeta">
          <span className="icono-grande">🌱</span>
          <h2>Dimensión ambiental</h2>
          <p>Percepción del entorno, buenas prácticas y conservación.</p>
        </article>
      </div>

      <section className="llamada-accion">
        <h2>Ayúdanos a conocer el impacto del turismo</h2>
        <p>Tu experiencia aporta información para mejorar la gestión turística del municipio.</p>
        <a href="/encuesta" className="boton boton-primario">Responder encuesta</a>
      </section>
    </div>
  );
}
