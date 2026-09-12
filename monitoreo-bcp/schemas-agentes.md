# Schemas de salida estructurada de los agentes

Cada uno se pega en el campo del nodo **Structured Output Parser**
correspondiente (nodo "Formato de salida (...)"), en n8n, si al abrirlo lo
ves vacío.

## Agente de Menciones (Apify)

```json
{
  "type": "object",
  "properties": {
    "sentimiento": {
      "type": "string",
      "enum": ["positivo", "neutro", "negativo", "negativo_critico"]
    },
    "categoria": { "type": "string" },
    "score": {
      "type": "number",
      "description": "0 a 1: que tan fuerte es el sentimiento"
    },
    "alerta_urgente": { "type": "boolean" },
    "motivo_alerta": { "type": "string" },
    "razonamiento": {
      "type": "string",
      "description": "una frase de por que, para que un humano pueda auditar la decision"
    }
  },
  "required": ["sentimiento", "categoria", "score", "alerta_urgente"]
}
```

## Agente GEO

```json
{
  "type": "object",
  "properties": {
    "sentimiento": {
      "type": "string",
      "enum": ["positivo", "neutro", "negativo", "negativo_critico"]
    },
    "menciona_marca": { "type": "boolean" },
    "postura": {
      "type": "string",
      "enum": ["favorable", "neutral", "desfavorable", "no_mencionada"]
    },
    "posicion_relativa": {
      "type": "string",
      "enum": [
        "recomendada_primero",
        "mencionada_entre_varias",
        "mencionada_al_final",
        "no_mencionada",
        "desaconsejada"
      ]
    },
    "competidores_mencionados": {
      "type": "array",
      "items": { "type": "string" }
    },
    "posible_informacion_incorrecta": { "type": "boolean" },
    "detalle_informacion_incorrecta": { "type": "string" },
    "cambio_vs_corrida_anterior": {
      "type": "string",
      "description": "que cambio respecto a la ultima vez que se corrio este mismo prompt+motor; si no hay corrida anterior, decir 'sin historial previo'"
    },
    "categoria": { "type": "string" },
    "alerta_urgente": { "type": "boolean" },
    "motivo_alerta": { "type": "string" },
    "razonamiento": { "type": "string" }
  },
  "required": ["sentimiento", "menciona_marca", "postura", "posicion_relativa", "alerta_urgente"]
}
```

## Agente de Triage y Reporte

```json
{
  "type": "object",
  "properties": {
    "esUrgente": { "type": "boolean" },
    "gravedad": {
      "type": "string",
      "enum": ["baja", "media", "alta", "critica"]
    },
    "motivos": {
      "type": "array",
      "items": { "type": "string" }
    },
    "resumenNarrativo": {
      "type": "string",
      "description": "HTML breve, 3 a 6 parrafos, para el correo de resumen diario"
    },
    "asuntoAlerta": {
      "type": "string",
      "description": "asunto de correo si hace falta alerta urgente"
    }
  },
  "required": ["esUrgente", "gravedad", "motivos", "resumenNarrativo"]
}
```
