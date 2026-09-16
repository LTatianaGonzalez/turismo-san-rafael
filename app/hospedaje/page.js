"use client";

import { useState } from "react";

const fotosYakutour = [
  "/alojamientos/yakutour/yakutour-1.jpeg",
  "/alojamientos/yakutour/yakutour-2.jpeg",
  "/alojamientos/yakutour/yakutour-3.jpeg",
  "/alojamientos/yakutour/yakutour-4.jpeg",
  "/alojamientos/yakutour/yakutour-5.jpg",
  "/alojamientos/yakutour/yakutour-6.jpg",
];

const whatsappYakutour =
  "https://api.whatsapp.com/send?phone=573153058261&text=Hola!%20Gracias%20por%20comunicarte%20con%20Yakutour.%20En%20qu%C3%A9%20puedo%20ayudarte%3F";

export default function HospedajeYakutourPage() {
  const [fotoPrincipal, setFotoPrincipal] = useState(fotosYakutour[0]);

  return (
    <main
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "40px 20px 70px",
        color: "#222",
      }}
    >
      {/* ENCABEZADO */}
      <section style={{ marginBottom: "30px" }}>
        <span
          style={{
            display: "inline-block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "700",
            color: "#8b6a19",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Alojamiento rural
        </span>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "42px",
            lineHeight: "1.1",
          }}
        >
          Hostería Yakutour
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "17px",
            color: "#666",
          }}
        >
          📍 San Rafael, Antioquia
        </p>
      </section>

      {/* GALERÍA */}
      <section style={{ marginBottom: "55px" }}>
        {/* FOTO PRINCIPAL */}
        <div
          style={{
            width: "100%",
            height: "520px",
            overflow: "hidden",
            borderRadius: "18px",
            background: "#eeeeee",
            marginBottom: "18px",
          }}
        >
          <img
            src={fotoPrincipal}
            alt="Hostería Yakutour"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* MINIATURAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "12px",
          }}
        >
          {fotosYakutour.map((foto, index) => (
            <button
              key={foto}
              type="button"
              onClick={() => setFotoPrincipal(foto)}
              style={{
                padding: 0,
                border:
                  foto === fotoPrincipal
                    ? "4px solid #c99624"
                    : "2px solid transparent",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#eeeeee",
                cursor: "pointer",
                height: "110px",
              }}
            >
              <img
                src={foto}
                alt={`Hostería Yakutour - fotografía ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* CONTENIDO */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 340px",
          gap: "45px",
          alignItems: "start",
          marginBottom: "60px",
        }}
      >
        {/* DESCRIPCIÓN */}
        <div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#8b6a19",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Turismo y naturaleza
          </span>

          <h2
            style={{
              fontSize: "30px",
              margin: "10px 0 20px",
            }}
          >
            Una experiencia para conectar con San Rafael
          </h2>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "#555",
            }}
          >
            Yakutour es una opción de alojamiento y turismo rural
            ubicada en San Rafael, Antioquia. Su entorno permite
            disfrutar de la naturaleza, descansar y vivir experiencias
            relacionadas con el territorio.
          </p>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "#555",
            }}
          >
            Consulta directamente con Yakutour la disponibilidad,
            tarifas y actividades disponibles para las fechas de
            tu visita.
          </p>

          {/* CARACTERÍSTICAS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "#f5f5f5",
              }}
            >
              <div style={{ fontSize: "28px" }}>🌿</div>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  marginBottom: "5px",
                }}
              >
                Naturaleza
              </strong>

              <small style={{ color: "#666" }}>
                Entorno rural
              </small>
            </div>

            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "#f5f5f5",
              }}
            >
              <div style={{ fontSize: "28px" }}>🏡</div>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  marginBottom: "5px",
                }}
              >
                Alojamiento
              </strong>

              <small style={{ color: "#666" }}>
                Hospedaje
              </small>
            </div>

            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "#f5f5f5",
              }}
            >
              <div style={{ fontSize: "28px" }}>💧</div>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  marginBottom: "5px",
                }}
              >
                Experiencias
              </strong>

              <small style={{ color: "#666" }}>
                Turismo de naturaleza
              </small>
            </div>
          </div>
        </div>

        {/* CONTACTO */}
        <aside
          style={{
            padding: "28px",
            borderRadius: "18px",
            background: "#f7f7f7",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              fontSize: "24px",
            }}
          >
            Contacta con Yakutour
          </h3>

          <p
            style={{
              lineHeight: "1.6",
              color: "#666",
              marginBottom: "25px",
            }}
          >
            Consulta directamente con el alojamiento sobre
            disponibilidad, precios y experiencias.
          </p>

          <a
            href="https://www.instagram.com/hosteria_yakutour/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "14px 18px",
              marginBottom: "12px",
              borderRadius: "10px",
              textDecoration: "none",
              textAlign: "center",
              background: "#222",
              color: "white",
              fontWeight: "600",
            }}
          >
            📸 Instagram
          </a>

          <a
            href={whatsappYakutour}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "14px 18px",
              marginBottom: "12px",
              borderRadius: "10px",
              textDecoration: "none",
              textAlign: "center",
              background: "#25D366",
              color: "white",
              fontWeight: "600",
            }}
          >
            💬 WhatsApp
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Yakutour+San+Rafael+Antioquia"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "14px 18px",
              borderRadius: "10px",
              textDecoration: "none",
              textAlign: "center",
              background: "#e5e5e5",
              color: "#222",
              fontWeight: "600",
            }}
          >
            🗺️ Cómo llegar
          </a>

          <div
            style={{
              borderTop: "1px solid #ddd",
              marginTop: "20px",
              paddingTop: "18px",
            }}
          >
            <strong>🌐 Sitio web</strong>

            <small
              style={{
                display: "block",
                marginTop: "6px",
                color: "#777",
              }}
            >
              Información próximamente disponible
            </small>
          </div>
        </aside>
      </section>

      {/* UBICACIÓN */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "stretch",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "700",
              color: "#8b6a19",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Ubicación
          </span>

          <h2
            style={{
              fontSize: "30px",
              margin: "10px 0 15px",
            }}
          >
            Encuentra Yakutour
          </h2>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.7",
              color: "#555",
            }}
          >
            Consulta la ubicación de Yakutour y planifica tu
            recorrido desde el casco urbano de San Rafael.
          </p>

          <div
            style={{
              marginTop: "25px",
              display: "grid",
              gap: "15px",
            }}
          >
            <div>
              <strong>📍 Origen</strong>
              <span
                style={{
                  display: "block",
                  color: "#666",
                  marginTop: "4px",
                }}
              >
                Parque principal de San Rafael
              </span>
            </div>

            <div>
              <strong>🏡 Destino</strong>
              <span
                style={{
                  display: "block",
                  color: "#666",
                  marginTop: "4px",
                }}
              >
                Hostería Yakutour
              </span>
            </div>

            <div>
              <strong>🚗 Distancia</strong>
              <span
                style={{
                  display: "block",
                  color: "#666",
                  marginTop: "4px",
                }}
              >
                Por calcular
              </span>
            </div>

            <div>
              <strong>⏱️ Tiempo aproximado</strong>
              <span
                style={{
                  display: "block",
                  color: "#666",
                  marginTop: "4px",
                }}
              >
                Por calcular
              </span>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Yakutour+San+Rafael+Antioquia"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "25px",
              padding: "14px 22px",
              borderRadius: "10px",
              background: "#222",
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Abrir ubicación en Google Maps
          </a>
        </div>

        {/* MAPA */}
        <div
          style={{
            minHeight: "400px",
            borderRadius: "18px",
            overflow: "hidden",
            background: "#eee",
          }}
        >
          <iframe
            title="Ubicación de Yakutour en San Rafael"
            src="https://www.google.com/maps?q=Yakutour%20San%20Rafael%20Antioquia&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "400px",
              border: 0,
              display: "block",
            }}
          />
        </div>
      </section>

      {/* RESPONSIVE */}
      <style jsx>{`
        @media (max-width: 800px) {
          main {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }

          h1 {
            font-size: 34px !important;
          }

          section {
            grid-template-columns: 1fr !important;
          }

          section:first-of-type {
            display: block !important;
          }
        }

        @media (max-width: 600px) {
          section:nth-of-type(2) > div:first-child {
            height: 350px !important;
          }

          section:nth-of-type(2) > div:nth-child(2) {
            grid-template-columns: repeat(3, 1fr) !important;
          }

          section:nth-of-type(2) > div:nth-child(2) button {
            height: 90px !important;
          }
        }

        @media (max-width: 450px) {
          section:nth-of-type(2) > div:first-child {
            height: 280px !important;
          }

          section:nth-of-type(2) > div:nth-child(2) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </main>
  );
}