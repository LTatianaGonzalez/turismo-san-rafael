# Turismo San Rafael · V2

Esta versión consolida el proyecto maestro y crea la arquitectura base para:

- Portal turístico
- Descubre
- Experiencias
- Hospedajes
- Reservas
- Novedades por categorías
- Sostenibilidad
- Chatbot
- Panel de gestión

## 1. Instalar

```bash
npm install
npm run dev
```

## 2. Variables de entorno

Crear `.env.local` a partir de `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

No subir `.env.local` a GitHub.

## 3. Supabase

Mantener el `supabase/schema.sql` existente y ejecutar después:

`supabase/schema-v2.sql`

## 4. Primera novedad

La primera novedad está en:

`lib/novedades.js`

y es:

**Los Caminos del Agua**

Cuando el módulo de contenido esté conectado a Supabase, ese archivo será reemplazado por consultas a la tabla `novedades`.

## 5. Próxima implementación

Orden recomendado:

1. Migrar novedades a Supabase + CRUD desde dashboard.
2. Normalizar `hoteles` hacia `hospedajes`.
3. Crear disponibilidad y calendario.
4. Crear flujo real de reservas.
5. Añadir pagos y webhook de pasarela.
6. Completar indicadores de sostenibilidad.
7. Conectar chatbot con la base turística y reservas.
