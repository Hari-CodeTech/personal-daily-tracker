# My Daily Tracker — 365 Days of Self-Improvement

> **Build Discipline. Track Progress. Become Better Every Day.**

**My Daily Tracker** is a production-grade, secure, and responsive daily tracking platform designed to help software engineers and career-focused individuals achieve radical self-discipline, technical mastery, fitness, job-search consistency, and reflective clarity.

---

## 🌟 Core Features & Modules

### 1. Daily Curriculum & Alternating Scheduler
- **Mandatory Daily Java**: Core Java, OOP, Collections Framework, Generics, Concurrency, Multithreading, and JDBC.
- **Mandatory Daily Problem Solving (DSA)**: DSA problem logging (Easy, Medium, Hard), topic categorization (Arrays, Strings, Trees, DP, etc.), time spent, and revision flags.
- **Continuous Alternating MySQL & Interview Prep**:
  - Automatically calculates whether **MySQL** (2 hrs) or **Interview Preparation** (2 hrs) is scheduled for any calendar day.
  - Alternates continuously across week boundaries starting from a configurable anchor date.
  - Ensures MySQL and Interview Prep are never scheduled together under default configuration.
- **Daily Flexible Technical Learning**: Frontend/Backend topics (React, TypeScript, Spring Boot, REST APIs, Microservices).
- **Tuesday Temple Visit**: Automatically scheduled as a required checkpoint every Tuesday; omitted on non-Tuesdays.

### 2. Live Study Timer & Stopwatch
- Start, pause, resume, stop, and save study sessions.
- **Persistence Across Reloads**: Active running timer state is preserved in browser storage so page refreshes or accidental tab closes do not lose your session.
- Manual duration entry mode for recording sessions completed away from the keyboard.

### 3. Job Applications Tracker (Target: Minimum 10 Daily)
- Mandatory daily goal of 10 submitted job applications.
- Live progress bar showing submitted count, remaining count, and completion percentage.
- **Duplicate Detection**: Flags applications submitted to the same company & role or matching URL on the same date.
- Search, filter by status (Applied, Interview, Assessment, Selected, Rejected), and filter by work mode (Remote, Hybrid, Onsite).

### 4. Habits & Personal Discipline
- **Avoidance & Private Commitments**: Discreet tracking of personal discipline goals (e.g., No pornography, No masturbation, No sugar, No scrolling before sleeping).
- **Social Media Discipline**: Dedicated caps for **Instagram** (max 60m) and **YouTube** (max 60m) with allowance countdowns and limit-exceeded alerts.
- **Customizable Habits**: Ability to create, edit, and archive habits (archiving preserves historical completion records).

### 5. Health & Physical Peak
- **Skipping Tracker**: Target by count (e.g. 1000 skips) or duration. Reuses the same daily record between habits and health pages to prevent data discrepancies.
- **Hydration Tracker**: Target 2.5 Litres daily with quick-log buttons (+250ml glass, +500ml bottle, +1000ml jug) and time-stamped entry logs.
- **Sleep & Recovery**: Bedtime, wake time, and duration tracking against a 7-hour minimum restorative sleep target.
- **Workout Logger**: Sets, reps, and exercise logs.

### 6. Night Routine & Daily Reflection
- **Tomorrow's Blueprint**: Automatically pre-populated with tomorrow's curriculum (calculates whether tomorrow is MySQL or Interview prep, checks for Tuesday temple visit, pre-fills 10 job target).
- **Nightly Reflection**: Private prompts for wins, lessons learned, missed tasks, distractions, and concrete tomorrow improvements with mood tracking.

### 7. 365-Day Challenge & Heatmap Matrix
- Visual 365-block matrix (inspired by bullet journals and GitHub contribution grids) mapping out each day of the year.
- Current streak and longest streak calculations based on consecutive active calendar days.
- Milestones roadmap: Day 30 (Habit Formation), Day 100 (Centurion of Discipline), Day 200 (Momentum), Day 365 (Total Transformation).

### 8. Analytics & Data Export
- Visual interactive charts built with Recharts:
  - Daily Study Hours Trend
  - Job Applications vs. Target of 10
  - Study Time Distribution by Subject
  - DSA Problems Solved by Difficulty (Easy / Medium / Hard)
- Timeframe filters: 7 Days, 14 Days, 30 Days.
- One-click export of your complete tracking data in **JSON** or **CSV** format.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons.
- **Routing**: React Router DOM (v7).
- **Visualizations**: Recharts.
- **Date Engine**: date-fns (calendar calculations & timezone formatting).
- **Backend & Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security).
- **Testing**: Vitest, @testing-library/react, @testing-library/jest-dom, jsdom.

---

## 🚀 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd personal_Daily_Tracker
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Database Schema Migration
In your Supabase project:
1. Open the **SQL Editor** from the left navigation.
2. Open the file `supabase/migrations/20261025000000_initial_schema.sql` from this repository.
3. Paste its contents into the SQL Editor and click **Run**.
4. This script creates all tables, foreign keys, constraints, indexes, Row Level Security (RLS) policies, and the `handle_new_user` trigger that seeds default settings and habits upon signup.

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run Automated Tests
```bash
npm test
```

### 6. Run Production Build
```bash
npm run build
```

---

## ☁️ Deployment on Vercel

1. Push your repository to GitHub or GitLab.
2. Import the repository into your **Vercel** dashboard.
3. Set the Framework Preset to **Vite**.
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon/Public Key.
5. Deploy! Client-side routing is automatically handled via `vercel.json`.

---

## 🔒 Security & Privacy Architecture

- **Row Level Security (RLS)**: Enabled on all tables (`user_profiles`, `user_settings`, `habits`, `daily_habit_logs`, `study_sessions`, `problem_solving_records`, `job_applications`, `daily_health_logs`, `water_logs`, `daily_reflections`, `tomorrow_plans`, `temple_visits`).
- **User Isolation**: `auth.uid() = user_id` policies strictly prevent cross-user data access.
- **Zero Credential Exposure**: Private service-role keys are never included in frontend code.
- **Discreet UI**: Sensitive habits have privacy masks to prevent exposure in shared environments or notifications.
