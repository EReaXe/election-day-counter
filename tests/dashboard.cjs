const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {parseHTML} = require('linkedom');
const root = path.resolve(__dirname, '..');
const {document, Event} = parseHTML(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
// linkedom select.value için yalnızca getter sunuyor; tarayıcı setter'ını taklit et.
const selectPrototype = Object.getPrototypeOf(document.querySelector('select'));
const selectValue = Object.getOwnPropertyDescriptor(selectPrototype,'value');
Object.defineProperty(selectPrototype,'value',{get(){return this.querySelector('option[selected]')?.value || this.querySelector('option')?.value || '';},set(value){for(const option of this.querySelectorAll('option')) option.removeAttribute('selected'); const match=[...this.querySelectorAll('option')].find(o=>o.value===String(value));if(match)match.setAttribute('selected','');},configurable:true});
const events = {};
const location = {hash:''};
const window = {addEventListener:(name,callback) => { events[name]=callback; }};
const context = vm.createContext({window,document,location,history:{replaceState:(_,__,hash) => { location.hash=hash; }},URL,URLSearchParams,Intl,console});
for (const file of ['politics-data.js','data-quality.js','map-data.js','administrative.js','politics.js']) vm.runInContext(fs.readFileSync(path.join(root,'javascript',file),'utf8'),context,{filename:file});
const $ = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];


(async()=>{
const data=window.POLITICS_DATA;
assert.equal(all('#turkey-map [role="button"]').length,81);
assert.equal($('#map-mode').value,'population');assert.equal($('#province-title').textContent,'İstanbul');
assert.equal(all('#district-list .person-row').length,39);
assert.match($('#province-mayor').textContent,/TurkiyeAPI/);assert.match($('#province-mayor').textContent,/kişi/);
assert.equal(all('#seat-chart circle').length,0);assert.equal($('#seat-total').textContent,'—');
assert.match($('#mp-list').textContent,/TurkiyeAPI/);
$('#district-search').value='Beyoğlu';$('#district-search').dispatchEvent(new Event('input'));assert.equal(all('#district-list .person-row').length,1);
assert.match($('#district-list').textContent,/Belediyeler/);
const district=data.districts.find(d=>d.name==='Beyoğlu');
window.SETTLEMENT_DATA=Array.from({length:65},(_,i)=>[i,i===0?'İNCİ':'Yerleşim '+i,100,'34000','approximate',34,district.id,null,'mahalle']);
const detail=$('.settlement-browser');detail.open=true;detail.dispatchEvent(new Event('toggle'));await Promise.resolve();await Promise.resolve();
assert.equal(all('.settlement-row').length,50);$('.settlement-body button').dispatchEvent(new Event('click'));assert.equal(all('.settlement-row').length,65);
$('.settlement-body input').value='inci';$('.settlement-body input').dispatchEvent(new Event('input'));assert.equal(all('.settlement-row').length,1);assert.match($('.settlement-row').textContent,/Yaklaşık/);
$('#district-search').value='olmayan';$('#district-search').dispatchEvent(new Event('input'));assert.match($('#district-list').textContent,/bulunamadı/);
$('#turkey-map [data-plakakodu="35"]').dispatchEvent(new Event('click'));assert.equal($('#province-title').textContent,'İzmir');
const ids=all('[id]').map(n=>n.id);assert.equal(new Set(ids).size,ids.length);
window.matchMedia=()=>({matches:false,addEventListener(){}});context.localStorage={getItem(){return null;},setItem(){}};context.setInterval=()=>1;context.clearInterval=()=>{};
vm.runInContext(fs.readFileSync(path.join(root,'javascript/timer.js'),'utf8'),context);
assert(all('.calendar').every(n=>n.hidden));assert(all('.election time').every(n=>!n.getAttribute('datetime')));
assert.equal(all('#quality-metrics .quality-metric').length,4);
console.log('Harita, ilçe araması, belediyeler, yerleşim sayfalama/arama ve boş siyasi alanlar geçti.');
})().catch(e=>{console.error(e);process.exitCode=1;});
