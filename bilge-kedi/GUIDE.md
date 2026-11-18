# Bilge Kedi — Shorts üretim rehberi

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
