"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Layers, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Heart, 
  Layout, 
  Link as LinkIcon, 
  ShieldCheck, 
  Zap, 
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("johndoe");

  useEffect(() => {
    const loginFlag = localStorage.getItem("userLoggedIn");
    if (loginFlag) {
      setIsLoggedIn(true);
      const savedName = localStorage.getItem("username");
      if (savedName) setUsername(savedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Banner Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow">
            <Layers className="size-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">FreeCard</span>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm" className="h-8.5 rounded-full px-4 text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow hover:bg-zinc-800 dark:hover:bg-zinc-100">
                Go to Studio
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <span className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-3 cursor-pointer">
                  Sign In
                </span>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-8.5 rounded-full px-4 text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow hover:bg-zinc-800 dark:hover:bg-zinc-100">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-0 size-[320px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute top-12 size-[320px] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[100px] -z-10"></div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/20 px-3.5 py-1 text-xs font-bold text-indigo-650 dark:text-indigo-400 mb-6">
          <Sparkles className="size-3 text-indigo-500" />
          Unlimited links. Completely free.
        </span>

        <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight bg-gradient-to-br from-zinc-950 via-zinc-800 to-zinc-650 dark:from-white dark:via-zinc-100 dark:to-zinc-550 bg-clip-text text-transparent px-4">
          The ultimate link portfolio for modern creators.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-550 dark:text-zinc-400 max-w-xl font-normal leading-relaxed">
          Create a beautiful, fully customized bio link page in minutes. Share your social profiles, digital products, and portfolio work with one clean URL.
        </p>

        {/* Claim Username Form / Action */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center w-full max-w-md">
          <div className="relative flex items-center w-full shadow-sm rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <span className="absolute left-4.5 text-xs text-zinc-400 font-bold select-none">
              freecard.co/
            </span>
            <input
              type="text"
              placeholder="yourname"
              disabled
              className="w-full h-11 bg-transparent py-2 pl-[94px] pr-4 text-xs font-medium placeholder:text-zinc-400 outline-none opacity-80"
            />
          </div>
          <Link href={isLoggedIn ? "/dashboard" : "/register"} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 rounded-full px-6 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all">
              Claim Yours
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <h2 className="text-center text-2xl font-bold mb-12 tracking-tight">Everything you need to showcase yourself</h2>
        
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 p-6 space-y-4 hover:-translate-y-1 transition-transform shadow-sm">
            <div className="size-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layout className="size-5" />
            </div>
            <h3 className="text-base font-bold">Premium Themes</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Select from beautiful, pre-designed theme combinations including sunset gradients, sleek neon styles, or minimal dark card layouts.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 p-6 space-y-4 hover:-translate-y-1 transition-transform shadow-sm">
            <div className="size-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-455">
              <LinkIcon className="size-5" />
            </div>
            <h3 className="text-base font-bold">Instant Updates</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Make edits in your Creator Studio dashboard and see changes instantly synced. Visitors will see updates immediately.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 p-6 space-y-4 hover:-translate-y-1 transition-transform shadow-sm">
            <div className="size-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Zap className="size-5" />
            </div>
            <h3 className="text-base font-bold">Micro-Animations</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Wow your audience with smooth, staggered slide-in entrance transitions and glowing active click effects on custom portfolio links.
            </p>
          </div>
        </div>
      </section>

      {/* Mini Demo preview block */}
      <section className="py-12 bg-zinc-100 dark:bg-zinc-900/30 border-y border-zinc-200 dark:border-zinc-900 px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Try it with our public demo</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            Want to see a fully constructed portfolio in action without registering? View our public demo account.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/johndoe">
              <Button variant="outline" className="h-9 gap-1.5 rounded-full px-5 text-xs font-semibold">
                View Demo Profile
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-zinc-200 dark:border-zinc-900 px-6 text-center text-xs text-zinc-500 flex flex-col sm:flex-row justify-between items-center max-w-5xl mx-auto w-full gap-4">
        <span className="flex items-center gap-1 font-semibold">
          Made with <Heart className="size-3 text-rose-500 fill-rose-500" /> by the FreeCard Team
        </span>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}
