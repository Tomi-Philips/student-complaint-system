import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Complaint } from "@/types/complaint";
import { Calendar, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

interface ComplaintCardProps {
  complaint: Complaint;
  href: string;
  variant?: "default" | "horizontal";
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
        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={statusVariants[complaint.status]} className="capitalize">
                    {complaint.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(complaint.created_at)}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
                  {complaint.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{complaint.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="default">{complaint.category}</Badge>
                  <span className="text-xs text-neutral-400 font-mono">ID: {complaint.id.slice(0, 8)}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-500 flex-shrink-0 mt-2 transition-colors" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={href} className="block group">
      <Card className="h-full hover:border-neutral-300 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={statusVariants[complaint.status]} className="capitalize">
              {complaint.status.replace('_', ' ')}
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors truncate">
            {complaint.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{complaint.description}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(complaint.created_at)}
            </span>
            <Badge variant="default">{complaint.category}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
