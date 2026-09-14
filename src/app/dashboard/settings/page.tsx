"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-[1.35rem] font-bold text-neutral-900 tracking-[-0.02em]">Settings</h1>
        <p className="text-[13px] text-neutral-500 mt-1">Manage your preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                  activeTab === tab.id
                    ? "bg-neutral-900 text-white font-medium shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-[13px] font-medium text-neutral-700 block mb-1.5">Display Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 outline-none transition-all hover:border-neutral-300"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-neutral-700 block mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-[13px] focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-neutral-50"
                    disabled
                  />
                  <p className="text-[11px] text-neutral-400 mt-1.5">Contact support to change your email</p>
                </div>
                <Button size="sm">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Complaint status updates", description: "Get notified when your complaint status changes" },
                  { label: "Admin responses", description: "Receive alerts when an administrator responds" },
                  { label: "New announcements", description: "Stay informed about campus-wide announcements" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                    <div>
                      <p className="text-[14px] font-medium text-neutral-900">{item.label}</p>
                      <p className="text-[12px] text-neutral-500 mt-0.5">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[14px] font-medium text-neutral-900 mb-1">Change Password</p>
                  <p className="text-[12px] text-neutral-500 mb-3">Update your password to keep your account secure</p>
                  <Button variant="outline" size="sm">Change Password</Button>
                </div>
                <div className="border-t border-neutral-100 pt-4">
                  <p className="text-[14px] font-medium text-neutral-900 mb-1">Two-Factor Authentication</p>
                  <p className="text-[12px] text-neutral-500 mb-3">Add an extra layer of security to your account</p>
                  <Button variant="outline" size="sm">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
