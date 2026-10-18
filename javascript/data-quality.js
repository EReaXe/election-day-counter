
'use strict';
(function(root){
 function summarize(data){return {asOf:data.asOf,provider:data.provider,collections:data.provider.counts,politicalAvailability:data.availability,provinceCoverage:data.provinces.map(p=>({id:p.id,name:p.name,districts:data.districts.filter(d=>d.provinceId===p.id).length,municipalities:data.municipalities.filter(m=>m.provinceId===p.id).length}))};}
 const api={summarize};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DATA_QUALITY=api;
})(typeof window!=='undefined'?window:globalThis);
