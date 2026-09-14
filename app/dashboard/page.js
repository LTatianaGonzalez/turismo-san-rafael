"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [session, setSession] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(null);

  const [respuestas, setRespuestas] = useState([]);
  const [preguntasSinResponder, setPreguntasSinResponder] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [tipoTurista, setTipoTurista] = useState("todos");

  const [hoteles, setHoteles] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [nuevoHotel, setNuevoHotel] = useState({
    nombre: "",
    categoria: "Alojamiento rural",
    descripcion: "",
    descripcion_larga: "",
    ubicacion: "",
    instagram_url: "",
    whatsapp_url: "",
    servicios: "",
    imagenes: "",
    indicaciones: "",
    precio_por_noche: "",
    capacidad_personas: "",
  });

  const [guardandoHotel, setGuardandoHotel] = useState(false);
  const [mensajeHotel, setMensajeHotel] = useState(null);
  const [hotelEditando, setHotelEditando] = useState(null);

  /* ============================================================
     SESIÓN
     ============================================================ */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCargandoSesion(false);
    });

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* ============================================================
     CARGAR DATOS
     ============================================================ */

  useEffect(() => {
    if (!session) return;

    async function cargarDatos() {
      setCargandoDatos(true);

      const { data: respuestasData, error: errorRespuestas } =
        await supabase
          .from("respuestas_encuesta")
          .select("*")
          .order("creado_en", { ascending: true });

      if (!errorRespuestas) {
        setRespuestas(respuestasData || []);
      }

      const {
        data: preguntasData,
        error: errorPreguntas,
      } = await supabase
        .from("preguntas_sin_responder")
        .select("*")
        .eq("atendida", false)
        .order("creado_en", { ascending: false });

      if (!errorPreguntas) {
        setPreguntasSinResponder(preguntasData || []);
      }

      await cargarHotelesYReservas();

      setCargandoDatos(false);
    }

    cargarDatos();
  }, [session]);

  async function cargarHotelesYReservas() {
    const {
      data: hotelesData,
      error: errorHoteles,
    } = await supabase
      .from("hoteles")
      .select("*")
      .order("creado_en", { ascending: true });

    if (!errorHoteles) {
      setHoteles(hotelesData || []);
    }

    const {
      data: reservasData,
      error: errorReservas,
    } = await supabase
      .from("reservas")
      .select("*")
      .order("creado_en", { ascending: false });

    if (!errorReservas) {
      setReservas(reservasData || []);
    }
  }

  /* ============================================================
     LOGIN
     ============================================================ */

  async function handleLogin(e) {
    e.preventDefault();

    setErrorLogin(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorLogin("Correo o contraseña incorrectos.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  /* ============================================================
     CHATBOT
     ============================================================ */

  async function marcarComoAtendida(id) {
    const { error } = await supabase
      .from("preguntas_sin_responder")
      .update({ atendida: true })
      .eq("id", id);

    if (!error) {
      setPreguntasSinResponder((prev) =>
        prev.filter((p) => p.id !== id)
      );
    }
  }

  /* ============================================================
     FORMULARIO HOTEL
     ============================================================ */

  function handleHotelChange(e) {
    const { name, value } = e.target;

    setNuevoHotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function prepararNuevoHotel() {
    setHotelEditando(null);

    setNuevoHotel({
      nombre: "",
      categoria: "Alojamiento rural",
      descripcion: "",
      descripcion_larga: "",
      ubicacion: "",
      instagram_url: "",
      whatsapp_url: "",
      servicios: "",
      imagenes: "",
      indicaciones: "",
      precio_por_noche: "",
      capacidad_personas: "",
    });

    setMensajeHotel(null);
  }

  function prepararEdicion(hotel) {
    setHotelEditando(hotel);

    setNuevoHotel({
      nombre: hotel.nombre || "",
      categoria: hotel.categoria || "Alojamiento rural",
      descripcion: hotel.descripcion || "",
      descripcion_larga: hotel.descripcion_larga || "",
      ubicacion: hotel.ubicacion || "",
      instagram_url: hotel.instagram_url || "",
      whatsapp_url: hotel.whatsapp_url || "",
      servicios: Array.isArray(hotel.servicios)
        ? hotel.servicios.join("\n")
        : "",
      imagenes: Array.isArray(hotel.imagenes)
        ? hotel.imagenes.join("\n")
        : "",
      indicaciones: hotel.indicaciones || "",
      precio_por_noche: hotel.precio_por_noche || "",
      capacidad_personas: hotel.capacidad_personas || "",
    });

    setMensajeHotel(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function convertirLista(texto) {
    return texto
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleGuardarHotel(e) {
    e.preventDefault();

    setGuardandoHotel(true);
    setMensajeHotel(null);

    const datosHotel = {
      nombre: nuevoHotel.nombre.trim(),
      categoria: nuevoHotel.categoria,
      descripcion: nuevoHotel.descripcion.trim(),
      descripcion_larga: nuevoHotel.descripcion_larga.trim(),
      ubicacion: nuevoHotel.ubicacion.trim(),
      instagram_url: nuevoHotel.instagram_url.trim() || null,
      whatsapp_url: nuevoHotel.whatsapp_url.trim() || null,
      servicios: convertirLista(nuevoHotel.servicios),
      imagenes: convertirLista(nuevoHotel.imagenes),
      indicaciones: nuevoHotel.indicaciones.trim(),
      precio_por_noche:
        nuevoHotel.precio_por_noche !== ""
          ? Number(nuevoHotel.precio_por_noche)
          : null,
      capacidad_personas:
        nuevoHotel.capacidad_personas !== ""
          ? Number(nuevoHotel.capacidad_personas)
          : null,
    };

    let resultado;

    if (hotelEditando) {
      resultado = await supabase
        .from("hoteles")
        .update(datosHotel)
        .eq("id", hotelEditando.id)
        .select();
    } else {
      resultado = await supabase
        .from("hoteles")
        .insert([datosHotel])
        .select();
    }

    const { data, error } = resultado;

    setGuardandoHotel(false);

    if (error) {
      console.error(error);

      setMensajeHotel(
        `No se pudo guardar el hospedaje: ${error.message}`
      );

      return;
    }

    if (hotelEditando) {
      setHoteles((prev) =>
        prev.map((hotel) =>
          hotel.id === hotelEditando.id
            ? data[0]
            : hotel
        )
      );

      setMensajeHotel("Alojamiento actualizado correctamente.");
    } else {
      setHoteles((prev) => [...prev, ...data]);

      setMensajeHotel("Alojamiento agregado correctamente.");
    }

    prepararNuevoHotel();
  }

  /* ============================================================
     ACTIVAR / DESACTIVAR
     ============================================================ */

  async function cambiarActivoHotel(hotel) {
    const nuevoEstado = !hotel.activo;

    const { error } = await supabase
      .from("hoteles")
      .update({ activo: nuevoEstado })
      .eq("id", hotel.id);

    if (error) {
      console.error(error);
      return;
    }

    setHoteles((prev) =>
      prev.map((h) =>
        h.id === hotel.id
          ? { ...h, activo: nuevoEstado }
          : h
      )
    );
  }

  /* ============================================================
     RESERVAS
     ============================================================ */

  async function actualizarEstadoReserva(id, nuevoEstado) {
    const { error } = await supabase
      .from("reservas")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    if (!error) {
      setReservas((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, estado: nuevoEstado }
            : r
        )
      );
    }
  }

  /* ============================================================
     SESIÓN CARGANDO
     ============================================================ */

  if (cargandoSesion) {
    return <p>Cargando...</p>;
  }

  /* ============================================================
     LOGIN
     ============================================================ */

  if (!session) {
    return (
      <section
        style={{
          maxWidth: 360,
          margin: "3rem auto",
        }}
      >
        <h1>Panel de administración</h1>

        <form
          onSubmit={handleLogin}
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
          <label>
            Correo

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </label>

          <label>
            Contraseña

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </label>

          <button type="submit">
            Ingresar
          </button>

          {errorLogin && (
            <p style={{ color: "crimson" }}>
              {errorLogin}
            </p>
          )}
        </form>
      </section>
    );
  }

  /* ============================================================
     FILTROS ENCUESTA
     ============================================================ */

  const respuestasFiltradas = respuestas.filter((r) => {
    const fechaRespuesta = new Date(r.creado_en);

    if (
      fechaDesde &&
      fechaRespuesta < new Date(fechaDesde)
    ) {
      return false;
    }

    if (fechaHasta) {
      const hasta = new Date(fechaHasta);

      hasta.setDate(hasta.getDate() + 1);

      if (fechaRespuesta >= hasta) {
        return false;
      }
    }

    if (
      tipoTurista !== "todos" &&
      r.tipo_turista !== tipoTurista
    ) {
      return false;
    }

    return true;
  });

  const totalRespuestas =
    respuestasFiltradas.length;

  const promedio = (campo) =>
    totalRespuestas === 0
      ? 0
      : respuestasFiltradas.reduce(
          (suma, r) =>
            suma + Number(r[campo] || 0),
          0
        ) / totalRespuestas;

  const gastoPromedio =
    promedio("gasto_promedio").toFixed(0);

  const diasPromedio =
    promedio("dias_estadia").toFixed(1);

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <section>

      {/* ENCABEZADO */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="eyebrow">
            Administración
          </span>

          <h1>Panel de administración</h1>
        </div>

        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* ======================================================
          ENCUESTAS
          ====================================================== */}

      <hr
        style={{
          margin: "2rem 0",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
      />

      <h2>Indicadores de encuesta</h2>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          margin: "1rem 0",
        }}
      >
        <label>
          Desde
          <br />
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) =>
              setFechaDesde(e.target.value)
            }
          />
        </label>

        <label>
          Hasta
          <br />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) =>
              setFechaHasta(e.target.value)
            }
          />
        </label>

        <label>
          Tipo de turista
          <br />

          <select
            value={tipoTurista}
            onChange={(e) =>
              setTipoTurista(e.target.value)
            }
          >
            <option value="todos">
              Todos
            </option>

            <option value="nacional">
              Nacional
            </option>

            <option value="extranjero">
              Extranjero
            </option>
          </select>
        </label>

        <button
          onClick={() => {
            setFechaDesde("");
            setFechaHasta("");
            setTipoTurista("todos");
          }}
        >
          Limpiar filtros
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          margin: "1.5rem 0",
        }}
      >
        <TarjetaKPI
          titulo="Encuestas"
          valor={totalRespuestas}
        />

        <TarjetaKPI
          titulo="Gasto promedio"
          valor={`$${gastoPromedio}`}
        />

        <TarjetaKPI
          titulo="Días promedio"
          valor={diasPromedio}
        />
      </div>

      {/* ======================================================
          CHATBOT
          ====================================================== */}

      <h2>
        Preguntas del chatbot sin responder (
        {preguntasSinResponder.length}
        )
      </h2>

      {preguntasSinResponder.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          No hay preguntas pendientes.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          {preguntasSinResponder.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "1rem",
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong>{p.pregunta}</strong>

                {p.correo_contacto && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                    }}
                  >
                    {p.correo_contacto}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  marcarComoAtendida(p.id)
                }
              >
                Marcar como atendida
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================
          ALOJAMIENTOS
          ====================================================== */}

      <hr
        style={{
          margin: "2rem 0",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="eyebrow">
            Oferta turística
          </span>

          <h2>
            Alojamientos ({hoteles.length})
          </h2>
        </div>

        <button
          className="boton boton-primario"
          onClick={prepararNuevoHotel}
        >
          + Nuevo alojamiento
        </button>
      </div>

      {/* FORMULARIO */}

      <div
        style={{
          background: "#f7f9f6",
          padding: "1.5rem",
          borderRadius: 14,
          margin: "1.5rem 0",
        }}
      >
        <h3>
          {hotelEditando
            ? "Editar alojamiento"
            : "Agregar alojamiento"}
        </h3>

        <form
          onSubmit={handleGuardarHotel}
          style={{
            display: "grid",
            gap: "0.8rem",
            maxWidth: 650,
          }}
        >

          <input
            name="nombre"
            placeholder="Nombre del alojamiento"
            value={nuevoHotel.nombre}
            onChange={handleHotelChange}
            required
          />

          <select
            name="categoria"
            value={nuevoHotel.categoria}
            onChange={handleHotelChange}
          >
            <option>
              Alojamiento rural
            </option>

            <option>
              Alojamiento urbano
            </option>

            <option>
              Hostería
            </option>

            <option>
              Finca turística
            </option>

            <option>
              Hotel
            </option>

            <option>
              Posada
            </option>

            <option>
              Cabaña
            </option>

            <option>
              Otro
            </option>
          </select>

          <textarea
            name="descripcion"
            placeholder="Descripción corta"
            value={nuevoHotel.descripcion}
            onChange={handleHotelChange}
            rows={3}
          />

          <textarea
            name="descripcion_larga"
            placeholder="Descripción completa"
            value={nuevoHotel.descripcion_larga}
            onChange={handleHotelChange}
            rows={5}
          />

          <input
            name="ubicacion"
            placeholder="Ubicación / vereda / sector"
            value={nuevoHotel.ubicacion}
            onChange={handleHotelChange}
          />

          <input
            name="instagram_url"
            type="url"
            placeholder="Enlace de Instagram"
            value={nuevoHotel.instagram_url}
            onChange={handleHotelChange}
          />

          <input
            name="whatsapp_url"
            type="url"
            placeholder="Enlace directo de WhatsApp"
            value={nuevoHotel.whatsapp_url}
            onChange={handleHotelChange}
          />

          <textarea
            name="servicios"
            placeholder={"Servicios, uno por línea\nEjemplo:\nAlojamiento\nPiscina\nSenderismo\nAlimentación"}
            value={nuevoHotel.servicios}
            onChange={handleHotelChange}
            rows={5}
          />

          <textarea
            name="imagenes"
            placeholder={"Rutas de imágenes, una por línea\nEjemplo:\n/alojamientos/yakutour/yakutour-1.jpg\n/alojamientos/yakutour/yakutour-2.jpg"}
            value={nuevoHotel.imagenes}
            onChange={handleHotelChange}
            rows={5}
          />

          <textarea
            name="indicaciones"
            placeholder="Indicaciones para llegar"
            value={nuevoHotel.indicaciones}
            onChange={handleHotelChange}
            rows={3}
          />

          <input
            name="precio_por_noche"
            type="number"
            min="0"
            placeholder="Precio por noche (si aplica)"
            value={nuevoHotel.precio_por_noche}
            onChange={handleHotelChange}
          />

          <input
            name="capacidad_personas"
            type="number"
            min="1"
            placeholder="Capacidad de personas"
            value={nuevoHotel.capacidad_personas}
            onChange={handleHotelChange}
          />

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              className="boton boton-primario"
              disabled={guardandoHotel}
            >
              {guardandoHotel
                ? "Guardando..."
                : hotelEditando
                ? "Guardar cambios"
                : "Agregar alojamiento"}
            </button>

            {hotelEditando && (
              <button
                type="button"
                onClick={prepararNuevoHotel}
              >
                Cancelar edición
              </button>
            )}
          </div>

          {mensajeHotel && (
            <p
              style={{
                color: mensajeHotel.startsWith(
                  "No se pudo"
                )
                  ? "crimson"
                  : "#1F4D3A",
                fontWeight: 600,
              }}
            >
              {mensajeHotel}
            </p>
          )}

        </form>
      </div>

      {/* LISTADO DE ALOJAMIENTOS */}

      <div
        style={{
          display: "grid",
          gap: "1rem",
        }}
      >
        {hoteles.map((hotel) => (
          <div
            key={hotel.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "1rem",
              display: "flex",
              justifyContent:
                "space-between",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>
                {hotel.nombre}
              </strong>

              <p
                style={{
                  margin: "0.3rem 0",
                  color: "#6b7280",
                }}
              >
                {hotel.categoria ||
                  "Alojamiento"}
                {" · "}
                {hotel.ubicacion ||
                  "San Rafael"}
              </p>

              <small>
                Estado:{" "}
                {hotel.activo
                  ? "Activo"
                  : "Oculto"}
              </small>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <a
                href={`/hospedaje?id=${hotel.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="boton"
              >
                Ver ficha
              </a>

              <button
                onClick={() =>
                  prepararEdicion(hotel)
                }
              >
                Editar
              </button>

              <button
                onClick={() =>
                  cambiarActivoHotel(hotel)
                }
              >
                {hotel.activo
                  ? "Ocultar"
                  : "Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================
          RESERVAS
          ====================================================== */}

      <hr
        style={{
          margin: "2rem 0",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
      />

      <h2>
        Solicitudes de reserva (
        {reservas.length}
        )
      </h2>

      {reservas.length === 0 ? (
        <p style={{ color: "#6b7280" }}>
          Todavía no hay solicitudes de reserva.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          {reservas.map((r) => {

            const hotel = hoteles.find(
              (h) => h.id === r.hotel_id
            );

            return (
              <div
                key={r.id}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "1rem",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div>

                  <strong>
                    {hotel
                      ? hotel.nombre
                      : "Hospedaje eliminado"}
                    {" — "}
                    {r.nombre_huesped}
                  </strong>

                  <p
                    style={{
                      margin: "0.3rem 0",
                      fontSize: "0.85rem",
                      color: "#6b7280",
                    }}
                  >
                    {r.fecha_entrada} a{" "}
                    {r.fecha_salida}
                    {" · "}
                    {r.numero_personas}
                    {" persona(s)"}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                    }}
                  >
                    Estado:{" "}
                    <strong>
                      {r.estado}
                    </strong>
                  </p>

                </div>

                {r.estado === "pendiente" && (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <button
                      onClick={() =>
                        actualizarEstadoReserva(
                          r.id,
                          "confirmada"
                        )
                      }
                    >
                      Confirmar
                    </button>

                    <button
                      onClick={() =>
                        actualizarEstadoReserva(
                          r.id,
                          "rechazada"
                        )
                      }
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}


/* ============================================================
   KPI
   ============================================================ */

function TarjetaKPI({ titulo, valor }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "1rem 1.5rem",
        minWidth: 160,
        background: "white",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#6b7280",
          fontSize: "0.85rem",
        }}
      >
        {titulo}
      </p>

      <p
        style={{
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        {valor}
      </p>
    </div>
  );
}