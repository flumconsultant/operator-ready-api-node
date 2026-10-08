---
name: linkedin-become
description: Escribir o afinar el copy de LinkedIn de la página de empresa BECOME con la estructura de Gartner — afirmación, giro, invitación, en 30-75 palabras y voz corporativa. Úsala cuando Carlos pida revisar, mejorar o reescribir el post de LinkedIn de un artículo, cuando pregunte por el tono de la página de empresa, o cuando un post "no suena a Gartner". No es para posts del perfil personal de Carlos: para eso está linkedin-post-carlos.
---

# El copy de LinkedIn de BECOME

## Antes que nada: no lo confundas con el perfil personal

Hay dos voces y no se mezclan:

| | Quién firma | Voz | Dónde |
|---|---|---|---|
| **Esta skill** | La página de empresa | BECOME, tercera persona | Posts de cada artículo |
| `linkedin-post-carlos` | Carlos | Primera persona, experiencia vivida | Sus posts personales |

Un «yo» en el muro de la marca suena a cuenta equivocada. Ya pasó una vez.

## Lo primero

**Lee `automatizacion/copy-linkedin.md`.** Tiene el encargo completo: objetivo,
quién habla, la voz, la estructura de tres bloques, los recursos de Gartner, las
reglas y los hashtags. Esta skill no los repite —se separarían— sino que dice
cómo revisar un copy contra ellos.

## La revisión, en seis preguntas

1. **¿La primera línea aguanta sola?** Es lo único que se ve antes del «…ver
   más». Si es contexto, el post ya está perdido.
2. **¿Hay cifra, y tiene fuente en el artículo?** Si la hay y está verificada,
   abre con ella: es la firma de Gartner. Si no está verificada, **no se usa**.
   Un porcentaje inventado destruye justo lo que el post venía a construir.
3. **¿La idea tiene nombre?** Dos o tres palabras que se puedan repetir en una
   reunión. Una idea con nombre se cita; una sin nombre se olvida.
4. **¿Está la advertencia junto a la promesa?** Gartner nunca deja una afirmación
   optimista sola. El riesgo de llevarla lejos va al lado, en el giro.
5. **¿La invitación promete algo concreto y empieza por verbo?** «Tres decisiones
   para…» sí. «Descubre cómo…» no.
6. **¿Resume o plantea?** Si el lector termina el post sabiendo la conclusión, no
   abrirá el artículo. El post abre una pregunta; el artículo la cierra.

## Lo mecánico, que no se juzga a ojo

```
node scripts/validar-articulo.mjs src/content/insights/<archivo>.json
```

Comprueba longitud (30-100 duro, 30-75 objetivo), un solo signo de
interrogación, nada de primera persona del singular, sin enlaces ni hashtags
dentro del texto, sin repetir el título ni la entradilla.

## Para verlo antes de que salga

```
Actions → Anunciar en LinkedIn → Run workflow → «Ensayo» MARCADO
```

Imprime el post exacto y la tarjeta del enlace sin publicar nada. Con la casilla
desmarcada publica de verdad, y un post en la página no se puede recoger.
