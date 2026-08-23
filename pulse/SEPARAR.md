# ¿Repositorio aparte? Sí — y cómo hacerlo sin perder nada

Preguntaste si Pulse debe tener su propio git en vez de vivir dentro del
repositorio del sitio de BECOME. **Sí, y cuanto antes mejor**, por tres
motivos concretos:

1. **Se despliegan a sitios distintos.** El sitio va donde vaya hoy; Pulse va
   a un VPS. Dos productos en un repositorio significa que cada cambio del
   sitio dispara —o al menos hace pensar en— el despliegue de Pulse.
2. **El acceso no es el mismo.** El día que entre alguien a trabajar en Pulse,
   darle acceso al repositorio le da también el sitio corporativo. Y al revés.
3. **Pulse va a tener clientes.** Un producto que se vende necesita sus
   *issues*, sus *releases* y su historial sin mezclar.

Lo único que comparten es el **sistema de diseño** (`tokens/`), y eso está
resuelto: los tokens se vuelcan a un CSS generado que ya viaja dentro de
`pulse/`, así que el proyecto compila desde el primer minuto en el repositorio
nuevo.

**No hay prisa el mismo día.** Puedes desplegar primero desde esta rama
(`DESPLIEGUE.md` funciona igual) y separar después. Lo que no conviene es
separar a mano copiando archivos: se pierde la historia, y con ella el
`git log` que dice por qué está cada cosa como está.

---

## Cómo se hace

Hay un script que lo hace entero. Se ejecuta **en tu ordenador**, no en el VPS,
desde la raíz del repositorio del sitio:

```bash
cd operator-ready-api-node
git checkout claude/mvp-become-guidelines-ijxsdz
bash pulse/scripts/separar-repositorio.sh ../become-pulse
```

Qué hace:

- Reescribe la historia de `pulse/` como si esa carpeta hubiera sido siempre la
  raíz de un repositorio. **Los commits, los autores y las fechas se
  conservan**; lo que cambia son las rutas dentro de cada uno.
- Deja el resultado en `../become-pulse`, un repositorio nuevo con su `main`.
- Copia `tokens/` a la raíz del nuevo y regenera el CSS para demostrar que
  sigue funcionando ahí.
- Escribe un `.github/workflows/ci.yml` adaptado: el de este repositorio filtra
  por `pulse/**` y allí ya no existe esa carpeta.
- Ajusta las rutas de `README.md` y `DESPLIEGUE.md` para que los comandos se
  puedan copiar y pegar sin el prefijo `pulse/`.

Qué **no** hace: tocar este repositorio. No borra `pulse/`, no cambia ramas y
no empuja nada a ningún sitio. Si el resultado no te convence, borras la
carpeta y aquí no ha pasado nada.

Necesita el árbol limpio (sin cambios sin comitear); si no, se para y te lo
dice.

---

## Y después

El script termina imprimiendo estos pasos, porque son los que implican crear
cosas en GitHub y nadie debería hacerlos por ti:

**1. Crea el repositorio vacío** en <https://github.com/new>.

- Nombre: `become-pulse`.
- **Privado.**
- **Sin** README, sin `.gitignore`, sin licencia. Si lo creas con archivos, el
  primer push choca y hay que resolverlo a mano.

**2. Conéctalo y súbelo:**

```bash
cd ../become-pulse
git remote add origin git@github.com:TU-CUENTA/become-pulse.git
git push -u origin main
```

**3. Mira que el pipeline pase en verde** (pestaña *Actions* del repositorio
nuevo). Comprueba tipos, pruebas y build. Si pasa, el repositorio nuevo está
completo: no se quedó nada atrás.

**4. Solo entonces**, borra `pulse/` del repositorio del sitio, y hazlo en una
rama aparte para poder revisarlo antes de fusionar:

```bash
cd ../operator-ready-api-node
git checkout main
git checkout -b quitar-pulse
git rm -r pulse .github/workflows/pulse.yml
git commit -m "Pulse se muda a su propio repositorio"
git push -u origin quitar-pulse
```

Mientras no lo borres no pasa nada malo: el código está en dos sitios y ninguno
estorba al otro. Lo único que hay que evitar es seguir tocando el de aquí
después de haber empezado a trabajar en el nuevo.

---

## Lo que cambia en el día a día

| Antes | Después |
|---|---|
| `cd pulse/web && npm run dev` | `cd web && npm run dev` |
| `docker compose -f pulse/docker-compose.yml --env-file pulse/.env up -d` | `docker compose --env-file .env up -d` |
| `node pulse/scripts/sincronizar-tokens.mjs` | `node scripts/sincronizar-tokens.mjs` |
| Los secretos del VPS en el repositorio del sitio | Los secretos del VPS en el repositorio de Pulse |

**Si ya habías desplegado**, el VPS apunta al repositorio viejo. Después de
separar, en el servidor:

```bash
cd /opt/pulse
git remote set-url origin git@github.com:TU-CUENTA/become-pulse.git
git fetch origin main
git reset --hard origin/main
```

Y hay que volver a añadir la clave de despliegue del VPS en *Settings → Deploy
keys* del repositorio nuevo, y los cuatro secretos (`VPS_HOST`, `VPS_USER`,
`VPS_SSH_KEY`, `VPS_RUTA`) en sus *Actions secrets*. Son las mismas claves; lo
que cambia es dónde están declaradas.

Ojo con una cosa: el `.env` de producción vive en `/opt/pulse/pulse/.env` y
después de separar toca en `/opt/pulse/.env`. **Muévelo antes** de hacer el
`reset --hard`, o lo borras junto con la carpeta:

```bash
cp /opt/pulse/pulse/.env /opt/pulse/.env
```

---

## Los tokens, a partir de ahora

Quedan duplicados: `tokens/` está en los dos repositorios. Es deliberado, y es
la opción correcta mientras sean dos productos de la misma casa y no dos
equipos distintos: un paquete npm compartido para nueve archivos CSS es más
mantenimiento del que ahorra.

Cuando cambie un token de marca, se copia la carpeta y se regenera:

```bash
cp ../operator-ready-api-node/tokens/*.css tokens/
node scripts/sincronizar-tokens.mjs
git commit -am "Tokens al día con el sitio"
```

El CI avisa si alguien tocó `tokens/` y olvidó regenerar `tokens.css`: el
trabajo falla antes de desplegar una hoja de estilos que no corresponde con el
sistema de diseño.
