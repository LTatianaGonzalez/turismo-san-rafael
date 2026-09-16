"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HospedajeDetallePage() {
  const params = useParams();
  const slug = params?.slug;

  const [alojamiento, setAlojamiento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    async function cargarAlojamiento() {
      setCargando(true);
      setError(null);

      const { data, error } = await supabase
        .from("hoteles")
        .select("*")
        .eq("slug", slug)
        .eq("activo", true)
        .maybeSingle();

      if (error) {
        console.error(error);
        setError("No fue posible cargar este alojamiento.");
      } else if (!data) {
        setError("No encontramos este alojamiento.");
      } else {
        setAlojamiento(data);
      }

      setCargando(false);
    }

    cargarAlojamiento();
  }, [slug]);

  /* =====================================================
     CARGANDO
  ===================================================== */

  if (cargando) {
    return (
      <main className="ficha-alojamiento">
        <p>Cargando alojamiento...</p>
      </main>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !alojamiento) {
    return (
      <main className="ficha-alojamiento">

        <div
          style={{
            marginBottom: "1.5rem",
          }}
        >
          <a
            href="/hospedajes"
            className="boton"
          >
            ← Volver a alojamientos
          </a>
        </div>

        <h1>Alojamiento no encontrado</h1>

        <p>
          {error || "No encontramos la información solicitada."}
        </p>

      </main>
    );
  }

  /* =====================================================
     FICHA
  ===================================================== */

  return (
    <main className="ficha-alojamiento">

      {/* =================================================
          VOLVER A ALOJAMIENTOS
      ================================================= */}

      <div
        style={{
          marginBottom: "1.5rem",
        }}
      >
        <a
          href="/hospedajes"
          className="boton"
        >
          ← Volver a alojamientos
        </a>
      </div>


      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <section className="ficha-encabezado">

        <div>

          <span className="eyebrow">
            {alojamiento.tipo_alojamiento || "Alojamiento"}
          </span>

          <h1>
            {alojamiento.nombre}
          </h1>

          <p className="ficha-ubicacion">
            📍 San Rafael, Antioquia
          </p>

        </div>

      </section>


      {/* =================================================
          GALERÍA
      ================================================= */}

      <GaleriaAlojamiento
        alojamiento={alojamiento}
      />


      {/* =================================================
          CONTENIDO
      ================================================= */}

      <section className="ficha-contenido">

        {/* =================================================
            DESCRIPCIÓN
        ================================================= */}

        <div className="ficha-descripcion">

          <span className="eyebrow">
            Conoce este lugar
          </span>

          <h2>
            {alojamiento.descripcion_corta ||
              "Una opción para disfrutar de San Rafael"}
          </h2>

          {alojamiento.descripcion && (
            <p>
              {alojamiento.descripcion}
            </p>
          )}


          {/* =================================================
              CARACTERÍSTICAS
          ================================================= */}

          <div className="caracteristicas-alojamiento">

            {alojamiento.tipo_alojamiento && (
              <div className="caracteristica">

                <span>
                  🏡
                </span>

                <strong>
                  Tipo
                </strong>

                <small>
                  {alojamiento.tipo_alojamiento}
                </small>

              </div>
            )}


            {alojamiento.capacidad_personas && (
              <div className="caracteristica">

                <span>
                  👥
                </span>

                <strong>
                  Capacidad
                </strong>

                <small>
                  Hasta {alojamiento.capacidad_personas} personas
                </small>

              </div>
            )}


            <div className="caracteristica">

              <span>
                🌿
              </span>

              <strong>
                San Rafael
              </strong>

              <small>
                Turismo de naturaleza
              </small>

            </div>

          </div>

        </div>


        {/* =================================================
            CONTACTO
        ================================================= */}

        <aside className="ficha-contacto">

          <h3>
            Contacta con {alojamiento.nombre}
          </h3>

          <p>
            Consulta directamente con el alojamiento sobre
            disponibilidad, precios y experiencias.
          </p>


          {/* =================================================
              INSTAGRAM
          ================================================= */}

          {alojamiento.instagram_url && (

            <a
              href={alojamiento.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="boton-contacto boton-instagram"
            >
              📸 Instagram
            </a>

          )}


          {/* =================================================
              WHATSAPP
          ================================================= */}

          {alojamiento.whatsapp_url && (

            <a
              href={alojamiento.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="boton-contacto boton-whatsapp"
            >
              💬 WhatsApp
            </a>

          )}


          {/* =================================================
              SITIO WEB
          ================================================= */}

          {alojamiento.sitio_web_url ? (

            <a
              href={alojamiento.sitio_web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="boton-contacto boton-mapa"
            >
              🌐 Sitio web
            </a>

          ) : (

            <div className="sitio-web-no-disponible">

              <span>
                🌐 Sitio web
              </span>

              <small>
                Información próximamente disponible
              </small>

            </div>

          )}


          {/* =================================================
              MAPA
          ================================================= */}

          {alojamiento.mapa_url && (

            <a
              href={alojamiento.mapa_url}
              target="_blank"
              rel="noopener noreferrer"
              className="boton-contacto boton-mapa"
            >
              🗺️ Cómo llegar
            </a>

          )}

        </aside>

      </section>


      {/* =================================================
          UBICACIÓN
      ================================================= */}

      <section className="ubicacion-ficha">

        <div className="ubicacion-texto">

          <span className="eyebrow">
            Ubicación
          </span>

          <h2>
            Encuentra {alojamiento.nombre}
          </h2>

          <p>
            Consulta la ubicación y planifica tu recorrido
            desde el casco urbano de San Rafael.
          </p>


          {/* =================================================
              DATOS DE RUTA
          ================================================= */}

          <div className="datos-ruta">

            <div>

              <strong>
                📍 Origen
              </strong>

              <span>
                Parque principal de San Rafael
              </span>

            </div>


            <div>

              <strong>
                🏡 Destino
              </strong>

              <span>
                {alojamiento.nombre}
              </span>

            </div>


            <div>

              <strong>
                🚗 Distancia
              </strong>

              <span>
                Por calcular
              </span>

            </div>


            <div>

              <strong>
                ⏱️ Tiempo aproximado
              </strong>

              <span>
                Por calcular
              </span>

            </div>

          </div>


          {/* =================================================
              BOTÓN GOOGLE MAPS
          ================================================= */}

          {alojamiento.mapa_url && (

            <a
              href={alojamiento.mapa_url}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton-primario boton-ruta"
            >
              Abrir ubicación en Google Maps
            </a>

          )}

        </div>


        {/* =================================================
            MAPA
        ================================================= */}

        <div className="mapa-contenedor">

          <iframe
            title={`Ubicación de ${alojamiento.nombre}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              alojamiento.nombre + " San Rafael Antioquia"
            )}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>

      </section>

    </main>
  );
}

/* ============================================================
   GALERÍA DE ALOJAMIENTO
============================================================ */

function GaleriaAlojamiento({ alojamiento }) {
  const fotos = obtenerFotos(alojamiento);

  const [fotoPrincipal, setFotoPrincipal] = useState(
    fotos.length > 0 ? fotos[0] : null
  );

  useEffect(() => {
    setFotoPrincipal(fotos.length > 0 ? fotos[0] : null);
  }, [alojamiento.id]);

  return (
    <section className="galeria-ficha">

      {/* =====================================================
          FOTO PRINCIPAL
      ===================================================== */}

      <div className="foto-principal">

        {fotoPrincipal ? (
          <img
            src={fotoPrincipal}
            alt={`Fotografía de ${alojamiento.nombre}`}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#e5e7eb",
              fontSize: "4rem",
            }}
          >
            🏡
          </div>
        )}

      </div>


      {/* =====================================================
          TODAS LAS MINIATURAS
      ===================================================== */}

      {fotos.length > 1 && (
        <div className="fotos-secundarias">

          {fotos.map((foto, index) => (

            <button
              key={foto}
              type="button"
              onClick={() => setFotoPrincipal(foto)}
              className={`miniatura ${
                foto === fotoPrincipal
                  ? "miniatura-activa"
                  : ""
              }`}
            >

              <img
                src={foto}
                alt={`${alojamiento.nombre} - fotografía ${
                  index + 1
                }`}
              />

            </button>

          ))}

        </div>
      )}

    </section>
  );
}

/* ============================================================
   OBTENER FOTOS
============================================================ */

function obtenerFotos(alojamiento) {
  const nombre = alojamiento.nombre
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  /* ==========================================================
     YAKUTOUR
  ========================================================== */

  if (nombre?.includes("yakutour")) {
    return [
      "/alojamientos/yakutour/yakutour-1.jpeg",
      "/alojamientos/yakutour/yakutour-2.jpeg",
      "/alojamientos/yakutour/yakutour-3.jpeg",
      "/alojamientos/yakutour/yakutour-4.jpeg",
      "/alojamientos/yakutour/yakutour-5.jpg",
      "/alojamientos/yakutour/yakutour-6.jpg",
    ];
  }

  /* ==========================================================
     CUEVA DE MORGAN
  ========================================================== */

  if (nombre?.includes("cueva de morgan")) {
    return [
      "/alojamientos/cueva-de-morgan/cueva-de-morgan-1.jpg",
      "/alojamientos/cueva-de-morgan/cueva-de-morgan-2.jpg",
      "/alojamientos/cueva-de-morgan/cueva-de-morgan-3.jpg",
      "/alojamientos/cueva-de-morgan/cueva-de-morgan-4.jpg",
      "/alojamientos/cueva-de-morgan/cueva-de-morgan-5.jpg",
      "/alojamientos/cueva-de-morgan/cueva-de-morgan-6.jpg",
    ];
  }

  /* ==========================================================
     OTROS ALOJAMIENTOS
  ========================================================== */

  if (alojamiento.imagen_url) {
    return [alojamiento.imagen_url];
  }

  return [];
}