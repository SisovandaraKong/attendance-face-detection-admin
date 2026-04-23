export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type AttendanceRecord = {
  name: string;
  date: string;
  time: string;
  status: string;
};

export type DashboardSummary = {
  today: string;
  today_count: number;
  today_records: AttendanceRecord[];
  weekly_data: Record<string, number>;
  model_ready: boolean;
  known_persons: string[];
  known_persons_count: number;
  days_logged: number;
};

export type PersonInfo = {
  name: string;
  display_name: string;
  image_count: number;
  complete: boolean;
};

export type PersonStats = {
  total_persons: number;
  complete: number;
  incomplete: number;
  total_images: number;
  total_needed_per_person: number;
};
