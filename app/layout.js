import "./globals.css";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Turismo San Rafael | Único por naturaleza",
  description:
    "Descubre San Rafael, Antioquia: naturaleza, experiencias, hospedajes, novedades y turismo sostenible.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="encabezado">
          <a href="/" className="encabezado__marca">
            <span>San Rafael</span>
            <small>Único por naturaleza</small>
          </a>
          <nav className="encabezado__nav" aria-label="Navegación principal">
            <a href="/">Inicio</a>
            <a href="/descubre">Descubre</a>
            <a href="/experiencias">Experiencias</a>
            <a href="/hospedajes">Hospedajes</a>
            <a href="/novedades">Novedades</a>
            <a href="/sostenibilidad">Sostenibilidad</a>
            <a href="/la-red">La Red</a>
          </nav>
        </header>
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
