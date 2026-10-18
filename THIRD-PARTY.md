# Veri kaynakları ve üçüncü taraf lisansları

Kaynak okuma tarihi: 18 Ekim 2026. Veriler canlı değildir. Bu tarih kaynakların okunduğu tarihtir; her kaydın bağımsız olarak aynı gün doğrulandığı anlamına gelmez.

## Siyasi görev kayıtları

- TBMM milletvekilleri: https://www.tbmm.gov.tr/milletvekili/AllList
- TBMM parti sandalye dağılımı: https://www.tbmm.gov.tr/SandalyeDagilimi
- Cumhurbaşkanı: https://www.tccb.gov.tr/receptayyiperdogan/biyografi/
- İstanbul belediyeleri: https://ibb.istanbul/ibb/buyuksehir-belediye-meclisi/belediye-birlikleri/
- İzmir belediyeleri: https://acikveriwapi.izmir.bel.tr/IzBel/MeclisUyeleriniGetir
- İl ve ilçe belediyelerinin resmî bağlantıları: Türkiye Belediyeler Birliği, https://www.tbb.gov.tr/tr/il-belediyeleri ve https://www.tbb.gov.tr/tr/buyuksehir-belediyeleri
- İl / ilçe adları: TurkiyeAPI, https://api.turkiyeapi.dev/v2/provinces ve https://api.turkiyeapi.dev/v2/districts (bağımsız topluluk projesi).

Resmî kaynaklarla henüz değiştirilmeyen il başkanı kayıtları aşağıdaki Vikipedi derlemesinden dönüştürülmüştür. Yazarlar: ilgili sayfanın katkıda bulunanları; lisans: CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Bu derlemeden türetilmiş belediye kayıtları aynı lisansla sunulur. İsim, parti, görev başlangıcı ve vekillik alanları ayrıştırılmış; resmî kayıt bulunan yerlerde resmî kaynakla değiştirilmiştir. Kaynak ve değişiklik geçmişi:

https://tr.wikipedia.org/wiki/Türkiye'de_görevde_olan_il_belediye_başkanlarının_listesi

https://tr.wikipedia.org/w/index.php?title=Türkiye%27de_görevde_olan_il_belediye_başkanlarının_listesi&action=history

Bu kayıtlar arayüzde “derleme / resmî teyit bekleniyor” olarak etiketlenir. Kayyum ve başkan vekili aynı şey değildir; kaynakta bulunmayan atama türü veya parti bağı uydurulmaz. Başkan kaydı bulunmayan ilçeler boş bırakılır. Resmî kaynaklar da kendi yayın güncellikleriyle sınırlıdır. İzmir resmî API kaydı AK Parti bildirirken, resmî biyografinin arama dizini kaydı Bağımsız bilgisi içerir. Biyografi sayfası yeniden açılmaya çalışıldığında hata sayfasına yönlenmiştir. Arama dizini, doğrudan okunmuş güncel sayfa sayılmaz. Çelişki açık tutulmuş ve kesin güncel parti alanı boş bırakılmıştır.

## Harita

`data/turkey.svg` ve `javascript/map-data.js`, Doğukan Güven Nomak'ın SVG Türkiye Haritası projesinden uyarlanmıştır:

https://github.com/dnomak/svg-turkiye-haritasi

Değişiklikler: yalnızca 81 ilin şekilleri alınmış, İstanbul'un şekilleri tek il grubunda birleştirilmiş, etkileşim ve renklendirme eklenmiştir. Projenin MIT lisansı `data/MAP-LICENSE.txt` dosyasında korunmuştur.

Projenin bildirdiği özgün harita kaynağı: Wikimedia Commons, “Turkey provinces blank gray.svg”, 6F-6C-63-61-79 ve katkıda bulunanlar:

https://commons.wikimedia.org/wiki/File:Turkey_provinces_blank_gray.svg

Özgün haritanın CC BY-SA 3.0 lisansı seçilmiştir (https://creativecommons.org/licenses/by-sa/3.0/). Harita şekillerine ilişkin bu uyarlama aynı lisansla paylaşılır. Harita şematiktir; resmî idari sınır kaynağı veya hukuki sınır belgesi değildir.


## Bu sürümde eklenen resmî belediye kaynakları

- Ankara (8 sayfa): https://www.ankara.bel.tr/meclis/uyeler?page=1
- Bursa: https://www.bursa.bel.tr/meclis-uyeleri
- Kocaeli: https://www.kocaeli.bel.tr/belediye-meclis-uyeleri.html
- Muğla: https://www.mugla.bel.tr/belediye-meclis-uyeleri
- Eskişehir: https://www.eskisehir.bel.tr/meclis-uyeleri
- İzmir karşılaştırma kaydı (erişilemiyor): https://www.izmir.bel.tr/tr/Ozgecmis/34

Bu kaynaklar 77 yeni ilçe başkanı kaydı sağladı. Belediye meclisi başkan vekilleri, ilçe belediye başkan vekili olduğu açıkça belirtilmedikçe ilçe başkanı olarak alınmadı. Görevden uzaklaştırma satırları aktif başkan kaydı olarak aktarılmadı. Listelerin boş bıraktığı veya bildirmediği bilgiler tahmin edilmedi. HTML dosyalarının parmak izleri `data/source-manifest.json` içinde korunur.
