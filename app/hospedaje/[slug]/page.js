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

  useEffect(() => {
    if (!slug) return;

    async function cargarAlojamiento() {
      setCargando(true);
      setError(null);

      const {
        data: alojamientoActual,
        error: errorAlojamiento,
      } = await supabase
        .from("hoteles")
        .select(`
          id,
          creado_en,
          nombre,
          descripcion,
          activo,
          instagram_url,
          whatsapp_url,
          latitud,
          longitud,
          destacado,
          estado_verificacion,
          fecha_ultima_verificacion,
          slug,
          tipo_alojamiento,
          sitio_web_url,
          mapa_url,
          descripcion_corta,
          asociado_red
        `)
        .eq("slug", slug)
        .eq("activo", true)
        .maybeSingle();

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

      if (errorAlojamiento) {
        console.error(
          "Error cargando alojamiento:",
          errorAlojamiento
        );

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

      if (errorLista) {
        console.error(
          "Error cargando lista de alojamientos:",
          errorLista
        );

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

  if (cargando) {
    return (
      <main className="ficha-alojamiento">
        <p>Cargando alojamiento...</p>
      </main>
    );
  }

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

  const hayAnterior =
    indiceActual > 0;

  const haySiguiente =
    indiceActual >= 0 &&
    indiceActual < alojamientos.length - 1;

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

      <div
        style={{
          position: "relative",
          width: "100%",
          marginBottom: "2.5rem",
        }}
      >

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

        <GaleriaAlojamiento
          alojamiento={alojamiento}
        />

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

      <section className="ficha-contenido">

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

        <aside className="ficha-contacto">

          <h3>
            Contacta con{" "}
            {alojamiento.nombre}
          </h3>

          <p>
            Consulta directamente con el alojamiento
            sobre disponibilidad, precios y experiencias.
          </p>

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
     AGUA DULCE
  ========================================================== */

  if (nombre?.includes("agua dulce")) {

    return [
      "/alojamientos/agua-dulce/agua-dulce-1.png",
      "/alojamientos/agua-dulce/agua-dulce-2.jpg",
      "/alojamientos/agua-dulce/agua-dulce-3.jpg",
      "/alojamientos/agua-dulce/agua-dulce-4.jpg",
      "/alojamientos/agua-dulce/agua-dulce-5.jpg",
      "/alojamientos/agua-dulce/agua-dulce-6.jpg",
    ];
  }


  /* ==========================================================
     CABAÑAS RIOVIVO
  ========================================================== */

  if (nombre?.includes("cabanas riovivo")) {

    return [
      "/alojamientos/rio-vivo/rio-vivo-1.jpg",
      "/alojamientos/rio-vivo/rio-vivo-2.jpg",
      "/alojamientos/rio-vivo/rio-vivo-3.jpg",
      "/alojamientos/rio-vivo/rio-vivo-4.jpg",
      "/alojamientos/rio-vivo/rio-vivo-5.jpg",
      "/alojamientos/rio-vivo/rio-vivo-6.png",
    ];
  }


  /* ==========================================================
     CON OLOR A CACAO
  ========================================================== */

  if (nombre?.includes("con olor a cacao")) {

    return [
      "/alojamientos/con-olor-a-cacao/con-olor-a-cacao-1.jpg",
      "/alojamientos/con-olor-a-cacao/con-olor-a-cacao-2.png",
      "/alojamientos/con-olor-a-cacao/con-olor-a-cacao-3.jpg",
      "/alojamientos/con-olor-a-cacao/con-olor-a-cacao-4.jpg",
      "/alojamientos/con-olor-a-cacao/con-olor-a-cacao-5.jpg",
      "/alojamientos/con-olor-a-cacao/con-olor-a-cacao-6.jpg",
    ];
  }


  /* ==========================================================
     ECOLODGE RAICES
  ========================================================== */

  if (nombre?.includes("ecolodge raices")) {

    return [
      "/alojamientos/ecolodge-raices/raices-1.jpg",
      "/alojamientos/ecolodge-raices/raices-2.png",
      "/alojamientos/ecolodge-raices/raices-3.jpg",
      "/alojamientos/ecolodge-raices/raices-4.png",
      "/alojamientos/ecolodge-raices/raices-5.png",
      "/alojamientos/ecolodge-raices/raices-6.png",
    ];
  }


  /* ==========================================================
     PALAGUA LODGE
  ========================================================== */

  if (nombre?.includes("palagua lodge")) {

    return [
      "/alojamientos/palagua-lodge/palagua-1.png",
      "/alojamientos/palagua-lodge/palagua-2.png",
      "/alojamientos/palagua-lodge/palagua-3.png",
      "/alojamientos/palagua-lodge/palagua-4.png",
      "/alojamientos/palagua-lodge/palagua-5.jpg",
      "/alojamientos/palagua-lodge/palagua-6.png",
    ];
  }


  /* ==========================================================
     ECOS DEL RIO
  ========================================================== */

  if (nombre?.includes("ecos del rio")) {

    return [
      "/alojamientos/ecos-del-rio/ecos-del-rio-1.jpg",
      "/alojamientos/ecos-del-rio/ecos-del-rio-2.jpg",
      "/alojamientos/ecos-del-rio/ecos-del-rio-3.jpg",
      "/alojamientos/ecos-del-rio/ecos-del-rio-4.jpg",
      "/alojamientos/ecos-del-rio/ecos-del-rio-5.jpg",
      "/alojamientos/ecos-del-rio/ecos-del-rio-6.jpg",
    ];
  }


  /* ==========================================================
     SIN FOTOS
  ========================================================== */

  return [];
}