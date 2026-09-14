"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { getSupabase } from "@/lib/supabaseClient";
import {
  PlusCircle, Clock, CheckCircle2, Activity, FileText, Calendar, ArrowRight, ChevronRight, MessageSquare
} from "lucide-react";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0 });
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      const user = await authService.getCurrentUser();
      if (user) {
        const profileData = await authService.getProfile(user.id);
        setProfile(profileData);

        if (profileData?.role === 'admin') {
          window.location.href = '/admin';
          return;
        }

        const { data: complaints } = await getSupabase()
          .from('complaints')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (complaints) {
          const list = complaints as any[];
          setStats({
            total: list.length,
            pending: list.filter((c: any) => c.status === 'pending').length,
            resolved: list.filter((c: any) => c.status === 'resolved').length,
            inProgress: list.filter((c: any) => c.status === 'in_progress' || c.status === 'reviewing').length
          });
          setRecentComplaints(list.slice(0, 5));
        }
      }
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'border-l-emerald-500';
      case 'pending': return 'border-l-amber-500';
      case 'in_progress': return 'border-l-sky-500';
      default: return 'border-l-neutral-300';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'in_progress': return 'bg-sky-50 text-sky-700 border border-sky-200/60';
      default: return 'bg-neutral-50 text-neutral-600 border border-neutral-200/60';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.35rem] font-bold text-neutral-900 tracking-[-0.02em]">
            Welcome back, {profile?.full_name?.split(' ')[0] || "Student"}
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">Here's an overview of your complaints</p>
        </div>
        <Link href="/dashboard/submit">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: FileText, color: "text-neutral-600 bg-neutral-100" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "In Progress", value: stats.inProgress, icon: Activity, color: "text-sky-600 bg-sky-50" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-neutral-200/80 p-4 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.06em]">{stat.label}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-[1.5rem] font-bold text-neutral-900 tracking-[-0.03em]">{loading ? "—" : stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-neutral-900">Recent Complaints</h2>
          <Link href="/dashboard/complaints" className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200/80 p-4 animate-pulse border-l-[3px] border-l-neutral-200">
                <div className="h-3.5 bg-neutral-100 rounded w-1/3 mb-2.5" />
                <div className="h-3 bg-neutral-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : recentComplaints.length > 0 ? (
          <div className="space-y-2">
            {recentComplaints.map((complaint) => (
              <Link href={`/dashboard/complaints/${complaint.id}`} key={complaint.id}>
                <div className={`relative bg-white rounded-xl border border-neutral-200/80 p-4 hover:border-neutral-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-250 cursor-pointer group border-l-[3px] ${getStatusColor(complaint.status)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-medium text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
                        {complaint.title || `Complaint #${complaint.id.slice(0, 8)}`}
                      </h3>
                      <p className="text-[12px] text-neutral-500 mt-1 line-clamp-1">
                        {complaint.description || "No description"}
                      </p>
                      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                        <span className="font-mono">{complaint.id.slice(0, 8)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusBg(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-neutral-300 p-12 text-center">
            <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-neutral-100">
              <MessageSquare className="w-5 h-5 text-neutral-300" />
            </div>
            <p className="text-[14px] text-neutral-500 mb-4">No complaints yet</p>
            <Link href="/dashboard/submit">
              <Button size="sm" variant="outline">Submit your first complaint</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { title: "Submit Complaint", description: "Report a new issue", href: "/dashboard/submit", icon: PlusCircle },
          { title: "View Announcements", description: "Latest campus updates", href: "/dashboard/announcements", icon: FileText },
          { title: "Update Profile", description: "Manage your account", href: "/dashboard/profile", icon: CheckCircle2 },
        ].map((action) => (
          <Link href={action.href} key={action.href}>
            <div className="bg-white rounded-xl border border-neutral-200/80 p-4 hover:border-neutral-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-250 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center border border-neutral-100 group-hover:bg-neutral-900 group-hover:border-neutral-900 transition-colors duration-200">
                  <action.icon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors duration-200" />
                </div>
                <div>
                  <h3 className="text-[14px] font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">{action.title}</h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">{action.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
