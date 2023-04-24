function Sonuc() {
  window.location.href = "https://ereaxe.github.io/election-day-counter/sonuclar/";
}

function Other() {
  // window.location.href = "http://example.com/donate";
  alert("Çok Yakında");
}

function Destek() {
  window.open("https://github.com/EReaXe/election-day-counter");
}

// Butonları seçin
const sonuclar = document.getElementById("sonuclar");
const others = document.getElementById("others");
const destek = document.getElementById("destek");

// Butonlara tıklama olaylarını ekle
sonuclar.addEventListener("click", Sonuc);
others.addEventListener("click", Other);
destek.addEventListener("click", Destek);
