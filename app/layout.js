import "./globals.css";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Turismo San Rafael | Único por naturaleza",
  description:
    "Descubre San Rafael, Antioquia: naturaleza, experiencias, hospedajes y conexión con el territorio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>

        {/* =====================================================
            ENCABEZADO
        ===================================================== */}

        <header className="encabezado">

          <a
            href="/"
            className="encabezado__marca"
          >
            <img
              src="/logo/logo.png"
              alt="Turismo San Rafael"
              style={{
                width: "120px",
                height: "auto",
                display: "block",
              }}
            />
          </a>


          {/* =================================================
              NAVEGACIÓN PRINCIPAL
          ================================================= */}

          <nav
            className="encabezado__nav"
            aria-label="Navegación principal"
          >

            <a href="/">Inicio</a>
            <a href="/descubre">Descubre</a>
            <a href="/experiencias">Experiencias</a>
            <a href="/hospedajes">Hospedajes</a>
            <a href="/la-red">La Red</a>
            <a href="/acceso">Acceso RLT</a>

          </nav>

        </header>


        {/* =====================================================
            CONTENIDO
        ===================================================== */}

        <main>
          {children}
        </main>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Footer />


        {/* =====================================================
            CHATBOT
        ===================================================== */}

        <Chatbot />

      </body>
    </html>
  );
}