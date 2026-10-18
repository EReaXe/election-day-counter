'use strict';
const assert = require('node:assert/strict');
function validDate(value) {
  return typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value;
}
function validate(data) {
  assert.equal(data.schemaVersion,3,'Veri şeması sürümü 3 olmalı');
  assert(validDate(data.asOf),'Kaynak tarihi geçersiz');
  assert.equal(data.provinces.length,81,'81 il bulunmalı');
  const provinceIds=new Set(data.provinces.map(p=>p.id));
  assert.equal(provinceIds.size,81,'İl kodları tekrar edemez');
  assert.equal(new Set(data.districts.map(d=>d.id)).size,data.districts.length,'İlçe kimlikleri tekrar edemez');
  assert.equal(new Set(data.mps.map(m=>m.url)).size,data.mps.length,'Vekil profilleri tekrar edemez');
  assert.equal(new Set(data.seats.map(s=>s.party)).size,data.seats.length,'Parti toplamları tekrar edemez');
  assert.equal(data.seats.reduce((n,s)=>n+s.count,0),data.mps.length,'Sandalye toplamı vekil sayısıyla eşleşmeli');
  assert(data.mps.length<=data.capacity,'Kapasite aşılamaz');
  for(const s of data.seats) {
    assert(Number.isInteger(s.count)&&s.count>=0,'Sandalye sayısı negatif olamaz');
    assert.equal(data.mps.filter(m=>m.party===s.party).length,s.count,'Parti sayısı eşleşmeli: '+s.party);
  }
  for(const m of data.mps)assert(provinceIds.has(m.provinceId),'Vekil geçerli bir ile bağlı olmalı');
  for(const d of data.districts)assert(provinceIds.has(d.provinceId),'İlçe geçerli bir ile bağlı olmalı');
  for(const entity of data.provinces.concat(data.districts)) {
    const record=entity.mayor;if(!record)continue;
    assert(['primary','secondary','conflict'].includes(record.verification),'Kaynak durumu geçersiz');
    assert(record.name&&record.officeHolder?.name===record.name,'Görevi yürüten kişinin kaydı eksik');
    assert(validDate(record.retrievedAt),'Kaynak okuma tarihi geçersiz');
    assert(record.retrievedAt<=data.asOf,'Okuma tarihi veri tarihinden sonra olamaz');
    assert(record.lastVerifiedAt===null||validDate(record.lastVerifiedAt),'Bağımsız doğrulama tarihi geçersiz');
    assert(record.electedParty===null||record.electionSource,'Seçildiği parti için seçim kaynağı gerekli');
    assert(Array.isArray(record.claims)&&record.claims.length,'Kaynak bildirimi gerekli');
    for(const claim of record.claims) {
      const url=new URL(claim.source);
      assert(url.protocol==='https:'||url.protocol==='http:','Güvenli kaynak URL gerekli');
      assert(validDate(claim.retrievedAt),'Bildirim okuma tarihi geçersiz');
      assert(claim.sourceLabel&&claim.name,'Kaynak adı ve kişi gerekli');
    }
    if(record.verification==='conflict') {
      assert.equal(record.currentParty,null,'Çelişkili kayda kesin güncel parti atanamaz');
      assert.equal(record.party,null,'Çelişkili kayda kesin harita partisi atanamaz');
      assert(record.conflictNote&&record.claims.length>=2,'Çelişki açıklaması ve iki bildirim gerekli');
    }
    if(record.verification==='secondary')assert.equal(record.currentParty,null,'Derleme güncel parti doğrulaması değildir');
  }
  return true;
}
module.exports={validate,validDate};
