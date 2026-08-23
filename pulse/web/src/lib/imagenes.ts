import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";

// El almacén de imágenes: fotos de perfil y fotos de los reconocimientos.
//
// Van a disco, en un volumen de Docker, y no a la base de datos ni a un
// servicio externo. Guardarlas en Postgres hincha las copias de seguridad y
// obliga a leerlas por el pool de conexiones; un S3 añade una cuenta, una
// factura y una clave más que gestionar antes de tener el primer cliente. Un
// volumen se respalda con el mismo `docker compose` y el día que haga falta
// mover esto a un bucket, lo único que cambia son estas dos funciones.
//
// Nada de lo que sube el navegador se escribe tal cual: todo pasa por sharp,
// que reencodifica a WebP. Eso hace tres cosas a la vez — reduce el peso,
// borra los metadatos EXIF (una foto de móvil lleva las coordenadas GPS de
// donde se tomó, y nadie espera publicar su casa al subir una foto de perfil)
// y descarta cualquier archivo que no sea una imagen de verdad, por mucho que
// se llame .jpg.

const DIRECTORIO = resolve(
  process.env.ALMACEN_IMAGENES ?? "/app/subidas",
);

export const TIPOS_ACEPTADOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const TAMANO_MAXIMO = 8 * 1024 * 1024; // 8 MB antes de procesar

/// Los nombres los genera el servidor. El del archivo que sube la persona no
/// se usa nunca: es la vía más corta a un `../../etc/passwd`.
const NOMBRE_VALIDO = /^[0-9a-f-]{36}\.webp$/;

type Formato = "avatar" | "post";

const MEDIDAS: Record<Formato, { ancho: number; alto?: number }> = {
  // El avatar se recorta a cuadrado porque se muestra en círculo en todas
  // partes y una foto apaisada quedaría descentrada.
  avatar: { ancho: 400, alto: 400 },
  // La del post conserva su proporción; solo se limita el ancho.
  post: { ancho: 1400 },
};

export async function guardarImagen(
  archivo: File,
  formato: Formato,
): Promise<{ ok: true; nombre: string } | { ok: false; error: string }> {
  if (!TIPOS_ACEPTADOS.includes(archivo.type)) {
    return { ok: false, error: "Solo se aceptan imágenes JPG, PNG, WebP o GIF." };
  }
  if (archivo.size > TAMANO_MAXIMO) {
    return { ok: false, error: "La imagen no puede pasar de 8 MB." };
  }

  const entrada = Buffer.from(await archivo.arrayBuffer());
  const medidas = MEDIDAS[formato];

  let salida: Buffer;
  try {
    const pipeline = sharp(entrada, { animated: false }).rotate();
    salida = await pipeline
      .resize({
        width: medidas.ancho,
        height: medidas.alto,
        fit: medidas.alto ? "cover" : "inside",
        // Una foto pequeña no se amplía: se vería peor y pesaría más.
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return { ok: false, error: "No se ha podido leer la imagen." };
  }

  const nombre = `${randomUUID()}.webp`;
  await mkdir(DIRECTORIO, { recursive: true });
  await writeFile(join(DIRECTORIO, nombre), salida);

  return { ok: true, nombre };
}

export async function leerImagen(nombre: string): Promise<Buffer | null> {
  if (!NOMBRE_VALIDO.test(nombre)) return null;

  // Aunque el patrón ya excluye las barras y los puntos, se comprueba que la
  // ruta resuelta siga dentro del directorio. Es una línea, y protege de que
  // alguien relaje el patrón dentro de un año sin darse cuenta de lo que
  // sostenía.
  const ruta = resolve(DIRECTORIO, nombre);
  if (!ruta.startsWith(DIRECTORIO + "/")) return null;

  try {
    return await readFile(ruta);
  } catch {
    return null;
  }
}
