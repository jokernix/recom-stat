export interface DateModel {
  date: string;
  duration: number;
  activity_percent: number;
  projects: Array<{
    id: number;
    name: string;
    duration: number;
    activity_percent: number;
  }>;
}
