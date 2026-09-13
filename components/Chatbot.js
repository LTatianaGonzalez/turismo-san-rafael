"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { preguntasFrecuentes } from "@/lib/faqs";

// Quita tildes y pasa a minúsculas, para poder comparar texto sin
// preocuparnos por mayúsculas o acentos escritos distinto.
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const mensajeBienvenida = {
  autor: "bot",
  texto: "¡Hola! Soy el asistente virtual de San Rafael turístico. Elige una pregunta o escribe la tuya:",
};

export default function Chatbot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([mensajeBienvenida]);
  const [texto, setTexto] = useState("");

  // Estado del mini-formulario de "no encontré tu respuesta"
  const [mostrarFormularioAyuda, setMostrarFormularioAyuda] = useState(false);
  const [preguntaSinResponder, setPreguntaSinResponder] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [envioExitoso, setEnvioExitoso] = useState(false);

  function responder(preguntaTexto) {
    const normalizado = normalizar(preguntaTexto);

    const coincidencia = preguntasFrecuentes.find((p) =>
      p.palabrasClave.some((palabra) => normalizado.includes(normalizar(palabra)))
    );

    if (coincidencia) {
      setMensajes((prev) => [
        ...prev,
        { autor: "usuario", texto: preguntaTexto },
        { autor: "bot", texto: coincidencia.respuesta },
      ]);
    } else {
      // No encontramos respuesta: en vez de mandar a un canal en vivo,
      // ofrecemos guardar la pregunta para que la revisen después.
      setMensajes((prev) => [
        ...prev,
        { autor: "usuario", texto: preguntaTexto },
        {
          autor: "bot",
          texto: "No tengo una respuesta exacta para eso todavía. Puedes dejarla registrada y te la respondemos pronto.",
        },
      ]);
      setPreguntaSinResponder(preguntaTexto);
      setMostrarFormularioAyuda(true);
    }
  }

  function handleClicPregunta(pregunta) {
    responder(pregunta.pregunta);
  }

  function handleEnviarTexto(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    responder(texto.trim());
    setTexto("");
  }

  async function handleGuardarPreguntaSinResponder(e) {
    e.preventDefault();

    const { error } = await supabase.from("preguntas_sin_responder").insert([
      {
        pregunta: preguntaSinResponder,
        correo_contacto: correoContacto || null,
      },
    ]);

    if (!error) {
      setEnvioExitoso(true);
      setMostrarFormularioAyuda(false);
      setCorreoContacto("");
      setMensajes((prev) => [
        ...prev,
        { autor: "bot", texto: "¡Listo! Guardamos tu pregunta, gracias por tu paciencia." },
      ]);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {abierto && (
        <div
          style={{
            width: 320,
            height: 460,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          {/* Encabezado */}
          <div style={{ background: "#1F4D3A", color: "white", padding: "0.75rem 1rem" }}>
            <strong>Asistente San Rafael</strong>
          </div>

          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem", display: "flex", flexDirection: "column", gap: 8 }}>
            {mensajes.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.autor === "bot" ? "flex-start" : "flex-end",
                  background: m.autor === "bot" ? "#f3f4f6" : "#1F4D3A",
                  color: m.autor === "bot" ? "#1f2937" : "white",
                  padding: "0.5rem 0.75rem",
                  borderRadius: 10,
                  maxWidth: "85%",
                  fontSize: "0.9rem",
                }}
              >
                {m.texto}
              </div>
            ))}

            {/* Mini-formulario para dejar la pregunta sin responder */}
            {mostrarFormularioAyuda && (
              <form
                onSubmit={handleGuardarPreguntaSinResponder}
                style={{
                  border: "1px dashed #1F4D3A",
                  borderRadius: 8,
                  padding: "0.6rem",
                  display: "grid",
                  gap: 6,
                }}
              >
                <label style={{ fontSize: "0.75rem" }}>
                  Tu correo (opcional, si quieres que te respondamos ahí)
                  <input
                    type="email"
                    value={correoContacto}
                    onChange={(e) => setCorreoContacto(e.target.value)}
                    style={{ width: "100%", padding: "0.3rem", marginTop: 2 }}
                  />
                </label>
                <button
                  type="submit"
                  style={{
                    background: "#1F4D3A",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "0.4rem",
                    cursor: "pointer",
                  }}
                >
                  Guardar mi pregunta
                </button>
              </form>
            )}

            {/* Botones de preguntas frecuentes, siempre visibles al final */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {preguntasFrecuentes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleClicPregunta(p)}
                  style={{
                    textAlign: "left",
                    background: "white",
                    border: "1px solid #1F4D3A",
                    color: "#1F4D3A",
                    borderRadius: 8,
                    padding: "0.4rem 0.6rem",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {p.pregunta}
                </button>
              ))}
            </div>
          </div>

          {/* Input de texto libre */}
          <form onSubmit={handleEnviarTexto} style={{ display: "flex", borderTop: "1px solid #e5e7eb" }}>
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={{ flex: 1, border: "none", padding: "0.6rem", outline: "none" }}
            />
            <button type="submit" style={{ border: "none", background: "#1F4D3A", color: "white", padding: "0 1rem" }}>
              Enviar
            </button>
          </form>
        </div>
      )}

      {/* Botón flotante para abrir/cerrar */}
      <button
        onClick={() => setAbierto((prev) => !prev)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#1F4D3A",
          color: "white",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
        aria-label="Abrir chat de ayuda"
      >
        {abierto ? "✕" : "💬"}
      </button>
    </div>
  );
}


