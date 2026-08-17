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

### Trampa latente: `--text-faint` en tema claro

`--text-faint:var(--slate-400)` da **3.83:1 sobre `--off-white`** — por debajo del
mínimo AA de 4.5:1.

Hoy no rompe nada: `--text-faint` está declarado pero **no se usa en ningún
artboard**, y los 22 usos de `slate-400` caen todos sobre superficies navy, donde
sí cumple. Pero está armado para fallar en cuanto alguien lo use en una sección
clara.

**Fix sugerido:** en el bloque `:root` (claro), apuntar `--text-faint` a
`--slate-500` (7.18:1) y dejar `slate-400` como color exclusivo de superficies
oscuras. El bloque `[data-theme="dark"]` ya lo hace bien.

### Margen ajustado en labels de 11px

`slate-400` sobre `navy-900` da 4.73:1 con `--text-label` a 11px y `.14em` de
tracking. Cumple AA, pero el margen es de 0.23 puntos. En pantallas de bajo
brillo o proyección esos labels van a costar. Subir a `slate-300` (7.98:1) no
cambia la jerarquía visual y da aire.

## Peso de assets

Este es el problema real de la maqueta.

| Qué | Peso |
|---|---:|
| Imágenes solo en la home | **4.7 MB** |
| `assets/` completo | 21 MB |
| `01-neural-network.png` (hero home) | 2.2 MB |
| `icon-navy.png` | 3.0 MB |
| `icon-official.png` | 2.4 MB |
| `brand-guidelines.png` | 2.5 MB |

Una home de 4.7 MB solo en imágenes tarda ~8 s en 4G promedio. Para una consultora
que le vende reinvención operativa a comités ejecutivos, esa primera impresión
trabaja en contra del mensaje.

Los iconos están bien (~50 KB cada uno). El daño está en las 8 fotos hero y en
tres archivos de marca sobredimensionados.

**Fix:** convertir las 8 fotos a WebP con calidad 82 y ancho máximo 1920px, y los
iconos de marca a SVG donde exista el vectorial (ya hay `icon-navy.svg`,
`icon-white.svg`, `icon-mono-*.svg`). Reducción esperada: 85–90% sin pérdida
visible. La home bajaría de 4.7 MB a ~500 KB.

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
