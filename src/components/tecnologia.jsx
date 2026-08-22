import React from 'react';
import Reveal from './Reveal.jsx';
import { Section, Kicker, Headline, Lead, Body, Cols } from './ui.jsx';

/**
 * Los dos bloques de tecnología de la home, en un solo sitio y en dos idiomas.
 *
 * ---- La regla que gobierna estos textos ----
 *
 * Nombrar modelos y proveedores sirve para demostrar que aquí se conoce el
 * ecosistema real, no para posicionarse como implementador de una herramienta.
 * Por eso las marcas nunca aparecen en un titular ni en el hero: aparecen en el
 * cuerpo, en plural y siempre seguidas de «u otros», que es la verdad —la
 * elección depende del caso, no del proveedor.
 *
 * Y por eso son texto y no logotipos. Una fila de logotipos se lee como
 * alianza comercial, y BECOME no es partner oficial de ninguno de ellos.
 * Insinuarlo con una imagen es una afirmación que no se puede sostener.
 */

const T = {
  es: {
    problemaKicker: 'El punto de partida',
    problemaTitulo: 'Más IA no significa más transformación.',
    problemaLead:
      'Muchas organizaciones ya experimentan con ChatGPT, Claude, Gemini, copilotos y otros LLMs. El reto no es acceder a más modelos: es convertirlos en nuevas formas de decidir, trabajar y operar.',
    problemaCuerpo:
      'BECOME conecta estrategia, personas, datos, LLMs, agentes, productos y procesos para transformar experimentos aislados en capacidad empresarial.',

    neutralKicker: 'Tecnología',
    neutralTitulo: 'Vendor-neutral by design.',
    neutralLead: 'No empezamos por un modelo o un proveedor.',
    neutralCuerpo:
      'Seleccionamos la tecnología según el caso de uso, los datos, el nivel de riesgo, la arquitectura y los estándares de cada organización.',
    neutralEcosistema:
      'Según el entorno autorizado de tu empresa, una solución puede combinar ChatGPT/OpenAI, Claude/Anthropic, Gemini/Google, Microsoft Copilot, otros LLMs, APIs y herramientas empresariales.',
    neutralCierre: 'La tecnología cambia. La capacidad debe permanecer.',

    herramientasKicker: 'Vendor-neutral',
    herramientasTitulo: 'Las herramientas cambian. La capacidad permanece.',
    herramientasLead: 'No diseñamos el programa alrededor de una sola plataforma.',
    herramientasCuerpo:
      'Durante la Sesión 0 identificamos qué modelos y herramientas utiliza o autoriza la organización, y diseñamos los ejercicios sobre ese entorno.',
    herramientasIntro: 'Podemos trabajar sobre casos que involucren:',
    herramientasLista: ['ChatGPT', 'Claude', 'Gemini', 'Microsoft Copilot', 'LLMs empresariales', 'Asistentes de IA', 'Agentes de IA', 'Herramientas internas conectadas mediante APIs'],
    herramientasCierre: 'El objetivo no es dominar una interfaz. Es aprender a diseñar mejores procesos con IA.',

    adaptadaTitulo: 'Tecnología adaptada a tu entorno',
    adaptadaCuerpo:
      'Los procesos pueden diseñarse utilizando ChatGPT, Claude, Gemini, Microsoft Copilot u otros LLMs y herramientas aprobadas por tu organización.',
    adaptadaCierre: 'No empezamos por la herramienta. Empezamos por el trabajo que necesita mejorar.',

    capoKicker: 'Bajo el capó',
    capoTitulo: 'Qué hay debajo de una capacidad AI-native.',
    capoCapas: [
      ['Models', 'LLMs, modelos fundacionales y multimodales. Según el caso, evaluamos alternativas como OpenAI, Anthropic, Google u otros proveedores.'],
      ['Orchestration', 'Agents, model routing, tool calling, APIs, MCP y workflow orchestration.'],
      ['Knowledge', 'Enterprise data, RAG, grounding, embeddings, vector search y knowledge sources.'],
      ['Integrations', 'APIs, aplicaciones empresariales, identidad, permisos y sistemas de negocio.'],
      ['Control', 'Guardrails, evaluaciones, human-in-the-loop, gestión de excepciones y puntos de aprobación.'],
      ['Operations', 'Observabilidad, trazas, monitoreo, versionado, control de costos de modelos y manuales de operación.'],
    ],

    modelosKicker: 'Technology landscape',
    modelosTitulo: 'La estrategia de IA también es una estrategia de modelos.',
    modelosLead: 'No todos los casos requieren el mismo LLM, nivel de autonomía o arquitectura.',
    modelosIntro: 'Durante DISCOVER analizamos dónde tiene sentido utilizar:',
    modelosLista: ['Copilotos empresariales', 'LLMs de propósito general', 'Modelos multimodales', 'Agentes de IA', 'Procesos a medida', 'Búsqueda empresarial / RAG', 'SaaS con IA ya contratado', 'Productos de IA a medida'],
    modelosCierre: 'La decisión entre ecosistemas como OpenAI, Anthropic, Google, Microsoft u otras alternativas se evalúa según valor, datos, integración, riesgo, costo y ownership.',
  },
  en: {
    problemaKicker: 'The starting point',
    problemaTitulo: 'More AI doesn’t mean more transformation.',
    problemaLead:
      'Many organizations are already experimenting with ChatGPT, Claude, Gemini, copilots and other LLMs. The challenge isn’t gaining access to more models: it’s turning them into new ways to decide, work and operate.',
    problemaCuerpo:
      'BECOME connects strategy, people, data, LLMs, agents, products and workflows to turn isolated experiments into enterprise capability.',

    neutralKicker: 'Technology',
    neutralTitulo: 'Vendor-neutral by design.',
    neutralLead: 'We don’t start with a model or a vendor.',
    neutralCuerpo:
      'We select technology based on the use case, data, risk level, architecture and your organization’s standards.',
    neutralEcosistema:
      'Depending on your approved environment, a solution may combine ChatGPT/OpenAI, Claude/Anthropic, Gemini/Google, Microsoft Copilot, other LLMs, APIs and enterprise tools.',
    neutralCierre: 'Technology changes. Capability should remain.',

    herramientasKicker: 'Vendor-neutral',
    herramientasTitulo: 'Tools change. Capability stays.',
    herramientasLead: 'We don’t design the program around a single platform.',
    herramientasCuerpo:
      'During Session 0 we identify which models and tools the organization uses or authorizes, and design the program around that environment.',
    herramientasIntro: 'Use cases may involve:',
    herramientasLista: ['ChatGPT', 'Claude', 'Gemini', 'Microsoft Copilot', 'Enterprise LLMs', 'AI assistants', 'AI agents', 'Internal tools connected through APIs'],
    herramientasCierre: 'The goal isn’t mastering an interface. It’s learning to design better AI-enabled workflows.',

    adaptadaTitulo: 'Technology adapted to your environment',
    adaptadaCuerpo:
      'Workflows can be designed using ChatGPT, Claude, Gemini, Microsoft Copilot or other LLMs and tools approved by your organization.',
    adaptadaCierre: 'We don’t start with the tool. We start with the work that needs to improve.',

    capoKicker: 'Under the hood',
    capoTitulo: 'What sits under an AI-native capability.',
    capoCapas: [
      ['Models', 'LLMs, foundation models and multimodal models. Depending on the use case, we evaluate options across OpenAI, Anthropic, Google or other providers.'],
      ['Orchestration', 'Agents, model routing, tool calling, APIs, MCP and workflow orchestration.'],
      ['Knowledge', 'Enterprise data, RAG, grounding, embeddings, vector search and knowledge sources.'],
      ['Integrations', 'APIs, enterprise applications, identity, permissions and business systems.'],
      ['Control', 'Guardrails, evaluations, human-in-the-loop, exception handling and approval points.'],
      ['Operations', 'Observability, tracing, monitoring, versioning, cost governance and runbooks.'],
    ],

    modelosKicker: 'Technology landscape',
    modelosTitulo: 'AI strategy is also a model strategy.',
    modelosLead: 'Not every use case requires the same LLM, level of autonomy or architecture.',
    modelosIntro: 'During DISCOVER we assess where it makes sense to use:',
    modelosLista: ['Enterprise copilots', 'General-purpose LLMs', 'Multimodal models', 'AI agents', 'Custom workflows', 'Enterprise search / RAG', 'Existing SaaS AI', 'Custom AI products'],
    modelosCierre: 'Choices across ecosystems such as OpenAI, Anthropic, Google, Microsoft or other alternatives are evaluated based on value, data, integration, risk, cost and ownership.',
  },
};

export function MasIaNoEsTransformacion({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    <Section band="sunken">
      <Kicker>{t.problemaKicker}</Kicker>
      <Headline>{t.problemaTitulo}</Headline>
      <Lead>{t.problemaLead}</Lead>
      <Body style={{ marginTop: 'var(--space-6)' }}>{t.problemaCuerpo}</Body>
    </Section>
  );
}

export function VendorNeutral({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    /* Compacto a propósito: es una garantía, no un argumento de venta. Una
       sección larga aquí competiría con los tres servicios que acaba de leer
       quien llega hasta aquí. */
    <Section band="dark" pad="var(--space-11)">
      <Kicker dark>{t.neutralKicker}</Kicker>
      <Headline dark>{t.neutralTitulo}</Headline>
      <Lead dark>{t.neutralLead}</Lead>
      <div style={{ marginTop: 'var(--space-7)', display: 'grid', gap: 'var(--space-5)', maxWidth: 'var(--maxw-prose)' }}>
        <Reveal as="p" index={0} style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)' }}>
          {t.neutralCuerpo}
        </Reveal>
        <Reveal as="p" index={1} style={{ margin: 0, font: 'var(--type-body)', color: 'var(--slate-200)' }}>
          {t.neutralEcosistema}
        </Reveal>
        <Reveal
          as="p"
          index={2}
          style={{
            margin: 'var(--space-4) 0 0', paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--green-line)',
            fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)',
            fontSize: 'var(--text-h3)', lineHeight: 1.3, color: 'var(--white)',
          }}
        >
          {t.neutralCierre}
        </Reveal>
      </div>
    </Section>
  );
}

/**
 * El bloque de la página de BECOME NOW™, justo después de la Sesión 0.
 *
 * Va ahí y no antes porque solo tiene sentido cuando ya se ha explicado que el
 * programa se diseña sobre el entorno de la empresa: la lista de herramientas
 * es la consecuencia de eso, no una oferta de catálogo.
 */
export function HerramientasCambian({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    <Section band="light">
      <Kicker>{t.herramientasKicker}</Kicker>
      <Headline>{t.herramientasTitulo}</Headline>
      <Lead>{t.herramientasLead}</Lead>
      <Body style={{ marginTop: 'var(--space-6)' }}>{t.herramientasCuerpo}</Body>
      <Body style={{ marginTop: 'var(--space-6)' }}>{t.herramientasIntro}</Body>
      <ul style={{
        listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0,
        display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)',
      }}>
        {t.herramientasLista.map((x, i) => (
          /* Etiquetas y no logotipos: una fila de logotipos se lee como alianza
             comercial, y aquí no la hay. */
          <Reveal as="li" index={i} key={x} style={{
            padding: '8px 14px', border: '1px solid var(--border-strong)', borderRadius: 2,
            font: 'var(--type-mono)', fontSize: 13, color: 'var(--text-body)',
          }}>
            {x}
          </Reveal>
        ))}
      </ul>
      <Body style={{ marginTop: 'var(--space-8)' }}>{t.herramientasCierre}</Body>
    </Section>
  );
}

/**
 * La nota que cierra «Cómo trabajamos» en las catorce páginas funcionales.
 *
 * Un componente y no el texto repetido catorce veces: la lista de herramientas
 * cambiará, y catorce copias garantizan que alguna se quede contando otra cosa.
 * Es una nota, no una sección: en una página de programa funcional lo que
 * importa es el trabajo del área, y la tecnología es una condición de contorno.
 */
export function TecnologiaAdaptada({ lang = 'es', dark = false }) {
  const t = T[lang] || T.es;
  return (
    <Reveal as="div" style={{
      marginTop: 'var(--space-9)', paddingTop: 'var(--space-6)',
      borderTop: '1px solid var(--green-line)', maxWidth: 'var(--maxw-prose)',
    }}>
      <p style={{
        margin: 0, font: 'var(--type-label)', letterSpacing: 'var(--track-label)',
        textTransform: 'uppercase', fontSize: 11,
        color: dark ? 'var(--electric-green)' : 'var(--text-accent)',
      }}>
        {t.adaptadaTitulo}
      </p>
      <Body dark={dark} style={{ marginTop: 'var(--space-4)' }}>{t.adaptadaCuerpo}</Body>
      <Body dark={dark} style={{ marginTop: 'var(--space-4)' }}>{t.adaptadaCierre}</Body>
    </Reveal>
  );
}

/**
 * Las seis capas de una capacidad AI-native, en la página de BECOME EMBED™.
 *
 * Es la sección más técnica del sitio a propósito: EMBED es donde se construye,
 * y quien evalúa esa compra necesita ver los nombres propios de lo que hay
 * debajo —RAG, tool calling, evaluaciones, observabilidad— antes de creer que
 * aquí se sabe operar y no solo prototipar.
 *
 * Las seis capas van en este orden y no en otro: es el recorrido de una
 * petición dentro del sistema, del modelo a la operación. Ordenadas por
 * importancia se leerían como una lista de tecnologías; ordenadas así se leen
 * como una arquitectura.
 */
export function BajoElCapo({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    <Section band="darker">
      <Kicker dark>{t.capoKicker}</Kicker>
      <Headline dark>{t.capoTitulo}</Headline>
      <Cols min="260px">
        {t.capoCapas.map(([nombre, linea]) => (
          <Reveal as="div" key={nombre} className="row-hit" style={{ borderTop: '1px solid var(--green-line)', paddingTop: 'var(--space-5)' }}>
            <p style={{ margin: 0, font: 'var(--type-mono)', fontSize: 13, letterSpacing: 'var(--track-mono)', textTransform: 'uppercase', color: 'var(--electric-green)' }}>
              {nombre}
            </p>
            <Body dark style={{ marginTop: 'var(--space-4)' }}>{linea}</Body>
          </Reveal>
        ))}
      </Cols>
    </Section>
  );
}

/** El bloque de landscape tecnológico de BECOME DISCOVER™. */
export function EstrategiaDeModelos({ lang = 'es' }) {
  const t = T[lang] || T.es;
  return (
    /* DISCOVER sigue siendo estratégico: esto no es arquitectura técnica, es
       la lista de opciones que hay sobre la mesa cuando se decide el roadmap.
       Por eso son etiquetas y una frase de criterio, y no diagramas. */
    <Section band="light">
      <Kicker>{t.modelosKicker}</Kicker>
      <Headline>{t.modelosTitulo}</Headline>
      <Lead>{t.modelosLead}</Lead>
      <Body style={{ marginTop: 'var(--space-6)' }}>{t.modelosIntro}</Body>
      <ul style={{ listStyle: 'none', margin: 'var(--space-6) 0 0', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        {t.modelosLista.map((x, i) => (
          <Reveal as="li" index={i} key={x} style={{
            padding: '8px 14px', border: '1px solid var(--border-strong)', borderRadius: 2,
            font: 'var(--type-mono)', fontSize: 13, color: 'var(--text-body)',
          }}>
            {x}
          </Reveal>
        ))}
      </ul>
      <Body style={{ marginTop: 'var(--space-8)' }}>{t.modelosCierre}</Body>
    </Section>
  );
}
