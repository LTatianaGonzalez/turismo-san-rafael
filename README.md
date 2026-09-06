# Turismo San Rafael — Proyecto starter

Este es el punto de partida real del proyecto: sitio informativo + encuesta
conectada a una base de datos. A partir de aquí se construyen las demás
partes (dashboard, reservas, chatbot, plataforma educativa).

## Qué incluye este starter
- `app/page.js` → página de inicio.
- `app/encuesta/page.js` → formulario de encuesta conectado a Supabase.
- `lib/supabaseClient.js` → conexión a la base de datos (no la edites).
- `supabase/schema.sql` → script para crear la tabla en Supabase.

## Paso 1 — Crear tu proyecto en Supabase
1. Ve a https://supabase.com y crea una cuenta gratis.
2. Crea un nuevo proyecto (elige una contraseña de base de datos y guárdala).
3. Ve a **SQL Editor** > **New query**, pega el contenido de `supabase/schema.sql`
   y dale **Run**. Esto crea la tabla `respuestas_encuesta`.
4. Ve a **Settings > API** y copia dos valores: `Project URL` y `anon public key`.

## Paso 2 — Configurar el proyecto en tu computador
1. Instala Node.js (versión 18 o superior) desde https://nodejs.org si no lo
   tienes.
2. Abre una terminal dentro de esta carpeta y ejecuta:
   ```bash
   npm install
   ```
3. Copia el archivo `.env.example` y renómbralo a `.env.local`. Reemplaza los
   valores con los que copiaste de Supabase en el paso anterior:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

## Paso 3 — Ejecutar el proyecto en tu computador
```bash
npm run dev
```
Abre tu navegador en `http://localhost:3000`. Deberías ver la página de
inicio, y en `http://localhost:3000/encuesta` el formulario. Al enviarlo,
la respuesta debe aparecer en Supabase: ve a **Table Editor > respuestas_encuesta**
para confirmarlo.

## Paso 4 — Subir el proyecto a GitHub
```bash
git init
git add .
git commit -m "Primera versión: landing + encuesta conectada a Supabase"
```
Crea un repositorio vacío en https://github.com/new, y luego:
```bash
git remote add origin URL_DE_TU_REPOSITORIO
git branch -M main
git push -u origin main
```

## Paso 5 — Publicarlo en internet (Vercel)
1. Ve a https://vercel.com y entra con tu cuenta de GitHub.
2. Haz clic en **Add New Project** y selecciona tu repositorio.
3. En **Environment Variables**, agrega las mismas dos variables que pusiste
   en `.env.local`.
4. Haz clic en **Deploy**. En un par de minutos tendrás una URL pública real
   para mostrar en la reunión con la junta comunal.

## Siguiente paso del proyecto
Una vez esto funcione y tengas algunas respuestas de prueba guardadas,
el siguiente bloque es el **dashboard administrativo** que lee esta misma
tabla y la muestra en gráficos. Pide ayuda para construir esa parte cuando
llegues aquí — se construye sobre exactamente esta misma base de datos.

## Si algo falla
- Error de conexión a Supabase → revisa que `.env.local` tenga los valores
  correctos y que hayas reiniciado `npm run dev` después de crearlo.
- La tabla no existe → confirma que ejecutaste `supabase/schema.sql` en el
  SQL Editor de Supabase.
- `npm install` falla → confirma tu versión de Node con `node -v` (debe ser
  18 o superior).
