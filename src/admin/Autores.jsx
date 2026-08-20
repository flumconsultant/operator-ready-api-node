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

const NUEVA = () => ({ id: '', nombre: '', foto: '', linkedin: '', predeterminado: false, es: { rol: '', bio: '' }, en: { rol: '', bio: '' } });

const aId = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);

/**
 * Reduce la foto a 400px de lado antes de subirla.
 *
 * Se ve a 44 píxeles en la firma. Subir el original de una cámara son varios
 * megas que hay que guardar, servir y descargar para pintar un círculo pequeño.
 * 400 deja margen para pantallas de alta densidad y pesa unas cien veces menos.
 */
function reducir(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Ese archivo no es una imagen que el navegador sepa abrir.'));
      img.onload = () => {
        const LADO = 400;
        /* Cuadrada y centrada: la firma la pinta en un círculo, y una foto
           rectangular recortada por CSS se corta por donde toque, que suele ser
           por la frente. */
        const corte = Math.min(img.width, img.height);
        const lienzo = document.createElement('canvas');
        lienzo.width = lienzo.height = LADO;
        lienzo.getContext('2d').drawImage(
          img,
          (img.width - corte) / 2, (img.height - corte) / 2, corte, corte,
          0, 0, LADO, LADO,
        );
        resolve(lienzo.toDataURL('image/webp', 0.9));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

function Ficha({ entrada, alGuardar, alCerrar }) {
  const [f, setF] = React.useState(entrada.ficha || NUEVA());
  const [error, setError] = React.useState('');
  const [subiendo, setSubiendo] = React.useState(false);
  const [guardando, setGuardando] = React.useState(false);
  const [nota, setNota] = React.useState('');
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

  const elegirFoto = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!f.id) { setError('Escribe primero el nombre: la foto se guarda con su identificador.'); return; }
    setSubiendo(true); setError('');
    try {
      const { foto } = await api.subirFoto({ id: f.id, datos: await reducir(archivo) });
      const siguiente = { ...f, foto };
      setF(siguiente);
      campo.current.value = '';

      /* Y se guarda la ficha en el acto. Antes no: la foto se subía al
         repositorio pero el campo `foto` solo se escribía al pulsar Guardar,
         así que quien subía la foto y cerraba dejaba el archivo dentro y la
         ficha sin él. La foto existía y no se veía en ningún sitio, que es la
         peor de las dos mitades. Subir una foto ES el cambio; no hay un
         segundo paso que tenga sentido pedir. */
      const r = await api.guardarAutor({ ficha: siguiente, sha: entrada.sha });
      entrada.sha = r.sha;
      setNota('Foto guardada.');
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
          <Boton variante="quieto" onClick={alCerrar}>Volver</Boton>
          <Boton variante="fuerte" onClick={guardar} disabled={falta || guardando || subiendo}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </Boton>
        </Fila>
      </Fila>

      <div style={{ background: marco.papel, border: marco.linea, borderRadius: 2, padding: 16, display: 'grid', gap: 12 }}>
        <Fila gap={16} style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 'none', textAlign: 'center' }}>
            {f.foto
              ? <img src={f.foto} alt="" width={96} height={96} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
              : (
                <div style={{ width: 96, height: 96, borderRadius: '50%', border: '1px dashed var(--border-hairline)', display: 'grid', placeItems: 'center', font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
                  sin foto
                </div>
              )}
            <input ref={campo} type="file" accept="image/webp,image/jpeg,image/png" onChange={elegirFoto} style={{ display: 'none' }} id="foto" />
            <label htmlFor="foto" style={{ display: 'inline-block', marginTop: 8, cursor: 'pointer' }}>
              <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-accent)', textDecoration: 'underline' }}>
                {subiendo ? 'Subiendo…' : (f.foto ? 'Cambiar' : 'Subir foto')}
              </span>
            </label>
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
              ? <img src={e.ficha.foto} alt="" width={40} height={40} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flex: 'none' }} />
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
