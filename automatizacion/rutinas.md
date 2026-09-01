# Las dos rutinas: qué pegar en el formulario

Las rutinas se crean en **claude.ai/code/routines**, no desde código. Este
archivo existe para que el texto de cada una esté versionado junto al resto del
sistema: si algún día hay que rehacerlas, se copia de aquí en vez de
reconstruirlas de memoria.

Por qué el formulario y no un disparador creado por programa: una rutina tiene
un campo de **repositorios**, y la sesión que arranca clona lo que ahí se diga.
Un disparador creado desde una sesión no lo tiene, así que la sesión nace sin
los archivos y trabaja a ciegas. Esto costó dos ejecuciones fallidas en silencio
antes de encontrarse, y por eso los dos encargos empiezan comprobando que el
repositorio está delante.

En las dos: repositorio `flumconsultant/operator-ready-api-node`, entorno el que
salga por defecto, y sin conectores (ninguna de las dos los necesita, y cuantos
menos haya, menos puede tocar una ejecución automática).

---

## 1. Observatorio de posicionamiento BECOME

**Frecuencia:** semanal, domingos, sobre las 5 de la mañana.

```
Encargo semanal: el observatorio.

Antes de nada, comprueba que tienes el repositorio: `ls automatizacion/` tiene
que listar observatorio.md y redaccion.md. Si no está, para y dilo. No trabajes
a ciegas.

Sincroniza, porque desde la última vez han entrado artículos nuevos:
  git checkout main && git pull origin main

Lee `automatizacion/observatorio.md` y haz exactamente lo que dice. Está escrito
para ti y contiene el encargo completo.

Cuando tengas el informe escrito en `automatizacion/informes/`:

1. `git status` — comprueba que solo has tocado archivos dentro de
   `automatizacion/`: el informe nuevo, `seguimiento.md` y, si hubo que rellenar
   la cola, `preguntas.md`. Si hay algo más, deshazlo: este trabajo mide, no
   cambia el sitio.
2. git add automatizacion/
   git -c user.name='Observatorio BECOME' -c user.email='hello@meetbecome.com' commit -m "Observatorio: informe del <fecha de hoy AAAA-MM-DD>"
   git push origin HEAD:main
3. Si el push a main se rechaza, publica en la rama alternativa, que también
   despliega: `git push origin HEAD:refs/heads/claude/insights-diario`. Dilo en
   la respuesta si tienes que usarla.
4. Si el push falla por red, reintenta cuatro veces esperando 2s, 4s, 8s y 16s.

Deja la cola con al menos siete huecos, uno por día de la semana que viene. Si
`preguntas.md` no da para tantos, `observatorio.md` te dice qué hacer: rellenarla
tú hasta quince y decir en el informe qué añadiste. No entregues un informe con
la cola corta sin haberla rellenado; eso es lo que dejó el 1 de septiembre sin
artículo.

No abras pull requests. No toques páginas, componentes ni artículos. Termina en
dos líneas: cuántas preguntas quedan sin cubrir según `node scripts/qa-cola.mjs`
y cuál es el primer hueco.
```

---

## 2. Artículo diario de BECOME

**Frecuencia:** diaria, sobre las 6 de la mañana. Ponla siempre **después** del
observatorio, no antes: el redactor consume la cola que el observatorio llena.

```
Encargo de hoy: el artículo diario.

Antes de nada, comprueba que tienes el repositorio: `ls automatizacion/` tiene
que listar redaccion.md. Si no está, para y dilo. No trabajes a ciegas.

Sincroniza, porque ayer se publicó otro artículo:
  git checkout main && git pull origin main

Lee `automatizacion/redaccion.md` entero antes de escribir una palabra.
Contiene el encargo, la voz con la que tienes que escribir y las reglas que no
puedes saltarte.

Contexto que importa: lo que publiques sale en la web sin que nadie lo lea
antes, firmado por una persona real. No hay red
debajo.

Cuando tengas el artículo guardado como un JSON nuevo en `src/content/insights/`:

1. node scripts/validar-articulo.mjs src/content/insights/<tu-archivo>.json
2. Si señala fallos, corrígelos y vuelve a pasarlo hasta que salga limpio.
3. Si tras tres intentos sigue sin pasar, pon `estado` en `"borrador"` y déjalo
   así: espera en el panel a que alguien lo mire, y eso siempre es mejor que
   publicar algo que no cumple.
4. npx vite build — comprueba que el sitio sigue compilando.
5. `git status` — comprueba que solo has añadido tu archivo nuevo dentro de
   `src/content/insights/`. Si hay algo más, deshazlo.
6. git add src/content/insights/
   git -c user.name='BECOME' -c user.email='hello@meetbecome.com' commit -m "Insights: <título del artículo en español>"
   git push origin HEAD:main
7. Si el push a main se rechaza, publica en `claude/insights-diario`, que
   también despliega: `git push origin HEAD:refs/heads/claude/insights-diario`.
   Dilo en la respuesta si tienes que usarla.
8. Si el push falla por red, reintenta cuatro veces esperando 2s, 4s, 8s y 16s.

El push despliega el sitio solo.

No abras pull requests. No toques páginas, componentes, estilos ni
configuración. No repitas un tema ya cubierto en `src/content/insights/`. Si hoy
no hay ningún hueco que merezca un artículo, no publiques relleno:
`automatizacion/redaccion.md` dice qué hacer en ese caso.

Termina en dos líneas: qué publicaste y en qué dirección quedó. Y si hoy no
había hueco y no publicaste, dilo con esas palabras: es un resultado válido, pero
tiene que quedar dicho. Una ejecución en verde que no produce nada y no explica
por qué es indistinguible de una que se rompió.
```

---

## Cómo saber si funcionó

En la lista de ejecuciones, **el verde no significa que el trabajo saliera
bien**: significa que la sesión arrancó y terminó sin error de infraestructura.
Una ejecución que no encontró el repositorio y pasó cuatro minutos dando vueltas
también sale verde.

Lo que sí lo dice, sin abrir nada:

- El observatorio funcionó si hay un archivo nuevo en `automatizacion/informes/`
- El redactor funcionó si hay un archivo nuevo en `src/content/insights/` y el
  artículo se ve en meetbecome.com/es/insights

Y hay un tercer caso, el que costó el 1 de septiembre de 2026: **el redactor
puede hacer su trabajo bien y no publicar nada**, porque no quedaba ninguna
pregunta sin cubrir. Se ve así, sin abrir la ejecución:

```
node scripts/qa-cola.mjs
```

Dice cuántas preguntas de `preguntas.md` siguen sin artículo. Si son menos de
siete, el redactor se va a quedar sin nada delante dentro de esa semana. El
centinela lo comprueba solo cada día y se pone en rojo por debajo de tres, así
que no hace falta acordarse: hace falta hacerle caso cuando avise.
