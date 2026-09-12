# Schemas de salida estructurada de los agentes

Cada uno se pega en el campo del nodo **Structured Output Parser**
correspondiente (nodo "Formato de salida (...)"), en n8n, si al abrirlo lo
ves vacío.

## Agente Clasificador de Reputación

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
    "menciona_marca": { "type": "boolean" },
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
