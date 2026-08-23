import type { EntradaFeed, FilaFeed } from "./reconocimientos";
import type { Celebracion } from "./celebraciones";

// El feed se pinta en el cliente porque tiene «cargar más», y lo que llega por
// `fetch` es JSON: ahí las fechas ya son cadenas. Si el servidor pasara objetos
// Date y la paginación cadenas, los componentes recibirían dos formas distintas
// del mismo dato y habría que comprobar cuál es en cada sitio donde se usa.
//
// Así que se convierte una sola vez, aquí, y todo lo que hay del feed hacia
// abajo trabaja con cadenas ISO. Es menos elegante que pasar Date y mucho más
// difícil de romper.

export type PersonaSerializada = {
  id: string;
  nombre: string;
  imagen: string | null;
  equipo: string | null;
  cargo?: string | null;
};

export type ReconocimientoSerializado = {
  id: string;
  mensaje: string;
  imagen: string | null;
  canal: "WEB" | "DISCORD";
  creadoEn: string;
  de: PersonaSerializada;
  para: PersonaSerializada;
  valor: { id: string; nombre: string; emoji: string };
  reacciones: { emoji: string; user: { id: string; nombre: string } }[];
  comentarios: {
    id: string;
    texto: string;
    creadoEn: string;
    user: { id: string; nombre: string; imagen: string | null };
  }[];
};

export type CelebracionSerializada = {
  tipo: "CUMPLEANOS" | "ANIVERSARIO";
  fecha: string;
  anos?: number;
  persona: PersonaSerializada;
};

export type EntradaSerializada =
  | { clase: "reconocimiento"; fecha: string; reconocimiento: ReconocimientoSerializado }
  | { clase: "celebracion"; fecha: string; celebracion: CelebracionSerializada };

export function serializarReconocimiento(r: FilaFeed): ReconocimientoSerializado {
  return {
    id: r.id,
    mensaje: r.mensaje,
    imagen: r.imagen,
    canal: r.canal,
    creadoEn: r.creadoEn.toISOString(),
    de: r.de,
    para: r.para,
    valor: r.valor,
    reacciones: r.reacciones,
    comentarios: r.comentarios.map((c) => ({
      id: c.id,
      texto: c.texto,
      creadoEn: c.creadoEn.toISOString(),
      user: c.user,
    })),
  };
}

function serializarCelebracion(c: Celebracion): CelebracionSerializada {
  return {
    tipo: c.tipo,
    fecha: c.fecha.toISOString(),
    anos: c.anos,
    persona: { ...c.persona, cargo: null },
  };
}

export function serializarEntradas(entradas: EntradaFeed[]): EntradaSerializada[] {
  return entradas.map((e) =>
    e.clase === "reconocimiento"
      ? {
          clase: "reconocimiento",
          fecha: e.fecha.toISOString(),
          reconocimiento: serializarReconocimiento(e.reconocimiento),
        }
      : {
          clase: "celebracion",
          fecha: e.fecha.toISOString(),
          celebracion: serializarCelebracion(e.celebracion),
        },
  );
}
