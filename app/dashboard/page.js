"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function DashboardPage() {
  // ============================================================
  // SESIÓN
  // ============================================================

  const [session, setSession] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(null);

  // ============================================================
  // ENCUESTAS
  // ============================================================

  const [respuestas, setRespuestas] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [tipoTurista, setTipoTurista] = useState("todos");

  // ============================================================
  // CHATBOT
  // ============================================================

  const [preguntasSinResponder, setPreguntasSinResponder] = useState([]);

  // ============================================================
  // ALOJAMIENTOS
  // ============================================================

  const [hoteles, setHoteles] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [nuevoHotel, setNuevoHotel] = useState({
    nombre: "",
    categoria: "Alojamiento",
    entorno: "rural",
    ubicacion: "",
    descripcion: "",
    instagram_url: "",
    whatsapp_url: "",
    web_url: "",
    reserva_url: "",
    latitud: "",
    longitud: "",
    destacado: false,
  });

  const [guardandoHotel, setGuardandoHotel] = useState(false);
  const [mensajeHotel, setMensajeHotel] = useState(null);
  const [errorHotel, setErrorHotel] = useState(null);

  // ============================================================
  // COMPROBAR SESIÓN
  // ============================================================

  useEffect(() => {
    async function revisarSesion() {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setCargandoSesion(false);
    }

    revisarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ============================================================
  // CARGAR INFORMACIÓN DEL DASHBOARD
  // ============================================================

  useEffect(() => {
    if (!session) return;

    async function cargarDatos() {
      setCargandoDatos(true);

      // ----------------------------------------------------------
      // ENCUESTAS
      // ----------------------------------------------------------

      const { data: respuestasData, error: respuestasError } =
        await supabase
          .from("respuestas_encuesta")
          .select("*")
          .order("creado_en", { ascending: true });

      if (respuestasError) {
        console.error(
          "Error cargando respuestas:",
          respuestasError
        );
      } else {
        setRespuestas(respuestasData || []);
      }

      // ----------------------------------------------------------
      // PREGUNTAS DEL CHATBOT
      // ----------------------------------------------------------

      const {
        data: preguntasData,
        error: preguntasError,
      } = await supabase
        .from("preguntas_sin_responder")
        .select("*")
        .eq("atendida", false)
        .order("creado_en", { ascending: false });

      if (preguntasError) {
        console.error(
          "Error cargando preguntas:",
          preguntasError
        );
      } else {
        setPreguntasSinResponder(preguntasData || []);
      }

      // ----------------------------------------------------------
      // ALOJAMIENTOS
      // ----------------------------------------------------------

      const {
        data: hotelesData,
        error: hotelesError,
      } = await supabase
        .from("hoteles")
        .select("*")
        .order("creado_en", { ascending: true });

      if (hotelesError) {
        console.error(
          "Error cargando alojamientos:",
          hotelesError
        );
      } else {
        setHoteles(hotelesData || []);
      }

      // ----------------------------------------------------------
      // RESERVAS
      // ----------------------------------------------------------

      const {
        data: reservasData,
        error: reservasError,
      } = await supabase
        .from("reservas")
        .select("*")
        .order("creado_en", { ascending: false });

      if (reservasError) {
        console.error(
          "Error cargando reservas:",
          reservasError
        );
      } else {
        setReservas(reservasData || []);
      }

      setCargandoDatos(false);
    }

    cargarDatos();
  }, [session]);

  // ============================================================
  // CREAR ALOJAMIENTO
  // ============================================================

  async function handleCrearHotel(e) {
    e.preventDefault();

    setGuardandoHotel(true);
    setMensajeHotel(null);
    setErrorHotel(null);

    const {
      data,
      error,
    } = await supabase
      .from("hoteles")
      .insert([
        {
          nombre: nuevoHotel.nombre.trim(),
          categoria: nuevoHotel.categoria,
          entorno: nuevoHotel.entorno,
          ubicacion: nuevoHotel.ubicacion.trim(),
          descripcion: nuevoHotel.descripcion.trim(),

          instagram_url:
            nuevoHotel.instagram_url.trim() || null,

          whatsapp_url:
            nuevoHotel.whatsapp_url.trim() || null,

          web_url:
            nuevoHotel.web_url.trim() || null,

          reserva_url:
            nuevoHotel.reserva_url.trim() || null,

          latitud:
            nuevoHotel.latitud !== ""
              ? Number(nuevoHotel.latitud)
              : null,

          longitud:
            nuevoHotel.longitud !== ""
              ? Number(nuevoHotel.longitud)
              : null,

          destacado: nuevoHotel.destacado,

          // El alojamiento estará visible
          activo: true,

          // Lo dejamos pendiente hasta verificarlo
          estado_verificacion: "pendiente",
        },
      ])
      .select()
      .single();

    setGuardandoHotel(false);

    if (error) {
      console.error("Error guardando alojamiento:", error);

      setErrorHotel(
        "No se pudo guardar el alojamiento: " +
          error.message
      );

      return;
    }

    if (data) {
      setHoteles((prev) => [...prev, data]);

      setNuevoHotel({
        nombre: "",
        categoria: "Alojamiento",
        entorno: "rural",
        ubicacion: "",
        descripcion: "",
        instagram_url: "",
        whatsapp_url: "",
        web_url: "",
        reserva_url: "",
        latitud: "",
        longitud: "",
        destacado: false,
      });

      setMensajeHotel(
        "¡Alojamiento agregado correctamente!"
      );
    }
  }

  // ============================================================
  // MARCAR PREGUNTA COMO ATENDIDA
  // ============================================================

  async function marcarComoAtendida(id) {
    const { error } = await supabase
      .from("preguntas_sin_responder")
      .update({ atendida: true })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setPreguntasSinResponder((prev) =>
      prev.filter((p) => p.id !== id)
    );
  }

  // ============================================================
  // ACTUALIZAR ESTADO DE RESERVA
  // ============================================================

  async function actualizarEstadoReserva(
    id,
    nuevoEstado
  ) {
    const { error } = await supabase
      .from("reservas")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    if (error) {
      console.error(
        "Error actualizando reserva:",
        error
      );
      return;
    }

    setReservas((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, estado: nuevoEstado }
          : r
      )
    );
  }

  // ============================================================
  // LOGIN
  // ============================================================

  async function handleLogin(e) {
    e.preventDefault();

    setErrorLogin(null);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error(error);

      setErrorLogin(
        "Correo o contraseña incorrectos."
      );
    }
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // ============================================================
  // CARGANDO SESIÓN
  // ============================================================

  if (cargandoSesion) {
    return (
      <section>
        <p>Cargando panel...</p>
      </section>
    );
  }

  // ============================================================
  // LOGIN
  // ============================================================

  if (!session) {
    return (
      <section
        style={{
          maxWidth: 360,
          margin: "3rem auto",
        }}
      >
        <h1>Panel de administración</h1>

        <p>
          Ingresa con tu cuenta para administrar
          la información turística.
        </p>

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

  // ============================================================
  // FILTROS DE ENCUESTAS
  // ============================================================

  const respuestasFiltradas =
    respuestas.filter((r) => {
      const fechaRespuesta =
        new Date(r.creado_en);

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

  // ============================================================
  // PROMEDIOS
  // ============================================================

  const promedio = (campo) => {
    if (totalRespuestas === 0) {
      return 0;
    }

    return (
      respuestasFiltradas.reduce(
        (suma, r) =>
          suma + Number(r[campo] || 0),
        0
      ) / totalRespuestas
    );
  };

  const gastoPromedio =
    promedio("gasto_promedio").toFixed(0);

  const diasPromedio =
    promedio("dias_estadia").toFixed(1);

  // ============================================================
  // GRÁFICO DE INDICADORES
  // ============================================================

  const datosIndicadores = [
    {
      indicador: "Seguridad",
      promedio: Number(
        promedio(
          "percepcion_seguridad"
        ).toFixed(2)
      ),
    },
    {
      indicador: "Interacción",
      promedio: Number(
        promedio(
          "interaccion_comunidad"
        ).toFixed(2)
      ),
    },
    {
      indicador: "Ambiental",
      promedio: Number(
        promedio(
          "percepcion_ambiental"
        ).toFixed(2)
      ),
    },
    {
      indicador: "Buenas prácticas",
      promedio: Number(
        promedio(
          "conocimiento_buenas_practicas"
        ).toFixed(2)
      ),
    },
  ];

  // ============================================================
  // GRÁFICO DE RESPUESTAS POR FECHA
  // ============================================================

  const conteoPorFecha = {};

  respuestasFiltradas.forEach((r) => {
    const fecha = new Date(
      r.creado_en
    ).toLocaleDateString("es-CO");

    conteoPorFecha[fecha] =
      (conteoPorFecha[fecha] || 0) + 1;
  });

  const datosPorFecha = Object.entries(
    conteoPorFecha
  ).map(([fecha, cantidad]) => ({
    fecha,
    cantidad,
  }));

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section>
      {/* ======================================================
          ENCABEZADO
      ====================================================== */}

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
          <h1>Panel de administración</h1>

          <p>
            Gestión de información turística
            de San Rafael.
          </p>
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
          borderTop:
            "1px solid #e5e7eb",
        }}
      />

      <h2>Monitoreo turístico</h2>

      {/* FILTROS */}

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
          background: "#f9fafb",
          padding: "1rem",
          borderRadius: 8,
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

      {cargandoDatos ? (
        <p>Cargando información...</p>
      ) : respuestas.length === 0 ? (
        <p>
          Todavía no hay respuestas registradas.
        </p>
      ) : totalRespuestas === 0 ? (
        <p>
          No hay respuestas que coincidan
          con los filtros.
        </p>
      ) : (
        <>
          {/* KPI */}

          <div
            style={{
              display: "flex",
              gap: "1rem",
              margin: "1.5rem 0",
              flexWrap: "wrap",
            }}
          >
            <TarjetaKPI
              titulo="Encuestas respondidas"
              valor={totalRespuestas}
            />

            <TarjetaKPI
              titulo="Gasto promedio"
              valor={`$${gastoPromedio}`}
            />

            <TarjetaKPI
              titulo="Días de estadía"
              valor={diasPromedio}
            />
          </div>

          {/* GRÁFICO INDICADORES */}

          <h2>
            Percepción por indicador
          </h2>

          <p>
            Escala de 1 a 5 según las
            respuestas de los turistas.
          </p>

          <div
            style={{
              width: "100%",
              height: 300,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={datosIndicadores}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="indicador"
                />

                <YAxis domain={[0, 5]} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="promedio"
                  fill="#1F4D3A"
                  name="Promedio"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* GRÁFICO RESPUESTAS */}

          <h2>
            Respuestas recibidas por día
          </h2>

          <div
            style={{
              width: "100%",
              height: 300,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={datosPorFecha}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="fecha"
                />

                <YAxis
                  allowDecimals={false}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="#1F4D3A"
                  name="N° de respuestas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ======================================================
          CHATBOT
      ====================================================== */}

      <hr
        style={{
          margin: "2rem 0",
          border: "none",
          borderTop:
            "1px solid #e5e7eb",
        }}
      />

      <h2>
        Preguntas del chatbot sin responder (
        {preguntasSinResponder.length}
        )
      </h2>

      {preguntasSinResponder.length ===
      0 ? (
        <p
          style={{
            color: "#6b7280",
          }}
        >
          No hay preguntas pendientes.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          {preguntasSinResponder.map(
            (p) => (
              <div
                key={p.id}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding:
                    "0.75rem 1rem",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    {p.pregunta}
                  </p>

                  {p.correo_contacto && (
                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "0.8rem",
                        color:
                          "#6b7280",
                      }}
                    >
                      Contacto:{" "}
                      {
                        p.correo_contacto
                      }
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    marcarComoAtendida(
                      p.id
                    )
                  }
                >
                  Marcar como atendida
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* ======================================================
          ALOJAMIENTOS
      ====================================================== */}

      <hr
        style={{
          margin: "2rem 0",
          border: "none",
          borderTop:
            "1px solid #e5e7eb",
        }}
      />

      <h2>
        Alojamientos
      </h2>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "1rem 0",
          flexWrap: "wrap",
        }}
      >
        <TarjetaKPI
          titulo="Alojamientos registrados"
          valor={hoteles.length}
        />

        <TarjetaKPI
          titulo="Solicitudes pendientes"
          valor={
            reservas.filter(
              (r) =>
                r.estado ===
                "pendiente"
            ).length
          }
        />

        <TarjetaKPI
          titulo="Reservas confirmadas"
          valor={
            reservas.filter(
              (r) =>
                r.estado ===
                "confirmada"
            ).length
          }
        />
      </div>

      {/* ======================================================
          FORMULARIO NUEVO ALOJAMIENTO
      ====================================================== */}

      <div
        style={{
          background: "#f9fafb",
          padding: "1.25rem",
          borderRadius: 10,
          maxWidth: 650,
          marginTop: "1.5rem",
        }}
      >
        <h3>
          Agregar un nuevo alojamiento
        </h3>

        <p
          style={{
            color: "#6b7280",
            fontSize: "0.9rem",
          }}
        >
          Registra aquí la información
          pública que posteriormente
          aparecerá en la página de
          alojamientos.
        </p>

        <form
          onSubmit={handleCrearHotel}
          style={{
            display: "grid",
            gap: "0.8rem",
          }}
        >
          {/* NOMBRE */}

          <label>
            Nombre del alojamiento

            <input
              type="text"
              placeholder="Ej. Hostería Yakutour"
              value={
                nuevoHotel.nombre
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  nombre:
                    e.target.value,
                })
              }
              required
            />
          </label>

          {/* CATEGORÍA */}

          <label>
            Categoría

            <select
              value={
                nuevoHotel.categoria
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  categoria:
                    e.target.value,
                })
              }
            >
              <option value="Alojamiento">
                Alojamiento
              </option>

              <option value="Hotel">
                Hotel
              </option>

              <option value="Hostería">
                Hostería
              </option>

              <option value="Hostal">
                Hostal
              </option>

              <option value="Cabaña">
                Cabaña
              </option>

              <option value="Finca">
                Finca
              </option>

              <option value="Glamping">
                Glamping
              </option>

              <option value="Ecohotel">
                Ecohotel
              </option>

              <option value="Casa campestre">
                Casa campestre
              </option>

              <option value="Otro">
                Otro
              </option>
            </select>
          </label>

          {/* ENTORNO */}

          <label>
            Tipo de entorno

            <select
              value={
                nuevoHotel.entorno
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  entorno:
                    e.target.value,
                })
              }
            >
              <option value="rural">
                Rural
              </option>

              <option value="urbano">
                Urbano
              </option>
            </select>
          </label>

          {/* UBICACIÓN */}

          <label>
            Ubicación

            <input
              type="text"
              placeholder="Ej. Vereda La Rápida"
              value={
                nuevoHotel.ubicacion
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  ubicacion:
                    e.target.value,
                })
              }
            />
          </label>

          {/* DESCRIPCIÓN */}

          <label>
            Descripción

            <textarea
              placeholder="Describe brevemente el alojamiento y lo que ofrece..."
              value={
                nuevoHotel.descripcion
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  descripcion:
                    e.target.value,
                })
              }
              rows={4}
            />
          </label>

          {/* INSTAGRAM */}

          <label>
            Instagram

            <input
              type="url"
              placeholder="https://instagram.com/..."
              value={
                nuevoHotel.instagram_url
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  instagram_url:
                    e.target.value,
                })
              }
            />
          </label>

          {/* WHATSAPP */}

          <label>
            WhatsApp

            <input
              type="url"
              placeholder="Enlace directo de WhatsApp"
              value={
                nuevoHotel.whatsapp_url
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  whatsapp_url:
                    e.target.value,
                })
              }
            />
          </label>

          {/* WEB */}

          <label>
            Sitio web

            <input
              type="url"
              placeholder="https://..."
              value={
                nuevoHotel.web_url
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  web_url:
                    e.target.value,
                })
              }
            />
          </label>

          {/* RESERVA */}

          <label>
            Enlace de reserva

            <input
              type="url"
              placeholder="https://..."
              value={
                nuevoHotel.reserva_url
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  reserva_url:
                    e.target.value,
                })
              }
            />
          </label>

          {/* COORDENADAS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "0.8rem",
            }}
          >
            <label>
              Latitud

              <input
                type="number"
                step="any"
                placeholder="Ej. 6.293"
                value={
                  nuevoHotel.latitud
                }
                onChange={(e) =>
                  setNuevoHotel({
                    ...nuevoHotel,
                    latitud:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Longitud

              <input
                type="number"
                step="any"
                placeholder="Ej. -75.021"
                value={
                  nuevoHotel.longitud
                }
                onChange={(e) =>
                  setNuevoHotel({
                    ...nuevoHotel,
                    longitud:
                      e.target.value,
                  })
                }
              />
            </label>
          </div>

          {/* DESTACADO */}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              checked={
                nuevoHotel.destacado
              }
              onChange={(e) =>
                setNuevoHotel({
                  ...nuevoHotel,
                  destacado:
                    e.target.checked,
                })
              }
            />

            Mostrar como alojamiento
            destacado
          </label>

          {/* BOTÓN */}

          <button
            type="submit"
            className="boton boton-primario"
            disabled={
              guardandoHotel
            }
          >
            {guardandoHotel
              ? "Guardando..."
              : "Agregar alojamiento"}
          </button>

          {/* MENSAJE ÉXITO */}

          {mensajeHotel && (
            <p
              style={{
                color: "#1F4D3A",
                fontWeight: 600,
              }}
            >
              {mensajeHotel}
            </p>
          )}

          {/* MENSAJE ERROR */}

          {errorHotel && (
            <p
              style={{
                color: "crimson",
                fontWeight: 600,
              }}
            >
              {errorHotel}
            </p>
          )}
        </form>
      </div>

      {/* ======================================================
          LISTADO DE ALOJAMIENTOS
      ====================================================== */}

      <h3
        style={{
          marginTop: "2rem",
        }}
      >
        Alojamientos registrados (
        {hoteles.length})
      </h3>

      {hoteles.length === 0 ? (
        <p
          style={{
            color: "#6b7280",
          }}
        >
          Todavía no hay alojamientos
          registrados.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {hoteles.map((hotel) => (
            <div
              key={hotel.id}
              style={{
                border:
                  "1px solid #e5e7eb",
                borderRadius: 10,
                padding:
                  "1rem",
              }}
            >
              <h4
                style={{
                  margin:
                    "0 0 0.3rem",
                }}
              >
                {hotel.nombre}
              </h4>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                }}
              >
                {hotel.categoria ||
                  "Alojamiento"}{" "}
                ·{" "}
                {hotel.entorno ||
                  "sin definir"}
              </p>

              {hotel.ubicacion && (
                <p
                  style={{
                    margin:
                      "0.3rem 0 0",
                  }}
                >
                  📍{" "}
                  {
                    hotel.ubicacion
                  }
                </p>
              )}

              {hotel.instagram_url && (
                <p
                  style={{
                    margin:
                      "0.3rem 0 0",
                    fontSize:
                      "0.85rem",
                  }}
                >
                  📷 Instagram
                  registrado
                </p>
              )}

              {hotel.destacado && (
                <span
                  style={{
                    display:
                      "inline-block",
                    marginTop:
                      "0.5rem",
                    fontSize:
                      "0.8rem",
                    fontWeight:
                      600,
                  }}
                >
                  ⭐ Destacado
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ======================================================
          RESERVAS
      ====================================================== */}

      <hr
        style={{
          margin: "2rem 0",
          border: "none",
          borderTop:
            "1px solid #e5e7eb",
        }}
      />

      <h2>
        Solicitudes de reserva (
        {reservas.length})
      </h2>

      {reservas.length === 0 ? (
        <p
          style={{
            color: "#6b7280",
          }}
        >
          Todavía no hay solicitudes
          de reserva.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 8,
          }}
        >
          {reservas.map((r) => {
            const hotel =
              hoteles.find(
                (h) =>
                  h.id ===
                  r.hotel_id
              );

            return (
              <div
                key={r.id}
                style={{
                  border:
                    "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding:
                    "0.75rem 1rem",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: 8,
                  flexWrap:
                    "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight:
                        600,
                    }}
                  >
                    {hotel
                      ? hotel.nombre
                      : "Hospedaje eliminado"}{" "}
                    —{" "}
                    {
                      r.nombre_huesped
                    }
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "0.8rem",
                      color:
                        "#6b7280",
                    }}
                  >
                    {
                      r.fecha_entrada
                    }{" "}
                    a{" "}
                    {
                      r.fecha_salida
                    }{" "}
                    ·{" "}
                    {
                      r.numero_personas
                    }{" "}
                    persona(s)
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "0.8rem",
                    }}
                  >
                    Contacto:{" "}
                    {r.correo_huesped ||
                      r.telefono_huesped ||
                      "sin contacto"}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize:
                        "0.8rem",
                    }}
                  >
                    Estado:{" "}
                    <strong>
                      {r.estado ||
                        "pendiente"}
                    </strong>
                  </p>
                </div>

                {r.estado ===
                  "pendiente" && (
                  <div
                    style={{
                      display:
                        "flex",
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

// ============================================================
// COMPONENTE KPI
// ============================================================

function TarjetaKPI({
  titulo,
  valor,
}) {
  return (
    <div
      style={{
        border:
          "1px solid #e5e7eb",
        borderRadius: 8,
        padding:
          "1rem 1.5rem",
        minWidth: 160,
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#6b7280",
          fontSize:
            "0.85rem",
        }}
      >
        {titulo}
      </p>

      <p
        style={{
          margin: 0,
          fontSize:
            "1.5rem",
          fontWeight:
            "bold",
        }}
      >
        {valor}
      </p>
    </div>
  );
}