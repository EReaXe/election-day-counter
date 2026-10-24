
'use strict';
function getRemaining(target,now=Date.now()){
 const total=Math.max(0,Math.floor((target-now)/1000));
 return {days:Math.floor(total/86400),hours:Math.floor(total/3600)%24,minutes:Math.floor(total/60)%60,seconds:total%60};
}
function startCountdown(document,dates,clock=Date){
 const cards=[...document.querySelectorAll('[data-election]')].map(card=>({card,target:Date.parse(dates?.[card.dataset.election]),units:[...card.querySelectorAll('[data-unit]')],status:card.querySelector('.status')}));
 let timer;
 function update(){const now=clock.now();for(const {target,units,status}of cards){
  if(!Number.isFinite(target)){units.forEach(n=>n.textContent='—');status.textContent='Tarih bilgisi yüklenemedi.';continue;}
  const remaining=getRemaining(target,now);units.forEach(n=>n.textContent=String(remaining[n.dataset.unit]).padStart(2,'0'));
  status.textContent=target<=now?'Tahmini tarih geldi · Yeni takvim bekleniyor':'Tahmini tarihe kalan süre';
 }}
 function sync(){clearInterval(timer);update();if(!document.hidden&&cards.some(c=>Number.isFinite(c.target)&&c.target>clock.now()))timer=setInterval(update,1000);}
 sync();document.addEventListener('visibilitychange',sync);
 return {update,stop(){clearInterval(timer);document.removeEventListener('visibilitychange',sync);}};
}
if(typeof document!=='undefined')startCountdown(document,window.ELECTIONS);
if(typeof module!=='undefined')module.exports={getRemaining,startCountdown};
