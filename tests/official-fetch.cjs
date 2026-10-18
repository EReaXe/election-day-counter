const assert=require('node:assert/strict');
const {readOfficial,registry}=require('../scripts/refresh-official.cjs');
const source=registry.sources[0];
const response=(status,type,text)=>({ok:status===200,status,headers:new Headers({'content-type':type}),text:async()=>text});
(async()=>{
 await assert.rejects(()=>readOfficial(source,async()=>response(200,'text/html','<html>Hata</html>')),/JSON dönmedi/);
 await assert.rejects(()=>readOfficial(source,async()=>response(503,'application/json','[]')),/HTTP 503/);
 await assert.rejects(()=>readOfficial(source,async()=>response(200,'application/json','bozuk')),SyntaxError);
 await assert.rejects(()=>readOfficial(source,async()=>{throw Error('Bağlantı kesildi');}),/Bağlantı kesildi/);
 await assert.rejects(()=>readOfficial({...source,endpoint:'https://example.com'},async()=>{throw Error('Çağrılmamalı');}),/İzin verilmeyen/);
 const result=await readOfficial(source,async(url,options)=>{assert.equal(url,source.endpoint);assert.equal(options.redirect,'error');assert.equal(options.headers.Accept,'application/json');return response(200,'application/json','[]');});
 assert.deepEqual(result.rows,[]);
 console.log('API HTTP hatası, HTML yanıtı, bozuk JSON, bağlantı hatası ve yönlendirme politikası kontrolleri geçti.');
})().catch(error=>{console.error(error);process.exitCode=1;});
