"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { authService } from "@/services/authService";
import { Toast, ToastType } from "@/components/notification/Toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const user = await authService.login(formData.email, formData.password);
      const profile = await authService.getProfile(user.id);

      router.refresh();

      if (profile?.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setToast({ message: error.message || "Invalid credentials", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50/50 px-4">
      <div className="w-full max-w-[340px] animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-9 h-9 bg-neutral-900 rounded-[7px] flex items-center justify-center mx-auto mb-5">
            <span className="text-white font-bold text-[13px] tracking-tight">R</span>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 tracking-[-0.02em]">Welcome back</h1>
          <p className="text-[13px] text-neutral-500 mt-1.5">Sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={handleLogin}>
            <CardContent className="pt-5 space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@university.edu"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3.5 pb-5">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-[13px] text-center text-neutral-500">
                Don't have an account?{" "}
                <Link href="/register" className="text-neutral-900 hover:text-primary-700 font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
