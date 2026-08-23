import Anthropic from "@anthropic-ai/sdk";
import { entorno, iaActiva } from "../entorno";

// Un único cliente para todo el proceso. Se crea perezosamente porque sin clave
// no debe existir: la capa de IA es opcional y el resto del producto funciona
// sin ella.
let cliente: Anthropic | null = null;

export function anthropic(): Anthropic | null {
  if (!iaActiva) return null;
  cliente ??= new Anthropic({ apiKey: entorno.ANTHROPIC_API_KEY });
  return cliente;
}

export const MODELO = entorno.ANTHROPIC_MODELO;
