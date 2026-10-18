const assert=require('node:assert/strict');
const {getJSON,BASE}=require('../scripts/refresh-turkiye.cjs');
const response=(status,type,text)=>({ok:status===200,status,headers:new Headers({'content-type':type}),text:async()=>text});
(async()=>{
 for(const [status,type,text,pattern]of [[503,'application/json','[]',/HTTP/],[200,'text/html','oops',/JSON/],[200,'application/json','broken',SyntaxError]])await assert.rejects(()=>getJSON(BASE+'/meta',async()=>response(status,type,text)),pattern);
 for(const url of ['https://example.com/v2/meta',BASE+'/datasets/provinces.json?x=1',BASE+'/other'])await assert.rejects(()=>getJSON(url),/İzin verilmeyen/);
 await assert.rejects(()=>getJSON(BASE+'/meta',async()=>{throw Error('offline');}),/offline/);
 assert.deepEqual(await getJSON(BASE+'/meta',async(url,options)=>{assert.equal(options.redirect,'error');return response(200,'application/json','{"data":{}}');}),{data:{}});
 console.log('API hata ve izin listesi kontrolleri geçti.');
})().catch(e=>{console.error(e);process.exitCode=1;});
