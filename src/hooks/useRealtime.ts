import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRealtime(table: string, callback: () => void) {
  useEffect(() => {
    // 1. Set up the subscription
    const channelId = Math.random().toString(36).substring(7);
    const channel = supabase
      .channel(`realtime_${table}_${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for ALL changes (Insert, Update, Delete)
          schema: 'public',
          table: table,
        },
        () => {
          // 2. Run the callback when a change happens
          callback();
        }
      )
      .subscribe();

    // 3. Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback]);
}
