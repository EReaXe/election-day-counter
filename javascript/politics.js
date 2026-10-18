'use strict';

(() => {
  const data = window.POLITICS_DATA;
  if (!data || !window.TURKEY_MAP) {
    document.querySelector('#coverage-note').textContent = 'Veriler yüklenemedi. Sayfayı yenileyin veya veri dosyalarını kontrol edin.';
    return;
  }
  const colors = {'AK Parti':'#ed9b25','CHP':'#e24b55','DEM Parti':'#9563c7','MHP':'#b74849','İYİ Parti':'#39a7cb','Yeni Parti':'#4067d8','Yeni Yol':'#41a495','Yeniden Refah':'#5d8970','Bağımsız':'#8894a5','TİP':'#d65c83','HÜDA PAR':'#b59b43','DBP':'#8460ad','EMEP':'#bb677d','Saadet':'#a1666a','DSP':'#609ec8','DP':'#bc6d54','BBP':'#b78562','Atanmış yönetim':'#64748b','Bilgi bekleniyor':'#c1c9d4','Eşit dağılım':'#8a94a4'};
  const color = party => colors[party] || '#78899c';
  const $ = selector => document.querySelector(selector);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function link(text, url) {
    const node = el('a', '', text);
    // Veri güncellemelerinde çalıştırılabilir veya yerel URL'ler kabul edilmez.
    try { if (!['https:', 'http:'].includes(new URL(url).protocol)) return el('span', '', text); }
    catch { return el('span', '', text); }
    node.href = url; node.target = '_blank'; node.rel = 'noopener noreferrer'; return node;
  }
  function pill(party, suffix = '') {
    const node = el('span', 'party-pill');
    const dot = el('span', 'party-dot'); dot.style.setProperty('--party-color', color(party));
    node.append(dot, document.createTextNode(party + suffix)); return node;
  }
  const date = new Intl.DateTimeFormat('tr-TR', {day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Istanbul'}).format(new Date(data.asOf + 'T12:00:00+03:00'));
  $('#snapshot-date').textContent = 'Kaynak okuma · ' + date;
  const districtKnown = data.districts.filter(d => d.mayor).length;
  $('#coverage-note').textContent = `81 il ve ${data.districts.length} ilçe listelenir. ${districtKnown} ilçede başkan kaydı bulunuyor; diğer ilçelerde resmî doğrulama bekleniyor. İl belediyelerinde İstanbul ve İzmir resmî listelerden, diğer iller resmî teyit bekleyen derlemeden gösterilir. Bu bir canlı veri yayını değildir.`;

  const president = el('article', 'summary-card');
  const profile = el('div');
  profile.append(el('span', 'eyebrow', 'CUMHURBAŞKANI'), el('h3', '', data.president.name), pill(data.president.party), el('br'), link('Cumhurbaşkanlığı kaynağı ↗', data.president.source));
  president.append(el('div', 'summary-monogram', 'RTE'), profile);
  $('#representation-summary').append(president);
  const occupied = data.seats.reduce((sum, s) => sum + s.count, 0);
  for (const [value, title, detail] of [[occupied, 'Milletvekili', `${data.capacity - occupied} boş sandalye · ${data.capacity} kapasite`], [81, 'İl, tek harita', `${data.districts.length} ilçe · kaynaklı kayıtlar`]]) {
    const card = el('article', 'summary-card'); const content = el('div');
    content.append(el('div', 'big-number', value), el('h3', '', title), el('p', '', detail)); card.append(content); $('#representation-summary').append(card);
  }

  let selected = Number(new URLSearchParams(location.hash.slice(1)).get('il')) || 34;
  if (!data.provinces.some(p => p.id === selected)) selected = 34;
  let mode = 'municipality';
  let filter = '';
  const mpGroups = new Map(data.provinces.map(p => [p.id, data.mps.filter(m => m.provinceId === p.id)]));
  function provinceParty(province) {
    if (mode === 'municipality') {
      if (/kayy[ıu]m|atanm/i.test(province.mayor.role)) return 'Atanmış yönetim';
      return province.mayor.party || 'Bilgi bekleniyor';
    }
    const counts = {};
    mpGroups.get(province.id).forEach(m => { counts[m.party] = (counts[m.party] || 0) + 1; });
    const ordered = Object.entries(counts).sort((a,b) => b[1] - a[1]);
    if (!ordered.length) return 'Bilgi bekleniyor';
    return ordered[0][1] === ordered[1]?.[1] ? 'Eşit dağılım' : ordered[0][0];
  }
  data.provinces.slice().sort((a,b) => a.name.localeCompare(b.name,'tr')).forEach(p => {
    const option = el('option', '', String(p.id).padStart(2,'0') + ' · ' + p.name); option.value = p.id; $('#province-select').append(option);
  });
  // Yerel dosyadan açılabilmesi için harita ve veri betik olarak paketlenir.
  $('#turkey-map').innerHTML = window.TURKEY_MAP;
  const shapes = Array.from($('#turkey-map').querySelectorAll('[data-plakakodu]'));
  shapes.forEach(shape => {
    const id = Number(shape.dataset.plakakodu);
    shape.setAttribute('role', 'button'); shape.setAttribute('tabindex', '0');
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title'); shape.prepend(title);
    shape.addEventListener('click', () => selectProvince(id));
    shape.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectProvince(id); }
    });
    function announce() {
      const province = data.provinces.find(p => p.id === id);
      $('#map-hover').textContent = province.name + ' · ' + provinceParty(province);
    }
    shape.addEventListener('pointerenter', announce); shape.addEventListener('focus', announce);
  });
  function renderMap(resetFilter = false) {
    const parties = [...new Set(data.provinces.map(provinceParty))].sort((a,b) => a.localeCompare(b,'tr'));
    if (resetFilter) {
      filter = ''; $('#party-filter').replaceChildren(el('option', '', 'Tüm partiler')); $('#party-filter').firstChild.value = '';
      parties.forEach(p => { const option = el('option', '', p); option.value = p; $('#party-filter').append(option); });
    }
    $('#map-explanation').textContent = mode === 'municipality'
      ? 'Renkler il / büyükşehir belediyesinin kaynakta belirtilen parti kaydını gösterir. Büyükşehir olmayan illerde il merkezini temsil eder. Derleme kayıtları resmî teyit bekler.'
      : 'Renkler ilin mevcut milletvekilleri arasında en çok sandalyeye sahip partiyi gösterir; oy oranı veya belediye yönetimi değildir. Eşitlikler ayrı renktedir.';
    shapes.forEach(shape => {
      const province = data.provinces.find(p => p.id === Number(shape.dataset.plakakodu));
      const party = provinceParty(province);
      const qualifier = mode === 'municipality' && province.mayor.verification === 'secondary' ? ' · Derleme, resmî teyit bekliyor' : '';
      shape.style.setProperty('--party-color', color(party));
      shape.classList.toggle('is-muted', Boolean(filter && party !== filter));
      shape.classList.toggle('is-selected', province.id === selected);
      shape.setAttribute('aria-label', `${province.name}: ${party}${qualifier}`);
      shape.setAttribute('aria-pressed', String(province.id === selected));
      shape.querySelector('title').textContent = `${province.name} · ${party}${qualifier}`;
    });
    $('#map-legend').replaceChildren(...parties.map(p => {
      const item = pill(p, ' · ' + data.provinces.filter(province => provinceParty(province) === p).length);
      item.classList.add('legend-item'); return item;
    }));
    const province = data.provinces.find(p => p.id === selected);
    $('#map-hover').textContent = province.name + ' · ' + provinceParty(province);
  }
  function personRecord(record, container, heading = false) {
    container.append(el('p', 'person-role', record.role), el(heading ? 'h4' : 'p', heading ? '' : 'row-name', record.name), pill(record.party || 'Bilgi bekleniyor'));
    const source = el('p', 'source-line'); source.append(link(record.sourceLabel + ' ↗', record.source)); container.append(source);
    container.append(el('span', 'verification', record.verification === 'secondary' ? 'Derleme kaydı · Resmî teyit bekleniyor' : 'Resmî kaynak kaydı · Kaynak okuma: ' + date));
  }
  function renderDistricts() {
    const query = $('#district-search').value.trim().toLocaleLowerCase('tr-TR');
    const districts = data.districts.filter(d => d.provinceId === selected).sort((a,b) => a.name.localeCompare(b.name, 'tr'));
    const known = districts.filter(d => d.mayor).length;
    $('#district-coverage').textContent = `${districts.length} ilçe · ${known} başkan kaydı · ${districts.length - known} doğrulama bekleyen`;
    const rows = districts.filter(d => d.name.toLocaleLowerCase('tr-TR').includes(query)).map(d => {
      const row = el('article', 'person-row'); const title = el('h4', 'row-title', d.name);
      if (d.website) title.append(link('Belediye ↗', d.website)); row.append(title);
      if (d.mayor) personRecord(d.mayor, row);
      else row.append(el('p', 'unknown', 'Güncel başkan ve parti bilgisi henüz doğrulanmadı.'));
      return row;
    });
    $('#district-list').replaceChildren(...(rows.length ? rows : [el('p','muted','Bu aramayla eşleşen ilçe bulunamadı.')]));
  }
  function selectProvince(id, updateHash = true) {
    const province = data.provinces.find(p => p.id === id);
    if (!province) return;
    selected = id; $('#province-select').value = id;
    $('#province-code').textContent = String(id).padStart(2,'0');
    $('#province-title').textContent = province.name;
    $('#province-kind').textContent = province.metropolitan ? 'BÜYÜKŞEHİR' : 'İL BELEDİYESİ';
    $('#province-mayor').replaceChildren(); personRecord(province.mayor, $('#province-mayor'), true);
    if (province.website) {
      const source = el('p', 'source-line'); source.append(link('Resmî belediye sitesi ↗', province.website)); $('#province-mayor').append(source);
    }
    const mps = mpGroups.get(id); const counts = {};
    mps.forEach(m => { counts[m.party] = (counts[m.party] || 0) + 1; });
    $('#province-seat-summary').replaceChildren(...Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([p,n]) => pill(p, ' · ' + n)));
    $('#mp-list').replaceChildren(...mps.map(m => {
      const row = el('article','person-row'); const name = el('p','row-name'); name.append(link(m.name + ' ↗',m.url));
      row.append(name,pill(m.party)); return row;
    }));
    $('#mp-count').textContent = mps.length;
    $('#district-count').textContent = data.districts.filter(d => d.provinceId === id).length;
    $('#district-search').value = ''; renderDistricts(); renderMap();
    if (updateHash) {
      try { history.replaceState(null, '', '#il=' + id); } catch { /* Yerel dosya güvenlik kısıtı arayüzü etkilemez. */ }
    }
  }
  $('#province-select').addEventListener('change', event => selectProvince(Number(event.target.value)));
  $('#map-mode').addEventListener('change', event => { mode = event.target.value; renderMap(true); });
  $('#party-filter').addEventListener('change', event => { filter = event.target.value; renderMap(); });
  $('#district-search').addEventListener('input', renderDistricts);
  window.addEventListener('hashchange', () => selectProvince(Number(new URLSearchParams(location.hash.slice(1)).get('il')), false));
  const tabs = [$('#tab-districts'), $('#tab-mps')];
  function activateTab(index) {
    tabs.forEach((tab,i) => {
      tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1;
      $('#' + tab.getAttribute('aria-controls')).hidden = i !== index;
    });
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => activateTab(index));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
      activateTab(next); tabs[next].focus();
    });
  });

  // 600 gerçek sandalye noktası; her renk parti sayısı kadar nokta alır.
  const svgNS = 'http://www.w3.org/2000/svg';
  const chart = document.createElementNS(svgNS,'svg'); chart.setAttribute('viewBox','0 0 500 285'); chart.setAttribute('role','img');
  chart.setAttribute('aria-label', data.seats.map(s => `${s.party} ${s.count}`).join(', ') + `, boş ${data.capacity - occupied}`);
  const points = [];
  const rings = [33,39,45,51,57,63,69,75,81,87];
  // Noktaları açıya göre sıralamak, her partiye bitişik bir dilim verir.
  rings.forEach((count, ring) => {
    const radius = 100 + ring * 15;
    for (let i=0;i<count;i++) {
      const angle = Math.PI * (i+.5)/count;
      points.push({angle, x:250 - radius*Math.cos(angle), y:253 - radius*Math.sin(angle)});
    }
  });
  points.sort((a,b) => a.angle - b.angle);
  const orderedSeats = data.seats.flatMap(s => Array.from({length:s.count}, () => s.party));
  while (orderedSeats.length < data.capacity) orderedSeats.push('Boş');
  points.forEach((point,index) => {
    const dot = document.createElementNS(svgNS,'circle'); dot.setAttribute('cx',point.x.toFixed(2)); dot.setAttribute('cy',point.y.toFixed(2));
    dot.setAttribute('r','2.6'); dot.setAttribute('fill',orderedSeats[index] === 'Boş' ? '#cbd2db' : color(orderedSeats[index]));
    chart.append(dot);
  });
  $('#seat-chart').append(chart); $('#seat-total').textContent = occupied;
  const table = el('table','seats-table'); const head = el('thead'); const heading = el('tr');
  for (const text of ['Parti','Sandalye']) { const th = el('th','',text); th.scope = 'col'; heading.append(th); }
  head.append(heading); table.append(head); const body = el('tbody');
  for (const entry of [...data.seats, {party:'Boş',count:data.capacity-occupied}]) {
    const row = el('tr'); const name = el('td'); const count = el('td','',entry.count);
    name.append(pill(entry.party)); const bar = el('span','seat-bar'); bar.style.width = (entry.count / data.capacity * 100) + '%'; bar.style.setProperty('--party-color',color(entry.party));
    name.append(bar); row.append(name,count); body.append(row);
  }
  table.append(body); const foot = el('tfoot'); const total = el('tr'); total.append(el('td','','Toplam kapasite'),el('td','',data.capacity)); foot.append(total); table.append(foot); $('#seat-table').append(table);
  renderMap(true); selectProvince(selected, false);
})();
