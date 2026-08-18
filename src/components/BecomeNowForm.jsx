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

const FIELDS = [
  { name: 'nombre', short: 'Nombre', label: '¿Cómo te llamas?', required: true, autoComplete: 'name' },
  { name: 'email', short: 'Email', label: 'Tu email corporativo', type: 'email', required: true, autoComplete: 'email' },
  { name: 'empresa', short: 'Empresa', label: '¿En qué empresa trabajas?', required: true, autoComplete: 'organization' },
  { name: 'rol', short: 'Rol', label: '¿Cuál es tu rol?', required: true, autoComplete: 'organization-title' },
  { name: 'area', short: 'Área a capacitar', label: '¿Qué área quieres capacitar?', required: true, placeholder: 'Por ejemplo: Finanzas' },
  {
    name: 'participantes', short: 'Nº de personas', label: '¿Cuántas personas participarían?',
    inputMode: 'numeric', placeholder: 'Por ejemplo: 12',
    help: 'Un número aproximado nos vale. Las cohortes pequeñas permiten que cada participante construya y valide sus propios workflows.',
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
];

export default function BecomeNowForm() {
  return (
    <ConversationalForm
      formName="Diseñemos la capacitación alrededor de tu empresa"
      fields={FIELDS}
      submitLabel="Solicita una sesión de entendimiento"
      confirmation="Gracias. Revisaremos el contexto y coordinaremos una primera conversación para entender el área antes de diseñar la propuesta."
      dark
    />
  );
}
