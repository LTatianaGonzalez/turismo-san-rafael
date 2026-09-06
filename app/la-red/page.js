export default function LaRedPage() {
  return (
    <section>
      <h1>La Red Local de Turismo</h1>

      <p>
        Desde el año 2010, un grupo de prestadores turísticos y líderes comunitarios de San
        Rafael se unieron para pensar el turismo del municipio de una manera distinta: no
        como una actividad aislada, sino como una herramienta de desarrollo para todo el
        territorio.
      </p>

      <p>
        Desde entonces, la Red ha impulsado espacios de formación y sensibilización dirigidos
        tanto a sus asociados como a la comunidad en general, alrededor de un turismo
        comunitario y sostenible: modelos de producción y servicio que sean coherentes con el
        territorio desde tres frentes que trabajamos permanentemente:
      </p>

      <div className="grid-tarjetas" style={{ margin: "1.5rem 0" }}>
        <div className="tarjeta tarjeta--agro">
          <h3>Económico</h3>
          <p>Fortalecer negocios locales y generar ingresos que se queden en el territorio.</p>
        </div>
        <div className="tarjeta tarjeta--comunitario">
          <h3>Social</h3>
          <p>Formar líderes y guías, y preservar la identidad campesina de la región.</p>
        </div>
        <div className="tarjeta tarjeta--eco">
          <h3>Ambiental</h3>
          <p>Proteger la biodiversidad y promover prácticas turísticas responsables.</p>
        </div>
      </div>

      <p>
        Hoy, la Red sigue creciendo junto con sus asociados: hospedajes, guías, restaurantes y
        emprendimientos locales que comparten una misma visión de San Rafael como un destino
        único por naturaleza.
      </p>

      <p>
        <a href="/encuesta">¿Ya nos visitaste? Cuéntanos tu experiencia aquí.</a>
      </p>
    </section>
  );
}
