const assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib'),crypto=require('node:crypto');
const data=require('../data/politics.json'),manifest=require('../data/source-manifest.json');
const {validate,validDate}=require('../scripts/validate-data.cjs');
const {validateSnapshot,buildData,KINDS}=require('../scripts/refresh-turkiye.cjs');
const packed=fs.readFileSync(require('node:path').join(__dirname,'../data/turkiye-api/dataset.json.gz'));
const snapshot=JSON.parse(zlib.gunzipSync(packed));
assert(validate(data));assert(!validDate('2026-02-30'));assert(validateSnapshot(snapshot));
assert.equal(crypto.createHash('sha256').update(packed).digest('hex'),manifest.snapshot.sha256);
assert.deepEqual(buildData(snapshot,snapshot.observedAt),data,'Ham beş koleksiyon normalleştirilmiş veriyi birebir üretmeli');
for(const kind of KINDS)assert.equal(snapshot[kind].length,data.provider.counts[kind]);
function badSnapshot(mutate){const copy=structuredClone(snapshot);mutate(copy);assert.throws(()=>validateSnapshot(copy));}
badSnapshot(s=>s.neighborhoods.pop());badSnapshot(s=>s.districts[1].id=s.districts[0].id);badSnapshot(s=>s.villages[0].districtId=-1);badSnapshot(s=>s.provinces[0].population=-1);badSnapshot(s=>s.municipalities[0].provinceId=999);
for(const mutate of [d=>d.provider.isGovernment=true,d=>d.provinces[0].mayor={name:'injected'},d=>d.availability.parliament=true,d=>d.apiRuns[0].endpoint='https://example.com']){const copy=structuredClone(data);mutate(copy);assert.throws(()=>validate(copy));}
assert.deepEqual(require('../javascript/data-quality.js').summarize(data),require('../data/quality-report.json'));
console.log('Tüm koleksiyonlar, ilişkiler, parmak izi ve ham veriden yeniden üretim geçti.');
