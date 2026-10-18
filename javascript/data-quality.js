'use strict';
(function(root) {
  function summarize(data) {
    const all = data.provinces.concat(data.districts);
    const records = all.map(e => e.mayor).filter(Boolean);
    return {
      asOf:data.asOf,
      districtTotal:data.districts.length,
      districtRecords:data.districts.filter(d=>d.mayor).length,
      districtMissing:data.districts.filter(d=>!d.mayor).length,
      officialDistricts:data.districts.filter(d=>d.mayor?.verification==='primary').length,
      compilationDistricts:data.districts.filter(d=>d.mayor?.verification==='secondary').length,
      officialProvinces:data.provinces.filter(p=>p.mayor?.verification==='primary').length,
      compilationProvinces:data.provinces.filter(p=>p.mayor?.verification==='secondary').length,
      conflicts:records.filter(r=>r.verification==='conflict').length,
      independentlyVerified:records.filter(r=>r.lastVerifiedAt).length,
      electionPartyKnown:records.filter(r=>r.electedParty).length,
      provinceCoverage:data.provinces.map(p=>({id:p.id,name:p.name,districts:data.districts.filter(d=>d.provinceId===p.id).length,records:data.districts.filter(d=>d.provinceId===p.id&&d.mayor).length,official:data.districts.filter(d=>d.provinceId===p.id&&d.mayor?.verification==='primary').length}))
    };
  }
  function freshness(record, now = Date.now()) {
    const stamp=Date.parse(record.retrievedAt+'T12:00:00+03:00');
    if (!Number.isFinite(stamp)) return 'unknown';
    return now-stamp>30*86400000 ? 'review-due' : 'recently-read';
  }
  const api={summarize,freshness};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.DATA_QUALITY=api;
})(typeof window!=='undefined'?window:globalThis);
