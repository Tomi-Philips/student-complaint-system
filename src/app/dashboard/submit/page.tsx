import React from "react";
import { ComplaintForm } from "@/components/complaint/ComplaintForm";

export const metadata = {
  title: "Submit Complaint | Resolve",
  description: "Submit a new complaint or suggestion",
};

export default function SubmitComplaintPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Submit a Complaint</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Describe your issue and we'll route it to the right department.
        </p>
      </div>

      <div className="max-w-2xl">
        <ComplaintForm />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl">
        <p className="text-sm text-amber-800">
          <strong>Tips:</strong> Be specific about the issue, include locations and dates when possible. 
          Clear descriptions help us resolve your complaint faster.
        </p>
      </div>
    </div>
  );
}
