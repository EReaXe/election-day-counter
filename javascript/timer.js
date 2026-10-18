/* Hedefler tarihsel proje varsayımlarıdır; resmî seçim takvimi değildir.
   Tarih ve saat bilgisi index.html içindeki <time> öğelerinden okunur. */
'use strict';

function getRemaining(target, now = Date.now()) {
  const total = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

function calendarEvent(title, target) {
  const escape = value => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const stamp = date => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  // Bu hatırlatma tam gün olarak eklenir; varsayılan saat oy verme saati değildir.
  const day = new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(target)).replace(/-/g, '');
  const following = new Date(Date.UTC(Number(day.slice(0, 4)), Number(day.slice(4, 6)) - 1, Number(day.slice(6, 8)) + 1));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Election Day Counter//TR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${day}-${encodeURIComponent(title)}@election-day-counter`, `DTSTAMP:${stamp(Date.now())}`,
    `DTSTART;VALUE=DATE:${day}`, `DTEND;VALUE=DATE:${stamp(following).slice(0, 8)}`,
    `SUMMARY:${escape('Tahmini: ' + title)}`, 'DESCRIPTION:Kesinleşmiş seçim tarihi değildir. Resmî takvim için https://www.ysk.gov.tr/ adresini kontrol edin.',
    'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
}

if (typeof document !== 'undefined') {
  const cards = Array.from(document.querySelectorAll('[data-election]')).map(card => {
    const target = Date.parse(card.querySelector('time').dateTime);
    const title = card.querySelector('h2').textContent;
    const calendar = card.querySelector('.calendar');
    if (Number.isFinite(target)) {
      calendar.hidden = false;
      calendar.setAttribute('aria-label', `${title}: tahmini tarihi takvime ekle`);
      calendar.addEventListener('click', () => {
        const url = URL.createObjectURL(new Blob([calendarEvent(title, target)], {type: 'text/calendar;charset=utf-8'}));
        const link = document.createElement('a');
        link.href = url;
        link.download = `tahmini-secim-${card.dataset.election}.ics`;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    }
    return {card, target, units: Array.from(card.querySelectorAll('[data-unit]')), status: card.querySelector('.status')};
  });
  function updateCountdown() {
    const now = Date.now();
    cards.forEach(({card, target, units, status}) => {
      if (!Number.isFinite(target)) {
        status.textContent = 'Tarih bilgisi güncellenmeli';
        return;
      }
      const remaining = getRemaining(target, now);
      units.forEach(unit => { unit.textContent = String(remaining[unit.dataset.unit]).padStart(2, '0'); });
      const expired = target <= now;
      status.textContent = expired ? 'Hedef tarih geçti · Güncelleme bekleniyor' : 'Hedef tarihe kalan süre';
      card.querySelector('.calendar').disabled = expired;
    });
  }
  updateCountdown();
  let timer;
  function syncTimer() {
    clearInterval(timer);
    if (!document.hidden) {
      updateCountdown();
      timer = setInterval(updateCountdown, 1000);
    }
  }
  syncTimer();
  document.addEventListener('visibilitychange', syncTimer);

  const theme = document.querySelector('#theme-toggle');
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let selectedTheme;
  try { selectedTheme = localStorage.getItem('election-theme'); } catch { /* Depolama kapalıysa sistem teması kullanılır. */ }
  function applyTheme(value) {
    document.documentElement.dataset.theme = value;
    theme.textContent = value === 'dark' ? '☀ Açık tema' : '☾ Koyu tema';
    theme.setAttribute('aria-label', value === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
  }
  applyTheme(['light', 'dark'].includes(selectedTheme) ? selectedTheme : system.matches ? 'dark' : 'light');
  theme.hidden = false;
  theme.addEventListener('click', () => {
    selectedTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(selectedTheme);
    try { localStorage.setItem('election-theme', selectedTheme); } catch { /* Tema bu oturumda çalışmaya devam eder. */ }
  });
  system.addEventListener('change', event => { if (!['light', 'dark'].includes(selectedTheme)) applyTheme(event.matches ? 'dark' : 'light'); });

  const share = document.querySelector('#share');
  share.hidden = false;
  share.addEventListener('click', async () => {
    const feedback = document.querySelector('#feedback');
    if (!/^https?:$/.test(location.protocol)) {
      feedback.textContent = 'Paylaşmak için paneli bir web adresinden açın.';
      return;
    }
    try {
      if (navigator.share) await navigator.share({title: document.title, url: location.href});
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(location.href);
        feedback.textContent = 'Panel bağlantısı kopyalandı.';
      } else feedback.textContent = 'Adres çubuğundaki bağlantıyı kopyalayabilirsiniz.';
    } catch (error) {
      if (error.name !== 'AbortError') feedback.textContent = 'Paylaşılamadı. Adres çubuğundaki bağlantıyı kopyalayabilirsiniz.';
    }
  });
}

if (typeof module !== 'undefined') module.exports = {getRemaining, calendarEvent};
