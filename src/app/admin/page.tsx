"use client";

import React, { useEffect, useState } from "react";
import { complaintService } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import { Clock, CheckCircle2, TrendingUp, MessageSquare, AlertTriangle, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, urgent: 0 });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    try {
      const complaints = await complaintService.getAllComplaints();
      const urgent = (complaints as any[]).filter(c => {
        const daysPending = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return c.status === 'pending' && daysPending > 2;
      });

      setStats({
        total: complaints.length,
        pending: (complaints as any[]).filter(c => c.status === 'pending').length,
        inProgress: (complaints as any[]).filter(c => c.status === 'in_progress').length,
        resolved: (complaints as any[]).filter(c => c.status === 'resolved').length,
        urgent: urgent.length,
      });
      setRecentComplaints(complaints.slice(0, 5));
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  }

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

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.35rem] font-bold text-neutral-900 tracking-[-0.02em]">Admin Dashboard</h1>
          <p className="text-[13px] text-neutral-500 mt-1">System overview and complaint management</p>
        </div>
        <button onClick={loadStats} className="flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: MessageSquare, color: "text-neutral-600 bg-neutral-100" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "In Progress", value: stats.inProgress, icon: TrendingUp, color: "text-sky-600 bg-sky-50" },
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

      {/* Urgent Alert */}
      {stats.urgent > 0 && (
        <div className="bg-red-50/50 border border-red-200/60 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-red-800">{stats.urgent} complaint{stats.urgent !== 1 ? 's' : ''} pending over 48 hours</p>
              <p className="text-[12px] text-red-600/80">These need immediate attention</p>
            </div>
          </div>
          <Link href="/admin/complaints" className="text-[13px] font-medium text-red-700 hover:text-red-800 transition-colors flex items-center gap-1">
            Review <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Resolution Progress */}
      <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold text-neutral-900">Resolution Progress</span>
          <span className="text-[13px] text-neutral-500 font-medium">
            {resolutionRate}%
          </span>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-2">
          <div
            className="bg-neutral-900 rounded-full h-2 transition-all duration-700 ease-out"
            style={{ width: `${resolutionRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2.5 text-[12px] text-neutral-400">
          <span>{stats.resolved} resolved</span>
          <span>{stats.total} total</span>
        </div>
      </div>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-neutral-900">Recent Complaints</h2>
          <Link href="/admin/complaints" className="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentComplaints.length > 0 ? (
            recentComplaints.map((complaint) => (
              <Link key={complaint.id} href={`/admin/complaints/${complaint.id}`}>
                <div className={`relative bg-white rounded-xl border border-neutral-200/80 p-4 hover:border-neutral-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-250 cursor-pointer group border-l-[3px] ${getStatusColor(complaint.status)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusBg(complaint.status)}`}>
                          {complaint.status?.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-neutral-400">{formatDate(complaint.created_at)}</span>
                      </div>
                      <h3 className="text-[14px] font-medium text-neutral-900 truncate group-hover:text-primary-600 transition-colors">{complaint.title || "Untitled"}</h3>
                      <p className="text-[12px] text-neutral-500 mt-0.5 truncate">{complaint.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-0.5 flex-shrink-0 mt-2 transition-all duration-200" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-[13px] text-neutral-500">No complaints yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
