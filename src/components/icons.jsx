import React from 'react';
import {
  UsersThree, Database, Robot, GearSix,
  Lightning, SealCheck, TrendUp, ShieldCheck, GraduationCap,
  Target, Handshake, PuzzlePiece,
  Compass, FlowArrow, Cube,
  Wrench, Anchor, ArrowsOutSimple,
  ChatCircleText, CalendarCheck, Signpost,
  Books, MapTrifold, Scales, ChartLineUp, Stack, Clock,
  CheckCircle, XCircle, FileText, Briefcase, Lightbulb, Path,
  Cpu, TreeStructure, UserFocus, Crosshair, MagnifyingGlass, Certificate,
} from '@phosphor-icons/react';

/**
 * Registro de iconografía.
 *
 * Un solo set (Phosphor), un solo grosor y un solo tamaño base. La razón de
 * centralizarlo aquí y no importar el icono en cada página es que la coherencia
 * de un sistema de iconos se pierde por acumulación: la quinta página elige un
 * icono de otra familia y ya hay dos lenguajes visuales.
 *
 * Los iconos de esta web son decorativos: siempre acompañan a un rótulo
 * visible, nunca lo sustituyen. Por eso van con aria-hidden y sin título — un
 * lector de pantalla que los anunciara repetiría el texto que ya lee al lado.
 */

const REGISTRY = {
  /* Los cuatro sistemas */
  people: UsersThree,
  data: Database,
  agents: Robot,
  operations: GearSix,

  /* Outcomes */
  speed: Lightning,
  quality: SealCheck,
  growth: TrendUp,
  risk: ShieldCheck,
  capability: GraduationCap,

  /* Principios */
  target: Target,
  together: Handshake,
  fit: PuzzlePiece,

  /* Escenarios y etapas */
  decision: Compass,
  flow: FlowArrow,
  product: Cube,
  build: Wrench,
  embed: Anchor,
  scale: ArrowsOutSimple,

  /* Conversación */
  chat: ChatCircleText,
  calendar: CalendarCheck,
  signpost: Signpost,

  /* Sí / no — el par de la tabla "qué es y qué no es". El icono está ahí
     porque el color solo no basta: quien no distingue verde y gris lee dos
     columnas idénticas. */
  yes: CheckCircle,
  no: XCircle,

  /* Contenido */
  library: Books,
  map: MapTrifold,
  balance: Scales,
  measure: ChartLineUp,
  layers: Stack,
  time: Clock,
  doc: FileText,
  work: Briefcase,
  idea: Lightbulb,
  route: Path,

  /* ADN y cultura */
  native: Cpu,
  system: TreeStructure,
  accountable: UserFocus,
  outcome: Crosshair,
  inspect: MagnifyingGlass,
  trust: Certificate,
};

export function Ico({ name, size = 26, color = 'currentColor', weight = 'light', style }) {
  const C = REGISTRY[name];
  if (!C) return null;
  return <C size={size} color={color} weight={weight} aria-hidden="true" style={{ display: 'block', flex: 'none', ...style }} />;
}

/**
 * Icono con suelo propio. Sobre navy un trazo fino se pierde contra el nodo 3D;
 * el cuadrado le da el contraste que el trazo solo no tiene.
 */
export function IcoBadge({ name, dark, size = 22 }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 44, height: 44, flex: 'none',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${dark ? 'var(--green-line)' : 'var(--border-strong)'}`,
        background: dark ? 'rgba(0,255,136,.07)' : 'var(--white)',
        color: dark ? 'var(--electric-green)' : 'var(--text-accent)',
      }}
    >
      <Ico name={name} size={size} />
    </span>
  );
}
