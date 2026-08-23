import { iconoDeValor } from "@/lib/iconos-valores";

// El icono de un valor, dibujado a partir de su clave.
//
// Es decorativo por defecto —el nombre del valor va siempre al lado— así que
// se oculta del árbol de accesibilidad. Un lector de pantalla que anuncia
// «icono de apretón de manos, Colaboración» está diciendo lo mismo dos veces.

export default function IconoValor({
  icono,
  size = 16,
  weight = "fill",
}: {
  icono: string | null | undefined;
  size?: number;
  weight?: "regular" | "fill" | "bold";
}) {
  const Componente = iconoDeValor(icono);
  return <Componente size={size} weight={weight} aria-hidden="true" />;
}
