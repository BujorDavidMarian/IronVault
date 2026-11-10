# IronVault — Specialized E-Commerce Store for Strength Equipment & Athletic Gear

> Proiect Semestrial E-Commerce (An Academic 2026–2027)  
> Magazin online dedicat echipamentelor de forță, atleților și pasionaților de home gym.

---

## 👥 Echipa & Roluri (Team Governance)

* **Bujor David Marian**: Backend Architecture, DB & Webhooks (`A3`, `A4`, `A6`, `A7`, `A10`, `A12`)
* **Barabas Gabriel**: Frontend Views, UI/UX & Responsive Flow (`A1`, `A2`, `A5`, `A8`, `A9`, `A11`)

---

## 📊 Matrice Cerințe & Status Curent

| Modul | Cerință | Responsabil | Status | Descriere |
| :--- | :--- | :--- | :---: | :--- |
| **A1** | Product Catalog | Gabriel | ✅ Finalizat | Grid paginat (≤24 produse/pagină), categorii dedicate, pagină detaliată de produs, tratare 404. |
| **A2** | Basic Search | Gabriel | ✅ Finalizat | Căutare în timp real după denumire, filtrare fără reîncărcare de pagină, stare curată pentru căutări fără rezultate. |
| **A3** | Shopping Cart | David / Gabriel | ✅ Finalizat | Drawer lateral glisant (slide-out cart), badge cantitate în antet, adăugare din pagina de produs, ajustare cantitate/ștergere, validare și limitare strictă la stocul disponibil, persistență locală și pregătire integrare API. |
| **A4** | User Accounts | David | ✅ Finalizat | Înregistrare & autentificare, hash parole (Argon2/bcrypt), salvare profil și model adrese de livrare multiple cu adresă principală. |
| **A5** | Checkout Flow | Gabriel | ⏳ În plan | Wizard comandă în mai mulți pași (date livrare, opțiuni curierat, sumar). |
| **A6** | Sandbox Payment | David | ⏳ În plan | Integrare Stripe Checkout, verificare semnătură webhook, actualizare stare comandă. |
| **A7** | Stock Management | David | ⏳ În plan | Decrementare atomică stoc la plată, restaurare la anulare, blocare la nivel de rând (SELECT FOR UPDATE). |
| **A8** | Order History | Gabriel | ⏳ În plan | Dashboard comenzi plasate, badge-uri de stare, sumar produse. |
| **A9** | Admin Panel | Gabriel | ⏳ În plan | Panou administrare: formulare CRUD produse/categorii, actualizare stare comenzi. |
| **A10** | Basic Security | David | ⏳ În plan | Validare date intrare pe server, protecție CSRF, interogări parametrizate ORM, protecție rute admin. |
| **A11** | Responsive Design | Gabriel | 🔄 Continuu | Audit de responsivitate complet pe ecrane mobile de la 360px în sus. |
| **A12** | Automated Tests | David | ⏳ În plan | Teste de integrare pentru coș, calcul totaluri și flux plăți. |

---

## 🛠️ Stack Tehnologic

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7/v8.
* **Calitate Cod**: Oxlint (linter ultra-rapid) & TypeScript strict type checking.
* **Backend & DB (în pregătire)**: Node.js (Express), PostgreSQL, Prisma ORM, Stripe API.

---

## 🚀 Pornire Rapidă (Ghid Dezvoltare Frontend)

### Cerințe preliminare
* **Node.js** (recomandat v20+ sau v24+)
* **npm**

### Pași de rulare:
```powershell
# 1. Navighează în directorul frontend
cd frontend

# 2. Instalează dependențele (dacă nu au fost instalate anterior)
npm install

# 3. Pornește serverul de dezvoltare
npm run dev
```

Aplicația va fi accesibilă la adresa indicată în consolă (implicit `http://localhost:5173/`).

### Comenzi utile pentru verificare:
```powershell
# Verificare linter
npm run lint

# Testare compilare TypeScript & build de producție
npm run build
```
