import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 pt-14 overflow-hidden">
        <Sidebar role="admin" />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
