import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Shield, Clock, CheckCircle, ArrowRight, MessageSquare } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-sm text-neutral-900">Resolve</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900 px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
            Intelligent Reporting for a Smarter Campus
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
            From classroom concerns to facility issues, Resolve streamlines how you report and track campus matters.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-neutral-900">How it works</h2>
            <p className="text-neutral-500 mt-2">A straightforward process from submission to resolution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Submit",
                description: "Describe your issue with details. Our system automatically categorizes it for the right department.",
              },
              {
                icon: Shield,
                title: "Track",
                description: "Monitor your complaint status in real-time. Know exactly where your issue stands.",
              },
              {
                icon: CheckCircle,
                title: "Resolve",
                description: "Receive responses from administrators and track your complaint to resolution.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-neutral-200">
                <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-4.5 h-4.5 text-neutral-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Built for real campus needs
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-6">
                Whether it's a broken facility, an academic concern, or a safety issue — 
                Resolve ensures your voice is heard and your problems are addressed.
              </p>
              <ul className="space-y-3">
                {[
                  "Automatic complaint categorization",
                  "Real-time status tracking",
                  "Secure and confidential submissions",
                  "Admin dashboard for faster response times",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-100">
                  <span className="text-sm text-neutral-600">Avg. response time</span>
                  <span className="text-sm font-medium text-neutral-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary-500" />
                    Under 24 hours
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-100">
                  <span className="text-sm text-neutral-600">Departments served</span>
                  <span className="text-sm font-medium text-neutral-900">6 categories</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-100">
                  <span className="text-sm text-neutral-600">Resolution tracking</span>
                  <span className="text-sm font-medium text-neutral-900 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Real-time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-neutral-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Ready to get started?</h2>
          <p className="text-neutral-400 text-sm mb-6">Create an account and submit your first complaint in under a minute.</p>
          <Link href="/register">
            <Button className="bg-white text-neutral-900 hover:bg-neutral-100 gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">R</span>
            </div>
            <span className="text-sm text-neutral-500">Resolve</span>
          </div>
          <p className="text-xs text-neutral-400">&copy; 2026 Resolve. Campus complaint management.</p>
        </div>
      </footer>
    </div>
  );
}
