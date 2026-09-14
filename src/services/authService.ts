import { getSupabase } from "@/lib/supabaseClient";
import { UserRole } from "@/types/user";

export const authService = {
  async register(email: string, password: string, fullName: string, role: UserRole = 'student') {
    const supabase = getSupabase();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      throw authError;
    }
    if (!authData.user) throw new Error("Registration failed");

    // Create the profile in our 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        role: role
      });

    if (profileError) throw profileError;

    return authData.user;
  },

  async login(email: string, password: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  },

  async logout() {
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  async getProfile(userId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  },

  async getAllUsers() {
    const supabase = getSupabase();
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch complaint counts per user
    const { data: complaintRows } = await supabase
      .from('complaints')
      .select('user_id');

    const complaintCounts: Record<string, number> = {};
    (complaintRows || []).forEach((c: any) => {
      complaintCounts[c.user_id] = (complaintCounts[c.user_id] || 0) + 1;
    });

    return (profiles || []).map((p: any) => ({
      ...p,
      complaintCount: complaintCounts[p.id] || 0,
    }));
  },

  async updateUserRole(userId: string, newRole: string) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;
  }
};
