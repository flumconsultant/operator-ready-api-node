export const metadata = { title: "Revisa tu correo" };

export default function RevisaTuCorreo() {
  return (
    <div className="acceso">
      <div className="acceso__caja">
        <p className="etiqueta" style={{ marginBottom: "var(--space-3)" }}>
          BECOME Pulse
        </p>
        <h1>Te hemos enviado un enlace</h1>
        <p style={{ marginBottom: 0 }}>
          Ábrelo desde este mismo dispositivo. Caduca en 24 horas y solo
          funciona una vez.
        </p>
      </div>
    </div>
  );
}
