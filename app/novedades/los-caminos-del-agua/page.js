"use client";

export default function LosCaminosDelAguaPage() {
  return (
    <main className="caminos-agua">

      {/* =====================================================
          BOTÓN VOLVER
      ===================================================== */}

      <div className="caminos-agua__volver">
        <a href="/novedades" className="boton">
          ← Volver a novedades
        </a>
      </div>


      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <section className="caminos-agua__hero">

        <span className="eyebrow">
          Experiencia turística
        </span>

        <h1>
          Los Caminos del Agua
        </h1>

        <p className="caminos-agua__subtitulo">
          Un territorio. Tres formas de vivirlo.
        </p>

        <p>
          Una experiencia que conecta el agua, la naturaleza,
          la memoria y las comunidades de San Rafael y San Carlos.
        </p>

      </section>


      {/* =====================================================
          INTRODUCCIÓN
      ===================================================== */}

      <section className="caminos-agua__introduccion">

        <div>

          <span className="eyebrow">
            Descubre la experiencia
          </span>

          <h2>
            Una nueva forma de recorrer el territorio
          </h2>

        </div>

        <div>

          <p>
            Los Caminos del Agua propone recorrer el territorio
            de manera consciente, reconociendo el agua como
            elemento central de identidad, naturaleza y
            transformación.
          </p>

          <p>
            La experiencia reúne diferentes formas de conectar
            con el territorio y permite elegir el recorrido
            de acuerdo con la manera en que cada visitante
            quiere vivirlo.
          </p>

        </div>

      </section>


      {/* =====================================================
          TRES RUTAS
      ===================================================== */}

      <section className="caminos-agua__rutas">

        <div className="caminos-agua__titulo-seccion">

          <span className="eyebrow">
            Elige tu camino
          </span>

          <h2>
            Tres formas de vivir el territorio
          </h2>

          <p>
            Cada ruta propone una manera diferente de
            relacionarse con la naturaleza, el agua y
            las comunidades.
          </p>

        </div>


        <div className="caminos-agua__grid">


          {/* =================================================
              RUTA 1
          ================================================= */}

          <article className="camino-card">

            <div className="camino-card__icono">
              🧘
            </div>

            <span className="camino-card__categoria">
              Transformación
            </span>

            <h3>
              La Travesía de los Ciclos
            </h3>

            <p className="camino-card__frase">
              Una pausa para volver hacia adentro.
            </p>

            <div className="camino-card__datos">

              <div>
                <strong>Duración</strong>
                <span>4 días · 3 noches</span>
              </div>

              <div>
                <strong>Grupo</strong>
                <span>4 a 12 personas</span>
              </div>

            </div>

            <p>
              Una experiencia espiritual basada en la
              peregrinación, la introspección y la conexión
              con la tierra.
            </p>

            <div className="camino-card__incluye">

              <strong>Incluye</strong>

              <ul>
                <li>Yoga y meditación</li>
                <li>Escritura y reflexión</li>
                <li>Círculos de palabra</li>
                <li>Caminatas introspectivas</li>
                <li>Ritual de fuego</li>
                <li>Conexión con la tierra</li>
              </ul>

            </div>

          </article>


          {/* =================================================
              RUTA 2
          ================================================= */}

          <article className="camino-card">

            <div className="camino-card__icono">
              💧
            </div>

            <span className="camino-card__categoria">
              Conexión
            </span>

            <h3>
              Equilibrio y Conexión
            </h3>

            <p className="camino-card__frase">
              Un recorrido para encontrarse con el territorio.
            </p>

            <div className="camino-card__datos">

              <div>
                <strong>Duración</strong>
                <span>3 días · 2 noches</span>
              </div>

              <div>
                <strong>Grupo</strong>
                <span>Hasta 10 personas</span>
              </div>

            </div>

            <p>
              Una experiencia de conexión profunda con
              la naturaleza, el agua y la tierra, orientada
              a la presencia y al bienestar.
            </p>

            <div className="camino-card__incluye">

              <strong>Incluye</strong>

              <ul>
                <li>Conexión con el agua</li>
                <li>Conexión con la tierra</li>
                <li>Senderos conscientes</li>
                <li>Escucha activa</li>
                <li>Presencia en el territorio</li>
              </ul>

            </div>

          </article>


          {/* =================================================
              RUTA 3
          ================================================= */}

          <article className="camino-card">

            <div className="camino-card__icono">
              🌊
            </div>

            <span className="camino-card__categoria">
              Exploración
            </span>

            <h3>
              El Sendero de los Ríos
            </h3>

            <p className="camino-card__frase">
              Naturaleza, agua y territorio.
            </p>

            <div className="camino-card__datos">

              <div>
                <strong>Duración</strong>
                <span>3 días · 2 noches</span>
              </div>

              <div>
                <strong>Grupo</strong>
                <span>4 a 10 personas</span>
              </div>

            </div>

            <p>
              Un recorrido de exploración para quienes
              buscan actividad física, naturaleza y
              momentos de calma.
            </p>

            <div className="camino-card__incluye">

              <strong>Incluye</strong>

              <ul>
                <li>Senderismo</li>
                <li>Baño de río</li>
                <li>Círculos de palabra</li>
                <li>Cocina del territorio</li>
              </ul>

            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          CONEXIÓN CON EL TERRITORIO
      ===================================================== */}

      <section className="caminos-agua__territorio">

        <div>

          <span className="eyebrow">
            Territorio
          </span>

          <h2>
            Una experiencia que conecta diferentes lugares
          </h2>

        </div>

        <div>

          <p>
            El recorrido integra diferentes experiencias
            y emprendimientos turísticos del territorio,
            permitiendo conocer lugares, personas y formas
            de vivir San Rafael y San Carlos.
          </p>

          <p>
            Más que visitar un lugar, la propuesta busca
            generar una relación consciente con el territorio
            y con quienes lo habitan.
          </p>

        </div>

      </section>


      {/* =====================================================
          TURISMO RESPONSABLE
      ===================================================== */}

      <section className="caminos-agua__responsable">

        <div className="caminos-agua__titulo-seccion">

          <span className="eyebrow">
            Turismo responsable
          </span>

          <h2>
            Cuida el territorio mientras lo recorres
          </h2>

          <p>
            El agua y la naturaleza son parte fundamental
            de esta experiencia. Por eso, cada visitante
            tiene un papel importante en su conservación.
          </p>

        </div>


        <div className="caminos-agua__principios">


          <article>
            <span>💧</span>

            <h3>
              Cuida el agua
            </h3>

            <p>
              Utiliza productos biodegradables y evita
              arrojar residuos, jabones o sustancias a
              ríos, quebradas y cascadas.
            </p>

          </article>


          <article>
            <span>🐦</span>

            <h3>
              Respeta la fauna
            </h3>

            <p>
              No alimentes, persigas ni toques animales.
              Mantén una distancia adecuada y reduce
              el ruido.
            </p>

          </article>


          <article>
            <span>🌿</span>

            <h3>
              No dejes rastro
            </h3>

            <p>
              Retira tus residuos y evita extraer plantas,
              piedras u otros elementos naturales.
            </p>

          </article>


          <article>
            <span>👣</span>

            <h3>
              Sigue los senderos
            </h3>

            <p>
              Respeta los caminos establecidos y evita
              generar erosión o nuevos senderos.
            </p>

          </article>


          <article>
            <span>🤝</span>

            <h3>
              Apoya el territorio
            </h3>

            <p>
              Elige empresas y guías locales y respeta
              las comunidades que hacen posible la experiencia.
            </p>

          </article>

        </div>

      </section>


      {/* =====================================================
          CIERRE
      ===================================================== */}

      <section className="caminos-agua__cierre">

        <span className="eyebrow">
          Los Caminos del Agua
        </span>

        <h2>
          ¿Quieres vivir el territorio?
        </h2>

        <p>
          Descubre una experiencia para escuchar el territorio,
          conectar con la naturaleza y conocer nuevas formas
          de recorrer San Rafael y San Carlos.
        </p>

        <a
          href="https://www.loscaminosdelagua.com"
          target="_blank"
          rel="noopener noreferrer"
          className="boton boton-primario"
        >
          Conocer sitio oficial
        </a>

      </section>


    </main>
  );
}