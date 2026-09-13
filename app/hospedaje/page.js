"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HospedajePage() {
  const [hoteles, setHoteles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [hotelAbierto, setHotelAbierto] = useState(null);

  useEffect(() => {
    async function cargarHoteles() {
      const { data, error } = await supabase
        .from("hoteles")
        .select("*")
        .eq("activo", true)
        .order("creado_en", { ascending: true });

      if (!error) setHoteles(data);
      setCargando(false);
    }
    cargarHoteles();
  }, []);

  return (
    <section>
      <h1>Dónde hospedarte en San Rafael</h1>
      <p>
        Estas son las opciones de hospedaje de nuestra comunidad. Envía tu solicitud de
        reserva y el hospedaje te confirmará disponibilidad directamente.
      </p>

      {cargando ? (
        <p>Cargando hospedajes...</p>
      ) : hoteles.length === 0 ? (
        <p>Todavía no hay hospedajes registrados. Vuelve pronto.</p>
      ) : (
        <div className="grid-tarjetas">
          {hoteles.map((hotel) => (
            <TarjetaHotel
              key={hotel.id}
              hotel={hotel}
              abierto={hotelAbierto === hotel.id}
              onAbrir={() => setHotelAbierto(hotelAbierto === hotel.id ? null : hotel.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TarjetaHotel({ hotel, abierto, onAbrir }) {
  const [form, setForm] = useState({
    nombre_huesped: "",
    correo_huesped: "",
    telefono_huesped: "",
    fecha_entrada: "",
    fecha_salida: "",
    numero_personas: 1,
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const { error } = await supabase.from("reservas").insert([
      {
        hotel_id: hotel.id,
        nombre_huesped: form.nombre_huesped,
        correo_huesped: form.correo_huesped,
        telefono_huesped: form.telefono_huesped,
        fecha_entrada: form.fecha_entrada,
        fecha_salida: form.fecha_salida,
        numero_personas: Number(form.numero_personas),
      },
    ]);

    setEnviando(false);

    if (error) {
      console.error(error);
      setError("Ocurrió un error al enviar tu solicitud. Intenta de nuevo.");
    } else {
      setEnviado(true);
    }
  }

  return (
    <div className="tarjeta tarjeta--agro">
      <h3>{hotel.nombre}</h3>
      {hotel.descripcion && <p>{hotel.descripcion}</p>}
      <p style={{ fontSize: "0.9rem" }}>
        {hotel.precio_por_noche && <>💰 ${hotel.precio_por_noche} / noche &nbsp;</>}
        {hotel.capacidad_personas && <>👥 hasta {hotel.capacidad_personas} personas</>}
      </p>

      {!abierto && (
        <button className="boton boton-primario" onClick={onAbrir}>
          Solicitar reserva
        </button>
      )}

      {abierto && !enviado && (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.6rem", marginTop: "0.75rem" }}>
          <input
            type="text"
            name="nombre_huesped"
            placeholder="Tu nombre completo"
            value={form.nombre_huesped}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo_huesped"
            placeholder="Tu correo"
            value={form.correo_huesped}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="telefono_huesped"
            placeholder="Tu teléfono"
            value={form.telefono_huesped}
            onChange={handleChange}
          />
          <label style={{ fontSize: "0.8rem" }}>
            Fecha de entrada
            <input
              type="date"
              name="fecha_entrada"
              value={form.fecha_entrada}
              onChange={handleChange}
              required
            />
          </label>
          <label style={{ fontSize: "0.8rem" }}>
            Fecha de salida
            <input
              type="date"
              name="fecha_salida"
              value={form.fecha_salida}
              onChange={handleChange}
              required
            />
          </label>
          <label style={{ fontSize: "0.8rem" }}>
            Número de personas
            <input
              type="number"
              name="numero_personas"
              min="1"
              value={form.numero_personas}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="boton boton-primario" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar solicitud"}
          </button>
          {error && <p style={{ color: "crimson", fontSize: "0.85rem" }}>{error}</p>}
        </form>
      )}

      {enviado && (
        <p style={{ color: "#1F4D3A", fontWeight: 600 }}>
          ¡Solicitud enviada! El hospedaje se pondrá en contacto contigo para confirmar.
        </p>
      )}
    </div>
  );
}
