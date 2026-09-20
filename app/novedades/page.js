import { categoriasNovedades, novedades } from "@/lib/novedades";

export default function NovedadesPage() {
  return (
    <div className="pagina">

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <section className="pagina__intro">

        <span className="eyebrow">
          Actualidad del territorio
        </span>

        <h1>
          Novedades
        </h1>

        <p>
          Experiencias, eventos, naturaleza, cultura,
          sostenibilidad y noticias de San Rafael.
        </p>

      </section>


      {/* =====================================================
          CATEGORÍAS
      ===================================================== */}

      <div className="filtros-categorias">

        {categoriasNovedades.map((cat) => (

          <span
            className="chip chip--filtro"
            key={cat.slug}
          >
            {cat.nombre}
          </span>

        ))}

      </div>


      {/* =====================================================
          LISTADO DE NOVEDADES
      ===================================================== */}

      <div className="grid-tarjetas grid-tarjetas--novedades">

        {novedades.map((novedad) => (

          <article
            className={`tarjeta tarjeta--novedad ${
              novedad.destacada
                ? "tarjeta--destacada"
                : ""
            }`}
            key={novedad.slug}
          >

            {/* =================================================
                IMAGEN
            ================================================= */}

            <div className="tarjeta__imagen">

              <span>
                {novedad.categoria}
              </span>

            </div>


            {/* =================================================
                ETIQUETA
            ================================================= */}

            <span className="chip">
              {novedad.etiqueta}
            </span>


            {/* =================================================
                TÍTULO
            ================================================= */}

            <h2>
              {novedad.titulo}
            </h2>


            {/* =================================================
                RESUMEN
            ================================================= */}

            <p>
              {novedad.resumen}
            </p>


            {/* =================================================
                ENLACE
            ================================================= */}

            <a
              href={`/novedades/${novedad.slug}`}
              className="enlace-falso"
            >
              Leer más →
            </a>

          </article>

        ))}

      </div>

    </div>
  );
}