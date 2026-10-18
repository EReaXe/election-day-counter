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

## Temsil haritası

- Tıklanabilir 81 il; klavye ile Enter / Boşluk ve alternatif il seçimi
- Belediye yönetimi / mevcut milletvekili dağılımı harita görünümleri, parti filtresi
- İl bazında belediye başkanı, parti kaydı, ilçe araması ve milletvekili profilleri
- TBMM kaynaklarından 592 milletvekili; parti toplamları listeyle birebir kontrol edilmiştir
- 600 sandalye noktası, boş koltuklar ve tüm partilerin sayısal tablosu
- Cumhurbaşkanı ve parti bilgisi
- İl bağlantıları `#il=34` biçiminde paylaşılabilir

Veri kapsamı **tam doğrulanmış güncel belediye rehberi değildir**. 973 ilçenin 196'sında başkan kaydı vardır: 145 kayıt resmî listelerden, 51 Merkez ilçe kaydı teyit bekleyen derlemedendir. 777 ilçe kaydı eksiktir. İl belediyelerinde 4 resmî kaynaklı kayıt, 76 derleme kaydı ve 1 çözülemeyen parti çelişkisi vardır. Resmî kaynaklı olmak bağımsız doğrulama anlamına gelmez. Hiçbir belediye kaydına bağımsız doğrulama yapılmış gibi tarih atanmaz; otomatik güncelleme yoktur.

`data/politics.json` makinece okunabilir veri kaydıdır. `javascript/politics-data.js` aynı verinin `file://` üzerinden de çalışması için betik sürümüdür. Veri güncellenirken ikisini birlikte üretin. `data/turkey.svg` ve `javascript/map-data.js` de aynı haritanın iki paketidir. Veri ve harita lisansları için `THIRD-PARTY.md` dosyasına bakın.

Geliştirici kontrolleri: `npm install` ardından `npm test`. Bu kurulum yalnızca DOM testleri içindir; siteyi çalıştırmak için gerekmez. JSON / SVG kaynakları düzenlendikten sonra `npm run sync:data` betik paketlerini yeniden üretir ve veri tutarlılığını kontrol eder. DOM testleri görsel tarayıcı testinin yerine geçmez.


## Veri güvenilirliği sözleşmesi (şema 3)

- `officeHolder`: kaynağın bildirdiği görevi yürüten kişi ve unvan; seçilmiş başkanla aynı olduğu varsayılmaz.
- `electedParty`: seçim kaynağıyla ayrıca belgelenmedikçe `null`.
- `currentParty`: yalnızca çelişkisiz resmî kaynağın bildirimi; derleme veya çelişkili kayıtta `null`.
- `claims`: her bildirimin kişi, parti, kaynak URL, kaynak türü ve okuma tarihi. Arama dizini kaydı doğrudan sayfa okumasından ayrılır.
- `retrievedAt`: kaynağın okunduğu tarih. `lastVerifiedAt`: bağımsız doğrulama yapılmadığı sürece `null`.
- `verification`: `primary` (resmî bildirim), `secondary` (derleme) veya `conflict` (çözülemeyen çelişki). `primary`, bağımsız doğrulama iddiası değildir.

Varsayılan belediye haritası teyit bekleyen derlemeleri renklendirmez. Kullanıcı bunları isteğe bağlı açabilir; çelişkiler her iki durumda da nötrdür. 30 günden eski kaynak okuması detaylarda yeniden kontrol uyarısı alır.

`data/quality-report.json` il bazında veri kapsamını sunar; `data/source-manifest.json` bu tur okunan resmî HTML dosyalarının SHA-256 parmak izlerini içerir. Parmak izleri resmî dijital imza değildir. `scripts/validate-data.cjs` bozuk tarih, tekrar eden kimlik, seçim kaynağı olmayan seçildiği parti, çelişkiye atanmış kesin parti ve tutarsız sandalye toplamını reddeder. `npm run sync:data` doğrulama geçmeden paket üretmez. `npm test` hem veri sözleşmesini hem DOM etkileşimlerini sınar.
