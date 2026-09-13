import { categoriasNovedades, novedades } from "@/lib/novedades";

export default function NovedadesPage() {
  return (
    <div className="pagina">
      <section className="pagina__intro">
        <span className="eyebrow">Actualidad del territorio</span>
        <h1>Novedades</h1>
        <p>Experiencias, eventos, naturaleza, cultura, sostenibilidad y noticias de San Rafael.</p>
      </section>

      <div className="filtros-categorias">
        {categoriasNovedades.map((cat) => (
          <span className="chip chip--filtro" key={cat.slug}>{cat.nombre}</span>
        ))}
      </div>

      <div className="grid-tarjetas grid-tarjetas--novedades">
        {novedades.map((novedad) => (
          <article className={`tarjeta tarjeta--novedad ${novedad.destacada ? "tarjeta--destacada" : ""}`} key={novedad.slug}>
            <div className="tarjeta__imagen"><span>{novedad.categoria}</span></div>
            <span className="chip">{novedad.etiqueta}</span>
            <h2>{novedad.titulo}</h2>
            <p>{novedad.resumen}</p>
            <a href={`/novedades/${novedad.slug}`} className="enlace-falso">Leer más →</a>
          </article>
        ))}
      </div>
    </div>
  );
}
