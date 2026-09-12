# MathLearn Academy

Platform pembelajaran matematika interaktif untuk SMA & Kuliah yang dilengkapi **Interactive Scratchpad**, **Socratic AI Hint**, **Dual Assessment (Practice vs Exam)**, dan **Buku Rumus Cepat (Formula Quick-Reference Drawer)**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Authentication**: BetterAuth (Drizzle Adapter, Session Cookie HTTP-Only)
- **Styling**: Tailwind CSS + Lucide Icons
- **Math Formula**: KaTeX + `remark-math`
- **AI Engine**: Vercel AI SDK

---

## 🚀 Memulai Proyek

### 1. Konfigurasi Environment Variables

Salin `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel di `.env.local`:
```env
DATABASE_URL="postgresql://user:password@ep-sample.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="your-secure-secret-key-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Database Migration (Drizzle ORM)

Untuk menghasilkan migrasi SQL dari skema:
```bash
npm run db:generate
```

Untuk menerapkan skema langsung ke NeonDB:
```bash
npm run db:push
```

Untuk membuka GUI database studio:
```bash
npm run db:studio
```

### 3. Menjalankan Server Development

```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 📂 Struktur Direktori Proyek

```
├── app/
│   ├── (auth)/            # Halaman Login & Register
│   ├── api/auth/[...all]/ # BetterAuth Route Handler
│   ├── layout.tsx         # Root Layout + Navbar
│   └── page.tsx           # Homepage & Hero Section
├── components/
│   └── navigation/        # Global Navbar & Session State
├── lib/
│   ├── auth.ts            # BetterAuth Server Instance (Drizzle Adapter)
│   ├── auth-client.ts     # BetterAuth Client Hooks (useSession, signIn, signUp)
│   └── db/
│       ├── index.ts       # Neon HTTP Client + Drizzle
│       └── schema.ts      # Skema tabel & relasi Drizzle
├── drizzle/               # File migrasi SQL Drizzle
├── drizzle.config.ts      # Konfigurasi Drizzle Kit
└── scripts/
    └── smoke-test.ts      # Skrip verifikasi model & auth
```
