import { getSupabase } from "@/lib/supabaseClient";
import { Complaint, ComplaintStatus } from "@/types/complaint";
import type { ComplaintCategory } from "@/lib/categories";

export const complaintService = {
  async createComplaint(userId: string, title: string, description: string) {
    // 1. AI Classification (via API route — keeps the AI key server-side).
    //    `classifiedByAI: false` means the AI could not run and the complaint
    //    will be saved as "others" for later manual review.
    let category: ComplaintCategory = "others";
    let classifiedByAI = false;
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (res.ok && data?.category) {
        category = data.category as ComplaintCategory;
        classifiedByAI = !data.fallback;
      }
    } catch (err) {
      console.warn("AI classification unavailable, defaulting to 'others':", err);
    }

    // 2. Save to Database
    const { data, error } = await getSupabase()
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
    return { ...data, classifiedByAI } as Complaint & { classifiedByAI: boolean };
  },

  async getMyComplaints(userId: string) {
    const { data, error } = await getSupabase()
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Complaint[];
  },

  async getAllComplaints(supabaseClient?: any) {
    const client = supabaseClient || getSupabase();
    const { data: complaints, error } = await client
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: profiles } = await client
      .from('profiles')
      .select('id, full_name');

    const profileMap = (profiles || []).reduce((acc: any, p: any) => {
      acc[p.id] = p.full_name;
      return acc;
    }, {});

    return (complaints || []).map((c: any) => ({
      ...c,
      profiles: { full_name: profileMap[c.user_id] || profileMap[c.student_id] || "Unknown Student" }
    })) as (Complaint & { profiles: { full_name: string } })[];
  },

  async updateComplaintStatus(id: string, status: ComplaintStatus, responseNote?: string) {
    const { data, error } = await getSupabase()
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

  async getComplaintById(id: string, supabaseClient?: any) {
    const client = supabaseClient || getSupabase();
    const { data: complaint, error: complaintError } = await client
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single();

    if (complaintError) throw complaintError;

    // Fetch profile separately
    const { data: profile, error: profileError } = await client
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
