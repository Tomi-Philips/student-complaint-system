"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { User, LogOut, Bell, Menu, ChevronDown, Settings, HelpCircle, Shield, X } from "lucide-react";
import { Profile } from "@/types/user";
import { notificationService, Notification } from "@/services/notificationService";
import { useRealtime } from "@/hooks/useRealtime";

export function Navbar() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = React.useCallback(async () => {
    const userData = await authService.getCurrentUser();
    if (userData) {
      try {
        const data = await notificationService.getNotifications(userData.id);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        const profileData = await authService.getProfile(userData.id);
        setProfile(profileData);
        loadNotifications();
      }
    }
    loadData();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [loadNotifications]);

  useRealtime('notifications', loadNotifications);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationsAsRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAllAsRead(user.id);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await notificationService.markAsRead(notification.id);
        loadNotifications();
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals: Record<string, number> = {
      year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60
    };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
    return 'Just now';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="font-semibold text-sm text-neutral-900 hidden sm:block">Resolve</span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-md hover:bg-neutral-100 transition-colors"
              >
                <Bell className="w-4 h-4 text-neutral-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                    <div className="p-3 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-900">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markNotificationsAsRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                          <p className="text-sm text-neutral-500">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-3 hover:bg-neutral-50 border-b border-neutral-50 cursor-pointer ${!notification.read ? 'bg-primary-50/30' : ''}`}
                          >
                            <div className="flex gap-2">
                              <div className={`w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 ${!notification.read ? 'bg-primary-500' : 'bg-neutral-300'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900">{notification.title}</p>
                                <p className="text-xs text-neutral-500 mt-0.5 truncate">{notification.message}</p>
                                <p className="text-[11px] text-neutral-400 mt-1">{getTimeAgo(notification.created_at)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-5 w-px bg-neutral-200 mx-1" />

            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 hover:bg-neutral-100 rounded-md transition-colors"
              >
                <div className="w-7 h-7 bg-neutral-200 rounded-md flex items-center justify-center">
                  {profile?.full_name ? (
                    <span className="text-xs font-medium text-neutral-600">
                      {getInitials(profile.full_name)}
                    </span>
                  ) : (
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-neutral-900 leading-tight">
                    {profile?.full_name || "User"}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400 hidden md:block" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
                    <div className="p-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
                      <span className="inline-block text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 mt-1">
                        {profile?.role || "student"}
                      </span>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                        <User className="w-4 h-4 text-neutral-400" />
                        Profile
                      </Link>
                      <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                        <Settings className="w-4 h-4 text-neutral-400" />
                        Settings
                      </Link>
                      <Link href="/dashboard/support" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                        <HelpCircle className="w-4 h-4 text-neutral-400" />
                        Support
                      </Link>
                      {profile?.role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                          <Shield className="w-4 h-4 text-neutral-400" />
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-neutral-100 my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
