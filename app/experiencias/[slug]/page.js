import Link from "next/link";
import { actividades, categorias } from "@/lib/actividades";

export default async function ExperienciaDetallePage({ params }) {
  const { slug } = await params;

  const experiencia = actividades.find(
    (actividad) => actividad.id === slug
  );

  if (!experiencia) {
    return (
      <section className="pagina">
        <h1>Experiencia no encontrada</h1>

        <p>
          La experiencia que buscas no está disponible.
        </p>

        <Link
          href="/experiencias"
          className="boton boton-primario"
        >
          Volver a experiencias
        </Link>
      </section>
    );
  }

  const categoria = categorias.find(
    (cat) => cat.id === experiencia.categoria
  );

  return (
    <section className="pagina">

      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/experiencias"
          style={{
            color: "#1f4d3a",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Volver a experiencias
        </Link>
      </div>

      <section className="pagina__intro">

        <span className="eyebrow">
          {categoria?.nombre || "Experiencia"}
        </span>

        <h1>
          {experiencia.nombre}
        </h1>

        <p>
          {experiencia.descripcion}
        </p>

      </section>

      <section
        className="tarjeta"
        style={{
          marginTop: "2rem",
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "1rem",
            }}
          >
            🌿
          </div>

          <h2>
            Fotografías de la experiencia
          </h2>

          <p>
            Próximamente encontrarás aquí fotografías,
            información y detalles de esta experiencia.
          </p>
        </div>
      </section>

      <section style={{ marginTop: "3rem" }}>

        <h2>
          Asociados que ofrecen esta experiencia
        </h2>

        <div
          className="tarjeta"
          style={{
            marginTop: "1rem",
          }}
        >
          <p>
            Próximamente aparecerán aquí los asociados
            que ofrecen esta experiencia, junto con sus
            datos de contacto.
          </p>
        </div>

      </section>

    </section>
  );
}