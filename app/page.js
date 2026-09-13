import { novedades } from "@/lib/novedades";
import { actividades } from "@/lib/actividades";

export default function HomePage() {
  const destacada = novedades.find((n) => n.destacada) || novedades[0];
  const experiencias = actividades.slice(0, 3);

  return (
    <div>
      <section className="hero hero--home">
        <div className="hero__contenido">
          <span className="eyebrow">San Rafael · Antioquia</span>
          <h1>Descubre un territorio único por naturaleza.</h1>
          <p>
            Ríos, montañas, biodiversidad, cultura y experiencias comunitarias.
            Encuentra todo lo que necesitas para vivir San Rafael.
          </p>
          <div className="hero__acciones">
            <a href="/descubre" className="boton boton-primario">Explorar San Rafael</a>
            <a href="/hospedajes" className="boton boton-secundario">Buscar hospedaje</a>
          </div>
        </div>
        <div className="hero__visual" aria-label="San Rafael, destino de naturaleza">
          <div className="hero__badge">Naturaleza · Aventura · Comunidad</div>
          <div className="hero__circulo">SAN<br />RAFAEL</div>
        </div>
      </section>

      <section className="buscador-turistico">
        <div>
          <span className="eyebrow">Planifica tu visita</span>
          <h2>¿Qué quieres encontrar en San Rafael?</h2>
        </div>
        <div className="buscador-turistico__acciones">
          <a href="/descubre" className="tarjeta-mini">🗺️ <strong>Descubrir lugares</strong><span>Ríos, cascadas, cultura y más</span></a>
          <a href="/experiencias" className="tarjeta-mini">🌿 <strong>Vivir experiencias</strong><span>Aventura, naturaleza y comunidad</span></a>
          <a href="/hospedajes" className="tarjeta-mini">🏡 <strong>Encontrar hospedaje</strong><span>Consulta opciones y reserva</span></a>
        </div>
      </section>

      <section className="seccion">
        <div className="seccion__cabecera">
          <div>
            <span className="eyebrow">Lo nuevo del territorio</span>
            <h2>Novedades</h2>
          </div>
          <a href="/novedades">Ver todas →</a>
        </div>

        {destacada && (
          <article className="novedad-destacada">
            <div className="novedad-destacada__imagen">
              <span>{destacada.categoria}</span>
            </div>
            <div className="novedad-destacada__contenido">
              <span className="chip">{destacada.etiqueta}</span>
              <h3>{destacada.titulo}</h3>
              <p>{destacada.resumen}</p>
              <a className="boton boton-primario" href={`/novedades/${destacada.slug}`}>Conocer la experiencia</a>
            </div>
          </article>
        )}
      </section>

      <section className="seccion seccion--suave">
        <div className="seccion__cabecera">
          <div>
            <span className="eyebrow">Vive el territorio</span>
            <h2>Experiencias para descubrir</h2>
          </div>
          <a href="/experiencias">Ver experiencias →</a>
        </div>
        <div className="grid-tarjetas">
          {experiencias.map((a) => (
            <article key={a.id} className="tarjeta">
              <span className="chip">{a.categoria}</span>
              <h3>{a.nombre}</h3>
              <p>{a.descripcion}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="seccion">
        <div className="bloque-sostenibilidad">
          <div>
            <span className="eyebrow">Nuestro compromiso</span>
            <h2>Turismo que fortalece el territorio</h2>
            <p>
              Conoce cómo el turismo puede aportar al desarrollo económico,
              social y ambiental de San Rafael.
            </p>
          </div>
          <a href="/sostenibilidad" className="boton boton-primario">Conoce nuestro enfoque</a>
        </div>
      </section>
    </div>
  );
}
