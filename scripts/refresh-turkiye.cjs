'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..');
const BASE='https://api.turkiyeapi.dev/v2';
const KINDS=['provinces','districts','municipalities','neighborhoods','villages'];
async function getJSON(url,fetcher=fetch) {
 const parsed=new URL(url);
 assert(parsed.origin==='https://api.turkiyeapi.dev'&&/^\/v2\/(?:meta|datasets\/(?:\d{4}\/)?(?:provinces|districts|municipalities|neighborhoods|villages)\.json)$/.test(parsed.pathname)&&!parsed.search,'İzin verilmeyen TurkiyeAPI ucu');
 const response=await fetcher(url,{redirect:'error',signal:AbortSignal.timeout(30000),headers:{Accept:'application/json'}});
 assert(response.ok,'API HTTP '+response.status);
 assert(/application\/(?:[\w.+-]*\+)?json/i.test(response.headers.get('content-type')||''),'JSON yanıt gerekli');
 const text=await response.text();assert(Buffer.byteLength(text)<25_000_000,'Yanıt boyutu sınırı aşıldı');
 return JSON.parse(text);
}
function validateSnapshot(snapshot) {
 const meta=snapshot.meta;
 assert(meta&&/^\d{4}$/.test(meta.datasetVersion),'Veri seti sürümü geçersiz');
 assert(/^\d{4}-\d{2}-\d{2}$/.test(meta.lastUpdated),'Güncelleme tarihi geçersiz');
 const ids={};
 for(const kind of KINDS) {
  const rows=snapshot[kind];assert(Array.isArray(rows)&&rows.length===meta.counts[kind],'Eksik veri seti: '+kind);
  ids[kind]=new Set();
  for(const row of rows){assert(Number.isInteger(row.id)&&row.id>0&&typeof row.name==='string'&&row.name.trim(),'Geçersiz kayıt: '+kind);assert(!ids[kind].has(row.id),'Yinelenen kimlik: '+kind);ids[kind].add(row.id);assert(row.population==null||(Number.isInteger(row.population)&&row.population>=0),'Nüfus geçersiz');}
 }
 assert.equal(snapshot.provinces.length,81,'Harita 81 il gerektirir');
 const districts=new Map(snapshot.districts.map(d=>[d.id,d]));
 const municipalities=new Map(snapshot.municipalities.map(d=>[d.id,d]));
 for(const kind of KINDS.slice(1))for(const row of snapshot[kind]){
  assert(ids.provinces.has(row.provinceId),'İl bağlantısı geçersiz: '+kind);
  if(kind!=='districts'){assert(ids.districts.has(row.districtId),'İlçe bağlantısı geçersiz: '+kind);assert.equal(districts.get(row.districtId).provinceId,row.provinceId,'İl/ilçe bağlantısı uyuşmuyor');}
  if(row.municipalityId!=null){assert(ids.municipalities.has(row.municipalityId),'Belediye bağlantısı geçersiz');assert.equal(municipalities.get(row.municipalityId).districtId,row.districtId,'Belediye/ilçe bağlantısı uyuşmuyor');}
 }
 return true;
}
function buildData(snapshot,observedAt) {
 validateSnapshot(snapshot);
 return {schemaVersion:5,sourcePolicy:'user-selected-turkiyeapi',provider:{id:'turkiyeapi',name:'TurkiyeAPI',isGovernment:false,repository:'https://github.com/ubeydeozdmr/turkiye-api',docs:'https://docs.turkiyeapi.dev/',base:BASE,datasetVersion:snapshot.meta.datasetVersion,lastUpdated:snapshot.meta.lastUpdated,observedAt,counts:snapshot.meta.counts},asOf:observedAt.slice(0,10),capacity:null,president:null,mps:[],seats:[],availability:{president:false,parliament:false,calendar:false},coverage:{nationalDistrictCount:snapshot.districts.length},unavailable:{president:'TurkiyeAPI Cumhurbaşkanı veya siyasi parti bilgisi sağlamıyor.',parliament:'TurkiyeAPI milletvekili ve sandalye dağılımı bilgisi sağlamıyor.',calendar:'TurkiyeAPI seçim tarihi veya seçim sonucu bilgisi sağlamıyor.'},provinces:snapshot.provinces.map(p=>({...p,metropolitan:p.isMetropolitan,mayor:null})),districts:snapshot.districts.map(d=>({...d,mayor:null})),municipalities:snapshot.municipalities,apiRuns:KINDS.map(kind=>({sourceId:'turkiyeapi-'+kind,endpoint:`${BASE}/datasets/${kind}.json`,observedAt,status:'ok',imported:snapshot[kind].length}))};
}
function writeSnapshot(snapshot,observedAt) {
 const data=buildData(snapshot,observedAt);
 require('./validate-data.cjs').validate(data);
 const full=Buffer.from(JSON.stringify({observedAt,...snapshot}));
 const packed=zlib.gzipSync(full,{level:9,mtime:0});
 fs.mkdirSync(path.join(root,'data/turkiye-api'),{recursive:true});
 fs.writeFileSync(path.join(root,'data/turkiye-api/dataset.json.gz'),packed);
 fs.writeFileSync(path.join(root,'data/politics.json'),JSON.stringify(data,null,2)+'\n');
 fs.writeFileSync(path.join(root,'data/source-manifest.json'),JSON.stringify({policy:data.sourcePolicy,provider:data.provider,runs:data.apiRuns,snapshot:{path:'data/turkiye-api/dataset.json.gz',sha256:crypto.createHash('sha256').update(packed).digest('hex')}},null,2)+'\n');
 // Yerel dosya önizlemesi için yerleşimler istek üzerine betik olarak yüklenir.
 const rows=[...snapshot.neighborhoods.map(n=>[n.id,n.name,n.population,n.postalCode,n.postalCodeStatus,n.provinceId,n.districtId,n.municipalityId,'mahalle']),...snapshot.villages.map(n=>[n.id,n.name,n.population,n.postalCode,n.postalCodeStatus,n.provinceId,n.districtId,null,'köy'])];
 fs.writeFileSync(path.join(root,'javascript/settlements-data.js'),'window.SETTLEMENT_DATA = '+JSON.stringify(rows)+';\n');
 require('./sync-data.cjs');return data;
}
async function refresh(fetcher=fetch) {
 const {data:meta}=await getJSON(BASE+'/meta',fetcher);
 assert(meta&&/^\d{4}$/.test(meta.datasetVersion),'API metadatası geçersiz');
 const results=await Promise.allSettled(KINDS.map(kind=>getJSON(`${BASE}/datasets/${kind}.json`,fetcher)));
 const snapshot={meta};for(let i=0;i<KINDS.length;i++){if(results[i].status!=='fulfilled')throw results[i].reason;snapshot[KINDS[i]]=results[i].value;}
 // Bütün veri setleri doğrulanmadan son başarılı paket değiştirilmez.
 return writeSnapshot(snapshot,new Date().toISOString());
}
module.exports={getJSON,validateSnapshot,buildData,writeSnapshot,refresh,KINDS,BASE};
if(require.main===module)refresh().then(data=>console.log(JSON.stringify(data.provider.counts))).catch(error=>{console.error('Yenileme başarısız; önceki paketin tarihi korundu: '+error.message);process.exitCode=1;});
