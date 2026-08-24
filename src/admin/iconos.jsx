import React from 'react';
import {
  Article, Files, SquaresFour, BookOpen, UserCircle, EnvelopeSimple,
  List, X, CaretDown, CaretUp, ArrowUp, ArrowDown, Trash,
  SignOut, ArrowSquareOut, Plus, ArrowLeft, House, DotsThree,
} from '@phosphor-icons/react';

/**
 * Los iconos del panel.
 *
 * Un solo set —Phosphor, el mismo del sitio público—, un solo grosor y dos
 * tamaños. La razón de centralizarlos aquí y no importarlos en cada módulo es
 * la de siempre: la coherencia de un sistema de iconos se pierde por
 * acumulación. El quinto módulo elige el icono que le parece, con el grosor
 * que trae por defecto, y a partir de ahí el panel parece hecho por cinco
 * personas que no hablaron entre ellas.
 *
 * ---- Por qué no hay emojis ----
 *
 * Un emoji lo dibuja el sistema operativo, no nosotros: el mismo carácter se
 * ve distinto en un iPhone, en un Android y en Windows, y no hay forma de
 * darle el color de la marca ni de alinearlo con el texto. Un icono es parte
 * del sistema de diseño; un emoji es una letra que no controlamos.
 *
 * ---- Y por qué ninguno lleva rótulo propio ----
 *
 * Todos van al lado de su palabra: «Artículos», «Quitar», «Salir». Un icono
 * junto a un texto que ya dice lo mismo es decoración, y la decoración se
 * oculta a los lectores de pantalla —si no, quien navega a ciegas oye el
 * nombre del módulo dos veces—. De ahí el `aria-hidden` de abajo.
 *
 * Cuando un icono va SOLO —el botón de abrir el menú, el de cerrarlo— el
 * rótulo va en el botón que lo contiene, no en el icono. Está marcado en cada
 * sitio donde ocurre.
 */

const TAMANO = { normal: 20, grande: 22 };

/* Un icono decorativo: acompaña a un texto que ya dice lo mismo. */
const decorativo = (Glifo) => function Icono({ tamano = 'normal' }) {
  return <Glifo size={TAMANO[tamano]} weight="regular" aria-hidden="true" />;
};

/* Los seis módulos. El icono no es un adorno: en una lista de seis nombres
   parecidos, la forma se reconoce antes que la palabra, y quien usa esto todos
   los días acaba yendo a la forma. */
export const IconoHoy           = decorativo(House);
export const IconoArticulos     = decorativo(Article);
export const IconoPaginas       = decorativo(Files);
export const IconoContenido     = decorativo(SquaresFour);
export const IconoConocimiento  = decorativo(BookOpen);
export const IconoAutores       = decorativo(UserCircle);
export const IconoSuscriptores  = decorativo(EnvelopeSimple);

/* Los de la interfaz. */
export const IconoMenu    = decorativo(List);
export const IconoCerrar  = decorativo(X);
export const IconoAbajo   = decorativo(CaretDown);
export const IconoArriba  = decorativo(CaretUp);
export const IconoSubir   = decorativo(ArrowUp);
export const IconoBajar   = decorativo(ArrowDown);
export const IconoQuitar  = decorativo(Trash);
export const IconoSalir   = decorativo(SignOut);
export const IconoFuera   = decorativo(ArrowSquareOut);
export const IconoNuevo   = decorativo(Plus);
export const IconoVolver  = decorativo(ArrowLeft);
export const IconoMas     = decorativo(DotsThree);

/** El icono de cada módulo, por su id. */
export const ICONO_MODULO = {
  hoy: IconoHoy,
  articulos: IconoArticulos,
  paginas: IconoPaginas,
  contenido: IconoContenido,
  conocimiento: IconoConocimiento,
  autores: IconoAutores,
  suscriptores: IconoSuscriptores,
};
