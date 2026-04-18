export interface Faculty {
  id: number;
  name: string;
}

export interface University {
  id: number;
  name: string;
  country: string;
  min_gpa: number;
  min_ielts: number;
  faculties: Faculty[];
  admission_chance?: string | null;
}

export interface ApplicationItem {
  id: number;
  university: number;
  university_name?: string;
  country?: string;
  status?: string;
  created_at?: string;
}

export interface LoginResponse {
  token: string;
}
