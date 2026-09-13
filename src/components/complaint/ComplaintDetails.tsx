"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
    <div className="space-y-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="space-y-4">
        <Card>
          <CardHeader className="border-b border-neutral-100">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant={statusVariants[complaint.status]} className="mb-2">
                  {complaint.status.replace('_', ' ')}
                </Badge>
                <CardTitle className="text-lg">{complaint.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <p className="text-xs text-neutral-400 flex items-center gap-1"><User className="w-3 h-3" /> Student</p>
                <p className="font-medium text-neutral-900 mt-0.5">{complaint.profiles?.full_name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 flex items-center gap-1"><Tag className="w-3 h-3" /> Category</p>
                <p className="font-medium text-neutral-900 mt-0.5 capitalize">{complaint.category}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Submitted</p>
                <p className="font-medium text-neutral-900 mt-0.5">{formatDate(complaint.created_at)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-1.5">Description</h4>
              <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg leading-relaxed">
                {complaint.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {(complaint.response_note || isAdmin) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-neutral-500" />
                Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-neutral-200 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                  placeholder="Write a response for the student..."
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                />
              ) : (
                <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                  {complaint.response_note || "No response yet."}
                </p>
              )}
            </CardContent>
            {isAdmin && (
              <CardFooter className="flex gap-2 pt-0">
                <Button size="sm" className="gap-1.5" onClick={() => handleUpdateStatus('resolved')} disabled={loading}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleUpdateStatus('in_progress')} disabled={loading}>
                  <Clock className="w-3.5 h-3.5" /> In Progress
                </Button>
                <Button size="sm" variant="danger" className="gap-1.5" onClick={() => handleUpdateStatus('rejected')} disabled={loading}>
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
