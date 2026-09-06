// Edita libremente esta lista para agregar, quitar o modificar actividades.
// "categoria" debe ser una de: "aventura", "eco", "agro", "comunitario"

export const categorias = [
  { id: "todos", nombre: "Todas" },
  { id: "aventura", nombre: "Turismo de Aventura" },
  { id: "eco", nombre: "Ecoturismo" },
  { id: "agro", nombre: "Agroturismo" },
  { id: "comunitario", nombre: "Turismo Comunitario" },
];

export const actividades = [
  {
    id: "canyoning",
    nombre: "Canyoning y rapel",
    categoria: "aventura",
    descripcion: "Desciende junto a cascadas y formaciones rocosas guiado por expertos locales certificados.",
  },
  {
    id: "tubing",
    nombre: "Tubing e hidrosenderismo",
    categoria: "aventura",
    descripcion: "Recorre los ríos de San Rafael sobre neumáticos o caminando por su cauce, en compañía de guías de la comunidad.",
  },
  {
    id: "cicloturismo",
    nombre: "Cicloturismo rural",
    categoria: "aventura",
    descripcion: "Rutas en bicicleta por caminos veredales, ideales para conocer el paisaje a otro ritmo.",
  },
  {
    id: "avistamiento-aves",
    nombre: "Avistamiento de aves",
    categoria: "eco",
    descripcion: "San Rafael alberga más de 350 especies de aves. Recorridos guiados al amanecer para observarlas en su hábitat natural.",
  },
  {
    id: "senderismo-ecologico",
    nombre: "Senderismo ecológico",
    categoria: "eco",
    descripcion: "Caminatas por reservas naturales y bosques nativos, con enfoque en conservación y educación ambiental.",
  },
  {
    id: "meliponicultura",
    nombre: "Experiencia con abejas nativas (meliponicultura)",
    categoria: "eco",
    descripcion: "Conoce el manejo tradicional de abejas nativas sin aguijón y su miel medicinal, de la mano de familias productoras locales.",
  },
  {
    id: "tour-cacao-panela",
    nombre: "Tour del cacao y la panela",
    categoria: "agro",
    descripcion: "Visita fincas productoras y aprende el proceso artesanal desde el cultivo hasta el producto final.",
  },
  {
    id: "cafe-local",
    nombre: "Ruta del café local",
    categoria: "agro",
    descripcion: "Un recorrido por cultivos de café de la región, con degustación incluida.",
  },
  {
    id: "gastronomia-campesina",
    nombre: "Gastronomía campesina",
    categoria: "comunitario",
    descripcion: "Platos típicos preparados por familias locales, una forma de apoyar directamente la economía del territorio.",
  },
  {
    id: "bienestar-spa",
    nombre: "Bienestar y spa natural",
    categoria: "comunitario",
    descripcion: "Masajes, aceites esenciales y espacios de sanación inspirados en tradiciones locales.",
  },
];
