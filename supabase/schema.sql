-- Ejecuta este script en Supabase: tu proyecto > SQL Editor > New query > pega y ejecuta.
-- Crea la tabla donde se guardan las respuestas de la encuesta de turistas.

create table if not exists respuestas_encuesta (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamp with time zone default now(),
  tipo_turista text not null,               -- 'nacional' o 'extranjero'
  gasto_promedio numeric not null,          -- eje económico
  dias_estadia integer not null,            -- eje económico
  percepcion_seguridad integer not null,    -- eje social (1 a 5)
  interaccion_comunidad integer not null,   -- eje social (1 a 5)
  percepcion_ambiental integer not null,    -- eje ambiental (1 a 5)
  conocimiento_buenas_practicas integer not null, -- eje ambiental (1 a 5)
  comentario text
);

-- Habilita Row Level Security (obligatorio en Supabase) y permite que
-- cualquier visitante pueda INSERTAR respuestas (llenar la encuesta),
-- pero no pueda leer las respuestas de los demás.
alter table respuestas_encuesta enable row level security;

create policy "Cualquiera puede enviar una respuesta"
  on respuestas_encuesta
  for insert
  to anon
  with check (true);

-- Nota: para que el futuro dashboard de administrador pueda LEER estos datos,
-- se recomienda hacerlo desde una cuenta autenticada (no "anon"), agregando
-- más adelante una política de "select" restringida a usuarios administradores.
