// Las rutas de la aplicación, todas colgando del slug de la empresa.
//
//   pulse.meetbecome.com/flum            → el feed de Flum
//   pulse.meetbecome.com/flum/cultura    → su panel
//   pulse.meetbecome.com/andina          → el feed de otra empresa
//
// El slug está en la URL y no solo en la sesión por dos motivos. Uno es de
// producto: cada cliente tiene «su» dirección, que es lo que se pega en un
// correo interno y lo que la gente reconoce. El otro es técnico: sin él, dos
// empresas comparten exactamente las mismas URLs, y el caché del navegador —y
// el de cualquier proxy por medio— no puede distinguir una página de otra.
//
// El slug NO es lo que autoriza nada. Quien entra a /otra-empresa/feed no ve
// otra empresa: el layout comprueba que el slug de la URL sea el de su sesión y
// si no, lo devuelve al suyo. La autorización sigue viviendo en la sesión, como
// antes; la URL solo dice dónde está.

export const rutas = (empresa: string) => ({
  feed: `/${empresa}/feed`,
  publicacion: (id: string) => `/${empresa}/feed/${id}`,
  novedades: `/${empresa}/notificaciones`,
  persona: (id: string) => `/${empresa}/persona/${id}`,
  perfil: `/${empresa}/perfil`,
  equipo: `/${empresa}/panel`,
  cultura: `/${empresa}/admin`,
  personas: `/${empresa}/admin/personas`,
  empresa: `/${empresa}/admin/empresa`,
  auditoria: `/${empresa}/admin/auditoria`,
  bienvenida: `/${empresa}/bienvenida`,
  bienvenidaEmpresa: `/${empresa}/bienvenida/empresa`,
});

export const ACCEDER = "/acceder";

/// El slug que hay en una ruta, o null si la ruta no cuelga de ninguna empresa
/// (la portada, el acceso, una invitación).
///
/// Lo usan los componentes de cliente, que no reciben `params`: leerlo de la
/// URL evita pasar el slug por diez niveles de props o montar un contexto para
/// un dato que ya está a la vista.
export function empresaDeRuta(ruta: string): string | null {
  const primero = ruta.split("/").filter(Boolean)[0];
  if (!primero) return null;
  if (["acceder", "invitacion", "api"].includes(primero)) return null;
  return primero;
}
