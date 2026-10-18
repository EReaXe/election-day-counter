# Kaynaklar ve lisanslar

## Siyasi kayıtlar — yalnızca resmî API

İzmir Büyükşehir Belediyesi tarafından yayımlanan meclis üyeleri servisi:
https://acikveriwapi.izmir.bel.tr/IzBel/MeclisUyeleriniGetir

Kurumun veri kataloğu ve kullanım lisansı:
https://acikveri.bizizmir.com/tr/dataset/meclis-uyeleri/resource/5ec4f015-d2ff-4fc7-a91d-dda03961c26b

Siyasi veri dosyalarına resmî web sayfası, haber, PDF, arama sonucu veya üçüncü taraf derleme aktarılmaz. API yanıtı kurumun bildirimidir; bağımsız doğrulama değildir. Yenileme çalışmaları ve yanıt parmak izi `data/source-manifest.json` içinde yer alır.

## Harita çizimi

Üçüncü taraf coğrafi sözlük siyasi veri paketiyle birlikte kaldırılmıştır. İlçe adları API yanıtındaki görev unvanlarından alınır. API bağlantısı olmayan çizimler için yalnızca genel arayüz etiketleri kullanılır. map-regions.json içindeki sayılar çizim eşleştirme kimlikleridir; resmî idari bölge API kodu olarak sunulmaz.

`data/turkey.svg` ve `javascript/map-data.js` Doğukan Güven Nomak'ın haritasından uyarlanmıştır:
https://github.com/dnomak/svg-turkiye-haritasi

MIT lisansı data/MAP-LICENSE.txt içinde korunur. Değişiklikler: 81 ilin seçilmesi, İstanbul şekillerinin birleştirilmesi, etkileşim ve renklendirme.

Projenin bildirdiği özgün şekil kaynağı Wikimedia Commons, 6F-6C-63-61-79 ve katkıda bulunanlar:
https://commons.wikimedia.org/wiki/File:Turkey_provinces_blank_gray.svg

Özgün şekiller için CC BY-SA 3.0 seçilmiştir: https://creativecommons.org/licenses/by-sa/3.0/
Harita şekillerinin uyarlaması aynı lisansla paylaşılır. Harita şematiktir; resmî idari sınır belgesi değildir.
