---
name: blog-become
description: Escribir o revisar un artículo del blog de BECOME (Insights) con la arquitectura de argumento de McKinsey — idea rectora, respuesta primero, tres apoyos MECE, subtítulos que afirman. Úsala cuando Carlos pida escribir, afinar, revisar o criticar un artículo del blog, un borrador de Insights, o cuando pregunte si un artículo "suena a McKinsey" o cómo mejorar su tono. También para auditar artículos ya publicados.
---

# El blog de BECOME

## Lo primero, y no es opcional

**Lee `automatizacion/redaccion.md` entero antes de escribir una palabra.** Ahí
vive el encargo completo: la arquitectura del argumento, la voz, el formato del
archivo, lo prohibido y lo que se comprueba solo.

Esta skill no repite esas reglas. Si las repitiera, en dos meses los dos textos
dirían cosas distintas y nadie sabría cuál manda. Lo que añade es **cómo revisar**
lo escrito contra ellas.

## La prueba de los subtítulos

La más rápida y la que más revela. Extrae solo los subtítulos del artículo, en
orden, sin el cuerpo:

```
node -e "const a=require('./src/content/insights/<archivo>.json');
a.es.bloques.filter(b=>b.tipo==='subtitulo').forEach(b=>console.log('·',b.texto))"
```

Léelos seguidos. Tienen que contar el argumento completo. Si al leerlos solo
sabes **de qué habla** cada apartado pero no **qué concluye**, el artículo está
etiquetado, no construido, y hay que reescribir los subtítulos como afirmaciones.

Excepción deliberada: uno o dos en forma de pregunta, los que recogen la pregunta
literal del hueco. Están en `redaccion.md` y tienen su motivo.

## Las cinco preguntas de revisión

Por orden de lo que más daño hace:

1. **¿Cuál es la idea rectora?** Si no puedes escribirla en una frase que tome
   posición, el artículo no la tiene. Es el fallo más común y el más caro.
2. **¿Está la respuesta en los dos primeros párrafos?** Si la conclusión aparece
   al final, el artículo está escrito como un relato. Quien dirige no llega.
3. **¿Los apoyos se pisan?** Dos apartados que dicen lo mismo con otras palabras
   son uno. Quita el más débil.
4. **¿Los apoyos bastan?** Si los tres fueran ciertos, ¿quedaría probada la idea
   rectora? Si queda un hueco, falta un apartado.
5. **¿Cada cifra está pegada a lo que demuestra?** Y antes: ¿tiene fuente
   comprobada escrita en el artículo? Sin fuente, el dato se quita.

## Lo que se comprueba sin criterio

Antes de dar nada por bueno:

```
node scripts/validar-articulo.mjs src/content/insights/<archivo>.json
```

Rechaza anglicismos, muletillas, copy de LinkedIn en primera persona, longitudes
fuera de rango y autores sin ficha. Si pasa limpio, el artículo cumple lo
mecánico; lo de arriba es lo que ningún script puede juzgar.
