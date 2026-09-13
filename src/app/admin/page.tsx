"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { complaintService } from "@/services/complaintService";
import { Complaint } from "@/types/complaint";
import { Clock, CheckCircle2, AlertCircle, MessageSquare, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
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
      const urgent = complaints.filter(c => {
        const daysPending = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
        return c.status === 'pending' && daysPending > 2;
      });

      setStats({
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in_progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
        urgent: urgent.length,
      });
      setRecentComplaints(complaints.slice(0, 5));
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Admin Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-0.5">System overview and complaint management</p>
        </div>
        <button onClick={loadStats} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: MessageSquare, bg: "bg-neutral-100 text-neutral-600" },
          { label: "Pending", value: stats.pending, icon: Clock, bg: "bg-amber-50 text-amber-600" },
          { label: "In Progress", value: stats.inProgress, icon: TrendingUp, bg: "bg-blue-50 text-blue-600" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-500">{stat.label}</span>
              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${stat.bg}`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900">{loading ? "—" : stat.value}</div>
          </div>
        ))}
      </div>

      {/* Urgent Alert */}
      {stats.urgent > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800">{stats.urgent} complaint{stats.urgent !== 1 ? 's' : ''} pending over 48 hours</p>
              <p className="text-xs text-red-600">These need immediate attention</p>
            </div>
          </div>
          <Link href="/admin/complaints" className="text-xs font-medium text-red-700 hover:text-red-800">Review →</Link>
        </div>
      )}

      {/* Resolution Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-900">Resolution Progress</span>
            <span className="text-sm text-neutral-500">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div
              className="bg-primary-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-neutral-400">
            <span>{stats.resolved} resolved</span>
            <span>{stats.total} total</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Complaints</h2>
          <Link href="/admin/complaints" className="text-xs text-primary-600 hover:text-primary-700 font-medium">View all →</Link>
        </div>
        <div className="space-y-2">
          {recentComplaints.length > 0 ? (
            recentComplaints.map((complaint) => (
              <Link key={complaint.id} href={`/admin/complaints/${complaint.id}`}>
                <div className="bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusStyle(complaint.status)}`}>
                          {complaint.status?.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-neutral-400">{formatDate(complaint.created_at)}</span>
                      </div>
                      <h3 className="text-sm font-medium text-neutral-900 truncate">{complaint.title || "Untitled"}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5 truncate">{complaint.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-neutral-500">No complaints yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
