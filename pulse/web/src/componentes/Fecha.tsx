"use client";

import { useEffect, useState } from "react";

import { fechaCorta, fechaLarga, fechaRelativa } from "@/lib/fechas";

// «hace 3 h», sin romper la hidratación.
//
// El servidor calcula «hace 3 h» con SU reloj y el navegador vuelve a
// calcularlo con el suyo unos segundos después. Si los dos textos no coinciden,
// React descarta el HTML del servidor y vuelve a pintar el árbol entero en el
// cliente — que es justo lo que el renderizado en servidor venía a evitar.
//
// Así que el primer pintado, en los dos lados, es la fecha absoluta, que no
// depende de cuándo se mire y está escrita a mano para que tampoco dependa de
// la versión de ICU de cada uno (ver lib/fechas.ts). En cuanto el componente
// monta, pasa a relativa. El atributo `dateTime` lleva siempre la fecha exacta
// en ISO, que es lo que leen los lectores de pantalla.

export default function Fecha({ valor }: { valor: string }) {
  const fecha = new Date(valor);
  const [texto, setTexto] = useState(() => fechaCorta(fecha));

  useEffect(() => {
    setTexto(fechaRelativa(fecha));

    // Se refresca cada minuto: un «ahora mismo» que sigue diciendo lo mismo
    // media hora después es peor que no poner nada.
    const t = setInterval(() => setTexto(fechaRelativa(new Date(valor))), 60_000);
    return () => clearInterval(t);
  }, [valor]);

  return (
    <time dateTime={valor} title={fechaLarga(fecha)}>
      {texto}
    </time>
  );
}
