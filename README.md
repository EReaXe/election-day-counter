# Türkiye atlası ve seçim paneli

Yeşil/lime atlas arayüzü, erişilebilir Türkiye haritası ve il/ilçe keşfi. index.html dosyasını açın; kurulum gerekmez.

## Veri kaynağı

Kullanıcının seçtiği tek veri sağlayıcı [TurkiyeAPI](https://github.com/ubeydeozdmr/turkiye-api), [belgeler](https://docs.turkiyeapi.dev/). Önceki resmî API kısıtının yerine bu sağlayıcı seçilmiştir. TurkiyeAPI bağımsızdır, devlet API'si olarak sunulmaz. Harita çizimi ayrı lisanslı görsel varlıktır.

Beş koleksiyonun tamamı alınır: 81 il, 973 ilçe, 1.377 belediye, 32.279 mahalle, 18.183 köy. Sayılar indirme anındaki /v2/meta ile doğrulanır. Veri seti 2025, sağlayıcının güncellemesi 2026-05-21; indirme zamanı source-manifest.json içinde ayrıca yer alır. Bunlar bugünkü nüfus veya siyasi görev bilgisi iddiası değildir.

Harita nüfus aralıklarını gösterir. İl kartları nüfus, alan, rakım, bölge, koordinat ve telefon kodlarını; ilçeler belediyeleri, mahalle/köy aramasını, nüfus ve posta kodlarını gösterir. Yerleşimler ilk açılışta yüklenir ve 50'şer kayıt gösterilir. Yaklaşık posta kodları açıkça etiketlenir. Tüm ham alanlar data/turkiye-api/dataset.json.gz içinde korunur.

Kaynak belediye başkanı, parti, Cumhurbaşkanı, milletvekili, sandalye dağılımı veya seçim takvimi sağlamaz. Bu alanlar boş durum gösterir. Eski İzmir kaynağı ve derlemeler aktif veri paketinden kaldırılmıştır.

## Yenileme ve doğrulama

Node 20+ ile `npm run refresh:data` çalıştırın. /v2/meta ve belgelenmiş /v2/datasets/{koleksiyon}.json dosyaları kullanılır. Sürümlü dosyalar güncel metadata ile farklı olabileceği için son sürüm uçları seçilmiştir. Sayı, tekil kimlik ve tüm üst kayıt ilişkileri doğrulanmadan başarılı paket değiştirilmez. Yönlendirme, HTML yanıtı, HTTP ve JSON hataları reddedilir. Arızada eski paketin tarihi güncellenmez.

`npm run sync:data` yerel paketi yeniden üretir. `refresh:official` geriye uyumlu komut adıdır; artık TurkiyeAPI yenilemesini çağırır, resmî kurum anlamına gelmez. Otomatik/zamanlanmış veya tarayıcıdan canlı veri yenileme yoktur. Sunulan dosyalar son başarılı indirme kopyasıdır.

`npm install` ve `npm test`: API hata durumları, beş koleksiyonun tamlığı/ilişkileri, SHA-256 ve ham veriden birebir yeniden üretim, kaynak kısıtı ve DOM etkileşimleri denetlenir. Görsel tarayıcı kontrolü yapılmadı; file:// gözlem isteği güvenlik politikasıyla engellenmişti.

Lisanslar: THIRD-PARTY.md.
