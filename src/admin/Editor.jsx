import React from 'react';
import Bloques, { CATALOGO } from '../components/insights/Bloques.jsx';
import { PILARES, FORMATOS, minutosDeLectura } from '../content/insights.js';
import Bloque from './Bloque.jsx';
import { Etiqueta, Texto, Area, Selector, Contador, Boton, Fila, Aviso, marco } from './piezas.jsx';
import * as api from './api.js';
import { VistaGoogle } from './Formulario.jsx';

/**
 * El editor de un artículo.
 *
 * La vista previa usa el mismo componente que la web pública, no una
 * aproximación: si lo que se ve aquí y lo que se publica pudieran diferir,
 * habría que comprobar cada artículo dos veces y el panel dejaría de servir
 * para lo que se hizo.
 *
 * Está montado sobre un solo estado —el artículo entero— y no sobre un campo
 * por variable. Eso es lo que permite que guardar sea escribir ese objeto tal
 * cual, sin una capa que lo recomponga y donde se pierda un campo nuevo.
 */

/* Un slug es la dirección del artículo: si cambia después de publicar, la
   dirección anterior deja de existir. De ahí que se genere del título solo
   mientras el artículo no se haya publicado nunca. */
const aSlug = (s) => String(s)
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);

export const ARTICULO_NUEVO = () => ({
  estado: 'borrador',
  fecha: new Date().toISOString().slice(0, 10),
  autor: '',
  pilar: 'ai-native',
  formato: 'perspective',
  es: { slug: '', titulo: '', entradilla: '', descripcion: '', bloques: [] },
  en: { slug: '', titulo: '', entradilla: '', descripcion: '', bloques: [] },
});

/* Lo que impide publicar, no lo que estaría bien tener. Un artículo sin
   descripción se publica —cae a la entradilla— pero uno sin slug no tiene
   dirección y uno sin título sale en el listado como una fila en blanco. */
export function problemas(art) {
  const fallos = [];
  for (const lang of ['es', 'en']) {
    const t = art[lang] || {};
    const hay = t.titulo || t.slug || (t.bloques || []).length;
    if (!hay) continue;
    if (!t.titulo) fallos.push(`Falta el título en ${lang.toUpperCase()}.`);
    if (!t.slug) fallos.push(`Falta la dirección (slug) en ${lang.toUpperCase()}.`);
    if (t.slug && t.slug !== aSlug(t.slug)) fallos.push(`La dirección en ${lang.toUpperCase()} solo puede llevar minúsculas, números y guiones.`);
    if (!(t.bloques || []).length) fallos.push(`El cuerpo en ${lang.toUpperCase()} está vacío.`);
  }
  if (!art.es?.titulo && !art.en?.titulo) fallos.push('El artículo no tiene contenido en ningún idioma.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(art.fecha || '')) fallos.push('La fecha tiene que ser AAAA-MM-DD.');
  return fallos;
}

export default function Editor({ articulo, alCambiar, publicadoAntes }) {
  const [lang, setLang] = React.useState('es');
  /* Las fichas de autor, para el desplegable de la firma. null mientras se
     piden: sin ese tercer estado, el desplegable aparecería un instante vacío
     y parecería que no hay autores. */
  const [fichas, setFichas] = React.useState(null);

  React.useEffect(() => {
    let vivo = true;
    api.listarAutores()
      .then((d) => {
        if (!vivo) return;
        const lista = (d.autores || []).map((e) => e.ficha).filter(Boolean);
        setFichas(lista);
        /* Un artículo nuevo nace sin firma y toma la predeterminada en cuanto
           se sabe cuál es. Se rellena aquí y no en la plantilla del artículo
           porque la plantilla no puede preguntarle al servidor, y un nombre
           escrito a mano en el código es justo lo que dejó de estarlo. */
        if (!articulo.autor) {
          const porDefecto = (lista.find((f) => f.predeterminado) || lista[0])?.nombre;
          if (porDefecto) alCambiar({ ...articulo, autor: porDefecto });
        }
      })
      .catch(() => vivo && setFichas([]));
    return () => { vivo = false; };
  }, []);
  const [previa, setPrevia] = React.useState(true);
  const t = articulo[lang] || {};

  const ponRaiz = (k, v) => alCambiar({ ...articulo, [k]: v });
  const pon = (k, v) => alCambiar({ ...articulo, [lang]: { ...t, [k]: v } });

  const ponTitulo = (v) => {
    const siguiente = { ...t, titulo: v };
    if (!publicadoAntes && (!t.slug || t.slug === aSlug(t.titulo))) siguiente.slug = aSlug(v);
    alCambiar({ ...articulo, [lang]: siguiente });
  };

  const bloques = t.bloques || [];
  const ponBloques = (b) => pon('bloques', b);

  /* El copy de LinkedIn vive dentro del artículo, en español. Se cuenta aquí
     para poder enseñar el número mientras se escribe: el rango del encargo es
     60–100 palabras y sin contador nadie acierta a ojo. */
  const copyLinkedIn = (articulo.es && articulo.es.linkedin) || {};
  const palabrasCopy = String(copyLinkedIn.texto || '').split(/\s+/).filter(Boolean).length;
  const mover = (i, d) => {
    const b = [...bloques];
    const j = i + d;
    if (j < 0 || j >= b.length) return;
    [b[i], b[j]] = [b[j], b[i]];
    ponBloques(b);
  };

  const fallos = problemas(articulo);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* ---- metadatos comunes a los dos idiomas ---- */}
      <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <div>
            <Etiqueta pista="borrador = no sale en la web">Estado</Etiqueta>
            <Selector
              valor={articulo.estado}
              alCambiar={(v) => ponRaiz('estado', v)}
              opciones={[['borrador', 'Borrador'], ['publicado', 'Publicado']]}
            />
          </div>
          <div><Etiqueta>Fecha</Etiqueta><Texto valor={articulo.fecha} alCambiar={(v) => ponRaiz('fecha', v)} placeholder="2026-08-20" /></div>
          <div>
            <Etiqueta>Pilar</Etiqueta>
            <Selector valor={articulo.pilar} alCambiar={(v) => ponRaiz('pilar', v)}
              opciones={Object.entries(PILARES).map(([k, v]) => [k, v.es])} />
          </div>
          <div>
            <Etiqueta>Formato</Etiqueta>
            <Selector valor={articulo.formato} alCambiar={(v) => ponRaiz('formato', v)}
              opciones={Object.entries(FORMATOS).map(([k, v]) => [k, v.es])} />
          </div>
          {/* Un desplegable con las fichas que existen, no un campo libre.
              Escribir el nombre a mano deja publicar «Carlos Andres Ramirez»
              sin tildes: para el sitio es otra persona, se queda sin foto y
              sin LinkedIn, y el guardián lo rechaza cuando ya está escrito el
              artículo entero. Aquí no se puede elegir a alguien que no exista. */}
          <div>
            <Etiqueta pista="quién firma ESTE artículo">Autor</Etiqueta>
            {fichas === null ? (
              <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>Cargando…</p>
            ) : fichas.length ? (
              <Selector
                valor={articulo.autor}
                alCambiar={(v) => ponRaiz('autor', v)}
                opciones={[
                  ...(articulo.autor && !fichas.some((f) => f.nombre === articulo.autor)
                    /* Un artículo antiguo firmado por alguien sin ficha se sigue
                       pudiendo abrir: se muestra su nombre marcado, en vez de
                       cambiárselo en silencio al abrir el editor. */
                    ? [[articulo.autor, `${articulo.autor} (sin ficha)`]]
                    : []),
                  ...fichas.map((f) => [f.nombre, f.nombre + (f.predeterminado ? ' · firma lo automático' : '')]),
                ]}
              />
            ) : (
              <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 13, color: '#c2410c' }}>
                No hay ninguna ficha de autor. Créala en Autores antes de publicar.
              </p>
            )}
            {fichas?.length > 0 && (
              <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 12, color: 'var(--text-faint)' }}>
                Quién firma los artículos automáticos se elige en <strong>Autores</strong>,
                con la casilla de cada ficha.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---- idioma y vista previa ---- */}
      <Fila style={{ justifyContent: 'space-between' }}>
        <Fila gap={4}>
          {['es', 'en'].map((l) => (
            <Boton key={l} variante={l === lang ? 'fuerte' : 'normal'} onClick={() => setLang(l)}>
              {l === 'es' ? 'Español' : 'English'}
              {!articulo[l]?.titulo && ' ·  vacío'}
            </Boton>
          ))}
        </Fila>
        <Fila gap={12}>
          <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
            {minutosDeLectura(bloques)} min de lectura
          </span>
          <Boton onClick={() => setPrevia(!previa)}>{previa ? 'Ocultar vista previa' : 'Ver vista previa'}</Boton>
        </Fila>
      </Fila>

      {/* Dos columnas solo cuando hay sitio.
       *
       * Estaba escrito como estilo en línea, así que las dos columnas se
       * repartían el ancho también en un móvil: ciento ochenta píxeles para el
       * formulario y ciento ochenta para la vista previa, y la vista previa
       * —que es clara, porque es la web— se montaba encima de la barra
       * inferior. Se veía a simple vista y ningún compilador podía avisarlo.
       * Ahora la decisión la toma el CSS, que sí sabe cuánto mide la pantalla. */}
      <div className="pnl-doble" data-previa={previa || undefined}>
        {/* ---- formulario ---- */}
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16, display: 'grid', gap: 12 }}>
            <div><Etiqueta>Título</Etiqueta><Area valor={t.titulo} alCambiar={ponTitulo} filas={2} /></div>
            <div>
              <Etiqueta pista={publicadoAntes ? 'ya publicado: cambiarlo rompe el enlace anterior' : 'se genera del título'}>Dirección</Etiqueta>
              <Texto valor={t.slug} alCambiar={(v) => pon('slug', aSlug(v))} />
              <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
                meetbecome.com/{lang}/insights/{t.slug || '…'}
              </span>
            </div>
            <div><Etiqueta pista="la frase de entrada del artículo">Entradilla</Etiqueta><Area valor={t.entradilla} alCambiar={(v) => pon('entradilla', v)} /></div>
            <div>
              <Fila style={{ justifyContent: 'space-between' }}>
                <Etiqueta pista="lo que se lee en Google">Descripción</Etiqueta>
                <Contador valor={t.descripcion} limite={155} />
              </Fila>
              <Area valor={t.descripcion} alCambiar={(v) => pon('descripcion', v)} />
            </div>

          {/* Cómo se va a ver en el resultado de búsqueda, mientras se escribe.
              El contador dice «62/60» y hay que imaginarse qué significa eso;
              aquí el título se corta en pantalla por donde lo va a cortar
              Google y se ve que la frase queda sin final. */}
          <VistaGoogle
            campos={[{ id: 'titulo' }, { id: 'descripcion' }, { id: 'slug' }]}
            valores={{ titulo: t.titulo, descripcion: t.descripcion || t.entradilla || '', slug: t.slug ? `/${lang}/insights/${t.slug}` : '' }}
          />
          </div>

          {/* El post de LinkedIn. Solo en español: la página de empresa publica
              en español y el enlace del post apunta al artículo en español.
           *
           * Está aquí, junto al artículo y antes de publicarlo, porque es el
           * único momento en que alguien puede leerlo. Después lo publica un
           * mecanismo automático sin nadie delante. */}
          {lang === 'es' && (
            <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16, display: 'grid', gap: 12 }}>
              <Fila style={{ justifyContent: 'space-between' }}>
                <Etiqueta pista="lo que se lee en LinkedIn cuando salga el artículo">Post de LinkedIn</Etiqueta>
                <span style={{ font: 'var(--type-mono)', fontSize: 12, color: palabrasCopy > 100 || (palabrasCopy && palabrasCopy < 60) ? 'var(--estado-error, #b42318)' : 'var(--text-faint)' }}>
                  {palabrasCopy} palabras · 60–100
                </span>
              </Fila>
              <Area
                valor={copyLinkedIn.texto || ''}
                alCambiar={(v) => pon('linkedin', { ...copyLinkedIn, texto: v })}
                filas={7}
              />
              <div>
                <Etiqueta pista="hasta tres, separados por coma y sin almohadilla">Hashtags</Etiqueta>
                <Texto
                  valor={(copyLinkedIn.hashtags || []).join(', ')}
                  alCambiar={(v) => pon('linkedin', {
                    ...copyLinkedIn,
                    hashtags: v.split(',').map((x) => x.trim().replace(/^#/, '')).filter(Boolean).slice(0, 3),
                  })}
                />
              </div>
              <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
                El enlace lo añade el publicador. No lo escribas en el texto.
              </span>
            </div>
          )}

          {bloques.map((b, i) => (
            <Bloque
              key={i}
              bloque={b}
              indice={i}
              total={bloques.length}
              alCambiar={(nuevo) => ponBloques(bloques.map((x, j) => (j === i ? nuevo : x)))}
              alMover={(d) => mover(i, d)}
              alQuitar={() => ponBloques(bloques.filter((_, j) => j !== i))}
            />
          ))}

          <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16 }}>
            <Etiqueta>Añadir bloque</Etiqueta>
            <Fila gap={6}>
              {CATALOGO.map((c) => (
                <Boton
                  key={c.tipo}
                  onClick={() => ponBloques([...bloques, { tipo: c.tipo, ...structuredClone(c.nuevo) }])}
                >
                  {c.nombre}
                </Boton>
              ))}
            </Fila>
          </div>

          {fallos.length > 0 && (
            <Aviso tono="mal">
              <strong>Falta esto antes de poder publicar:</strong>
              <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                {fallos.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </Aviso>
          )}
        </div>

        {/* ---- vista previa: el componente real de la web ---- */}
        {previa && (
          <div style={{ position: 'sticky', top: 16 }}>
            <div style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)', marginBottom: 8 }}>
              Vista previa — así se publica
            </div>
            <div style={{ background: 'var(--off-white)', border: marco.linea, borderRadius: 2, padding: 24, maxHeight: '78vh', overflow: 'auto' }}>
              <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-accent)' }}>
                {[PILARES[articulo.pilar]?.[lang], FORMATOS[articulo.formato]?.[lang]].filter(Boolean).join(' · ')}
              </p>
              <h1 style={{ margin: '12px 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display)', fontSize: 'var(--text-h2)', lineHeight: 'var(--leading-heading)', color: 'var(--text-heading)' }}>
                {t.titulo || 'Sin título'}
              </h1>
              {t.entradilla && <p style={{ margin: '12px 0 24px', font: 'var(--type-lead)', color: 'var(--text-body)' }}>{t.entradilla}</p>}
              <Bloques bloques={bloques} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
