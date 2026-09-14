"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { getSupabase } from "@/lib/supabaseClient";
import { formatDate } from "@/utils/formatDate";
import { Megaphone, Calendar, Pin } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = React.useCallback(async () => {
    try {
      const sb = getSupabase();
      let { data, error } = await sb
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAnnouncements(); }, [loadAnnouncements]);
  useRealtime('announcements', loadAnnouncements);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[1.35rem] font-bold text-neutral-900 tracking-[-0.02em]">Announcements</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Updates from campus administration</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200/80 p-5 animate-pulse">
              <div className="h-3.5 bg-neutral-100 rounded w-3/4 mb-2.5" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-2.5">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-neutral-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-neutral-100">
                    {announcement.is_pinned ? (
                      <Pin className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Megaphone className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-[14px] font-medium text-neutral-900">{announcement.title}</h3>
                      {announcement.is_pinned && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200/60">Pinned</span>
                      )}
                    </div>
                    <p className="text-[13px] text-neutral-600 whitespace-pre-wrap leading-relaxed">{announcement.content}</p>
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-neutral-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(announcement.created_at)}
                      {announcement.category && (
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500">{announcement.category}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-neutral-300 p-12 text-center">
          <Megaphone className="w-8 h-8 text-neutral-200 mx-auto mb-3" />
          <p className="text-[14px] text-neutral-500">No announcements yet. Check back later.</p>
        </div>
      )}
    </div>
  );
}
