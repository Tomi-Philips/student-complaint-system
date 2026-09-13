export type UserRole = 'student' | 'admin' | 'staff';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}
