"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HospedajesPage() {
  const [alojamientos, setAlojamientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarAlojamientos() {
      setCargando(true);
      setError(null);

      const { data, error } = await supabase
        .from("hoteles")
        .select(`
          id,
          nombre,
          slug,
          tipo_alojamiento,
          descripcion,
          descripcion_corta,
          imagen_url,
          instagram_url,
          whatsapp_url,
          sitio_web_url,
          mapa_url,
          activo
        `)
        .eq("activo", true)
        .order("creado_en", { ascending: true });

      if (error) {
        console.error(error);
        setError("No fue posible cargar los alojamientos.");
      } else {
        setAlojamientos(data || []);
      }

      setCargando(false);
    }

    cargarAlojamientos();
  }, []);

  if (cargando) {
    return (
      <section className="pagina">
        <p>Cargando alojamientos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pagina">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="pagina">

      {/* ENCABEZADO */}
      <section className="pagina__intro">
        <span className="eyebrow">Dónde hospedarte</span>

        <h1>Alojamientos en San Rafael</h1>

        <p>
          Encuentra alojamientos rurales y urbanos para disfrutar
          de San Rafael. Conoce cada lugar, descubre sus características
          y contacta directamente con el prestador.
        </p>
      </section>

      {/* CONTADOR */}
      <div style={{ marginBottom: "1.5rem" }}>
        <strong>
          Alojamientos registrados ({alojamientos.length})
        </strong>
      </div>

      {/* LISTADO */}
      {alojamientos.length === 0 ? (
        <div className="tarjeta">
          <h2>Próximamente</h2>

          <p>
            Estamos incorporando nuevas opciones de alojamiento
            en San Rafael.
          </p>
        </div>
      ) : (
        <div className="grid-tarjetas">
          {alojamientos.map((alojamiento) => (
            <FichaAlojamiento
              key={alojamiento.id}
              alojamiento={alojamiento}
            />
          ))}
        </div>
      )}
    </section>
  );
}


/* ============================================================
   TARJETA DE ALOJAMIENTO
   ============================================================ */

function FichaAlojamiento({ alojamiento }) {

  /*
   * Yakutour utiliza por ahora las fotografías reales
   * almacenadas en:
   *
   * public/alojamientos/yakutour/
   */

  const esYakutour =
    alojamiento.nombre?.toLowerCase().includes("yakutour");

  const imagenPrincipal = esYakutour
    ? "/alojamientos/yakutour/yakutour-1.jpeg"
    : alojamiento.imagen_url || null;

  /*
   * Si existe tipo de alojamiento mostramos:
   * RURAL / URBANO
   *
   * Si todavía no tiene categoría usamos:
   * ALOJAMIENTO
   */

  const tipo = alojamiento.tipo_alojamiento
    ? alojamiento.tipo_alojamiento
    : "Alojamiento";

  return (
    <article
      className="tarjeta"
      style={{
        overflow: "hidden",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* =====================================================
          IMAGEN
          ===================================================== */}

      <div
        style={{
          width: "100%",
          height: 250,
          background: "#e5e7eb",
          overflow: "hidden",
        }}
      >

        {imagenPrincipal ? (

          <img
            src={imagenPrincipal}
            alt={`Fotografía de ${alojamiento.nombre}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

        ) : (

          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
            }}
          >

            <div style={{ fontSize: "3rem" }}>
              🏡
            </div>

            <p>
              Fotografía próximamente
            </p>

          </div>

        )}

      </div>


      {/* =====================================================
          INFORMACIÓN
          ===================================================== */}

      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >

        {/* CATEGORÍA */}

        <span
          style={{
            fontSize: "0.75rem",
            color: "#1f4d3a",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 700,
            marginBottom: "0.35rem",
          }}
        >
          {tipo}
        </span>


        {/* NOMBRE */}

        <h2
          style={{
            margin: "0 0 0.6rem",
          }}
        >
          {alojamiento.nombre}
        </h2>


        {/* DESCRIPCIÓN */}

        {(alojamiento.descripcion_corta ||
          alojamiento.descripcion) && (

          <p
            style={{
              marginBottom: "1.2rem",
              lineHeight: 1.6,
              color: "#4b5563",
            }}
          >
            {alojamiento.descripcion_corta ||
              alojamiento.descripcion}
          </p>

        )}


            {/* BOTÓN VER ALOJAMIENTO */}
      <div style={{ marginTop: "auto" }}>
        <a
          href={
            alojamiento.slug
              ? `/hospedaje/${alojamiento.slug}`
              : `/hospedaje?id=${alojamiento.id}`
          }
          className="boton boton-primario"
        >
          Ver alojamiento
        </a>
      </div>

    </div>
  </article>
  );
}