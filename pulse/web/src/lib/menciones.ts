// Menciones con @.
//
// Se guardan como `@[Nombre](userId)` dentro del propio texto. Es el formato de
// los enlaces de Markdown y se eligió por lo mismo: el texto sigue siendo texto
// —se puede buscar, recortar y mandar a la API de Claude sin preprocesarlo— y a
// la vez lleva dentro a quién se refiere de verdad.
//
// Guardar solo «@Ana» no serviría: hay dos Anas en cualquier empresa de
// cincuenta personas, y el día que una se cambie el nombre la mención apuntaría
// a nadie. Guardar el id aparte, en una tabla, obligaría a rehacer el texto al
// pintarlo y a mantener las dos cosas sincronizadas.

const PATRON = /@\[([^\]]{1,80})\]\(([A-Za-z0-9_-]{1,40})\)/g;

export type Trozo =
  | { tipo: "texto"; texto: string }
  | { tipo: "mencion"; nombre: string; userId: string };

/// Parte un texto en trozos de texto plano y menciones, en orden.
export function trocear(texto: string): Trozo[] {
  const trozos: Trozo[] = [];
  let ultimo = 0;

  // El patrón lleva la bandera global, así que hay que reiniciar el índice: si
  // no, dos llamadas seguidas con el mismo texto dan resultados distintos.
  PATRON.lastIndex = 0;

  let coincidencia: RegExpExecArray | null;
  while ((coincidencia = PATRON.exec(texto)) !== null) {
    if (coincidencia.index > ultimo) {
      trozos.push({ tipo: "texto", texto: texto.slice(ultimo, coincidencia.index) });
    }
    trozos.push({
      tipo: "mencion",
      nombre: coincidencia[1],
      userId: coincidencia[2],
    });
    ultimo = coincidencia.index + coincidencia[0].length;
  }

  if (ultimo < texto.length) {
    trozos.push({ tipo: "texto", texto: texto.slice(ultimo) });
  }

  return trozos;
}

/// Los identificadores mencionados, sin repetir.
export function idsMencionados(texto: string): string[] {
  return [
    ...new Set(
      trocear(texto)
        .filter((t): t is Extract<Trozo, { tipo: "mencion" }> => t.tipo === "mencion")
        .map((t) => t.userId),
    ),
  ];
}

/// El texto tal y como lo lee una persona, sin los corchetes.
///
/// Se usa para el resumen de las notificaciones y para lo que se manda a
/// Discord y a la API de Claude: ahí un `@[Ana Villanueva](cmt59…)` no aporta
/// nada y encima gasta tokens.
export function aTextoPlano(texto: string): string {
  return trocear(texto)
    .map((t) => (t.tipo === "texto" ? t.texto : `@${t.nombre}`))
    .join("");
}

/// Cuánto ocupa de verdad, para contar caracteres en la interfaz.
///
/// Sin esto, mencionar a alguien gasta cuarenta caracteres del límite sin que
/// se vea por qué, y el contador de «te quedan N» miente.
export function largoVisible(texto: string): number {
  return aTextoPlano(texto).length;
}

export function componerMencion(nombre: string, userId: string): string {
  // Los corchetes y paréntesis dentro del nombre romperían el patrón al
  // volver a leerlo.
  return `@[${nombre.replace(/[[\]()]/g, "")}](${userId})`;
}

/// Detecta si el cursor está escribiendo una mención, y con qué se ha escrito.
///
/// Devuelve el trozo `@lo-que-lleve` que hay justo antes del cursor, o null. Se
/// exige que delante haya un espacio o el principio del texto para que un
/// correo escrito en el mensaje no dispare el selector.
export function menciónEnCurso(
  texto: string,
  posicion: number,
): { consulta: string; desde: number } | null {
  const antes = texto.slice(0, posicion);
  const arroba = antes.lastIndexOf("@");
  if (arroba === -1) return null;

  const anterior = arroba === 0 ? " " : antes[arroba - 1];
  if (!/\s/.test(anterior)) return null;

  const consulta = antes.slice(arroba + 1);
  // Un espacio cierra la búsqueda: nadie escribe un nombre y sigue esperando
  // que el selector siga abierto tres palabras después.
  if (/[\s\]()]/.test(consulta)) return null;

  return { consulta, desde: arroba };
}
