# Bilge Kedi — Shorts üretim rehberi

> **GÜNCEL STİL (v2): HALFTONE DOSYA.** Yeni bölümlerin HEPSİ v2 ile yapılır (`"v2": true`, `engine2.js`).
> Eski v1 bölümleri (ahtapot, ay, gokkusagi, arilar, kartanesi) yalnızca arşivdir; onları örnek alma.

## v2 stili — Halftone Dosya + Ölçek Yakınlaştırma + İzometrik

- **Çerçeve (dosya):** her video bir vaka dosyasıdır: "DOSYA #NN". Krem kâğıt, halftone noktalar, kalın slab başlık
  (kaymış baskı gölgesi), dev halftone numara, KAYIT ışığı, "KANIT n/N" çipi, sonda kırmızı **ÇÖZÜLDÜ!** damgası.
- **Kedi:** `cat_ht.js` (`drawCatHT`): halftone karakter, smokin + gözlük + papyon. DEĞİŞTİRME. İfadeler: `blink, mouth,
  happy, brow, ear, glint, lookX, lookY, tail`. Çizgisi motor tarafından titretilir (boil).
- **Anlatım sahneleri YALNIZCA iki stilde:**
  - `zoom` = Ölçek Yakınlaştırma: gece mavisi zemin, düz iki tonlu şekiller (`ST.twoTone`), ışık halkaları (`ST.glowRings`),
    sarı "sonraki durak" halkası (`ST.nextStop`), noktalı nişan çizgisi (`ST.sightLine`), köşede ölçek şeridi (`ST.scaleRibbon`).
    Kamera bir ölçekten ötekine log-ölçekli yakınlaşır (örnek: `yaprak` sahne 1, `karinca` sahne 1).
  - `iso` = İzometrik İnfografik: açık zemin, üç tonlu bloklar (`ST.isoBox`, `ST.isoP`), etiket iğneleri (`ST.pin`),
    kesit yüzünde iç yapı, sayıyı tekrar eden ikonlarla göster (Isotype; örnek: `mavibalina` 30 fil).
  - Blueprint ve scratch film KULLANILMAZ.
- **Yapı (7–8 satır, 26–34 sn):** `modes` dizisi satır başına sahne türü. Tipik: `['dos','zoom','zoom','iso','iso','dos','dos']`.
  Satır 0 = kanca sorusu (dos, başlık + dev numara + sticker), ortalar = kanıtlar (zoom/iso), sondan bir önceki =
  "Dosya çözüldü: ..." (dos + damga), son = "Bilge Kedi'yle merakını kaybetme!".
- **Örnekler:** `episodes/mavibalina`, `episodes/karinca`, `episodes/yaprak`. Yeni bölüme başlamadan EN AZ İKİSİNİ oku.
- `script.json`: `{"v2": true, "bpm":..., "transpose":..., "lines": [...], "events": [...]}`. Damga için
  `["stamp", satır, "çözüldü"]`, nişan çizgileri için `"blip"`. Damga sahne sonunda kaybolsun: `end: c.sceneStart(son)`.
- `ep.js` v2 API: `caseNo, exhibits, modes, heads{si:[satırlar]}, subs{si:metin}, bigNum{si:'07'}, init(c), stage(t,c),
  catPos(c), cat(st,c), stamps(c), stickers(c), front(t,c), haloInk, edgeInk`. Yardımcılar `K2` (seg, eo, back, lerp) ve `ST`.
- Dosya numarası: `topics.txt`'teki en büyük numaranın bir fazlası.


Gözlüklü, papyonlu smokin (siyah-beyaz) bir kedi; çocuklara tek bir konuyu ~25 saniyede, sesli ve
hızlı anlatır. Bu klasör her şeyi üretir: ses (Türkçe TTS + sentez müzik/efekt), animasyon, MP4.

## Değişmez kurallar

- **Çocuk dostu:** korkutucu, travmatik, şiddet içeren bilgi YOK (yutulma, ölüm, yok oluş, saldırı,
  hastalık, felaket...). Merak uyandıran, şaşırtan, sevimli bilgiler. Bilgiler doğru olmalı.
- **Kanca:** 1. satır her zaman şaşırtıcı bir soru ("…biliyor musun?"). İlk saniyede yakalasın.
- **Anlatı:** madde madde bilgi değil, akıcı bir mini hikâye. 6–7 satır, her satır kısa, toplam 22–27 sn.
- **Son satır her zaman:** `Bilge Kedi'yle merakını kaybetme!`
- **Tempo:** her satır = yeni sahne; sahne içinde de en az bir hareket/efekt (sticker, flaş, pop).
- **Format:** 1080×1920, 30 fps, H.264 + AAC. Ses: `tr-TR-EmelNeural`, `+10%`.
- Altyazı Shorts arayüzünün altında kalmasın: sahne görselleri y≈150–960, altyazı y≈1010,
  kedi altta (anlatıcı pozu). İlk ve son sahnede kedi büyük ve ortada (`bigScenes`).
- `topics.txt`'teki konuları TEKRARLAMA. Her bölüm farklı bir alandan olsun (hayvan, uzay, doğa,
  vücut, bitki, hava durumu, icat...).

## Kurulum

```bash
cd bilge-kedi && ./make.sh setup
```
Gerekenler: Node + Playwright/Chromium (ortamda hazır), ffmpeg, python3 + numpy, `edge-tts`.
Ağ: `speech.platform.bing.com` erişimi olmalı (ses için). `audio.py` proxy'yi `HTTPS_PROXY`'den alır.

## Yeni bölüm yapma (adım adım)

1. `episodes/<ad>/script.json` yaz:
   ```json
   {"bpm":112,"transpose":0,
    "lines":["Kanca sorusu?", "...", "Bilge Kedi'yle merakını kaybetme!"],
    "events":[["pop",2,"hop"],["sparkle",3,null],["ding",4,"@end"],["boing",5,"uzakta",0.1]]}
   ```
   - `events`: `[efekt, satır_no, kelime_parçası | null (satır başı) | "@end" (satır sonu), ek_saniye?]`
   - Kelime parçası küçük harfle aranır (Türkçe: `ı/i` doğru eşlenir).
   - Efektler: `ding whoosh sparkle vinn pop swirl click boing chime bubble heart buzz jump tick drop`
   - Otomatik eklenenler: başta `ding`, her sahne geçişinde `whoosh`, son satırda `chime` + `ding`.
   - `bpm` (100–120) ve `transpose` (-5..+5) her bölümde biraz farklı olsun.
2. `./make.sh audio <ad>` → satır başlangıçlarını (`timeline.json`) not et.
3. `episodes/<ad>/ep.js` yaz (aşağıdaki API). Mevcut bölümleri örnek al:
   `ahtapot` (okyanus + fanus), `ay` (zıplama/catDy), `gokkusagi` (gökyüzü, kelimeye bağlı renk bantları),
   `arilar` (çayır, sayaç), `kartanesi` (kış, atkı, front katmanı).
4. `./make.sh samples <ad> <12 zaman>` → `episodes/<ad>/sheet.png`'ye BAK. Kontrol et:
   altyazı okunuyor mu, nesneler üst üste binmiş mi, sahneler boş mu, Türkçe karakterler doğru mu,
   sticker kedinin yüzünü kapatıyor mu. Sorun varsa düzelt ve tekrar bak.
5. `./make.sh video <ad>` → `episodes/<ad>/<ad>.mp4`.
6. `topics.txt`'e satır ekle.

## ep.js API

```js
(function () {
  const { seg, eo, back, lerp, cl } = K;   // seg(t,a,b): 0..1, eo: ease-out, back: zıplayan ease
  window.EP = {
    theme: 'space' | 'ocean' | 'sky' | 'meadow' | 'winter',
    bigScenes: [0, SON],                   // kedinin büyük/ortada olduğu sahneler
    init(c) { c.T = { hop: c.wt(2, 'hop') }; },   // kelime zamanları: c.wt(satır, parça) / c.we(...)
    stage(t, c) { return '<svg içeriği>'; },      // kedinin ARKASINDA; c.si sahne no, c.into sahne içi sn
    front(t, c) { return ''; },                   // kedinin ÖNÜNDE (opsiyonel)
    cat(st, c) { st.lookY = -1; },                // kedi durumu: blink mouth tail glint lookX lookY ear brow
    catOver(c, st) { return ''; },                // kedi üstüne aksesuar (yerel 700x950 kutu; baş merkezi 350,300)
    catDy(c, P) { return 0; },                    // kediyi dikey kaydır (zıplama)
    stickers(c) { return [{ t, txt, col, y, dx, size, d }]; },  // büyük zıplayan yazılar
    flashes(c) { return [t]; }, shakes(c) { return [t]; },
    dark(t, c) { return 0; }, capY: 1010,
  };
})();
```
Yardımcılar: `K.text(x,y,size,txt,fill)`, `K.cloud(x,y,s)`, `K.burst(...)`. Filtreler: `url(#b80) #b30 #b12 #b4`.
Kedi otomatik: konuşurken ağız sese göre oynar, göz kırpar, kuyruk sallar; son sahnede göz kırpar ve
"Bilge Kedi — ⭐ Yarın yeni bir sır! ⭐" logosu çıkar.
İlk sahneye sağ üstte bir soru sticker'ı koy: `{ t: 0.4, txt: '🐙?', col, y: 470, dx: 300, size: 170 }`.

## Tasarım dili
Düz, yumuşak gölgeli, kalın lacivert (#1a1040) konturlu, sevimli yüzlü nesneler (güneşin, Dünya'nın,
damlanın bile yüzü var). Parlak renkler, yazılar Baloo 2 ExtraBold + kalın kontur.
