# Seçim Takvimi — resmî API politikası

Bağımsız seçim ve temsil arayüzü. `index.html` doğrudan açılabilir; çalışma zamanı için paket kurulumu gerekmez.

## Siyasi veri kaynakları

Siyasi görevler, parti bilgileri, seçim tarihleri ve sonuçları için yalnızca `data/official-api-sources.json` izin listesindeki resmî API uçları kabul edilir. HTML, PDF, haber, arama dizini ve üçüncü taraf derleme yedek kaynak olamaz. Önceki bu tür siyasi kayıtlar dağıtılan veri dosyasından kaldırıldı.

Bağlı kaynak: İzmir Büyükşehir Belediyesi meclis üyeleri API'si. API sahipliği ve kapsamı kurumun açık veri kataloğunda belgelenir:
https://acikveri.bizizmir.com/tr/dataset/meclis-uyeleri/resource/5ec4f015-d2ff-4fc7-a91d-dda03961c26b

Son doğrudan API okuması 29 ilçe başkanı kaydı sağladı. İzmir il başkanı parti kaydı incelemede tutulur; yalnızca API yanıtı bulunması bağımsız güncellik doğrulaması değildir.

Cumhurbaşkanı, güncel milletvekilleri, sandalye dağılımı ve gelecekteki seçim tarihleri için uygun resmî API bağlantısı henüz yok. Bunlar boş bırakılır. Erişilebilir bir API bulunamadı demek, kurumun hiçbir özel veya yetkilendirmeli servisi olmadığı iddiası değildir. YSK geçmiş seçim sonuçları güncel görev ve parti bilgileri yerine geçirilmez.

## Yenileme

Node.js 20 veya üstü ile:

```
npm run refresh:official
```

Bu komut resmî API'ye doğrudan GET yapar; sabit uç nokta, yönlendirme, HTTP durumu, JSON içerik türü, şema, belediye eşleşmesi ve yinelenen görev kontrollerinden sonra veri paketini üretir. Hata durumunda HTML/derleme veya önceki politik veri setine dönülmez. Başarısız çalışmada ilgili bölüm boş ve çalışma durumu hatalı olarak kaydedilir; komut hata koduyla biter.

`data/api/izmir-meclis.json` ham API yanıtıdır. `data/politics.json` normalize edilmiş siyasi kayıtlardır. `data/source-manifest.json` API yanıt özeti ve SHA-256 değerini içerir; resmî dijital imza değildir. `javascript/politics-data.js` yerel dosyadan açılabilmesi için aynı verinin betik paketidir.

Tarayıcı son alınan API yanıtının paketlenmiş kopyasını gösterir. Canlı veri akışı veya zamanlanmış otomatik yenileme yoktur. Yeni bir kurum API'si için kaynak sahipliği, belge, erişim yetkisi ve yanıt şeması doğrulanmalı; ayrıca adaptör ve testleri eklenmelidir. Sadece kaynak etiketini “resmî” yapmak kabul edilmez.

## Veri sözleşmesi

Şema 4, `sourcePolicy: official-api-only`. Her siyasi kayıt ve bildirim API kimliği ile izin verilen uç noktaya bağlıdır. API'nin bildirmediği seçildiği parti alanı boş kalır; bağımsız doğrulama tarihleri uydurulmaz. İncelemedeki kayıtlara kesin parti atanmaz. API verisi yokluğu sıfır vekil veya boş Meclis olarak gösterilmez. Tarih API'si bağlanmadığı için önceki tahmini tarihler ve ICS indirmeleri kaldırılmıştır.

Üçüncü taraf il/ilçe sözlüğü de kaldırılmıştır. İlçe adları doğrudan resmî API unvanlarından üretilir. API ile bağlanamayan harita şekilleri yer adı yerine “Harita bölgesi” arayüz etiketi alır. `data/map-regions.json` yalnızca çizim kimliklerini içerir; bunlar resmî idari bölge kodu iddiası taşımaz. Ulusal ilçe sayısı bilinmiyor olarak tutulur; eksik kayıt sayısı sıfır diye gösterilmez. Harita çizimi ayrı lisanslı görsel varlıktır; siyasi bilgi kaynağı değildir. Kaynakları THIRD-PARTY.md içinde açıklanır.

## Kontrol

```
npm install
npm test
```

Testler resmî API izin listesini, HTML yanıtlarının reddini, bozuk JSON / HTTP hatalarını, kaynak sözleşmesini, eksik veri durumlarını ve arayüz etkileşimlerini sınar. `npm run sync:data` API kaynaklı normalize edilmiş veriyi tekrar paketler; yeni siyasi bilgi toplamaz.
