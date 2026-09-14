"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import { complaintService } from "@/services/complaintService";
import { authService } from "@/services/authService";
import { Complaint } from "@/types/complaint";
import { Button } from "@/components/ui/Button";
import { Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useRealtime } from "@/hooks/useRealtime";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadComplaints = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const data = await complaintService.getMyComplaints(user.id);
        setComplaints(data);
        setFilteredComplaints(data);
      }
    } catch (error) {
      console.error("Failed to load complaints:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  useRealtime('complaints', loadComplaints);

  useEffect(() => {
    let filtered = [...complaints];
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        c.id?.toLowerCase().includes(query)
      );
    }
    setFilteredComplaints(filtered);
  }, [complaints, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.35rem] font-bold text-neutral-900 tracking-[-0.02em]">My Complaints</h1>
          <p className="text-[13px] text-neutral-500 mt-1">Track and manage your submissions</p>
        </div>
        <Link href="/dashboard/submit">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 hover:border-neutral-300 transition-all bg-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-0.5 p-0.5 bg-neutral-100 rounded-lg">
          {["all", "pending", "in_progress", "resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all capitalize ${
                statusFilter === status ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {status === "all" ? "All" : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-[12px] text-neutral-400 font-medium">
        {filteredComplaints.length} of {complaints.length} complaints
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-neutral-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filteredComplaints.length > 0 ? (
        <div className="space-y-2">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              href={`/dashboard/complaints/${complaint.id}`}
              variant="horizontal"
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-neutral-300 p-12 text-center">
          <p className="text-[14px] text-neutral-500 mb-3">
            {searchQuery || statusFilter !== "all"
              ? "No complaints match your filters."
              : "No complaints yet."}
          </p>
          {searchQuery || statusFilter !== "all" ? (
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
              Clear Filters
            </Button>
          ) : (
            <Link href="/dashboard/submit">
              <Button size="sm">Submit a Complaint</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
