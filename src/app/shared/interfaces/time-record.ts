export interface TimeRecord {
  id?: number;
  staff_name: string;
  project_name: string;
  date: string;
  time_start: string;
  time_end: string | null;
  comment: string;
}
