"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AccesoRLTPage() {
  const router = useRouter();

  const [cargando, setCargando] = useState(true);
  const [iniciandoSesion, setIniciandoSesion] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [miembro, setMiembro] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     CARGAR PERFIL RLT
  ===================================================== */

  async function cargarPerfilRLT(user) {
    setCargando(true);
    setError("");
    setMensaje("");
    setMiembro(null);

    if (!user?.id) {
      setUsuario(null);
      setPerfil(null);
      setCargando(false);
      return;
    }

    setUsuario(user);

    /* =================================================
       1. BUSCAR USUARIO EN usuarios_rlt
    ================================================= */

    const { data: perfilData, error: perfilError } = await supabase
      .from("usuarios_rlt")
      .select(`
        id,
        nombre,
        telefono,
        correo,
        rol,
        creado_en
      `)
      .eq("id", user.id)
      .maybeSingle();

    if (perfilError) {
      console.error("Error usuarios_rlt:", perfilError);

      setPerfil(null);
      setMiembro(null);
      setError(
        "No fue posible verificar tu perfil en la Red Local de Turismo."
      );
      setCargando(false);

      return;
    }

    /* =================================================
       CUENTA NO REGISTRADA
    ================================================= */

    if (!perfilData) {
      setPerfil(null);
      setMiembro(null);

      setMensaje(
        "Tu cuenta de Google no está registrada como usuario de la Red Local de Turismo."
      );

      setCargando(false);

      return;
    }

    setPerfil(perfilData);

    /* =================================================
       OBTENER ROL NORMALIZADO
    ================================================= */

    const rol = String(perfilData.rol || "").toLowerCase().trim();

    /* =================================================
       2. ADMIN → DASHBOARD

       IMPORTANTE:
       Un ADMIN NO necesita estar en miembros_rlt.
    ================================================= */

    if (rol === "admin") {
      setMiembro(null);
      setCargando(false);

      router.replace("/dashboard");

      return;
    }

    /* =================================================
       3. MIEMBRO → BUSCAR ASOCIADO
    ================================================= */

    if (rol === "miembro") {
      const correoGoogle = user.email?.toLowerCase().trim();

      if (!correoGoogle) {
        setMiembro(null);

        setError(
          "No fue posible identificar el correo de tu cuenta de Google."
        );

        setCargando(false);

        return;
      }

      const { data: miembroData, error: miembroError } = await supabase
        .from("miembros_rlt")
        .select(`
          id,
          nombres,
          apellidos,
          correo_electronico,
          correo_google,
          nombre_asociado,
          tipo_asociado,
          estado,
          formulario_url
        `)
        .eq("correo_google", correoGoogle)
        .eq("estado", "ACTIVO")
        .maybeSingle();

      if (miembroError) {
        console.error("Error miembros_rlt:", miembroError);

        setMiembro(null);

        setError(
          "Tu usuario está registrado, pero no fue posible verificar la información del asociado."
        );

        setCargando(false);

        return;
      }

      /* ===============================================
         MIEMBRO SIN VINCULACIÓN ACTIVA
      =============================================== */

      if (!miembroData) {
        setMiembro(null);

        setMensaje(
          "Tu usuario RLT está registrado como miembro, pero todavía no tiene una vinculación activa con un asociado."
        );

        setCargando(false);

        return;
      }

      /* ===============================================
         MIEMBRO ACTIVO
      =============================================== */

      setMiembro(miembroData);
      setCargando(false);

      /*
       * Abrir automáticamente el formulario si existe.
       */
      if (miembroData.formulario_url) {
        setTimeout(() => {
          const ventana = window.open(
            miembroData.formulario_url,
            "_blank",
            "noopener,noreferrer"
          );

          if (!ventana) {
            console.log(
              "El navegador bloqueó la nueva pestaña."
            );
          }
        }, 500);
      }

      return;
    }

    /* =================================================
       ROL NO VÁLIDO
    ================================================= */

    setPerfil(null);
    setMiembro(null);

    setError(
      "Tu cuenta tiene un rol que no está habilitado para acceder al sistema."
    );

    setCargando(false);
  }

  /* =====================================================
     INICIO
  ===================================================== */

  useEffect(() => {
    let activo = true;

    async function iniciar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!activo) return;

      if (user) {
        await cargarPerfilRLT(user);
      } else {
        setUsuario(null);
        setPerfil(null);
        setMiembro(null);
        setCargando(false);
      }
    }

    iniciar();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!activo) return;

        if (session?.user) {
          await cargarPerfilRLT(session.user);
        } else {
          setUsuario(null);
          setPerfil(null);
          setMiembro(null);
          setCargando(false);
        }
      }
    );

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =====================================================
     INICIAR CON GOOGLE
  ===================================================== */

  async function iniciarSesionGoogle() {
    setIniciandoSesion(true);
    setError("");
    setMensaje("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo: `${window.location.origin}/acceso`,
      },
    });

    if (error) {
      console.error("Error Google:", error);

      setError(
        "No fue posible iniciar sesión con Google."
      );

      setIniciandoSesion(false);
    }
  }

  /* =====================================================
     CERRAR SESIÓN
  ===================================================== */

  async function cerrarSesion() {
    await supabase.auth.signOut();

    setUsuario(null);
    setPerfil(null);
    setMiembro(null);

    setMensaje("");
    setError("");

    setCargando(false);
  }

  /* =====================================================
     CARGANDO
  ===================================================== */

  if (cargando) {
    return (
      <main className="acceso-rlt">
        <div className="acceso-rlt__card">
          <p>Verificando acceso...</p>
        </div>
      </main>
    );
  }

  /* =====================================================
     SIN SESIÓN
  ===================================================== */

  if (!usuario) {
    return (
      <main className="acceso-rlt">
        <div className="acceso-rlt__card">

          <span className="eyebrow">
            Red Local de Turismo
          </span>

          <h1>
            Acceso RLT
          </h1>

          <p>
            Este acceso es exclusivamente para usuarios
            registrados de la Red Local de Turismo.
          </p>

          {error && (
            <p className="mensaje--error">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="mensaje">
              {mensaje}
            </p>
          )}

          <button
            type="button"
            className="boton boton-primario acceso-rlt__google"
            onClick={iniciarSesionGoogle}
            disabled={iniciandoSesion}
          >
            {iniciandoSesion
              ? "Conectando..."
              : "Continuar con Google"}
          </button>

          <p className="acceso-rlt__nota">
            Usa la cuenta de Google Workspace que te
            haya sido asignada por la Red Local de Turismo.
          </p>

        </div>
      </main>
    );
  }

  /* =====================================================
     USUARIO NO REGISTRADO
  ===================================================== */

  if (!perfil) {
    return (
      <main className="acceso-rlt">
        <div className="acceso-rlt__card">

          <span className="eyebrow">
            Acceso RLT
          </span>

          <h1>
            Acceso no habilitado
          </h1>

          <p>
            La cuenta:
          </p>

          <strong>
            {usuario.email}
          </strong>

          <p>
            no está registrada actualmente en la Red Local
            de Turismo.
          </p>

          {mensaje && (
            <p className="mensaje">
              {mensaje}
            </p>
          )}

          {error && (
            <p className="mensaje--error">
              {error}
            </p>
          )}

          <button
            type="button"
            className="boton boton-secundario"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </div>
      </main>
    );
  }

  /* =====================================================
     ADMINISTRADOR

     Este bloque evita que el ADMIN llegue al JSX
     de miembro mientras router.replace procesa
     la navegación.
  ===================================================== */

  const rolActual = String(perfil.rol || "")
    .toLowerCase()
    .trim();

  if (rolActual === "admin") {
    return (
      <main className="acceso-rlt">
        <div className="acceso-rlt__card">
          <p>Ingresando al panel administrativo...</p>
        </div>
      </main>
    );
  }

  /* =====================================================
     MIEMBRO SIN VINCULACIÓN ACTIVA
  ===================================================== */

  if (rolActual === "miembro" && !miembro) {
    return (
      <main className="acceso-rlt">
        <div className="acceso-rlt__card">

          <span className="eyebrow">
            Miembro RLT
          </span>

          <h1>
            Acceso pendiente
          </h1>

          <p>
            La cuenta:
          </p>

          <strong>
            {usuario.email}
          </strong>

          <p>
            está registrada como miembro, pero todavía no
            tiene una vinculación activa con un asociado de
            la Red Local de Turismo.
          </p>

          {mensaje && (
            <p className="mensaje">
              {mensaje}
            </p>
          )}

          {error && (
            <p className="mensaje--error">
              {error}
            </p>
          )}

          <button
            type="button"
            className="boton boton-secundario"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </div>
      </main>
    );
  }

  /* =====================================================
     PROTECCIÓN EXTRA

     Si por alguna razón miembro sigue siendo null,
     nunca intentamos leer miembro.nombres.
  ===================================================== */

  if (!miembro) {
    return (
      <main className="acceso-rlt">
        <div className="acceso-rlt__card">

          <span className="eyebrow">
            Acceso RLT
          </span>

          <h1>
            No fue posible cargar tu información
          </h1>

          <p>
            No se encontró la información necesaria para
            mostrar tu acceso a la Red Local de Turismo.
          </p>

          {error && (
            <p className="mensaje--error">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="mensaje">
              {mensaje}
            </p>
          )}

          <button
            type="button"
            className="boton boton-secundario"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </div>
      </main>
    );
  }

  /* =====================================================
     MIEMBRO ACTIVO
  ===================================================== */

  return (
    <main className="acceso-rlt">

      <div className="acceso-rlt__card acceso-rlt__activo">

        <span className="eyebrow">
          Miembro activo
        </span>

        <h1>
          Hola, {miembro.nombres}
        </h1>

        <p>
          Has ingresado al espacio de monitoreo de la
          Red Local de Turismo.
        </p>

        {/* =================================================
            DATOS DEL USUARIO
        ================================================= */}

        <div className="acceso-rlt__datos">

          <div>
            <small>
              Usuario
            </small>

            <strong>
              {perfil.nombre || miembro.nombres}
            </strong>
          </div>

          <div>
            <small>
              Rol
            </small>

            <strong>
              Miembro
            </strong>
          </div>

          <div>
            <small>
              Asociado
            </small>

            <strong>
              {miembro.nombre_asociado}
            </strong>
          </div>

          <div>
            <small>
              Sector
            </small>

            <strong>
              {obtenerNombreSector(
                miembro.tipo_asociado
              )}
            </strong>
          </div>

        </div>

        {/* =================================================
            FORMULARIO
        ================================================= */}

        {miembro.formulario_url ? (

          <div className="acceso-rlt__formulario">

            <h2>
              Formulario de monitoreo
            </h2>

            <p>
              Accede al formulario correspondiente a tu
              sector para registrar la información solicitada.
            </p>

            <a
              href={miembro.formulario_url}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton-primario"
            >
              Abrir mi formulario ↗
            </a>

          </div>

        ) : (

          <div className="acceso-rlt__sin-formulario">

            <h2>
              Formulario pendiente
            </h2>

            <p>
              Tu cuenta está activa, pero todavía no se ha
              asignado el formulario correspondiente.
            </p>

          </div>

        )}

        {/* =================================================
            CERRAR SESIÓN
        ================================================= */}

        <button
          type="button"
          className="boton boton-secundario"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>

      </div>

    </main>
  );
}

/* ============================================================
   NOMBRE DEL SECTOR
============================================================ */

function obtenerNombreSector(tipos) {
  const sectores = {
    alimentos_bebidas: "Alimentos / Bebidas",
    alojamiento_rural: "Alojamiento rural",
    alojamiento_urbano: "Alojamiento urbano",
    guianza: "Guianza",
    operadora: "Operadora",
    productor_oferente_experiencias:
      "Productor / Oferente de experiencias",
  };

  if (!Array.isArray(tipos)) {
    return sectores[tipos] || tipos || "Sin sector";
  }

  return tipos
    .map((tipo) => sectores[tipo] || tipo)
    .join(" · ");
}