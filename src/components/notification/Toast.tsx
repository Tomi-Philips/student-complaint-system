import * as React from "react";
import { cn } from "@/utils/cn";
import { XCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  };

  const borders = {
    success: "border-emerald-200",
    error: "border-red-200",
    info: "border-blue-200",
    warning: "border-amber-200",
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn(
      "fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border bg-white shadow-md z-50",
      borders[type]
    )}>
      {icons[type]}
      <p className="text-sm text-neutral-800">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded">
        <X className="w-3.5 h-3.5 text-neutral-400" />
      </button>
    </div>
  );
}
