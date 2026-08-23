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

### La voz

Ejecutiva, inteligente, directa, premium, business-first. Clara, no académica.
Segura, sin exageraciones. Provocadora cuando la idea lo justifique, nunca
clickbait.

BECOME habla de IA desde transformación, capacidad empresarial, procesos,
decisiones, personas, datos y operación. No desde el entusiasmo tecnológico.

### La estructura

1. **Gancho.** Una frase corta con una tensión, un hallazgo o una pregunta.
2. **Desarrollo.** Dos o tres frases, no más, sobre por qué le importa a una
   empresa. Sin revelar las conclusiones del artículo.
3. **Invitación.** Una frase natural para seguir leyendo: «Lo desarrollamos en
   este nuevo análisis de BECOME», «Exploramos qué cambia cuando…», «En el
   artículo completo analizamos…».

El enlace y los hashtags los pone el publicador. No los escribas en el texto.

### Reglas

- Entre 60 y 100 palabras.
- Párrafos cortos, separados por una línea en blanco.
- No empezar por «Nuevo artículo».
- Prohibidas: «La IA está revolucionando el mundo», «En un mundo cada vez más
  digital», «Descubre cómo», «¿Estás listo para el futuro?», «No te lo puedes
  perder».
- Sin emojis, salvo que uno aporte algo evidente.
- **Un solo signo de interrogación en todo el post.** Dos preguntas seguidas
  diluyen la primera.
- No convertir el post en una lista.
- Nada de datos, resultados ni conclusiones que no estén en el artículo.
- No repetir el título literalmente salvo que haga falta.
- El post tiene que funcionar para alguien que no conoce BECOME.
- Antes una idea memorable que una explicación completa.
- Rayas largas (—) no, aquí tampoco.

### Máximo tres hashtags

Relevantes de verdad. En `hashtags`, sin almohadilla y sin espacios:
`["IA", "Estrategia", "Operaciones"]`.

### El criterio

El lector termina el copy pensando **«esto plantea algo que me afecta y quiero
entender la respuesta»**.

No: «ya entendí todo el artículo, no necesito abrirlo».
