"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSupabase } from "@/lib/supabaseClient";
import { authService } from "@/services/authService";
import { Toast, ToastType } from "@/components/notification/Toast";
import { Megaphone, Trash2, Send, Calendar } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useRealtime } from "@/hooks/useRealtime";

export default function AdminAnnouncementsPage() {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const loadAnnouncements = async () => {
    try {
      const sb = getSupabase();
      let { data, error } = await sb
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        const retry = await sb
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });
        data = retry.data;
      }

      if (data) setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    }
  };

  useEffect(() => { loadAnnouncements(); }, []);
  useRealtime('announcements', loadAnnouncements);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      const { error } = await getSupabase().from('announcements').insert({
        title: formData.title,
        content: formData.content,
        user_id: user?.id
      });

      if (error) throw error;
      setToast({ message: "Announcement posted", type: "success" });
      setFormData({ title: "", content: "" });
      loadAnnouncements();
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this announcement?")) {
      const { error } = await getSupabase().from('announcements').delete().eq('id', id);
      if (!error) {
        setToast({ message: "Deleted", type: "success" });
        loadAnnouncements();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Announcements</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Post updates for students</p>
      </div>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>New Announcement</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3">
            <Input
              placeholder="Announcement title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              className="flex min-h-[100px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              placeholder="Write your announcement..."
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </CardContent>
          <div className="px-6 pb-6 flex justify-end">
            <Button type="submit" size="sm" disabled={loading} className="gap-1.5">
              <Send className="w-3.5 h-3.5" />
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Announcements List */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">Published ({announcements.length})</h2>
        {announcements.length > 0 ? (
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-lg border border-neutral-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-3.5 h-3.5 text-neutral-400" />
                      <h3 className="text-sm font-medium text-neutral-900">{announcement.title}</h3>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1 whitespace-pre-wrap">{announcement.content}</p>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 mt-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(announcement.created_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-neutral-500">No announcements yet</div>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
