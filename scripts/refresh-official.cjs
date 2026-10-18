// Eski komut için uyumluluk: kullanıcı artık bağımsız TurkiyeAPI kaynağını seçti.
const adapter=require('./refresh-turkiye.cjs');
module.exports=adapter;
if(require.main===module){console.log('Kaynak TurkiyeAPI olarak değiştirildi. Önerilen komut: npm run refresh:data');adapter.refresh().catch(error=>{console.error(error.message);process.exitCode=1;});}
