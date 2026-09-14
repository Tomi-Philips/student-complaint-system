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
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href="/admin/complaints" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            Admin View
          </div>
        </div>

        <div>
          <h1 className="text-lg font-semibold text-neutral-900 tracking-[-0.01em]">
            {complaint.title || "Untitled Complaint"}
          </h1>
          <p className="text-[13px] text-neutral-500 mt-1">
            ID: {complaint.id.slice(0, 8)} &middot; Submitted {formatDate(complaint.created_at)}
          </p>
        </div>

        {/* Student Info */}
        <div className="bg-neutral-50/70 rounded-xl border border-neutral-200/80 p-5">
          <h3 className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-3">Student Information</h3>
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            <div>
              <p className="text-neutral-400 text-[11px] uppercase tracking-wide">Name</p>
              <p className="font-medium text-neutral-900 mt-0.5">{complaint.profiles?.full_name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-[11px] uppercase tracking-wide">ID</p>
              <p className="font-medium text-neutral-900 font-mono text-[12px] mt-0.5">{complaint.user_id}</p>
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
