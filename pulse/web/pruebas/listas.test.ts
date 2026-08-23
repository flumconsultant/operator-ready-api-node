import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { leerLista } from "../src/lib/administracion";

// La lista pegada es por donde entra la gente a Pulse en un alta masiva. Lo que
// se prueba aquí es lo que de verdad va a pasar: alguien copia de Excel, de
// Google Sheets o de un CSV, y cada uno usa un separador distinto.

describe("lectura de una lista pegada", () => {
  test("acepta comas", () => {
    const filas = leerLista("Ana Villanueva, ana@empresa.com, Producto, Líder");
    assert.equal(filas.length, 1);
    assert.equal(filas[0].nombre, "Ana Villanueva");
    assert.equal(filas[0].email, "ana@empresa.com");
    assert.equal(filas[0].equipo, "Producto");
    assert.equal(filas[0].error, undefined);
  });

  test("acepta tabuladores, que es lo que sale al copiar de una hoja", () => {
    const filas = leerLista("Ana\tana@empresa.com\tProducto\tLíder");
    assert.equal(filas[0].email, "ana@empresa.com");
    assert.equal(filas[0].error, undefined);
  });

  test("acepta punto y coma", () => {
    const filas = leerLista("Ana;ana@empresa.com;Producto;Líder");
    assert.equal(filas[0].email, "ana@empresa.com");
  });

  test("se salta la fila de cabecera", () => {
    const filas = leerLista(
      ["Nombre, Correo, Equipo, Cargo", "Ana, ana@empresa.com, Producto,"].join("\n"),
    );
    assert.equal(filas.length, 1);
    assert.equal(filas[0].nombre, "Ana");
  });

  test("ignora las líneas en blanco", () => {
    const filas = leerLista("\n\nAna, ana@empresa.com\n\n\nBeto, beto@empresa.com\n");
    assert.equal(filas.length, 2);
  });

  test("marca el error sin descartar la fila", () => {
    // Descartarla dejaría a quien pega la lista sin saber qué línea falló.
    const filas = leerLista("Sin Correo, esto-no-es-un-correo, Producto,");
    assert.equal(filas.length, 1);
    assert.ok(filas[0].error);
  });

  test("una línea mala no impide leer las buenas", () => {
    const filas = leerLista(
      ["Ana, ana@empresa.com", "Roto, no-vale", "Beto, beto@empresa.com"].join("\n"),
    );
    assert.equal(filas.length, 3);
    assert.equal(filas.filter((f) => !f.error).length, 2);
  });

  test("el número de línea sirve para señalar el error", () => {
    const filas = leerLista(["Ana, ana@empresa.com", "Roto, no-vale"].join("\n"));
    assert.equal(filas[1].linea, 2);
  });
});
