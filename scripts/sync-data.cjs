/* JSON veya SVG kaynağı elle güncellendiğinde yerel dosya paketlerini yeniden üretir.
   Siyasi bilgilerin doğruluğunu doğrulamaz; kaynak denetimi ayrıca yapılmalıdır. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root,'data/politics.json'),'utf8'));
require('./validate-data.cjs').validate(data);
assert.equal(data.provinces.length,81,'81 il bulunmalı');
assert.equal(new Set(data.provinces.map(p=>p.id)).size,81,'İl kodları tekil olmalı');
assert.equal(data.seats.reduce((n,s)=>n+s.count,0),data.mps.length,'Sandalye ve vekil toplamı eşleşmeli');
assert(data.mps.length<=data.capacity,'Kapasite aşılamaz');
for(const seat of data.seats) assert.equal(data.mps.filter(m=>m.party===seat.party).length,seat.count,seat.party+' parti sayısı eşleşmeli');
for(const district of data.districts) assert(data.provinces.some(p=>p.id===district.provinceId),'İlçe geçerli bir ile bağlı olmalı');
const svg = fs.readFileSync(path.join(root,'data/turkey.svg'),'utf8');
assert.equal((svg.match(/data-plakakodu=/g)||[]).length,81,'Haritada 81 il olmalı');
assert(!/<(?:script|foreignObject)\b|\son\w+\s*=/i.test(svg),'Haritada etkin içerik bulunamaz');
fs.writeFileSync(path.join(root,'javascript/politics-data.js'),'/* Kaynaklar: data/politics.json ve THIRD-PARTY.md. Güncel anlık yayın değildir. */\nwindow.POLITICS_DATA = '+JSON.stringify(data)+';\n');
fs.writeFileSync(path.join(root,'javascript/map-data.js'),'window.TURKEY_MAP = '+JSON.stringify(svg)+';\n');
const quality=require('../javascript/data-quality.js').summarize(data);
fs.writeFileSync(path.join(root,'data/quality-report.json'),JSON.stringify(quality,null,2)+'\n');
console.log('Veri ve harita paketleri yenilendi.');
