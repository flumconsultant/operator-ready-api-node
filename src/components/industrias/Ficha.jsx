import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import SiteHeader from '../SiteHeader.jsx';
import SiteFooter from '../SiteFooter.jsx';
import Reveal from '../Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, TextCTA, Cols, Card } from '../ui.jsx';
import { VendorNeutral } from '../tecnologia.jsx';
import { POR_SLUG, RAIZ, urlIndustria, INDUSTRIAS } from '../../content/industrias.js';
import { SLUG_ES_A_EN } from '../../content/soluciones-slugs.js';
import * as siteEs from '../../site.js';
import * as siteEn from '../../site.en.js';

/**
 * Una página de industria.
 *
 * ---- Qué la separa de una página de programa ----
 *
 * `/es/servicios/become-now/finanzas` habla del ÁREA de finanzas en cualquier
 * empresa. Esta habla del NEGOCIO financiero entero. Si las dos dijeran lo
 * mismo, serían dos páginas compitiendo por la misma búsqueda y ganaría la
 * peor. Por eso aquí no se explica ningún programa: se enlaza el que
 * corresponde, y el contenido propio es el que solo puede escribirse mirando la
 * industria —sus workflows, sus riesgos, lo que se mide en ella—.
 *
 * ---- Por qué la página es larga ----
 *
 * Una página de industria con tres frases y un formulario es una página vacía
 * con una URL bonita: posiciona mal y, cuando alguien llega, no le sirve. Las
 * ocho piezas que lleva —contexto, oportunidades, workflows, tecnología,
 * métricas, cómo empezar, enlaces y cierre— son el mínimo para que aporte algo
 * que no esté ya en el resto del sitio.
 *
 * ---- Y por qué existe el bloque de límite ----
 *
 * Solo una industria lo trae. En salud, lo que NO hacemos es información tan
 * relevante como lo que sí, y decirlo tarde equivale a dejar que se asuma lo
 * contrario. El campo es opcional en los datos: la estructura no obliga a
 * inventarle un límite a las industrias que no lo necesitan.
 */

const T = {
  es: {
    volver: 'Industrias',
    contextoKicker: 'El punto de partida',
    oportunidadesKicker: 'Dónde vemos oportunidad',
    capacidadesKicker: 'Qué puede hacer BECOME aquí',
    capacidadesTitular: 'De la oportunidad a una capacidad que la empresa puede operar.',
    casosKicker: 'Casos ilustrativos',
    casosTitular: 'Qué se construye, cuando el detalle operativo ya permite nombrarlo.',
    workflowsKicker: 'Procesos que se rediseñan',
    tecnologiaKicker: 'Qué tecnología, y con qué control',
    metricasKicker: 'Qué se mide',
    metricasNota: 'Son las magnitudes que proponemos medir en esta industria, y la línea base se establece antes de construir. No publicamos resultados de terceros.',
    empezarKicker: 'Cómo puede empezar BECOME',
    enlacesKicker: 'Sigue por aquí',
    servicio: 'Servicio recomendado',
    solucionesTitulo: 'Lo que suele haber detrás',
    programasTitulo: 'Capacitación por área',
    metodoTitulo: 'El método',
    metodoLinea: 'Seis etapas y cinco sistemas: cómo llevamos una industria de la ambición al valor.',
    metodoCta: 'Cómo transformamos',
    otrasKicker: 'Otras industrias',
    otras: 'La pregunta es la misma. La respuesta cambia.',
    verTodas: 'Ver todas las industrias',
    ctaBoton: 'Hablemos de tu iniciativa',
  },
  en: {
    volver: 'Industries',
    contextoKicker: 'The starting point',
    oportunidadesKicker: 'Where we see opportunity',
    capacidadesKicker: 'What BECOME can do here',
    capacidadesTitular: 'From the opportunity to a capability the company can operate.',
    casosKicker: 'Illustrative cases',
    casosTitular: 'What gets built, once the operating detail is specific enough to name it.',
    workflowsKicker: 'Workflows we redesign',
    tecnologiaKicker: 'Which technology, and under what control',
    metricasKicker: 'What gets measured',
    metricasNota: 'These are the measures we propose for this industry, and the baseline is set before anything is built. We do not publish third-party results.',
    empezarKicker: 'How BECOME can start',
    enlacesKicker: 'Continue here',
    servicio: 'Recommended service',
    solucionesTitulo: 'What is usually behind it',
    programasTitulo: 'Enablement by area',
    metodoTitulo: 'The method',
    metodoLinea: 'Six stages and five systems: how we take an industry from ambition to value.',
    metodoCta: 'How we transform',
    otrasKicker: 'Other industries',
    otras: 'The question is the same. The answer changes.',
    verTodas: 'View all industries',
    ctaBoton: 'Let’s talk about your initiative',
  },
};

/* Los enlaces se resuelven a partir del mapa del sitio del idioma que toque, y
   no se escriben a mano: así una etiqueta o una URL que cambie en el menú
   cambia también aquí, en vez de quedar desincronizada en seis páginas. */
function mapaDe(lang) {
  const s = lang === 'en' ? siteEn : siteEs;
  const programas = Object.fromEntries(
    (s.SERVICES[0].groups || []).flatMap((g) => g.items).map((it) => [it.to.split('/').pop(), it]),
  );
  const soluciones = Object.fromEntries(s.SOLUCIONES_MENU.map((c) => [c.slug, c]));
  const servicios = Object.fromEntries(s.SERVICES.map((x) => [x.to.split('/').pop(), x]));
  return { programas, soluciones, servicios };
}

export default function FichaIndustria({ lang = 'es', slug }) {
  const ind = POR_SLUG[lang]?.[slug];
  if (!ind) return <Navigate to={RAIZ[lang]} replace />;

  const t = T[lang] || T.es;
  const c = ind[lang];
  const { programas, soluciones, servicios } = mapaDe(lang);
  const contacto = lang === 'en' ? '/en/contact' : '/es/contacto';
  const metodo = lang === 'en' ? '/en/how-we-transform' : '/es/como-transformamos';

  const servicio = servicios[ind.servicio];
  const casos = ind.soluciones
    .map((s) => soluciones[lang === 'en' ? SLUG_ES_A_EN[s] : s])
    .filter(Boolean);
  const cursos = ind.programas.map((p) => programas[p]).filter(Boolean);
  const otras = INDUSTRIAS.filter((x) => x !== ind).slice(0, 3);

  return (
    <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
      <SiteHeader />

      <Section band="dark" pad="var(--space-12)">
        {/* Miga de pan visible, además de la estructurada. Alguien que aterriza
            aquí desde una búsqueda no ha pasado por el índice y necesita saber
            que existe. */}
        <p style={{ margin: 0 }}>
          <Link to={RAIZ[lang]} style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--slate-300)', textDecoration: 'none' }}>
            ← {t.volver}
          </Link>
        </p>
        <Kicker dark>{c.nombre}</Kicker>
        <Headline as="h1" dark>{c.h1}</Headline>
        <Lead dark>{c.lead}</Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to={contacto}>{t.ctaBoton}</PrimaryCTA>
        </div>
      </Section>

      {/* El límite, cuando lo hay, antes que cualquier oportunidad. */}
      {c.limite && (
        <Section band="sunken" pad="var(--space-10)">
          <div style={{ maxWidth: 'var(--maxw-prose)', borderLeft: '2px solid var(--electric-green)', paddingLeft: 'var(--space-6)' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.28, color: 'var(--text-heading)' }}>
              {c.limite.titulo}
            </h2>
            <Body style={{ marginTop: 'var(--space-4)' }}>{c.limite.texto}</Body>
          </div>
        </Section>
      )}

      <Section band="light">
        <Kicker>{t.contextoKicker}</Kicker>
        <div style={{ marginTop: 'var(--space-6)', display: 'grid', gap: 'var(--space-5)', maxWidth: 'var(--maxw-prose)' }}>
          {c.contexto.map((p, i) => (
            <Reveal as="p" key={i} index={i} style={{ margin: 0, font: i === 0 ? 'var(--type-lead)' : 'var(--type-body)', color: i === 0 ? 'var(--text-body)' : 'var(--text-muted)' }}>
              {p}
            </Reveal>
          ))}
        </div>
      </Section>

      <Section band="darker">
        <Kicker dark>{t.oportunidadesKicker}</Kicker>
        <Headline dark>{c.oportunidadesTitular}</Headline>
        <Cols min="250px" style={{ marginTop: 'var(--space-10)' }}>
          {c.oportunidades.map(([titulo, linea]) => (
            <Reveal as="div" key={titulo} style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, color: 'var(--white)' }}>
                {titulo}
              </h3>
              <Body dark style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      {/* Los casos ilustrativos solo existen en las industrias donde hay
          suficiente detalle operativo para nombrarlos sin inventar. Van
          rotulados como ilustrativos porque eso es lo que son: ninguno
          describe un cliente. */}
      {c.casos && (
        <Section band="sunken">
          <Kicker>{t.casosKicker}</Kicker>
          <Headline>{t.casosTitular}</Headline>
          <Cols min="240px" style={{ marginTop: 'var(--space-9)' }}>
            {c.casos.map((caso) => (
              <Reveal as="div" key={caso} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
                <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 'var(--text-body-md)', color: 'var(--text-heading)' }}>{caso}</p>
              </Reveal>
            ))}
          </Cols>
        </Section>
      )}

      <Section band="light">
        <div data-cols style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'var(--space-9)' }}>
          <Reveal as="div">
            <Kicker>{t.workflowsKicker}</Kicker>
            <Headline>{c.workflowsTitular}</Headline>
          </Reveal>
          <Reveal as="ul" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
            {c.workflows.map((w) => (
              <li key={w} style={{ display: 'flex', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-hairline)' }}>
                <span aria-hidden="true" style={{ color: 'var(--text-accent)', font: 'var(--type-mono)' }}>—</span>
                <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{w}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Qué puede hacer BECOME aquí.
          Va después de las oportunidades y antes de la tecnología a propósito:
          quien acaba de leer dónde está el problema se pregunta quién lo
          resuelve, no con qué se resuelve. Y no es el mismo texto en las seis
          páginas: si lo fuera, no diría nada de esta industria. */}
      <Section band="sunken">
        <Kicker>{t.capacidadesKicker}</Kicker>
        <Headline>{t.capacidadesTitular}</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {c.capacidades.map(([titulo, linea, servicio], i) => (
            <Reveal
              as="div"
              key={titulo}
              index={i}
              data-cols
              className="row-hit"
              style={{
                display: 'grid',
                gridTemplateColumns: '52px minmax(0,1fr) minmax(0,1.4fr)',
                gap: 'var(--space-6)',
                padding: 'var(--space-6) 0',
                borderTop: '1px solid var(--border-hairline)',
                alignItems: 'start',
              }}
            >
              <span style={{ font: 'var(--type-mono)', color: 'var(--text-faint)' }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, color: 'var(--text-heading)' }}>
                  {titulo}
                </h3>
                <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-accent)' }}>{servicio}</p>
              </div>
              <Body style={{ marginTop: 0 }}>{linea}</Body>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section band="dark">
        <Kicker dark>{t.tecnologiaKicker}</Kicker>
        <Headline dark>{c.tecnologiaTitular}</Headline>
        <Reveal as="p" style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-lead)', color: 'var(--slate-100)', maxWidth: '62ch' }}>
          {c.tecnologia}
        </Reveal>
      </Section>

      <Section band="light">
        <Kicker>{t.metricasKicker}</Kicker>
        <Headline>{c.metricasTitular}</Headline>
        <Cols min="200px" style={{ marginTop: 'var(--space-9)' }}>
          {c.metricas.map(([titulo, linea]) => (
            <Reveal as="div" key={titulo} style={{ borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
              <h3 style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-accent)' }}>
                {titulo}
              </h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
            </Reveal>
          ))}
        </Cols>
        <Body style={{ marginTop: 'var(--space-8)', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)' }}>
          {t.metricasNota}
        </Body>
      </Section>

      <Section band="sunken">
        <Kicker>{t.empezarKicker}</Kicker>
        <Headline>{c.empezarTitular}</Headline>
        <ol style={{ margin: 'var(--space-9) 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 'var(--space-5)', maxWidth: 'var(--maxw-prose)' }}>
          {c.empezar.map((paso, i) => (
            <Reveal as="li" key={i} index={i} style={{ display: 'flex', gap: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-strong)' }}>
              <span aria-hidden="true" style={{ font: 'var(--type-mono)', color: 'var(--text-accent)' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ font: 'var(--type-body)', color: 'var(--text-body)' }}>{paso}</span>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Los enlaces cruzados. Están agrupados en una sola sección y no
          repartidos por la página porque cada uno lleva fuera: sueltos entre el
          contenido, cada dos párrafos habría una salida. */}
      <Section band="light">
        <Kicker>{t.enlacesKicker}</Kicker>
        <Cols min="270px" style={{ marginTop: 'var(--space-9)' }}>
          {servicio && (
            <Card>
              <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {t.servicio}
              </p>
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, color: 'var(--text-heading)' }}>
                {servicio.name}
              </h3>
              {/* La tarjeta tampoco repite el descriptor del servicio: era
                  idéntico en las páginas que recomiendan el mismo, y el
                  nombre ya dice de cuál se trata. */}
              <TextCTA to={servicio.to}>{servicio.name.split('—')[0].trim()}</TextCTA>
            </Card>
          )}

          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {t.solucionesTitulo}
            </p>
            <ul style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
              {casos.map((s) => (
                <li key={s.slug}>
                  <Link to={s.to} style={{ font: 'var(--type-body)', color: 'var(--text-heading)', textDecoration: 'none' }} className="hv-link">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {t.programasTitulo}
            </p>
            <ul style={{ listStyle: 'none', margin: 'var(--space-5) 0 0', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
              {cursos.map((p) => (
                <li key={p.to}>
                  <Link to={p.to} style={{ font: 'var(--type-body)', color: 'var(--text-heading)', textDecoration: 'none' }} className="hv-link">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              {t.metodoTitulo}
            </p>
            <TextCTA to={metodo}>{t.metodoCta}</TextCTA>
          </Card>
        </Cols>
      </Section>

      <VendorNeutral lang={lang} />

      <Section band="light">
        <Kicker>{t.otrasKicker}</Kicker>
        <Headline>{t.otras}</Headline>
        <Cols min="240px" style={{ marginTop: 'var(--space-9)' }}>
          {otras.map((o) => (
            <Card key={o.slug[lang]}>
              {/* La tarjeta no repite el descriptor de la industria vecina.
                  Aparecía idéntico en las cinco páginas que enlazan a ella, y
                  con el nombre basta para decidir si te interesa. */}
              <Link to={urlIndustria(o, lang)} style={{ textDecoration: 'none' }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', lineHeight: 1.26, color: 'var(--text-heading)' }}>
                  {o[lang].nombre}
                </p>
              </Link>
            </Card>
          ))}
        </Cols>
        <TextCTA to={RAIZ[lang]}>{t.verTodas}</TextCTA>
      </Section>

      <Section band="darker" pad="var(--space-13)">
        <Kicker dark>{c.nombre}</Kicker>
        <Headline dark>{c.cierre}</Headline>
        <Lead dark>{c.cierreTexto}</Lead>
        <div style={{ marginTop: 'var(--space-8)' }}>
          <PrimaryCTA to={contacto}>{t.ctaBoton}</PrimaryCTA>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
