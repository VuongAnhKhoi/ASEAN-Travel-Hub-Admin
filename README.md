# 🌏 ASEAN Travel Hub — Admin Dashboard

A web-based admin dashboard built during the **IT Software Solutions for Business Skills for ASEAN Member States** practical internship program.

---

## 📌 Overview

ASEAN Travel Hub Admin is a lightweight frontend application for managing travel destinations and user reviews across ASEAN countries. It connects directly to a Supabase backend for real-time data management and integrates AI-powered content generation via Supabase Edge Functions.

---

## ✨ Features

- **Destination Management** — Create, edit, delete travel destinations with country info and descriptions
- **Image Upload** — Upload and update destination photos via Supabase Storage
- **AI Description Generator** — Auto-generate destination descriptions using AI (Supabase Edge Function)
- **Reviews Dashboard** — View all user reviews with tour and destination context
- **AI Review Summary** — Generate and save AI summaries for individual reviews

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript (ES Modules) |
| Backend / Database | [Supabase](https://supabase.com) (PostgreSQL) |
| File Storage | Supabase Storage |
| AI Functions | Supabase Edge Functions |
| Package Manager | npm |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/VuongAnhKhoi/ASEAN-Travel-Hub-Admin.git
cd asean-travel-hub-admin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Rename `config.example.js` to `config.js` and fill in your Supabase credentials:

```js
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_KEY = "your-anon-key-here";
```

> ⚠️ Never commit `config.js` to version control. It is listed in `.gitignore`.

### 4. Run the project

Open `index.html` in your browser, or use a local dev server:

```bash
npx serve .
```

---

## 📁 Project Structure

```
├── app.js              # Main application logic
├── config.js           # Supabase credentials (not committed)
├── config.example.js   # Credentials template
├── index.html          # App entry point
├── style.css           # Stylesheet
├── src/                # Additional source files
├── tests/              # Test files
└── package.json
```

---

## 🎓 Internship Context

This project was developed as part of the practical internship component of the:

**IT Software Solutions for Business Skills for ASEAN Member States** program

The goal was to apply modern web development and cloud backend skills to build a functional, real-world business application within the context of ASEAN tourism.

---

## 📄 License

This project is for educational purposes.
