"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { getSupabase } from "@/lib/supabaseClient";
import {
  PlusCircle, Clock, CheckCircle2, Activity, FileText, Calendar, ArrowRight
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-50 text-emerald-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'in_progress': return 'bg-blue-50 text-blue-700';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || "Student"}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Here's an overview of your complaints</p>
        </div>
        <Link href="/dashboard/submit">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: FileText, color: "text-neutral-600 bg-neutral-100" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "In Progress", value: stats.inProgress, icon: Activity, color: "text-blue-600 bg-blue-50" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-500">{stat.label}</span>
              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900">{loading ? "—" : stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Complaints</h2>
          <Link href="/dashboard/complaints" className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4 animate-pulse">
                <div className="h-4 bg-neutral-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-neutral-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : recentComplaints.length > 0 ? (
          <div className="space-y-2">
            {recentComplaints.map((complaint) => (
              <Link href={`/dashboard/complaints/${complaint.id}`} key={complaint.id}>
                <div className="bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-neutral-900 truncate">
                        {complaint.title || `Complaint #${complaint.id.slice(0, 8)}`}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                        {complaint.description || "No description"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                        <span className="font-mono">ID: {complaint.id.slice(0, 8)}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusStyle(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-dashed border-neutral-300 p-8 text-center">
            <FileText className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-500 mb-3">No complaints yet</p>
            <Link href="/dashboard/submit">
              <Button size="sm" variant="outline">Submit your first complaint</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Submit Complaint", description: "Report a new issue", href: "/dashboard/submit" },
          { title: "View Announcements", description: "Latest campus updates", href: "/dashboard/announcements" },
          { title: "Update Profile", description: "Manage your account", href: "/dashboard/profile" },
        ].map((action) => (
          <Link href={action.href} key={action.href}>
            <div className="bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-colors cursor-pointer">
              <h3 className="text-sm font-medium text-neutral-900">{action.title}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
