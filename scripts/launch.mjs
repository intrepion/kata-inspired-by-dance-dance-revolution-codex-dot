import {spawn} from 'node:child_process';import {openSync,writeFileSync} from 'node:fs';import {resolve} from 'node:path';import {createConnection} from 'node:net';
const cwd=resolve(import.meta.dirname,'..'),port=Number(process.env.PORT??5197);
const busy=await new Promise(r=>{const s=createConnection({host:'127.0.0.1',port});s.once('connect',()=>{s.destroy();r(true);});s.once('error',()=>r(false));});
if(busy){console.error(`Port ${port} is occupied; preserving that server. Choose PORT=<free port>.`);process.exit(1);}
const log=openSync(resolve(cwd,'server.log'),'a');const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd,env:{...process.env,PORT:String(port)},detached:true,stdio:['ignore',log,log]});child.unref();writeFileSync(resolve(cwd,'.server.pid'),String(child.pid));console.log(`Session-only detached server PID ${child.pid}; http://127.0.0.1:${port}`);
