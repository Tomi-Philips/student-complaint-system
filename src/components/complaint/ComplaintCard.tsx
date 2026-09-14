import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Complaint } from "@/types/complaint";
import { Calendar, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

interface ComplaintCardProps {
  complaint: Complaint;
  href: string;
  variant?: "default" | "horizontal";
}

function getStatusColor(status: string) {
  switch (status) {
    case 'resolved': return 'border-l-emerald-500';
    case 'pending': return 'border-l-amber-500';
    case 'in_progress': return 'border-l-sky-500';
    case 'reviewing': return 'border-l-sky-500';
    case 'rejected': return 'border-l-red-400';
    default: return 'border-l-neutral-300';
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
    case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200/60';
    case 'in_progress': return 'bg-sky-50 text-sky-700 border border-sky-200/60';
    case 'reviewing': return 'bg-sky-50 text-sky-700 border border-sky-200/60';
    case 'rejected': return 'bg-red-50 text-red-700 border border-red-200/60';
    default: return 'bg-neutral-50 text-neutral-600 border border-neutral-200/60';
  }
}

function getCategoryLabel(cat: string) {
  const labels: Record<string, string> = {
    academic: 'Academic',
    hostel: 'Hostel',
    fees: 'Fees',
    staff: 'Staff',
    technical: 'Technical',
    others: 'Other',
  };
  return labels[cat] || cat;
}

export function ComplaintCard({ complaint, href, variant = "default" }: ComplaintCardProps) {
  const statusVariants: Record<string, any> = {
    pending: 'warning',
    in_progress: 'info',
    reviewing: 'info',
    review: 'info',
    resolved: 'success',
    rejected: 'error',
  };

  if (variant === "horizontal") {
    return (
      <Link href={href} className="block group">
        <div className={`relative bg-white rounded-xl border border-neutral-200/80 pl-4 pr-4 py-3.5 hover:border-neutral-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-250 border-l-[3px] ${getStatusColor(complaint.status)}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusBg(complaint.status)}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(complaint.created_at)}
                </span>
              </div>
              <h3 className="text-[14px] font-medium text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
                {complaint.title}
              </h3>
              <p className="text-[12px] text-neutral-500 mt-0.5 truncate">{complaint.description}</p>
              <div className="flex items-center gap-3 mt-2.5">
                <span className="text-[11px] font-medium text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-100">
                  {getCategoryLabel(complaint.category)}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">{complaint.id.slice(0, 8)}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-0.5 flex-shrink-0 mt-2 transition-all duration-200" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="block group">
      <div className={`relative h-full bg-white rounded-xl border border-neutral-200/80 p-4 hover:border-neutral-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-250 border-l-[3px] ${getStatusColor(complaint.status)}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${getStatusBg(complaint.status)}`}>
            {complaint.status.replace('_', ' ')}
          </span>
        </div>
        <h3 className="text-[14px] font-medium text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
          {complaint.title}
        </h3>
        <p className="text-[12px] text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">{complaint.description}</p>
        <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-neutral-100">
          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(complaint.created_at)}
          </span>
          <span className="text-[11px] font-medium text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-100">
            {getCategoryLabel(complaint.category)}
          </span>
        </div>
      </div>
    </Link>
  );
}
