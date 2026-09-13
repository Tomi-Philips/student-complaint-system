import React from "react";
import { complaintService } from "@/services/complaintService";
import { ComplaintDetails } from "@/components/complaint/ComplaintDetails";
import { createClient } from "@/utils/supabaseServer";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatDate";

export default async function StudentComplaintDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  try {
    const supabase = await createClient();
    const complaint = await complaintService.getComplaintById(id, supabase);

    if (!complaint) {
      return notFound();
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">
            {complaint.title || "Untitled Complaint"}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            ID: {complaint.id.slice(0, 8)} &middot; Submitted {formatDate(complaint.created_at)}
          </p>
        </div>

        <ComplaintDetails complaint={complaint} isAdmin={false} />
      </div>
    );
  } catch (error) {
    console.error("Error loading complaint detail:", error);
    return notFound();
  }
}
