
const assert=require('node:assert/strict');
const data=require('../data/politics.json');
const {validate,validDate}=require('../scripts/validate-data.cjs');
const {summarize,freshness}=require('../javascript/data-quality.js');
const {initialData,importIzmir,registry}=require('../scripts/refresh-official.cjs');
const rows=require('../data/api/izmir-meclis.json');
const fs=require('node:fs');const crypto=require('node:crypto');const path=require('node:path');
assert(validate(data));assert(!validDate('2026-02-30'));
assert.equal(data.mps.length,0);assert.equal(data.seats.length,0);assert.equal(data.capacity,null);assert.equal(data.president,null);
assert(data.apiRuns.some(r=>r.status==='ok'));
const run=data.apiRuns.find(r=>r.status==='ok');
const raw=fs.readFileSync(path.join(__dirname,'../data/api/izmir-meclis.json'));
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),run.sha256);
const expected=initialData(data.asOf);importIzmir(expected,rows,registry.sources[0],run.observedAt);
assert.deepEqual(data.provinces,expected.provinces,'Kayıtlar ham API yanıtından yeniden üretilebilmeli');
assert.deepEqual(data.districts,expected.districts);
const quality=summarize(data);assert.equal(quality.compilationDistricts,0);assert.equal(quality.electionPartyKnown,0);
for(const e of data.provinces.concat(data.districts))if(e.mayor) {
 assert.equal(e.mayor.sourceType,'official-api');
 assert(e.mayor.claims.every(c=>c.sourceType==='official-api'));
 assert(e.mayor.claims.every(c=>!c.observationMethod));
}
function rejects(mutate,pattern) {const copy=structuredClone(data);mutate(copy);assert.throws(()=>validate(copy),pattern);}
rejects(d=>{d.availability.parliament=true;},/adaptörü/);
rejects(d=>{d.mps.push({name:'Eski HTML verisi'});},/API yokken/);
rejects(d=>{d.president={name:'HTML verisi'};},/API yokken/);
rejects(d=>{d.districts.find(d=>d.mayor).mayor.sourceType='official-html';},/resmî API/);
rejects(d=>{d.districts.find(d=>d.mayor).mayor.source='https://www.tbmm.gov.tr/milletvekili/AllList';},/izin listesi/);
rejects(d=>{d.districts.find(d=>d.mayor).mayor.claims[0].sourceType='compilation';},/derleme/);
rejects(d=>{d.provinces.find(p=>p.id===35).mayor.currentParty='AK Parti';},/İncelemedeki/);
rejects(d=>{d.districts.find(d=>d.mayor).mayor.electedParty='CHP';},/seçildiği parti/);
const empty=initialData(data.asOf);assert(validate(empty));
assert(importIzmir(empty,rows,registry.sources[0],new Date().toISOString())>0);
assert(validate(empty));
assert.throws(()=>importIzmir(initialData(data.asOf),{},registry.sources[0],''),/liste/);
assert.throws(()=>importIzmir(initialData(data.asOf),rows,{...registry.sources[0],endpoint:'https://example.com/api'},''),/İzin verilmeyen/);
assert.throws(()=>importIzmir(initialData(data.asOf),[{adi:'Eksik'}],registry.sources[0],''),/alanı eksik/);
const duplicate=rows.filter(r=>r.title.includes('BELEDİYE BAŞKAN'))[0];
assert.throws(()=>importIzmir(initialData(data.asOf),[duplicate,duplicate],registry.sources[0],''),/birden fazla/);
assert.equal(freshness({retrievedAt:'2026-10-18'},Date.parse('2026-11-19T12:00:00+03:00')),'review-due');
console.log('Resmî API izin listesi, HTML/derleme reddi, bozuk yanıt, yinelenen görev ve eksik veri kontrolleri geçti.');
