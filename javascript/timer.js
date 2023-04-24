// Seçim tarihini burada ayarlayın
var electionDate = new Date("May 14, 2023 08:00:00");

// HTML'de tanımlanan sayaç öğelerine referans
var daysElem = document.getElementById("days");
var hoursElem = document.getElementById("hours");
var minutesElem = document.getElementById("minutes");
var secondsElem = document.getElementById("seconds");

// Sayaç işlemini yapan fonksiyon
function updateCountdown() {
  // Şimdiki tarihi al
  var now = new Date();

  // Kalan süreyi hesapla
  var timeRemaining = electionDate - now;

  // Kalan süreden gün, saat, dakika ve saniyeleri hesapla
  var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  var minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
  var seconds = Math.floor((timeRemaining / 1000) % 60);

  // Sayaç öğelerinde kalan süreyi güncelle
  daysElem.innerText = days < 10 ? "0" + days : days;
  hoursElem.innerText = hours < 10 ? "0" + hours : hours;
  minutesElem.innerText = minutes < 10 ? "0" + minutes : minutes;
  secondsElem.innerText = seconds < 10 ? "0" + seconds : seconds;
}

// Sayaç işlevini her saniyede bir çağıran bir zamanlayıcı başlat
setInterval(updateCountdown, 1000);
