"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authService } from "@/services/authService";
import { supabase } from "@/lib/supabaseClient";
import { Toast, ToastType } from "@/components/notification/Toast";
import { User, Mail, Shield, Save, Edit2, X } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    async function loadData() {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const userProfile = await authService.getProfile(currentUser.id);
        setProfile(userProfile);
        setFullName(userProfile?.full_name || "");
      }
    }
    loadData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;
      setToast({ message: "Profile updated", type: "success" });
      setIsEditing(false);
      setProfile({ ...profile, full_name: fullName });
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Profile</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your account information</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
              {fullName ? (
                <span className="text-lg font-medium text-neutral-600">{getInitials(fullName)}</span>
              ) : (
                <User className="w-6 h-6 text-neutral-400" />
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={loading} className="gap-1.5">
                      <Save className="w-3.5 h-3.5" />
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => { setIsEditing(false); setFullName(profile?.full_name || ""); }} className="gap-1.5">
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium text-neutral-900">{fullName || "User"}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="gap-1">
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {profile?.role || "student"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-neutral-500 flex items-center gap-1 mb-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <div className="text-sm text-neutral-700 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
                {user?.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
