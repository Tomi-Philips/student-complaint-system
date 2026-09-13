"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { complaintService } from "@/services/complaintService";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/formatDate";
import { Search, X, ChevronLeft, ChevronRight, Clock, CheckCircle, TrendingUp, User, Calendar, Tag, MessageSquare } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await complaintService.getAllComplaints();
      setComplaints(data || []);
    } catch (error) {
      console.error("Failed to load complaints:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadComplaints(); }, [loadComplaints]);
  useRealtime('complaints', loadComplaints);

  useEffect(() => {
    let filtered = [...complaints];
    if (statusFilter !== "all") filtered = filtered.filter(c => c.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.profiles?.full_name?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q)
      );
    }
    setFilteredComplaints(filtered);
    setCurrentPage(1);
  }, [complaints, statusFilter, searchQuery]);

  const paginatedComplaints = filteredComplaints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

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
          <h1 className="text-xl font-semibold text-neutral-900">Manage Complaints</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Review and resolve student issues</p>
        </div>
        <button onClick={loadComplaints} className="text-xs text-neutral-500 hover:text-neutral-700">Refresh</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, title, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1 p-0.5 bg-neutral-100 rounded-lg">
          {["all", "pending", "in_progress", "resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                statusFilter === status ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {status === "all" ? "All" : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-500">
        {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''}
      </p>

      {/* Complaints Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-4 animate-pulse">
              <div className="h-4 bg-neutral-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-neutral-100 rounded w-1/2 mb-3" />
              <div className="h-3 bg-neutral-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : paginatedComplaints.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedComplaints.map((complaint) => (
            <Link key={complaint.id} href={`/admin/complaints/${complaint.id}`}>
              <div className="bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-colors cursor-pointer h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-neutral-100 rounded flex items-center justify-center">
                      <User className="w-3 h-3 text-neutral-500" />
                    </div>
                    <span className="text-xs text-neutral-500">{complaint.profiles?.full_name || "Unknown"}</span>
                  </div>
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${getStatusStyle(complaint.status)}`}>
                    {complaint.status?.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-neutral-900 line-clamp-1 mb-1">
                  {complaint.title || "Untitled"}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
                  {complaint.description || "No description"}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(complaint.created_at)}</span>
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{complaint.category || "—"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-neutral-500">No complaints found</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="gap-1">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
