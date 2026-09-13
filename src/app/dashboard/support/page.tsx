"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How long does it take to resolve a complaint?",
      a: "Most complaints are acknowledged within 24 hours and resolved within 3-5 business days depending on the complexity of the issue."
    },
    {
      q: "Can I edit my complaint after submission?",
      a: "You can add additional information or comments to an existing complaint through the details page as long as it hasn't been closed."
    },
    {
      q: "Who can see my complaints?",
      a: "Only you and authorized administrative staff from the relevant department can see your specific complaint details."
    },
    {
      q: "What should I do if my issue is urgent?",
      a: "For urgent matters, flag your complaint as high priority during submission and follow up with the Student Affairs office directly."
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Support</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Frequently asked questions and help resources</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-neutral-900">FAQ</h2>
        {faqs.map((faq, i) => (
          <Card key={i}>
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors rounded-lg"
            >
              <span className="text-sm font-medium text-neutral-900">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform flex-shrink-0 ml-2 ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === i && (
              <div className="px-4 pb-4 text-sm text-neutral-600 leading-relaxed">
                {faq.a}
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-4 h-4 text-neutral-500" />
          <h3 className="text-sm font-medium text-neutral-900">Need more help?</h3>
        </div>
        <p className="text-xs text-neutral-500">
          If your question isn't covered above, contact your campus administration directly 
          or reach out through the complaint submission form.
        </p>
      </div>
    </div>
  );
}
