# BECOME — Sistema de diseño

Generado desde el código con `npm run design:export`. No se edita a mano:
cualquier cambio en `tokens/` o en `src/components/` se refleja aquí al
regenerarlo, y así el documento no puede acabar describiendo un sitio que
ya no existe.

**173 tokens · 28 componentes · 39 iconos**

---

## 1. Tokens

Todos son variables CSS sobre `:root`. En los componentes se usan siempre
a través de `var(--nombre)`; no hay valores literales en el código.

### Color

| Token | Valor | Nota |
|---|---|---|
| `--deep-navy` | `#0A0E27` |  |
| `--electric-green` | `#00FF88` |  |
| `--ice-blue` | `#E0F7FF` |  |
| `--charcoal` | `#2D3748` |  |
| `--dark-slate` | `#1A202C` | SUPPORTING |
| `--neon-green` | `#00FFAA` |  |
| `--soft-white` | `#F7FAFC` |  |
| `--navy-950` | `#05070F` | Navy ramp — every dark surface comes from here |
| `--navy-900` | `#0A0E27` |  |
| `--navy-850` | `#0E1330` |  |
| `--navy-800` | `#141A3A` |  |
| `--navy-700` | `#1A202C` |  |
| `--navy-600` | `#2D3748` |  |
| `--navy-500` | `#3D4A63` |  |
| `--white` | `#FFFFFF` | Light ramp |
| `--off-white` | `#F7FAFC` |  |
| `--pale-100` | `#EDF2F7` |  |
| `--pale-200` | `#E2E8F0` |  |
| `--pale-300` | `#CBD5E0` |  |
| `--slate-100` | `#E2E8F0` |  |
| `--slate-200` | `#C3CEDD` |  |
| `--slate-300` | `#9BA9BF` |  |
| `--slate-400` | `#718096` |  |
| `--slate-450` | `#626E82` |  |
| `--slate-500` | `#4A5568` |  |
| `--green-tint` | `rgba(0,255,136,.12)` | Green washes |
| `--green-tint-strong` | `rgba(0,255,136,.22)` |  |
| `--green-line` | `rgba(0,255,136,.38)` |  |
| `--bg-page` | `var(--off-white)` | Semantic — light context (default) |
| `--bg-sunken` | `var(--pale-100)` |  |
| `--surface-card` | `var(--white)` |  |
| `--surface-inverse` | `var(--navy-900)` |  |
| `--text-heading` | `var(--deep-navy)` |  |
| `--text-body` | `var(--navy-700)` |  |
| `--text-muted` | `var(--slate-500)` |  |
| `--text-faint` | `var(--slate-450)` |  |
| `--text-accent` | `#0F7A46` |  |
| `--text-on-accent` | `var(--deep-navy)` |  |
| `--border-hairline` | `var(--pale-200)` |  |
| `--border-strong` | `var(--pale-300)` |  |
| `--accent` | `var(--electric-green)` |  |
| `--accent-hover` | `var(--neon-green)` |  |
| `--focus-ring` | `var(--electric-green)` |  |
| `--border-hairline-dark` | `rgba(226,232,240,.14)` |  |
| `--border-strong-dark` | `rgba(226,232,240,.28)` |  |
| `--gradient-transformation` | `linear-gradient(90deg,#0A0E27 0%,#00FF88 100%)` | GRADIENT SYSTEM (section 8) — on dark backgrounds |
| `--gradient-energy` | `linear-gradient(90deg,#00FF88 0%,#00FFAA 100%)` |  |
| `--gradient-future` | `linear-gradient(90deg,#E0F7FF 0%,#00FF88 100%)` |  |
| `--gradient-transformation-diag` | `linear-gradient(135deg,#0A0E27 0%,#00FF88 100%)` |  |
| `--gradient-protect-dark` | `linear-gradient(180deg,rgba(10,14,39,0) 0%,rgba(10,14,39,.86) 66%,#0A0E27 100%)` |  |
| `--gradient-protect-light` | `linear-gradient(180deg,rgba(247,250,252,0) 0%,rgba(247,250,252,.9) 70%,#F7FAFC 100%)` |  |
| `--gradient-environment` | `radial-gradient(70% 90% at 50% 108%,rgba(0,255,136,.30) 0%,rgba(0,255,136,.07) 42%,rgba(10,14,39,0) 72%)` |  |
| `--bg-page` | `var(--navy-900)` |  |
| `--bg-sunken` | `var(--navy-950)` |  |
| `--surface-card` | `var(--navy-850)` |  |
| `--surface-inverse` | `var(--off-white)` |  |
| `--text-heading` | `var(--white)` |  |
| `--text-body` | `var(--slate-100)` |  |
| `--text-muted` | `var(--slate-200)` |  |
| `--text-faint` | `var(--slate-300)` |  |
| `--text-accent` | `var(--electric-green)` |  |
| `--border-hairline` | `var(--border-hairline-dark)` |  |
| `--border-strong` | `var(--border-strong-dark)` |  |

### Tipografía

| Token | Valor | Nota |
|---|---|---|
| `--font-display` | `"Inter",system-ui,sans-serif` |  |
| `--font-body` | `"Inter",system-ui,sans-serif` |  |
| `--font-mono` | `"JetBrains Mono",ui-monospace,monospace` |  |
| `--weight-display` | `600` |  |
| `--weight-display-strong` | `700` |  |
| `--weight-body` | `400` |  |
| `--weight-body-medium` | `500` |  |
| `--weight-mono` | `400` |  |
| `--text-hero` | `clamp(46px,6.4vw,104px)` |  |
| `--text-display` | `clamp(40px,8.4vw,76px)` |  |
| `--text-h1` | `clamp(32px,5.6vw,52px)` |  |
| `--text-h2` | `clamp(23px,3.6vw,34px)` |  |
| `--text-h3` | `clamp(18px,2.2vw,21px)` |  |
| `--text-lead` | `19px` |  |
| `--text-body-lg` | `16.5px` |  |
| `--text-body-md` | `15px` |  |
| `--text-body-sm` | `13px` |  |
| `--text-label` | `11px` |  |
| `--text-micro` | `10px` |  |
| `--leading-tight` | `.96` |  |
| `--leading-heading` | `1.08` |  |
| `--leading-body` | `1.55` |  |
| `--leading-loose` | `1.65` |  |
| `--track-hero` | `-.03em` |  |
| `--track-display` | `-.022em` |  |
| `--track-heading` | `-.014em` |  |
| `--track-body` | `-.002em` |  |
| `--track-label` | `.14em` |  |
| `--track-mono` | `0em` |  |
| `--track-descriptor` | `.34em` |  |
| `--track-wordmark` | `-.02em` |  |
| `--type-hero` | `var(--weight-display) var(--text-hero)/var(--leading-tight) var(--font-display)` |  |
| `--type-h1` | `var(--weight-display) var(--text-h1)/var(--leading-heading) var(--font-display)` |  |
| `--type-h2` | `var(--weight-display) var(--text-h2)/var(--leading-heading) var(--font-display)` |  |
| `--type-h3` | `var(--weight-display-strong) var(--text-h3)/1.26 var(--font-display)` |  |
| `--type-body` | `var(--weight-body) var(--text-body-md)/var(--leading-body) var(--font-body)` |  |
| `--type-lead` | `var(--weight-body) var(--text-lead)/var(--leading-loose) var(--font-body)` |  |
| `--type-label` | `var(--weight-display) var(--text-label)/1.2 var(--font-display)` |  |
| `--type-mono` | `var(--weight-mono) var(--text-body-sm)/1.5 var(--font-mono)` |  |
| `--type-stat` | `var(--weight-display) 48px/1 var(--font-display)` |  |

### Espaciado

| Token | Valor | Nota |
|---|---|---|
| `--space-0` | `0px` |  |
| `--space-1` | `4px` |  |
| `--space-2` | `8px` |  |
| `--space-3` | `12px` |  |
| `--space-4` | `16px` |  |
| `--space-5` | `20px` |  |
| `--space-6` | `24px` |  |
| `--space-7` | `32px` |  |
| `--space-8` | `40px` |  |
| `--space-9` | `48px` |  |
| `--space-10` | `64px` |  |
| `--space-11` | `80px` |  |
| `--space-12` | `96px` |  |
| `--space-13` | `120px` |  |
| `--space-14` | `160px` |  |
| `--gutter-page` | `clamp(24px,5vw,80px)` |  |
| `--maxw-prose` | `60ch` |  |
| `--maxw-content` | `1280px` |  |
| `--grid-gap` | `24px` |  |
| `--grid-gap-hair` | `1px` |  |
| `--section-pad-y` | `var(--space-12)` |  |
| `--logo-clearspace` | `1em` |  |
| `--logo-min-wordmark` | `120px` |  |
| `--logo-min-icon` | `32px` |  |

### Radios

| Token | Valor | Nota |
|---|---|---|
| `--radius-none` | `0px` |  |
| `--radius-xs` | `3px` |  |
| `--radius-sm` | `6px` |  |
| `--radius-md` | `8px` |  |
| `--radius-lg` | `12px` |  |
| `--radius-xl` | `16px` |  |
| `--radius-frame` | `22px` |  |
| `--radius-icon` | `22%` |  |
| `--radius-pill` | `999px` |  |
| `--border-hair` | `1px` |  |
| `--border-thick` | `2px` |  |
| `--icon-stroke` | `2px` |  |

### Sombras y efectos

| Token | Valor | Nota |
|---|---|---|
| `--shadow-none` | `none` |  |
| `--shadow-card` | `0 1px 2px rgba(10,14,39,.05)` |  |
| `--shadow-raised` | `0 2px 4px rgba(10,14,39,.06),0 14px 36px rgba(10,14,39,.10)` |  |
| `--shadow-inset-hair` | `inset 0 0 0 1px var(--border-hairline)` |  |
| `--glow-text` | `0 0 24px rgba(0,255,136,.32)` |  |
| `--glow-icon` | `0 0 20px rgba(0,255,136,.30)` |  |
| `--glow-button` | `0 0 28px rgba(0,255,136,.34)` |  |
| `--glow-button-hover` | `0 0 36px rgba(0,255,136,.42)` |  |
| `--glow-pulse` | `0 0 40px rgba(0,255,136,.24)` |  |
| `--glow-soft` | `0 0 80px rgba(0,255,136,.18)` |  |
| `--glow-drop` | `drop-shadow(0 0 20px rgba(0,255,136,.32))` |  |
| `--ring-focus` | `0 0 0 2px var(--bg-page),0 0 0 4px var(--electric-green)` |  |
| `--blur-glass` | `saturate(120%) blur(18px)` |  |
| `--surface-glass` | `rgba(247,250,252,.78)` |  |
| `--surface-glass-dark` | `rgba(10,14,39,.72)` |  |
| `--grid-line` | `rgba(226,232,240,.07)` |  |
| `--grid-step` | `48px` |  |
| `--grid-overlay` | `repeating-linear-gradient(90deg,var(--grid-line) 0 1px,transparent 1px var(--grid-step))` |  |
| `--grid-overlay-both` | `repeating-linear-gradient(90deg,var(--grid-line) 0 1px,transparent 1px var(--grid-step)),repeating-linear-gradient(180deg,var(--grid-line) 0 1px,transparent 1px var(--grid-step))` |  |
| `--z-header` | `50` |  |
| `--z-nav-overlay` | `60` |  |
| `--z-modal` | `100` |  |

### Movimiento

| Token | Valor | Nota |
|---|---|---|
| `--ease-become` | `cubic-bezier(.22,1,.36,1)` |  |
| `--ease-standard` | `cubic-bezier(.4,0,.2,1)` |  |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` |  |
| `--dur-instant` | `80ms` |  |
| `--dur-fast` | `160ms` |  |
| `--dur-base` | `240ms` |  |
| `--dur-slow` | `420ms` |  |
| `--dur-sequence` | `700ms` |  |
| `--stagger-step` | `80ms` |  |
| `--transition-hover` | `color var(--dur-fast) var(--ease-standard),background-color var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard),opacity var(--dur-fast) var(--ease-standard),box-shadow var(--dur-base) var(--ease-become),transform var(--dur-base) var(--ease-become)` |  |
| `--dur-fast` | `0ms` |  |
| `--dur-base` | `0ms` |  |
| `--dur-slow` | `0ms` |  |
| `--dur-sequence` | `0ms` |  |

### Tramas de fondo

| Token | Valor | Nota |
|---|---|---|
| `--pattern-circuit-grid` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cg fill='none' stroke='%2300FF88' stroke-width='1'%3E%3Cpath d='M0 32h96M0 64h96M32 0v96M64 0v96'/%3E%3C/g%3E%3Cg fill='%2300FF88'%3E%3Ccircle cx='32' cy='32' r='2.5'/%3E%3Ccircle cx='64' cy='64' r='2.5'/%3E%3C/g%3E%3C/svg%3E")` |  |
| `--pattern-hexagon-grid` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='96'%3E%3Cg fill='none' stroke='%2300FF88' stroke-width='1'%3E%3Cpath d='M28 0l24 14v28L28 56 4 42V14z'/%3E%3Cpath d='M28 48l24 14v28L28 104 4 90V62z'/%3E%3C/g%3E%3C/svg%3E")` |  |
| `--pattern-micro-grid` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath d='M0 0h16v16H0z' fill='none' stroke='%23E2E8F0' stroke-width='.5'/%3E%3C/svg%3E")` |  |
| `--pattern-dot-grid` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='2' cy='2' r='1.6' fill='%2300FF88'/%3E%3C/svg%3E")` |  |
| `--pattern-particle-field` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cg fill='%2300FF88'%3E%3Ccircle cx='12' cy='22' r='1.8'/%3E%3Ccircle cx='58' cy='9' r='1.1'/%3E%3Ccircle cx='104' cy='34' r='2.1'/%3E%3Ccircle cx='31' cy='68' r='1.3'/%3E%3Ccircle cx='86' cy='79' r='1.7'/%3E%3Ccircle cx='128' cy='104' r='1.2'/%3E%3Ccircle cx='19' cy='118' r='2'/%3E%3Ccircle cx='66' cy='131' r='1.4'/%3E%3Ccircle cx='113' cy='56' r='1'/%3E%3C/g%3E%3C/svg%3E")` |  |
| `--pattern-scattered-nodes` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cg stroke='%2300FF88' stroke-width='.7' fill='none'%3E%3Cpath d='M24 30L82 62 148 26M82 62l-38 76 84 22M82 62l72 58'/%3E%3C/g%3E%3Cg fill='%2300FF88'%3E%3Ccircle cx='24' cy='30' r='3'/%3E%3Ccircle cx='82' cy='62' r='3.6'/%3E%3Ccircle cx='148' cy='26' r='2.6'/%3E%3Ccircle cx='44' cy='138' r='3'/%3E%3Ccircle cx='128' cy='160' r='2.6'/%3E%3Ccircle cx='154' cy='120' r='3'/%3E%3C/g%3E%3C/svg%3E")` |  |
| `--pattern-parallel-lines` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath d='M0 11.5h12' stroke='%2300FF88' stroke-width='1'/%3E%3C/svg%3E")` |  |
| `--pattern-wave` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='44'%3E%3Cg fill='none' stroke='%2300FF88' stroke-width='1.2'%3E%3Cpath d='M0 22C26 4 54 4 80 22s54 18 80 0'/%3E%3Cpath d='M0 34C26 16 54 16 80 34s54 18 80 0' opacity='.6'/%3E%3C/g%3E%3C/svg%3E")` |  |
| `--pattern-angular-lines` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cg stroke='%2300FF88' stroke-width='1' fill='none'%3E%3Cpath d='M-20 60L60 -20M0 120L120 0M60 140L140 60'/%3E%3C/g%3E%3C/svg%3E")` |  |
| `--pattern-noise` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")` |  |
| `--pattern-opacity` | `.10` |  |
| `--pattern-opacity-strong` | `.20` |  |
| `--pattern-opacity-subtle` | `.05` |  |

### Base

| Token | Valor | Nota |
|---|---|---|

---

## 2. Componentes

Agrupados por archivo. Las props salen de la firma real de cada uno y el
texto que las acompaña, del comentario que tienen en el código.

### `BecomeNowForm.jsx`

> Formulario de BECOME NOW™ (§19 del documento).
> 
> Pide más que el de contacto general, y a propósito: aquí la primera respuesta
> de BECOME es una propuesta de Sesión 0, y para prepararla hace falta saber
> área, tamaño de grupo, herramientas y modalidad. Cada campo evita una ida y
> vuelta por correo — que es precisamente el motivo por el que estos diez
> campos se preguntan de uno en uno y no todos de golpe.

#### BecomeNowForm

| Prop | Por defecto |
|---|---|
| `lang` | `'es'` |

### `ConversationalForm.jsx`

> Formulario conversacional con el recorrido a la vista.
> 
> Lo usan el contacto general y BECOME NOW™. La diferencia entre los dos es el
> esquema que recibe, no el componente — dos implementaciones del mismo patrón
> se habrían separado a la primera corrección.
> 
> Se responde una pregunta cada vez, pero el recorrido entero está en pantalla:
> a la izquierda se ven las diez preguntas, cuáles están contestadas, con qué, y
> cuántas quedan. Es la corrección al formulario por pasos clásico, que esconde
> el final y por eso se abandona: quien no sabe cuánto falta asume que falta
> mucho. Con el recorrido visible la pregunta deja de ser "¿en qué me estoy
> metiendo?" y pasa a ser "me quedan tres".
> 
> El carril no es decorativo: cada fila contestada es un botón que devuelve a
> esa pregunta. Corregir un dato no obliga a retroceder paso a paso.
> 
> ---- Por qué ocupa toda la pantalla ----
> 
> Un formulario metido en una columna de una página larga compite con todo lo
> que tiene alrededor: el menú, el pie, la sección siguiente asomando. Cada uno
> de esos elementos es una salida. Al abrirse a pantalla completa desaparecen
> todas menos dos —responder o cerrar— y la conversación pasa a ser lo único
> que ocurre. El fondo es el mismo campo de partículas del resto del sitio, así
> que no se siente como una ventana modal ajena sino como entrar dentro.
> 
> Lo que una capa a pantalla completa obliga a hacer bien, y aquí se hace:
> Esc cierra, el foco queda atrapado dentro mientras está abierta y vuelve al
> botón que la abrió al salir, el fondo no hace scroll, y si ya hay respuestas
> escritas se pide confirmación antes de descartar.
> 
> ---- Lo que este patrón sigue haciendo mal, y cómo se compensa ----
> 
>   · Hay un interruptor a "ver todo el formulario" siempre visible, y la
>     elección se recuerda. No es una opción escondida: es el mismo formulario.
>     Quien usa lector de pantalla o gestor de contraseñas lo necesita.
>   · Cada cambio de paso se anuncia por aria-live.
>   · Enter avanza, salvo en un campo de texto largo, donde Enter escribe un
>     salto de línea y es Ctrl+Enter quien avanza.
>   · El último paso es un resumen editable, no un botón a ciegas.
>   · Con prefers-reduced-motion las transiciones desaparecen; el flujo no.

#### ConversationalForm

| Prop | Por defecto |
|---|---|
| `fields` | — |
| `submitLabel` | — |
| `confirmation` | — |
| `dark` | `true` |
| `formName` | — |
| `title` | — |
| `lead` | — |
| `launchLabel` | — |
| `lang` | `'es'` |
| `formId` | `'contacto'` |

### `Field.jsx`

> Bandas generadas: el sustituto de las fotos de stock.
> 
> Las imágenes que había antes eran archivos de 760 px estirados a todo el
> ancho del viewport. A 1440 px eso es un escalado de casi 2×, y por eso se
> veían pixeladas: no era el encuadre ni la compresión, era que no había
> píxeles suficientes. Subir la resolución solo mueve el problema al monitor
> siguiente.
> 
> Estas bandas se dibujan a la resolución del dispositivo, así que no tienen
> un tamaño nativo que superar. Además hacen algo que una foto no puede: el
> scroll las atraviesa. La cámara avanza en Z con la posición de la sección en
> pantalla, de modo que bajar por la página es literalmente entrar en el campo.
> 
> Variantes, tomadas del lenguaje visual de la marca:
> 
>   plexus   — nodos conectados; la red que se densifica al acercarse.
>   corridor — retícula en perspectiva; el viaje hacia el punto de fuga.
>   streams  — flujos de luz y datos que cruzan de lado a lado.
>   circuit  — trazas ortogonales con pulsos hacia un núcleo.
>   dust     — campo de partículas con profundidad de campo.
> 
> Coste: un canvas 2D por banda, con el bucle parado mientras la banda está
> fuera de pantalla, DPR limitado a 1.5 y el número de elementos acotado. Con
> prefers-reduced-motion se dibuja un fotograma y se detiene: la banda sigue
> existiendo, deja de moverse.

#### Field

| Prop | Por defecto |
|---|---|
| `variant` | `'plexus'` |
| `seed` | `7` |
| `depthRef` | — |
| `className` | — |
| `style` | — |

### `GradientField.jsx`

> Gradiente vivo en WebGL (adaptación del componente "Velaris").
> 
> Tres capas de ruido simplex que se mezclan sobre la paleta de la marca. No es
> un degradado animado con CSS: la mezcla se recalcula por píxel, así que las
> manchas se deforman entre ellas en vez de desplazarse rígidas. Sobre navy con
> los dos verdes lee como algo que está transformándose, que es exactamente lo
> que dice la sección donde va.
> 
> Qué se cambió respecto del original, y por qué:
> 
>   · Se comprueba la compilación y el enlazado de los shaders. Sin eso, en una
>     GPU que rechace el shader el canvas queda negro y no hay ni un aviso en
>     consola: un fondo de sección desaparecido y ninguna pista de por qué.
>   · Los colores se convierten a RGB una vez, no en cada fotograma. Eran ocho
>     parseInt y un Float32Array nuevo sesenta veces por segundo para un valor
>     que no cambia.
>   · La localización del array uniforme se pide como `u_colors[0]`, que es lo
>     que exige la especificación; sin el índice hay implementaciones que
>     devuelven null y los colores se quedan en negro.
>   · El bucle se para cuando la banda sale de pantalla, y se recupera si el
>     navegador pierde el contexto WebGL (pasa al suspender el equipo).
>   · DPR fijado a 1. El shader evalúa ruido simplex tres veces por píxel y
>     aquí no hay ni una arista que resolver: son manchas difusas, así que
>     duplicar los píxeles duplica el coste sin diferencia visible. No hay
>     medición fiable que lo respalde — el único entorno donde se ha podido
>     medir usa render por software, donde todo va a 11-17 fps y la varianza
>     entre pasadas es mayor que el efecto. Es una decisión por prudencia, no
>     por dato.
>   · Con prefers-reduced-motion se dibuja un fotograma y se detiene.

#### GradientField

| Prop | Por defecto |
|---|---|
| `speed` | `2` |
| `grain` | `0.3` |
| `style` | — |

### `KineticGrid.jsx`

> Retícula que se deforma hacia el puntero y ondea al tocarla.
> (Adaptación del componente "KineticGrid".)
> 
> Va donde alguien está eligiendo, no donde está leyendo: la retícula responde
> al cursor, así que su sitio es la página en la que hay que decidir entre
> varias opciones. Ahí el fondo confirma que la página está viva y reaccionando
> a ti; debajo de un párrafo largo sería solo ruido moviéndose.
> 
> Qué se cambió respecto del original:
> 
>   · El puntero se lee en coordenadas del contenedor, no de la ventana, y el
>     canvas no es `fixed`. El original ocupaba la pantalla entera y escuchaba
>     en `window`: dentro de una página larga eso significa una retícula a
>     pantalla completa deformándose por movimientos de ratón que ocurren a
>     tres secciones de distancia.
>   · `pointer` en vez de `mouse`, así que funciona con dedo y con lápiz. El
>     original era solo ratón, es decir: en móvil no hacía nada y aun así
>     gastaba un bucle de animación.
>   · Al salir el puntero, la deformación vuelve al centro. Antes se quedaba
>     clavada donde estaba el cursor la última vez.
>   · Se aplica DPR: sin él la retícula se ve borrosa en cualquier pantalla
>     moderna.
>   · El bucle se para cuando la banda no está en pantalla, y también cuando
>     no hay nada que animar: sin puntero encima y sin ondas, la retícula
>     queda quieta en vez de repintar sesenta veces por segundo un dibujo
>     idéntico.
>   · Los colores salen de tokens/.
>   · Con prefers-reduced-motion se dibuja la retícula sin deformación y no se
>     registra ningún gesto. El contenido de encima no depende de ella.

#### KineticGrid

| Prop | Por defecto |
|---|---|
| `style` | — |

### `Media.jsx`

> Imagen de marca.
> 
> Las fotografías del sitio no son ilustración de relleno: acompañan al nodo 3D,
> y por eso se mueven con él. Cada una recorre un tramo corto de parallax
> mientras la sección pasa por pantalla, de modo que la página entera —fondo,
> partículas e imágenes— comparte la misma sensación de profundidad en lugar de
> tener un plano animado y otro quieto.
> 
> El velo navy no es un filtro estético. Las fotos vienen de stock con
> temperaturas distintas y, sin él, cada sección cambia de paleta; con él, todas
> pertenecen al mismo sitio. Encima va una capa verde muy baja que las ata a la
> marca.
> 
> Con prefers-reduced-motion no hay parallax ni escala: la imagen entra fija.
> El contenido no depende del movimiento en ningún caso.

#### Figure

| Prop | Por defecto |
|---|---|
| `src` | — |
| `alt` | — |
| `ratio` | `'4 / 5'` |
| `caption` | — |
| `veil` | `0.42` |
| `radius` | `0` |
| `style` | — |

#### Banner

> Banda a sangre entre dos secciones.
> 
> Antes era una fotografía de stock estirada al ancho del viewport; ahora es un
> campo generado (ver Field.jsx), que no tiene resolución nativa que superar y
> además se atraviesa con el scroll. El titular encima entra desde el fondo
> mientras la banda cruza la pantalla: no es un cartel colocado sobre una
> imagen, es lo que hay al final del recorrido.

| Prop | Por defecto |
|---|---|
| `variant` | `'plexus'` |
| `seed` | `7` |
| `children` | — |
| `height` | `'clamp(300px` |

#### Split

> Bloque de imagen + contenido. `flip` pone la imagen a la derecha; alternarlos
> es lo que da ritmo a una página larga.

| Prop | Por defecto |
|---|---|
| `src` | — |
| `alt` | — |
| `ratio` | `'4 / 5'` |
| `media` | `'1fr'` |
| `flip` | `false` |
| `children` | — |

### `Reveal.jsx`

> La entrada al aparecer en pantalla.
> 
> Antes era una sola animación para todo el sitio: doce píxeles de subida y
> medio segundo, igual para un titular que para la duodécima fila de una tabla.
> Eso es lo que hacía que el scroll se sintiera plano — no faltaba movimiento,
> faltaba jerarquía en el movimiento.
> 
> Ahora hay tres decisiones dentro:
> 
>   · Muelle en vez de curva fija. Una curva bezier llega y se detiene; un
>     muelle llega, se pasa un poco y se asienta. Es la diferencia entre algo
>     colocado y algo que ha aterrizado.
>   · Entra desde abajo y desde algo más lejos (escala 0,985): el eje Z del
>     resto del sitio también manda aquí, así que los bloques llegan desde el
>     fondo en vez de deslizarse en plano.
>   · Retardo por posición. Los elementos de una rejilla no aparecen a la vez:
>     se escalonan 45 ms cada uno hasta el octavo. Más allá del octavo el
>     escalonado deja de leerse como secuencia y empieza a leerse como retraso,
>     así que el retardo se corta ahí.
> 
> El índice lo inyecta `Cols`; una fila suelta no lo necesita.

#### Reveal

| Prop | Por defecto |
|---|---|
| `as` | `'div'` |
| `index` | `0` |
| `children` | — |

### `RouteLoader.jsx`

> Lo que se ve mientras se descarga el chunk de una ruta.
> 
> Aparece con 180 ms de retraso a propósito. Los chunks de página pesan entre
> 2 y 8 KB gzip: en una conexión normal llegan antes de eso y el spinner no
> llega a aparecer nunca, que es lo correcto — un destello de medio fotograma
> se percibe como un parpadeo, no como "está cargando". Solo se ve cuando la
> espera es real.
> 
> La marca es el isotipo de Become. La barra verde —el mismo elemento que
> cruza el logo— es lo que se anima: barre de izquierda a derecha. No es un
> spinner genérico con el logo encima, es el logo funcionando como spinner.

#### RouteLoader

> Lo que se ve mientras se descarga el chunk de una ruta.
> 
> Aparece con 180 ms de retraso a propósito. Los chunks de página pesan entre
> 2 y 8 KB gzip: en una conexión normal llegan antes de eso y el spinner no
> llega a aparecer nunca, que es lo correcto — un destello de medio fotograma
> se percibe como un parpadeo, no como "está cargando". Solo se ve cuando la
> espera es real.
> 
> La marca es el isotipo de Become. La barra verde —el mismo elemento que
> cruza el logo— es lo que se anima: barre de izquierda a derecha. No es un
> spinner genérico con el logo encima, es el logo funcionando como spinner.

_Sin props._

### `ScrollStage.jsx`

> El tramo inmersivo: el único sitio del sitio donde el scroll no mueve la
> página, mueve la cámara.
> 
> La sección mide varias pantallas de alto pero su contenido está fijo con
> `sticky`, así que durante ese recorrido la vista se queda quieta y lo que
> avanza es el campo: se entra por el pasillo y se sale por el otro lado. Es
> deliberadamente el único momento así de la página. Un sitio entero con este
> comportamiento se vuelve imposible de recorrer —nadie sabe cuánto falta— y
> deja de sorprender a la segunda vez.
> 
> Los tres mensajes se relevan por tramos de ese avance, no por temporizador:
> quien sube vuelve a verlos en orden inverso, y quien va rápido no se pierde
> ninguno a medias.
> 
> Salvaguardas:
>   · Con prefers-reduced-motion la sección colapsa a una pantalla y muestra
>     los tres mensajes a la vez. No hay contenido solo accesible moviéndose.
>   · El texto está siempre en el DOM; los relevos son opacidad, no montaje.
>   · No se secuestra el scroll: la rueda y la barra siguen respondiendo con la
>     velocidad del sistema. Lo único que hace la sección es ser alta.

#### ScrollStage

> El tramo inmersivo: el único sitio del sitio donde el scroll no mueve la
> página, mueve la cámara.
> 
> La sección mide varias pantallas de alto pero su contenido está fijo con
> `sticky`, así que durante ese recorrido la vista se queda quieta y lo que
> avanza es el campo: se entra por el pasillo y se sale por el otro lado. Es
> deliberadamente el único momento así de la página. Un sitio entero con este
> comportamiento se vuelve imposible de recorrer —nadie sabe cuánto falta— y
> deja de sorprender a la segunda vez.
> 
> Los tres mensajes se relevan por tramos de ese avance, no por temporizador:
> quien sube vuelve a verlos en orden inverso, y quien va rápido no se pierde
> ninguno a medias.
> 
> Salvaguardas:
>   · Con prefers-reduced-motion la sección colapsa a una pantalla y muestra
>     los tres mensajes a la vez. No hay contenido solo accesible moviéndose.
>   · El texto está siempre en el DOM; los relevos son opacidad, no montaje.
>   · No se secuestra el scroll: la rueda y la barra siguen respondiendo con la
>     velocidad del sistema. Lo único que hace la sección es ser alta.

| Prop | Por defecto |
|---|---|
| `variant` | `'corridor'` |
| `seed` | `3` |
| `steps` | — |
| `height` | `'300vh'` |

### `SiteFooter.jsx`

> Pie del sitio. Bilingüe: detecta el idioma por el prefijo de la ruta
> (/es/... o /en/...) y elige el mapa correspondiente. No hay un tercer
> estado — cualquier ruta que no empiece por /en se trata como español,
> que es también lo que hace el comodín del enrutador.
> 
> Hace de mapa completo para que la cabecera no tenga que serlo: cinco
> columnas con todo lo que existe, incluidas las seis preguntas de casos de uso
> y el framework, que a propósito no están en el menú principal.
> 
> El logotipo también lleva a la Home. No hay un enlace de texto "Inicio": el
> documento lo prohíbe explícitamente y duplicarlo solo añade ruido para quien
> navega con lector de pantalla.

#### SiteFooter

> Pie del sitio. Bilingüe: detecta el idioma por el prefijo de la ruta
> (/es/... o /en/...) y elige el mapa correspondiente. No hay un tercer
> estado — cualquier ruta que no empiece por /en se trata como español,
> que es también lo que hace el comodín del enrutador.
> 
> Hace de mapa completo para que la cabecera no tenga que serlo: cinco
> columnas con todo lo que existe, incluidas las seis preguntas de casos de uso
> y el framework, que a propósito no están en el menú principal.
> 
> El logotipo también lleva a la Home. No hay un enlace de texto "Inicio": el
> documento lo prohíbe explícitamente y duplicarlo solo añade ruido para quien
> navega con lector de pantalla.

_Sin props._

### `SiteHeader.jsx`

> Cabecera del sitio en español.
> 
> Escrita a mano, ya no sale del conversor: los desplegables tienen estado,
> foco y teclado, y eso no cabía en el formato de los artboards.
> 
> Reglas del documento que aquí son código, no estilo:
> 
>   · La Home no es un ítem. El logotipo es el único acceso, con nombre
>     accesible "BECOME — Inicio".
>   · Los desplegables abren con click, teclado y foco. El hover es refuerzo,
>     nunca el único mecanismo — un menú que solo responde a hover no existe
>     para quien navega con teclado ni en una tableta.
>   · Solo uno abierto a la vez.
>   · Escape cierra y devuelve el foco al trigger que lo abrió.
>   · En móvil son acordeones dentro del menú a pantalla completa; el hover no
>     participa.

#### SiteHeader

_Sin props._

### `StateTransition.jsx`

> La transición C → O.
> 
> Es la marca explicándose a sí misma: la C y la O de BECOME dejan de ser dos
> letras y pasan a ser dos estados de la misma empresa. La C está abierta —le
> falta un trozo, es lo que hoy no cierra— y la O está completa. Entre las dos,
> la línea que sale de la boca de la C y entra en la O: eso es el trabajo.
> 
> La abertura de la C es deliberadamente pequeña (±35°): con un hueco mayor la
> letra deja de leerse como una C y pasa a leerse como un arco cualquiera, que
> es exactamente lo que rompía el sentido. El trazo es grueso por el mismo
> motivo — a 26 px sobre 54 de radio la letra pesaba menos que la línea.
> 
> Se anima al entrar en pantalla: la C aparece, la línea sale del hueco y cruza
> hasta tocar la O, y la O cierra el círculo. Con prefers-reduced-motion se
> pinta el estado final sin recorrido — la idea se entiende igual, que es la
> prueba de que la animación explica y no decora.
> 
> Las dos letras se dibujan con SVG y no con texto: una fuente distinta en el
> equipo de quien mira cambiaría el grosor del trazo y con él el sentido.

#### StateTransition

| Prop | Por defecto |
|---|---|
| `dark` | `true` |

### `icons.jsx`

#### Ico

| Prop | Por defecto |
|---|---|
| `name` | — |
| `size` | `26` |
| `color` | `'currentColor'` |
| `weight` | `'light'` |
| `style` | — |

#### IcoBadge

> Icono con suelo propio. Sobre navy un trazo fino se pierde contra el nodo 3D;
> el cuadrado le da el contraste que el trazo solo no tiene.

| Prop | Por defecto |
|---|---|
| `name` | — |
| `dark` | — |
| `size` | `22` |

### `ui.jsx`

> Las piezas con las que se arman las páginas nuevas.
> 
> Los artboards Durable llevaban el estilo en atributos inline, uno por
> elemento. Eso servía para maquetar, pero no para mantener veinte páginas: un
> cambio de ritmo vertical obligaba a tocar cientos de líneas. Aquí las
> decisiones viven en un sitio, y siempre salen de tokens/ — ningún valor
> suelto.
> 
> `Section` marca sola su `data-band`, que es lo que el nodo 3D lee para pintar
> el fondo. Si una página nueva se olvida de esa marca, el nodo la ve como un
> hueco; por eso la pone el componente y no cada página.

#### Section

| Prop | Por defecto |
|---|---|
| `band` | `'light'` |
| `id` | — |
| `nodeState` | — |
| `pad` | `'var(--space-13)'` |
| `backdrop` | — |
| `scrim` | `'strong'` |
| `children` | — |

#### Kicker

| Prop | Por defecto |
|---|---|
| `children` | — |
| `dark` | — |

#### Headline

| Prop | Por defecto |
|---|---|
| `children` | — |
| `dark` | — |
| `as` | `'h2'` |
| `size` | `'var(--text-h1)'` |

#### Lead

| Prop | Por defecto |
|---|---|
| `children` | — |
| `dark` | — |

#### Body

| Prop | Por defecto |
|---|---|
| `children` | — |
| `dark` | — |
| `style` | — |

#### PrimaryCTA

| Prop | Por defecto |
|---|---|
| `to` | — |
| `href` | — |
| `children` | — |

#### GhostCTA

| Prop | Por defecto |
|---|---|
| `to` | — |
| `children` | — |
| `dark` | — |

#### TextCTA

> Enlace de texto con la regla verde: la salida de sección por defecto

| Prop | Por defecto |
|---|---|
| `to` | — |
| `children` | — |
| `dark` | — |

#### Cols

> La rejilla numera a sus hijos para que entren escalonados. Se inyecta aquí y
> no en cada página porque el índice es una propiedad de la posición en la
> rejilla, no del contenido: pedirlo a mano en veinte sitios garantiza que
> alguno se olvide y esa tarjeta entre a destiempo.

| Prop | Por defecto |
|---|---|
| `children` | — |
| `min` | `'260px'` |
| `gap` | `'var(--space-8)'` |
| `style` | — |

#### SectionHead

> Encabezado de dos columnas: titular a la izquierda, entrada a la derecha.
> Es el ritmo que el documento pide para las secciones de la home.

| Prop | Por defecto |
|---|---|
| `kicker` | — |
| `headline` | — |
| `lead` | — |
| `dark` | — |
| `id` | — |

#### Card

| Prop | Por defecto |
|---|---|
| `children` | — |
| `dark` | — |
| `style` | — |
| `index` | `0` |

#### IndexRow

> Índice editorial: filas con regla, no una parrilla de tarjetas iguales.
> El documento lo pide explícitamente para las herramientas y las preguntas.

| Prop | Por defecto |
|---|---|
| `to` | — |
| `term` | — |
| `def` | — |
| `dark` | — |
| `num` | — |
| `icon` | — |
| `index` | `0` |

---

## 3. El ritmo de una página

El catálogo dice qué piezas hay; esto, cómo se ordenan. Cada página alterna
bandas, y la alternancia no es decorativa: marca los cambios de tema y es lo
que el nodo 3D lee para saber de qué color pintar el fondo detrás.

Dos bandas claras seguidas sin nada en medio se leen como una sola sección
larga; dos oscuras seguidas, igual. El contraste es la puntuación.

**Home** — `src/pages/Home.jsx`

| # | Banda | Ancla | Antetítulo | Titular |
|---:|---|---|---|---|
| 1 | `dark` | — | AI-native transformation company | — |
| 2 | `light` | `#que-hacemos` | Qué hacemos | Capacitamos equipos, definimos el cambio y construimos la capacidad. |
| 3 | `light` | `#proposito` | Our purpose | Hacer de la IA una capacidad de la empresa, no una colección de iniciativas. |
| 4 | `dark` | — | How we become | No añadimos IA desde fuera. Rediseñamos la empresa desde dentro. |
| 5 | `darker` | — | El recorrido | Seis etapas. Un camino de la ambición al valor. |
| 6 | `light` | — | Our offer | Capacita el presente. Diseña lo que sigue. Construye desde dentro. |
| 7 | `sunken` | — | Start with your question | ¿Qué necesitas transformar ahora? |
| 8 | `dark` | — | Value, made visible | Mide lo que cambia, no cuánta IA implementas. |
| 9 | `light` | — | Por qué BECOME | Strategy that builds. Technology that embeds. Capability that stays. |
| 10 | `darker` | — | The work we are built to do | Tres transformaciones que sabemos conducir. |
| 11 | `light` | — | Become insights | Ideas para la empresa que viene después. |
| 12 | `darker` | — | Your next operating model starts with a question | ¿En qué debe convertirse tu empresa después? |

**Un servicio** — `src/pages/Discovery.jsx`

| # | Banda | Ancla | Antetítulo | Titular |
|---:|---|---|---|---|
| 1 | `dark` | — | BECOME Discover™ | Define en qué debe convertirse tu empresa después. |
| 2 | `light` | — | El problema | Actividad de IA sin dirección empresarial. |
| 3 | `dark` | — | Para quién es | Cinco condiciones que hacen de BECOME DISCOVER™ el paso correcto. |
| 4 | `light` | — | El recorrido | BECOME DISCOVER™ cubre B–E–C–O del framework. |
| 5 | `sunken` | — | Working model | Se hace con tu equipo, no sobre tu equipo. |
| 6 | `dark` | — | Entregables | Qué queda al terminar. |
| 7 | `light` | — | — | — |
| 8 | `darker` | — | Encuentra el punto correcto para comenzar | Cuéntanos qué necesita cambiar en el negocio. |

---

## 4. Iconos

Un set propio, con trazo y radio consistentes. Se usan como
`<Ico name="…" />` o `<IcoBadge name="…" />`. Los nombres son la API: si
uno no está en esta lista, el componente no lo dibuja.

`people` · `data` · `agents` · `operations` · `speed` · `quality` · `growth` · `risk` · `capability` · `target` · `together` · `fit` · `decision` · `flow` · `product` · `build` · `embed` · `scale` · `chat` · `calendar` · `signpost` · `yes` · `no` · `library` · `map` · `balance` · `measure` · `layers` · `time` · `doc` · `work` · `idea` · `route` · `native` · `system` · `accountable` · `outcome` · `inspect` · `trust`

---

## 5. Las primitivas, enteras

El catálogo de arriba da la API de cada componente: qué props acepta. Eso
basta para USARLOS, pero no para reproducir el aspecto — un `Headline` se
define tanto por su prop `size` como por el peso, el interlineado y el
tracking que aplica, y eso solo está en el código.

Va entero, que son trescientas líneas. Con esto y los tokens de arriba, el
documento es autosuficiente: se puede reconstruir el sistema sin abrir el
repositorio.

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { Ico } from './icons.jsx';

/**
 * Las piezas con las que se arman las páginas nuevas.
 *
 * Los artboards Durable llevaban el estilo en atributos inline, uno por
 * elemento. Eso servía para maquetar, pero no para mantener veinte páginas: un
 * cambio de ritmo vertical obligaba a tocar cientos de líneas. Aquí las
 * decisiones viven en un sitio, y siempre salen de tokens/ — ningún valor
 * suelto.
 *
 * `Section` marca sola su `data-band`, que es lo que el nodo 3D lee para pintar
 * el fondo. Si una página nueva se olvida de esa marca, el nodo la ve como un
 * hueco; por eso la pone el componente y no cada página.
 */

/* ---------- superficies ---------- */

/* Dos intensidades de velo, y la elección importa. `strong` es para un fondo
   que puede iluminarse mucho en cualquier punto —el gradiente— y ahí el velo es
   lo único que garantiza el contraste. `soft` es para un fondo que ya es oscuro
   y cuyo interés está en verse: con el velo fuerte encima, la retícula
   desaparecía justo en la mitad donde está el texto, que es donde uno mira. */
const SCRIMS = {
  strong: 'linear-gradient(100deg, rgba(5,7,15,.92) 0%, rgba(5,7,15,.72) 38%, rgba(5,7,15,.28) 72%, rgba(5,7,15,.12) 100%)',
  soft: 'linear-gradient(100deg, rgba(5,7,15,.72) 0%, rgba(5,7,15,.34) 46%, rgba(5,7,15,0) 78%)',
};

const BANDS = {
  dark: { token: '--navy-900', color: 'var(--navy-900)', deep: true },
  darker: { token: '--navy-950', color: 'var(--navy-950)', deep: true },
  light: { token: '--off-white', color: 'var(--off-white)', deep: false },
  sunken: { token: '--pale-100', color: 'var(--pale-100)', deep: false },
};

export function Section({
  band = 'light',
  id,
  nodeState,
  pad = 'var(--space-13)',
  backdrop,
  scrim = 'strong',
  children,
  ...rest
}) {
  const b = BANDS[band] || BANDS.light;
  return (
    <section
      id={id}
      data-band={b.token}
      data-deep={b.deep ? '' : undefined}
      data-node-state={nodeState}
      style={{
        position: 'relative',
        background: b.color,
        padding: `${pad} var(--gutter-page)`,
      }}
      {...rest}
    >
      {/* Fondo vivo opcional. Va detrás y pinta su propio navy, así que sustituye
          al nodo 3D en esa banda en vez de superponerse: dos capas de partículas
          a la vez no leen como profundidad, leen como suciedad. */}
      {backdrop}
      {/* Velo sobre el fondo vivo. No es estética: el fondo se mueve, y sin un
          suelo garantizado el contraste del texto dependería de dónde caiga la
          mancha clara en ese instante. Con el velo, el peor caso sigue pasando
          AA. */}
      {backdrop && scrim && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: SCRIMS[scrim] || SCRIMS.strong,
          }}
        />
      )}
      <div style={{ position: 'relative', maxWidth: 'var(--maxw-content)', margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
}

/* ---------- texto ---------- */

export const Kicker = ({ children, dark }) => (
  <p
    style={{
      margin: 0,
      font: 'var(--type-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: dark ? 'var(--electric-green)' : 'var(--text-accent)',
    }}
  >
    {children}
  </p>
);

export const Headline = ({ children, dark, as = 'h2', size = 'var(--text-h1)' }) => {
  const Tag = as;
  return (
    <Tag
      style={{
        margin: 'var(--space-5) 0 0',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-display)',
        fontSize: size,
        lineHeight: 'var(--leading-heading)',
        letterSpacing: 'var(--track-display)',
        color: dark ? 'var(--white)' : 'var(--text-heading)',
        maxWidth: '18ch',
      }}
    >
      {children}
    </Tag>
  );
};

export const Lead = ({ children, dark }) => (
  <p
    style={{
      margin: 'var(--space-6) 0 0',
      font: 'var(--type-lead)',
      color: dark ? 'var(--slate-100)' : 'var(--text-body)',
      maxWidth: '58ch',
    }}
  >
    {children}
  </p>
);

export const Body = ({ children, dark, style }) => (
  <p
    style={{
      margin: 'var(--space-4) 0 0',
      font: 'var(--type-body)',
      color: dark ? 'var(--slate-200)' : 'var(--text-muted)',
      maxWidth: '62ch',
      ...style,
    }}
  >
    {children}
  </p>
);

/* ---------- llamadas a la acción ---------- */

/* Sin `white-space: nowrap`, y con tope de ancho.
 *
 * Con nowrap, una etiqueta larga —"Ver el framework y sus herramientas"— no
 * podía partirse: se salía de su contenedor, y con ella de la pantalla. En un
 * móvil de 375 px eso dejaba la página entera arrastrable de lado, que es de
 * los fallos que más ensucian la sensación de un sitio.
 *
 * El relleno vertical no cambia nada en una línea (48 px de alto mínimo mandan
 * sobre 14 de texto más 32 de relleno); solo entra en juego cuando la etiqueta
 * pasa a dos líneas, para que el texto no toque el borde de la píldora. */
const ctaBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  padding: 'var(--space-4) var(--space-7)',
  borderRadius: 'var(--radius-pill)',
  font: 'var(--type-label)',
  letterSpacing: 'var(--track-label)',
  textTransform: 'uppercase',
  textDecoration: 'none',
  textAlign: 'center',
  maxWidth: '100%',
};

export const PrimaryCTA = ({ to, href, children, ...rest }) => {
  const style = { ...ctaBase, background: 'var(--electric-green)', color: 'var(--deep-navy)' };
  return href
    ? <a href={href} style={style} className="cta-primary" {...rest}>{children}</a>
    : <Link to={to} style={style} className="cta-primary" {...rest}>{children}</Link>;
};

export const GhostCTA = ({ to, children, dark, ...rest }) => (
  <Link
    to={to}
    style={{
      ...ctaBase,
      background: 'transparent',
      border: `1px solid ${dark ? 'var(--border-strong-dark)' : 'var(--border-strong)'}`,
      color: dark ? 'var(--white)' : 'var(--text-heading)',
    }}
    className="cta-ghost"
    {...rest}
  >
    {children}
  </Link>
);

/* Enlace de texto con la regla verde: la salida de sección por defecto */
export const TextCTA = ({ to, children, dark }) => (
  <Link
    to={to}
    style={{
      display: 'inline-block',
      marginTop: 'var(--space-7)',
      paddingBottom: 'var(--space-3)',
      borderBottom: `1px solid ${dark ? 'var(--green-line)' : 'var(--border-strong)'}`,
      font: 'var(--type-label)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: dark ? 'var(--electric-green)' : 'var(--text-accent)',
    }}
    className="cta-text"
  >
    {children} →
  </Link>
);

/* ---------- rejillas ---------- */

/* La rejilla numera a sus hijos para que entren escalonados. Se inyecta aquí y
   no en cada página porque el índice es una propiedad de la posición en la
   rejilla, no del contenido: pedirlo a mano en veinte sitios garantiza que
   alguno se olvide y esa tarjeta entre a destiempo. */
export const Cols = ({ children, min = '260px', gap = 'var(--space-8)', style }) => (
  <div
    data-cols
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${min}, 1fr))`,
      gap,
      marginTop: 'var(--space-10)',
      ...style,
    }}
  >
    {React.Children.map(children, (child, i) =>
      React.isValidElement(child) && typeof child.type !== 'string'
        ? React.cloneElement(child, { index: child.props.index ?? i })
        : child)}
  </div>
);

/* Encabezado de dos columnas: titular a la izquierda, entrada a la derecha.
   Es el ritmo que el documento pide para las secciones de la home. */
export const SectionHead = ({ kicker, headline, lead, dark, id }) => (
  <div
    data-cols
    style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
      gap: 'var(--space-9)',
      alignItems: 'end',
    }}
    id={id}
  >
    <Reveal as="div">
      {kicker && <Kicker dark={dark}>{kicker}</Kicker>}
      <Headline dark={dark}>{headline}</Headline>
    </Reveal>
    {lead && <Reveal as="div"><Lead dark={dark}>{lead}</Lead></Reveal>}
  </div>
);

/* ---------- tarjeta ---------- */

export const Card = ({ children, dark, style, index = 0, ...rest }) => (
  <Reveal
    as="article"
    index={index}
    data-lift=""
    style={{
      padding: 'var(--space-7)',
      background: dark ? 'var(--navy-850)' : 'var(--white)',
      border: `1px solid ${dark ? 'var(--border-hairline-dark)' : 'var(--border-hairline)'}`,
      ...style,
    }}
    {...rest}
  >
    {children}
  </Reveal>
);

/* Índice editorial: filas con regla, no una parrilla de tarjetas iguales.
   El documento lo pide explícitamente para las herramientas y las preguntas. */
export const IndexRow = ({ to, term, def, dark, num, icon, index = 0 }) => {
  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
        {icon && (
          <span style={{ alignSelf: 'start', color: dark ? 'var(--electric-green)' : 'var(--text-accent)' }}>
            <Ico name={icon} size={26} />
          </span>
        )}
        {num && (
          <span style={{ font: 'var(--type-mono)', color: dark ? 'var(--slate-400)' : 'var(--text-faint)' }}>
            {num}
          </span>
        )}
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-display-strong)',
            fontSize: 'var(--text-h3)',
            lineHeight: 1.26,
            letterSpacing: 'var(--track-heading)',
            color: dark ? 'var(--white)' : 'var(--text-heading)',
          }}
        >
          {term}
        </h3>
      </div>
      <p
        style={{
          margin: 0,
          font: 'var(--type-body)',
          color: dark ? 'var(--slate-200)' : 'var(--text-muted)',
          maxWidth: '46ch',
        }}
      >
        {def}
      </p>
    </>
  );

  const style = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: 'var(--space-7)',
    alignItems: 'start',
    padding: 'var(--space-6) 0',
    borderTop: `1px solid ${dark ? 'var(--border-hairline-dark)' : 'var(--border-hairline)'}`,
    textDecoration: 'none',
  };

  return to
    ? <Reveal as={Link} index={index} to={to} data-cols style={style} className="index-row row-hit">{inner}</Reveal>
    : <Reveal as="div" index={index} data-cols style={style} className="row-hit">{inner}</Reveal>;
};
```

---

## 6. Reglas del sistema

Decisiones que no se leen en un token ni en una prop, extraídas de los
comentarios de `src/styles/global.css`, que es donde se tomaron.

---------------------------------------------------------------------------
Lo que en los artboards Durable vivía duplicado en el <helmet> de cada uno.
Aquí va una sola vez.
---------------------------------------------------------------------------

Por debajo de 720px, el CTA de píldora y el selector ES/EN no caben junto al
wordmark: la barra desbordaba y empujaba el burger fuera de pantalla, dejando
el menú inalcanzable en móvil. Los dos ya están dentro del overlay.

---------------------------------------------------------------------------
Nodo de IA (solo home)

La capa 3D va fija en z-index -1 y pinta el fondo de la página entera: las
bandas de color de cada sección más las partículas encima. Para que se vea,
todo lo que tiene delante deja de pintar fondo — html, body, el contenedor
de página y las propias secciones, claras y oscuras por igual. Esa es la
diferencia con la primera versión, donde las secciones claras tapaban el
nodo y lo partían en tres trozos.

Todo cuelga de :root[data-ai-node="on"], que AiNodeStage solo pone cuando el
contexto WebGL existe. Sin esa marca, nada de esto aplica y la home se ve
igual que antes.
---------------------------------------------------------------------------

Las bandas claras ya NO vuelven a pintar su propio fondo. Aquí había dos
reglas que se lo devolvían, y merecen epitafio porque explican por qué el
nodo desapareció de las secciones claras durante unos días.

El canvas las dibujaba mal: la banda clara salía reflejada respecto al centro
de la pantalla —terminaba en `alto_ventana − inicio` en vez de llegar hasta
abajo—, así que media sección clara se veía navy con texto oscuro encima.
Ilegible. Como no se consiguió aislar entonces, se puso esta red: las bandas
claras se pintaban solas y el problema desaparecía, a costa de tapar el nodo
justo donde estaba la red.

La causa apareció después, en otro sitio: `uResolution` se pasaba al shader
en píxeles CSS mientras `gl_FragCoord` viene en píxeles del búfer de dibujo.
En una pantalla de densidad 1 son el mismo número y no se notaba nada; en un
móvil de densidad 3, el valor normalizado llegaba hasta 3 en vez de hasta 1 y
la geometría de las bandas se deshacía.

Corregido eso, se recorrieron 114 bandas claras —10 páginas × 3 tamaños de
pantalla, cinco alturas y tres columnas por banda— y ninguna sale navy.
La comprobación distingue el fondo mal pintado de una foto oscura dentro de
una sección clara: lo primero es plano, lo segundo tiene dispersión de color.
Sin esa distinción salían 16 fallos, y los 16 eran fotos y texto.

Si alguna vez vuelve a verse una sección clara a medio pintar, esto es lo
primero que hay que restaurar: son dos líneas y devuelven la legibilidad al
instante. Pero ya no hacen falta.

Las secciones que traían foto de fondo la apagan: el nodo ocupa su sitio.
La <img> se queda en el DOM a propósito — es exactamente el fallback que se
ve si WebGL no está disponible. El degradado de legibilidad que va encima no
se toca: es lo que mantiene el texto leíble sobre el nodo.

---------------------------------------------------------------------------
Estados de hover
Todo lo que se puede pulsar tiene que decirlo antes de que lo pulses.
---------------------------------------------------------------------------

Carril del formulario a pantalla completa: lista completa en escritorio,
puntos en móvil. La lista de diez filas ocupaba la primera pantalla entera
del móvil y dejaba la pregunta debajo del pliegue — que es exactamente lo
contrario de para lo que existe el carril.

Enlace de salto al contenido. Fuera de pantalla mientras nadie lo enfoca, y
por encima de la cabecera fija cuando aparece — si quedara por debajo, el
único elemento que existe para ayudar al teclado sería el único tapado.

