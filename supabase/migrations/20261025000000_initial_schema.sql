-- Migration: 20261025000000_initial_schema.sql
-- Personal Daily Tracker - 365 Days of Self-Improvement
-- Complete PostgreSQL schema with Row Level Security (RLS) and triggers

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  
  -- Study Targets (minutes)
  java_target_minutes INTEGER NOT NULL DEFAULT 120,
  dsa_target_minutes INTEGER NOT NULL DEFAULT 120,
  dsa_target_count INTEGER NOT NULL DEFAULT 3,
  mysql_target_minutes INTEGER NOT NULL DEFAULT 120,
  interview_target_minutes INTEGER NOT NULL DEFAULT 120,
  tech_target_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Alternating Schedule Anchor
  alternating_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  alternating_start_subject TEXT NOT NULL DEFAULT 'mysql' CHECK (alternating_start_subject IN ('mysql', 'interview_prep')),
  
  -- Daily Targets
  job_applications_daily_target INTEGER NOT NULL DEFAULT 10,
  skipping_target_type TEXT NOT NULL DEFAULT 'count' CHECK (skipping_target_type IN ('count', 'minutes')),
  skipping_target_value INTEGER NOT NULL DEFAULT 1000,
  water_target_liters NUMERIC(4,2) NOT NULL DEFAULT 2.50,
  sleep_target_hours NUMERIC(3,1) NOT NULL DEFAULT 7.0,
  instagram_limit_minutes INTEGER NOT NULL DEFAULT 60,
  youtube_limit_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- 365-Day Challenge
  challenge_start_date DATE,
  challenge_is_active BOOLEAN NOT NULL DEFAULT FALSE,
  challenge_target_days INTEGER NOT NULL DEFAULT 365,
  
  -- Reminders
  reminders_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_times JSONB NOT NULL DEFAULT '{"study":"09:00","jobs":"14:00","health":"18:00","reflection":"21:30"}'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- 3. HABITS DEFINITION
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('discipline', 'social_media', 'fitness', 'health', 'custom')),
  tracking_type TEXT NOT NULL CHECK (tracking_type IN ('boolean', 'avoidance', 'numeric', 'duration')),
  target_value NUMERIC,
  target_unit TEXT,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  is_sensitive BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DAILY HABIT LOGS
CREATE TABLE IF NOT EXISTS public.daily_habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  numeric_value NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_habit_date UNIQUE (user_id, habit_id, date)
);

-- 5. STUDY SESSIONS
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('java', 'problem_solving', 'mysql', 'interview_prep', 'technical_learning', 'custom')),
  topic TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
  notes TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROBLEM SOLVING RECORDS
CREATE TABLE IF NOT EXISTS public.problem_solving_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  problem_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  time_spent_minutes INTEGER NOT NULL DEFAULT 0,
  result TEXT NOT NULL CHECK (result IN ('solved_independently', 'solved_with_help', 'attempted', 'needs_revision')),
  needs_revision BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. INTERVIEW REVISION TOPICS
CREATE TABLE IF NOT EXISTS public.interview_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  topic_name TEXT NOT NULL,
  revision_status TEXT NOT NULL DEFAULT 'not_started' CHECK (revision_status IN ('not_started', 'in_progress', 'revised', 'needs_another_revision')),
  last_revised_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. JOB APPLICATIONS
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  application_url TEXT,
  application_date DATE NOT NULL,
  location TEXT,
  work_mode TEXT NOT NULL DEFAULT 'Remote' CHECK (work_mode IN ('Remote', 'Hybrid', 'Onsite')),
  job_source TEXT NOT NULL DEFAULT 'LinkedIn',
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Planned', 'Applied', 'Assessment received', 'Interview scheduled', 'Rejected', 'Selected', 'Withdrawn')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DAILY HEALTH LOGS
CREATE TABLE IF NOT EXISTS public.daily_health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sleep_hours NUMERIC(3,1),
  sleep_start_time TIME,
  sleep_wake_time TIME,
  water_liters NUMERIC(4,2) DEFAULT 0,
  skipping_count INTEGER DEFAULT 0,
  skipping_minutes INTEGER DEFAULT 0,
  no_sugar_maintained BOOLEAN DEFAULT TRUE,
  junk_food_avoided BOOLEAN DEFAULT TRUE,
  skincare_done BOOLEAN DEFAULT FALSE,
  haircare_done BOOLEAN DEFAULT FALSE,
  workout_details JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_health_date UNIQUE (user_id, date)
);

-- 10. WATER LOGS
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. DAILY REFLECTIONS
CREATE TABLE IF NOT EXISTS public.daily_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  went_well TEXT,
  learned TEXT,
  failed_tasks TEXT,
  missed_reason TEXT,
  distractions TEXT,
  improve_tomorrow TEXT,
  mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'low', 'tough')),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_reflection_date UNIQUE (user_id, date)
);

-- 12. TOMORROW PLANS
CREATE TABLE IF NOT EXISTS public.tomorrow_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  java_topic TEXT,
  dsa_topic TEXT,
  mysql_or_interview_topic TEXT,
  tech_topic TEXT,
  job_target INTEGER NOT NULL DEFAULT 10,
  priorities TEXT,
  additional_tasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_tomorrow_plan UNIQUE (user_id, date)
);

-- 13. TUESDAY TEMPLE VISITS
CREATE TABLE IF NOT EXISTS public.temple_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_visited BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_temple_date UNIQUE (user_id, date)
);

-- -------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------

-- user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- habits
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- daily_habit_logs
ALTER TABLE public.daily_habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own habit logs" ON public.daily_habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit logs" ON public.daily_habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit logs" ON public.daily_habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit logs" ON public.daily_habit_logs FOR DELETE USING (auth.uid() = user_id);

-- study_sessions
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own study sessions" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study sessions" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study sessions" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own study sessions" ON public.study_sessions FOR DELETE USING (auth.uid() = user_id);

-- problem_solving_records
ALTER TABLE public.problem_solving_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own problems" ON public.problem_solving_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own problems" ON public.problem_solving_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own problems" ON public.problem_solving_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own problems" ON public.problem_solving_records FOR DELETE USING (auth.uid() = user_id);

-- interview_topics
ALTER TABLE public.interview_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own interview topics" ON public.interview_topics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interview topics" ON public.interview_topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interview topics" ON public.interview_topics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interview topics" ON public.interview_topics FOR DELETE USING (auth.uid() = user_id);

-- job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own job applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own job applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own job applications" ON public.job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own job applications" ON public.job_applications FOR DELETE USING (auth.uid() = user_id);

-- daily_health_logs
ALTER TABLE public.daily_health_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own health logs" ON public.daily_health_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health logs" ON public.daily_health_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health logs" ON public.daily_health_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own health logs" ON public.daily_health_logs FOR DELETE USING (auth.uid() = user_id);

-- water_logs
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own water logs" ON public.water_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own water logs" ON public.water_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own water logs" ON public.water_logs FOR DELETE USING (auth.uid() = user_id);

-- daily_reflections
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own reflections" ON public.daily_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reflections" ON public.daily_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reflections" ON public.daily_reflections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reflections" ON public.daily_reflections FOR DELETE USING (auth.uid() = user_id);

-- tomorrow_plans
ALTER TABLE public.tomorrow_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own plans" ON public.tomorrow_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plans" ON public.tomorrow_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plans" ON public.tomorrow_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plans" ON public.tomorrow_plans FOR DELETE USING (auth.uid() = user_id);

-- temple_visits
ALTER TABLE public.temple_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can select own temple visits" ON public.temple_visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own temple visits" ON public.temple_visits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own temple visits" ON public.temple_visits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own temple visits" ON public.temple_visits FOR DELETE USING (auth.uid() = user_id);

-- -------------------------------------------------------------
-- INDEXES FOR QUERY OPTIMIZATION
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_habits_user_category ON public.habits(user_id, category);
CREATE INDEX IF NOT EXISTS idx_daily_habit_logs_date ON public.daily_habit_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON public.study_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_problem_records_date ON public.problem_solving_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_job_applications_date ON public.job_applications(user_id, application_date);
CREATE INDEX IF NOT EXISTS idx_health_logs_date ON public.daily_health_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_water_logs_date ON public.water_logs(user_id, date);

-- -------------------------------------------------------------
-- TRIGGER FUNCTION: Handle New User Signup
-- Automatically creates Profile, User Settings & Initial Habits
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id UUID := NEW.id;
BEGIN
  -- Insert User Profile
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    new_user_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Insert User Settings
  INSERT INTO public.user_settings (user_id)
  VALUES (new_user_id);

  -- Insert Initial Required Personal Discipline Habits
  INSERT INTO public.habits (user_id, title, category, tracking_type, is_required, is_sensitive, display_order)
  VALUES
    (new_user_id, 'No pornography', 'discipline', 'avoidance', TRUE, TRUE, 1),
    (new_user_id, 'No masturbation', 'discipline', 'avoidance', TRUE, TRUE, 2),
    (new_user_id, 'No sugar', 'discipline', 'avoidance', TRUE, FALSE, 3),
    (new_user_id, 'No mobile scrolling before sleeping', 'discipline', 'avoidance', TRUE, FALSE, 4);

  -- Insert Initial Social Media Control Habits
  INSERT INTO public.habits (user_id, title, category, tracking_type, target_value, target_unit, is_required, display_order)
  VALUES
    (new_user_id, 'Instagram Usage (max 60 min)', 'social_media', 'duration', 60, 'minutes', TRUE, 5),
    (new_user_id, 'YouTube Usage (max 60 min)', 'social_media', 'duration', 60, 'minutes', TRUE, 6);

  -- Insert Fitness Habit
  INSERT INTO public.habits (user_id, title, category, tracking_type, target_value, target_unit, is_required, display_order)
  VALUES
    (new_user_id, 'Daily Skipping', 'fitness', 'numeric', 1000, 'skips', TRUE, 7);

  -- Insert Sleep & Water Habits
  INSERT INTO public.habits (user_id, title, category, tracking_type, target_value, target_unit, is_required, display_order)
  VALUES
    (new_user_id, 'Sleep Duration (>= 7 hrs)', 'health', 'duration', 420, 'minutes', TRUE, 8),
    (new_user_id, 'Water Intake (>= 2.5 L)', 'health', 'numeric', 2.5, 'liters', TRUE, 9);

  -- Insert Initial Interview Revision Topics
  INSERT INTO public.interview_topics (user_id, category, topic_name, revision_status)
  VALUES
    (new_user_id, 'Core Java', 'OOP Concepts (Encapsulation, Inheritance, Polymorphism, Abstraction)', 'not_started'),
    (new_user_id, 'Core Java', 'Collections Framework (List, Set, Map, HashMap internals)', 'not_started'),
    (new_user_id, 'Core Java', 'Generics & Wildcards', 'not_started'),
    (new_user_id, 'Core Java', 'Exception Handling & Custom Exceptions', 'not_started'),
    (new_user_id, 'Core Java', 'Multithreading, Synchronization & Concurrency', 'not_started'),
    (new_user_id, 'Core Java', 'JDBC Connection & PreparedStatement', 'not_started'),
    (new_user_id, 'Spring Boot', 'Dependency Injection & Inversion of Control', 'not_started'),
    (new_user_id, 'Spring Boot', 'Spring Boot Auto-configuration & Starters', 'not_started'),
    (new_user_id, 'Spring Boot', 'REST APIs & HTTP Methods', 'not_started'),
    (new_user_id, 'Spring Boot', 'Spring Data JPA & Hibernate Mapping', 'not_started'),
    (new_user_id, 'MySQL', 'Indexes, Joins & Query Optimization', 'not_started'),
    (new_user_id, 'HR', 'Self Introduction, Project Walkthrough & Behavioral Questions', 'not_started');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
