import { notFound } from "next/navigation";
import { Buildings, Cake, CalendarCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";

import { prisma } from "@/lib/prisma";
import { muro } from "@/lib/reconocimientos";
import { serializarReconocimiento } from "@/lib/serializar";
import { sesionConfigurada } from "@/lib/sesion";
import { diaYMes } from "@/lib/fechas";
import Marco from "@/componentes/Marco";
import Avatar from "@/componentes/Avatar";
import IconoValor from "@/componentes/IconoValor";
import Reconocimiento from "@/componentes/Reconocimiento";

export const dynamic = "force-dynamic";

export default async function Persona({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const usuario = await sesionConfigurada();
  const { id } = await params;

  // El filtro por empresa es lo que impide ver el perfil de alguien de otra
  // compañía escribiendo su id en la barra de direcciones.
  const persona = await prisma.user.findFirst({
    where: { id, companyId: usuario.companyId, activo: true },
    select: {
      id: true,
      nombre: true,
      imagen: true,
      equipo: true,
      cargo: true,
      bio: true,
      cumpleanos: true,
      fechaIngreso: true,
    },
  });
  if (!persona) notFound();

  const [recibidos, yo, porValor, reconocedores] = await Promise.all([
    muro(usuario.companyId, persona.id, 15),
    prisma.user.findUniqueOrThrow({
      where: { id: usuario.id },
      select: { id: true, nombre: true, imagen: true },
    }),
    prisma.recognition.groupBy({
      by: ["valueId"],
      where: { companyId: usuario.companyId, paraUserId: persona.id },
      _count: { _all: true },
      orderBy: { _count: { valueId: "desc" } },
      take: 4,
    }),
    prisma.recognition.findMany({
      where: { companyId: usuario.companyId, paraUserId: persona.id },
      select: { deUserId: true },
      distinct: ["deUserId"],
    }),
  ]);

  const valores = await prisma.value.findMany({
    where: { id: { in: porValor.map((v) => v.valueId) } },
    select: { id: true, nombre: true, icono: true },
  });
  const porId = new Map(valores.map((v) => [v.id, v]));

  const dados = await prisma.recognition.count({
    where: { companyId: usuario.companyId, deUserId: persona.id },
  });

  return (
    <Marco actual="/feed">
      <div className="columna-feed">
        <header className="perfil">
          <Avatar persona={persona} tamano="xl" enlazado={false} />

          <div className="perfil__datos">
            <h1>{persona.nombre}</h1>
            {persona.cargo && <p className="perfil__cargo">{persona.cargo}</p>}

            <ul className="perfil__hechos">
              {persona.equipo && (
                <li>
                  <Buildings size={16} aria-hidden="true" />
                  {persona.equipo}
                </li>
              )}
              {persona.fechaIngreso && (
                <li>
                  <CalendarCheck size={16} aria-hidden="true" />
                  En la empresa desde {persona.fechaIngreso.getUTCFullYear()}
                </li>
              )}
              {persona.cumpleanos && (
                <li>
                  <Cake size={16} aria-hidden="true" />
                  {/* Solo el día y el mes: el año de nacimiento no es asunto
                      de nadie y no hace falta para felicitar. */}
                  {diaYMes(persona.cumpleanos)}
                </li>
              )}
            </ul>

            {persona.bio && <p className="perfil__bio">{persona.bio}</p>}
          </div>
        </header>

        <div className="perfil__cifras">
          <div className="tarjeta">
            <span className="metrica__cifra">{recibidos.length}</span>
            <span className="metrica__pie">reconocimientos recientes</span>
          </div>
          <div className="tarjeta">
            <span className="metrica__cifra">{reconocedores.length}</span>
            <span className="metrica__pie">personas distintas le han reconocido</span>
          </div>
          <div className="tarjeta">
            <span className="metrica__cifra">{dados}</span>
            <span className="metrica__pie">reconocimientos que ha dado</span>
          </div>
        </div>

        {porValor.length > 0 && (
          <section className="tarjeta">
            <h2 className="titulo-seccion">
              <Sparkle size={18} weight="fill" aria-hidden="true" />
              Por lo que le reconocen
            </h2>
            <ul className="lista-valores">
              {porValor.map((v) => (
                <li key={v.valueId}>
                  <span className="insignia-valor">
                    <IconoValor icono={porId.get(v.valueId)?.icono} />
                    {porId.get(v.valueId)?.nombre}
                  </span>
                  <span className="meta">
                    {v._count._all} {v._count._all === 1 ? "vez" : "veces"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <h2 className="titulo-seccion">Su muro</h2>

        {recibidos.length === 0 ? (
          <div className="vacio">
            <h2>Todavía nadie le ha reconocido nada</h2>
            <p>
              Si has trabajado con {persona.nombre.split(" ")[0]} esta semana,
              probablemente tengas algo que contar.
            </p>
          </div>
        ) : (
          <div className="feed">
            {recibidos.map((r) => (
              <Reconocimiento
                key={r.id}
                reconocimiento={serializarReconocimiento(r)}
                usuarioActual={yo}
              />
            ))}
          </div>
        )}
      </div>
    </Marco>
  );
}
