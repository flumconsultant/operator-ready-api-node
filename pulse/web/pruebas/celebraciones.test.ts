import { test, describe } from "node:test";
import assert from "node:assert/strict";

// `celebracionesEntre` consulta la base, pero la parte que puede equivocarse es
// pura: decidir si una fecha de nacimiento cae dentro de una ventana. Esa
// función es privada, así que se prueba a través de una copia exacta de su
// contrato — si cambia el algoritmo, esta prueba deja de proteger nada, y por
// eso el módulo la exporta.
import { enLaVentana } from "../src/lib/celebraciones";

const dia = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe("aniversarios dentro de una ventana", () => {
  test("un cumpleaños en mitad de la ventana cae dentro", () => {
    const cae = enLaVentana(dia("1990-08-25"), dia("2026-08-20"), dia("2026-08-30"));
    assert.deepEqual(cae, dia("2026-08-25"));
  });

  test("fuera de la ventana no cae", () => {
    assert.equal(
      enLaVentana(dia("1990-03-14"), dia("2026-08-20"), dia("2026-08-30")),
      null,
    );
  });

  test("una ventana que cruza el fin de año encuentra el cumpleaños de enero", () => {
    // Del 28 de diciembre al 3 de enero: sin mirar también el año siguiente,
    // nadie que cumpla el 1 de enero se celebraría nunca.
    const cae = enLaVentana(dia("1990-01-01"), dia("2026-12-28"), dia("2027-01-03"));
    assert.deepEqual(cae, dia("2027-01-01"));
  });

  test("una ventana que cruza el fin de año encuentra el de diciembre", () => {
    const cae = enLaVentana(dia("1990-12-30"), dia("2026-12-28"), dia("2027-01-03"));
    assert.deepEqual(cae, dia("2026-12-30"));
  });

  test("el 29 de febrero se celebra el 28 los años que no son bisiestos", () => {
    // 2027 no es bisiesto. Sin este caso, esa persona se quedaría sin
    // felicitación tres años de cada cuatro.
    const cae = enLaVentana(dia("1992-02-29"), dia("2027-02-20"), dia("2027-03-05"));
    assert.deepEqual(cae, dia("2027-02-28"));
  });

  test("el 29 de febrero cae en su día si el año sí es bisiesto", () => {
    const cae = enLaVentana(dia("1992-02-29"), dia("2028-02-20"), dia("2028-03-05"));
    assert.deepEqual(cae, dia("2028-02-29"));
  });

  test("los bordes de la ventana entran", () => {
    assert.ok(enLaVentana(dia("1990-08-20"), dia("2026-08-20"), dia("2026-08-30")));
    assert.ok(enLaVentana(dia("1990-08-30"), dia("2026-08-20"), dia("2026-08-30")));
  });
});
