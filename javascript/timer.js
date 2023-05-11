// Seçim tarihini burada ayarlayın
var electionDate1 = new Date("May 14, 2023 08:00:00");
var electionDate2 = new Date("May 14, 2023 08:00:00");
var electionDate3 = new Date("March 31, 2024 08:00:00");

// A tanımlanan sayaç öğelerine referans
var daysElemA = document.getElementById("daysA");
var hoursElemA = document.getElementById("hoursA");
var minutesElemA = document.getElementById("minutesA");
var secondsElemA = document.getElementById("secondsA");
// B tanımlanan sayaç öğelerine referans
var daysElemB = document.getElementById("daysB");
var hoursElemB = document.getElementById("hoursB");
var minutesElemB = document.getElementById("minutesB");
var secondsElemB = document.getElementById("secondsB");
// C tanımlanan sayaç öğelerine referans
var daysElemC = document.getElementById("daysC");
var hoursElemC = document.getElementById("hoursC");
var minutesElemC = document.getElementById("minutesC");
var secondsElemC = document.getElementById("secondsC");

// Sayaç işlemini yapan fonksiyon
function updateCountdown() {
  // Şimdiki tarihi al
  var now = new Date();

  // Kalan süreyi hesapla
  var timeRemainingA = electionDate1 - now;
  var timeRemainingB = electionDate2 - now;
  var timeRemainingC = electionDate3 - now;

  // A Kalan süreden gün, saat, dakika ve saniyeleri hesapla
  var daysA = Math.floor(timeRemainingA / (1000 * 60 * 60 * 24));
  var hoursA = Math.floor((timeRemainingA / (1000 * 60 * 60)) % 24);
  var minutesA = Math.floor((timeRemainingA / 1000 / 60) % 60);
  var secondsA = Math.floor((timeRemainingA / 1000) % 60);
  // B Kalan süreden gün, saat, dakika ve saniyeleri hesapla
  var daysB = Math.floor(timeRemainingB / (1000 * 60 * 60 * 24));
  var hoursB = Math.floor((timeRemainingB / (1000 * 60 * 60)) % 24);
  var minutesB = Math.floor((timeRemainingB / 1000 / 60) % 60);
  var secondsB = Math.floor((timeRemainingB / 1000) % 60);
  // C Kalan süreden gün, saat, dakika ve saniyeleri hesapla
  var daysC = Math.floor(timeRemainingC / (1000 * 60 * 60 * 24));
  var hoursC = Math.floor((timeRemainingC / (1000 * 60 * 60)) % 24);
  var minutesC = Math.floor((timeRemainingC / 1000 / 60) % 60);
  var secondsC = Math.floor((timeRemainingC / 1000) % 60);

  // A Sayaç öğelerinde kalan süreyi güncelle
  daysElemA.innerText = daysA < 10 ? "0" + daysA : daysA;
  hoursElemA.innerText = hoursA < 10 ? "0" + hoursA : hoursA;
  minutesElemA.innerText = minutesA < 10 ? "0" + minutesA : minutesA;
  secondsElemA.innerText = secondsA < 10 ? "0" + secondsA : secondsA;
  // B Sayaç öğelerinde kalan süreyi güncelle
  daysElemB.innerText = daysB < 10 ? "0" + daysB : daysB;
  hoursElemB.innerText = hoursB < 10 ? "0" + hoursB : hoursB;
  minutesElemB.innerText = minutesB < 10 ? "0" + minutesB : minutesB;
  secondsElemB.innerText = secondsB < 10 ? "0" + secondsB : secondsB;
  // C Sayaç öğelerinde kalan süreyi güncelle
  daysElemC.innerText = daysC < 10 ? "0" + daysC : daysC;
  hoursElemC.innerText = hoursC < 10 ? "0" + hoursC : hoursC;
  minutesElemC.innerText = minutesC < 10 ? "0" + minutesC : minutesC;
  secondsElemC.innerText = secondsC < 10 ? "0" + secondsC : secondsC;
}

// Sayaç işlevini her saniyede bir çağıran bir zamanlayıcı başlat
setInterval(updateCountdown, 1000);
