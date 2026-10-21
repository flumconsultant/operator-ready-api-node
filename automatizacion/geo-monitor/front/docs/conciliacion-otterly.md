# Conciliación con OtterlyAI (21-oct-2026)

Comparación del reporte «BCP» de OtterlyAI (16–20 oct, 50 prompts, ChatGPT · AI Overview · Perplexity · Copilot) con el GEO Monitor (21 oct, 150 prompts, solo Claude respondió).

## Los mismos 50 prompts

Los 50 prompts de Otterly están dentro de los 150 del monitor. Con esos 50 y las mismas 10 marcas:

| KPI de BCP | OtterlyAI | GEO Monitor (Claude) |
|---|---|---|
| Cobertura | 69% | 86% |
| Share of Voice | 25% | 22% |
| Posición | 1,30 | 1,40 |
| Sentimiento | +53 | +40 |
| Probabilidad de compra | 92,8% | 53% |

El ranking coincide: BCP #1, luego BBVA, Interbank y Scotiabank.

## Por qué el total del monitor sale más bajo

1. Prompts: los otros 100 (seguros, fondos mutuos, préstamos, tarjetas) no están en Otterly. Ahí BCP tiene 38% de cobertura y queda 4.º. Ese es el hallazgo nuevo del monitor.
2. Motores: Otterly mide las apps de ChatGPT, AI Overview, Perplexity y Copilot; el monitor solo pudo medir Claude por API (ChatGPT y Perplexity sin credencial, Gemini sin saldo). Claude nombra a los cuatro bancos grandes casi por igual, así que el Share of Voice queda repartido.
3. Búsqueda web: 127 de 150 respuestas de Claude salieron de memoria, sin fuentes. Desde la v14 Claude busca antes de responder (ajuste en Configuración).
4. Probabilidad de compra: Otterly usa un índice propio; el monitor cuenta las respuestas donde el Analista marca la marca como «recomendada». No son comparables en valor absoluto, sí en orden.
5. Definición de Share of Voice: desde la v14 es la de Otterly (una mención por respuesta y banco).

## Ajustes hechos en la captura

- Contexto país para todos los motores: «El usuario está en Lima, Perú» como línea de sistema (el prompt se envía tal cual).
- Claude busca en la web antes de responder.
- Dominios: los subdominios cuentan (abretucuenta.viabcp.com es BCP); BBVA incluye bbva.com; Falabella y Ripley usan bancofalabella.pe y bancoripley.com.pe (Otterly los tenía mal mapeados).
- Marca y competidores editables en Configuración. Para sumar Yape a BCP, agrégalo como otro nombre de la marca.

## Pendiente para igualar la medición

- Credenciales de ChatGPT y Perplexity, y saldo de Gemini.
- Copilot y AI Overview no tienen API equivalente; AI Overview se puede medir con SerpAPI (hoy apagado).
