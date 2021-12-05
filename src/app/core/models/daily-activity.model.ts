export interface DailyActivity {
  id?: number;
  date?: string;
  user_id?: number;
  project_id?: number;
  task_id?: number;
  keyboard?: number;
  mouse?: number;
  overall?: number;
  tracked?: number;
  manual?: number;
  idle?: number;
  resumed?: number;
  billable?: number;
  created_at?: string;
  updated_at?: string;
}
