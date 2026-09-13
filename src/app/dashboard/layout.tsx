import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role === 'admin' || profile?.role === 'staff') ? 'admin' : 'student';

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 pt-14 overflow-hidden">
        <Sidebar role={role as 'student' | 'admin'} />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
