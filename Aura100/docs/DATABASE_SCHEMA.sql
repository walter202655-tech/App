-- ============================================================================
-- AURA100 v4.0 — PRODUCTION DATABASE ARCHITECTURE & RLS SPECIFICATION
-- Database Engine: PostgreSQL 16+ / Supabase
-- Security Model: Row Level Security (RLS), Least Privilege, Privacy by Design
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. USERS & PROFILES (Linked to Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL UNIQUE,
    avatar VARCHAR(20) DEFAULT '🦊',
    target_cefr VARCHAR(2) DEFAULT 'B1' CHECK (target_cefr IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    estimated_cefr VARCHAR(2) DEFAULT 'B1' CHECK (estimated_cefr IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    best_streak INTEGER DEFAULT 0 CHECK (best_streak >= 0),
    daily_goal_xp INTEGER DEFAULT 50 CHECK (daily_goal_xp > 0),
    sound_enabled BOOLEAN DEFAULT TRUE,
    theme VARCHAR(30) DEFAULT 'cyberpunk',
    is_minor BOOLEAN DEFAULT FALSE, -- Flag for age-appropriate data protection
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIPTIONS & ENTITLEMENTS (Server-authoritative permissions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_tier VARCHAR(20) DEFAULT 'free' CHECK (plan_tier IN ('free', 'premium_student', 'school_license')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
    ai_monthly_quota INTEGER DEFAULT 50, -- Free tier gets 50 AI requests/month
    ai_quota_used INTEGER DEFAULT 0,
    quota_reset_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
    can_use_writing_ai BOOLEAN DEFAULT TRUE,
    can_use_chat_ai BOOLEAN DEFAULT TRUE,
    can_use_learning_plan_ai BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_entitlement UNIQUE (user_id)
);

-- ----------------------------------------------------------------------------
-- 3. MISTAKE NOTEBOOK (Cuaderno de Errores)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_mistakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    source_module VARCHAR(60) NOT NULL,
    skill VARCHAR(20) NOT NULL CHECK (skill IN ('grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking')),
    topic VARCHAR(120) NOT NULL,
    user_answer TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    frequency INTEGER DEFAULT 1 CHECK (frequency >= 1),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'mastered')),
    consecutive_successes INTEGER DEFAULT 0 CHECK (consecutive_successes >= 0),
    next_review_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. ADAPTIVE COMPETENCIES & METRICS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill VARCHAR(20) NOT NULL CHECK (skill IN ('grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking')),
    topic VARCHAR(120) NOT NULL,
    difficulty VARCHAR(2) NOT NULL CHECK (difficulty IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    attempts INTEGER DEFAULT 0 CHECK (attempts >= 0),
    correct INTEGER DEFAULT 0 CHECK (correct >= 0),
    accuracy NUMERIC(5, 2) DEFAULT 0.0 CHECK (accuracy >= 0.0 AND accuracy <= 100.0),
    mastery_status VARCHAR(20) DEFAULT 'new' CHECK (mastery_status IN ('new', 'learning', 'reviewing', 'mastered')),
    last_practiced TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_topic_competency UNIQUE (user_id, skill, topic)
);

-- ----------------------------------------------------------------------------
-- 5. PLACEMENT TEST DIAGNOSTIC HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    overall_cefr VARCHAR(2) NOT NULL CHECK (overall_cefr IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
    grammar_score NUMERIC(5, 2),
    vocabulary_score NUMERIC(5, 2),
    reading_score NUMERIC(5, 2),
    listening_score NUMERIC(5, 2),
    writing_score NUMERIC(5, 2),
    speaking_score NUMERIC(5, 2),
    detailed_report JSONB NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. WRITING SUBMISSIONS & AI AUDIT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.writing_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id VARCHAR(60) NOT NULL,
    task_type VARCHAR(30) NOT NULL,
    level VARCHAR(2) NOT NULL,
    word_count INTEGER NOT NULL,
    original_text TEXT NOT NULL,
    evaluation JSONB NOT NULL,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. AUDIT & AI USAGE LOGS (Zero storage of private prompt texts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint VARCHAR(60) NOT NULL,
    model VARCHAR(60) NOT NULL,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    status_code INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation: Users can only select, insert, update and delete their own records.
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policy
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Entitlements Policy (Read-only for client; only backend service_role updates entitlements)
CREATE POLICY "Users can view own entitlements" ON public.user_entitlements FOR SELECT USING (auth.uid() = user_id);

-- Mistakes Policy
CREATE POLICY "Users manage own mistakes" ON public.user_mistakes FOR ALL USING (auth.uid() = user_id);

-- Competencies Policy
CREATE POLICY "Users manage own competencies" ON public.user_competencies FOR ALL USING (auth.uid() = user_id);

-- Placement Tests Policy
CREATE POLICY "Users view own placement reports" ON public.placement_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own placement report" ON public.placement_tests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Writing Submissions Policy
CREATE POLICY "Users manage own writing submissions" ON public.writing_submissions FOR ALL USING (auth.uid() = user_id);

-- AI Usage Logs Policy
CREATE POLICY "Users view own AI usage logs" ON public.ai_usage_logs FOR SELECT USING (auth.uid() = user_id);
