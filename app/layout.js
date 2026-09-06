import Chatbot from "@/components/Chatbot";

export const metadata = {
  title: "Turismo San Rafael - Antioquia",
  description: "Portal turístico de la Red Local de Turismo de San Rafael",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", color: "#1f2937" }}>
        <header
          style={{
            padding: "1rem 2rem",
            background: "#0f766e",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>San Rafael Turístico</strong>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            <a href="/" style={{ color: "white", textDecoration: "none" }}>
              Inicio
            </a>
            <a href="/encuesta" style={{ color: "white", textDecoration: "none" }}>
              Encuesta de visitante
            </a>
            <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>
              Administración
            </a>
          </nav>
        </header>
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>{children}</main>
        <Chatbot />
      </body>
    </html>
  );
}
