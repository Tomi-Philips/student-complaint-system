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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Announcements</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Updates from campus administration</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4 animate-pulse">
              <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    {announcement.is_pinned ? (
                      <Pin className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Megaphone className="w-4 h-4 text-neutral-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-neutral-900">{announcement.title}</h3>
                      {announcement.is_pinned && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">Pinned</span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap">{announcement.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
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
        <div className="bg-white rounded-lg border border-dashed border-neutral-300 p-12 text-center">
          <Megaphone className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">No announcements yet. Check back later.</p>
        </div>
      )}
    </div>
  );
}
