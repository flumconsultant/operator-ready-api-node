import React from 'react';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA, TextCTA, Cols, Card, IndexRow } from './components/ui.jsx';
import { Ico, IcoBadge } from './components/icons.jsx';
import Reveal from './components/Reveal.jsx';

/**
 * Todas las piezas del sistema, en una página.
 *
 * Es lo que convierte un paquete de archivos en algo revisable: se abre, se ve
 * el sistema entero y se compara de un vistazo. Sin esto habría que montar una
 * página de prueba antes de poder juzgar nada.
 */

const NOMBRES_ICONO = ["people","data","agents","operations","speed","quality","growth","risk","capability","target","together","fit","decision","flow","product","build","embed","scale","chat","calendar","signpost","yes","no","library","map","balance","measure","layers","time","doc","work","idea","route","native","system","accountable","outcome","inspect","trust"];

export default function Showcase() {
  return (
    <main style={{ font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>

      <Section band="dark" pad="var(--space-13)">
        <Kicker dark>Sistema de diseño</Kicker>
        <Headline as="h1" dark size="var(--text-display)">BECOME WHAT COMES NEXT.</Headline>
        <Lead dark>
          Las piezas del sistema, en una página. Cada sección de abajo es una banda
          distinta: el contraste entre ellas es la puntuación del documento.
        </Lead>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <PrimaryCTA to="/">CTA principal</PrimaryCTA>
          <GhostCTA to="/" dark>CTA secundario</GhostCTA>
        </div>
      </Section>

      <Section band="light">
        <Kicker>Tipografía</Kicker>
        <Headline>Los titulares escalan con el ancho de la pantalla.</Headline>
        <Lead>
          Lead — el párrafo de entrada de una sección. Va un punto por encima del
          cuerpo y marca el tono de lo que viene.
        </Lead>
        <Body style={{ marginTop: 'var(--space-6)' }}>
          Body — el texto corriente. La medida está limitada a unos 60 caracteres
          por línea, que es donde la lectura deja de cansar.
        </Body>
        <TextCTA to="/">Enlace de texto</TextCTA>
      </Section>

      <Section band="sunken">
        <Kicker>Rejilla y tarjetas</Kicker>
        <Headline>Cols reparte en columnas que se pliegan solas.</Headline>
        <Cols min="260px">
          {['Capacitamos', 'Definimos', 'Construimos'].map((t, i) => (
            <Reveal as="div" key={t}>
              <IcoBadge name={['capability', 'decision', 'build'][i]} />
              <h3 style={{ margin: 'var(--space-5) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--navy-950)' }}>{t}</h3>
              <Body style={{ marginTop: 'var(--space-4)' }}>
                Una tarjeta con su icono, su titular y su línea de apoyo.
              </Body>
            </Reveal>
          ))}
        </Cols>
      </Section>

      <Section band="darker">
        <Kicker dark>Índice</Kicker>
        <Headline dark>IndexRow, para listas numeradas que son navegación.</Headline>
        <div style={{ marginTop: 'var(--space-10)' }}>
          {['Escalar la IA más allá de los pilotos', 'Rediseñar procesos críticos', 'Medir y gobernar el valor'].map((t, i) => (
            <IndexRow key={t} index={i} icon={['scale', 'flow', 'decision'][i]} to="/" num={String(i + 1).padStart(2, '0')} term={t} def="La línea que explica de qué va." />
          ))}
        </div>
      </Section>

      <Section band="light">
        <Kicker>Iconos</Kicker>
        <Headline>{NOMBRES_ICONO.length} iconos, un solo trazo.</Headline>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', marginTop: 'var(--space-9)' }}>
          {NOMBRES_ICONO.map((n) => (
            <div key={n} style={{ width: 96, textAlign: 'center' }}>
              <Ico name={n} size={28} />
              <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-label)', color: 'var(--text-muted)' }}>{n}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section band="dark" pad="var(--space-12)">
        <Kicker dark>Color</Kicker>
        <Headline dark>La proporción es una regla, no una sugerencia.</Headline>
        <Lead dark>Navy 60 % · verde 20 % · azul hielo 10 % · carbón 10 %.</Lead>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', marginTop: 'var(--space-9)' }}>
          {['--navy-950', '--navy-900', '--navy-700', '--electric-green', '--ice-blue', '--charcoal', '--off-white', '--pale-200'].map((t) => (
            <div key={t} style={{ width: 132 }}>
              <div style={{ height: 64, borderRadius: 'var(--radius-sm)', background: `var(${t})`, border: '1px solid var(--border-hairline-dark)' }} />
              <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-label)', color: 'var(--slate-300)' }}>{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section band="light">
        <Kicker>Card</Kicker>
        <Headline>La superficie elevada.</Headline>
        <Cols min="280px">
          <Card><Body>Una tarjeta sobre fondo claro, con su sombra y su radio.</Body></Card>
          <Card><Body>Se usa cuando algo tiene que separarse del fondo sin cambiar de banda.</Body></Card>
        </Cols>
      </Section>

    </main>
  );
}
