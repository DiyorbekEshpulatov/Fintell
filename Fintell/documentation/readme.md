# SmartAccounting AI

"SmartAccounting AI" - bu kichik va o'rta biznes uchun mo'ljallangan, sun'iy intellektga asoslangan buxgalteriya va omborni boshqarish platformasi. Tizim hisob-fakturalarni avtomatik qayta ishlash, inventarizatsiyani kuzatish va moliyaviy hisobotlarni yaratish imkonini beradi.

## Texnologiyalar steki

- **Monorepo:** Turborepo
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python
- **Ma'lumotlar bazasi:** (Hozircha aniqlanmagan, masalan, PostgreSQL)
- **Infrastruktura:** Docker

---

## Kelajakdagi rivojlanish: Web3 Integratsiyasi

Loyihaning funksionalligini kengaytirish va zamonaviy moliyaviy texnologiyalarni joriy etish maqsadida Web3-texnologiyalarini integratsiya qilish rejalashtirilgan.

### 1. Maqsad

- **Kriptovalyuta orqali to'lovlar:** Mijozlarga o'z xizmatlari yoki mahsulotlari uchun kriptovalyutada (masalan, ETH, USDC, USDT) to'lovlarni qabul qilish imkoniyatini berish.
- **Shaffoflik:** Blokcheyn texnologiyasidan foydalanib, muayyan moliyaviy operatsiyalarning shaffof va o'zgarmas qaydini yaratish (masalan, yirik shartnomalar yoki grantlar uchun).
- **Markazlashtirilmagan identifikatsiya (DID):** Kelajakda foydalanuvchilar va kompaniyalarni markazlashtirilmagan identifikatorlar orqali tizimga kirishini ta'minlash.

### 2. Arxitektura

Web3 integratsiyasi asosan **backend** (`iqtisodiy_yordamchi` FastAPI ilovasi) qismida amalga oshiriladi va **frontend** (`web` Next.js ilovasi) orqali foydalanuvchiga taqdim etiladi.

- **Backend (`iqtisodiy_yordamchi`):
  - **`web3.py` kutubxonasi:** Blokcheyn bilan o'zaro aloqa qilish uchun asosiy vosita. U quyidagi vazifalarni bajaradi:
    - Hamyonlarni boshqarish (yangi hamyon yaratish, balansni tekshirish).
    - Tranzaksiyalarni yaratish, imzolash va tarmoqqa yuborish.
    - Smart-kontraktlar bilan ishlash (masalan, ERC-20 tokenlari bilan).
  - **`pydantic-ai` kutubxonasi:** Sun'iy intellekt yordamida tabiiy tildagi so'rovlarni (masalan, "Menga oxirgi 5 ta Ethereum tranzaksiyasini ko'rsat") tahlil qilib, `web3.py` uchun kerakli funksiyalarni avtomatik ishga tushiruvchi modellar yaratish. Bu foydalanuvchilar uchun qulay interfeys yaratishga yordam beradi.
  - **API Endpoints:** Frontend uchun maxsus API manzillari (`/api/v1/payments/crypto`, `/api/v1/wallets/balance` va h.k.) yaratiladi.

- **Frontend (`web`):
  - **To'lov interfeysi:** Foydalanuvchiga kriptovalyuta hamyonini ulash (masalan, MetaMask orqali) va to'lovni amalga oshirish uchun interfeys yaratiladi. Buning uchun `ethers.js` yoki shunga o'xshash JavaScript kutubxonasidan foydalanish mumkin.
  - **Ma'lumotlarni ko'rsatish:** Backend API orqali olingan tranzaksiya ma'lumotlari, hamyon balansi va boshqa Web3'ga oid axborotlar foydalanuvchiga qulay tarzda ko'rsatiladi.

### 3. Kerakli paketlar

- **Python (backend):**
  - `web3`: Blokcheyn bilan ishlash uchun.
  - `pydantic-ai`: AI-asosidagi funksiyalarni chaqirish uchun.
  - `fastapi`: API yaratish uchun.
  - `uvicorn`: Asinxron server uchun.

- **JavaScript (frontend):**
  - `ethers` yoki `web3.js`: Brauzerda hamyonlar bilan ishlash va tranzaksiyalarni imzolash uchun.

### 4. Amalga oshirish qadamlari

1.  **Test muhitini sozlash:** Mahalliy blokcheyn (masalan, Hardhat/Anvil) yoki test tarmog'idan (masalan, Sepolia) foydalanib, ishlab chiqish va sinov muhitini sozlash.
2.  **Backendda asosiy funksionallikni yaratish:**
    - `web3.py` yordamida balansni tekshirish va tranzaksiya yuborish uchun oddiy servislar yaratish.
    - Ushbu servislar uchun FastAPI endpoints'larini yaratish.
3.  **`pydantic-ai` modelini yaratish:** Tabiiy tildagi buyruqlarni `web3.py` funksiyalariga o'giradigan oddiy AI modelini yaratish va sinovdan o'tkazish.
4.  **Frontend interfeysini yaratish:**
    - MetaMask yoki boshqa hamyonni ulash funksiyasini qo'shish.
    - Backend API'dan foydalanib, to'lovni amalga oshirish uchun oddiy forma va mantiqni yaratish.
5.  **Integratsion testlar:** Frontend va backend birgalikda to'g'ri ishlashini to'liq sinovdan o'tkazish.
6.  **Ishlab chiqarish (Production)ga chiqarish:** Testlar muvaffaqiyatli yakunlangach, asosiy tarmoq (Mainnet) sozlamalari bilan tizimni ishga tushirish.
