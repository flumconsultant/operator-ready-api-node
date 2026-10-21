import {readFile,writeFile,mkdir,readdir,rm} from 'node:fs/promises';
import {resolve,relative,extname} from 'node:path';
const root=resolve(import.meta.dirname,'..'),dist=resolve(root,'dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf'};
const assets={};
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(['server','.openai'].includes(entry.name))continue;const path=resolve(dir,entry.name);if(entry.isDirectory())await walk(path);else{const ext=extname(path),binary=['.png','.jpg','.ttf'].includes(ext);if(!types[ext])continue;const bytes=await readFile(path);assets['/'+relative(dist,path).replaceAll('\\','/')]={type:types[ext],binary,body:binary?bytes.toString('base64'):bytes.toString('utf8')}}}}
await walk(dist);
await rm(resolve(dist,'server'),{recursive:true,force:true});await mkdir(resolve(dist,'server'),{recursive:true});await mkdir(resolve(dist,'.openai'),{recursive:true});
const worker=await readFile(resolve(root,'worker/index.js'),'utf8');
await writeFile(resolve(dist,'server/index.js'),'const SITE_ASSETS='+JSON.stringify(assets)+';\n'+worker);
await writeFile(resolve(dist,'.openai/hosting.json'),await readFile(resolve(root,'.openai/hosting.json')));
console.log('Worker construido con '+Object.keys(assets).length+' recursos y acceso con ChatGPT.');
