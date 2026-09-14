import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Shield, Clock, CheckCircle, ArrowRight, MessageSquare, Sparkles, Zap, Users, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-neutral-900 rounded-[6px] flex items-center justify-center">
              <span className="text-white font-bold text-[11px] tracking-tight">R</span>
            </div>
            <span className="font-semibold text-[15px] text-neutral-900 tracking-[-0.01em]">Resolve</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-[13px] text-neutral-500 hover:text-neutral-900 px-3 py-1.5 rounded-lg transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-24 px-6 overflow-hidden">
        {/* Subtle background treatment */}
        <div className="absolute inset-0 hero-gradient pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.3] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/80 text-neutral-600 text-[12px] font-medium mb-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <Sparkles className="w-3 h-3 text-primary-500" />
            AI-powered complaint routing
          </div>
          <h1 className="text-[2.75rem] md:text-[3.25rem] font-bold text-neutral-900 tracking-[-0.035em] leading-[1.05]">
            Campus complaints,
            <br />
            <span className="text-neutral-300">handled properly.</span>
          </h1>
          <p className="mt-6 text-[17px] text-neutral-500 max-w-lg mx-auto leading-relaxed">
            Submit issues, track progress, and get faster responses. 
            Our system automatically routes your complaints to the right department.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-7">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-7">Sign In</Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 flex items-center justify-center gap-8 text-[12px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-neutral-300" />
              Free to use
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-neutral-300" />
              Under 24hr response
            </div>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <CheckCircle className="w-3.5 h-3.5 text-neutral-300" />
              AI categorization
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold text-primary-600 tracking-[0.1em] uppercase mb-3">Process</p>
            <h2 className="text-[1.65rem] font-bold text-neutral-900 tracking-[-0.025em]">How it works</h2>
            <p className="text-[15px] text-neutral-500 mt-3 max-w-md mx-auto">Three steps from submission to resolution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                icon: MessageSquare,
                title: "Submit",
                description: "Describe your issue with details. Our AI automatically categorizes it for the right department.",
                color: "text-neutral-900 bg-neutral-50 border-neutral-200/80",
              },
              {
                step: "02",
                icon: Shield,
                title: "Track",
                description: "Monitor your complaint status in real-time. Know exactly where your issue stands.",
                color: "text-primary-600 bg-primary-50/50 border-primary-200/60",
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Resolve",
                description: "Receive responses from administrators and track your complaint through to resolution.",
                color: "text-emerald-600 bg-emerald-50/50 border-emerald-200/60",
              },
            ].map((feature, idx) => (
              <div key={idx} className="group relative p-6 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feature.color}`}>
                    <feature.icon className="w-[18px] h-[18px]" />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-300 tracking-widest">{feature.step}</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 text-[15px]">{feature.title}</h3>
                <p className="text-[13px] text-neutral-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 px-6 bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "< 24h", label: "Avg. response time" },
              { value: "6", label: "Departments covered" },
              { value: "Real-time", label: "Status tracking" },
              { value: "AI", label: "Smart categorization" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white tracking-[-0.02em]">{stat.value}</div>
                <div className="text-[12px] text-neutral-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Resolve */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[11px] font-semibold text-primary-600 tracking-[0.1em] uppercase mb-3">Why Resolve</p>
              <h2 className="text-[1.65rem] font-bold text-neutral-900 tracking-[-0.025em] mb-5">
                Built for real campus needs
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-8 text-[15px]">
                Whether it's a broken facility, an academic concern, or a safety issue — 
                Resolve ensures your voice is heard and your problems are addressed.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Zap, text: "Automatic AI-powered complaint categorization" },
                  { icon: Clock, text: "Real-time status tracking with notifications" },
                  { icon: Shield, text: "Secure and confidential submissions" },
                  { icon: Users, text: "Admin dashboard for faster response times" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[14px] text-neutral-600">
                    <div className="w-6 h-6 bg-neutral-900 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-3 h-3 text-white" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              {/* Decorative element */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-50/50 to-transparent rounded-3xl -z-10" />
              <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 overflow-hidden">
                {/* Mock UI */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                  <div className="flex-1" />
                  <span className="text-[10px] text-neutral-400 font-medium">Dashboard</span>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Broken AC in Library 3rd Floor", status: "In Progress", statusColor: "bg-sky-50 text-sky-700 border border-sky-200/60", time: "2 hours ago" },
                    { title: "Cafeteria food quality concern", status: "Pending", statusColor: "bg-amber-50 text-amber-700 border border-amber-200/60", time: "1 day ago" },
                    { title: "WiFi connectivity in Block B", status: "Resolved", statusColor: "bg-emerald-50 text-emerald-700 border border-emerald-200/60", time: "3 days ago" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50/70 rounded-xl border border-neutral-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-neutral-900 truncate">{item.title}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.time}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-neutral-600">Resolution rate</span>
                    <span className="text-[12px] font-bold text-neutral-900">78%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5">
                    <div className="bg-neutral-900 rounded-full h-1.5" style={{ width: "78%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-neutral-50/70 border-y border-neutral-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[1.65rem] font-bold text-neutral-900 tracking-[-0.025em] mb-3">Ready to get started?</h2>
          <p className="text-neutral-500 text-[15px] mb-8">Create an account and submit your first complaint in under a minute.</p>
          <Link href="/register">
            <Button size="lg" className="gap-2 px-7">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-neutral-900 rounded-[4px] flex items-center justify-center">
              <span className="text-white font-bold text-[8px] tracking-tight">R</span>
            </div>
            <span className="text-[13px] text-neutral-400">Resolve</span>
          </div>
          <p className="text-[12px] text-neutral-400">&copy; 2026 Resolve. Campus complaint management.</p>
        </div>
      </footer>
    </div>
  );
}
