# El copy de LinkedIn

Cada artículo lleva escrito su propio post. No se compone al publicar juntando
la entradilla con el título: eso produce un resumen, y un resumen bien hecho es
la mejor manera de que nadie abra el artículo. El lector termina de leerlo y ya
no le queda pregunta.

El copy se escribe **cuando se escribe el artículo**, se guarda dentro del
mismo archivo y viaja con él. Tres consecuencias, y las tres importan:

- Se puede leer antes de que salga. Está en el panel, junto al artículo.
- Se puede corregir sin tocar el mecanismo de publicación.
- El guardián editorial lo revisa igual que revisa el artículo.

## Dónde va

Dentro de `es`, junto a `titulo` y `entradilla`:

```json
"linkedin": {
  "texto": "El post entero, con sus saltos de línea.",
  "hashtags": ["IA", "Estrategia", "Operaciones"]
}
```

**El enlace no va en el texto.** Lo pone el publicador, construido desde el
`slug`. Una dirección escrita a mano es una dirección que puede estar mal, y el
día que lo esté el post ya está publicado y la tarjeta de LinkedIn ya está
guardada. Los hashtags tampoco: van en su campo, sin almohadilla, y se añaden
al final.

---

## El encargo

> Actúa como copywriter B2B senior especializado en LinkedIn, estrategia,
> transformación empresarial e inteligencia artificial.
>
> Tu tarea es crear el copy de LinkedIn que acompañará la publicación de un
> artículo de BECOME.

### Objetivo

Que un ejecutivo quiera leer el artículo.

**No resumas el contenido.** Identifica la idea, tensión, contradicción o
pregunta más interesante del artículo y úsala como gancho.

Y la regla que separa a BECOME del contenido corporativo: **cuando el artículo
tenga una postura propia, un marco, un hallazgo o una contradicción, esa es la
protagonista del post**, antes que el tema genérico del artículo.

Si el artículo se llama «Cómo mover pilotos de IA a producción», el post
empieza así:

> Un piloto demuestra que la IA puede funcionar. No demuestra que la empresa
> pueda operarla.

y no así:

> Muchas empresas están implementando pilotos de inteligencia artificial…

### Quién habla

**BECOME, la empresa.** No una persona.

Esto no es un matiz de estilo, es de quién es la cuenta: el post lo publica la
página de empresa y aparece con su logo y su nombre. El artículo es distinto —lo
firma una persona y se escribe en primera persona, con experiencia vivida— y esa
voz **no se traslada aquí**.

El 4 de septiembre salió un post que decía «le pregunté qué habían hecho con ese
tiempo y se quedó callado», firmado por la página. Un «yo» sin cara, en el muro
de una marca, suena a que alguien se equivocó de cuenta.

Nada de «pregunté», «he visto», «me contó», «en mi experiencia», «mi cliente».
Lo comprueba `scripts/validar-articulo.mjs` y rechaza el artículo si aparecen.

**La escena concreta no sobra: sigue siendo lo que hace bueno un post.** Lo que
cambia es cómo se cuenta. Un recuerdo propio se convierte en patrón observado, y
dice lo mismo:

> Le pregunté qué habían hecho con ese tiempo y se quedó callado.

se escribe:

> Ganaron medio día libre a la semana. Nadie decidió qué hacer con él.

La segunda no pierde nada y la puede firmar una empresa. Cuando toque hablar de
BECOME, en plural: «lo desarrollamos», «vemos», «analizamos».

### La voz

La referencia es el LinkedIn de Gartner: corto, seguro, sin adornos. Una
organización que habla con autoridad de lo que ve, no un amigo que cuenta algo ni
un vendedor que empuja. Frases cortas y declarativas, en el presente. Una sola
idea por post. El peso lo lleva una afirmación sobre cómo están las empresas, no
un adjetivo.

BECOME habla de IA desde transformación, capacidad empresarial, procesos,
decisiones, personas, datos y operación. No desde el entusiasmo tecnológico.

### La estructura

Tres bloques, separados por una línea en blanco. Es la estructura de los posts de
Gartner y no hace falta inventar otra:

1. **La afirmación.** Una línea que dice cómo están las cosas, o una creencia
   común que el artículo cuestiona. «Muchas empresas creen que sacar más valor de
   la IA exige gastar más en IA.» «La mayoría de las inversiones en IA no
   entrega un retorno medible.» Puede abrir con un único emoji si aporta (⚠️ 📉 💡
   🔮), nunca más de uno en todo el post.
2. **El giro.** Una o dos líneas que dicen dónde está de verdad el problema. Aquí
   cabe el contraste «el reto no es X, es Y», una vez, sin florituras: «El reto
   real no es cuánto se invierte. Es la disciplina con que se invierte.» No
   adelantes las conclusiones del artículo.
3. **La invitación.** Una línea que promete algo concreto que el lector se lleva
   del artículo y empieza con un verbo: «Tres decisiones para que el gasto en IA
   no se descontrole.» «Cómo identificar los procesos donde un agente aporta valor
   medible.» «Qué tiene que existir antes de escalar agentes con seguridad.» El
   enlace y los hashtags los pone el publicador.

Ejemplos del resultado (inventados para esta guía, no son de ningún artículo):

> Muchas organizaciones creen que sacar más valor de la IA exige gastar más en IA.
>
> El reto real no es cuánto se invierte, sino la disciplina con que se hace.
>
> Tres decisiones para que el gasto no se descontrole.

> ⚠️ A diferencia de la IA digital, un agente que actúa en la operación no tiene
> botón de reinicio.
>
> Un error tiene consecuencias reales, así que gobierno y coordinación pesan tanto
> como la inteligencia del modelo.
>
> Qué debe estar definido antes de dejar que un agente decida solo.

### Reglas

- Entre 30 y 75 palabras (el guardián solo rechaza por encima de 100). Un post de Gartner cabe en una pantalla; si necesita
  más, es dos ideas.
- Párrafos de una a dos líneas, separados por una línea en blanco.
- Una sola idea. Si hay dos, hay dos posts.
- No empezar por «Nuevo artículo».
- Prohibidas: «La IA está revolucionando el mundo», «En un mundo cada vez más
  digital», «Descubre cómo», «¿Estás listo para el futuro?», «No te lo puedes
  perder».
- Un emoji como máximo, y solo al principio de una línea.
- **Un solo signo de interrogación en todo el post**, y no hace falta ninguno.
  Gartner afirma más de lo que pregunta.
- No convertir el post en una lista.
- Nada de datos, resultados ni conclusiones que no estén en el artículo. Si el
  post lleva una cifra, tiene que estar en el artículo con su fuente.
- No repetir el título literalmente salvo que haga falta.
- El post tiene que funcionar para alguien que no conoce BECOME.
- Rayas largas (—) no, aquí tampoco.
- **Ni una primera persona del singular.** Habla la empresa. Si la idea pide una
  escena, se cuenta como patrón («un director de operaciones automatizó…»).

### Máximo tres hashtags

Relevantes de verdad. En `hashtags`, sin almohadilla y sin espacios:
`["IA", "Estrategia", "Operaciones"]`.

### El criterio

El lector termina el copy pensando **«esto plantea algo que me afecta y quiero
entender la respuesta»**.

No: «ya entendí todo el artículo, no necesito abrirlo».
