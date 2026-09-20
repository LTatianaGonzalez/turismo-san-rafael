"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { novedades } from "@/lib/novedades";
import { actividades } from "@/lib/actividades";

export default function HomePage() {
  const [novedadActual, setNovedadActual] = useState(0);

  const [mostrarCaminos, setMostrarCaminos] = useState(false);
  const [mostrarMonitoreo, setMostrarMonitoreo] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const experiencias = actividades.slice(0, 3);

  /* =====================================================
     NOVEDADES DESTACADAS
  ===================================================== */

  const novedadesDestacadas = novedades.filter(
    (novedad) => novedad.destacada
  );

  const tarjetasNovedades = [
    ...novedadesDestacadas.map((novedad) => ({
      tipo: "NUEVA EXPERIENCIA",
      categoria: novedad.categoria,
      etiqueta: novedad.etiqueta,
      titulo: novedad.titulo,
      resumen: novedad.resumen,
      boton: "Conocer la experiencia",
      monitoreo: false,
      caminos: true,
      href: `/novedades/${novedad.slug}`,
    })),

    {
      tipo: "TURISMO RESPONSABLE",
      categoria: "sostenibilidad",
      etiqueta: "Sistema de monitoreo",
      titulo: "Sistema de monitoreo en San Rafael",
      resumen:
        "Conoce cómo buscamos identificar los impactos económicos, sociales y ambientales del turismo en el territorio.",
      boton: "Más información",
      monitoreo: true,
      caminos: false,
    },
  ];

  /* =====================================================
     CARRUSEL AUTOMÁTICO
  ===================================================== */

  useEffect(() => {
    if (tarjetasNovedades.length <= 1) {
      return;
    }

    const intervalo = setInterval(() => {
      setNovedadActual((actual) => {
        return (actual + 1) % tarjetasNovedades.length;
      });
    }, 5000);

    return () => clearInterval(intervalo);
  }, [tarjetasNovedades.length]);

  /* =====================================================
     FORMULARIO DE REGISTRO
  ===================================================== */

  const [formulario, setFormulario] = useState({
    nombres: "",
    apellidos: "",
    cedula_nit: "",
    correo_electronico: "",
    nombre_asociado: "",
    tipo_asociado: [],
  });

  const [registroEnviado, setRegistroEnviado] = useState(false);
  const [errorRegistro, setErrorRegistro] = useState("");
  const [registrando, setRegistrando] = useState(false);

  /* =====================================================
     SECTORES DE LA RLT
  ===================================================== */

  const sectoresDisponibles = [
    {
      valor: "alimentos_bebidas",
      nombre: "Alimentos y bebidas",
    },
    {
      valor: "alojamiento_rural",
      nombre: "Alojamiento rural",
    },
    {
      valor: "alojamiento_urbano",
      nombre: "Alojamiento urbano",
    },
    {
      valor: "guianza",
      nombre: "Guianza",
    },
    {
      valor: "operadora",
      nombre: "Operadora",
    },
    {
      valor: "productor_oferente_experiencias",
      nombre: "Productor / Oferente de experiencias",
    },
  ];

  /* =====================================================
     CAMBIOS DEL FORMULARIO
  ===================================================== */

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function manejarCambioSector(valorSector) {
    setFormulario((anterior) => {
      const sectoresActuales = anterior.tipo_asociado || [];

      const yaSeleccionado =
        sectoresActuales.includes(valorSector);

      const nuevosSectores = yaSeleccionado
        ? sectoresActuales.filter(
            (sector) => sector !== valorSector
          )
        : [...sectoresActuales, valorSector];

      return {
        ...anterior,
        tipo_asociado: nuevosSectores,
      };
    });
  }

  /* =====================================================
     ENVIAR REGISTRO
  ===================================================== */

  async function manejarRegistro(e) {
    e.preventDefault();

    setRegistrando(true);
    setErrorRegistro("");

    if (
      !formulario.tipo_asociado ||
      formulario.tipo_asociado.length === 0
    ) {
      setErrorRegistro(
        "Selecciona al menos una actividad o sector."
      );

      setRegistrando(false);
      return;
    }

    const { error } = await supabase
      .from("solicitudes_rlt")
      .insert([
        {
          nombres: formulario.nombres,
          apellidos: formulario.apellidos,
          cedula_nit: formulario.cedula_nit,
          correo_electronico: formulario.correo_electronico,
          nombre_asociado: formulario.nombre_asociado,
          tipo_asociado: formulario.tipo_asociado,
        },
      ]);

    if (error) {
      console.error(error);

      setErrorRegistro(
        "No fue posible enviar la solicitud. Intenta nuevamente."
      );

      setRegistrando(false);
      return;
    }

    setRegistrando(false);
    setRegistroEnviado(true);
  }

  /* =====================================================
     CERRAR REGISTRO
  ===================================================== */

  function cerrarRegistro() {
    setMostrarRegistro(false);
    setRegistroEnviado(false);
    setErrorRegistro("");

    setFormulario({
      nombres: "",
      apellidos: "",
      cedula_nit: "",
      correo_electronico: "",
      nombre_asociado: "",
      tipo_asociado: [],
    });
  }

  /* =====================================================
     NOVEDAD ACTUAL
  ===================================================== */

  const novedad = tarjetasNovedades[novedadActual];

  return (
    <div>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero hero--home">

        <div className="hero__contenido">

          <span className="eyebrow">
            San Rafael · Antioquia
          </span>

          <h1>
            Descubre un territorio único por naturaleza.
          </h1>

          <p>
            Ríos, montañas, biodiversidad, cultura y experiencias
            comunitarias. Encuentra todo lo que necesitas para
            vivir San Rafael.
          </p>

          <div className="hero__acciones">

            <a
              href="/descubre"
              className="boton boton-primario"
            >
              Explorar San Rafael
            </a>

            <a
              href="/hospedajes"
              className="boton boton-secundario"
            >
              Buscar hospedaje
            </a>

          </div>

        </div>

        <div
          className="hero__visual"
          aria-label="San Rafael, destino de naturaleza"
        >

          <div className="hero__badge">
            Naturaleza · Aventura · Comunidad
          </div>

          <div className="hero__circulo">
            SAN
            <br />
            RAFAEL
          </div>

        </div>

      </section>

      {/* =====================================================
          BUSCADOR TURÍSTICO
      ===================================================== */}

      <section className="buscador-turistico">

        <div>

          <span className="eyebrow">
            Planifica tu visita
          </span>

          <h2>
            ¿Qué quieres encontrar en San Rafael?
          </h2>

        </div>

        <div className="buscador-turistico__acciones">

          <a
            href="/descubre"
            className="tarjeta-mini"
          >
            🗺️
            <strong>
              Descubrir lugares
            </strong>
            <span>
              Ríos, cascadas, cultura y más
            </span>
          </a>

          <a
            href="/experiencias"
            className="tarjeta-mini"
          >
            🌿
            <strong>
              Vivir experiencias
            </strong>
            <span>
              Aventura, naturaleza y comunidad
            </span>
          </a>

          <a
            href="/hospedajes"
            className="tarjeta-mini"
          >
            🏡
            <strong>
              Encontrar hospedaje
            </strong>
            <span>
              Consulta opciones y reserva
            </span>
          </a>

        </div>

      </section>

      {/* =====================================================
          CARRUSEL DE NOVEDADES
      ===================================================== */}

      <section className="seccion">

        <div className="seccion__cabecera">

          <div>

            <span className="eyebrow">
              Lo nuevo del territorio
            </span>

            <h2>
              Novedades
            </h2>

          </div>

        </div>

        {novedad && (

          <article className="novedad-destacada">

            <div className="novedad-destacada__imagen">

              <span>
                {novedad.categoria}
              </span>

            </div>

            <div className="novedad-destacada__contenido">

              <span className="chip">
                {novedad.etiqueta}
              </span>

              <h3>
                {novedad.titulo}
              </h3>

              <p>
                {novedad.resumen}
              </p>

              {novedad.caminos ? (

                <button
                  type="button"
                  className="boton boton-primario"
                  onClick={() =>
                    setMostrarCaminos(true)
                  }
                >
                  Conocer la experiencia
                </button>

              ) : (

                <button
                  type="button"
                  className="boton boton-primario"
                  onClick={() =>
                    setMostrarMonitoreo(true)
                  }
                >
                  Más información
                </button>

              )}

            </div>

          </article>

        )}

        {tarjetasNovedades.length > 1 && (

          <div className="novedades-indicadores">

            {tarjetasNovedades.map(
              (tarjeta, index) => (

                <button
                  key={index}
                  type="button"
                  className={
                    index === novedadActual
                      ? "novedad-indicador activo"
                      : "novedad-indicador"
                  }
                  onClick={() =>
                    setNovedadActual(index)
                  }
                  aria-label={
                    `Mostrar ${tarjeta.titulo}`
                  }
                />

              )
            )}

          </div>

        )}

      </section>

      {/* =====================================================
          EXPERIENCIAS
      ===================================================== */}

      <section className="seccion seccion--suave">

        <div className="seccion__cabecera">

          <div>

            <span className="eyebrow">
              Vive el territorio
            </span>

            <h2>
              Experiencias para descubrir
            </h2>

          </div>

          <a href="/experiencias">
            Ver experiencias →
          </a>

        </div>

        <div className="grid-tarjetas">

          {experiencias.map((a) => (

            <article
              key={a.id}
              className="tarjeta"
            >

              <span className="chip">
                {a.categoria}
              </span>

              <h3>
                {a.nombre}
              </h3>

              <p>
                {a.descripcion}
              </p>

            </article>

          ))}

        </div>

      </section>

      {/* =====================================================
          MODAL
          LOS CAMINOS DEL AGUA
      ===================================================== */}

      {mostrarCaminos && (

        <div
          className="monitoreo-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target === e.currentTarget
            ) {
              setMostrarCaminos(false);
            }

          }}
        >

          <div className="monitoreo-modal caminos-modal">

            <button
              type="button"
              className="monitoreo-modal__cerrar"
              onClick={() =>
                setMostrarCaminos(false)
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <span className="eyebrow">
              Nueva experiencia
            </span>

            <h2>
              Los Caminos del Agua
            </h2>

            <p className="caminos-modal__intro">
              Una experiencia para descubrir San Rafael a través
              del agua, el territorio, la naturaleza y las
              conexiones que hacen parte de la vida del municipio.
            </p>

            <div className="caminos-rutas">

              <article className="camino-ruta">

                <span className="camino-ruta__numero">
                  01
                </span>

                <div>

                  <span className="camino-ruta__categoria">
                    Transformación
                  </span>

                  <h3>
                    La Travesía de los Ciclos
                  </h3>

                  <div className="camino-ruta__datos">

                    <span>
                      🕒 4 días / 3 noches
                    </span>

                    <span>
                      👥 4 a 12 personas
                    </span>

                  </div>

                </div>

              </article>

              <article className="camino-ruta">

                <span className="camino-ruta__numero">
                  02
                </span>

                <div>

                  <span className="camino-ruta__categoria">
                    Conexión
                  </span>

                  <h3>
                    Equilibrio y Conexión
                  </h3>

                  <div className="camino-ruta__datos">

                    <span>
                      🕒 3 días / 2 noches
                    </span>

                    <span>
                      👥 Hasta 10 personas
                    </span>

                  </div>

                </div>

              </article>

              <article className="camino-ruta">

                <span className="camino-ruta__numero">
                  03
                </span>

                <div>

                  <span className="camino-ruta__categoria">
                    Exploración
                  </span>

                  <h3>
                    El Sendero de los Ríos
                  </h3>

                  <div className="camino-ruta__datos">

                    <span>
                      🕒 3 días / 2 noches
                    </span>

                    <span>
                      👥 4 a 10 personas
                    </span>

                  </div>

                </div>

              </article>

            </div>

            <div className="caminos-seccion">

              <span className="eyebrow">
                El territorio
              </span>

              <h3>
                Una experiencia conectada con San Rafael
              </h3>

              <p>
                Los Caminos del Agua proponen una forma de
                conocer el territorio desde sus paisajes,
                sus aguas, la naturaleza y las experiencias
                que conectan a quienes visitan el municipio
                con su entorno.
              </p>

            </div>

            <div className="caminos-responsable">

              <h3>
                Turismo responsable
              </h3>

              <div className="caminos-principios">

                <span>
                  💧 Cuidado del agua
                </span>

                <span>
                  🌱 Protección de la naturaleza
                </span>

                <span>
                  🤝 Conexión con la comunidad
                </span>

                <span>
                  ♻️ Manejo responsable de residuos
                </span>

                <span>
                  🌿 Respeto por los espacios turísticos
                </span>

              </div>

              <div className="caminos-modal__acciones">

                <a
                  href="https://www.loscaminosdelagua.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boton boton-primario"
                >
                  Conocer el sitio oficial ↗
                </a>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          MODAL
          SISTEMA DE MONITOREO
      ===================================================== */}

      {mostrarMonitoreo && (

        <div
          className="monitoreo-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target === e.currentTarget
            ) {
              setMostrarMonitoreo(false);
            }

          }}
        >

          <div className="monitoreo-modal">

            <button
              type="button"
              className="monitoreo-modal__cerrar"
              onClick={() =>
                setMostrarMonitoreo(false)
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <span className="eyebrow">
              Turismo responsable
            </span>

            <h2>
              Sistema de monitoreo en San Rafael
            </h2>

            <p>
              El turismo debe contribuir al bienestar
              del territorio. Por eso buscamos conocer
              sus impactos económicos, sociales y ambientales.
            </p>

            <div className="monitoreo-modal__dimensiones">

              <article>

                <div>
                  💰
                </div>

                <h3>
                  Dimensión económica
                </h3>

                <p>
                  Conocer cómo el turismo contribuye a la
                  economía local y al consumo de productos
                  y servicios del municipio.
                </p>

              </article>

              <article>

                <div>
                  🤝
                </div>

                <h3>
                  Dimensión social
                </h3>

                <p>
                  Conocer la percepción de los visitantes
                  y su relación con la comunidad local.
                </p>

              </article>

              <article>

                <div>
                  🌱
                </div>

                <h3>
                  Dimensión ambiental
                </h3>

                <p>
                  Identificar prácticas relacionadas con
                  el cuidado del agua, los residuos,
                  la naturaleza y los espacios turísticos.
                </p>

              </article>

            </div>

            <div className="monitoreo-modal__cierre">

              <h3>
                Ayúdanos a conocer el impacto del turismo
              </h3>

              <p>
                Tu experiencia aporta información para
                mejorar la gestión turística y la
                sostenibilidad de San Rafael.
              </p>

              <button
                type="button"
                className="boton boton-primario"
                onClick={() => {
                  setMostrarMonitoreo(false);
                  setMostrarRegistro(true);
                }}
              >
                Regístrate aquí ↗
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          MODAL
          REGISTRO
      ===================================================== */}

      {mostrarRegistro && (

        <div
          className="monitoreo-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              cerrarRegistro();
            }
          }}
        >

          <div className="monitoreo-modal modal-registro">

            <button
              type="button"
              className="monitoreo-modal__cerrar"
              onClick={cerrarRegistro}
              aria-label="Cerrar"
            >
              ×
            </button>

            {!registroEnviado ? (

              <>

                <span className="eyebrow">
                  Red Local de Turismo
                </span>

                <h2>
                  Solicitud para ser parte de la RLT
                </h2>

                <p>
                  Completa la información para solicitar tu
                  vinculación a la Red Local de Turismo y al
                  sistema de monitoreo de San Rafael.
                </p>

                <form
                  onSubmit={manejarRegistro}
                  className="formulario-registro"
                >

                  <div className="campo-formulario">

                    <label htmlFor="nombres">
                      Nombres
                    </label>

                    <input
                      id="nombres"
                      name="nombres"
                      type="text"
                      value={formulario.nombres}
                      onChange={manejarCambio}
                      placeholder="Nombres"
                      required
                    />

                  </div>

                  <div className="campo-formulario">

                    <label htmlFor="apellidos">
                      Apellidos
                    </label>

                    <input
                      id="apellidos"
                      name="apellidos"
                      type="text"
                      value={formulario.apellidos}
                      onChange={manejarCambio}
                      placeholder="Apellidos"
                      required
                    />

                  </div>

                  <div className="campo-formulario">

                    <label htmlFor="cedula_nit">
                      Cédula / NIT
                    </label>

                    <input
                      id="cedula_nit"
                      name="cedula_nit"
                      type="text"
                      value={formulario.cedula_nit}
                      onChange={manejarCambio}
                      placeholder="Cédula o NIT"
                      required
                    />

                  </div>

                  <div className="campo-formulario">

                    <label htmlFor="correo_electronico">
                      Correo electrónico
                    </label>

                    <input
                      id="correo_electronico"
                      name="correo_electronico"
                      type="email"
                      value={formulario.correo_electronico}
                      onChange={manejarCambio}
                      placeholder="correo@ejemplo.com"
                      required
                    />

                  </div>

                  <div className="campo-formulario">

                    <label htmlFor="nombre_asociado">
                      Nombre del asociado
                    </label>

                    <input
                      id="nombre_asociado"
                      name="nombre_asociado"
                      type="text"
                      value={formulario.nombre_asociado}
                      onChange={manejarCambio}
                      placeholder="Ej: Hotel Pepito Pérez"
                      required
                    />

                  </div>

                  {/* =====================================================
                      ACTIVIDADES / SECTORES
                  ===================================================== */}

                  <div className="campo-formulario campo-formulario--sectores">

                    <label>
                      ¿En qué actividades participas? *
                    </label>

                    <p className="campo-ayuda">
                      Puedes seleccionar una o varias opciones según
                      las actividades que desarrollas.
                    </p>

                    <div className="sectores-registro">

                      {sectoresDisponibles.map((sector) => (

                        <label
                          key={sector.valor}
                          className="sector-checkbox"
                        >

                          <input
                            type="checkbox"
                            name="tipo_asociado"
                            value={sector.valor}
                            checked={formulario.tipo_asociado.includes(
                              sector.valor
                            )}
                            onChange={() =>
                              manejarCambioSector(
                                sector.valor
                              )
                            }
                          />

                          <span>
                            {sector.nombre}
                          </span>

                        </label>

                      ))}

                    </div>

                  </div>

                  {errorRegistro && (

                    <p className="mensaje--error">
                      {errorRegistro}
                    </p>

                  )}

                  <div className="formulario-registro__acciones">

                    <button
                      type="button"
                      className="boton boton-secundario"
                      onClick={cerrarRegistro}
                      disabled={registrando}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="boton boton-primario"
                      disabled={registrando}
                    >
                      {registrando
                        ? "Enviando..."
                        : "Enviar solicitud"}
                    </button>

                  </div>

                </form>

              </>

            ) : (

              <div className="registro-exitoso">

                <div className="registro-exitoso__icono">
                  ✓
                </div>

                <h3>
                  Solicitud enviada
                </h3>

                <p>
                  Hemos recibido tu solicitud para formar parte
                  de la Red Local de Turismo. La información será
                  revisada por el equipo encargado de la red.
                </p>

                <p>
                  Si tu solicitud es aprobada, se te indicarán
                  los pasos para activar tu cuenta de acceso.
                </p>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}