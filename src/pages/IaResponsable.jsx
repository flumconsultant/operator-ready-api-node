import React from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import Reveal from '../components/Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, PrimaryCTA, GhostCTA } from '../components/ui.jsx';

/**
 * IA responsable.
 *
 * Tiene dirección propia y no es una sección más de Nosotros por una razón
 * práctica: es la página que alguien reenvía dentro de su empresa cuando le
 * preguntan «¿y esto quién lo controla?». Un ancla no se comparte igual.
 *
 * Lo que NO hay aquí, a propósito: certificaciones, sellos ni cumplimiento
 * declarado de normas concretas. Eso se acredita, no se escribe.
 */

const CONTROLES = [
  ['Uso y acceso a los datos',
   'Qué información entra, de dónde sale, quién puede consultarla y para qué. Se define antes de construir, no cuando ya está en marcha.'],
  ['Privacidad y seguridad',
   'Tratamiento de datos personales y sensibles, cifrado, retención y aislamiento según el entorno de cada empresa.'],
  ['Evaluación de resultados',
   'Qué se considera una respuesta aceptable y cómo se comprueba. Sin un umbral definido, «funciona bien» es una opinión.'],
  ['Validación humana',
   'Dónde una persona revisa, aprueba o corrige antes de que algo tenga efecto. Cuanto mayor el riesgo, más cerca del final está ese punto.'],
  ['Escalamiento y excepciones',
   'Qué pasa con los casos que no encajan: a quién llegan, en cuánto tiempo y con qué información.'],
  ['Trazabilidad',
   'Qué se registra de cada decisión asistida, para poder reconstruir después por qué ocurrió lo que ocurrió.'],
  ['Responsables con nombre',
   'Quién responde por la operación y quién por el resultado de negocio. Un control sin responsable es un documento.'],
  ['Seguimiento continuo',
   'Con qué frecuencia se revisa el comportamiento, quién lo revisa y qué dispara un cambio.'],
];

export default function IaResponsable() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" data-page-root style={{ paddingTop: 72, font: 'var(--type-body)', color: 'var(--text-body)', background: 'var(--off-white)' }}>
        <Section band="dark" pad="var(--space-12)" data-node-state="0">
          <Kicker dark>IA responsable</Kicker>
          <Headline as="h1" dark>Los controles se diseñan con la solución, no se añaden al final.</Headline>
          <Lead dark>
            La IA responsable se incorpora desde el diseño. Definimos el uso adecuado
            de datos, los accesos, la supervisión humana, la evaluación, el
            escalamiento, la trazabilidad y la responsabilidad según el caso de uso y
            su perfil de riesgo.
          </Lead>
        </Section>

        <Section band="light">
          <Kicker>Por qué al principio</Kicker>
          <Headline>Un control añadido después no cambia cómo se decide.</Headline>
          <Lead>
            Cuando los límites se escriben una vez que la solución ya funciona, se
            convierten en una capa de revisión que frena el trabajo y que la gente
            aprende a rodear. Definidos antes, son parte de cómo está construida: el
            sistema no puede hacer aquello para lo que no tiene permiso.
          </Lead>
          <Body style={{ marginTop: 'var(--space-7)' }}>
            No todos los casos necesitan lo mismo. Un asistente que redacta un borrador
            interno y un agente que actúa sobre un sistema de producción tienen perfiles
            de riesgo distintos, y por tanto controles distintos. Lo que no cambia es que
            estén decididos y escritos antes de construir.
          </Body>
        </Section>

        <Section band="sunken">
          <Kicker>Qué se define en cada caso</Kicker>
          <Headline>Ocho decisiones, siempre las mismas.</Headline>
          <div data-cols style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)', marginTop: 'var(--space-10)' }}>
            {CONTROLES.map(([nombre, linea], i) => (
              <Reveal as="div" key={nombre} style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: 'var(--space-5)' }}>
                <p style={{ margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)', color: 'var(--text-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 style={{ margin: 'var(--space-4) 0 0', fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--navy-950)' }}>
                  {nombre}
                </h2>
                <Body style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section band="darker" pad="var(--space-13)">
          <Kicker dark>La responsabilidad no se delega en el sistema</Kicker>
          <Headline dark>La IA amplía la capacidad; las personas mantienen la dirección.</Headline>
          <Lead dark>
            Cuéntanos el caso y su perfil de riesgo. Te decimos qué controles necesita
            antes de escribir una línea de código.
          </Lead>
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <PrimaryCTA to="/es/contacto">Hablemos de tu caso</PrimaryCTA>
            <GhostCTA to="/es/nosotros" dark>Conoce BECOME</GhostCTA>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
