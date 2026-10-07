# VLink — PPF.ONE benzeri responsive profil sitesi

Bu paket, PPF.ONE'daki "tek sayfada kişisel profil + bağlantılar" mantığından esinlenen,
birebir marka/kaynak kopyası olmayan bir frontend başlangıç projesidir.

## Çalıştırma
1. `index.html` dosyasını açabilir veya hosting'e yükleyebilirsin.
2. `profile.html?user=vanchy` demo profilini açar.
3. Linkleri `profile.html` içinden kendi adreslerinle değiştir.
4. Marka adını ve renkleri `index.html` / `style.css` içinde değiştir.

## Backend'e hazır noktalar
Gerçek üyelik, login, profil oluşturma, link CRUD, görüntülenme/tıklama istatistikleri için
PHP/MySQL, Node.js/PostgreSQL, Firebase veya Supabase bağlanabilir.

## Önerilen URL yapısı
site.com/
site.com/login
site.com/register
site.com/@kullaniciadi

Not: Font Google Fonts'tan çağrılıyor; internet olmayan ortamda sistem fontuna düşer.
