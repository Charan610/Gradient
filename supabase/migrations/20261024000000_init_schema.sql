-- ==============================================================================
-- FOUNDATION: Personal Study Operating System
-- Migration 00: Initial Schema & Row Level Security
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SHARED CURRICULUM TABLES (Read-only for learners)
CREATE TABLE IF NOT EXISTS curriculum_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_tag TEXT NOT NULL UNIQUE,
    source_sha256 TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS phases (
    id TEXT PRIMARY KEY, -- e.g. 'P0', 'P1'
    track_id TEXT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    phase_code TEXT NOT NULL UNIQUE,
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    estimated_hours TEXT NOT NULL,
    approx_study_days TEXT NOT NULL,
    prerequisite_phase_id TEXT REFERENCES phases(id),
    optional_parallel BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY, -- e.g. 'CPP', 'DSA', 'DB', 'CS', 'BE', 'AI'
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY, -- e.g. 'P0.01', 'P1.03'
    phase_id TEXT NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    stable_code TEXT NOT NULL UNIQUE,
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    expected_minutes INTEGER NOT NULL DEFAULT 90,
    learning_outcomes JSONB NOT NULL DEFAULT '[]'::jsonb,
    prereq_codes TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_days (
    id TEXT PRIMARY KEY, -- e.g. 'P0-D01', 'P0-D02'
    phase_id TEXT NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
    sequence_index INTEGER NOT NULL, -- Pure sequential counter 1, 2, 3...
    stable_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    goal TEXT NOT NULL,
    estimated_minutes INTEGER NOT NULL DEFAULT 90,
    curriculum_version_id UUID REFERENCES curriculum_versions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS day_tasks (
    id TEXT PRIMARY KEY, -- e.g. 'P0-D01-T01'
    learning_day_id TEXT NOT NULL REFERENCES learning_days(id) ON DELETE CASCADE,
    module_id TEXT REFERENCES modules(id) ON DELETE SET NULL,
    task_order INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('learn', 'practice', 'apply', 'review')),
    required BOOLEAN NOT NULL DEFAULT TRUE,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    estimate_minutes INTEGER NOT NULL DEFAULT 30,
    validation_criteria TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY, -- e.g. 'R01', 'R02', ..., 'R41'
    stable_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    provider TEXT NOT NULL,
    access_level TEXT NOT NULL DEFAULT 'free',
    verification_status TEXT NOT NULL DEFAULT 'checked' CHECK (verification_status IN ('checked', 'needs_check', 'broken')),
    source_confidence TEXT NOT NULL DEFAULT 'official' CHECK (source_confidence IN ('official', 'plan', 'emerging', 'prediction')),
    source_notes TEXT,
    avoid_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_resources (
    task_id TEXT NOT NULL REFERENCES day_tasks(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    exact_assigned_sections TEXT NOT NULL,
    purpose TEXT NOT NULL,
    note_what_to_skip TEXT,
    PRIMARY KEY (task_id, resource_id)
);

CREATE TABLE IF NOT EXISTS phase_gates (
    id TEXT PRIMARY KEY, -- e.g. 'GATE-P0'
    phase_id TEXT NOT NULL UNIQUE REFERENCES phases(id) ON DELETE CASCADE,
    gate_type TEXT NOT NULL DEFAULT 'comprehensive_test',
    title TEXT NOT NULL,
    rubric_json JSONB NOT NULL,
    pass_criteria TEXT NOT NULL,
    suggested_review_module_ids TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_templates (
    id TEXT PRIMARY KEY, -- e.g. 'PROJ-A', 'PROJ-B', 'PROJ-C'
    phase_id TEXT NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    milestones_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRIVATE USER PROGRESS & TELEMETRY TABLES

CREATE TABLE IF NOT EXISTS profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    alias TEXT NOT NULL,
    academic_semester TEXT NOT NULL DEFAULT '2-2',
    target_role TEXT NOT NULL DEFAULT 'Software Development Engineer / Backend',
    optional_cgpa NUMERIC(3, 2),
    preferred_daily_minutes INTEGER NOT NULL DEFAULT 90 CHECK (preferred_daily_minutes IN (45, 60, 90, 120, 150)),
    preferred_mode TEXT NOT NULL DEFAULT 'normal' CHECK (preferred_mode IN ('light', 'normal', 'deep', 'maintenance')),
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    onboarding_status TEXT NOT NULL DEFAULT 'completed' CHECK (onboarding_status IN ('pending', 'completed')),
    active_day_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_phase_progress (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phase_id TEXT NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
    state TEXT NOT NULL DEFAULT 'locked' CHECK (state IN ('locked', 'available', 'in_progress', 'gate_pending', 'passed')),
    gate_passed BOOLEAN NOT NULL DEFAULT FALSE,
    active_day_index INTEGER NOT NULL DEFAULT 1,
    unlocked_at TIMESTAMPTZ,
    passed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, phase_id)
);

CREATE TABLE IF NOT EXISTS user_day_progress (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_day_id TEXT NOT NULL REFERENCES learning_days(id) ON DELETE CASCADE,
    state TEXT NOT NULL DEFAULT 'not_started' CHECK (state IN ('not_started', 'in_progress', 'completed', 'skipped')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    time_spent_minutes INTEGER NOT NULL DEFAULT 0,
    self_rating TEXT CHECK (self_rating IN ('confident', 'needs_review')),
    PRIMARY KEY (user_id, learning_day_id)
);

CREATE TABLE IF NOT EXISTS user_task_progress (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    day_task_id TEXT NOT NULL REFERENCES day_tasks(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped_optional')),
    evidence_text TEXT,
    evidence_url TEXT,
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, day_task_id)
);

CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learning_day_id TEXT NOT NULL REFERENCES learning_days(id) ON DELETE CASCADE,
    self_reported_minutes INTEGER NOT NULL,
    reflection TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS concept_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    concept_prompt TEXT NOT NULL,
    concept_answer TEXT NOT NULL,
    last_day_index INTEGER NOT NULL,
    next_due_day_index INTEGER NOT NULL,
    interval_step INTEGER NOT NULL DEFAULT 1,
    latest_confidence TEXT NOT NULL DEFAULT 'needs_work' CHECK (latest_confidence IN ('needs_work', 'stable')),
    mistake_tag TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    concept_review_id UUID REFERENCES concept_reviews(id) ON DELETE SET NULL,
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    learning_day_index INTEGER NOT NULL,
    rating TEXT NOT NULL CHECK (rating IN ('needs_work', 'stable')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gate_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phase_id TEXT NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
    score_json JSONB NOT NULL,
    passed BOOLEAN NOT NULL,
    evidence TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_project_milestones (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_template_id TEXT NOT NULL REFERENCES project_templates(id) ON DELETE CASCADE,
    milestone_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    evidence_url TEXT,
    notes TEXT,
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, project_template_id, milestone_code)
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'India / Remote',
    url TEXT,
    kind TEXT NOT NULL DEFAULT 'internship' CHECK (kind IN ('internship', 'full_time', 'research', 'open_source')),
    status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'oa', 'interview', 'offer', 'rejected', 'withdrawn')),
    eligibility_note TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'open' CHECK (state IN ('open', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_modules_phase ON modules(phase_id, order_index);
CREATE INDEX IF NOT EXISTS idx_learning_days_phase ON learning_days(phase_id, sequence_index);
CREATE INDEX IF NOT EXISTS idx_day_tasks_day ON day_tasks(learning_day_id, task_order);
CREATE INDEX IF NOT EXISTS idx_user_task_progress_user ON user_task_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_day_progress_user ON user_day_progress(user_id, state);
CREATE INDEX IF NOT EXISTS idx_concept_reviews_due ON concept_reviews(user_id, next_due_day_index);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id, status);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES

-- Public Curriculum Read Access
ALTER TABLE curriculum_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read curriculum_versions" ON curriculum_versions FOR SELECT USING (true);

ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tracks" ON tracks FOR SELECT USING (true);

ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read phases" ON phases FOR SELECT USING (true);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read modules" ON modules FOR SELECT USING (true);

ALTER TABLE learning_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read learning_days" ON learning_days FOR SELECT USING (true);

ALTER TABLE day_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read day_tasks" ON day_tasks FOR SELECT USING (true);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (true);

ALTER TABLE task_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read task_resources" ON task_resources FOR SELECT USING (true);

ALTER TABLE phase_gates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read phase_gates" ON phase_gates FOR SELECT USING (true);

ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read project_templates" ON project_templates FOR SELECT USING (true);

-- Private User Space RLS Policies (auth.uid() = user_id)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE user_phase_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own phase progress" ON user_phase_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own phase progress" ON user_phase_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own phase progress" ON user_phase_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own phase progress" ON user_phase_progress FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE user_day_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own day progress" ON user_day_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own day progress" ON user_day_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own day progress" ON user_day_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own day progress" ON user_day_progress FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE user_task_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own task progress" ON user_task_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own task progress" ON user_task_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own task progress" ON user_task_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own task progress" ON user_task_progress FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own study sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE concept_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own concept reviews" ON concept_reviews FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE review_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own review attempts" ON review_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE gate_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own gate attempts" ON gate_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE user_project_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own project milestones" ON user_project_milestones FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own applications" ON applications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE resource_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own resource feedback" ON resource_feedback FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. ATOMIC STORED PROCEDURE: finish_learning_day
CREATE OR REPLACE FUNCTION finish_learning_day(p_day_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_incomplete_required_count INT;
  v_current_seq INT;
  v_target_seq INT;
  v_phase_id TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Verify all required tasks for this learning day are completed
  SELECT COUNT(*)
  INTO v_incomplete_required_count
  FROM day_tasks dt
  LEFT JOIN user_task_progress utp 
    ON utp.day_task_id = dt.id AND utp.user_id = v_user_id
  WHERE dt.learning_day_id = p_day_id
    AND dt.required = TRUE
    AND (utp.status IS NULL OR utp.status != 'completed');

  IF v_incomplete_required_count > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'incomplete_required_tasks',
      'remaining_count', v_incomplete_required_count
    );
  END IF;

  -- Fetch day metadata
  SELECT sequence_index, phase_id 
  INTO v_target_seq, v_phase_id 
  FROM learning_days 
  WHERE id = p_day_id;

  -- Mark day completed
  INSERT INTO user_day_progress (user_id, learning_day_id, state, completed_at)
  VALUES (v_user_id, p_day_id, 'completed', NOW())
  ON CONFLICT (user_id, learning_day_id)
  DO UPDATE SET state = 'completed', completed_at = NOW();

  -- Advance active sequence in user profile
  UPDATE profiles
  SET active_day_index = GREATEST(active_day_index, v_target_seq + 1),
      updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Schedule spaced reviews for modules covered in this day
  INSERT INTO concept_reviews (user_id, module_id, concept_prompt, concept_answer, last_day_index, next_due_day_index, interval_step)
  SELECT 
    v_user_id,
    dt.module_id,
    'Key concept review for ' || dt.title,
    dt.validation_criteria,
    v_target_seq,
    v_target_seq + 1, -- First repetition offset (+1 learning day)
    1
  FROM day_tasks dt
  WHERE dt.learning_day_id = p_day_id 
    AND dt.module_id IS NOT NULL
  ON CONFLICT DO NOTHING;

  RETURN jsonb_build_object(
    'success', true,
    'completed_day_id', p_day_id,
    'next_day_sequence', v_target_seq + 1
  );
END;
$$;
