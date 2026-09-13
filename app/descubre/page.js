const categorias = [
  ["🌊", "Agua y naturaleza", "Ríos, charcos, cascadas y paisajes para conectar con la naturaleza."],
  ["🥾", "Senderos y aventura", "Recorridos y actividades para conocer el territorio de otra manera."],
  ["🍲", "Gastronomía", "Sabores, productos y emprendimientos locales."],
  ["🤝", "Cultura y comunidad", "Historias, saberes y personas que hacen parte de San Rafael."],
  ["📍", "Lugares para visitar", "Puntos de interés que puedes incorporar a tu recorrido."],
  ["📅", "Eventos", "Actividades y acontecimientos que están pasando en el municipio."],
];

export default function DescubrePage() {
  return (
    <div className="pagina">
      <section className="pagina__intro">
        <span className="eyebrow">Guía del territorio</span>
        <h1>Descubre San Rafael</h1>
        <p>
          Encuentra en un solo lugar lugares para visitar, naturaleza,
          gastronomía, cultura, eventos y servicios para planificar tu visita.
        </p>
      </section>
      <div className="grid-tarjetas grid-tarjetas--grande">
        {categorias.map(([icono, titulo, texto]) => (
          <article className="tarjeta tarjeta--explorar" key={titulo}>
            <div className="icono-grande">{icono}</div>
            <h2>{titulo}</h2>
            <p>{texto}</p>
            <span className="enlace-falso">Explorar →</span>
          </article>
        ))}
      </div>
    </div>
  );
}
