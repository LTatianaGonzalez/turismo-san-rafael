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
          activo,
          asociado_red
        `)
        .eq("activo", true);

      if (error) {
        console.error(error);
        setError("No fue posible cargar los alojamientos.");
      } else {
        /*
         * ORDEN:
         * 1. Asociados a la Red primero
         * 2. Dentro de cada grupo, orden alfabético
         */
        const alojamientosOrdenados = (data || []).sort((a, b) => {
          if (a.asociado_red !== b.asociado_red) {
            return a.asociado_red ? -1 : 1;
          }

          return a.nombre.localeCompare(
            b.nombre,
            "es",
            { sensitivity: "base" }
          );
        });

        setAlojamientos(alojamientosOrdenados);
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

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <section className="pagina__intro">

        <span className="eyebrow">
          Dónde hospedarte
        </span>

        <h1>
          Alojamientos en San Rafael
        </h1>

        <p>
          Encuentra alojamientos rurales y urbanos para disfrutar
          de San Rafael. Conoce cada lugar, descubre sus características
          y contacta directamente con el prestador.
        </p>

      </section>


      {/* =====================================================
          CONTADOR
      ===================================================== */}

      <div style={{ marginBottom: "1.5rem" }}>

        <strong>
          Alojamientos registrados ({alojamientos.length})
        </strong>

      </div>


      {/* =====================================================
          LISTADO
      ===================================================== */}

      {alojamientos.length === 0 ? (

        <div className="tarjeta">

          <h2>
            Próximamente
          </h2>

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
   MAPA DE LOGOS
============================================================ */

function obtenerLogo(alojamiento) {

  const slug = alojamiento.slug;

  const logos = {

    "cabana-el-arenal":
      "/logo/logo-cabana-el-arenal.jpg",

    "reserva-natural-origen":
      "/logo/logo-reserva-natural-origen.png",

    "con-olor-a-cacao":
      "/logo/logo-con-olor-a-cacao.jpg",

    "agua-dulce":
      "/logo/logo-agua-dulce.jpg",

    "finca-el-toche":
      "/logo/logo-finca-el-toche.jpg",

    "lagom-apartamentos":
      "/logo/logo-lagom-apartamentos.jpg",

    "spa-todos":
      "/logo/logo-spa-todos.jpg",

    "cabanas-riovivo":
      "/logo/logo-riovivo.jpg",

    "cabana-el-arenal":
      "/logo/logo-cabaña-el-arenal.jpg",

    "casa-verde":
      "/logo/logo-hotel-kreata.jpg",


    "hostal-vista-hermosa":
      "/logo/logo-hostal-vista-hermosa.jpg",

    "santa-maria-del-rio":
      "/logo/logo-santa-maria-del-rio.jpg",

    "finca-el-palmar":
      "/logo/logo-finca-el-palmar.jpg",

    "finca-la-chocha":
      "/logo/logo-finca-la-chocha.jpg",

    "cabana-la-villa":
      "/logo/logo-cabaña-la-villa.jpg",

    "casa-clandestina-campestre":
      "/logo/logo-casa-clandestina.jpg",

    "hotel-club-paradise":
      "/logo/logo-club-paradise.jpg",

    "la-cueva-de-morgan":
      "/logo/logo-cueva-de-morgan.jpg",

    "despertar-con-las-aves":
      "/logo/logo-despertar-con-las-aves.jpg",

    "ecolodge-aracari":
      "/logo/logo-ecolodge-aracari.jpg",

    "ecolodge-raices":
      "/logo/logo-ecolodge-raices.jpg",

    "ecos-del-rio":
      "/logo/logo-ecos-del-rio.jpg",

    "escape-natural":
      "/logo/logo-escape-natural.jpg",

    "finca-hotel-el-trocadero":
      "/logo/logo-finca-el-trocadero.jpg",

    "gran-hotel-san-rafael":
      "/logo/logo-gran-hotel.jpg",

    "hacienda-popalito":
      "/logo/logo-hacienda-popalito.jpg",

    "hotel-la-roca":
      "/logo/logo-hotel-la-roca.jpg",

    "indigo-cowork":
      "/logo/logo-indigo.jpg",

    "la-perla-negra-eco-lodge":
      "/logo/logo-la-perla-negra.png",

    "la-posada-de-las-aves":
      "/logo/logo-la-posada-de-las-aves.jpg",

    "manawa":
      "/logo/logo-manawa.jpg",

    "maracuya-hostel":
      "/logo/logo-maracuya-hostal.jpg",

    "hospedaje-naturaleza-viva":
      "/logo/logo-naturaleza-viva.jpg",

    "nomada-hospedaje":
      "/logo/logo-nómada-hospedaje.jpg",

    "palagua-lodge":
      "/logo/logo-palagua.jpg",

    "piedra-montada":
      "/logo/logo-piedra-montada.jpg",

    "ritmo-del-rio":
      "/logo/logo-ritmo-del-rio.png",

    "eco-hostal-tierra-de-agua-y-fuego":
      "/logo/logo-tierra-de-agua-fuego.jpg",

    "zafra":
      "/logo/logo-zafra.png",

    "hotel-magia-natural":
      "/logo/logo-magia-natural.png",

    "hospedaje-casa-luan":
      "/logo/logo-casa-luan.png",

    "estacion-paraiso-de-dantas":
      "/logo/logo-paraiso-de-dantas.png",

    "hosteria-yakutour":
      "/logo/logo-yakutour.jpg",

    "agua-de-luna":
      "/logo/logo-agua-de-luna.jpg",

    "ecohotel-rio-de-oro":
      "/logo/logo-rio-de-oro.jpg",

    "eco-finca-la-sonada":
      "/logo/logo-la-sonada.jpg",

    "embajada-century-fox":
      "/logo/logo-embajada-century-fox.jpg",

  };

  return logos[slug] || null;
}


/* ============================================================
   TARJETA DE ALOJAMIENTO
============================================================ */

function FichaAlojamiento({ alojamiento }) {

  const logo = obtenerLogo(alojamiento);

  const tipo =
    alojamiento.tipo_alojamiento ||
    "Alojamiento";

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
          LOGO
      ===================================================== */}

      <div
        style={{
          width: "100%",
          height: 250,
          background: "#ffffff",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >

        {logo ? (

          <img
            src={logo}
            alt={`Logo de ${alojamiento.nombre}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
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

            <div
              style={{
                fontSize: "3rem",
              }}
            >
              🏡
            </div>

            <p>
              Logo próximamente
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


        {/* =================================================
            BOTÓN
        ================================================= */}

        <div
          style={{
            marginTop: "auto",
          }}
        >

          <a
            href={`/hospedaje/${alojamiento.slug}`}
            className="boton boton-primario"
          >
            Ver alojamiento
          </a>

        </div>

      </div>

    </article>

  );
}