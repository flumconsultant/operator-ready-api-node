import React from 'react';
import { CATALOGO } from '../components/insights/Bloques.jsx';
import { Etiqueta, Texto, Area, Boton, Fila } from './piezas.jsx';

/**
 * El formulario de un bloque, generado a partir de su descripción en CATALOGO.
 *
 * No hay un componente por tipo de bloque a propósito: los once tipos usan
 * cuatro clases de campo entre todos, y once formularios escritos a mano se
 * habrían desincronizado del renderizador en cuanto alguien añadiera un campo.
 * Así, añadir un tipo de bloque es tocar solo Bloques.jsx.
 */

const NOMBRES = Object.fromEntries(CATALOGO.map((c) => [c.tipo, c.nombre]));

/* Una lista de textos se edita como texto con saltos de línea y no como diez
   campos con su botón de añadir y quitar: escribir cinco señales seguidas es
   una sola acción mental, y trocearla en cinco formularios la vuelve lenta. */
const Lineas = ({ items = [], alCambiar }) => (
  <Area
    valor={items.join('\n')}
    alCambiar={(v) => alCambiar(v.split('\n'))}
    filas={Math.max(3, items.length + 1)}
    placeholder="Una por línea"
  />
);

const Pares = ({ items = [], claves, alCambiar }) => {
  const [a, b] = claves;
  const vacio = { [a]: '', [b]: '' };
  const cambiar = (i, k, v) => alCambiar(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'grid', gap: 6, padding: 12, border: '1px solid var(--border-hairline)', borderRadius: 2 }}>
          <Fila style={{ justifyContent: 'space-between' }}>
            <Etiqueta>{a}</Etiqueta>
            <Boton variante="quieto" onClick={() => alCambiar(items.filter((_, j) => j !== i))} title="Quitar">✕</Boton>
          </Fila>
          <Texto valor={it[a]} alCambiar={(v) => cambiar(i, a, v)} />
          <Etiqueta>{b}</Etiqueta>
          <Area valor={it[b]} alCambiar={(v) => cambiar(i, b, v)} filas={2} />
        </div>
      ))}
      <div><Boton onClick={() => alCambiar([...items, vacio])}>Añadir</Boton></div>
    </div>
  );
};

export default function Bloque({ bloque, indice, total, alCambiar, alMover, alQuitar }) {
  const def = CATALOGO.find((c) => c.tipo === bloque.tipo);
  const pon = (k, v) => alCambiar({ ...bloque, [k]: v });

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border-hairline)', borderRadius: 2, padding: 16 }}>
      <Fila style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ font: 'var(--type-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
          {String(indice + 1).padStart(2, '0')} · {NOMBRES[bloque.tipo] || bloque.tipo}
        </span>
        <Fila gap={4}>
          <Boton variante="quieto" onClick={() => alMover(-1)} disabled={indice === 0} title="Subir">↑</Boton>
          <Boton variante="quieto" onClick={() => alMover(1)} disabled={indice === total - 1} title="Bajar">↓</Boton>
          <Boton variante="quieto" onClick={alQuitar} title="Eliminar bloque">✕</Boton>
        </Fila>
      </Fila>

      <div style={{ display: 'grid', gap: 10 }}>
        {(def?.campos || []).map(([campo, clase]) => {
          if (clase === 'lineas') {
            return (
              <div key={campo}>
                <Etiqueta>{campo}</Etiqueta>
                <Lineas items={bloque[campo]} alCambiar={(v) => pon(campo, v)} />
              </div>
            );
          }
          if (clase.startsWith('pares:')) {
            return (
              <div key={campo}>
                <Etiqueta>{campo}</Etiqueta>
                <Pares items={bloque[campo]} claves={clase.slice(6).split(',')} alCambiar={(v) => pon(campo, v)} />
              </div>
            );
          }
          const C = clase === 'area' ? Area : Texto;
          return (
            <div key={campo}>
              <Etiqueta>{campo}</Etiqueta>
              <C valor={bloque[campo]} alCambiar={(v) => pon(campo, v)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
