# 🏢 Blooming Buds Housing Society - Backend & Database Setup Guide

Yeh project VS Code me alag se run karne ke liye ready hai.

---

## 📁 Folder Structure (Directory Layout)

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── gemini.ts        # Gemini AI Config
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript Interfaces
│   │   └── server.ts            # Main Express Server & REST API Endpoints
│   ├── .env.example             # Environment Variables Template
│   ├── package.json             # Backend dependencies & scripts
│   └── tsconfig.json            # TypeScript configuration
│
├── database/
│   ├── schema.sql               # PostgreSQL / Relational DB Schema DDL
│   └── in_memory_db.ts          # Ready-to-run In-Memory Database store with Seed Data
```

---

## 🚀 How to Run in VS Code

### Step 1: Open Terminal in VS Code
Open your VS Code terminal and navigate to the backend folder:
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set up Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optionally add your `GEMINI_API_KEY` in `.env` if you want to use the AI chatbot and matchmaker)*

### Step 4: Start Backend Server
```bash
npm run dev
```

Server will start at **`http://localhost:5000`** with all REST endpoints active:
- `GET /api/properties` (Search, Filters, Locations)
- `POST /api/bookings` (Create Booking)
- `GET /api/bookings` (View Bookings)
- `POST /api/reviews` (Post Reviews)
- `POST /api/auth/login` (Authentication)
- `GET /api/analytics` (Dashboard Analytics)
- `POST /api/ai/chat` (AI Concierge Chatbot)

---

## 🗄️ Database Options

1. **In-Memory Store (`database/in_memory_db.ts`)**:
   - Zero setup required! Automatically imported and running with pre-seeded data for Pune, Bengaluru, etc.

2. **Relational Database (`database/schema.sql`)**:
   - For PostgreSQL / Supabase / Neon / MySQL: Run the SQL statements from `database/schema.sql` to create all tables (`users`, `properties`, `bookings`, `reviews`, `complaints`).
