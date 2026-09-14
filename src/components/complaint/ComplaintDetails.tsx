"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ComplaintStatus } from "@/types/complaint";
import { complaintService } from "@/services/complaintService";
import { formatDate } from "@/utils/formatDate";
import { Calendar, User, Tag, MessageCircle, CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/notification/Toast";

interface ComplaintDetailsProps {
  complaint: any;
  isAdmin?: boolean;
}

function getStatusBg(status: string) {
  switch (status) {
    case 'resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
    case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200/60';
    case 'in_progress': return 'bg-sky-50 text-sky-700 border border-sky-200/60';
    default: return 'bg-neutral-50 text-neutral-600 border border-neutral-200/60';
  }
}

export function ComplaintDetails({ complaint, isAdmin }: ComplaintDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [responseNote, setResponseNote] = useState(complaint.response_note || "");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const statusVariants: Record<string, any> = {
    pending: 'warning',
    in_progress: 'info',
    resolved: 'success',
    rejected: 'error',
  };

  const handleUpdateStatus = async (status: ComplaintStatus) => {
    setLoading(true);
    try {
      await complaintService.updateComplaintStatus(complaint.id, status, responseNote);
      setToast({ message: `Status updated to ${status}`, type: "success" });
      router.refresh();
    } catch (error: any) {
      setToast({ message: error.message || "Failed to update status", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="space-y-5">
        {/* Main complaint card */}
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-neutral-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-md mb-3 ${getStatusBg(complaint.status)}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
                <h2 className="text-lg font-semibold text-neutral-900 tracking-[-0.01em]">{complaint.title}</h2>
              </div>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-6">
              <div>
                <p className="text-[11px] text-neutral-400 flex items-center gap-1 uppercase tracking-[0.06em] font-semibold mb-1"><User className="w-3 h-3" /> Student</p>
                <p className="text-[13px] font-medium text-neutral-900">{complaint.profiles?.full_name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-400 flex items-center gap-1 uppercase tracking-[0.06em] font-semibold mb-1"><Tag className="w-3 h-3" /> Category</p>
                <p className="text-[13px] font-medium text-neutral-900 capitalize">{complaint.category}</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-400 flex items-center gap-1 uppercase tracking-[0.06em] font-semibold mb-1"><Calendar className="w-3 h-3" /> Submitted</p>
                <p className="text-[13px] font-medium text-neutral-900">{formatDate(complaint.created_at)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-[0.06em] mb-2">Description</h4>
              <p className="text-[13px] text-neutral-700 bg-neutral-50/70 p-4 rounded-xl leading-relaxed border border-neutral-100">
                {complaint.description}
              </p>
            </div>
          </div>
        </div>

        {/* Response section */}
        {(complaint.response_note || isAdmin) && (
          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-5 pt-5 pb-3 border-b border-neutral-100">
              <h3 className="text-[14px] font-semibold text-neutral-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-neutral-400" />
                Response
              </h3>
            </div>
            <div className="px-5 py-4">
              {isAdmin ? (
                <textarea
                  className="w-full min-h-[100px] rounded-xl border border-neutral-200 p-3.5 text-[13px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 outline-none transition-all bg-white hover:border-neutral-300 resize-none"
                  placeholder="Write a response for the student..."
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                />
              ) : (
                <p className="text-[13px] text-neutral-700 bg-neutral-50/70 p-4 rounded-xl border border-neutral-100 leading-relaxed">
                  {complaint.response_note || "No response yet."}
                </p>
              )}
            </div>
            {isAdmin && (
              <div className="px-5 pb-5 flex gap-2">
                <Button size="sm" className="gap-1.5" onClick={() => handleUpdateStatus('resolved')} disabled={loading}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleUpdateStatus('in_progress')} disabled={loading}>
                  <Clock className="w-3.5 h-3.5" /> In Progress
                </Button>
                <Button size="sm" variant="danger" className="gap-1.5" onClick={() => handleUpdateStatus('rejected')} disabled={loading}>
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
