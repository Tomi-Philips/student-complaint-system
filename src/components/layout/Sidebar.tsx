"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { useRealtime } from "@/hooks/useRealtime";
import { authService } from "@/services/authService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Settings,
  HelpCircle,
  ShieldCheck,
  Megaphone,
  UserCircle,
  Users,
  Layers,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  role: 'student' | 'admin';
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ role, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [counts, setCounts] = useState({
    myComplaints: 0,
    announcements: 0,
    allComplaints: 0
  });

  const fetchCounts = useCallback(async () => {
    const user = await authService.getCurrentUser();
    if (!user) return;

    try {
      const sb = getSupabase();
      const { count: myCount } = await sb
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['pending', 'in_progress', 'reviewing']);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: annCount } = await sb
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .gt('created_at', sevenDaysAgo.toISOString());

      let allCount = 0;
      if (role === 'admin') {
        const { count } = await sb
          .from('complaints')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        allCount = count || 0;
      }

      setCounts({ myComplaints: myCount || 0, announcements: annCount || 0, allComplaints: allCount });
    } catch (err) {
      console.error("Error fetching sidebar counts:", err);
    }
  }, [role]);

  useEffect(() => {
    fetchCounts();
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [fetchCounts]);

  useRealtime('complaints', fetchCounts);
  useRealtime('announcements', fetchCounts);

  const studentLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, badge: null },
    { name: "New Complaint", href: "/dashboard/submit", icon: PlusCircle, badge: null },
    { name: "My Complaints", href: "/dashboard/complaints", icon: ClipboardList, badge: counts.myComplaints > 0 ? counts.myComplaints.toString() : null },
    { name: "Announcements", href: "/dashboard/announcements", icon: Megaphone, badge: counts.announcements > 0 ? counts.announcements.toString() : null },
    { name: "My Profile", href: "/dashboard/profile", icon: UserCircle, badge: null },
  ];

  const adminLinks = [
    { name: "Overview", href: "/admin", icon: ShieldCheck, badge: null },
    { name: "All Complaints", href: "/admin/complaints", icon: ClipboardList, badge: counts.allComplaints > 0 ? counts.allComplaints.toString() : null },
    { name: "Users", href: "/admin/users", icon: Users, badge: null },
    { name: "Categories", href: "/admin/categories", icon: Layers, badge: null },
    { name: "Announcements", href: "/admin/announcements", icon: Megaphone, badge: null },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  const footerLinks = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  ];

  const SidebarContent = () => (
    <>
      <div className={cn("flex items-center justify-between p-3 border-b border-neutral-100", collapsed ? "px-2" : "")}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn("p-1.5 rounded-md hover:bg-neutral-100 transition-colors", collapsed ? "mx-auto" : "")}
        >
          <ChevronLeft className={cn("w-4 h-4 text-neutral-400 transition-transform duration-200", collapsed ? "rotate-180" : "")} />
        </button>
      </div>

      <div className={cn("flex-1 py-4 px-3 space-y-0.5 overflow-y-auto", collapsed ? "px-2" : "")}>
        <p className={cn("text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.08em] mb-3", collapsed ? "text-center" : "px-2")}>
          {collapsed ? "•" : "Menu"}
        </p>

        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all duration-150 group text-[13px]",
                collapsed ? "justify-center px-2" : "",
                isActive
                  ? "bg-neutral-900 text-white font-medium shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              )}
              title={collapsed ? link.name : undefined}
            >
              <link.icon className={cn(
                "w-4 h-4 flex-shrink-0",
                isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-600"
              )} />

              {!collapsed && (
                <>
                  <span className="flex-1">{link.name}</span>
                  {link.badge && (
                    <span className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-neutral-100 text-neutral-600"
                    )}>
                      {link.badge}
                    </span>
                  )}
                </>
              )}

              {collapsed && link.badge && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </Link>
          );
        })}
      </div>

      <div className={cn("p-3 border-t border-neutral-100 space-y-0.5", collapsed ? "px-2" : "")}>
        {footerLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-all duration-150",
                collapsed ? "justify-center px-2" : "",
                isActive
                  ? "text-neutral-900 bg-neutral-50 font-medium"
                  : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700"
              )}
              title={collapsed ? link.name : undefined}
            >
              <link.icon className="w-4 h-4" />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 bg-white border-r border-neutral-100 flex flex-col transition-all duration-200 z-30 hidden lg:flex",
        collapsed ? "w-[60px]" : "w-56"
      )}>
        <div className="h-14 flex items-center px-3.5 border-b border-neutral-100">
          {!collapsed && (
            <span className="font-semibold text-[15px] text-neutral-900 tracking-[-0.01em] truncate">Resolve</span>
          )}
          {collapsed && (
            <span className="font-semibold text-[15px] text-neutral-900 mx-auto">R</span>
          )}
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <SidebarContent />
        </div>
      </aside>

      {isMobile && isMobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={onMobileClose} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-neutral-100 z-50 lg:hidden flex flex-col">
            <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-100">
              <span className="font-semibold text-[15px] text-neutral-900 tracking-[-0.01em]">Resolve</span>
              <button onClick={onMobileClose} className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all duration-150 text-[13px]",
                      isActive
                        ? "bg-neutral-900 text-white font-medium"
                        : "text-neutral-500 hover:bg-neutral-50"
                    )}
                  >
                    <link.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-neutral-400")} />
                    <span className="flex-1">{link.name}</span>
                    {link.badge && (
                      <span className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                        isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
                      )}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="p-3 border-t border-neutral-100 space-y-0.5">
              {footerLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors",
                      isActive ? "text-neutral-900 bg-neutral-50 font-medium" : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </>
      )}

      <div className={cn("hidden lg:block transition-all duration-200", collapsed ? "w-[60px]" : "w-56")} />
    </>
  );
}
