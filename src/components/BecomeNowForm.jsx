import React from 'react';
import ConversationalForm from './ConversationalForm.jsx';

/**
 * Formulario de BECOME NOW™ (§19 del documento).
 *
 * Pide más que el de contacto general, y a propósito: aquí la primera respuesta
 * de BECOME es una propuesta de Sesión 0, y para prepararla hace falta saber
 * área, tamaño de grupo, herramientas y modalidad. Cada campo evita una ida y
 * vuelta por correo — que es precisamente el motivo por el que estos diez
 * campos se preguntan de uno en uno y no todos de golpe.
 */

const FIELDS = {
  es: [
    { name: 'nombre', short: 'Nombre', label: '¿Cómo te llamas?', required: true, autoComplete: 'name' },
    { name: 'email', short: 'Email', label: 'Tu email corporativo', type: 'email', required: true, autoComplete: 'email' },
    { name: 'empresa', short: 'Empresa', label: '¿En qué empresa trabajas?', required: true, autoComplete: 'organization' },
    { name: 'rol', short: 'Rol', label: '¿Cuál es tu rol?', required: true, autoComplete: 'organization-title' },
    { name: 'area', short: 'Área a capacitar', label: '¿Qué área quieres capacitar?', required: true, placeholder: 'Por ejemplo: Finanzas' },
    {
      name: 'participantes', short: 'Nº de personas', label: '¿Cuántas personas participarían?',
      inputMode: 'numeric', placeholder: 'Por ejemplo: 12',
      help: 'Un número aproximado nos vale. Los grupos pequeños permiten que cada participante construya y valide sus propios flujos de trabajo.',
    },
    {
      name: 'herramientas', short: 'Herramientas', label: '¿Qué herramientas tenéis disponibles?', type: 'multi',
      options: ['ChatGPT', 'Claude', 'Gemini', 'Microsoft Copilot', 'Otras', 'Aún no definido'],
      help: 'Puedes marcar varias. El programa se adapta a las licencias y políticas que ya existan.',
    },
    {
      name: 'procesos', short: 'Procesos a mejorar', label: '¿Qué procesos o tareas quieres mejorar?', type: 'textarea', required: true, wide: true,
      help: 'Cuanto más concreto, mejor prepararemos la sesión de entendimiento.',
    },
    {
      name: 'modalidad', short: 'Modalidad', label: '¿Presencial, virtual o híbrida?', type: 'select',
      options: ['Aún no definida', 'Presencial', 'Virtual', 'Híbrida'], default: 'Aún no definida',
    },
    { name: 'timeline', short: 'Plazo', label: '¿Para cuándo lo necesitáis?', placeholder: 'Por ejemplo: este trimestre' },
  ],
  en: [
    { name: 'name', short: 'Name', label: 'What’s your name?', required: true, autoComplete: 'name' },
    { name: 'email', short: 'Email', label: 'Your work email', type: 'email', required: true, autoComplete: 'email' },
    { name: 'company', short: 'Company', label: 'Where do you work?', required: true, autoComplete: 'organization' },
    { name: 'role', short: 'Role', label: 'What’s your role?', required: true, autoComplete: 'organization-title' },
    { name: 'area', short: 'Area to train', label: 'Which area do you want to train?', required: true, placeholder: 'For example: Finance' },
    {
      name: 'participants', short: 'People', label: 'How many people would take part?',
      inputMode: 'numeric', placeholder: 'For example: 12',
      help: 'An approximate number is fine. Small cohorts let each participant build and validate their own workflows.',
    },
    {
      name: 'tools', short: 'Tools', label: 'What tools do you already have?', type: 'multi',
      options: ['ChatGPT', 'Claude', 'Gemini', 'Microsoft Copilot', 'Other', 'Not decided yet'],
      help: 'You can select more than one. The program adapts to whatever licenses and policies already exist.',
    },
    {
      name: 'processes', short: 'Processes to improve', label: 'What processes or tasks do you want to improve?', type: 'textarea', required: true, wide: true,
      help: 'The more concrete, the better we can prepare the understanding session.',
    },
    {
      name: 'format', short: 'Format', label: 'In person, virtual or hybrid?', type: 'select',
      options: ['Not decided yet', 'In person', 'Virtual', 'Hybrid'], default: 'Not decided yet',
    },
    { name: 'timeline', short: 'Timeline', label: 'When do you need this by?', placeholder: 'For example: this quarter' },
  ],
};

const COPY = {
  es: {
    formName: 'Diseñemos la capacitación alrededor de tu empresa',
    title: 'Cuéntanos cómo trabaja tu equipo hoy.',
    lead: 'Solo necesitamos el contexto esencial: qué necesitas cambiar, dónde estás hoy y qué resultado buscas. Con eso preparamos la sesión de entendimiento.',
    launchLabel: 'Diseña tu programa',
    submitLabel: 'Solicita una sesión de entendimiento',
    confirmation: 'Gracias. Revisaremos el contexto y coordinaremos una primera conversación para entender el área antes de diseñar la propuesta.',
  },
  en: {
    formName: 'Let’s design the training around your company',
    title: 'Tell us how your team works today.',
    lead: 'We only need the essential context: what needs to change, where you are today and the outcome you are aiming for. That’s what we use to prepare the understanding session.',
    launchLabel: 'Design your program',
    submitLabel: 'Request an understanding session',
    confirmation: 'Thanks. We’ll review the context and set up a first conversation to understand the area before designing the proposal.',
  },
};

export default function BecomeNowForm({ lang = 'es' }) {
  const c = COPY[lang];
  return (
    <ConversationalForm
      formName={c.formName}
      title={c.title}
      lead={c.lead}
      launchLabel={c.launchLabel}
      fields={FIELDS[lang]}
      submitLabel={c.submitLabel}
      confirmation={c.confirmation}
      dark
      lang={lang}
      formId="become-now"
    />
  );
}
