import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { diaYMes, fechaCorta, fechaLarga, fechaRelativa } from "../src/lib/fechas";

// Estas funciones están escritas a mano y no con Intl a propósito: el servidor
// y el navegador llevan versiones distintas de ICU y la misma fecha salía
// distinta en cada uno, lo que rompía la hidratación de React. Estas pruebas
// son lo que impide que alguien las «simplifique» volviendo a Intl.

const AHORA = new Date("2026-08-23T12:00:00.000Z");

describe("fechaRelativa", () => {
  const hace = (ms: number) => new Date(AHORA.getTime() - ms);

  test("menos de un minuto es «ahora mismo»", () => {
    assert.equal(fechaRelativa(hace(30_000), AHORA), "ahora mismo");
  });

  test("minutos", () => {
    assert.equal(fechaRelativa(hace(5 * 60_000), AHORA), "hace 5 min");
  });

  test("horas", () => {
    assert.equal(fechaRelativa(hace(3 * 3_600_000), AHORA), "hace 3 h");
  });

  test("un día es «ayer», no «hace 1 días»", () => {
    assert.equal(fechaRelativa(hace(24 * 3_600_000), AHORA), "ayer");
  });

  test("varios días", () => {
    assert.equal(fechaRelativa(hace(3 * 24 * 3_600_000), AHORA), "hace 3 días");
  });

  test("a partir de una semana, la fecha corta", () => {
    assert.equal(fechaRelativa(new Date("2026-08-01T12:00:00Z"), AHORA), "1 ago");
  });

  test("otro año lleva el año", () => {
    assert.equal(fechaRelativa(new Date("2025-11-04T12:00:00Z"), AHORA), "4 nov 2025");
  });

  test("una fecha en el futuro no cuenta hacia adelante", () => {
    // Un reloj mal puesto en el móvil de alguien no debería producir
    // «hace -3 min».
    const futuro = new Date(AHORA.getTime() + 5 * 60_000);
    assert.equal(fechaRelativa(futuro, AHORA), "ahora mismo");
  });
});

describe("formatos absolutos", () => {
  test("fecha corta sin año cuando es este año", () => {
    assert.equal(fechaCorta(new Date("2026-03-09T12:00:00Z"), AHORA), "9 mar");
  });

  test("día y mes, sin año, para los cumpleaños", () => {
    assert.equal(diaYMes(new Date("1985-03-14T12:00:00Z")), "14 de marzo");
  });

  test("la fecha larga no depende de la versión de ICU", () => {
    // El texto exacto importa: es lo que se pinta en el servidor y se vuelve a
    // pintar en el navegador.
    const texto = fechaLarga(new Date("2026-08-23T15:30:00"));
    assert.match(texto, /^23 de agosto de 2026, \d{2}:\d{2}$/);
  });
});
