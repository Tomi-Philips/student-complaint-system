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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setToast(null);

    try {
      await authService.register(formData.email, formData.password, formData.fullName, 'student');
      setToast({ message: "Account created successfully", type: "success" });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      setToast({ message: error.message || "Registration failed", type: "error" });
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
          <h1 className="text-xl font-semibold text-neutral-900 tracking-[-0.02em]">Create your account</h1>
          <p className="text-[13px] text-neutral-500 mt-1.5">Join Resolve to start submitting complaints</p>
        </div>

        <Card>
          <form onSubmit={handleRegister}>
            <CardContent className="pt-5 space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); setErrors({ ...errors, fullName: "" }); }}
                error={errors.fullName}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@university.edu"
                required
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                error={errors.email}
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                  error={errors.password}
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
              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: "" }); }}
                error={errors.confirmPassword}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3.5 pb-5">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-[13px] text-center text-neutral-500">
                Already have an account?{" "}
                <Link href="/login" className="text-neutral-900 hover:text-primary-700 font-medium transition-colors">
                  Sign in
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
