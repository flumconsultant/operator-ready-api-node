# BCP GEO Monitor · Revisión UX v11

Alcance: shell, navegación, lectura, movimiento, perfil y entrada con ChatGPT. Se conservan los registros, contratos de n8n, CRUD y cálculos. Auditoría GEO está desactivada por solicitud del usuario.

## Dirección y referencias

Panel operativo de uso recurrente: contenido primero, jerarquía tipográfica con pesos 400/500, navegación por tarea, movimiento breve y valores estables. No se presenta «best in class» como una certificación.

Referencias públicas primarias consultadas el 20 de octubre de 2026 (documentación y muestras promocionales; no sesiones autenticadas de esos productos):

| Fuente | Patrón documentado | Decisión aplicada |
|---|---|---|
| [Linear · UI refresh, 12 marzo 2026](https://linear.app/changelog/2026-03-12-ui-refresh) | Consistencia de encabezados y controles; navegación con menor prominencia | Cabecera y sistema de lectura compartidos; menú secundario sobrio |
| [IBM Carbon · UI shell left panel](https://www.carbondesignsystem.com/building-blocks/core/components/ui-shell-left-panel/guidelines) | Grupos, submenús y jerarquía limitada | Accesos frecuentes, sección avanzada desplegable y gestión separada |
| [Material · Typography](https://m3.material.io/styles/typography/applying-type) | Roles de texto con jerarquía explícita | Escala de título, dato, etiqueta y texto auxiliar; pesos menos densos |
| [SBS · Directorio de bancos](https://www.sbs.gob.pe/supervisados-y-registros/empresas-supervisadas/directorio-del-sistema-financiero/empresas-bancarias) | Entidades del mercado peruano | Filtro de presentación de bancos; las respuestas literales no se alteran |

## Cobertura

P = prueba de código/DOM con respuestas controladas; E = comprobación estática; R = revisión del render. R permanece pendiente por el bloqueo del navegador del entorno.

| Pantalla o estado | Tarea y cambio | Implementado | Prueba | R amplio/estrecho |
|---|---|---|---|---|
| Login / anónimo | Marca BCP, explicación breve, botón nativo ChatGPT, destino seguro | Sí | P: Worker | Pendiente |
| Sesión / perfil / salir | Foto autorizada y nombre de Carlos; otras cuentas conservan su identidad real | Sí | P: Worker y DOM | Pendiente |
| Resumen | Tipografía ligera, tarjetas estables, alertas de auditoría ocultas | Sí | P/E | Pendiente |
| Consultas y drawer | Tabla coherente, respuesta literal intacta, foco atrapado y retorno al cerrar | Sí | P/E | Pendiente |
| Competencia | Solo bancos peruanos en los rankings visibles | Sí | P | Pendiente |
| Citas y fuentes | Jerarquía compartida de tablas, filtros, estados y paneles | Sí | P/E | Pendiente |
| Visibilidad | Gráfico estable, leyenda y controles consistentes | Sí | P/E | Pendiente |
| Perfil de marca | Mismo sistema de tablas, texto y detalle | Sí | P/E | Pendiente |
| Recomendaciones / detalle | Atribución IA y descripción de plantillas, reglas y revisión humana | Sí | P | Pendiente |
| Investigación | Formularios, controles y estados comunes | Sí | P/E; sin consumo real de APIs | Pendiente |
| Catálogo de prompts | CRUD, paginación, confirmaciones y errores conservados | Sí | P: backend simulado | Pendiente |
| Etiquetas | Tabla, campos y acciones compartidas | Sí | P/E | Pendiente |
| Tráfico de bots | En análisis avanzado, sin ocupar navegación principal | Sí | P/E | Pendiente |
| Configuración / proyectos | Proyectos como contexto global y gestión desde configuración | Sí | P | Pendiente |
| Detalle de proyecto (6 pestañas) | Sistema de lectura transversal, filtros y métricas conservados | Sí | P | Pendiente |
| Auditoría GEO y enlaces directos | Menú oculto, rutas redirigidas al resumen y ejecutores bloqueados en el front | Sí | P | No aplica: no se muestran |
| Móvil / menú | Menú lateral con botón y velo, Escape y foco de teclado; tablas desplazables | Sí | E; recorrido real pendiente | Pendiente |
| Movimiento reducido | Contenido siempre visible, sin conteos/tilt/glow; transiciones breves opcionales | Sí | E | Pendiente |

Contrastes medidos: texto secundario #5B6E89/blanco = 5,20:1; etiquetas #586C88/#EAF0F8 = 4,68:1; texto de menú #B9C9DF/#061F49 = 9,60:1; grupos #7992B3/#061F49 = 5,06:1; blanco/#002A8D = 12,24:1. Esto valida esas combinaciones; no certifica conformidad completa de la app.

## Acceso

El Worker verifica los encabezados de identidad suministrados por Sites. La pantalla BCP enlaza a `/signin-with-chatgpt` con navegación superior; Sites conserva OAuth, callback y cierre de sesión. No hay contraseña propia ni bandera local de autenticación. El acceso público del sitio se conserva; el tablero requiere una cuenta ChatGPT válida, sin crear una nueva lista de usuarios. Los endpoints externos de n8n conservan su configuración anterior; esta actualización no modifica sus permisos.

Pruebas del Worker: HTML de login para anónimos; recursos de datos y foto protegidos; identidad de propietario y otras cuentas; escapes de nombres; retornos internos; métodos HTTP y respuestas sin caché de sesión. La autenticación completa en el navegador no pudo recorrerse en este entorno.


## Corrección v12: grosor de los gráficos

Se retiran los ajustes tipográficos v11 de los componentes existentes para recuperar la cascada v10 (títulos, KPIs, tablas, formularios y cuerpo). Se conservan la navegación, el perfil, la atribución de IA y las mejoras funcionales v11.

Causa del defecto en el índice de visibilidad: la regla global de íconos `svg { stroke: currentColor; stroke-width: 1.65 }` se heredaba en los textos y cuadrantes del gráfico. Los SVG de datos ahora parten de `stroke: none`, los textos no tienen contorno y los trazos se declaran únicamente en líneas, rejillas y marcadores. Las series usan 1.6 px (2.2 px BCP); se eliminan sombras y se reducen los marcadores de líneas. No se modifican datos ni fórmulas.

Validación: revisión del CSS frente a la captura aportada por el usuario, compilación del Worker, validación del artefacto y pruebas de autenticación. La captura permite identificar el defecto; no se afirma una revisión visual del navegador en esta sesión.
