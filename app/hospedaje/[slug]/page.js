"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HospedajeDetallePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [alojamiento, setAlojamiento] = useState(null);
  const [alojamientos, setAlojamientos] = useState([]);

  const [indiceActual, setIndiceActual] = useState(-1);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  /* =====================================================
     CARGAR ALOJAMIENTO Y LISTADO
  ===================================================== */

  useEffect(() => {
    if (!slug) return;

    async function cargarAlojamiento() {
      setCargando(true);
      setError(null);

      /* =================================================
         ALOJAMIENTO ACTUAL
      ================================================= */

      const {
        data: alojamientoActual,
        error: errorAlojamiento,
      } = await supabase
        .from("hoteles")
        .select("*")
        .eq("slug", slug)
        .eq("activo", true)
        .maybeSingle();

      /* =================================================
         LISTADO PARA NAVEGACIÓN
      ================================================= */

      const {
        data: listaAlojamientos,
        error: errorLista,
      } = await supabase
        .from("hoteles")
        .select(`
          id,
          nombre,
          slug,
          asociado_red
        `)
        .eq("activo", true);

      /* =================================================
         VALIDAR ALOJAMIENTO
      ================================================= */

      if (errorAlojamiento) {
        console.error(errorAlojamiento);

        setError(
          "No fue posible cargar este alojamiento."
        );

        setCargando(false);
        return;
      }

      if (!alojamientoActual) {
        setError(
          "No encontramos este alojamiento."
        );

        setCargando(false);
        return;
      }

      setAlojamiento(alojamientoActual);

      /* =================================================
         ORDEN DE LOS ALOJAMIENTOS

         1. Asociados primero
         2. Después los demás
         3. Cada grupo en orden alfabético
      ================================================= */

      if (errorLista) {
        console.error(errorLista);

        setAlojamientos([]);
        setIndiceActual(-1);
      } else {

        const listaOrdenada = (
          listaAlojamientos || []
        ).sort((a, b) => {

          if (a.asociado_red !== b.asociado_red) {
            return a.asociado_red ? -1 : 1;
          }

          return a.nombre.localeCompare(
            b.nombre,
            "es",
            {
              sensitivity: "base",
            }
          );
        });

        setAlojamientos(listaOrdenada);

        const posicionActual =
          listaOrdenada.findIndex(
            (item) => item.slug === slug
          );

        setIndiceActual(posicionActual);
      }

      setCargando(false);
    }

    cargarAlojamiento();

  }, [slug]);


  /* =====================================================
     IR AL ALOJAMIENTO ANTERIOR
  ===================================================== */

  function irAnterior() {

    if (indiceActual <= 0) {
      return;
    }

    const anterior =
      alojamientos[indiceActual - 1];

    if (anterior?.slug) {
      router.push(
        `/hospedaje/${anterior.slug}`
      );
    }
  }


  /* =====================================================
     IR AL SIGUIENTE ALOJAMIENTO
  ===================================================== */

  function irSiguiente() {

    if (
      indiceActual < 0 ||
      indiceActual >= alojamientos.length - 1
    ) {
      return;
    }

    const siguiente =
      alojamientos[indiceActual + 1];

    if (siguiente?.slug) {
      router.push(
        `/hospedaje/${siguiente.slug}`
      );
    }
  }


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

        <h1>
          Alojamiento no encontrado
        </h1>

        <p>
          {error ||
            "No encontramos la información solicitada."}
        </p>

      </main>
    );
  }


  /* =====================================================
     ESTADO DE NAVEGACIÓN
  ===================================================== */

  const hayAnterior =
    indiceActual > 0;

  const haySiguiente =
    indiceActual >= 0 &&
    indiceActual < alojamientos.length - 1;


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
            {alojamiento.tipo_alojamiento ||
              "Alojamiento"}
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
          GALERÍA CON BOTONES LATERALES

          IMPORTANTE:
          Los botones están en posición absoluta.
          NO modifican el tamaño ni la distribución
          de la galería.
      ================================================= */}

      <div
        style={{
          position: "relative",
          width: "100%",
          marginBottom: "2.5rem",
        }}
      >

        {/* =================================================
            BOTÓN ANTERIOR
        ================================================= */}

        <button
          type="button"
          onClick={irAnterior}
          disabled={!hayAnterior}
          title={
            hayAnterior
              ? "Alojamiento anterior"
              : "No hay alojamiento anterior"
          }
          aria-label="Alojamiento anterior"
          style={{
            position: "absolute",
            left: "-75px",
            top: "50%",
            transform: "translateY(-50%)",

            width: "52px",
            height: "52px",

            borderRadius: "50%",

            border:
              "1px solid rgba(31, 77, 58, 0.20)",

            background:
              hayAnterior
                ? "#ffffff"
                : "#eeeeee",

            color:
              hayAnterior
                ? "#1f4d3a"
                : "#9ca3af",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            fontSize: "1.7rem",

            cursor:
              hayAnterior
                ? "pointer"
                : "not-allowed",

            opacity:
              hayAnterior
                ? 1
                : 0.45,

            boxShadow:
              "0 4px 12px rgba(0,0,0,0.10)",

            zIndex: 5,

            transition:
              "all 0.2s ease",
          }}
        >
          ←
        </button>


        {/* =================================================
            GALERÍA ORIGINAL

            NO SE MODIFICA
        ================================================= */}

        <GaleriaAlojamiento
          alojamiento={alojamiento}
        />


        {/* =================================================
            BOTÓN SIGUIENTE
        ================================================= */}

        <button
          type="button"
          onClick={irSiguiente}
          disabled={!haySiguiente}
          title={
            haySiguiente
              ? "Siguiente alojamiento"
              : "No hay siguiente alojamiento"
          }
          aria-label="Siguiente alojamiento"
          style={{
            position: "absolute",
            right: "-75px",
            top: "50%",
            transform: "translateY(-50%)",

            width: "52px",
            height: "52px",

            borderRadius: "50%",

            border: "none",

            background:
              haySiguiente
                ? "#c99a2e"
                : "#eeeeee",

            color:
              haySiguiente
                ? "#ffffff"
                : "#9ca3af",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            fontSize: "1.7rem",

            cursor:
              haySiguiente
                ? "pointer"
                : "not-allowed",

            opacity:
              haySiguiente
                ? 1
                : 0.45,

            boxShadow:
              "0 4px 12px rgba(0,0,0,0.10)",

            zIndex: 5,

            transition:
              "all 0.2s ease",
          }}
        >
          →
        </button>

      </div>


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
                  Hasta{" "}
                  {alojamiento.capacidad_personas}{" "}
                  personas
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
            Contacta con{" "}
            {alojamiento.nombre}
          </h3>

          <p>
            Consulta directamente con el alojamiento
            sobre disponibilidad, precios y experiencias.
          </p>


          {/* =================================================
              INSTAGRAM
          ================================================= */}

          {alojamiento.instagram_url && (

            <a
              href={
                alojamiento.instagram_url
              }
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
              href={
                alojamiento.whatsapp_url
              }
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
              href={
                alojamiento.sitio_web_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="boton-contacto boton-mapa"
            >
              🌐 Sitio web
            </a>

          ) : (

            <div
              className="sitio-web-no-disponible"
            >

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
              href={
                alojamiento.mapa_url
              }
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
            Encuentra{" "}
            {alojamiento.nombre}
          </h2>

          <p>
            Consulta la ubicación y planifica tu
            recorrido desde el casco urbano de San Rafael.
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
              href={
                alojamiento.mapa_url
              }
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
            title={
              `Ubicación de ${alojamiento.nombre}`
            }
            src={
              `https://www.google.com/maps?q=${encodeURIComponent(
                alojamiento.nombre +
                " San Rafael Antioquia"
              )}&output=embed`
            }
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

  const [fotoPrincipal, setFotoPrincipal] =
    useState(
      fotos.length > 0
        ? fotos[0]
        : null
    );


  useEffect(() => {

    setFotoPrincipal(
      fotos.length > 0
        ? fotos[0]
        : null
    );

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
            alt={
              `Fotografía de ${alojamiento.nombre}`
            }
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

          {fotos.map(
            (foto, index) => (

              <button
                key={foto}
                type="button"
                onClick={() =>
                  setFotoPrincipal(foto)
                }
                className={
                  `miniatura ${
                    foto === fotoPrincipal
                      ? "miniatura-activa"
                      : ""
                  }`
                }
              >

                <img
                  src={foto}
                  alt={
                    `${alojamiento.nombre} - fotografía ${
                      index + 1
                    }`
                  }
                />

              </button>

            )
          )}

        </div>

      )}

    </section>
  );
}


/* ============================================================
   OBTENER FOTOS
============================================================ */

function obtenerFotos(alojamiento) {

  const nombre =
    alojamiento.nombre
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");


  /* ==========================================================
     YAKUTOUR
  ========================================================== */

  if (
    nombre?.includes("yakutour")
  ) {

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

  if (
    nombre?.includes("cueva de morgan")
  ) {

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

  if (
    alojamiento.imagen_url
  ) {

    return [
      alojamiento.imagen_url
    ];

  }

  return [];
}