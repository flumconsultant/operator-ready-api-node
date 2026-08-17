# Auditoría del sistema visual — Become

Revisión de `templates/website-es/` contra los tokens de `tokens/*.css`.
Alcance: 10 artboards, 65 tokens en uso, 42 assets.

## Resumen

El sistema está bien construido. La disciplina de tokens es real: los artboards
no inventan colores sueltos, y respetan la separación entre superficies claras y
oscuras. No hay texto invisible, no hay bordes claros sobre fondos oscuros, y
todos los pares de color en uso pasan WCAG AA.

Los problemas que quedan son de peso de assets y de trampas latentes en la capa
de tokens, no de ejecución visual.

## Contraste (WCAG 2.1)

Todos los pares efectivamente usados en la maqueta pasan AA. La mayoría pasa AAA.

| Par | Ratio | AA | Uso |
|---|---:|---|---|
| `white` / `navy-900` | 19.00:1 | AAA | Titulares en dark |
| `ice-blue` / `navy-900` | 17.12:1 | AAA | Acento frío |
| `slate-100` / `navy-900` | 15.42:1 | AAA | Cuerpo en dark |
| `navy-700` / `off-white` | 15.57:1 | AAA | Cuerpo en claro |
| `electric-green` / `navy-950` | 15.00:1 | AAA | Acento sobre menú móvil |
| `deep-navy` / `neon-green` | 14.37:1 | AAA | CTA hover |
| `electric-green` / `navy-900` | 14.17:1 | AAA | Links hover |
| `deep-navy` / `electric-green` | 14.17:1 | AAA | CTA "Inicia tu Discovery" |
| `slate-200` / `navy-900` | 11.94:1 | AAA | Nav links |
| `slate-300` / `navy-950` | 8.45:1 | AAA | Metadatos en footer |
| `slate-300` / `navy-900` | 7.98:1 | AAA | Selector ES/EN |
| `slate-500` / `off-white` | 7.18:1 | AAA | `text-muted` en claro |
| `text-accent` (#0F7A46) / `off-white` | 5.15:1 | AA | Acento en claro |
| `slate-400` / `navy-950` | 5.01:1 | AA | Labels del footer |
| `slate-400` / `navy-900` | 4.73:1 | AA | Labels "Escenario"/"Output" |

### ~~Trampa latente: `--text-faint` en tema claro~~ — RESUELTO

`--text-faint:var(--slate-400)` daba **3.83:1 sobre `--off-white`** — por debajo
del mínimo AA de 4.5:1. No rompía nada todavía (el token estaba declarado pero sin
uso, y los 22 usos de `slate-400` caían todos sobre navy), pero estaba armado para
fallar en cuanto alguien lo usara en una sección clara.

**Resuelto:** se añadió `--slate-450:#626E82` al ramp y `--text-faint` apunta ahí
en `:root`. Da **4.92:1 sobre off-white**, con margen sobre AA.

Se descartó apuntar a `--slate-500` (7.18:1, la sugerencia original) porque
`--text-muted` ya es `slate-500`: los dos tokens habrían colapsado en el mismo
color y el tema claro habría perdido su escalón terciario. Con `slate-450` la
jerarquía queda en tres pasos reales — body 15.57:1 / muted 7.18:1 / faint 4.92:1.

`slate-400` queda documentado en el ramp como color exclusivo de superficies
oscuras. El bloque `[data-theme="dark"]` ya lo hacía bien y no se tocó.

### Margen ajustado en labels de 11px

`slate-400` sobre `navy-900` da 4.73:1 con `--text-label` a 11px y `.14em` de
tracking. Cumple AA, pero el margen es de 0.23 puntos. En pantallas de bajo
brillo o proyección esos labels van a costar. Subir a `slate-300` (7.98:1) no
cambia la jerarquía visual y da aire.

## ~~Peso de assets~~ — RESUELTO

Era el problema real de la maqueta. Una home de 4.7 MB solo en imágenes tardaba
~8 s en 4G promedio: para una consultora que le vende reinvención operativa a
comités ejecutivos, esa primera impresión trabajaba en contra del mensaje.

| Qué | Antes | Ahora |
|---|---:|---:|
| **Imágenes de la home** | **4.7 MB** | **473 KB** (−90%) |
| 8 fotos hero (PNG → WebP q82) | 10.0 MB | 349 KB (−96%) |
| `01-neural-network` (hero home) | 2.2 MB | 96 KB |
| Wordmarks blanco + navy | 1.2 MB | 103 KB |
| 78 iconos (WebP sin pérdida) | 2.1 MB | 1.15 MB (−46%) |
| `assets/` completo | 21 MB | 11 MB |

Las 8 fotos y los wordmarks se convirtieron a WebP calidad 82, ancho máximo
1920px (solo los wordmarks necesitaban reescalado; las fotos ya venían a 1600px o
menos). PSNR medido: 42.1 dB en `45-executive`, 38.8 dB en `01-neural-network` —
sin diferencia perceptible en comparación lado a lado. Los 78 iconos se
convirtieron a WebP sin pérdida. Los PNG reemplazados se borraron; siguen en el
historial de git si hiciera falta recuperarlos.

Además: `loading="lazy"` en todas las imágenes bajo el pliegue y
`fetchpriority="high"` en el hero de cada artboard, para que el peso restante no
compita con el primer render.

**Peso por artboard hoy:** home 473 KB · Framework 264 KB · Trabajo 180 KB ·
Nosotros 118 KB · Thinking 117 KB · Contacto 97 KB · Discovery 69 KB ·
BuildEmbed 68 KB.

### Pendiente en assets

- **Masters de marca sin optimizar** — `icon-navy.png` (3.0 MB),
  `brand-guidelines.png` (2.5 MB), `icon-official.png` (2.4 MB), `icon-white.png`
  y `wordmark-reference.png`. No los referencia ningún artboard, así que no pesan
  en la carga: son los originales de marca y se dejaron intactos a propósito. Son
  los 11 MB que quedan en `assets/`.
- **5 referencias rotas, previas a esta limpieza** —
  `02-data-streams.png`, `05-geometric-grid.png`, `48-ai-interface.png`,
  `49-journey.png` y `logo/isotype-negative.svg` se referencian en los artboards
  pero no existen en `assets/`. Decidir si se producen o se sustituyen por
  imágenes existentes: es decisión de contenido, no de sistema.

## Arquitectura de tokens

La capa semántica tiene definido un bloque `[data-theme="dark"]` completo, pero
**ningún artboard lo activa**. Las secciones oscuras se pintan a mano con tokens
literales del ramp (`--white`, `--slate-200`, `--navy-900`).

Hoy funciona y está bien ejecutado — precisamente por eso no hay choques. Pero
implica que la lógica de tema vive en dos sitios: en `colors.css` y en el criterio
de quien escribe cada sección. Cuando esto pase a componentes reales, conviene que
las secciones oscuras se envuelvan en `.become-dark` y usen los tokens semánticos,
para que el ramp literal quede como capa interna del sistema.

## Lo que está bien y conviene no tocar

- **Ratio de uso documentado en el propio token** (navy 60 / green 20 / ice blue
  10 / charcoal 10). Escrito como regla, no como sugerencia.
- **Escala tipográfica con `clamp()` en el hero** y tracking diferenciado por
  nivel, incluyendo `--track-descriptor` a `.34em` para la bajada del wordmark.
- **`prefers-reduced-motion` respetado** en las animaciones de reveal.
- **`:focus-visible` con outline verde de 2px y offset de 3px** en todos los
  interactivos. Esto casi nunca aparece en maquetas.
- **Áreas táctiles de 44px** en burger y CTA móvil.
- **Sin emojis como iconos** — todo son assets reales.
