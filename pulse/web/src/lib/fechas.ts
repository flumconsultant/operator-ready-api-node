// Fechas en el idioma en que la gente habla.
//
// Todo está escrito a mano y no con `Intl.DateTimeFormat`. No es por gusto: el
// servidor y el navegador llevan versiones distintas de ICU, y la misma fecha
// con las mismas opciones sale distinta en cada uno —
//
//   node   : "23 de agosto de 2026 a las 12:27 p. m."
//   chrome : "23 de agosto de 2026, 12:27 p. m."
//
// — así que cualquier fecha con Intl que se pinte en el servidor y se hidrate
// en el cliente produce una discrepancia, React tira el HTML del servidor y
// vuelve a pintar la página entera. Se detectó exactamente así, con un error
// #418 en el feed.
//
// Con estas funciones el texto depende solo de la fecha, y sale idéntico en los
// dos lados y en cualquier máquina.

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/// La forma corta que se pinta en el servidor: «23 ago» o «23 ago 2025».
export function fechaCorta(fecha: Date, ahora = new Date()): string {
  const dia = fecha.getDate();
  const mes = MESES_CORTOS[fecha.getMonth()];
  return fecha.getFullYear() === ahora.getFullYear()
    ? `${dia} ${mes}`
    : `${dia} ${mes} ${fecha.getFullYear()}`;
}

/// «hace 3 h». Solo se usa después de montar en el cliente, donde ya no hay
/// nada con lo que discrepar.
export function fechaRelativa(fecha: Date, ahora = new Date()): string {
  const segundos = Math.round((ahora.getTime() - fecha.getTime()) / 1000);

  // Una fecha en el futuro es un reloj mal puesto, no algo que contar hacia
  // adelante. Se trata como «ahora mismo».
  if (segundos < 60) return "ahora mismo";

  const minutos = Math.round(segundos / 60);
  if (minutos < 60) return `hace ${minutos} min`;

  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;

  const dias = Math.round(horas / 24);
  if (dias === 1) return "ayer";
  if (dias < 7) return `hace ${dias} días`;

  return fechaCorta(fecha, ahora);
}

/// La fecha completa, para el `title` y para cuando hace falta el dato exacto.
export function fechaLarga(fecha: Date): string {
  const hora = String(fecha.getHours()).padStart(2, "0");
  const minuto = String(fecha.getMinutes()).padStart(2, "0");
  return `${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}, ${hora}:${minuto}`;
}

/// Día y mes, sin año. Es lo único que se enseña de un cumpleaños.
export function diaYMes(fecha: Date): string {
  return `${fecha.getUTCDate()} de ${MESES[fecha.getUTCMonth()]}`;
}
