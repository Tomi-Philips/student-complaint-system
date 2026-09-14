import React from "react";
import { ComplaintForm } from "@/components/complaint/ComplaintForm";

export const metadata = {
  title: "Submit Complaint | Resolve",
  description: "Submit a new complaint or suggestion",
};

export default function SubmitComplaintPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-[1.35rem] font-bold text-neutral-900 tracking-[-0.02em]">Submit a Complaint</h1>
        <p className="text-[13px] text-neutral-500 mt-1">
          Describe your issue and we'll route it to the right department.
        </p>
      </div>

      <div className="max-w-2xl">
        <ComplaintForm />
      </div>

      <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 max-w-2xl">
        <p className="text-[13px] text-amber-800 leading-relaxed">
          <strong>Tip:</strong> Be specific about the issue — include locations and dates when possible. 
          Clear descriptions help us resolve your complaint faster.
        </p>
      </div>
    </div>
  );
}
