import { ComplaintCategory } from "@/lib/categories";

export type ComplaintStatus = 'pending' | 'in_progress' | 'reviewing' | 'review' | 'resolved' | 'rejected';

export interface Complaint {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  response_note: string | null;
  created_at: string;
  updated_at: string;
}
