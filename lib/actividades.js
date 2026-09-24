// Catálogo de experiencias de San Rafael
//
// "categoria" debe ser una de:
// "aventura", "naturaleza", "agro", "cultura", "bienestar", "conservacion"

export const categorias = [
  {
    id: "todos",
    nombre: "Todas",
  },
  {
    id: "aventura",
    nombre: "Aventura",
  },
  {
    id: "naturaleza",
    nombre: "Naturaleza",
  },
  {
    id: "agro",
    nombre: "Agroturismo",
  },
  {
    id: "cultura",
    nombre: "Cultura",
  },
  {
    id: "bienestar",
    nombre: "Bienestar",
  },
  {
    id: "conservacion",
    nombre: "Ciencia y conservación",
  },
];

export const actividades = [
  // =========================================================
  // AVENTURA
  // =========================================================

  {
    id: "tubing",
    nombre: "Tubing",
    categoria: "aventura",
    descripcion:
      "Recorre los ríos de San Rafael sobre neumáticos y disfruta de una experiencia de aventura en contacto con la naturaleza.",
  },

  {
    id: "hidrosenderismo",
    nombre: "Hidrosenderismo",
    categoria: "aventura",
    descripcion:
      "Explora ríos, quebradas y paisajes naturales caminando por el agua y descubriendo los ecosistemas de San Rafael.",
  },

  {
    id: "canyoning",
    nombre: "Canyoning",
    categoria: "aventura",
    descripcion:
      "Explora cascadas, cañones y formaciones rocosas en una experiencia de aventura guiada.",
  },

  {
    id: "rapel",
    nombre: "Rapel",
    categoria: "aventura",
    descripcion:
      "Desciende por paredes y formaciones naturales acompañado por guías y disfruta de los paisajes de San Rafael.",
  },

  {
    id: "torrentismo",
    nombre: "Torrentismo",
    categoria: "aventura",
    descripcion:
      "Desciende por cascadas y corrientes de agua en una experiencia de aventura y conexión con la naturaleza.",
  },

  {
    id: "rafting",
    nombre: "Rafting",
    categoria: "aventura",
    descripcion:
      "Navega por los ríos de la región en una experiencia de aventura y trabajo en equipo.",
  },

  {
    id: "cabalgata",
    nombre: "Cabalgata",
    categoria: "aventura",
    descripcion:
      "Recorre los paisajes y sitios turísticos de San Rafael a caballo, acompañado por interpretación cultural y ambiental.",
  },

  {
    id: "trekking",
    nombre: "Trekking",
    categoria: "aventura",
    descripcion:
      "Realiza recorridos de mayor duración por caminos rurales, montañas y paisajes naturales de San Rafael.",
  },

  // =========================================================
  // NATURALEZA
  // =========================================================

  {
    id: "senderismo",
    nombre: "Senderismo",
    categoria: "naturaleza",
    descripcion:
      "Recorre senderos, bosques y reservas naturales mientras conoces la biodiversidad y los paisajes de San Rafael.",
  },

  {
    id: "avistamiento-aves",
    nombre: "Avistamiento de aves",
    categoria: "naturaleza",
    descripcion:
      "Observa aves en sus hábitats naturales y conoce la diversidad de especies que habitan los ecosistemas de San Rafael.",
  },

  {
    id: "observacion-fauna",
    nombre: "Observación de fauna",
    categoria: "naturaleza",
    descripcion:
      "Descubre la fauna silvestre de San Rafael y aprende sobre las especies que habitan sus bosques y ecosistemas.",
  },

  {
    id: "visita-cascadas",
    nombre: "Visita a cascadas",
    categoria: "naturaleza",
    descripcion:
      "Conoce cascadas y espacios naturales de San Rafael rodeados de bosque y fuentes de agua.",
  },

  {
    id: "paisajismo",
    nombre: "Paisajismo",
    categoria: "naturaleza",
    descripcion:
      "Descubre los paisajes rurales y naturales de San Rafael desde una perspectiva de contemplación e interpretación del territorio.",
  },

  // =========================================================
  // AGROTURISMO
  // =========================================================

  {
    id: "tour-cacao",
    nombre: "Tour del cacao",
    categoria: "agro",
    descripcion:
      "Conoce el cultivo, transformación y aprovechamiento del cacao a través de experiencias directamente en fincas productoras.",
  },

  {
    id: "tour-cafe",
    nombre: "Tour del café",
    categoria: "agro",
    descripcion:
      "Descubre el proceso del café, desde el cultivo hasta la preparación, acompañado por productores locales.",
  },

  {
    id: "ruta-panela",
    nombre: "Ruta de la panela",
    categoria: "agro",
    descripcion:
      "Conoce la producción artesanal de panela, sus derivados y los saberes campesinos asociados a esta tradición.",
  },

  {
    id: "ruta-miel",
    nombre: "Ruta de la miel",
    categoria: "agro",
    descripcion:
      "Conoce la producción de miel y sus derivados, y descubre el papel de las abejas en los ecosistemas y en la economía local.",
  },

  {
    id: "recorrido-agroecologico",
    nombre: "Recorrido agroecológico",
    categoria: "agro",
    descripcion:
      "Explora fincas y sistemas productivos donde se integran prácticas agroecológicas, conservación y producción sostenible.",
  },

  // =========================================================
  // CULTURA
  // =========================================================

  {
    id: "senderos-culturales",
    nombre: "Senderos culturales",
    categoria: "cultura",
    descripcion:
      "Recorre caminos y espacios del territorio para conocer su historia, cultura y formas de vida.",
  },

  {
    id: "gastronomia-local",
    nombre: "Gastronomía local",
    categoria: "cultura",
    descripcion:
      "Descubre sabores y preparaciones tradicionales elaboradas por familias y productores locales.",
  },

  {
    id: "saberes-campesinos",
    nombre: "Saberes campesinos",
    categoria: "cultura",
    descripcion:
      "Conoce conocimientos, prácticas y tradiciones que hacen parte de la vida rural y cultural de San Rafael.",
  },

  {
    id: "interpretacion-cultural",
    nombre: "Interpretación cultural",
    categoria: "cultura",
    descripcion:
      "Conoce el territorio a través de relatos, tradiciones y experiencias que permiten comprender la identidad local.",
  },

  // =========================================================
  // BIENESTAR
  // =========================================================

  {
    id: "masajes",
    nombre: "Masajes",
    categoria: "bienestar",
    descripcion:
      "Disfruta espacios de relajación y bienestar mediante diferentes técnicas de masaje.",
  },

  {
    id: "chocolaterapia",
    nombre: "Chocolaterapia",
    categoria: "bienestar",
    descripcion:
      "Vive una experiencia de bienestar que aprovecha las propiedades y aromas derivados del cacao.",
  },

  {
    id: "aceites-esenciales",
    nombre: "Aceites esenciales",
    categoria: "bienestar",
    descripcion:
      "Conoce y disfruta experiencias de bienestar relacionadas con aromas, plantas y aceites esenciales.",
  },

  {
    id: "rituales",
    nombre: "Rituales",
    categoria: "bienestar",
    descripcion:
      "Participa en experiencias de bienestar y conexión que incorporan elementos naturales, culturales y tradicionales.",
  },

  {
    id: "plan-romantico",
    nombre: "Plan romántico",
    categoria: "bienestar",
    descripcion:
      "Disfruta una experiencia especial para compartir en pareja en medio de los paisajes naturales de San Rafael.",
  },

  // =========================================================
  // CIENCIA Y CONSERVACIÓN
  // =========================================================

  {
    id: "ciencia-comunitaria",
    nombre: "Ciencia comunitaria",
    categoria: "conservacion",
    descripcion:
      "Participa en iniciativas de ciencia comunitaria para conocer, valorar y proteger los ecosistemas y las especies del territorio.",
  },

  {
    id: "educacion-ambiental",
    nombre: "Educación ambiental",
    categoria: "conservacion",
    descripcion:
      "Aprende sobre los ecosistemas, las especies y las prácticas necesarias para contribuir al cuidado del territorio.",
  },

  {
    id: "conservacion-ecosistemas",
    nombre: "Conservación de ecosistemas",
    categoria: "conservacion",
    descripcion:
      "Conoce iniciativas y prácticas orientadas a la protección de los ecosistemas y la biodiversidad de San Rafael.",
  },

  {
    id: "campanas-limpieza",
    nombre: "Campañas de limpieza",
    categoria: "conservacion",
    descripcion:
      "Participa en jornadas comunitarias para la limpieza y cuidado de atractivos naturales y fuentes de agua.",
  },
];