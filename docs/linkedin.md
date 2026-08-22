# Anunciar el artículo diario en LinkedIn

El mecanismo está construido y probado. Lo que falta son cuatro datos que solo
puede conseguir quien administra la página de BECOME, porque LinkedIn los emite
a nombre de una persona.

**Nada de esto se pega en un chat ni se manda por correo.** Los cuatro valores
se escriben directamente como *secretos* del repositorio, en
`Settings → Secrets and variables → Actions → New repository secret`. Una clave
que pasa por una conversación es una clave que hay que rotar.

---

## 1. Crear la aplicación de LinkedIn

1. Entra en <https://www.linkedin.com/developers/apps> y pulsa **Create app**.
2. **App name**: `BECOME — publicación de artículos`.
3. **LinkedIn Page**: la página de empresa de BECOME. Es obligatorio y es lo que
   liga la aplicación con la página en la que va a publicar.
4. Sube el logo y acepta las condiciones.
5. En la pestaña **Settings**, pulsa **Verify** y sigue el enlace: confirma que
   la aplicación pertenece de verdad a esa página. Sin esa verificación no se
   puede pedir el permiso del paso siguiente.

## 2. Pedir el acceso — el paso lento

En la pestaña **Products**, solicita **Community Management API**.

Es lo que da el permiso `w_organization_social`, el único que deja publicar en
una **página de empresa**. No es autoservicio: LinkedIn revisa cada solicitud a
mano. Puede tardar días o semanas, y puede denegarla.

Cuando pregunten para qué es, la respuesta honesta funciona mejor que la
comercial: *publicar en la propia página de la empresa los artículos que la
empresa escribe en su sitio web, uno al día, sin acceder a datos de terceros.*

**Mientras no la aprueben, no pasa nada.** El mecanismo ya está montado y,
sin credenciales, cada despliegue lo ejecuta, dice «no hay nada que publicar» y
termina en verde. No se rompe nada esperando.

## 3. Conseguir los cuatro valores

### `LINKEDIN_CLIENT_ID` y `LINKEDIN_CLIENT_SECRET`

Están en la pestaña **Auth** de la aplicación, como *Client ID* y *Primary
Client Secret*.

No son imprescindibles para publicar: sirven para preguntarle a LinkedIn cuánto
le queda al permiso y avisar con dos semanas de antelación. Sin ellos todo
funciona, pero el día que caduque te enterarás por un fallo en vez de por un
aviso. Ponlos.

### `LINKEDIN_TOKEN`

El permiso propiamente dicho. La forma cómoda de obtenerlo es el **OAuth Token
Generator** de LinkedIn: en la aplicación, pestaña **Auth**, enlace *OAuth 2.0
tools*. Marca los alcances **`w_organization_social`** y **`r_organization_admin`**,
autoriza y copia el token que sale.

### `LINKEDIN_ORG_ID`

El número de la página de empresa. Dos formas:

- Abre la página como administrador. La dirección contiene
  `.../company/12345678/admin/` — ese número es.
- O pídeselo a la API con el token recién creado:

  ```
  GET https://api.linkedin.com/rest/organizationAcls?q=roleAssignee
      Authorization: Bearer <token>
      LinkedIn-Version: 202601
      X-Restli-Protocol-Version: 2.0.0
  ```

  Responde con `urn:li:organization:12345678`. El número final es el valor.

## 4. Probar sin publicar

Antes de dejarlo suelto sobre la página real:

```
node scripts/linkedin.mjs --ensayo
```

Hace todo el recorrido —elige el artículo, compone el texto, decide si toca— y
se detiene justo antes de publicar, enseñando exactamente lo que saldría. Un
post de prueba en una página real no se puede deshacer sin que alguien lo haya
visto; por eso existe este modo.

Cuando el ensayo enseñe lo que esperas, lanza el workflow **Anunciar en
LinkedIn** a mano desde la pestaña *Actions*. A partir de ahí va solo, después
de cada despliegue con éxito.

---

## Lo que hay que hacer cada dos meses

**El permiso caduca a los 60 días.** LinkedIn solo permite renovarlo
automáticamente a los socios aprobados de su programa de marketing; para el
resto hay que volver a autorizar la aplicación a mano.

Es la parte frágil de todo esto y no tiene arreglo por código. Lo que sí hay es
aviso: catorce días antes, cada ejecución escribe una advertencia en el resumen
del workflow. Cuando la veas, repite el paso `LINKEDIN_TOKEN` del apartado 3 y
actualiza ese secreto. Nada más.

Si se pasa la fecha, el post falla con un `401` y el workflow se pone en rojo,
así que el correo de GitHub llega igual. El artículo no se pierde: sigue
publicado en la web, en el sitemap y en los feeds. Lo único que falta ese día es
el aviso en LinkedIn.

## Cuándo subir la versión de la API

`scripts/linkedin.mjs` fija `LINKEDIN_VERSION` en un mes concreto. LinkedIn saca
una versión nueva cada mes y mantiene cada una **un año como mínimo**, así que
no corre prisa; pero si algún día la llamada empieza a fallar quejándose de la
versión, se sube ese valor al mes actual y listo.

No se calcula sola a propósito: «la versión de este mes» sería una versión que
puede no existir todavía el día 1, y entonces el mecanismo se rompería solo, una
vez al mes, sin que nadie hubiera tocado nada.
