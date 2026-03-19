# SmartAccounting AI – Sun'iy Intelektli Buxgalteriya Platformasi

**Sun'iy Intelekt asosida O'zbekiston bizneslari uchun to'liq avtomatlashtirilgan buxgalteriya va soliq platformasi.**

Bu loyiha kichik va o'rta biznes (SME) egalari uchun buxgalteriya jarayonlarini soddalashtirish, xatolarni kamaytirish va moliyaviy qarorlar qabul qilishni yaxshilash maqsadida ishlab chiqilmoqda. Platforma `my.soliq.uz` va `stat.uz` kabi davlat tizimlari bilan chuqur integratsiyani, shuningdek, kundalik operatsiyalarni avtomatlashtirish uchun kuchli AI imkoniyatlarini taqdim etadi.

---

## 🎯 Loyihaning Asosiy Maqsadi

O'zbekistondagi bizneslar uchun 1C va Excelning murakkab funksiyalarini o'zida jamlagan, ammo ulardan ancha qulay va aqlli bo'lgan, to'liq avtomatlashtirilgan, "bulutli" buxgalteriya platformasini yaratish. Bizning maqsadimiz – buxgalteriyani "ma'lumot kiritish"dan "strategik qarorlar qabul qilish"ga aylantirish.

### 📈 Kimlar Uchun?
- **Kichik va o'rta biznes (SME)**: Kundalik buxgalteriya operatsiyalarini osonlashtirmoqchi bo'lganlar.
- **Korporativ mijozlar**: Moliyaviy hisobot va tahlil jarayonlarini avtomatlashtirishni xohlovchilar.
- **Buxgalterlar va autsorsing firmalari**: Bir nechta mijozlarning ishini bitta platformadan samarali boshqarishni istaganlar.

---

## ✨ Asosiy Funksiyalar va Imkoniyatlar

Platforma bir nechta kuchli modullardan iborat:

### 1. 🤖 Sun'iy Intelekt Yordamchisi (AI Core)
- **Avtomatik Hujjat Tahlili**: Hisob-fakturalar, shartnomalar, cheklar va boshqa hujjatlarni rasm yoki PDF ko'rinishida qabul qilib, ulardagi ma'lumotlarni (summa, sana, INN, MFO va hokazo) avtomatik tarzda o'qib oladi va tizimga kiritadi.
- **Intellektual Prognozlash**: Mavjud moliyaviy ma'lumotlar asosida pul oqimlari (cash flow), kutilayotgan xarajatlar va daromadlarni prognoz qiladi.
- **Auditor Nazorati**: Tizimdagi nomuvofiqliklar, debitorlik/kreditorlik qarzdorliklaridagi xatoliklar yoki soliq hisobotlaridagi potensial muammolarni avtomatik aniqlaydi va foydalanuvchini ogohlantiradi.
- **Tabiiy Tilda Muloqot (Chatbot)**: Foydalanuvchi oddiy tilda ("O'tgan oydagi eng katta 5 ta xarajatni ko'rsat", "Qaysi mijozdan eng ko'p daromad oldik?") savol berib, kerakli hisobot va ma'lumotlarni tezda olishi mumkin.

### 2. 🇺🇿 Davlat Tizimlari Bilan Integratsiya
- **My.Soliq.uz**: Soliq hisobotlarini (QQS, Aylanma soliq, JSHOD va hokazo) avtomatik shakllantirish va to'g'ridan-to'g'ri yuborish. E-Faktura ma'lumotlarini avtomatik sinxronizatsiya qilish.
- **Stat.uz**: Statistik hisobotlarni tayyorlash va yuborishni soddalashtirish.

### 3. 💼 Moliyaviy Boshqaruv
- **To'liq Buxgalteriya**: Bank operatsiyalari, kassa, asosiy vositalar, ish haqi hisobi va boshqa barcha buxgalteriya operatsiyalarini yuritish.
- **Ombor Hisobi**: Mahsulotlar kirimi, chiqimi va qoldig'ini real vaqt rejimida kuzatib borish.
- **Smart Hisobotlar**: Sotuvlar tahlili, xarajatlar strukturasi, foyda va zararlar (P&L), balans (Balance Sheet) kabi o'nlab tayyor va moslashuvchan hisobotlar.

---

## 🛠 Texnologiyalar Steki

Ushbu platforma zamonaviy va ishonchli texnologiyalar asosida qurilmoqda:

- **Backend**: **Python** va **Flask** mikro-freymvorki.
- **Frontend**: **Next.js**, **React**, **TypeScript** va **Tailwind CSS**.
- **Ma'lumotlar Bazasi**: **PostgreSQL**.
- **AI & Mashina O'rganish**: `OpenAI`, `Scipy`, `Statsmodels`, `Pytesseract`.
- **Asinxron Vazifalar**: `Celery` va `Redis` (hujjatlarni tahlil qilish, hisobotlarni generatsiya qilish kabi uzoq vazifalar uchun).

---

## 🚀 Loyihani Ishga Tushirish

Loyihani lokal kompyuterda ishga tushirish uchun quyidagi qadamlarni bajaring. Bu muhit Firebase Studio orqali boshqariladi va kerakli vositalar oldindan sozlab qo'yilgan.

1.  **Backend-serverni Ishga Tushirish:**
    - Bu loyihada backend-serverni ishga tushirish uchun maxsus skript mavjud.
    - Shunchaki, muharrirdagi (IDE) **"Preview"** tugmasini bosing.
    - Bu `devserver.sh` skriptini ishga tushiradi, u o'z navbatida:
        - Kerakli virtual muhitni (`.venv`) aktivlashtiradi.
        - `Fintell/backend/requirements.txt` faylidagi barcha Python kutubxonalarini o'rnatadi.
        - Flask ishlab chiqish serverini ishga tushiradi.

2.  **Frontend-ilovasini Ishga Tushirish:**
    - Terminalni oching.
    - `Fintell/frontend/apps/web` papkasiga o'ting:
      ```bash
      cd Fintell/frontend/apps/web
      ```
    - Kerakli JavaScript paketlarini o'rnating:
      ```bash
      npm install
      ```
    - Next.js ishlab chiqish serverini ishga tushiring:
      ```bash
      npm run dev
      ```
    - Brauzerda `http://localhost:3000` manzilini oching.

> **Muhim Eslatma:** Agar terminalda `pip` yoki `python` buyruqlarini qo'lda ishlatmoqchi bo'lsangiz, avval virtual muhitni aktivlashtirishni unutmang: `source .venv/bin/activate`

---

## 🗺️ Rivojlanish Xaritasi (Roadmap)

Loyiha quyidagi bosqichlarda amalga oshiriladi:

1.  **✅ Boshlang'ich (MVP)**: Eng asosiy buxgalteriya funksiyalari va hujjatlarni qo'lda kiritish imkoniyati. (2-3 oy)
2.  **🎯 O'rta Bosqich**: `my.soliq.uz` va `stat.uz` bilan dastlabki integratsiyalar. AI orqali hujjatlarni o'qish funksiyasini ishga tushirish. (Keyingi 2-3 oy)
3.  **🏆 Rivojlangan Bosqich**: Barcha AI funksiyalarini (prognozlash, auditor, chatbot) to'liq ishga tushirish va takomillashtirish. (Keyingi 3-4 oy)
4.  **🌐 Kengayish (Scaling)**: Foydalanuvchilar sonini oshirish, yangi tarif rejalarini qo'shish va Markaziy Osiyo bozorlariga chiqishni o'rganish.

---

**Loyiha muvaffaqiyati uchun omad tilayman! 🚀**
