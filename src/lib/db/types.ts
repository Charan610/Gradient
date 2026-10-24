// ==============================================================================
// FOUNDATION DATABASE & DOMAIN TYPES
// ==============================================================================

export type VerificationStatus = 'checked' | 'needs_check' | 'broken';
export type SourceConfidence = 'official' | 'plan' | 'emerging' | 'prediction';
export type TaskKind = 'learn' | 'practice' | 'apply' | 'review';
export type DayProgressState = 'not_started' | 'in_progress' | 'completed' | 'skipped';
export type TaskProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped_optional';
export type PhaseState = 'locked' | 'available' | 'in_progress' | 'gate_pending' | 'passed';
export type ApplicationStatus = 'saved' | 'applied' | 'oa' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
export type ApplicationKind = 'internship' | 'full_time' | 'research' | 'open_source';

export interface ResourceItem {
  id: string; // e.g. 'R01'
  stable_code: string;
  title: string;
  url: string;
  provider: string;
  access_level: 'free' | 'paid_optional' | 'paid_required';
  verification_status: VerificationStatus;
  source_confidence: SourceConfidence;
  source_notes: string;
  avoid_notes?: string;
}

export interface TaskResourceAssignment {
  resource_id: string;
  exact_assigned_sections: string;
  purpose: string;
  note_what_to_skip?: string;
}

export interface DayTask {
  id: string;
  learning_day_id: string;
  module_id?: string;
  task_order: number;
  kind: TaskKind;
  required: boolean;
  title: string;
  instructions: string;
  estimate_minutes: number;
  validation_criteria: string;
  assigned_resources?: TaskResourceAssignment[];
}

export interface LearningDay {
  id: string;
  phase_id: string;
  sequence_index: number; // 1, 2, 3...
  stable_code: string;
  title: string;
  goal: string;
  estimated_minutes: number;
  tasks: DayTask[];
}

export interface ModuleItem {
  id: string;
  phase_id: string;
  subject_id: string;
  stable_code: string;
  order_index: number;
  title: string;
  expected_minutes: number;
  learning_outcomes: string[];
  prereq_codes: string[];
}

export interface PhaseGateRubric {
  id: string;
  phase_id: string;
  title: string;
  pass_criteria: string;
  instructions: string;
  time_limit_minutes: number;
  rubric_items: {
    id: string;
    criterion: string;
    weight: number;
  }[];
  suggested_review_module_ids: string[];
}

export interface PhaseItem {
  id: string; // 'P0' through 'P8'
  track_id: string;
  phase_code: string;
  order_index: number;
  title: string;
  description: string;
  estimated_hours: string;
  approx_study_days: string;
  prerequisite_phase_id?: string;
  optional_parallel: boolean;
  gate_definition: PhaseGateRubric;
}

export interface SubjectItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ProjectMilestone {
  code: string;
  title: string;
  description: string;
  estimated_hours: string;
  deliverables: string[];
}

export interface ProjectTemplate {
  id: string;
  phase_id: string;
  name: string;
  tagline: string;
  description: string;
  tech_stack: string[];
  milestones: ProjectMilestone[];
  interview_questions: string[];
}

export interface UserProfile {
  user_id: string;
  alias: string;
  academic_semester: string;
  target_role: string;
  optional_cgpa?: number | null;
  preferred_daily_minutes: number; // 45, 60, 90, 120, 150
  preferred_mode: 'light' | 'normal' | 'deep' | 'maintenance';
  theme: 'light' | 'dark' | 'system';
  onboarding_status: 'pending' | 'completed';
  active_day_index: number; // Defaults to 1
  created_at?: string;
  updated_at?: string;
}

export interface UserTaskProgress {
  user_id: string;
  day_task_id: string;
  status: TaskProgressStatus;
  evidence_text?: string;
  evidence_url?: string;
  completed_at?: string;
}

export interface UserDayProgress {
  user_id: string;
  learning_day_id: string;
  state: DayProgressState;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  time_spent_minutes: number;
  self_rating?: 'confident' | 'needs_review';
}

export interface ConceptReview {
  id: string;
  user_id: string;
  module_id: string;
  concept_prompt: string;
  concept_answer: string;
  last_day_index: number;
  next_due_day_index: number;
  interval_step: number;
  latest_confidence: 'needs_work' | 'stable';
  mistake_tag?: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  role: string;
  location: string;
  url?: string;
  kind: ApplicationKind;
  status: ApplicationStatus;
  eligibility_note?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GateAttempt {
  id: string;
  user_id: string;
  phase_id: string;
  score_json: Record<string, number | boolean | string>;
  passed: boolean;
  evidence: string;
  created_at: string;
}
