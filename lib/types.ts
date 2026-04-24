export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type RecentRecognition = {
  name: string;
  date: string;
  time: string;
  status: string;
};

export type RecognitionEvent = {
  id: number;
  occurred_at: string;
  employee_name: string | null;
  employee_code: string | null;
  predicted_label: string | null;
  confidence: number;
  liveness_score: number | null;
  event_mode: string;
  match_result: string;
  business_outcome: string | null;
  attendance_action: string | null;
  duplicate_suppressed: boolean;
  snapshot_reference: string | null;
  branch: string | null;
  kiosk_device: string | null;
  source: string | null;
};

export type RecognitionEventStats = {
  total_events: number;
  matched_events: number;
  unregistered_events: number;
  unknown_events: number;
  review_required_events: number;
  duplicate_ignored_events: number;
  outside_shift_window_events: number;
  rejected_events: number;
};

export type ReportSummary = {
  total_employees: number;
  enrolled_employees: number;
  attendance_records_today: number;
  open_attendance_records: number;
  matched_recognition_today: number;
  unregistered_recognition_today: number;
  present_records: number;
  late_records: number;
  checked_out_records: number;
  review_required_records: number;
  duplicate_ignored_events: number;
  outside_shift_events: number;
  unrecognized_events: number;
  branch_breakdown: Record<string, number>;
};

export type BranchInfo = {
  id: number;
  code: string;
  name: string;
  city: string | null;
  is_active: boolean;
};

export type ShiftInfo = {
  id: number;
  code: string;
  name: string;
  start_time: string;
  end_time: string;
  grace_minutes: number;
  late_after_minutes: number;
  is_active: boolean;
};

export type SystemHealth = {
  app_status: string;
  database_status: string;
  model_ready: boolean;
  known_persons_count: number;
  today_recognition_events: number;
  today_attendance_records: number;
};

export type AttendanceRecord = {
  employee_code: string;
  employee_name: string;
  branch: string;
  department: string;
  work_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  attendance_status: string;
  minutes_late: number;
  overtime_minutes: number;
  source_type: string;
  record_state: string;
  check_in_outcome: string | null;
  check_out_outcome: string | null;
};

export type DashboardSummary = {
  today: string;
  today_count: number;
  today_records: RecentRecognition[];
  weekly_data: Record<string, number>;
  late_trend: Record<string, number>;
  model_ready: boolean;
  known_persons: string[];
  known_persons_count: number;
  days_logged: number;
  recognition_stats: RecognitionEventStats;
  report_summary: ReportSummary;
};

export type PersonInfo = {
  id: number;
  employee_code: string;
  full_name: string;
  branch_name: string;
  department_name: string;
  employment_status: string;
  enrollment_status: string;
  dataset_key: string;
  image_count: number;
  complete: boolean;
  is_active: boolean;
};

export type PersonStats = {
  total_persons: number;
  complete: number;
  incomplete: number;
  total_images: number;
  total_needed_per_person: number;
};
