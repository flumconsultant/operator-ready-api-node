import React from 'react';

/**
 * Formulario de BECOME NOW™ (§19 del documento).
 *
 * Pide más que el de contacto general, y a propósito: aquí la primera respuesta
 * de BECOME es una propuesta de Sesión 0, y para prepararla hace falta saber
 * área, tamaño de grupo, herramientas y modalidad. Cada campo de este formulario
 * evita una pregunta de ida y vuelta por correo.
 *
 * Igual que el de contacto, todavía no tiene destino. La confirmación lo dice.
 */

const TOOLS = ['ChatGPT', 'Claude', 'Gemini', 'Microsoft Copilot', 'Otras', 'Aún no definido'];
const MODES = ['Presencial', 'Virtual', 'Híbrida', 'Aún no definida'];

export default function BecomeNowForm() {
  const [sent, setSent] = React.useState(false);
  const [tools, setTools] = React.useState([]);

  const toggleTool = (t) =>
    setTools((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  if (sent) {
    return (
      <div role="status" aria-live="polite" style={{ maxWidth: 'var(--maxw-prose)' }}>
        <p style={{ margin: 0, font: 'var(--type-lead)', color: 'var(--white)' }}>
          Gracias. Revisaremos el contexto y coordinaremos una primera conversación
          para entender el área antes de diseñar la propuesta.
        </p>
        <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-body)', color: 'var(--slate-300)' }}>
          Mientras el sitio está en construcción este formulario no está conectado a
          ningún destino, así que tu mensaje no ha salido del navegador. Escríbenos a{' '}
          <a href="mailto:hello@become.company" style={{ color: 'var(--electric-green)' }}>hello@become.company</a>{' '}
          y lo leemos hoy.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
      style={{ maxWidth: 880 }}
    >
      <div data-cols style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <div>
          <label htmlFor="bn-nombre" style={labelDark}>Nombre</label>
          <input id="bn-nombre" name="nombre" type="text" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="bn-email" style={labelDark}>Email corporativo</label>
          <input id="bn-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="bn-empresa" style={labelDark}>Empresa</label>
          <input id="bn-empresa" name="empresa" type="text" required autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="bn-rol" style={labelDark}>Rol</label>
          <input id="bn-rol" name="rol" type="text" required autoComplete="organization-title" />
        </div>
        <div>
          <label htmlFor="bn-area" style={labelDark}>Área que desea capacitar</label>
          <input id="bn-area" name="area" type="text" required placeholder="Por ejemplo: Finanzas" />
        </div>
        <div>
          <label htmlFor="bn-personas" style={labelDark}>Número aproximado de participantes</label>
          <input id="bn-personas" name="participantes" type="text" inputMode="numeric" placeholder="Por ejemplo: 12" />
        </div>
      </div>

      <fieldset style={{ border: 0, padding: 0, margin: 'var(--space-7) 0 0' }}>
        <legend style={{ ...labelDark, padding: 0 }}>Herramientas disponibles</legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-2, 8px)' }}>
          {TOOLS.map((t) => {
            const on = tools.includes(t);
            return (
              <label
                key={t}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  padding: '10px 16px', minHeight: 44,
                  border: `1px solid ${on ? 'var(--electric-green)' : 'var(--border-strong-dark)'}`,
                  borderRadius: 'var(--radius-pill)',
                  background: on ? 'rgba(0,255,136,.12)' : 'transparent',
                  color: on ? 'var(--electric-green)' : 'var(--slate-200)',
                  font: 'var(--type-body)', fontSize: 'var(--text-body-sm)',
                  textTransform: 'none', letterSpacing: 'normal', margin: 0,
                  transition: 'background .2s ease, border-color .2s ease, color .2s ease',
                }}
              >
                <input
                  type="checkbox" name="herramientas" value={t}
                  checked={on} onChange={() => toggleTool(t)}
                  style={{ width: 'auto', minHeight: 0, margin: 0, accentColor: 'var(--electric-green)' }}
                />
                {t}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div style={{ marginTop: 'var(--space-7)' }}>
        <label htmlFor="bn-procesos" style={labelDark}>¿Qué procesos o tareas desea mejorar?</label>
        <textarea id="bn-procesos" name="procesos" rows={5} required style={{ minHeight: 140, resize: 'vertical' }} />
      </div>

      <div data-cols style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        <div>
          <label htmlFor="bn-modalidad" style={labelDark}>Modalidad preferida</label>
          <select id="bn-modalidad" name="modalidad" defaultValue={MODES[3]}>
            {MODES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="bn-timeline" style={labelDark}>Timeline estimado</label>
          <input id="bn-timeline" name="timeline" type="text" placeholder="Por ejemplo: este trimestre" />
        </div>
      </div>

      <p style={{ margin: 'var(--space-6) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--slate-300)', maxWidth: '58ch' }}>
        Usaremos estos datos únicamente para preparar la sesión de entendimiento y la
        propuesta. No te suscribimos a nada ni compartimos la información con terceros.
      </p>

      <button
        type="submit"
        className="cta-primary"
        style={{
          marginTop: 'var(--space-7)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 52, padding: '0 var(--space-7)', borderRadius: 'var(--radius-pill)', border: 0,
          background: 'var(--electric-green)', color: 'var(--deep-navy)', cursor: 'pointer',
          font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
          width: 'auto',
        }}
      >
        Solicita una sesión de entendimiento
      </button>
    </form>
  );
}

const labelDark = {
  display: 'block',
  font: 'var(--type-label)',
  letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase',
  color: 'var(--slate-300)',
  marginBottom: 8,
};
