import type { Icon } from "@phosphor-icons/react";
import {
  AnchorIcon, BroomIcon, ChatsCircleIcon, ClockIcon, CompassIcon, EyeIcon,
  FireIcon, GiftIcon, HandHeartIcon, HandshakeIcon, HeartIcon, LightbulbIcon,
  LightningIcon, MagnifyingGlassIcon, MegaphoneIcon, MountainsIcon, PlantIcon,
  PuzzlePieceIcon, RocketIcon, ScalesIcon, ShieldIcon, SparkleIcon, StarIcon,
  TargetIcon, TreeStructureIcon, TrophyIcon, UsersIcon, WrenchIcon,
} from "@phosphor-icons/react/dist/ssr";

// El catálogo de iconos para los valores de la empresa.
//
// Antes cada valor llevaba un emoji escrito a mano. Eso tenía tres problemas
// que solo se ven en producción: el mismo emoji se dibuja distinto en Windows,
// en Android y en un Mac, así que el valor de la empresa no se ve igual para
// todo el mundo; no hereda el color del sistema de diseño; y pedirle a alguien
// que «escriba un emoji» en un campo de texto produce cajas vacías y banderas
// puestas por error.
//
// Son iconos de Phosphor, la misma familia que usa el resto de Pulse y el
// sitio de BECOME. Están elegidos uno a uno para lo que una empresa de LATAM
// suele poner como valor: no es el catálogo entero de Phosphor, que son más de
// mil y convierte elegir en un trabajo.

export type ClaveIcono = keyof typeof CATALOGO;

export const CATALOGO = {
  colaboracion: { Componente: HandshakeIcon, nombre: "Colaboración" },
  equipo: { Componente: UsersIcon, nombre: "Equipo" },
  cuidado: { Componente: HandHeartIcon, nombre: "Cuidado" },
  cliente: { Componente: TargetIcon, nombre: "Cliente" },
  criterio: { Componente: CompassIcon, nombre: "Criterio" },
  aprendizaje: { Componente: PlantIcon, nombre: "Aprendizaje" },
  ideas: { Componente: LightbulbIcon, nombre: "Ideas" },
  energia: { Componente: LightningIcon, nombre: "Energía" },
  integridad: { Componente: ShieldIcon, nombre: "Integridad" },
  ambicion: { Componente: RocketIcon, nombre: "Ambición" },
  pasion: { Componente: HeartIcon, nombre: "Pasión" },
  atencion: { Componente: EyeIcon, nombre: "Atención" },
  justicia: { Componente: ScalesIcon, nombre: "Justicia" },
  superacion: { Componente: MountainsIcon, nombre: "Superación" },
  encaje: { Componente: PuzzlePieceIcon, nombre: "Encaje" },
  comunicacion: { Componente: ChatsCircleIcon, nombre: "Comunicación" },
  puntualidad: { Componente: ClockIcon, nombre: "Puntualidad" },
  oficio: { Componente: WrenchIcon, nombre: "Oficio" },
  curiosidad: { Componente: MagnifyingGlassIcon, nombre: "Curiosidad" },
  voz: { Componente: MegaphoneIcon, nombre: "Voz" },
  logro: { Componente: TrophyIcon, nombre: "Logro" },
  excelencia: { Componente: StarIcon, nombre: "Excelencia" },
  impulso: { Componente: FireIcon, nombre: "Impulso" },
  estructura: { Componente: TreeStructureIcon, nombre: "Estructura" },
  chispa: { Componente: SparkleIcon, nombre: "Chispa" },
  limpieza: { Componente: BroomIcon, nombre: "Orden" },
  constancia: { Componente: AnchorIcon, nombre: "Constancia" },
  generosidad: { Componente: GiftIcon, nombre: "Generosidad" },
} satisfies Record<string, { Componente: Icon; nombre: string }>;

export const CLAVES = Object.keys(CATALOGO) as ClaveIcono[];

export const ICONO_POR_DEFECTO: ClaveIcono = "chispa";

/// Devuelve el componente del icono, o el de por defecto si la clave guardada
/// ya no existe. Un valor creado hoy tiene que seguir dibujándose el día que
/// se retire un icono del catálogo.
export function iconoDeValor(clave: string | null | undefined) {
  return (CATALOGO[clave as ClaveIcono] ?? CATALOGO[ICONO_POR_DEFECTO]).Componente;
}

export function nombreDeIcono(clave: string | null | undefined) {
  return (CATALOGO[clave as ClaveIcono] ?? CATALOGO[ICONO_POR_DEFECTO]).nombre;
}

/// Los valores que se proponen al montar una empresa nueva. No se crean solos:
/// se enseñan marcados en el asistente para poder quitarlos. Una empresa que
/// arranca con cinco valores que no eligió tiene cinco valores que nadie usa.
export const VALORES_SUGERIDOS: {
  nombre: string;
  descripcion: string;
  icono: ClaveIcono;
}[] = [
  {
    nombre: "Colaboración",
    descripcion: "Sale de su carril para que otro llegue.",
    icono: "colaboracion",
  },
  {
    nombre: "Obsesión por el cliente",
    descripcion: "Decide mirando al cliente, no al proceso.",
    icono: "cliente",
  },
  {
    nombre: "Criterio",
    descripcion: "Decide bien con información incompleta.",
    icono: "criterio",
  },
  {
    nombre: "Aprender rápido",
    descripcion: "Cambia de opinión cuando aparece el dato.",
    icono: "aprendizaje",
  },
  {
    nombre: "Cuidar al equipo",
    descripcion: "Se nota cuando no está.",
    icono: "cuidado",
  },
];
