export const categoriasNovedades = [
  { slug: "todas", nombre: "Todas" },
  { slug: "experiencias", nombre: "Experiencias" },
  { slug: "eventos", nombre: "Eventos" },
  { slug: "naturaleza", nombre: "Naturaleza" },
  { slug: "cultura", nombre: "Cultura" },
  { slug: "sostenibilidad", nombre: "Sostenibilidad" },
  { slug: "comunidad", nombre: "Comunidad" },
];

export const novedades = [
  {
    slug: "los-caminos-del-agua",
    titulo: "Los Caminos del Agua",
    categoria: "experiencias",
    etiqueta: "Nueva experiencia",
    resumen:
      "Una nueva propuesta para descubrir San Rafael desde sus aguas, sus paisajes y las historias que conectan al territorio.",
    contenido:
      "Los Caminos del Agua es una experiencia que invita a conocer y valorar el territorio a través del agua, la naturaleza y las comunidades locales. Esta publicación puede ampliarse con la información oficial, fotografías, horarios, precios y datos del prestador.",
    fecha: "2026-09-01",
    destacada: true,
    imagen: "/images/caminos-del-agua.jpg",
  },
];

export function getNovedad(slug) {
  return novedades.find((item) => item.slug === slug);
}
