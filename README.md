# Seçim Takvimi

Türkiye'deki seçimler için mobil uyumlu, bağımsız ve açık kaynaklı geri sayım paneli. HTML, CSS ve JavaScript kullanır; derleme veya paket kurulumu gerektirmez.

## Çalıştırma

`index.html` dosyasını tarayıcıda açın veya klasörü herhangi bir statik web sunucusunda yayınlayın. Bağlantı paylaşımı HTTP/HTTPS üzerinden çalışır. Google Fonts erişilemezse sistem yazı tipleri kullanılır.

## Özellikler

- Telefon, tablet ve masaüstüne uyumlu üç seçim kartı
- Türkiye saatine sabit hedef tarihler (`+03:00`)
- Sistem temasını izleyen, kullanıcı seçimini hatırlayan açık/koyu tema
- Tahmini tarih uyarısı ve YSK bağlantısı
- Tam günlük, “Tahmini” başlıklı ICS takvim hatırlatmaları
- Bağlantı paylaşımı ve pano desteği
- Tarih geçince sıfırlanan sayaç ve güncelleme mesajı
- Arka planda durdurulan, sekmeye dönünce yenilenen sayaç

## Tarihleri güncelleme

`index.html` içindeki her kartın `<time datetime="...">` değerini ve görünen tarih metnini birlikte düzenleyin. JavaScript hedefleri bu öğelerden okur. Mevcut tarihler önceki projenin varsayımlarından alınmıştır; doğrulanmış resmî seçim tarihleri veya oy verme saatleri değildir. Resmî takvim yayımlandığında tarihleri, rozetleri ve uyarı metinlerini kaynaklarıyla birlikte güncelleyin.

## Kontrol

Node.js ile `node --check javascript/timer.js` komutu JavaScript sözdizimini kontrol eder. Sayaç ve takvim işlevleri Node.js altında `require('./javascript/timer.js')` ile ayrıca sınanabilir.

Bu proje herhangi bir resmî kurumla bağlantılı değildir.
