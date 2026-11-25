# Mini CRM Dashboard

A clean, full-stack **Lead Management Dashboard** built for the SHL Tech Internship Task 1.

---

## 🚀 Live Demo

> Deploy to Vercel (see deployment section below) and paste the URL here.

---

## 🛠 Tech Stack

| Layer       | Technology                           | Why I chose it                                                             |
|-------------|--------------------------------------|----------------------------------------------------------------------------|
| **Frontend**| Next.js 15 (App Router) + TypeScript | Full-stack in one repo, great DX, server-side rendering out of the box     |
| **Styling** | Tailwind CSS                         | Utility-first, responsive design without writing custom CSS                |
| **Backend** | Next.js API Routes                   | No separate Express server needed; API routes live alongside the frontend  |
| **ORM**     | Prisma 7                             | Type-safe database queries, auto migrations, great SQLite support          |
| **Database**| SQLite (via libsql)                  | Zero-setup, file-based, perfect for local dev; swap to Postgres for prod   |
| **Validation**| Zod (server) + custom (client)    | Runtime type-safe validation on both ends                                  |

---

## ✅ Features

- **Dashboard Overview** – Total, New, and Converted lead counts in live stat cards
- **Add / Edit / Delete Leads** – Full CRUD via modal form
- **Search** – Real-time search by name or email (debounced)
- **Filter by Status** – New · Contacted · Converted
- **Status Updates** – Change a lead's status directly from the table
- **Form Validation** – Client-side + server-side validation with helpful error messages
- **Loading State** – Spinner shown while fetching data
- **Empty State** – Friendly message when no leads exist
- **Responsive Design** – Works on mobile, tablet and desktop
- **Error Handling** – Network and duplicate-email errors shown clearly

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/mini-crm-dashboard.git
cd mini-crm-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up the database
```bash
# Run the migration (creates prisma/dev.db automatically)
./node_modules/.bin/prisma migrate dev --name init

# Generate Prisma client
./node_modules/.bin/prisma generate
```

### 4. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup

The project uses **SQLite** via libsql — no installation required. The database file lives at `prisma/dev.db`.

After cloning, run:
```bash
./node_modules/.bin/prisma migrate dev --name init
```

This creates the `Lead` table with these columns:

| Column        | Type    | Notes                              |
|---------------|---------|------------------------------------|
| id            | Int     | Auto-increment primary key         |
| name          | String  | Contact's full name                |
| email         | String  | Unique email                       |
| phone         | String  | Phone number                       |
| businessName  | String  | Company / business name            |
| status        | String  | `New` · `Contacted` · `Converted`  |
| createdAt     | DateTime| Auto-set on creation               |
| updatedAt     | DateTime| Auto-updated on edit               |

---

## 🌐 API Endpoints

| Method | URL               | Description            |
|--------|-------------------|------------------------|
| GET    | `/api/leads`      | List leads (with optional `?search=` and `?status=`) |
| POST   | `/api/leads`      | Create a new lead      |
| GET    | `/api/leads/:id`  | Get a single lead      |
| PUT    | `/api/leads/:id`  | Update a lead          |
| DELETE | `/api/leads/:id`  | Delete a lead          |

---

## 🏗️ Project Structure

```
mini-crm-dashboard/
├── app/
│   ├── api/
│   │   └── leads/
│   │       ├── route.ts         # GET all, POST new lead
│   │       └── [id]/
│   │           └── route.ts     # GET, PUT, DELETE by id
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main dashboard page
├── components/
│   ├── LeadForm.tsx             # Add/Edit modal form
│   ├── LeadTable.tsx            # Leads table with inline status change
│   ├── SearchFilter.tsx         # Search bar + status dropdown
│   └── StatsBar.tsx             # Overview stat cards
├── lib/
│   └── prisma.ts                # Prisma client singleton
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── dev.db                   # SQLite database (auto-created)
├── prisma.config.ts             # Prisma 7 configuration
└── README.md
```

---

## 🚀 Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. For production, set up a **Turso** (cloud libsql) or **PostgreSQL** database and update `prisma.config.ts`.
4. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` as environment variables in Vercel.

---

## 🧩 Challenges Faced

1. **Prisma v7 / v8 coexistence** – The global Prisma CLI was v8 (which uses a new config format), while the project needed v7. Solved by using `./node_modules/.bin/prisma` and creating a `prisma.config.ts` with the libsql adapter.
2. **Adapter pattern for SQLite** – Prisma 7 dropped native SQLite support in favour of driver adapters. Integrated `@prisma/adapter-libsql` + `@libsql/client`.
3. **Search debouncing** – Used `useCallback` + `setTimeout` to avoid firing an API call on every keystroke.

---

## 📝 License

MIT
