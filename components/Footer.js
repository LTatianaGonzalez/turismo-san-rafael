export default function Footer() {
  return (
    <footer className="pie">
      <p>
        <a href="https://www.facebook.com/toursanrafael/" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href="https://www.instagram.com/toursanrafael/" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </p>
      <p>Contáctanos: (+57) 312 856 14 83 · redlocal@toursanrafael.com</p>
      <p>
        © {new Date().getFullYear()} Red Local de Turismo San Rafael · <a href="/dashboard">Acceso administrativo</a>
      </p>
    </footer>
  );
}
