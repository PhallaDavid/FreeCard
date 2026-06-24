"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Sparkles,
  Layers,
  Heart
} from "lucide-react";
import {
  GithubIcon,
  GoogleIcon
} from "@/components/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    
    const handleLogin = async () => {
      if (isFirebaseConfigured && auth && db) {
        try {
          // 1. Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // 2. Fetch the corresponding portfolio document to find their username
          const q = query(collection(db, "portfolios"), where("ownerUid", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const portfolioDoc = querySnapshot.docs[0];
            const pData = portfolioDoc.data();
            
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("username", pData.username || "johndoe");
            localStorage.setItem("displayName", pData.displayName || "John Doe");
            localStorage.setItem("portfolio_data", JSON.stringify(pData));
            
            router.push("/dashboard");
          } else {
            // Logged in but has no portfolio document yet (shouldn't happen under normal circumstances)
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("username", "johndoe");
            localStorage.setItem("displayName", "User");
            router.push("/dashboard");
          }
        } catch (err: any) {
          console.error("Firebase login error:", err);
          setError(err.message || "Invalid email or password. Please try again.");
          setIsLoading(false);
        }
      } else {
        // Fallback Mock Mode
        setTimeout(() => {
          setIsLoading(false);
          localStorage.setItem("userLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          
          // Set mock user data if it doesn't exist
          if (!localStorage.getItem("username")) {
            localStorage.setItem("username", "johndoe");
            localStorage.setItem("displayName", "John Doe");
          }
          router.push("/dashboard");
        }, 1200);
      }
    };

    handleLogin();
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", "guest@freecard.co");
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full select-none bg-background text-foreground">
      {/* Left side: Premium Teaser Panel (hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-950 p-12 text-white lg:flex overflow-hidden">
        {/* Decorative dynamic glows */}
        <div className="absolute -top-40 -left-40 size-[450px] rounded-full bg-indigo-650 opacity-20 blur-[120px]"></div>
        <div className="absolute -bottom-40 -right-40 size-[450px] rounded-full bg-rose-500 opacity-15 blur-[120px]"></div>
        
        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-2.5 font-sans font-bold text-xl tracking-tight">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 shadow-md">
            <Layers className="size-5 text-white" />
          </div>
          <span>FreeCard</span>
        </div>

        {/* Content Body & Simulated Floating Cards */}
        <div className="relative my-auto flex flex-col items-start gap-8 z-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-sm font-medium text-indigo-300">
              <Sparkles className="size-3.5 text-indigo-400" />
              Next-Gen Link Portfolio
            </span>
            <h1 className="max-w-md text-4xl font-extrabold leading-[1.15] tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              One link to beautiful link-in-bios and rich portfolio hubs.
            </h1>
            <p className="max-w-sm text-base text-zinc-400 font-normal leading-relaxed">
              Create your custom designer page in under two minutes, showcase your projects, and share it with the world.
            </p>
          </div>

          {/* Floating UI cards preview */}
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center font-bold text-sm text-white shadow">
                JD
              </div>
              <div>
                <h3 className="text-sm font-semibold">John Doe</h3>
                <p className="text-xs text-zinc-400">@johndoe</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="w-full h-8 rounded-lg bg-white/10 border border-white/5 flex items-center justify-between px-3 text-xs text-white/80 hover:bg-white/15 transition-all">
                <span>Personal Portfolio 🌐</span>
                <ArrowRight className="size-3" />
              </div>
              <div className="w-full h-8 rounded-lg bg-white/10 border border-white/5 flex items-center justify-between px-3 text-xs text-white/80 hover:bg-white/15 transition-all">
                <span>My Design Work 🎨</span>
                <ArrowRight className="size-3" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-500 border-t border-white/5 pt-3">
              <span>Updated 2m ago</span>
              <span className="flex items-center gap-1">Made with <Heart className="size-2.5 text-rose-500 fill-rose-500" /> FreeCard</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} FreeCard Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:px-16 lg:w-1/2 bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-sm space-y-7">
          
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 shadow">
              <Layers className="size-4.5 text-white" />
            </div>
            <span className="font-bold text-lg">FreeCard</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enter your credentials or use the guest portal to access your editor.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-3 text-sm text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute top-2.5 left-3 size-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-indigo-650 hover:underline dark:text-indigo-400">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 size-4 text-zinc-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-9 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium rounded-lg text-sm flex items-center justify-center gap-1.5 shadow active:scale-[0.98] transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In with Email"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            <span className="flex-shrink mx-3 text-zinc-400 text-xs uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGuestLogin}
              className="col-span-2 h-9 rounded-lg border border-indigo-250 dark:border-indigo-900/60 bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50"
              disabled={isLoading}
            >
              <Sparkles className="size-3.5" />
              Instant Guest Access
            </button>
            
            <button
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-55 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              <GithubIcon className="size-3.5" />
              Github
            </button>
            <button
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-55 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              <GoogleIcon className="size-3.5" />
              Google
            </button>
          </div>

          <p className="text-center text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-zinc-900 hover:underline dark:text-zinc-300">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
