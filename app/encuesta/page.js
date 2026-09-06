"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Estado inicial del formulario. Cada campo corresponde a una columna
// en la tabla "respuestas_encuesta" de Supabase (ver supabase/schema.sql).
const initialForm = {
  tipo_turista: "nacional",
  gasto_promedio: "",
  dias_estadia: "",
  percepcion_seguridad: 3,
  interaccion_comunidad: 3,
  percepcion_ambiental: 3,
  conocimiento_buenas_practicas: 3,
  comentario: "",
};

export default function EncuestaPage() {
  const [form, setForm] = useState(initialForm);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);

    const { error } = await supabase.from("respuestas_encuesta").insert([
      {
        tipo_turista: form.tipo_turista,
        gasto_promedio: Number(form.gasto_promedio),
        dias_estadia: Number(form.dias_estadia),
        percepcion_seguridad: Number(form.percepcion_seguridad),
        interaccion_comunidad: Number(form.interaccion_comunidad),
        percepcion_ambiental: Number(form.percepcion_ambiental),
        conocimiento_buenas_practicas: Number(form.conocimiento_buenas_practicas),
        comentario: form.comentario,
      },
    ]);

    setEnviando(false);

    if (error) {
      console.error(error);
      setMensaje("Ocurrió un error al enviar tu respuesta. Intenta de nuevo.");
    } else {
      setMensaje("¡Gracias por tu respuesta! Nos ayuda mucho a mejorar el turismo local.");
      setForm(initialForm);
    }
  }

  return (
    <section>
      <h1>Encuesta de impacto turístico</h1>
      <p>Tu opinión nos ayuda a mejorar el turismo económico, social y ambiental en San Rafael.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: 500 }}>
        <label>
          Tipo de turista
          <select name="tipo_turista" value={form.tipo_turista} onChange={handleChange}>
            <option value="nacional">Nacional</option>
            <option value="extranjero">Extranjero</option>
          </select>
        </label>

        <label>
          Gasto promedio durante la visita (COP)
          <input
            type="number"
            name="gasto_promedio"
            value={form.gasto_promedio}
            onChange={handleChange}
            required
            min="0"
          />
        </label>

        <label>
          Días de estadía
          <input
            type="number"
            name="dias_estadia"
            value={form.dias_estadia}
            onChange={handleChange}
            required
            min="0"
          />
        </label>

        <label>
          Percepción de seguridad (1 = muy mala, 5 = muy buena)
          <input
            type="range"
            name="percepcion_seguridad"
            min="1"
            max="5"
            value={form.percepcion_seguridad}
            onChange={handleChange}
          />
        </label>

        <label>
          Interacción con la comunidad local (1 a 5)
          <input
            type="range"
            name="interaccion_comunidad"
            min="1"
            max="5"
            value={form.interaccion_comunidad}
            onChange={handleChange}
          />
        </label>

        <label>
          Percepción del estado ambiental de los sitios visitados (1 a 5)
          <input
            type="range"
            name="percepcion_ambiental"
            min="1"
            max="5"
            value={form.percepcion_ambiental}
            onChange={handleChange}
          />
        </label>

        <label>
          Conocimiento de buenas prácticas ambientales (1 a 5)
          <input
            type="range"
            name="conocimiento_buenas_practicas"
            min="1"
            max="5"
            value={form.conocimiento_buenas_practicas}
            onChange={handleChange}
          />
        </label>

        <label>
          Comentario (opcional)
          <textarea
            name="comentario"
            value={form.comentario}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar respuesta"}
        </button>

        {mensaje && <p>{mensaje}</p>}
      </form>
    </section>
  );
}
