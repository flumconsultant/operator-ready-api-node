import React from 'react';
import * as api from './api.js';
import { Etiqueta, Texto, Area, Boton, Fila, Aviso, marco } from './piezas.jsx';

/**
 * Fichas de autor.
 *
 * La foto no se pega como enlace a una imagen de otro sitio: se sube y vive en
 * el repositorio, junto al resto de imágenes del sitio. Un avatar enlazado a un
 * servicio ajeno desaparece el día que ese servicio cambia la URL, y lo hace en
 * silencio, en todos los artículos a la vez.
 *
 * El servidor comprueba que lo subido SEA una imagen leyendo sus bytes, no
 * fiándose de la extensión. Aquí solo se recorta el tamaño antes de enviar,
 * para no mandar cuatro megas de una foto que se va a ver a 44 píxeles.
 */

const NUEVA = () => ({ id: '', nombre: '', foto: '', fotoOriginal: '', linkedin: '', predeterminado: false, equipo: false, orden: '', es: { rol: '', bio: '', credencial: '' }, en: { rol: '', bio: '', credencial: '' } });

const aId = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);

/**
 * Reduce la foto a 800px de lado antes de subirla.
 *
 * Eran 400, que bastaban cuando la foto solo salía a 44 píxeles en la firma de
 * un artículo. Desde que el mismo archivo es el retrato de Nosotros —cerca de
 * 400 px de lado en una pantalla grande— 400 se queda corto: en una pantalla de
 * alta densidad se ve blando, y una foto blanda en la página de equipo se lee
 * como descuido.
 *
 * 800 sigue siendo unas veinte veces menos que el archivo de una cámara. Quien
 * subió su foto antes de este cambio la tiene a 400: se arregla pulsando
 * «Recolocar» y guardando, que recorta otra vez desde el original de 1200.
 */
const LADO = 800;

/** Carga el archivo elegido como una imagen ya medida. */
function cargarImagen(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Ese archivo no es una imagen que el navegador sepa abrir.'));
      img.onload = () => resolve(img);
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

/**
 * Recorta la imagen a un cuadrado, según el encuadre que elija quien sube.
 *
 * `x` e `y` van de 0 a 1 y dicen dónde cae la ventana de recorte dentro de la
 * imagen; `zoom` la encoge. La misma función pinta la vista previa y el archivo
 * final, así que lo que se ve es exactamente lo que se guarda.
 */
/**
 * Iguala la exposición del recorte.
 *
 * ---- Por qué hace falta ----
 *
 * Las fotos de un equipo pequeño no vienen de la misma sesión: una con fondo
 * navy de estudio, otra con fondo gris claro. El tratamiento de la web las
 * lleva al mismo tono, pero no a la misma luminosidad, y puestas en fila se
 * leían como dos encendidas y una apagada. Medido en la página: 29, 84 y 75.
 *
 * No se arregla con más filtro. Brillo y multiply son operaciones
 * multiplicativas, así que conservan la proporción entre una foto clara y una
 * oscura: bajar las claras baja también la oscura. Hay que corregir el archivo,
 * y una sola vez, al guardarlo.
 *
 * ---- Cómo ----
 *
 * Una curva de gamma que lleva la media de la imagen a un objetivo común.
 * Gamma y no sumar brillo: sumar desplaza todo y aplasta blancos y negros
 * contra los topes; la gamma respeta los extremos y mueve los medios, que es
 * donde está la cara.
 *
 * El ajuste está limitado a propósito. Sin tope, un retrato a contraluz o uno
 * sobre fondo negro se convertiría en otra fotografía distinta, y esto es
 * corregir una diferencia de estudio, no reinterpretar el retrato de nadie.
 */
const EXPOSICION_OBJETIVO = 128;
const GAMMA_MIN = 0.55;
const GAMMA_MAX = 1.9;

function igualarExposicion(lienzo) {
  const ctx = lienzo.getContext('2d', { willReadFrequently: true });
  let datos;
  try {
    datos = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
  } catch {
    /* Un lienzo contaminado por una imagen de otro dominio no se puede leer.
       No es motivo para perder la foto: se guarda sin igualar. */
    return lienzo;
  }
  const px = datos.data;
  let suma = 0;
  for (let i = 0; i < px.length; i += 4) {
    suma += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
  }
  const media = suma / (px.length / 4);
  if (media < 4 || media > 251) return lienzo;

  let gamma = Math.log(EXPOSICION_OBJETIVO / 255) / Math.log(media / 255);
  gamma = Math.min(GAMMA_MAX, Math.max(GAMMA_MIN, gamma));
  if (Math.abs(gamma - 1) < 0.03) return lienzo;

  /* Tabla de 256 entradas en vez de una potencia por canal y por píxel: en una
     imagen de 800x800 son 1,9 millones de llamadas a Math.pow, y se nota. */
  const tabla = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v += 1) tabla[v] = Math.round(255 * (v / 255) ** gamma);
  for (let i = 0; i < px.length; i += 4) {
    px[i] = tabla[px[i]];
    px[i + 1] = tabla[px[i + 1]];
    px[i + 2] = tabla[px[i + 2]];
  }
  ctx.putImageData(datos, 0, 0);
  return lienzo;
}

function recortar(img, { x, y, zoom }, lado) {
  const corte = Math.min(img.width, img.height) / zoom;
  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = lado;
  lienzo.getContext('2d').drawImage(
    img,
    (img.width - corte) * x, (img.height - corte) * y, corte, corte,
    0, 0, lado, lado,
  );
  return lienzo;
}

/* El recorte que se publica va igualado; el original NO. El original existe
   para poder reencuadrar más tarde, y corregirlo también significaría aplicar
   la curva dos veces la próxima vez que se recorte desde él. */
const recorteFinal = (img, enc, lado) => igualarExposicion(recortar(img, enc, lado));

/**
 * El original, reducido a 1200 px de lado mayor.
 *
 * Se guarda junto al recorte para que «Recolocar» tenga de dónde recortar. Sin
 * él solo queda el cuadrado de 400 px ya recortado: mover el encuadre ahí no
 * puede hacer nada, porque no sobra ni un píxel por ningún lado.
 *
 * 1200 y no el archivo tal cual: una foto de móvil moderna pesa varios megas y
 * acabaría en el repositorio para siempre, a cambio de un detalle que a 44 px
 * no se ve.
 */
function original(img) {
  const MAYOR = 1200;
  const escala = Math.min(1, MAYOR / Math.max(img.width, img.height));
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.round(img.width * escala);
  lienzo.height = Math.round(img.height * escala);
  lienzo.getContext('2d').drawImage(img, 0, 0, lienzo.width, lienzo.height);
  return lienzo.toDataURL('image/webp', 0.86);
}

/**
 * Encuadre por defecto.
 *
 * Centrar por el medio geométrico es lo que hacía antes y es exactamente lo que
 * estropea un retrato: en una foto vertical la cara está en el tercio de
 * arriba, así que el centro de la imagen cae en el pecho y el círculo de la
 * firma sale sin cabeza. En vertical se sube el recorte; en horizontal o
 * cuadrada el centro sí es el sitio.
 */
const encuadreInicial = (img) => ({
  x: 0.5,
  /* Cerca del borde de arriba, no a un tercio: en una foto vertical la ventana
     de recorte es tan alta como ancha, así que basta con arrimarla arriba para
     que la cabeza caiga en el centro del círculo. Con un tercio del margen se
     corrige de más y la cara sale pegada al borde superior. */
  y: img.height > img.width * 1.1 ? 0.1 : 0.5,
  zoom: 1,
});

/**
 * Ajustar el encuadre antes de subir.
 *
 * Dos deslizadores y no arrastrar con el ratón: un deslizador funciona con el
 * teclado sin que haya que programar nada, y arrastrar exige por norma una
 * alternativa que no dependa del puntero. Aquí no compensaba escribir las dos.
 */
function Encuadre({ img, alConfirmar, alCancelar, ocupado, sinOriginal }) {
  const [enc, setEnc] = React.useState(() => encuadreInicial(img));
  const lienzo = React.useRef(null);
  const PREVIA = 220;

  React.useEffect(() => {
    const destino = lienzo.current;
    if (!destino) return;
    const ctx = destino.getContext('2d');
    ctx.clearRect(0, 0, PREVIA, PREVIA);
    ctx.save();
    /* El círculo de verdad, no un cuadrado con las esquinas insinuadas: la
       firma lo pinta redondo, y hay que ver lo que se va a ver. */
    ctx.beginPath();
    ctx.arc(PREVIA / 2, PREVIA / 2, PREVIA / 2, 0, Math.PI * 2);
    ctx.clip();
    /* La vista previa lleva la misma corrección de exposición que el archivo
       que se guarda. Sin ella, lo que se ve al encuadrar y lo que acaba en la
       web serían dos imágenes distintas, y la primera vez que alguien lo note
       será porque la foto publicada no es la que eligió. */
    ctx.drawImage(recorteFinal(img, enc, PREVIA), 0, 0);
    ctx.restore();
  }, [img, enc]);

  const pon = (k) => (e) => setEnc({ ...enc, [k]: Number(e.target.value) });

  /* Arrastrar la foto dentro del círculo.
   *
   * Es un añadido, no el único camino: los deslizadores siguen ahí y hacen lo
   * mismo con el teclado. Una interacción que solo exista arrastrando deja
   * fuera a quien no usa ratón, y la norma pide ofrecer siempre la
   * alternativa.
   *
   * La cuenta: un píxel movido en la vista previa son `corte / PREVIA` píxeles
   * de la imagen original. Y el signo se invierte, porque mover la foto hacia
   * la derecha es mover la ventana de recorte hacia la izquierda. */
  const arrastre = React.useRef(null);

  const empezar = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    arrastre.current = { px: e.clientX, py: e.clientY, enc };
  };

  const mover = (e) => {
    const a = arrastre.current;
    if (!a) return;
    const corte = Math.min(img.width, img.height) / a.enc.zoom;
    const escala = corte / PREVIA;
    const holguraX = img.width - corte;
    const holguraY = img.height - corte;
    /* Sin holgura no hay nada que mover en ese eje: dividir daría infinito y
       el encuadre saltaría al borde a la primera. */
    const limita = (v) => Math.min(1, Math.max(0, v));
    setEnc({
      ...a.enc,
      x: holguraX > 0 ? limita(a.enc.x - ((e.clientX - a.px) * escala) / holguraX) : a.enc.x,
      y: holguraY > 0 ? limita(a.enc.y - ((e.clientY - a.py) * escala) / holguraY) : a.enc.y,
    });
  };

  const soltar = () => { arrastre.current = null; };

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <canvas
        ref={lienzo}
        width={PREVIA}
        height={PREVIA}
        onPointerDown={empezar}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        style={{
          width: PREVIA, height: PREVIA, display: 'block',
          cursor: 'grab',
          /* Sin esto, arrastrar con el dedo desplaza la página en vez de
             mover la foto. */
          touchAction: 'none',
          userSelect: 'none',
        }}
      />
      <p style={{ margin: '-4px 0 0', font: 'var(--type-body)', fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', maxWidth: PREVIA }}>
        Arrastra la foto para colocarla, o usa los deslizadores.
        {sinOriginal && (
          <> Esta foto se subió antes de que se guardara el original, así que
          solo puedes acercarla. Súbela otra vez para poder recolocarla entera.</>
        )}
      </p>

      <div style={{ width: '100%', maxWidth: PREVIA, display: 'grid', gap: 10 }}>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, color: 'var(--text-faint)' }}>
            Arriba / abajo
          </span>
          <input type="range" min="0" max="1" step="0.01" value={enc.y} onChange={pon('y')} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </label>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, color: 'var(--text-faint)' }}>
            Acercar
          </span>
          <input type="range" min="1" max="2.5" step="0.01" value={enc.zoom} onChange={pon('zoom')} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </label>
        {/* Solo tiene sentido moverse en horizontal si se ha acercado: sin
            zoom, en una foto vertical la ventana ya ocupa todo el ancho. */}
        {(enc.zoom > 1 || img.width > img.height) && (
          <label style={{ display: 'grid', gap: 4 }}>
            <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase', fontSize: 11, color: 'var(--text-faint)' }}>
              Izquierda / derecha
            </span>
            <input type="range" min="0" max="1" step="0.01" value={enc.x} onChange={pon('x')} style={{ width: '100%', accentColor: 'var(--accent)' }} />
          </label>
        )}
      </div>

      <Fila gap={8}>
        <Boton variante="quieto" onClick={alCancelar} disabled={ocupado}>Cancelar</Boton>
        <Boton variante="fuerte" onClick={() => alConfirmar(recorteFinal(img, enc, LADO).toDataURL('image/webp', 0.9))} disabled={ocupado}>
          {ocupado ? 'Subiendo…' : 'Usar esta foto'}
        </Boton>
      </Fila>
    </div>
  );
}

function Ficha({ entrada, alGuardar, alCerrar }) {
  const [f, setF] = React.useState(entrada.ficha || NUEVA());
  /* La imagen tal y como se acaba de recortar, en memoria.
     Hace falta porque la ruta pública de la foto NO existe todavía: el panel
     escribe el archivo en el repositorio y hasta que el despliegue no termina
     —dos o tres minutos— esa dirección devuelve 404. El panel enseñaba esa
     dirección al instante, así que justo después de subir una foto salía el
     icono de imagen rota. La foto estaba bien; lo que estaba mal era enseñar
     una dirección que aún no existe. */
  const [recienSubida, setRecienSubida] = React.useState(null);
  const [fotoRota, setFotoRota] = React.useState(false);
  /* El original de la subida recién hecha. Sin esto, «Recolocar» justo después
     de subir intentaba abrir una dirección que todavía no existe y respondía
     «No se pudo abrir la foto guardada»: un mensaje que suena a archivo
     corrupto cuando lo único que pasa es que aún no se ha publicado. */
  const [originalReciente, setOriginalReciente] = React.useState(null);
  const [error, setError] = React.useState('');
  const [subiendo, setSubiendo] = React.useState(false);
  const [guardando, setGuardando] = React.useState(false);
  const [nota, setNota] = React.useState('');
  /* La imagen elegida esperando encuadre. null = no hay ninguna en curso. */
  const [porEncuadrar, setPorEncuadrar] = React.useState(null);
  const [sinOriginal, setSinOriginal] = React.useState(false);
  const campo = React.useRef(null);

  const pon = (k, v) => setF({ ...f, [k]: v });
  const ponLang = (l, k, v) => setF({ ...f, [l]: { ...f[l], [k]: v } });

  const ponNombre = (v) => {
    /* El identificador se deriva del nombre solo mientras la ficha es nueva:
       cambiarlo después renombraría el archivo y dejaría la foto huérfana. */
    const siguiente = { ...f, nombre: v };
    if (!entrada.sha) siguiente.id = aId(v);
    setF(siguiente);
  };

  /* Elegir el archivo ya no sube nada: abre el encuadre. Antes se subía en el
     acto con un recorte adivinado, y el resultado solo se veía cuando ya estaba
     publicado en la web. */
  const elegirFoto = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!f.id) { setError('Escribe primero el nombre: la foto se guarda con su identificador.'); return; }
    setError('');
    try {
      setSinOriginal(false);
      setPorEncuadrar(await cargarImagen(archivo));
    } catch (err) { setError(err.message); }
    finally { campo.current.value = ''; }
  };

  /* Reencuadrar lo que ya está guardado, sin volver a buscar el archivo.
     Trabaja sobre la copia de 400px que hay en el repositorio, no sobre el
     original: se puede recolocar y acercar dentro de lo que se guardó, pero lo
     que se recortó la primera vez no vuelve. Por eso el aviso de abajo manda
     subir el archivo original cuando el reencuadre es grande. */
  const reencuadrar = async () => {
    setError('');
    /* Del original si existe; si no, del recorte, y entonces la pantalla lo
       dice, porque desde un cuadrado ya recortado solo se puede acercar. */
    const fuente = originalReciente || recienSubida || f.fotoOriginal || f.foto;
    try {
      const img = new Image();
      img.src = fuente;
      await img.decode();
      setSinOriginal(!(originalReciente || f.fotoOriginal));
      setPorEncuadrar(img);
    } catch {
      setError(f.foto
        ? 'La foto todavía se está publicando y aún no se puede abrir desde aquí. Espera dos o tres minutos, o vuelve a subir el archivo.'
        : 'No se pudo abrir la foto guardada. Sube el archivo otra vez.');
    }
  };

  const confirmarFoto = async (datos) => {
    setSubiendo(true); setError('');
    try {
      const { foto } = await api.subirFoto({ id: f.id, datos });
      /* El original se sube solo cuando la imagen viene de un archivo recién
         elegido, que es lo que distingue una data URL de una ruta del sitio.
         Al recolocar, la fuente ya es el original guardado: volver a subirlo
         sería recomprimir una copia, y cada vuelta perdería nitidez. */
      let fotoOriginal = f.fotoOriginal;
      let originalEnMemoria = originalReciente;
      if (porEncuadrar?.src.startsWith('data:')) {
        originalEnMemoria = original(porEncuadrar);
        const r = await api.subirFoto({ id: f.id, variante: 'original', datos: originalEnMemoria });
        fotoOriginal = r.foto;
      }
      const siguiente = { ...f, foto, fotoOriginal };
      setF(siguiente);
      setRecienSubida(datos);
      setOriginalReciente(originalEnMemoria);
      setFotoRota(false);
      setPorEncuadrar(null);

      /* Y se guarda la ficha en el acto. Antes no: la foto se subía al
         repositorio pero el campo `foto` solo se escribía al pulsar Guardar,
         así que quien subía la foto y cerraba dejaba el archivo dentro y la
         ficha sin él. La foto existía y no se veía en ningún sitio, que es la
         peor de las dos mitades. Subir una foto ES el cambio; no hay un
         segundo paso que tenga sentido pedir. */
      const r = await api.guardarAutor({ ficha: siguiente, sha: entrada.sha });
      entrada.sha = r.sha;
      setNota('Foto guardada. Tarda dos o tres minutos en verse en la web, mientras se publica el sitio.');
      setTimeout(() => setNota(''), 3000);
    } catch (err) { setError(err.message); }
    finally { setSubiendo(false); }
  };

  const guardar = async () => {
    setGuardando(true); setError('');
    try {
      await api.guardarAutor({ ficha: f, sha: entrada.sha });
      alGuardar();
    } catch (err) { setError(err.message); }
    finally { setGuardando(false); }
  };

  const falta = !f.nombre || !f.id;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Fila style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-heading)' }}>
          {entrada.sha ? f.nombre : 'Ficha nueva'}
        </h2>
        <Fila gap={8}>
          {/* Mientras hay un encuadre abierto, «Volver» avisa y «Guardar» está
              apagado.
              La trampa era esta: se elige el archivo, aparece el encuadre, y
              pulsar el Guardar de arriba por costumbre guardaba la ficha SIN la
              foto y sin decir nada. La foto elegida se perdía en silencio y la
              ficha quedaba igual que antes, así que ni siquiera había forma de
              notar que había pasado algo. */}
          <Boton
            variante="quieto"
            onClick={() => {
              if (porEncuadrar && !window.confirm('Estás encuadrando una foto que aún no se ha subido. Si vuelves ahora, se pierde. ¿Volver de todas formas?')) return;
              alCerrar();
            }}
          >
            Volver
          </Boton>
          <Boton variante="fuerte" onClick={guardar} disabled={falta || guardando || subiendo || !!porEncuadrar}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </Boton>
        </Fila>
      </Fila>

      {porEncuadrar && (
        /* Un botón apagado sin explicación es un callejón sin salida: quien lo
           pulsa y no pasa nada no tiene forma de saber qué le falta. */
        <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 13, color: 'var(--text-muted)' }}>
          Termina de encuadrar la foto —«Usar esta foto» o «Cancelar»— para poder guardar la ficha.
        </p>
      )}

      <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16, display: 'grid', gap: 12 }}>
        <Fila gap={16} style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 'none', textAlign: 'center' }}>
            {porEncuadrar ? (
              <Encuadre
                img={porEncuadrar}
                ocupado={subiendo}
                sinOriginal={sinOriginal}
                alConfirmar={confirmarFoto}
                alCancelar={() => setPorEncuadrar(null)}
              />
            ) : (
            <>
            {(recienSubida || (f.foto && !fotoRota))
              ? (
                <img
                  src={recienSubida || f.foto}
                  alt=""
                  width={96}
                  height={96}
                  /* Si la ruta pública todavía no existe, no se deja el icono
                     de imagen rota: se cambia por un aviso que dice qué pasa. */
                  onError={() => setFotoRota(true)}
                  style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
              )
              : (
                <div style={{ width: 96, height: 96, borderRadius: '50%', border: '1px dashed var(--border-hairline)', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 8, font: 'var(--type-mono)', fontSize: 10, lineHeight: 1.3, color: 'var(--text-faint)' }}>
                  {f.foto ? 'publicándose' : 'sin foto'}
                </div>
              )}
            <input ref={campo} type="file" accept="image/webp,image/jpeg,image/png" onChange={elegirFoto} style={{ display: 'none' }} id="foto" />
            <label htmlFor="foto" style={{ display: 'inline-block', marginTop: 8, cursor: 'pointer' }}>
              <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-accent)', textDecoration: 'underline' }}>
                {f.foto ? 'Subir otra' : 'Subir foto'}
              </span>
            </label>
            {f.foto && (
              <>
                <span aria-hidden="true" style={{ color: 'var(--text-faint)', margin: '0 6px' }}>·</span>
                <button
                  type="button"
                  onClick={reencuadrar}
                  style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-accent)', textDecoration: 'underline' }}
                >
                  Recolocar
                </button>
              </>
            )}
            </>
            )}
          </div>

          <div style={{ flex: 1, display: 'grid', gap: 12, minWidth: 0 }}>
            <div>
              <Etiqueta pista="tal como firma los artículos">Nombre</Etiqueta>
              <Texto valor={f.nombre} alCambiar={ponNombre} />
            </div>
            <div>
              <Etiqueta pista="conecta la firma con una trayectoria pública; lo leen Google y los asistentes">LinkedIn</Etiqueta>
              <Texto valor={f.linkedin} alCambiar={(v) => pon('linkedin', v)} placeholder="https://www.linkedin.com/in/..." />
            </div>
            {/* Es la única casilla de esta pantalla que cambia algo fuera de
                ella: decide con qué nombre firma el artículo que se escribe y
                se publica solo cada mañana. */}
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!f.predeterminado}
                onChange={(e) => pon('predeterminado', e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 2, flex: 'none', accentColor: 'var(--accent)' }}
              />
              <span>
                <span style={{ display: 'block', font: 'var(--type-body)', fontSize: 14, color: 'var(--text-heading)' }}>
                  Firma los artículos automáticos
                </span>
                <span style={{ display: 'block', font: 'var(--type-body)', fontSize: 13, color: 'var(--text-muted)' }}>
                  El artículo que se escribe y publica solo cada mañana saldrá con este nombre.
                  Solo una ficha puede tenerlo marcado.
                </span>
              </span>
            </label>

            {/* Aparecer en Nosotros y firmar artículos son dos cosas distintas:
                puede haber quien escriba sin salir en la página, y quien salga
                en la página sin escribir nunca. Por eso es otra casilla. */}
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!f.equipo}
                onChange={(e) => pon('equipo', e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 2, flex: 'none', accentColor: 'var(--accent)' }}
              />
              <span>
                <span style={{ display: 'block', font: 'var(--type-body)', fontSize: 14, color: 'var(--text-heading)' }}>
                  Sale en la página Nosotros
                </span>
                <span style={{ display: 'block', font: 'var(--type-body)', fontSize: 13, color: 'var(--text-muted)' }}>
                  Con su foto, su cargo, su descripción y su LinkedIn, en español y en inglés.
                </span>
              </span>
            </label>

            {f.equipo && (
              <div style={{ display: 'grid', gap: 6, maxWidth: 220 }}>
                <Etiqueta pista="Menor primero. Sin número, va al final.">Orden en la página</Etiqueta>
                <Texto
                  valor={f.orden === 0 || f.orden ? String(f.orden) : ''}
                  /* Se guarda como número o como vacío, nunca como la cadena
                     «2»: al ordenar, una cadena se compara letra a letra y
                     «10» acabaría delante de «9». */
                  alCambiar={(v) => pon('orden', v.trim() === '' ? '' : Number(v.replace(/[^0-9]/g, '')) || '')}
                  inputMode="numeric"
                  placeholder="1, 2, 3…"
                />
              </div>
            )}
          </div>
        </Fila>

        {['es', 'en'].map((l) => (
          <div key={l} style={{ display: 'grid', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border-hairline)' }}>
            <Etiqueta>{l === 'es' ? 'Español' : 'Inglés'}</Etiqueta>
            <Texto
              valor={f[l]?.rol}
              alCambiar={(v) => ponLang(l, 'rol', v)}
              placeholder={l === 'es' ? 'Cargo (opcional). Sale junto a la fecha en cada artículo' : 'Role (optional). Appears next to the date on every article'}
            />
            <Area
              valor={f[l]?.bio}
              alCambiar={(v) => ponLang(l, 'bio', v)}
              placeholder={l === 'es' ? 'Bio (opcional). Una o dos frases' : 'Bio (optional). One or two sentences'}
            />
            <Area
              valor={f[l]?.credencial}
              alCambiar={(v) => ponLang(l, 'credencial', v)}
              filas={2}
              placeholder={l === 'es'
                ? 'Credencial (opcional). Lo comprobable: cargo, institución, docencia'
                : 'Credential (optional). The verifiable part: role, institution, teaching'}
            />
          </div>
        ))}

        <Aviso tono="mal">{error}</Aviso>
        <Aviso tono="bien">{nota}</Aviso>
      </div>
    </div>
  );
}

export default function Autores({ alCerrar }) {
  const [items, setItems] = React.useState(null);
  const [abierta, setAbierta] = React.useState(null);
  const [error, setError] = React.useState('');
  const [vacioEn, setVacioEn] = React.useState('');

  const cargar = React.useCallback(async () => {
    setError('');
    try {
      const d = await api.listarAutores();
      setItems(d.autores || []);
      setVacioEn(d.vacio_en || '');
    } catch (e) { setError(e.message); setItems([]); }
  }, []);

  React.useEffect(() => { cargar(); }, [cargar]);

  if (abierta) {
    return <Ficha entrada={abierta} alCerrar={() => setAbierta(null)} alGuardar={() => { setAbierta(null); cargar(); }} />;
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Fila style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-display-strong)', fontSize: 'var(--text-h3)', color: 'var(--text-heading)' }}>
          Autores
        </h2>
        <Fila gap={8}>
          <Boton variante="quieto" onClick={alCerrar}>Volver a los artículos</Boton>
          <Boton variante="fuerte" onClick={() => setAbierta({ ficha: null, sha: null })}>Nueva ficha</Boton>
        </Fila>
      </Fila>

      {/* Qué controla esta pantalla, dicho antes de la lista. Sin esto era una
          lista de nombres sin consecuencia visible: nada explicaba que lo que
          se escribe aquí sale en cada artículo y que una casilla decide quién
          firma lo que se publica solo. */}
      <p style={{ margin: 0, font: 'var(--type-body)', fontSize: 14, color: 'var(--text-muted)', maxWidth: '62ch' }}>
        Cada ficha es quien firma los artículos. Lo que pongas aquí sale en la web
        —foto, nombre y cargo, junto a la fecha— y en los datos que leen Google y
        los asistentes. Pulsa una ficha para editarla. Nada se rellena solo: lo que
        no escribas, no aparece.
      </p>

      <Aviso tono="mal">{error}</Aviso>

      {items === null && <p style={{ font: 'var(--type-mono)', color: 'var(--text-faint)' }}>Cargando…</p>}
      {items?.length === 0 && (
        <p style={{ font: 'var(--type-body)', color: 'var(--text-muted)' }}>
          Todavía no hay ninguna ficha. Sin al menos una, el guardián no deja publicar:
          un nombre sin ficha aparece en la web como texto que no se puede contrastar con nada.
          {vacioEn && (
            <><br /><span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
              Se miró en {vacioEn}
            </span></>
          )}
        </p>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        {(items || []).map((e) => (
          <button
            key={e.archivo}
            type="button"
            onClick={() => setAbierta(e)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
              background: marco.papel, border: marco.linea, borderRadius: 2, padding: 12 }}
          >
            {e.ficha?.foto
              ? (
                <img
                  src={e.ficha.foto}
                  alt=""
                  width={40}
                  height={40}
                  /* Mientras el despliegue no acaba, la dirección da 404. Un
                     círculo vacío dice menos que un icono roto, pero no miente. */
                  onError={(ev) => { ev.currentTarget.style.visibility = 'hidden'; }}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flex: 'none', border: '1px dashed var(--border-hairline)' }}
                />
              )
              : <span style={{ width: 40, height: 40, borderRadius: '50%', border: '1px dashed var(--border-hairline)', flex: 'none' }} />}
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', font: 'var(--type-body)', color: 'var(--text-heading)' }}>{e.ficha?.nombre}</span>
              <span style={{ display: 'block', font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
                {e.ficha?.es?.rol || 'sin cargo'}{e.ficha?.linkedin ? ' · LinkedIn' : ' · sin LinkedIn'}
                {e.ficha?.predeterminado ? ' · firma lo automático' : ''}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
