"use client";

import Link from "next/link";
import { useRutas } from "./useRutas";

// El avatar.
//
// Sin foto no se enseña una silueta gris: se generan las iniciales sobre un
// color derivado del identificador de la persona. Es determinista, así que la
// misma persona sale siempre del mismo color y el ojo la reconoce en el feed
// antes de leer el nombre — que es justo lo que hace que una lista parezca
// gente y no filas.
//
// Los colores salen de la rampa navy de BECOME más el verde de marca. No se
// inventa ninguno, y todos tienen contraste suficiente con el blanco del texto.

const COLORES = [
  { fondo: "#0A0E27", tinta: "#00FF88" },
  { fondo: "#1A202C", tinta: "#E0F7FF" },
  { fondo: "#2D3748", tinta: "#00FFAA" },
  { fondo: "#141A3A", tinta: "#E2E8F0" },
  { fondo: "#0E1330", tinta: "#00FF88" },
  { fondo: "#3D4A63", tinta: "#F7FAFC" },
] as const;

const TAMANOS = { sm: 32, md: 44, lg: 64, xl: 112 } as const;

export type TamanoAvatar = keyof typeof TAMANOS;

function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function color(id: string) {
  let suma = 0;
  for (let i = 0; i < id.length; i++) suma = (suma + id.charCodeAt(i)) % 4096;
  return COLORES[suma % COLORES.length];
}

export default function Avatar({
  persona,
  tamano = "md",
  enlazado = true,
}: {
  persona: { id: string; nombre: string; imagen?: string | null };
  tamano?: TamanoAvatar;
  enlazado?: boolean;
}) {
  const r = useRutas();
  const px = TAMANOS[tamano];
  const paleta = color(persona.id);

  const contenido = persona.imagen ? (
    // Es <img> y no <Image> de Next a propósito: las fotos las sirve una ruta
    // que comprueba la sesión, y el optimizador de Next las pediría desde el
    // servidor, sin cookie, y recibiría un 401.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/imagenes/${persona.imagen}`}
      alt=""
      width={px}
      height={px}
      className="avatar__foto"
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span
      className="avatar__iniciales"
      style={{ background: paleta.fondo, color: paleta.tinta }}
      aria-hidden="true"
    >
      {iniciales(persona.nombre)}
    </span>
  );

  const marco = (
    <span
      className="avatar"
      style={{ width: px, height: px, fontSize: Math.round(px * 0.36) }}
    >
      {contenido}
    </span>
  );

  if (!enlazado) return marco;

  return (
    <Link
      href={r.persona(persona.id)}
      className="avatar__enlace"
      aria-label={`Ver el perfil de ${persona.nombre}`}
    >
      {marco}
    </Link>
  );
}
