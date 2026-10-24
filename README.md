# Election Day Counter

Yalnızca Türkiye'deki bir sonraki genel ve yerel seçime kalan süreyi gösterir. index.html dosyasını açın. Derleme veya sunucu gerekmez.

Harita, nüfus/belediye/Meclis verileri, API indirme hattı, tema seçimi, paylaşım ve takvim dışa aktarma kaldırılmıştır. Yeni özellik eklenmemiştir.

## Tahmini tarihler

Kullanıcı onayıyla olağan seçim döneminden hesaplanan tahminler kullanılır. Genel seçim: 7 Mayıs 2028; yerel seçim: 25 Mart 2029. Kesinleşmiş seçim takvimi değildir. Erken seçim/takvim değişikliği farklı tarih gerektirir. Sayaç Türkiye saatiyle 00.00'a gider; oy verme saatini belirtmez.

Genel seçim hesabı: [6271 md.3](https://www.ysk.gov.tr/doc/dosyalar/docs/24Haziran2018/2018SecimTakvimi/6271-Secim.pdf), birlikte yapılan 14 Mayıs 2023 seçiminden beş yıl dolmadan önceki son Pazar. Son seçim: [YSK istatistikleri](https://www.ysk.gov.tr/doc/dosyalar/docs/14%20May%C4%B1s%202023%20Cumhurba%C5%9Fkan%C4%B1%20ve%2025.%20D%C3%B6nem%20MV%20Genel%20Se%C3%A7imleri%20%C4%B0statistikleri.pdf). Yerel seçim hesabı: [2972 md.8'i aktaran YSK kararı](https://ysk.gov.tr/doc/karar/dosya/1902/2016-81.pdf), beş yıllık dönemin Mart ayındaki son Pazar.

Tarihler javascript/elections.js dosyasında, JavaScript kapalıyken görünen karşılıkları index.html içindedir. Tarih değişince ikisini güncelleyin; test eşleşmelerini denetler. Otomatik veri güncellemesi yoktur.

## Kontrol

Node.js ile npm install ve npm test. Testler gün/saat hesabı, geçmiş tarihin sıfırda kalması, eksik tarih, sabit saat dilimi ve sayfanın yalnızca iki sayaç içermesini kontrol eder. Görsel tarayıcı doğrulaması yapılmadı.
