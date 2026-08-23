# Briefing para rediseñar el CMS de BECOME

> Cópialo entero y pégalo en una sesión nueva. Está escrito para que quien lo
> lea entienda **cómo funciona** la herramienta antes de dibujarla: un CMS mal
> diseñado casi nunca es feo, es que no entendió qué hace la gente con él.

---

Eres el director de diseño de producto. Vas a rediseñar el panel de
administración de **BECOME**, una consultora de transformación AI-native con
sede en Perú. No necesito una propuesta bonita: necesito una herramienta que
alguien use todos los días desde el móvil sin equivocarse.

Antes de proponer nada, entiende lo que sigue.

## 1. Quién lo usa, y cómo

Una sola persona: el fundador. No es técnico. **Administra el sitio desde el
navegador de un iPhone**, de pie, en huecos de diez minutos entre reuniones.
Ocasionalmente desde un portátil.

Eso decide casi todo:

- Cada cosa que se toca tiene que caber bajo el pulgar y no confundirse con la
  de al lado. Un toque errado en el sitio equivocado borra un párrafo que
  escribió a mano.
- Nunca hay tiempo para "luego lo reviso": lo que se guarda, se publica.
- Si algo falla, tiene que decir qué pasó **y qué hacer**, no un código.

## 2. Qué hace exactamente esta herramienta

Edita el contenido de un sitio público de 90 páginas en español e inglés. No es
un panel de métricas: **no hay gráficos, no hay dashboard**. Es un editor.

Lo que hace único a este CMS, y hay que entenderlo o el diseño no funcionará:

### a) El contenido no vive en una base de datos, vive en el repositorio

Cada cambio queda como una versión con su historial: quién cambió qué y cuándo,
y se puede volver atrás. **Guardar no es guardar: es publicar**, y el cambio
tarda unos minutos en verse en la web porque antes tiene que compilarse y
pasar por unos controles automáticos.

El diseño tiene que hacer entender esa demora sin que parezca que falló algo.

### b) Hay dos autores: una persona y una rutina

Cada mañana, un agente escribe y publica un artículo solo. La persona escribe
todo lo demás. Ambos pasan por la misma validación.

Falta por diseñar: **una cola donde la persona vea lo que escribió el agente y
pueda retenerlo antes de que salga**. Hoy el agente publica directo.

### c) El formulario no está escrito: está declarado

El panel no sabe qué es una industria. Lee un archivo que declara qué campos
tiene, de qué tipo, con qué límite de caracteres y con qué texto de ayuda, y
dibuja lo que corresponda. Añadir una sección nueva al panel no es programar:
es escribir una declaración.

**Consecuencia para el diseño: no puedes diseñar pantallas a medida.** Tienes
que diseñar un sistema que se dibuje solo a partir de esa declaración, y que
siga funcionando cuando alguien añada un campo que tú no viste.

### d) Los límites de caracteres son de verdad

Un título de más de 60 caracteres se corta en los resultados de Google. Una
descripción corta desperdicia el espacio que Google da. Quien escribe necesita
verlo **mientras escribe**, no descubrirlo tres semanas después.

## 3. Los seis módulos, y qué hay dentro de cada uno

| Módulo | Qué edita | Volumen |
|---|---|---|
| **Artículos** | El blog. Crear, editar, publicar o dejar en borrador | ~4, crece uno al día |
| **Páginas** | Los textos de 10 páginas del sitio: portada, servicios, contacto… | 10 páginas · 201 campos |
| **Contenido** | Lo que tiene listas dentro: industrias, casos de uso, programas, el método | 4 colecciones · 27 combinaciones de elemento + idioma |
| **Conocimiento** | Lo que un agente de IA necesita saber para hablar por BECOME: identidad, precios, objeciones, tono | 5 documentos · 15 campos, **13 aún vacíos** |
| **Autores** | Foto, cargo y biografía de quien firma los artículos | 3 |
| **Suscriptores** | La lista de correo. Solo lectura y envíos | cientos |

### Detalle del módulo Contenido, que es el más complejo

Cuando se abre una colección hay que elegir **dos cosas antes de editar**: qué
elemento (cuál de las 6 industrias) y en qué idioma (ES o EN). Se guarda un
elemento y un idioma cada vez, a propósito: un botón que guardara los doce a la
vez convertiría un error pequeño en doce errores.

Ejemplo real de lo que contiene **una** industria en **un** idioma: 20 campos,
entre ellos una lista de 12 oportunidades (cada una con dos columnas: dónde y
qué cambia), 5 métricas, 6 procesos, 5 capacidades de tres columnas.

**Es mucha información en una pantalla de 390 píxeles.** Ahí está el problema
de diseño de verdad.

## 4. Los tipos de campo que hay que resolver

Son seis y no habrá más sin avisar. Cada uno necesita su tratamiento:

1. **línea** — una frase. Con contador de caracteres.
2. **párrafo** — varias frases. Contador también.
3. **lista** — N textos en orden. Se añaden, se quitan y **se reordenan**: el
   orden es contenido, la primera oportunidad de una industria es la que más
   gente lee.
4. **pares** — filas de dos columnas (por ejemplo: métrica | qué mide).
5. **tuplas** — filas de 3 a 5 columnas. Una de ellas llega a cinco.
6. **bloque** — un grupo con nombre que dentro puede llevar líneas, párrafos,
   listas o tablas. Por ejemplo "El problema" = un titular + varios párrafos.

Los campos pueden ser **opcionales**: algunos elementos los tienen y otros no.

## 5. Estados que el diseño tiene que resolver

No los inventes al final; son la mitad del trabajo:

- **Cargando** una lista, y **cargando** un elemento al cambiar de idioma
- **Vacío**: un módulo sin nada todavía, y una lista sin filas
- **Guardando**, **guardado**, y **no había nada que cambiar**
- **Error del servidor** con su explicación
- **Aviso previo**: un campo pasado de límite o vacío, antes de intentar guardar
- **Deuda visible**: 13 campos de conocimiento sin escribir. Deberían verse sin
  entrar a buscarlos
- **Sesión caducada a media edición**, sin perder lo escrito
- **Acción irreversible**: quitar una fila de una lista

## 6. La identidad de marca

No inventes una nueva. Es la de BECOME:

```
navy profundo   #0A0E27   el fondo
verde eléctrico #00FF88   la señal, y solo una por pantalla
blanco roto     #F7FAFC   el texto principal
```

La web pública es clara y se lee despacio. **El panel es oscuro y se opera
deprisa**: misma marca, otra velocidad. Tipografía de display para los títulos,
monoespaciada para todo lo que se cuenta o se etiqueta (contadores, rutas,
números de fila).

**Regla que ya me costó equivocarme una vez:** el verde señala una sola cosa
por pantalla. Si el verde está en el botón de guardar y también en el selector
de idioma, deja de señalar.

## 7. Restricciones que no se negocian

- **Móvil primero.** 390 píxeles es el caso normal, no el caso extremo.
- **Todo lo tocable, 44 píxeles de alto como mínimo.** Sin excepciones para los
  controles pequeños: precisamente los de reordenar y borrar son los que más
  daño hacen si se falla el toque.
- **Contraste mínimo 4.5:1** en todo el texto, medido sobre el fondo real.
- **El foco se ve siempre**, para quien navega con teclado.
- **Sin emojis como iconos.** SVG, un solo set, mismo grosor de trazo.
- **Respeta `prefers-reduced-motion`.**
- **Los campos de texto, 16 píxeles como mínimo**: por debajo, iOS amplía la
  página al enfocar y quien escribe pierde el sitio donde estaba.
- El color nunca informa solo: siempre acompañado de palabra o forma.

## 8. Lo que NO hay que hacer

- **No añadas un dashboard de métricas.** No hay métricas que mirar aquí.
- **No conviertas esto en un editor visual tipo "arrastra y suelta".** El
  contenido es estructurado a propósito; cada campo tiene su sitio y su límite.
- **No propongas una base de datos** ni "guardado automático en la nube":
  guardar significa publicar, con historial y revisión.
- **No inventes campos.** Los declara el repositorio.
- **No quites la separación entre elemento e idioma** en el módulo Contenido.

## 9. Qué quiero de vuelta

En este orden:

1. **Diagnóstico primero.** Qué falla hoy en la experiencia, no en el aspecto.
   Especialmente: editar una industria con 20 campos y 30 filas en un móvil.
2. **El sistema**: retícula, escala tipográfica, espaciado, estados y los seis
   tipos de campo resueltos como componentes.
3. **Las pantallas clave**, en móvil y escritorio:
   - entrada
   - lista de módulos y lista dentro de un módulo
   - el editor de un elemento con listas largas
   - la cola de la rutina (a diseñar desde cero)
4. **Cómo se navega una lista de 30 filas en un móvil** sin perderse. Esto es
   el corazón del encargo.
5. **Qué recomiendas dejar como está.** Si algo ya funciona, dilo.

Para cada decisión, dime **qué problema resuelve**. Una propuesta que solo diga
que queda más limpia no me sirve: necesito saber qué error deja de cometerse.
