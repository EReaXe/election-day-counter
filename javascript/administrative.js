'use strict';
(() => {
 const format=value=>Number.isFinite(value)?new Intl.NumberFormat('tr-TR',{maximumFractionDigits:2}).format(value):'—';
 const node=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 function facts(pairs){const dl=node('dl','admin-facts');for(const [label,value]of pairs){const group=node('div');group.append(node('dt','',label),node('dd','',value));dl.append(group);}return dl;}
 function renderProvince(p,container){
  container.replaceChildren(node('p','person-role','TurkiyeAPI · '+window.POLITICS_DATA.provider.datasetVersion+' veri seti'),node('h4','',format(p.population)+' kişi'));
  container.append(facts([['Bölge',p.region?.tr||'—'],['Yüzölçümü',p.area?format(p.area.value)+' '+p.area.unit:'—'],['Rakım',p.altitude?format(p.altitude.value)+' '+p.altitude.unit:'—'],['Telefon alan kodu',p.phoneAreaCodes?.join(' / ')||'—'],['Koordinat',p.coordinates?format(p.coordinates.latitude)+' / '+format(p.coordinates.longitude):'—'],['Kıyı ili',p.isCoastal?'Evet':'Hayır']]));
  container.append(node('p','verification','Başkan ve parti bilgisi bu veri kaynağında bulunmuyor.'));
 }
 let pending;
 function loadSettlements(){
  if(window.SETTLEMENT_DATA)return Promise.resolve(window.SETTLEMENT_DATA);
  if(!pending)pending=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='javascript/settlements-data.js';script.onload=()=>{if(window.SETTLEMENT_DATA)resolve(window.SETTLEMENT_DATA);else{pending=null;reject(Error('Veri paketi boş.'));}};script.onerror=()=>{script.remove();pending=null;reject(Error('Yerleşim paketi yüklenemedi.'));};document.head.append(script);});
  return pending;
 }
 function districtDetails(d,data){
  const group=node('div','district-admin');
  group.append(facts([['Nüfus',format(d.population)],['Yüzölçümü',d.area?format(d.area.value)+' '+d.area.unit:'—'],['Mahalle',format(d.stats?.neighborhoodCount)],['Köy',format(d.stats?.villageCount)]]));
  const municipalities=data.municipalities.filter(m=>m.districtId===d.id);
  const local=node('details','record-evidence');local.append(node('summary','','Belediyeler ('+municipalities.length+')'));
  const types={province_center:'İl merkezi',district_center:'İlçe merkezi',town:'Belde'};
  for(const m of municipalities)local.append(node('p','source-line',m.name+' · '+(types[m.type]||m.type)+' · '+format(m.population)+' kişi'));
  group.append(local);
  const settlements=node('details','settlement-browser');settlements.append(node('summary','','Mahalle ve köyleri keşfet'));
  let started=false;
  settlements.addEventListener('toggle',async()=>{
   if(!settlements.open||started)return;started=true;
   const body=node('div','settlement-body');body.append(node('p','muted','Yerleşimler yükleniyor…'));settlements.append(body);
   try{
    const rows=(await loadSettlements()).filter(r=>r[6]===d.id).sort((a,b)=>a[1].localeCompare(b[1],'tr'));
    body.replaceChildren();const search=node('input');search.type='search';search.placeholder='Mahalle veya köy ara';search.setAttribute('aria-label',d.name+' mahalle/köy ara');
    const list=node('div','settlement-list');const count=node('p','muted');const more=node('button','share','Daha fazla göster');more.type='button';
    body.append(search,count,list,more);let limit=50;
    function render(){const q=search.value.trim().toLocaleLowerCase('tr-TR');const selected=rows.filter(r=>r[1].toLocaleLowerCase('tr-TR').includes(q));list.replaceChildren(...selected.slice(0,limit).map(r=>{const item=node('div','settlement-row');item.append(node('strong','',r[1]),node('span','',r[8]+' · '+format(r[2])+' kişi'),node('small','',r[3]?'Posta kodu: '+r[3]+' · '+({official:'PTT eşleşmesi',approximate:'Yaklaşık',unknown:'Belirsiz'}[r[4]]||r[4]):'Posta kodu belirtilmedi'));return item;}));count.textContent=selected.length+' kayıt · '+Math.min(limit,selected.length)+' gösteriliyor';more.hidden=selected.length<=limit;}
    search.addEventListener('input',()=>{limit=50;render();});more.addEventListener('click',()=>{limit+=50;render();});render();
   }catch(error){body.replaceChildren(node('p','unknown',error.message));started=false;}
  });
  group.append(settlements);return group;
 }
 window.ADMIN_UI={format,renderProvince,districtDetails,loadSettlements};
})();
