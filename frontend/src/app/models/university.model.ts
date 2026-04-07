export interface University {
  id: number;
  name: string;
  country: string;
  min_gpa: number;
  min_ielts: number;
  admission_chance?: string; // То самое поле, которое мы добавили!
}

export interface AuthResponse {
  token: string;
}