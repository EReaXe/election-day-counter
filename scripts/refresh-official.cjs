'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const registry=JSON.parse(fs.readFileSync(path.join(root,'data/official-api-sources.json'),'utf8'));
const geography=JSON.parse(fs.readFileSync(path.join(root,'data/map-regions.json'),'utf8'));
const ENDPOINT='https://acikveriwapi.izmir.bel.tr/IzBel/MeclisUyeleriniGetir';
const norm=s=>s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').trim();
const party=s=>({'ak parti':'AK Parti','chp':'CHP','yeni parti':'Yeni Parti','bagimsiz':'Bağımsız','mhp':'MHP','iyi parti':'İYİ Parti','dem parti':'DEM Parti'})[norm(s)]||s.trim();
function initialData(date) {
 return {schemaVersion:4,sourcePolicy:'official-api-only',asOf:date,capacity:null,president:null,mps:[],seats:[],coverage:{nationalDistrictCount:null},availability:{president:false,parliament:false,calendar:false},unavailable:registry.unavailable,provinces:geography.regions.map(p=>({...p,mayor:null})),districts:[],apiRuns:[]};
}
function importIzmir(data,rows,source,observedAt) {
 assert.equal(source.endpoint,ENDPOINT,'İzin verilmeyen API');
 assert(Array.isArray(rows)&&rows.length>0&&rows.length<1000,'API yanıtı beklenen liste değil');
 const seen=new Set();let imported=0;
 for(let index=0;index<rows.length;index++) {
  const row=rows[index];
  for(const key of ['adi','soyadi','title','parti'])assert.equal(typeof row[key],'string','API alanı eksik: '+key);
  const title=row.title.trim();
  if(!title.includes('BELEDİYE BAŞKAN'))continue;
  const citywide=title.includes('BÜYÜKŞEHİR');
  let entity;
  if(citywide) {
   entity=data.provinces.find(p=>p.id===35);entity.name='İzmir';entity.metropolitan=true;
  } else {
   const districtName=title.split(' BELEDİYE')[0].trim();
   const id='izmir:'+norm(districtName);
   entity=data.districts.find(d=>d.id===id);
   if(!entity){entity={id,name:districtName,provinceId:35,mayor:null};data.districts.push(entity);}
  }
  assert(entity,'API belediye adı ilçe ile eşleşmedi: '+title);
  const key=(citywide?'province:':'district:')+entity.id;
  assert(!seen.has(key),'API aynı göreve birden fazla kayıt bildirdi: '+key);seen.add(key);
  const name=(row.adi.trim()+' '+row.soyadi.trim()).replace(/\s+/g,' ');
  const role=title.includes('VEKİL')?'Başkan vekili':'Belediye başkanı';
  const reportedParty=party(row.parti);
  const quarantined=source.quarantine.includes(key);
  entity.mayor={name,role,party:quarantined?null:reportedParty,currentParty:quarantined?null:reportedParty,electedParty:null,verification:quarantined?'review-required':'primary',currentPartyStatus:quarantined?'review-required':'source-reported',sourceType:'official-api',sourceId:source.id,source:source.endpoint,sourceLabel:source.publisher+' · Resmî API',retrievedAt:data.asOf,observedAt,lastVerifiedAt:null,officeHolder:{name,role,status:'source-reported'},claims:[{name,role,party:reportedParty,source:source.endpoint,sourceLabel:source.publisher,sourceType:'official-api',retrievedAt:data.asOf,publishedAt:null,payloadIndex:index}],...(quarantined?{fieldNotes:{currentParty:'Bu kayıt incelemede. API bildirimi tek başına güncel parti olarak yayımlanmıyor.'}}:{})};
  imported++;
 }
 assert(imported>0,'API yanıtında başkan kaydı yok');return imported;
}
async function readOfficial(source,fetcher=fetch) {
 assert.equal(source.endpoint,ENDPOINT,'İzin verilmeyen API');
 const response=await fetcher(source.endpoint,{redirect:'error',signal:AbortSignal.timeout(20000),headers:{Accept:'application/json'}});
 assert(response.ok,'API HTTP '+response.status);
 assert(/application\/(?:[\w.+-]*\+)?json/i.test(response.headers.get('content-type')||''),'API JSON dönmedi');
 const raw=await response.text();assert(Buffer.byteLength(raw)<2_000_000,'API yanıtı çok büyük');
 return {raw,rows:JSON.parse(raw)};
}
async function refresh(fetcher=fetch) {
 const now=new Date().toISOString(),data=initialData(now.slice(0,10));
 let failed=false;
 for(const source of registry.sources) {
  try {
   const {raw,rows}=await readOfficial(source,fetcher),candidate=structuredClone(data);
   const imported=importIzmir(candidate,rows,source,now);
   data.provinces=candidate.provinces;data.districts=candidate.districts;
   data.apiRuns.push({sourceId:source.id,endpoint:source.endpoint,observedAt:now,status:'ok',imported,sha256:crypto.createHash('sha256').update(raw).digest('hex')});
   fs.mkdirSync(path.join(root,'data/api'),{recursive:true});fs.writeFileSync(path.join(root,'data/api/izmir-meclis.json'),raw);
  } catch(error) {
   failed=true;data.apiRuns.push({sourceId:source.id,endpoint:source.endpoint,observedAt:now,status:'error',message:error.message});
  }
 }
 require('./validate-data.cjs').validate(data);
 fs.writeFileSync(path.join(root,'data/politics.json'),JSON.stringify(data,null,2)+'\n');
 fs.writeFileSync(path.join(root,'data/source-manifest.json'),JSON.stringify({policy:'official-api-only',runs:data.apiRuns},null,2)+'\n');
 require('./sync-data.cjs');
 if(failed)throw Error('Resmî API yenilemesi başarısız; eski HTML/derleme kayıtlarına dönülmedi.');
 return data;
}
module.exports={initialData,importIzmir,readOfficial,refresh,registry};
if(require.main===module)refresh().then(data=>console.log('Resmî API kayıtları: '+data.districts.filter(d=>d.mayor).length+' ilçe')).catch(error=>{console.error(error.message);process.exitCode=1;});
