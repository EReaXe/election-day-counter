'use strict';
const assert=require('node:assert/strict');
function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
function validate(data){
 assert.equal(data.schemaVersion,5,'Veri şeması 5 olmalı');assert.equal(data.sourcePolicy,'user-selected-turkiyeapi','Seçilen veri kaynağı TurkiyeAPI olmalı');
 assert.equal(data.provider.id,'turkiyeapi');assert.equal(data.provider.isGovernment,false,'Bağımsız proje resmî kurum olarak gösterilemez');
 assert(validDate(data.asOf)&&validDate(data.provider.lastUpdated));
 assert.equal(data.provinces.length,81);assert.equal(new Set(data.provinces.map(p=>p.id)).size,81);
 for(const [kind,rows] of [['provinces',data.provinces],['districts',data.districts],['municipalities',data.municipalities]]){
  assert.equal(rows.length,data.provider.counts[kind],'Eksik koleksiyon: '+kind);assert.equal(new Set(rows.map(r=>r.id)).size,rows.length,'Yinelenen kimlik');
  for(const row of rows)assert(typeof row.name==='string'&&row.name.trim()&&Number.isInteger(row.id));
 }
 const provinces=new Set(data.provinces.map(p=>p.id));const districts=new Map(data.districts.map(d=>[d.id,d]));
 for(const d of data.districts)assert(provinces.has(d.provinceId));
 for(const m of data.municipalities){assert(districts.has(m.districtId));assert.equal(districts.get(m.districtId).provinceId,m.provinceId);}
 assert.equal(data.president,null,'Kaynakta Cumhurbaşkanı bilgisi yok');assert.equal(data.capacity,null);assert.equal(data.mps.length,0);assert.equal(data.seats.length,0);
 for(const e of data.provinces.concat(data.districts))assert.equal(e.mayor,null,'Kaynakta başkan veya parti bilgisi yok');
 for(const key of ['president','parliament','calendar'])assert.equal(data.availability[key],false,'Kaynağın sağlamadığı siyasi alan açılamaz');
 for(const run of data.apiRuns){assert.equal(run.status,'ok');assert(/^https:\/\/api\.turkiyeapi\.dev\/v2\/datasets\/(provinces|districts|municipalities|neighborhoods|villages)\.json$/.test(run.endpoint),'İzin verilmeyen kaynak');}
 assert.equal(data.apiRuns.length,5);return true;
}
module.exports={validate,validDate};

