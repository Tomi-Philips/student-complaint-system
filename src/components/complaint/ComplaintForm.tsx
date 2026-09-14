"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { complaintService } from "@/services/complaintService";
import { authService } from "@/services/authService";
import { Toast, ToastType } from "@/components/notification/Toast";
import { Complaint } from "@/types/complaint";
import { Send } from "lucide-react";

export function ComplaintForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("Please log in first");

      const complaint = await complaintService.createComplaint(
        user.id,
        formData.title,
        formData.description
      );

      const { classifiedByAI, category } = complaint as Complaint & {
        classifiedByAI?: boolean;
      };

      if (classifiedByAI === false) {
        // AI classification failed (e.g. invalid API key) — filed as "others"
        setToast({
          message: "Complaint submitted, but auto-categorization is currently unavailable. It was filed under 'Others' for manual review.",
          type: "warning"
        });
      } else {
        setToast({
          message: `Complaint submitted. Category: ${category}`,
          type: "success"
        });
      }

      setTimeout(() => {
        router.push("/dashboard/complaints");
      }, 2000);

    } catch (error: any) {
      setToast({ message: error.message || "Failed to submit complaint", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Complaint</CardTitle>
        <CardDescription>
          Fill in the details below. The system will automatically categorize your complaint.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            label="Title"
            placeholder="Brief description of the issue"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
          />
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-neutral-700">Description</label>
            <textarea
              className="flex min-h-[120px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13px] placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:border-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 hover:border-neutral-300"
              placeholder="Provide details: what happened, where, when, and any other relevant information"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-neutral-100 pt-4">
          <Button type="submit" className="gap-2 min-w-[120px]" disabled={loading}>
            {loading ? "Submitting..." : (
              <>
                <Send className="w-3.5 h-3.5" />
                Submit
              </>
            )}
          </Button>
        </CardFooter>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </Card>
  );
}
