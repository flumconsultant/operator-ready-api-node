# Observatorio de reputación — BCP

Monitoreo diario de menciones de BCP (redes sociales, prensa, reseñas) y de
qué responden los asistentes de IA sobre BCP (GEO), con sentimiento y
categoría puestos por Claude, log en el MySQL de Hostinger, alertas
inmediatas por correo cuando algo es grave y un reporte diario.

## Arquitectura

```
Google Sheets (config)              n8n — "PoC Solución de Monitoreo"
  · Config (marca, keywords,   →     1. Trigger diario (cron)
    competidores, categorías,        2. Lee la Config y los GEO Prompts
    palabras críticas)               3. Rama social/prensa/reseñas:
  · GEO Prompts (prompt, motor)         Apify (un actor por fuente)
                                     4. Rama GEO: por cada prompt activo,
                                        llama a ChatGPT / Gemini / Claude
                                     5. Claude clasifica cada resultado:
                                        sentimiento, categoría, ¿es alerta
                                        urgente y por qué?
                                     6. Guarda el lote en:
                                        · monitoreo.php → tabla MySQL (log)
                                        · Google Sheet "Log Dashboard"
                                          (para el tablero en Looker Studio)
                                     7. Si algo quedó marcado como urgente →
                                        correo inmediato
                                     8. Al final de la corrida → correo con
                                        el resumen del día (monitoreo.php,
                                        acción "resumen")
```

## Dónde se edita cada cosa

| Qué | Dónde | Quién lo toca |
|---|---|---|
| Marca, alias, competidores, categorías, palabras críticas | [BCP Monitoreo — Config](https://docs.google.com/spreadsheets/d/16ZDs6OX_WF7y0U5vp9tVWKSEp2bIIvvN3Ugxx42YEPA/edit) | Tú, cuando quieras — n8n la relee en cada corrida |
| Prompts de GEO y en qué motor correr cada uno | [BCP Monitoreo — GEO Prompts](https://docs.google.com/spreadsheets/d/1Y0ggnirBN1YwUISWrqA1FhOMGFjAoyBa3xJbSE0Wzro/edit) | Tú — pon `activo=si` en los que quieras correr |
| Datos para el tablero (Looker Studio / Sheets) | [BCP Monitoreo — Log Dashboard](https://docs.google.com/spreadsheets/d/1MWEkDJY9_gRQqLITFWxIM_IBs5N6gJfVFQZ4G1k9sFU/edit) | Nadie a mano — la escribe n8n en cada corrida |
| El workflow en sí (nodos, credenciales, horario) | [n8n — PoC Solución de Monitoreo](https://n8n.srv836595.hstgr.cloud/workflow/wDgtcn0SkJFnqRNM) | Tú, para poner credenciales y activarlo |
| El log completo, histórico | Tabla `monitoreo_menciones` en el MySQL de Hostinger | Nadie a mano — la escribe `assets/api/monitoreo.php` |

## Por qué el log vive en dos sitios (MySQL y una hoja)

Pediste que el log viviera en el MySQL que ya usa el sitio, y también un
tablero. Looker Studio conecta nativamente y gratis a Google Sheets; conectar
Looker a un MySQL de hosting compartido normalmente exige activar «Remote
MySQL» en Hostinger y un conector de pago. Para no depender de eso, n8n
escribe cada fila clasificada en los dos sitios: MySQL es el registro
definitivo (el mismo criterio que ya usa `conectores/base-de-datos`), y la
hoja "Log Dashboard" es solo el espejo que alimenta el tablero. Si más
adelante activas Remote MySQL, el tablero puede apuntar directo a la tabla y
se deja de escribir la hoja.

## Alertas urgentes

Un lote dispara correo inmediato (aparte del resumen diario) si, en la
clasificación de Claude, cualquier fila resulta:

- **Sentimiento negativo crítico** (fraude, caída de servicio, denuncia, no
  una queja simple), o
- **Pico de volumen**: muchas más menciones que el promedio de los últimos
  días en poco tiempo (posible viralización), o
- Contiene una de las **palabras críticas** de la hoja de Config.

## Qué falta para que esto corra de verdad

El workflow y el endpoint ya están armados; lo que sigue es dar de alta las
credenciales, porque son cuentas de terceros que no puedo crear por ti:

1. **Apify**: crear cuenta en apify.com, tomar el API token, ponerlo como
   credencial en el nodo HTTP de cada fuente (X/Twitter, prensa, reseñas) en
   n8n. Actores sugeridos están anotados como sticky notes en el workflow.
2. **OpenAI y Gemini**: API key de cada uno, para los nodos GEO de ChatGPT y
   Gemini (Claude reutiliza la misma credencial que la clasificación de
   sentimiento).
3. **Secreto `MONITOREO_TOKEN`** en GitHub (Settings → Secrets and variables
   → Actions): cualquier cadena aleatoria larga. El próximo despliegue a
   `main` la deja activa en `assets/api/monitoreo.php`. El mismo valor va en
   la credencial HTTP Header Auth del nodo que llama a `monitoreo.php` en
   n8n.
4. **Activar el workflow** en n8n una vez estén las credenciales.

## Coste

Apify cobra por uso (tiene plan gratis limitado); OpenAI, Gemini y Anthropic
cobran por token consumido en cada corrida diaria. Con el volumen de una
marca (BCP) y quince prompts de GEO como mucho, el consumo diario es bajo,
pero no es cero como el resto de la automatización del sitio.
