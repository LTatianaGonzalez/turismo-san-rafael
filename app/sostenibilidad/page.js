export default function SostenibilidadPage() {
  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/TU_ID_DEL_FORMULARIO/viewform";

  return (
    <div className="pagina">

      <section className="pagina__intro">

        <span className="eyebrow">
          Turismo responsable
        </span>

        <h1>
          Sostenibilidad en San Rafael
        </h1>

        <p>
          El turismo debe contribuir al bienestar del territorio.
          Por eso buscamos conocer sus impactos económicos,
          sociales y ambientales.
        </p>

      </section>


      <div className="grid-tarjetas">

        <article className="tarjeta">

          <span className="icono-grande">
            💰
          </span>

          <h2>
            Dimensión económica
          </h2>

          <p>
            Conocer cómo el turismo contribuye a la economía
            local y al consumo de productos y servicios del municipio.
          </p>

        </article>


        <article className="tarjeta">

          <span className="icono-grande">
            🤝
          </span>

          <h2>
            Dimensión social
          </h2>

          <p>
            Conocer la percepción de los visitantes y su
            relación con la comunidad local.
          </p>

        </article>


        <article className="tarjeta">

          <span className="icono-grande">
            🌱
          </span>

          <h2>
            Dimensión ambiental
          </h2>

          <p>
            Identificar prácticas relacionadas con el cuidado
            del agua, los residuos, la naturaleza y los espacios
            turísticos.
          </p>

        </article>

      </div>


      <section className="llamada-accion">

        <h2>
          Ayúdanos a conocer el impacto del turismo
        </h2>

        <p>
          Tu experiencia aporta información para mejorar
          la gestión turística y la sostenibilidad de San Rafael.
        </p>

        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="boton boton-primario"
        >
          Responder encuesta ↗
        </a>

      </section>

    </div>
  );
}