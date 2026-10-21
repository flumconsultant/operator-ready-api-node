/* Sites valida la identidad de ChatGPT e inyecta estos encabezados en cada petición. */
const OWNER_EMAIL = 'flum2.carlos.ramirez@gmail.com';
const PUBLIC_ASSETS = new Set(['/bcp-login.css','/assets/logo-bcp.svg','/assets/bcp-symbol.svg','/favicon.svg','/favicon-bcp.svg','/iso-curves.png']);
const AUTH_ROUTES = new Set(['/signin-with-chatgpt','/signout-with-chatgpt','/callback']);
function relativeReturn(value) {
  if(!value || !value.startsWith('/') || value.startsWith('//'))return '/';
  try { const url=new URL(value,'https://app.local');if(url.origin!=='https://app.local'||AUTH_ROUTES.has(url.pathname)||url.pathname==='/login')return '/';return url.pathname+url.search+url.hash; }catch{return '/'}
}
function userFor(request) {
  const id=request.headers.get('oai-authenticated-user-id'),email=request.headers.get('oai-authenticated-user-email');
  if(!id||!email)return null;
  let name=null;
  if(request.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8')try{name=decodeURIComponent(request.headers.get('oai-authenticated-user-full-name')||'')}catch{}
  const owner=email.toLowerCase()===OWNER_EMAIL;
  return {displayName:owner?'Carlos Andrés Ramírez':name||email,photoUrl:owner?'assets/carlos-andres-ramirez.jpg?v=ux-11':null};
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function loginPage(returnTo,error) {
  const signin='/signin-with-chatgpt?return_to='+encodeURIComponent(relativeReturn(returnTo));
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#002A8D"><title>Ingresar · BCP GEO Monitor</title><link rel="icon" href="/favicon-bcp.svg?v=ux-11" type="image/svg+xml"><link rel="preload" href="/fonts/flexo-regular.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/bcp-login.css?v=ux-11"></head><body class="auth-page"><main class="auth-layout"><section class="auth-story" aria-labelledby="brand-title"><div class="auth-brand"><img src="/assets/logo-bcp.svg?v=ux-11" width="138" height="36" alt="BCP"><span>GEO Monitor</span></div><div class="auth-story-body"><span class="auth-eyebrow">Monitor de Visibilidad en IA</span><h1 id="brand-title">Tu marca,<br>en cada respuesta.</h1><p>Entiende cómo aparece BCP en las respuestas de inteligencia artificial. Convierte la información en mejores decisiones.</p><div class="auth-preview" aria-hidden="true"><div class="auth-preview-top"><span>Visibilidad de marca</span><i></i><i></i><i></i></div><div class="auth-preview-cards"><span></span><span></span><span></span></div><svg viewBox="0 0 480 130"><path d="M0 110H480M0 70H480M0 30H480" stroke="#DCE8FF" stroke-opacity=".13" fill="none"/><path d="M0 110 50 92 110 98 170 60 230 70 300 36 360 46 420 16 480 26" fill="none" stroke="#FF7800" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M0 110 50 92 110 98 170 60 230 70 300 36 360 46 420 16 480 26V130H0Z" fill="url(#area)"/><defs><linearGradient id="area" x2="0" y2="1"><stop stop-color="#FF7800" stop-opacity=".16"/><stop offset="1" stop-color="#FF7800" stop-opacity="0"/></linearGradient></defs></svg></div></div><span class="auth-brand-footer">BCP · Marketing y Comunicaciones</span></section><section class="auth-entry" aria-labelledby="login-title"><div class="auth-mobile-brand"><img src="/assets/logo-bcp.svg?v=ux-11" width="124" height="33" alt="BCP"><span>GEO Monitor</span></div><div class="auth-card"><div class="auth-access-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1"/></svg></div><span class="auth-eyebrow">BCP GEO Monitor</span><h2 id="login-title">Bienvenido a tu<br>espacio de análisis</h2><p>Inicia sesión para explorar la visibilidad de BCP y dar seguimiento a tus consultas.</p>${error?'<div class="auth-error" role="alert">No se pudo completar el acceso. Vuelve a intentarlo.</div>':''}<a class="auth-signin" id="chatgptSignIn" href="${esc(signin)}" target="_top"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-6 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h5"/></svg>Continuar con ChatGPT<span aria-hidden="true">→</span></a><div class="auth-note"><span aria-hidden="true">✓</span><p>Usa tu cuenta de ChatGPT.<br>No necesitas otra contraseña.</p></div></div><footer class="auth-entry-footer">Monitor de Visibilidad en IA · BCP</footer></section></main><script>const link=document.getElementById('chatgptSignIn');if(location.hash){const u=new URL(link.href);const p=u.searchParams.get('return_to')||'/';u.searchParams.set('return_to',p.split('#')[0]+location.hash);link.href=u.pathname+u.search;}</script></body></html>`;
}
function response(body,status=200,type='text/html; charset=utf-8',extra={}) {
  return new Response(body,{status,headers:{'content-type':type,'cache-control':'private, no-store','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin',...extra}});
}
function asset(path) {
  const a=SITE_ASSETS[path];if(!a)return null;
  return {data:a.binary?Uint8Array.from(atob(a.body),c=>c.charCodeAt(0)):a.body,type:a.type};
}
export default {
  async fetch(request) {
    const url=new URL(request.url),path=url.pathname,user=userFor(request);
    if(request.method!=='GET'&&request.method!=='HEAD')return response('Método no permitido',405,'text/plain; charset=utf-8',{Allow:'GET, HEAD'});
    if(AUTH_ROUTES.has(path))return response('Ruta administrada por Sites',404,'text/plain; charset=utf-8');
    if(path==='/api/session')return user?response(JSON.stringify(user),200,'application/json; charset=utf-8'):response('{"authenticated":false}',401,'application/json; charset=utf-8');
    const publicAsset=PUBLIC_ASSETS.has(path)||/^\/fonts\/[a-z0-9-]+\.ttf$/.test(path);
    if(!user&&!publicAsset){
      if(path==='/'||path==='/index.html'||path==='/login')return response(request.method==='HEAD'?null:loginPage(path==='/login'?url.searchParams.get('return_to'):url.pathname+url.search,url.searchParams.has('error')));
      return response('Inicia sesión con ChatGPT para continuar.',401,'text/plain; charset=utf-8');
    }
    if(path==='/login')return response(null,303,'text/plain; charset=utf-8',{location:relativeReturn(url.searchParams.get('return_to'))});
    const target=path==='/'?'/index.html':path,a=asset(target);if(!a)return response('No encontrado',404,'text/plain; charset=utf-8');
    if(target==='/index.html'){
      const session=JSON.stringify(user).replace(/[<>&]/g,c=>({'<':'\\u003c','>':'\\u003e','&':'\\u0026'}[c]));
      return response(request.method==='HEAD'?null:a.data.replace('</head>',`<script id="bcp-session" type="application/json">${session}</script></head>`));
    }
    return response(request.method==='HEAD'?null:a.data,200,a.type,publicAsset?{'cache-control':'public, max-age=3600'}:{});
  }
};
