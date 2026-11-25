// Run with Node 22.13+ from this checkout. READY_DB should point to durable storage.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const missions=require('../../cyberscot/ready/missions');
const root=path.resolve(__dirname,'../../cyberscot');
const db=new DatabaseSync(process.env.READY_DB||path.join(__dirname,'records.sqlite'));
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS records (id TEXT PRIMARY KEY, body TEXT NOT NULL)');
const put=db.prepare('INSERT OR IGNORE INTO records VALUES (?,?)'), get=db.prepare('SELECT body FROM records WHERE id=?');
function validated(input){
  if(!input||input.version!==1||typeof input.learner!=='string'||!/^(DEMO-001|CS-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4})$/.test(input.learner))return;
  const m=missions.find(m=>m.id===input.mission);
  if(!m||!Array.isArray(input.steps)||input.steps.length!==m.steps.length)return;
  const steps=[];
  for(const [i,s] of input.steps.entries()){
    const qs=m.steps[i].questions;
    if(!s||!Number.isSafeInteger(s.attempts)||s.attempts<1||!Array.isArray(s.choices)||s.choices.length!==qs.length||!qs.every((q,j)=>s.choices[j]===q.answer))return;
    steps.push({choices:s.choices,attempts:s.attempts,passed:true});
  }
  return {version:1,mission:m.id,learner:input.learner,steps};
}
const send=(res,status,obj)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj))};
const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.json':'application/json'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/cyberscot/ready/api/record'){
   const token=/^Bearer ([a-f0-9]{48})$/.exec(req.headers.authorization||'');
   if(!token)return send(res,401,{});
   const id=createHash('sha256').update(token[1]).digest('hex');
   if(req.method==='GET'){const row=get.get(id);return send(res,row?200:404,row?JSON.parse(row.body):{})}
   if(req.method!=='PUT')return send(res,405,{});
   let body='',size=0;for await(const chunk of req){size+=chunk.length;if(size>8192)return send(res,413,{});body+=chunk}
   let record;try{record=validated(JSON.parse(body))}catch{return send(res,400,{})}
   if(!record)return send(res,422,{});
   put.run(id,JSON.stringify(record));return send(res,get.get(id).body===JSON.stringify(record)?200:409,{saved:get.get(id).body===JSON.stringify(record)});
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,{});
  if(url.pathname==='/'){res.writeHead(302,{Location:'/cyberscot/ready/'});return res.end()}
  if(!url.pathname.startsWith('/cyberscot/'))return send(res,404,{});
  let file=path.resolve(root,'.'+decodeURIComponent(url.pathname.slice('/cyberscot'.length)));
  if(file!==root&&!file.startsWith(root+path.sep))return send(res,404,{});
  if(fs.statSync(file,{throwIfNoEntry:false})?.isDirectory())file=path.join(file,'index.html');
  if(!types[path.extname(file)]||!fs.statSync(file,{throwIfNoEntry:false})?.isFile())return send(res,404,{});
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res);
 }catch{if(!res.headersSent)send(res,500,{});else res.end()}
}).listen(Number(process.env.PORT||8080),process.env.HOST||'127.0.0.1');
