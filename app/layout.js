import "./globals.css";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

export const metadata = {
  title: "San Rafael, Antioquia - Único por naturaleza",
  description: "Portal turístico de la Red Local de Turismo de San Rafael",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="encabezado">
          <a href="/" className="encabezado__marca">
            San Rafael Turístico
          </a>
          <nav className="encabezado__nav">
            <a href="/">Inicio</a>
            <a href="/experiencias">Qué hacer</a>
            <a href="/la-red">La Red</a>
            <a href="/encuesta">Encuesta</a>
          </nav>
        </header>
        <main className="contenedor">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
