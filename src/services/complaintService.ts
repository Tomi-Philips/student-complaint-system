import { supabase } from "@/lib/supabaseClient";
import { Complaint, ComplaintStatus } from "@/types/complaint";
import { classifyComplaint } from "@/lib/classifier";

export const complaintService = {
  async createComplaint(userId: string, title: string, description: string) {
    // 1. AI Classification
    const category = await classifyComplaint(description);

    // 2. Save to Database
    const { data, error } = await supabase
      .from('complaints')
      .insert({
        user_id: userId,
        title,
        description,
        category,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data as Complaint;
  },

  async getMyComplaints(userId: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Complaint[];
  },

  async getAllComplaints(supabaseClient = supabase) {
    const { data: complaints, error } = await supabaseClient
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select('id, full_name');

    const profileMap = (profiles || []).reduce((acc: any, p: any) => {
      acc[p.id] = p.full_name;
      return acc;
    }, {});

    return (complaints || []).map(c => ({
      ...c,
      profiles: { full_name: profileMap[c.user_id] || profileMap[c.student_id] || "Unknown Student" }
    }));
  },

  async updateComplaintStatus(id: string, status: ComplaintStatus, responseNote?: string) {
    const { data, error } = await supabase
      .from('complaints')
      .update({ 
        status, 
        response_note: responseNote,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Complaint;
  },

  async getComplaintById(id: string, supabaseClient = supabase) {
    const { data: complaint, error: complaintError } = await supabaseClient
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();

    if (complaintError) throw complaintError;

    // Fetch profile separately
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', complaint.user_id || complaint.student_id)
      .single();

    // We don't throw for profile errors (e.g. if profile doesn't exist) 
    // to avoid breaking the whole page if a profile is missing
    if (profileError) {
      console.warn(`Profile fetch error for complaint ${id}:`, profileError);
    }
    
    return {
      ...complaint,
      profiles: profile || { full_name: "Unknown Student" },
      responses: complaint.responses || [],
      attachments: complaint.attachments || []
    };
  }
};
