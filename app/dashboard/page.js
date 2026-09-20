"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  // =========================================================
  // SESIÓN
  // =========================================================

  const [session, setSession] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(null);

  // =========================================================
  // CHATBOT
  // =========================================================

  const [preguntasSinResponder, setPreguntasSinResponder] =
    useState([]);

  // =========================================================
  // ALOJAMIENTOS
  // =========================================================

  const [hoteles, setHoteles] = useState([]);

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

  // =========================================================
  // MIEMBROS RLT
  // =========================================================

  const [solicitudesRlt, setSolicitudesRlt] = useState([]);
  const [miembrosRlt, setMiembrosRlt] = useState([]);

  const [cargandoMiembros, setCargandoMiembros] = useState(false);

  const [procesandoSolicitud, setProcesandoSolicitud] =
    useState(null);

  const [guardandoMiembro, setGuardandoMiembro] =
    useState(null);

  const [mensajeMiembros, setMensajeMiembros] =
    useState(null);

  const [correoGoogleEditando, setCorreoGoogleEditando] =
    useState({});

  // =========================================================
  // SESIÓN
  // =========================================================

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCargandoSesion(false);
    });

    const {
      data: listener,
    } = supabase.auth.onAuthStateChange(
      (_event, nuevaSesion) => {
        setSession(nuevaSesion);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // =========================================================
  // CARGAR DATOS
  // =========================================================

  useEffect(() => {
    if (!session) return;

    async function cargarDatos() {
      await cargarPreguntas();
      await cargarHoteles();
      await cargarMiembrosRlt();
    }

    cargarDatos();
  }, [session]);

  // =========================================================
  // LOGIN
  // =========================================================

  async function handleLogin(e) {
    e.preventDefault();

    setErrorLogin(null);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setErrorLogin(
        "Correo o contraseña incorrectos."
      );
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // =========================================================
  // CHATBOT
  // =========================================================

  async function cargarPreguntas() {
    const {
      data,
      error,
    } = await supabase
      .from("preguntas_sin_responder")
      .select("*")
      .eq("atendida", false)
      .order("creado_en", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error cargando preguntas:",
        error
      );
      return;
    }

    setPreguntasSinResponder(data || []);
  }

  async function marcarComoAtendida(id) {
    const { error } =
      await supabase
        .from("preguntas_sin_responder")
        .update({
          atendida: true,
        })
        .eq("id", id);

    if (error) {
      console.error(
        "Error actualizando pregunta:",
        error
      );
      return;
    }

    setPreguntasSinResponder((prev) =>
      prev.filter((p) => p.id !== id)
    );
  }

  // =========================================================
  // ALOJAMIENTOS
  // =========================================================

  async function cargarHoteles() {
    const {
      data,
      error,
    } = await supabase
      .from("hoteles")
      .select("*")
      .order("creado_en", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Error cargando alojamientos:",
        error
      );
      return;
    }

    setHoteles(data || []);
  }

  function handleHotelChange(e) {
    const {
      name,
      value,
    } = e.target;

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
      categoria:
        hotel.categoria ||
        "Alojamiento rural",
      descripcion:
        hotel.descripcion || "",
      descripcion_larga:
        hotel.descripcion_larga || "",
      ubicacion:
        hotel.ubicacion || "",
      instagram_url:
        hotel.instagram_url || "",
      whatsapp_url:
        hotel.whatsapp_url || "",
      servicios:
        Array.isArray(hotel.servicios)
          ? hotel.servicios.join("\n")
          : "",
      imagenes:
        Array.isArray(hotel.imagenes)
          ? hotel.imagenes.join("\n")
          : "",
      indicaciones:
        hotel.indicaciones || "",
      precio_por_noche:
        hotel.precio_por_noche || "",
      capacidad_personas:
        hotel.capacidad_personas || "",
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
      nombre:
        nuevoHotel.nombre.trim(),

      categoria:
        nuevoHotel.categoria,

      descripcion:
        nuevoHotel.descripcion.trim(),

      descripcion_larga:
        nuevoHotel.descripcion_larga.trim(),

      ubicacion:
        nuevoHotel.ubicacion.trim(),

      instagram_url:
        nuevoHotel.instagram_url.trim() ||
        null,

      whatsapp_url:
        nuevoHotel.whatsapp_url.trim() ||
        null,

      servicios:
        convertirLista(
          nuevoHotel.servicios
        ),

      imagenes:
        convertirLista(
          nuevoHotel.imagenes
        ),

      indicaciones:
        nuevoHotel.indicaciones.trim(),

      precio_por_noche:
        nuevoHotel.precio_por_noche !== ""
          ? Number(
              nuevoHotel.precio_por_noche
            )
          : null,

      capacidad_personas:
        nuevoHotel.capacidad_personas !== ""
          ? Number(
              nuevoHotel.capacidad_personas
            )
          : null,
    };

    let resultado;

    if (hotelEditando) {
      resultado =
        await supabase
          .from("hoteles")
          .update(datosHotel)
          .eq(
            "id",
            hotelEditando.id
          )
          .select();
    } else {
      resultado =
        await supabase
          .from("hoteles")
          .insert([datosHotel])
          .select();
    }

    const {
      data,
      error,
    } = resultado;

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
          hotel.id ===
          hotelEditando.id
            ? data[0]
            : hotel
        )
      );

      setMensajeHotel(
        "Alojamiento actualizado correctamente."
      );
    } else {
      setHoteles((prev) => [
        ...prev,
        ...data,
      ]);

      setMensajeHotel(
        "Alojamiento agregado correctamente."
      );
    }

    prepararNuevoHotel();
  }

  async function cambiarActivoHotel(hotel) {
    const nuevoEstado =
      !hotel.activo;

    const { error } =
      await supabase
        .from("hoteles")
        .update({
          activo: nuevoEstado,
        })
        .eq("id", hotel.id);

    if (error) {
      console.error(
        "Error cambiando estado:",
        error
      );
      return;
    }

    setHoteles((prev) =>
      prev.map((h) =>
        h.id === hotel.id
          ? {
              ...h,
              activo: nuevoEstado,
            }
          : h
      )
    );
  }

  // =========================================================
  // MIEMBROS RLT
  // =========================================================

  async function cargarMiembrosRlt() {
    setCargandoMiembros(true);
    setMensajeMiembros(null);

    // -------------------------------------------------------
    // SOLICITUDES PENDIENTES
    // -------------------------------------------------------

    const {
      data: solicitudes,
      error: errorSolicitudes,
    } = await supabase
      .from("solicitudes_rlt")
      .select("*")
      .eq("estado", "PENDIENTE")
      .order("creado_en", {
        ascending: false,
      });

    if (errorSolicitudes) {
      console.error(
        "ERROR CARGANDO SOLICITUDES RLT:",
        errorSolicitudes
      );

      setSolicitudesRlt([]);

      setMensajeMiembros(
        `Error cargando solicitudes RLT: ${errorSolicitudes.message}`
      );
    } else {
      console.log(
        "SOLICITUDES RLT CARGADAS:",
        solicitudes
      );

      setSolicitudesRlt(
        solicitudes || []
      );
    }

    // -------------------------------------------------------
    // MIEMBROS RLT
    // -------------------------------------------------------

    const {
      data: miembros,
      error: errorMiembros,
    } = await supabase
      .from("miembros_rlt")
      .select("*")
      .order("creado_en", {
        ascending: false,
      });

    if (errorMiembros) {
      console.error(
        "ERROR CARGANDO MIEMBROS RLT:",
        errorMiembros
      );

      setMiembrosRlt([]);

      setMensajeMiembros(
        `Error cargando los miembros RLT: ${errorMiembros.message}`
      );
    } else {
      console.log(
        "MIEMBROS RLT CARGADOS:",
        miembros
      );

      setMiembrosRlt(
        miembros || []
      );

      const correos = {};

      (miembros || []).forEach(
        (miembro) => {
          correos[miembro.id] =
            miembro.correo_google ||
            "";
        }
      );

      setCorreoGoogleEditando(
        correos
      );
    }

    setCargandoMiembros(false);
  }

  // =========================================================
  // NORMALIZAR SECTORES
  // =========================================================

  function normalizarSectores(
    tipoAsociado
  ) {
    if (!tipoAsociado) {
      return [];
    }

    // -------------------------------------------------------
    // NUEVO FORMATO: text[]
    // -------------------------------------------------------

    if (Array.isArray(tipoAsociado)) {
      return tipoAsociado
        .map((tipo) =>
          String(tipo).trim()
        )
        .filter(Boolean);
    }

    // -------------------------------------------------------
    // FORMATO ANTIGUO: texto
    // -------------------------------------------------------

    const texto =
      String(tipoAsociado).trim();

    if (!texto) {
      return [];
    }

    // Si PostgreSQL devuelve el arreglo como texto:
    // {guianza,alojamiento_rural}
    if (
      texto.startsWith("{") &&
      texto.endsWith("}")
    ) {
      return texto
        .slice(1, -1)
        .split(",")
        .map((tipo) =>
          tipo
            .replace(/^"|"$/g, "")
            .trim()
        )
        .filter(Boolean);
    }

    return texto
      .split(/\s*-\s*/)
      .map((tipo) =>
        tipo.trim()
      )
      .filter(Boolean);
  }

  function convertirSectorAValor(
    sector
  ) {
    const mapa = {
      "Alimentos y bebidas":
        "alimentos_bebidas",

      "Alimentos / Bebidas":
        "alimentos_bebidas",

      alimentos_bebidas:
        "alimentos_bebidas",

      "Alojamiento rural":
        "alojamiento_rural",

      alojamiento_rural:
        "alojamiento_rural",

      "Alojamiento urbano":
        "alojamiento_urbano",

      alojamiento_urbano:
        "alojamiento_urbano",

      Guianza:
        "guianza",

      guianza:
        "guianza",

      Operadora:
        "operadora",

      operadora:
        "operadora",

      "Productor / Oferente de experiencias":
        "productor_oferente_experiencias",

      productor_oferente_experiencias:
        "productor_oferente_experiencias",
    };

    return (
      mapa[sector] ||
      sector
    );
  }

  function obtenerSectoresSolicitud(
    tipoAsociado
  ) {
    return normalizarSectores(
      tipoAsociado
    )
      .map(
        convertirSectorAValor
      )
      .filter(Boolean);
  }

  function obtenerNombreSector(
    tipos
  ) {
    const sectores = {
      alimentos_bebidas:
        "Alimentos / Bebidas",

      alojamiento_rural:
        "Alojamiento rural",

      alojamiento_urbano:
        "Alojamiento urbano",

      guianza:
        "Guianza",

      operadora:
        "Operadora",

      productor_oferente_experiencias:
        "Productor / Oferente de experiencias",
    };

    const lista =
      normalizarSectores(
        tipos
      );

    if (lista.length === 0) {
      return "Sin sector";
    }

    return lista
      .map(
        (tipo) =>
          sectores[
            convertirSectorAValor(
              tipo
            )
          ] ||
          tipo
      )
      .join(" · ");
  }

  // =========================================================
  // APROBAR SOLICITUD
  // =========================================================

  async function aprobarSolicitud(
    solicitud
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas aprobar a ${solicitud.nombres} ${solicitud.apellidos} como miembro de la RLT?`
      );

    if (!confirmar) {
      return;
    }

    setProcesandoSolicitud(
      solicitud.id
    );

    setMensajeMiembros(null);

    const sectores =
      obtenerSectoresSolicitud(
        solicitud.tipo_asociado
      );

    console.log(
      "Sectores de la solicitud:",
      sectores
    );

    if (sectores.length === 0) {
      setMensajeMiembros(
        "La solicitud no tiene un sector válido."
      );

      setProcesandoSolicitud(null);

      return;
    }

    // -------------------------------------------------------
    // VERIFICAR MIEMBRO EXISTENTE
    // -------------------------------------------------------

    let miembroExistente = null;

    if (
      solicitud.correo_electronico
    ) {
      const {
        data,
        error,
      } = await supabase
        .from("miembros_rlt")
        .select("id")
        .eq(
          "correo_electronico",
          solicitud.correo_electronico
        )
        .maybeSingle();

      if (error) {
        console.error(
          "Error verificando miembro:",
          error
        );
      }

      miembroExistente =
        data;
    }

    // -------------------------------------------------------
    // CREAR MIEMBRO
    // -------------------------------------------------------

    if (!miembroExistente) {
      const {
        data: nuevoMiembro,
        error,
      } = await supabase
        .from("miembros_rlt")
        .insert([
          {
            nombres:
              solicitud.nombres,

            apellidos:
              solicitud.apellidos,

            cedula_nit:
              solicitud.cedula_nit ||
              null,

            correo_electronico:
              solicitud.correo_electronico ||
              null,

            correo_google:
              null,

            nombre_asociado:
              solicitud.nombre_asociado,

            tipo_asociado:
              sectores,

            estado:
              "ACTIVO",

            formulario_url:
              null,
          },
        ])
        .select();

      if (error) {
        console.error(
          "ERROR CREANDO MIEMBRO:",
          error
        );

        setMensajeMiembros(
          `No se pudo aprobar la solicitud: ${error.message}`
        );

        setProcesandoSolicitud(
          null
        );

        return;
      }

      console.log(
        "MIEMBRO CREADO:",
        nuevoMiembro
      );
    }

    // -------------------------------------------------------
    // MARCAR SOLICITUD COMO APROBADA
    // -------------------------------------------------------

    const {
      error: errorSolicitud,
    } = await supabase
      .from("solicitudes_rlt")
      .update({
        estado: "APROBADA",
      })
      .eq(
        "id",
        solicitud.id
      );

    if (errorSolicitud) {
      console.error(
        "ERROR ACTUALIZANDO SOLICITUD:",
        errorSolicitud
      );

      setMensajeMiembros(
        `El miembro fue creado, pero no se pudo actualizar la solicitud: ${errorSolicitud.message}`
      );

      setProcesandoSolicitud(
        null
      );

      await cargarMiembrosRlt();

      return;
    }

    setMensajeMiembros(
      "Solicitud aprobada correctamente. El miembro quedó activo."
    );

    setProcesandoSolicitud(
      null
    );

    await cargarMiembrosRlt();
  }

  // =========================================================
  // RECHAZAR SOLICITUD
  // =========================================================

  async function rechazarSolicitud(
    solicitud
  ) {
    const confirmar =
      window.confirm(
        `¿Deseas rechazar la solicitud de ${solicitud.nombres} ${solicitud.apellidos}?`
      );

    if (!confirmar) {
      return;
    }

    setProcesandoSolicitud(
      solicitud.id
    );

    setMensajeMiembros(null);

    const {
      error,
    } = await supabase
      .from("solicitudes_rlt")
      .update({
        estado: "RECHAZADA",
      })
      .eq(
        "id",
        solicitud.id
      );

    if (error) {
      console.error(
        "Error rechazando solicitud:",
        error
      );

      setMensajeMiembros(
        `No se pudo rechazar la solicitud: ${error.message}`
      );

      setProcesandoSolicitud(
        null
      );

      return;
    }

    setMensajeMiembros(
      "Solicitud rechazada correctamente."
    );

    setProcesandoSolicitud(
      null
    );

    await cargarMiembrosRlt();
  }

  // =========================================================
  // CAMBIAR ESTADO DE MIEMBRO
  // =========================================================

  async function cambiarEstadoMiembro(
    miembro
  ) {
    const nuevoEstado =
      miembro.estado === "ACTIVO"
        ? "INACTIVO"
        : "ACTIVO";

    const {
      error,
    } = await supabase
      .from("miembros_rlt")
      .update({
        estado: nuevoEstado,
        actualizado_en:
          new Date().toISOString(),
      })
      .eq(
        "id",
        miembro.id
      );

    if (error) {
      console.error(
        "Error cambiando estado del miembro:",
        error
      );

      setMensajeMiembros(
        `No se pudo cambiar el estado: ${error.message}`
      );

      return;
    }

    setMiembrosRlt(
      (prev) =>
        prev.map((m) =>
          m.id === miembro.id
            ? {
                ...m,
                estado:
                  nuevoEstado,
              }
            : m
        )
    );

    setMensajeMiembros(
      `Miembro ${nuevoEstado === "ACTIVO" ? "activado" : "desactivado"} correctamente.`
    );
  }

  // =========================================================
  // CORREO GOOGLE
  // =========================================================

  function handleCorreoGoogleChange(
    id,
    value
  ) {
    setCorreoGoogleEditando(
      (prev) => ({
        ...prev,
        [id]: value,
      })
    );
  }

  async function guardarCorreoGoogle(
    miembro
  ) {
    const correo =
      (
        correoGoogleEditando[
          miembro.id
        ] || ""
      ).trim();

    setGuardandoMiembro(
      miembro.id
    );

    setMensajeMiembros(null);

    const {
      error,
    } = await supabase
      .from("miembros_rlt")
      .update({
        correo_google:
          correo || null,
        actualizado_en:
          new Date().toISOString(),
      })
      .eq(
        "id",
        miembro.id
      );

    if (error) {
      console.error(
        "Error guardando correo Google:",
        error
      );

      setMensajeMiembros(
        `No se pudo guardar el correo Google: ${error.message}`
      );

      setGuardandoMiembro(null);

      return;
    }

    setMiembrosRlt(
      (prev) =>
        prev.map((m) =>
          m.id === miembro.id
            ? {
                ...m,
                correo_google:
                  correo || null,
              }
            : m
        )
    );

    setMensajeMiembros(
      "Correo Google guardado correctamente."
    );

    setGuardandoMiembro(null);
  }

  // =========================================================
  // CARGANDO SESIÓN
  // =========================================================

  if (cargandoSesion) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  // =========================================================
  // LOGIN
  // =========================================================

  if (!session) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-container">

          <div className="dashboard-login">

            <h1>
              Panel administrativo
            </h1>

            <p>
              Ingresa para administrar
              el contenido de Turismo
              San Rafael.
            </p>

            <form
              onSubmit={handleLogin}
            >

              <div>
                <label>
                  Correo electrónico
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div>
                <label>
                  Contraseña
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              {errorLogin && (
                <p className="error-message">
                  {errorLogin}
                </p>
              )}

              <button type="submit">
                Ingresar
              </button>

            </form>

          </div>

        </div>
      </main>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        {/* ===================================================
            ENCABEZADO
        ==================================================== */}

        <header className="dashboard-header">

          <div>

            <span className="dashboard-eyebrow">
              ADMINISTRACIÓN
            </span>

            <h1>
              Panel de administración
            </h1>

            <p>
              Gestión del contenido
              de Turismo San Rafael.
            </p>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="dashboard-logout"
          >
            Cerrar sesión
          </button>

        </header>

        {/* ===================================================
            CHATBOT
        ==================================================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-eyebrow">
                CHATBOT
              </span>

              <h2>
                Preguntas sin responder
              </h2>

              <p>
                Preguntas realizadas
                por visitantes que
                requieren atención.
              </p>

            </div>

            <span className="dashboard-count">
              {
                preguntasSinResponder.length
              }
            </span>

          </div>

          {preguntasSinResponder.length ===
          0 ? (
            <div className="dashboard-empty">
              <p>
                No hay preguntas
                pendientes.
              </p>
            </div>
          ) : (
            <div className="dashboard-list">

              {preguntasSinResponder.map(
                (pregunta) => (
                  <article
                    key={pregunta.id}
                    className="dashboard-card"
                  >

                    <div>

                      <h3>
                        {
                          pregunta.pregunta
                        }
                      </h3>

                      {pregunta.identificacion && (
                        <p>
                          <strong>
                            Identificación:
                          </strong>{" "}
                          {
                            pregunta.identificacion
                          }
                        </p>
                      )}

                      {pregunta.correo_contacto && (
                        <p>
                          <strong>
                            Correo:
                          </strong>{" "}
                          {
                            pregunta.correo_contacto
                          }
                        </p>
                      )}

                      {pregunta.creado_en && (
                        <small>
                          {new Date(
                            pregunta.creado_en
                          ).toLocaleString(
                            "es-CO"
                          )}
                        </small>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        marcarComoAtendida(
                          pregunta.id
                        )
                      }
                    >
                      Marcar como atendida
                    </button>

                  </article>
                )
              )}

            </div>
          )}

        </section>

        {/* ===================================================
            ALOJAMIENTOS
        ==================================================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-eyebrow">
                CONTENIDO
              </span>

              <h2>
                Alojamientos (
                {hoteles.length}
                )
              </h2>

              <p>
                Administra los alojamientos
                que aparecen en Turismo
                San Rafael.
              </p>

            </div>

            <button
              type="button"
              onClick={
                prepararNuevoHotel
              }
            >
              + Nuevo alojamiento
            </button>

          </div>

          {/* FORMULARIO */}

          <div className="dashboard-form-card">

            <h3>
              {hotelEditando
                ? "Editar alojamiento"
                : "Nuevo alojamiento"}
            </h3>

            <form
              onSubmit={
                handleGuardarHotel
              }
            >

              <div className="dashboard-form-grid">

                <div>
                  <label>
                    Nombre
                  </label>

                  <input
                    name="nombre"
                    value={
                      nuevoHotel.nombre
                    }
                    onChange={
                      handleHotelChange
                    }
                    required
                  />
                </div>

                <div>
                  <label>
                    Categoría
                  </label>

                  <select
                    name="categoria"
                    value={
                      nuevoHotel.categoria
                    }
                    onChange={
                      handleHotelChange
                    }
                  >
                    <option>
                      Alojamiento rural
                    </option>

                    <option>
                      Alojamiento urbano
                    </option>

                    <option>
                      Hotel
                    </option>

                    <option>
                      Hostal
                    </option>

                    <option>
                      Cabaña
                    </option>

                    <option>
                      Finca
                    </option>

                    <option>
                      Otro
                    </option>
                  </select>
                </div>

                <div className="dashboard-form-full">

                  <label>
                    Descripción corta
                  </label>

                  <textarea
                    name="descripcion"
                    value={
                      nuevoHotel.descripcion
                    }
                    onChange={
                      handleHotelChange
                    }
                    rows="3"
                    required
                  />

                </div>

                <div className="dashboard-form-full">

                  <label>
                    Descripción completa
                  </label>

                  <textarea
                    name="descripcion_larga"
                    value={
                      nuevoHotel.descripcion_larga
                    }
                    onChange={
                      handleHotelChange
                    }
                    rows="5"
                  />

                </div>

                <div>

                  <label>
                    Ubicación
                  </label>

                  <input
                    name="ubicacion"
                    value={
                      nuevoHotel.ubicacion
                    }
                    onChange={
                      handleHotelChange
                    }
                  />

                </div>

                <div>

                  <label>
                    Instagram
                  </label>

                  <input
                    name="instagram_url"
                    value={
                      nuevoHotel.instagram_url
                    }
                    onChange={
                      handleHotelChange
                    }
                    placeholder="https://instagram.com/..."
                  />

                </div>

                <div>

                  <label>
                    WhatsApp
                  </label>

                  <input
                    name="whatsapp_url"
                    value={
                      nuevoHotel.whatsapp_url
                    }
                    onChange={
                      handleHotelChange
                    }
                    placeholder="https://wa.me/..."
                  />

                </div>

                <div>

                  <label>
                    Precio por noche
                  </label>

                  <input
                    type="number"
                    name="precio_por_noche"
                    value={
                      nuevoHotel.precio_por_noche
                    }
                    onChange={
                      handleHotelChange
                    }
                    min="0"
                  />

                </div>

                <div>

                  <label>
                    Capacidad de personas
                  </label>

                  <input
                    type="number"
                    name="capacidad_personas"
                    value={
                      nuevoHotel.capacidad_personas
                    }
                    onChange={
                      handleHotelChange
                    }
                    min="1"
                  />

                </div>

                <div className="dashboard-form-full">

                  <label>
                    Servicios
                  </label>

                  <textarea
                    name="servicios"
                    value={
                      nuevoHotel.servicios
                    }
                    onChange={
                      handleHotelChange
                    }
                    rows="5"
                    placeholder="Escribe un servicio por línea"
                  />

                </div>

                <div className="dashboard-form-full">

                  <label>
                    Imágenes
                  </label>

                  <textarea
                    name="imagenes"
                    value={
                      nuevoHotel.imagenes
                    }
                    onChange={
                      handleHotelChange
                    }
                    rows="5"
                    placeholder="Escribe una ruta de imagen por línea"
                  />

                </div>

                <div className="dashboard-form-full">

                  <label>
                    Indicaciones
                  </label>

                  <textarea
                    name="indicaciones"
                    value={
                      nuevoHotel.indicaciones
                    }
                    onChange={
                      handleHotelChange
                    }
                    rows="4"
                  />

                </div>

              </div>

              {mensajeHotel && (
                <p className="dashboard-message">
                  {mensajeHotel}
                </p>
              )}

              <div className="dashboard-form-actions">

                <button
                  type="submit"
                  disabled={
                    guardandoHotel
                  }
                >
                  {guardandoHotel
                    ? "Guardando..."
                    : hotelEditando
                    ? "Actualizar alojamiento"
                    : "Guardar alojamiento"}
                </button>

                {hotelEditando && (
                  <button
                    type="button"
                    onClick={
                      prepararNuevoHotel
                    }
                  >
                    Cancelar edición
                  </button>
                )}

              </div>

            </form>

          </div>

          {/* LISTA */}

          <div className="dashboard-list">

            {hoteles.length === 0 ? (
              <div className="dashboard-empty">

                <p>
                  No hay alojamientos
                  registrados.
                </p>

              </div>
            ) : (
              hoteles.map((hotel) => (
                <article
                  key={hotel.id}
                  className="dashboard-card"
                >

                  <div>

                    <div className="dashboard-card-top">

                      <h3>
                        {hotel.nombre}
                      </h3>

                      <span
                        className={
                          hotel.activo
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {hotel.activo
                          ? "Activo"
                          : "Oculto"}
                      </span>

                    </div>

                    {hotel.categoria && (
                      <p>
                        {
                          hotel.categoria
                        }
                      </p>
                    )}

                    {hotel.descripcion && (
                      <p>
                        {
                          hotel.descripcion
                        }
                      </p>
                    )}

                  </div>

                  <div className="dashboard-card-actions">

                    <a
                      href={
                        hotel.slug
                          ? `/hospedajes/${hotel.slug}`
                          : "/hospedajes"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver ficha
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        prepararEdicion(
                          hotel
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        cambiarActivoHotel(
                          hotel
                        )
                      }
                    >
                      {hotel.activo
                        ? "Ocultar"
                        : "Activar"}
                    </button>

                  </div>

                </article>
              ))
            )}

          </div>

        </section>

        {/* ===================================================
            MIEMBROS RLT
        ==================================================== */}

        <section className="dashboard-section">

          <div className="dashboard-section-header">

            <div>

              <span className="dashboard-eyebrow">
                RED LOCAL DE TURISMO
              </span>

              <h2>
                Miembros RLT
              </h2>

              <p>
                Administra las solicitudes
                de ingreso y los miembros
                de la Red Local de Turismo.
              </p>

            </div>

            <span className="dashboard-count">
              {miembrosRlt.length}
            </span>

          </div>

          {mensajeMiembros && (
            <div className="dashboard-message">
              {mensajeMiembros}
            </div>
          )}

          {/* =================================================
              SOLICITUDES PENDIENTES
          ================================================== */}

          <div className="dashboard-form-card">

            <div className="dashboard-section-header">

              <div>

                <h3>
                  Solicitudes pendientes
                </h3>

                <p>
                  Personas que solicitaron
                  ingresar a la RLT.
                </p>

              </div>

              <span className="dashboard-count">
                {solicitudesRlt.length}
              </span>

            </div>

            {cargandoMiembros ? (
              <p>
                Cargando solicitudes...
              </p>
            ) : solicitudesRlt.length ===
              0 ? (
              <div className="dashboard-empty">

                <p>
                  No hay solicitudes
                  pendientes.
                </p>

              </div>
            ) : (
              <div className="dashboard-list">

                {solicitudesRlt.map(
                  (solicitud) => (
                    <article
                      key={
                        solicitud.id
                      }
                      className="dashboard-card"
                    >

                      <div>

                        <div className="dashboard-card-top">

                          <h3>
                            {
                              solicitud.nombres
                            }{" "}
                            {
                              solicitud.apellidos
                            }
                          </h3>

                          <span className="status-active">
                            PENDIENTE
                          </span>

                        </div>

                        <p>
                          <strong>
                            Asociado:
                          </strong>{" "}
                          {
                            solicitud.nombre_asociado
                          }
                        </p>

                        <p>
                          <strong>
                            Sectores:
                          </strong>{" "}
                          {obtenerNombreSector(
                            solicitud.tipo_asociado
                          )}
                        </p>

                        {solicitud.cedula_nit && (
                          <p>
                            <strong>
                              Cédula / NIT:
                            </strong>{" "}
                            {
                              solicitud.cedula_nit
                            }
                          </p>
                        )}

                        {solicitud.correo_electronico && (
                          <p>
                            <strong>
                              Correo:
                            </strong>{" "}
                            {
                              solicitud.correo_electronico
                            }
                          </p>
                        )}

                        {solicitud.creado_en && (
                          <small>
                            Solicitud:
                            {" "}
                            {new Date(
                              solicitud.creado_en
                            ).toLocaleString(
                              "es-CO"
                            )}
                          </small>
                        )}

                      </div>

                      <div className="dashboard-card-actions">

                        <button
                          type="button"
                          onClick={() =>
                            aprobarSolicitud(
                              solicitud
                            )
                          }
                          disabled={
                            procesandoSolicitud ===
                            solicitud.id
                          }
                        >
                          {procesandoSolicitud ===
                          solicitud.id
                            ? "Procesando..."
                            : "Aprobar"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            rechazarSolicitud(
                              solicitud
                            )
                          }
                          disabled={
                            procesandoSolicitud ===
                            solicitud.id
                          }
                        >
                          Rechazar
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}

          </div>

          {/* =================================================
              MIEMBROS REGISTRADOS
          ================================================== */}

          <div className="dashboard-form-card">

            <div className="dashboard-section-header">

              <div>

                <h3>
                  Miembros registrados
                </h3>

                <p>
                  Miembros registrados
                  actualmente en la Red
                  Local de Turismo.
                </p>

              </div>

              <span className="dashboard-count">
                {miembrosRlt.length}
              </span>

            </div>

            {cargandoMiembros ? (
              <p>
                Cargando miembros...
              </p>
            ) : miembrosRlt.length ===
              0 ? (
              <div className="dashboard-empty">

                <p>
                  No hay miembros
                  registrados.
                </p>

              </div>
            ) : (
              <div className="dashboard-list">

                {miembrosRlt.map(
                  (miembro) => (
                    <article
                      key={
                        miembro.id
                      }
                      className="dashboard-card"
                    >

                      <div>

                        <div className="dashboard-card-top">

                          <h3>
                            {
                              miembro.nombres
                            }{" "}
                            {
                              miembro.apellidos
                            }
                          </h3>

                          <span
                            className={
                              miembro.estado ===
                              "ACTIVO"
                                ? "status-active"
                                : "status-inactive"
                            }
                          >
                            {
                              miembro.estado
                            }
                          </span>

                        </div>

                        <p>
                          <strong>
                            Asociado:
                          </strong>{" "}
                          {
                            miembro.nombre_asociado
                          }
                        </p>

                        <p>
                          <strong>
                            Sectores:
                          </strong>{" "}
                          {obtenerNombreSector(
                            miembro.tipo_asociado
                          )}
                        </p>

                        {miembro.cedula_nit && (
                          <p>
                            <strong>
                              Cédula / NIT:
                            </strong>{" "}
                            {
                              miembro.cedula_nit
                            }
                          </p>
                        )}

                        {miembro.correo_electronico && (
                          <p>
                            <strong>
                              Correo de contacto:
                            </strong>{" "}
                            {
                              miembro.correo_electronico
                            }
                          </p>
                        )}

                        {/* -------------------------------------
                            CORREO GOOGLE
                        -------------------------------------- */}

                        <div
                          style={{
                            marginTop:
                              "1rem",
                          }}
                        >

                          <label>
                            Correo Google
                          </label>

                          <div
                            style={{
                              display:
                                "flex",
                              gap:
                                "0.5rem",
                              flexWrap:
                                "wrap",
                              marginTop:
                                "0.4rem",
                            }}
                          >

                            <input
                              type="email"
                              value={
                                correoGoogleEditando[
                                  miembro.id
                                ] || ""
                              }
                              onChange={(
                                e
                              ) =>
                                handleCorreoGoogleChange(
                                  miembro.id,
                                  e.target
                                    .value
                                )
                              }
                              placeholder="correo@rlt-sanrafael.org"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                guardarCorreoGoogle(
                                  miembro
                                )
                              }
                              disabled={
                                guardandoMiembro ===
                                miembro.id
                              }
                            >
                              {guardandoMiembro ===
                              miembro.id
                                ? "Guardando..."
                                : "Guardar correo"}
                            </button>

                          </div>

                          <small>
                            Este será el correo
                            utilizado para
                            permitir el acceso
                            con Google.
                          </small>

                        </div>

                      </div>

                      <div className="dashboard-card-actions">

                        <button
                          type="button"
                          onClick={() =>
                            cambiarEstadoMiembro(
                              miembro
                            )
                          }
                        >
                          {miembro.estado ===
                          "ACTIVO"
                            ? "Desactivar"
                            : "Activar"}
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}