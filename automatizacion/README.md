# Cómo se escriben solos los artículos

Dos trabajos automáticos, y una persona en medio que decide.

```
Lunes            Observatorio  →  automatizacion/informes/AAAA-MM-DD.md
                 (mide dónde aparecemos y dónde no)

Martes alternos  Redactor      →  src/content/insights/<slug>.json  (borrador)
                 (escribe el hueco prioritario, en ES y EN)

Cuando quieras   Tú            →  /admin: lo lees, lo editas, lo publicas
```

## Los archivos

| Archivo | Qué es | ¿Lo tocas tú? |
|---|---|---|
| `preguntas.md` | Las preguntas que queremos ganar | **Sí.** Es tuyo |
| `observatorio.md` | El encargo del trabajo que mide | Rara vez |
| `redaccion.md` | El encargo del que escribe: formato, SEO y voz | Si cambia la línea editorial |
| `informes/` | Lo que va midiendo, semana a semana | No, se escribe solo |

Si un artículo sale con un tono que no es el de BECOME, el sitio donde se
arregla es `redaccion.md`, no el artículo. Corregir el artículo arregla uno;
corregir el encargo arregla todos los siguientes.

## Lo que el sistema no hace

**No publica.** Todo lo que escribe nace como borrador, y un borrador existe en
el panel y no en la web. Es deliberado: Google penaliza el contenido publicado
en volumen sin supervisión, y BECOME vende criterio. Un artículo con un dato
inventado hace más daño que el beneficio de veinte correctos.

**No mide lo que contesta ChatGPT.** Mide qué encuentra la web para esas
preguntas, que es de donde beben los asistentes. Es un indicador adelantado,
no la misma cosa, y los informes lo dicen cada vez.

## Cuando algo falla

Casi siempre es el token de la suscripción, que caduca. Se renueva así:

```
claude setup-token
```

y el resultado se pega en el secreto `CLAUDE_CODE_OAUTH_TOKEN`
(Settings → Secrets and variables → Actions). Los dos trabajos fallan en rojo
y lo dicen con esas palabras, para que no haya que adivinarlo.

## Coste

Cero, más allá de lo que ya pagas. Los dos trabajos corren contra la
suscripción Max mediante `CLAUDE_CODE_OAUTH_TOKEN`, no contra la API. Un
informe semanal y un artículo quincenal es consumo despreciable.
