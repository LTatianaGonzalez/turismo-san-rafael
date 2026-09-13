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
        .select("*")
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
          Encuentra opciones de alojamiento rural y urbano para disfrutar
          de San Rafael. Consulta cada lugar, conoce sus servicios y
          contacta directamente con el prestador.
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
   FICHA DE ALOJAMIENTO
   ============================================================ */

function FichaAlojamiento({ alojamiento }) {
  return (
    <article
      className="tarjeta"
      style={{
        overflow: "hidden",
        padding: 0,
      }}
    >
      {/* IMAGEN */}
      <div
        style={{
          width: "100%",
          height: 230,
          background: "#e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {alojamiento.imagen_url ? (
          <img
            src={alojamiento.imagen_url}
            alt={`Fotografía de ${alojamiento.nombre}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "#6b7280",
              padding: "1rem",
            }}
          >
            <div style={{ fontSize: "3rem" }}>🏡</div>
            <p>Fotografía próximamente</p>
          </div>
        )}
      </div>

      {/* INFORMACIÓN */}
      <div style={{ padding: "1.25rem" }}>
        <span
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Alojamiento
        </span>

        <h2 style={{ marginTop: "0.3rem" }}>
          {alojamiento.nombre}
        </h2>

        {alojamiento.descripcion && (
          <p>{alojamiento.descripcion}</p>
        )}

        {/* INFORMACIÓN BÁSICA */}
        <div
          style={{
            display: "grid",
            gap: "0.5rem",
            margin: "1rem 0",
            fontSize: "0.9rem",
          }}
        >
          {alojamiento.capacidad_personas && (
            <div>
              👥 Capacidad: hasta{" "}
              {alojamiento.capacidad_personas} personas
            </div>
          )}

          {alojamiento.precio_por_noche && (
            <div>
              💰 Desde $
              {Number(
                alojamiento.precio_por_noche
              ).toLocaleString("es-CO")}{" "}
              por noche
            </div>
          )}
        </div>

        {/* BOTONES */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            flexWrap: "wrap",
            marginTop: "1rem",
          }}
        >
          <a
            href={`/hospedaje?id=${alojamiento.id}`}
            className="boton boton-primario"
          >
            Ver alojamiento
          </a>

          <a
            href={`/hospedaje?id=${alojamiento.id}`}
            className="boton"
          >
            Consultar disponibilidad
          </a>
        </div>
      </div>
    </article>
  );
}