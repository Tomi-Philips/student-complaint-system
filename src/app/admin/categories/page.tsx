"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CANDIDATE_LABELS, ComplaintCategory } from "@/lib/categories";
import { complaintService } from "@/services/complaintService";

export default function AdminCategoriesPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [totalComplaints, setTotalComplaints] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const complaints = await complaintService.getAllComplaints();
        const counts: Record<ComplaintCategory, number> = {
          academic: 0,
          hostel: 0,
          fees: 0,
          staff: 0,
          technical: 0,
          others: 0,
        };
        CANDIDATE_LABELS.forEach(label => counts[label] = 0);
        complaints.forEach(c => {
          const cat = c.category as ComplaintCategory;
          if (counts[cat] !== undefined) counts[cat]++;
          else counts['others']++;
        });
        setStats(counts);
        setTotalComplaints(complaints.length);
      } catch (error) {
        console.error("Failed to load category stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const categories = Object.entries(stats).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Categories</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Complaint distribution across {CANDIDATE_LABELS.length} categories ({totalComplaints} total)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(({ name, count }) => {
          const percentage = totalComplaints > 0 ? (count / totalComplaints) * 100 : 0;
          return (
            <div key={name} className="bg-white rounded-lg border border-neutral-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-neutral-900 capitalize">{name.replace('_', ' ')}</h3>
                <span className="text-lg font-bold text-neutral-900">{loading ? "—" : count}</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-1.5">
                <div
                  className="bg-primary-600 rounded-full h-1.5 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">{percentage.toFixed(1)}% of total</p>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Complaints are automatically categorized using zero-shot classification. 
            The system routes each complaint to the appropriate department based on its content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
