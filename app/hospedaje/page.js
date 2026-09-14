"use client";

import { useState } from "react";

const fotosYakutour = [
  "/alojamientos/yakutour/yakutour-1.jpeg",
  "/alojamientos/yakutour/yakutour-2.jpeg",
  "/alojamientos/yakutour/yakutour-3.jpeg",
];

const whatsappYakutour =
  "https://api.whatsapp.com/send?phone=573153058261&text=Hola!%20Gracias%20por%20comunicarte%20con%20Yakutour.%20En%20qu%C3%A9%20puedo%20ayudarte%3F";

export default function HospedajePage() {
  const [fotoPrincipal, setFotoPrincipal] = useState(fotosYakutour[0]);

  return (
    <main className="ficha-alojamiento">

      {/* ENCABEZADO */}
      <section className="ficha-encabezado">
        <div>
          <span className="eyebrow">Alojamiento rural</span>

          <h1>Yakutour</h1>

          <p className="ficha-ubicacion">
            📍 San Rafael, Antioquia
          </p>
        </div>
      </section>

      {/* GALERÍA DE FOTOGRAFÍAS */}
      <section className="galeria-ficha">

        <div className="foto-principal">
          <img
            src={fotoPrincipal}
            alt="Yakutour - alojamiento rural en San Rafael"
          />
        </div>

        <div className="fotos-secundarias">

          {fotosYakutour.map((foto, index) => (
            <button
              key={foto}
              type="button"
              onClick={() => setFotoPrincipal(foto)}
              className={`miniatura ${
                foto === fotoPrincipal ? "miniatura-activa" : ""
              }`}
            >
              <img
                src={foto}
                alt={`Yakutour - fotografía ${index + 1}`}
              />
            </button>
          ))}

        </div>

      </section>

      {/* INFORMACIÓN PRINCIPAL */}
      <section className="ficha-contenido">

        <div className="ficha-descripcion">

          <span className="eyebrow">
            Turismo y naturaleza
          </span>

          <h2>Una experiencia para conectar con San Rafael</h2>

          <p>
            Yakutour es una opción de alojamiento y turismo rural
            ubicada en San Rafael, Antioquia. Su entorno permite
            disfrutar de la naturaleza, descansar y vivir experiencias
            relacionadas con el territorio.
          </p>

          <p>
            Consulta directamente con Yakutour la disponibilidad,
            tarifas y actividades disponibles para las fechas de
            tu visita.
          </p>

          {/* CARACTERÍSTICAS */}
          <div className="caracteristicas-alojamiento">

            <div className="caracteristica">
              <span>🌿</span>
              <strong>Naturaleza</strong>
              <small>Entorno rural</small>
            </div>

            <div className="caracteristica">
              <span>🏡</span>
              <strong>Alojamiento</strong>
              <small>Hospedaje</small>
            </div>

            <div className="caracteristica">
              <span>💧</span>
              <strong>Experiencias</strong>
              <small>Turismo de naturaleza</small>
            </div>

          </div>

        </div>

        {/* CONTACTO */}
        <aside className="ficha-contacto">

          <h3>Contacta con Yakutour</h3>

          <p>
            Consulta directamente con el alojamiento sobre
            disponibilidad, precios y experiencias.
          </p>

          {/* INSTAGRAM */}
          <a
            href="https://www.instagram.com/hosteria_yakutour/"
            target="_blank"
            rel="noopener noreferrer"
            className="boton-contacto boton-instagram"
          >
            📸 Instagram
          </a>

          {/* WHATSAPP */}
          <a
            href={whatsappYakutour}
            target="_blank"
            rel="noopener noreferrer"
            className="boton-contacto boton-whatsapp"
          >
            💬 WhatsApp
          </a>

          {/* MAPA */}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Yakutour+San+Rafael+Antioquia"
            target="_blank"
            rel="noopener noreferrer"
            className="boton-contacto boton-mapa"
          >
            🗺️ Cómo llegar
          </a>

          {/* SITIO WEB */}
          <div className="sitio-web-no-disponible">
            <span>🌐 Sitio web</span>

            <small>
              Información próximamente disponible
            </small>
          </div>

        </aside>

      </section>

      {/* UBICACIÓN */}
      <section className="ubicacion-ficha">

        <div className="ubicacion-texto">

          <span className="eyebrow">
            Ubicación
          </span>

          <h2>Encuentra Yakutour</h2>

          <p>
            Consulta la ubicación de Yakutour y planifica tu
            recorrido desde el casco urbano de San Rafael.
          </p>

          <div className="datos-ruta">

            <div>
              <strong>📍 Origen</strong>
              <span>Parque principal de San Rafael</span>
            </div>

            <div>
              <strong>🏡 Destino</strong>
              <span>Yakutour</span>
            </div>

            <div>
              <strong>🚗 Distancia</strong>
              <span>Por calcular</span>
            </div>

            <div>
              <strong>⏱️ Tiempo aproximado</strong>
              <span>Por calcular</span>
            </div>

          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Yakutour+San+Rafael+Antioquia"
            target="_blank"
            rel="noopener noreferrer"
            className="boton boton-primario boton-ruta"
          >
            Abrir ubicación en Google Maps
          </a>

        </div>

        {/* MAPA */}
        <div className="mapa-contenedor">

          <iframe
            title="Ubicación de Yakutour en San Rafael"
            src="https://www.google.com/maps?q=Yakutour%20San%20Rafael%20Antioquia&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>

      </section>

    </main>
  );
}