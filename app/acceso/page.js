"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AccesoRLTPage() {
  const [cargando, setCargando] = useState(true);
  const [iniciandoSesion, setIniciandoSesion] =
    useState(false);

  const [usuario, setUsuario] = useState(null);
  const [miembro, setMiembro] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");


  /* =====================================================
     CARGAR MIEMBRO
  ===================================================== */

  async function cargarMiembro(user) {
    setCargando(true);
    setError("");
    setMensaje("");

    if (!user?.email) {
      setUsuario(null);
      setMiembro(null);
      setCargando(false);
      return;
    }

    setUsuario(user);

    const { data, error } = await supabase
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
      .eq(
        "correo_google",
        user.email
      )
      .eq(
        "estado",
        "ACTIVO"
      )
      .maybeSingle();

    if (error) {
      console.error(error);

      setError(
        "No fue posible verificar tu acceso."
      );

      setMiembro(null);
      setCargando(false);

      return;
    }

    if (!data) {

      setMiembro(null);

      setMensaje(
        "Tu cuenta de Google no tiene una vinculación activa con la Red Local de Turismo."
      );

      setCargando(false);

      return;
    }

    setMiembro(data);

    setCargando(false);

    /*
     * Intentamos abrir el formulario en una pestaña nueva.
     * Algunos navegadores pueden bloquearla por venir de un
     * redireccionamiento, por eso dejamos también el botón
     * manual como respaldo.
     */

    if (data.formulario_url) {

      setTimeout(() => {

        const ventana = window.open(
          data.formulario_url,
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
  }


  /* =====================================================
     INICIO
  ===================================================== */

  useEffect(() => {

    let activo = true;

    async function iniciar() {

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!activo) return;

      if (user) {
        await cargarMiembro(user);
      } else {
        setUsuario(null);
        setMiembro(null);
        setCargando(false);
      }
    }

    iniciar();


    const {
      data: {
        subscription,
      },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        if (!activo) return;

        if (session?.user) {
          await cargarMiembro(
            session.user
          );
        } else {
          setUsuario(null);
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

    const {
      error,
    } = await supabase.auth.signInWithOAuth({

      provider: "google",

      options: {
        redirectTo:
          `${window.location.origin}/acceso`,
      },

    });

    if (error) {
      console.error(error);

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
    setMiembro(null);
    setMensaje("");
    setError("");
  }


  /* =====================================================
     CARGANDO
  ===================================================== */

  if (cargando) {

    return (
      <main className="acceso-rlt">

        <div className="acceso-rlt__card">

          <p>
            Verificando acceso...
          </p>

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
            Este acceso es exclusivamente para miembros
            activos de la Red Local de Turismo.
          </p>


          {error && (

            <p className="mensaje--error">
              {error}
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
     USUARIO SIN VINCULACIÓN ACTIVA
  ===================================================== */

  if (!miembro) {

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
            no tiene actualmente una vinculación activa
            con la Red Local de Turismo.
          </p>

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
            DATOS
        ================================================= */}

        <div className="acceso-rlt__datos">

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
            CERRAR
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