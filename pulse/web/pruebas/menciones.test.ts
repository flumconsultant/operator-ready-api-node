import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  aTextoPlano,
  componerMencion,
  idsMencionados,
  largoVisible,
  menciónEnCurso,
  trocear,
} from "../src/lib/menciones";

describe("menciones", () => {
  test("un texto sin menciones sale entero como un solo trozo", () => {
    assert.deepEqual(trocear("Hola qué tal"), [
      { tipo: "texto", texto: "Hola qué tal" },
    ]);
  });

  test("separa texto y menciones conservando el orden", () => {
    const trozos = trocear("Gracias @[Ana Villanueva](abc123) por el cierre");
    assert.deepEqual(trozos, [
      { tipo: "texto", texto: "Gracias " },
      { tipo: "mencion", nombre: "Ana Villanueva", userId: "abc123" },
      { tipo: "texto", texto: " por el cierre" },
    ]);
  });

  test("una mención pegada al principio y al final no pierde nada", () => {
    assert.deepEqual(trocear("@[Ana](a1)"), [
      { tipo: "mencion", nombre: "Ana", userId: "a1" },
    ]);
  });

  test("dos llamadas seguidas dan lo mismo", () => {
    // El patrón lleva la bandera global: sin reiniciar lastIndex, la segunda
    // llamada devolvería otra cosa. Es el fallo que este caso protege.
    const texto = "@[Ana](a1) y @[Beto](b2)";
    assert.deepEqual(trocear(texto), trocear(texto));
    assert.equal(idsMencionados(texto).length, 2);
  });

  test("no repite identificadores", () => {
    assert.deepEqual(idsMencionados("@[Ana](a1) y otra vez @[Ana](a1)"), ["a1"]);
  });

  test("el texto plano se lee sin los corchetes", () => {
    assert.equal(
      aTextoPlano("Gracias @[Ana Villanueva](abc) por todo"),
      "Gracias @Ana Villanueva por todo",
    );
  });

  test("el largo visible ignora el formato interno", () => {
    const conMencion = `Hola ${componerMencion("Ana Villanueva", "cmt59abcdef")}`;
    assert.equal(largoVisible(conMencion), "Hola @Ana Villanueva".length);
    // Y es bastante más corto que el texto guardado, que es justo el motivo de
    // que exista esta función.
    assert.ok(conMencion.length > largoVisible(conMencion));
  });

  test("componer limpia los caracteres que romperían el patrón", () => {
    const token = componerMencion("Ana (la de Producto) [jefa]", "a1");
    assert.equal(token, "@[Ana la de Producto jefa](a1)");
    assert.deepEqual(idsMencionados(token), ["a1"]);
  });

  test("un texto con corchetes sueltos no se rompe", () => {
    const texto = "Revisó el informe [borrador] y el (anexo)";
    assert.deepEqual(idsMencionados(texto), []);
    assert.equal(aTextoPlano(texto), texto);
  });
});

describe("detección de la mención en curso", () => {
  test("detecta lo escrito tras la arroba", () => {
    assert.deepEqual(menciónEnCurso("Gracias @ana", 12), {
      consulta: "ana",
      desde: 8,
    });
  });

  test("una arroba al principio del texto vale", () => {
    assert.deepEqual(menciónEnCurso("@an", 3), { consulta: "an", desde: 0 });
  });

  test("un correo dentro del mensaje no dispara el selector", () => {
    // Sin la comprobación de que delante haya un espacio, escribir un correo
    // abriría la lista de personas a media palabra.
    assert.equal(menciónEnCurso("escribe a ana@empresa.com", 25), null);
  });

  test("un espacio cierra la búsqueda", () => {
    assert.equal(menciónEnCurso("Gracias @ana por todo", 21), null);
  });

  test("sin arroba no hay nada", () => {
    assert.equal(menciónEnCurso("Gracias por todo", 16), null);
  });
});
