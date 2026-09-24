export default function Footer() {
  return (
    <footer className="pie">
      <p className="pie__redes">
        <a
          href="https://www.facebook.com/toursanrafael/"
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>

        <a
          href="https://www.instagram.com/toursanrafael/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
      </p>

      <p>
        Contáctanos: (+57) 312 856 14 83 ·{" "}
        <a href="mailto:inforedtour@toursanrafael.com">
          inforedtour@toursanrafael.com
        </a>
      </p>

      <p>
        © {new Date().getFullYear()} Red Local de Turismo San Rafael
      </p>
    </footer>
  );
}