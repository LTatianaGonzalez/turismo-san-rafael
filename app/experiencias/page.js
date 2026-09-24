"use client";

import { useState } from "react";
import Link from "next/link";
import { categorias, actividades } from "@/lib/actividades";

export default function ExperienciasPage() {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  const actividadesFiltradas =
    categoriaActiva === "todos"
      ? actividades
      : actividades.filter((a) => a.categoria === categoriaActiva);

  return (
    <section>
      <h1>Qué hacer en San Rafael</h1>

      <p>
        Desde deportes de aventura hasta experiencias agroturísticas, San Rafael ofrece
        actividades para todo tipo de viajero. Filtra por lo que más te interesa:
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          margin: "1.5rem 0",
        }}
      >
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className={`chip ${
              categoriaActiva === cat.id ? "chip--activo" : ""
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <div className="grid-tarjetas">
        {actividadesFiltradas.map((a) => (
          <article
            key={a.id}
            className={`tarjeta tarjeta--${a.categoria}`}
          >
            <h3>{a.nombre}</h3>

            <p>{a.descripcion}</p>

            <div style={{ marginTop: "1rem" }}>
              <Link
                href={`/experiencias/${a.id}`}
                className="boton boton-primario"
              >
                Ver experiencia →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}