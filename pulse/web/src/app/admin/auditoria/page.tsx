import type { AccionAuditada } from "@prisma/client";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { sesionDeAdmin } from "@/lib/sesion";
import { listarAuditoria, type Cambio } from "@/lib/auditoria";
import { fechaLarga } from "@/lib/fechas";
import Marco from "@/componentes/Marco";
import PestanasAdmin from "@/componentes/PestanasAdmin";

export const metadata = { title: "Auditoría" };
export const dynamic = "force-dynamic";

const ETIQUETAS: Record<AccionAuditada, string> = {
  EMPRESA_ACTUALIZADA: "Configuración de la empresa",
  PERSONA_INVITADA: "Alta de persona",
  PERSONA_EDITADA: "Cambio en una persona",
  PERSONA_DESACTIVADA: "Persona desactivada",
  PERSONA_REACTIVADA: "Persona reactivada",
  INVITACION_RENOVADA: "Invitación renovada",
  INVITACION_ACEPTADA: "Invitación aceptada",
  VALOR_CREADO: "Valor creado",
  VALOR_RETIRADO: "Valor retirado",
  VALOR_REACTIVADO: "Valor reactivado",
};

// Las acciones que quitan acceso o dan permisos se marcan aparte: son las que
// alguien va a buscar cuando pregunte «¿quién hizo esto?».
const SENSIBLES = new Set<AccionAuditada>([
  "PERSONA_DESACTIVADA",
  "PERSONA_EDITADA",
  "EMPRESA_ACTUALIZADA",
]);

export default async function Auditoria({
  searchParams,
}: {
  searchParams: Promise<{ accion?: string }>;
}) {
  const { companyId } = await sesionDeAdmin();
  const { accion } = await searchParams;

  const filtro =
    accion && accion in ETIQUETAS ? (accion as AccionAuditada) : undefined;
  const registros = await listarAuditoria(companyId, { accion: filtro, limite: 200 });

  return (
    <Marco actual="/admin">
      <div className="cabecera-pagina">
        <h1>Auditoría</h1>
        <p>
          Quién cambió qué y cuándo. Solo acciones de administración: quién
          reconoció a quién ya está en el feed, con su fecha.
        </p>
      </div>

      <PestanasAdmin />

      <form className="barra-acciones">
        <div className="campo campo--compacto barra-acciones__buscador">
          <label htmlFor="accion">Filtrar por acción</label>
          <div className="select-envoltura">
            <select id="accion" name="accion" defaultValue={filtro ?? ""}>
              <option value="">Todas</option>
              {Object.entries(ETIQUETAS).map(([valor, texto]) => (
                <option key={valor} value={valor}>
                  {texto}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="boton boton--discreto">
          Filtrar
        </button>
      </form>

      {registros.length === 0 ? (
        <div className="vacio">
          <ShieldCheck size={32} aria-hidden="true" />
          <h2>Nada registrado todavía</h2>
          <p>
            Aquí van a aparecer las altas, los cambios de permisos, las
            desactivaciones y los cambios de configuración.
          </p>
        </div>
      ) : (
        <section className="tarjeta">
          <ul className="auditoria">
            {registros.map((r) => {
              const cambios = (r.cambios ?? []) as unknown as Cambio[];
              return (
                <li key={r.id} data-sensible={SENSIBLES.has(r.accion) || undefined}>
                  <div className="auditoria__linea">
                    <span className="auditoria__accion">{ETIQUETAS[r.accion]}</span>
                    <time className="meta" dateTime={r.creadoEn.toISOString()}>
                      {fechaLarga(r.creadoEn)}
                    </time>
                  </div>

                  <p className="auditoria__quien">
                    <strong>{r.actorNombre ?? "Alguien"}</strong>
                    {r.objetivoNombre && (
                      <>
                        {" · sobre "}
                        <strong>{r.objetivoNombre}</strong>
                      </>
                    )}
                  </p>

                  {cambios.length > 0 && (
                    <ul className="auditoria__cambios">
                      {cambios.map((c, i) => (
                        <li key={i}>
                          <span className="auditoria__campo">{c.campo}</span>
                          <span className="auditoria__antes">
                            {formatear(c.campo, c.antes)}
                          </span>
                          <span aria-hidden="true">→</span>
                          <span className="auditoria__despues">
                            {formatear(c.campo, c.despues)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {registros.length === 200 && (
            <p className="meta" style={{ marginTop: "var(--space-5)" }}>
              Se muestran los 200 más recientes.
            </p>
          )}
        </section>
      )}
    </Marco>
  );
}

// Los roles se guardan como el enum de la base. Enseñar «COLABORADOR» en un
// registro que va a leer alguien de RRHH seis meses después es enseñarle un
// detalle de implementación.
const ROLES: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Manager",
  COLABORADOR: "Colaborador",
};

function formatear(campo: string, valor: unknown) {
  if (valor === null || valor === undefined || valor === "") return "vacío";
  const texto = String(valor);
  if (campo === "permisos") return ROLES[texto] ?? texto;
  // El nombre de un archivo de imagen no le dice nada a nadie.
  if (campo === "logotipo") return "una imagen";
  return texto;
}
