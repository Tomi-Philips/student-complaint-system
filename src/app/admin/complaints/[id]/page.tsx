import React from "react";
import { complaintService } from "@/services/complaintService";
import { ComplaintDetails } from "@/components/complaint/ComplaintDetails";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabaseServer";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default async function AdminComplaintDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const supabase = await createClient();
    const complaint = await complaintService.getComplaintById(id, supabase);

    if (!complaint) return notFound();

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/complaints" className="text-neutral-500 hover:text-neutral-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Shield className="w-3 h-3" />
            Admin View
          </div>
        </div>

        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            {complaint.title || "Untitled Complaint"}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            ID: {complaint.id.slice(0, 8)} &middot; Submitted {formatDate(complaint.created_at)}
          </p>
        </div>

        {/* Student Info */}
        <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
          <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Student Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-400 text-xs">Name</p>
              <p className="font-medium text-neutral-900">{complaint.profiles?.full_name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-xs">ID</p>
              <p className="font-medium text-neutral-900 font-mono text-xs">{complaint.user_id}</p>
            </div>
          </div>
        </div>

        <ComplaintDetails complaint={complaint} isAdmin={true} />
      </div>
    );
  } catch (error) {
    console.error(`[Admin] Failed to load complaint ${id}:`, error);
    return notFound();
  }
}
