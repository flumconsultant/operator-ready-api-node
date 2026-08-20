# Cómo se escriben solos los artículos

Dos trabajos automáticos, y una persona en medio que decide.

```
Domingo 05:00    Observatorio  →  informes/AAAA-MM-DD.md
                 mide dónde aparecemos y deja la cola de la semana: 8 huecos

Cada día 07:00   Redactor      →  src/content/insights/<slug>.json
                 toma el primer hueco sin cubrir y escribe el artículo, ES y EN

                 Guardián      →  scripts/validar-articulo.mjs
                 12 comprobaciones. Si falla una, no se publica y se acabó el día

                 Publicación   →  commit + despliegue. En la web en minutos
```

Los artículos los firma la ficha de autor marcada como predeterminada en el
panel (**/admin → Autores**), y se declaran como escritos
por una persona, no por la empresa, en los datos estructurados. Un artículo de
opinión atribuido a una marca no acumula autoridad de autor.

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

## Publica sin que nadie lo lea antes

Es una decisión tomada a sabiendas, y cambia dónde vive el control. Como no hay
un lector humano entre la redacción y la web, el control es
`scripts/validar-articulo.mjs`, y es mecánico. Comprueba lo que se puede
comprobar sin criterio propio:

autor exacto · fecha bien formada · pilar y formato que existen · los dos
idiomas completos · título ≤60 y descripción ≤155 · direcciones únicas y
distintas entre idiomas · bloques que la web sabe pintar · preguntas frecuentes
con respuestas citables · el CTA al destino correcto de cada idioma · entre 700
y 1800 palabras · sin rayas largas ni muletillas de texto generado · **y ninguna
cifra sin un «Fuente: …» escrito en el artículo**.

Esa última es la que más importa. Un dato inventado publicado bajo el nombre de
una persona real no se arregla borrándolo: ya lo leyó alguien, y puede que ya lo
cite un asistente.

**Un artículo que no pasa no se publica y el día se queda sin artículo.** Es el
comportamiento correcto: no publicar un día cuesta cero.

### Lo que el guardián no puede comprobar

Si está bien argumentado. Si la tesis se sostiene. Si el ejemplo es bueno. Eso
sigue necesitando ojos, y por eso vale la pena leer lo que sale, aunque ya esté
publicado: retirar un artículo del panel es cuestión de segundos.

Y una advertencia que corresponde dar una vez: publicar a diario, sin revisión y
con texto generado, es el patrón exacto que las políticas de spam de Google
describen como *scaled content abuse*. Lo que lo separa de eso es que cada
artículo responda de verdad a una pregunta que alguien se hace, y no que llene
un hueco del calendario. El observatorio existe justo para eso. El día que la
cola de huecos se vacíe, la respuesta correcta es publicar menos, no inventar
temas.

## Lo que el sistema no mide

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
