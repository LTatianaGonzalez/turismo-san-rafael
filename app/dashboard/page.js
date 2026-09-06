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
  const [session, setSession] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // --- Estado del formulario de login ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(null);

  // --- Estado de los datos de la encuesta ---
  const [respuestas, setRespuestas] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  // Al cargar la página, revisamos si ya hay una sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCargandoSesion(false);
    });

    // Esto escucha cambios de sesión (login/logout) mientras la página está abierta
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Cuando ya hay sesión, traemos los datos de la tabla
  useEffect(() => {
    if (!session) return;

    async function cargarDatos() {
      setCargandoDatos(true);
      const { data, error } = await supabase
        .from("respuestas_encuesta")
        .select("*")
        .order("creado_en", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setRespuestas(data);
      }
      setCargandoDatos(false);
    }

    cargarDatos();
  }, [session]);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorLogin(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorLogin("Correo o contraseña incorrectos.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (cargandoSesion) {
    return <p>Cargando...</p>;
  }

  // --- Si NO ha iniciado sesión: mostrar formulario de login ---
  if (!session) {
    return (
      <section style={{ maxWidth: 360, margin: "3rem auto" }}>
        <h1>Panel de administración</h1>
        <form onSubmit={handleLogin} style={{ display: "grid", gap: "1rem" }}>
          <label>
            Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Ingresar</button>
          {errorLogin && <p style={{ color: "crimson" }}>{errorLogin}</p>}
        </form>
      </section>
    );
  }

  // --- Si SÍ hay sesión: mostrar el dashboard ---
  const totalRespuestas = respuestas.length;

  const promedio = (campo) =>
    totalRespuestas === 0
      ? 0
      : respuestas.reduce((suma, r) => suma + Number(r[campo] || 0), 0) / totalRespuestas;

  const gastoPromedio = promedio("gasto_promedio").toFixed(0);
  const diasPromedio = promedio("dias_estadia").toFixed(1);

  // Datos para el gráfico de barras: promedio de cada indicador de percepción (escala 1-5)
  const datosIndicadores = [
    { indicador: "Seguridad", promedio: Number(promedio("percepcion_seguridad").toFixed(2)) },
    { indicador: "Interacción comunidad", promedio: Number(promedio("interaccion_comunidad").toFixed(2)) },
    { indicador: "Percepción ambiental", promedio: Number(promedio("percepcion_ambiental").toFixed(2)) },
    { indicador: "Buenas prácticas", promedio: Number(promedio("conocimiento_buenas_practicas").toFixed(2)) },
  ];

  // Datos para el gráfico de línea: cantidad de respuestas por día
  const conteoPorFecha = {};
  respuestas.forEach((r) => {
    const fecha = new Date(r.creado_en).toLocaleDateString("es-CO");
    conteoPorFecha[fecha] = (conteoPorFecha[fecha] || 0) + 1;
  });
  const datosPorFecha = Object.entries(conteoPorFecha).map(([fecha, cantidad]) => ({
    fecha,
    cantidad,
  }));

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Panel de administración</h1>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {cargandoDatos ? (
        <p>Cargando datos...</p>
      ) : totalRespuestas === 0 ? (
        <p>Todavía no hay respuestas registradas. Comparte el enlace de la encuesta.</p>
      ) : (
        <>
          {/* Tarjetas KPI */}
          <div style={{ display: "flex", gap: "1rem", margin: "1.5rem 0", flexWrap: "wrap" }}>
            <TarjetaKPI titulo="Encuestas respondidas" valor={totalRespuestas} />
            <TarjetaKPI titulo="Gasto promedio" valor={`$${gastoPromedio}`} />
            <TarjetaKPI titulo="Días de estadía (prom.)" valor={diasPromedio} />
          </div>

          {/* Gráfico de barras: percepción por indicador */}
          <h2>Percepción por indicador (escala 1 a 5)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosIndicadores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="indicador" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="promedio" fill="#0f766e" name="Promedio" />
            </BarChart>
          </ResponsiveContainer>

          {/* Gráfico de línea: respuestas por fecha */}
          <h2>Respuestas recibidas por día</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosPorFecha}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cantidad" stroke="#0f766e" name="N° de respuestas" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </section>
  );
}

// Componente pequeño reutilizable para las tarjetas de KPI
function TarjetaKPI({ titulo, valor }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "1rem 1.5rem",
        minWidth: 160,
      }}
    >
      <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>{titulo}</p>
      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>{valor}</p>
    </div>
  );
}