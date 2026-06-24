"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Sparkles,
  Layers,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import {
  GithubIcon,
  GoogleIcon
} from "@/components/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db, isFirebaseConfigured, getPortfolioByOwnerUid } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Username checker states
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    if (!username) {
      setUsernameAvailable(null);
      return;
    }
    
    const normalized = username.toLowerCase().trim();
    const isValid = /^[a-zA-Z0-9_]{3,15}$/.test(normalized);
    if (!isValid || ["admin", "login", "register", "dashboard", "freecard", "settings"].includes(normalized)) {
      setUsernameAvailable(false);
      return;
    }
    
    setIsCheckingUsername(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (isFirebaseConfigured && db) {
          const docRef = doc(db, "portfolios", normalized);
          const docSnap = await getDoc(docRef);
          setUsernameAvailable(!docSnap.exists());
        } else {
          // Mock local storage checks
          const localData = localStorage.getItem("portfolio_data");
          if (localData) {
            try {
              const parsed = JSON.parse(localData);
              setUsernameAvailable(parsed.username.toLowerCase() !== normalized);
            } catch (e) {
              setUsernameAvailable(true);
            }
          } else {
            setUsernameAvailable(true);
          }
        }
      } catch (e) {
        console.error(e);
        setUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!usernameAvailable) {
      setError("Please choose a valid and available username.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Registration and login are restricted to @gmail.com email addresses only.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    
    const handleRegister = async () => {
      const normalizedUsername = username.toLowerCase().trim();
      
      if (isFirebaseConfigured && auth && db) {
        try {
          // 1. Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // 2. Initialize default portfolio data for this user
          const initialPortfolio = {
            username: normalizedUsername,
            displayName: name,
            bio: "Full Stack Engineer & Digital Creator 🚀 Designing the future of link interfaces.",
            avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
            themeId: "glassmorphism",
            fontId: "font-sans",
            buttonShapeId: "rounded-full",
            layoutId: "classic",
            hiddenSocials: [],
            bioAnimationId: "typewriter",
            ownerUid: user.uid,
            socials: {
              email: email,
            },
            links: [
              {
                id: "1",
                title: "My Personal Website 🌐",
                url: "https://example.com",
                visible: true,
                icon: "globe",
              }
            ],
          };
          
          // 3. Save to Firestore
          const docRef = doc(db, "portfolios", normalizedUsername);
          await setDoc(docRef, initialPortfolio);
          
          // 4. Set local session
          localStorage.setItem("userLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("username", normalizedUsername);
          localStorage.setItem("displayName", name);
          localStorage.setItem("portfolio_data", JSON.stringify(initialPortfolio));
          
          router.push("/dashboard");
        } catch (err: any) {
          console.error("Firebase registration error:", err);
          setError(err.message || "Registration failed. Please try again.");
          setIsLoading(false);
        }
      } else {
        // Fallback Mock Mode
        setTimeout(() => {
          setIsLoading(false);
          const initialPortfolio = {
            username: normalizedUsername,
            displayName: name,
            bio: "Full Stack Engineer & Digital Creator 🚀 Designing the future of link interfaces.",
            avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
            themeId: "glassmorphism",
            fontId: "font-sans",
            buttonShapeId: "rounded-full",
            layoutId: "classic",
            hiddenSocials: [],
            bioAnimationId: "typewriter",
            ownerUid: "mock-uid",
            socials: {
              email: email,
            },
            links: [
              {
                id: "1",
                title: "My Personal Website 🌐",
                url: "https://example.com",
                visible: true,
                icon: "globe",
              }
            ],
          };
          
          localStorage.setItem("portfolio_data", JSON.stringify(initialPortfolio));
          localStorage.setItem("userLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("username", normalizedUsername);
          localStorage.setItem("displayName", name);
          
          router.push("/dashboard");
        }, 1500);
      }
    };
    
    handleRegister();
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsLoading(true);
    if (isFirebaseConfigured && auth && db) {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (!user.email || !user.email.toLowerCase().endsWith("@gmail.com")) {
          await auth.signOut();
          setError("Registration and login are restricted to @gmail.com email addresses only.");
          setIsLoading(false);
          return;
        }

        let displayName = user.displayName || "Google Creator";
        let portfolioUsername = "";

        // Check if this Google account already has a portfolio (returning user)
        const existingPortfolio = await getPortfolioByOwnerUid(user.uid);

        if (existingPortfolio) {
          // Returning user — load their existing data
          portfolioUsername = existingPortfolio.username;
          displayName = existingPortfolio.displayName || displayName;
          localStorage.setItem("portfolio_data", JSON.stringify(existingPortfolio));
        } else {
          // New user — generate a unique username and create their profile
          const baseName = (user.displayName || user.email!.split("@")[0])
            .toLowerCase()
            .replace(/[^a-zA-Z0-9_]/g, "");

          let candidate = baseName.substring(0, 10);
          if (candidate.length < 3) candidate = "user_" + Math.floor(Math.random() * 100);

          // Try to verify username uniqueness; fall back to a random suffix if offline
          portfolioUsername = candidate;
          try {
            let isTaken = true;
            let attempt = 0;
            while (isTaken && attempt < 5) {
              const checkRef = doc(db, "portfolios", portfolioUsername);
              const checkSnap = await getDoc(checkRef);
              if (!checkSnap.exists()) {
                isTaken = false;
              } else {
                attempt++;
                portfolioUsername = candidate + Math.floor(Math.random() * 100);
              }
            }
          } catch {
            // Offline — append a random suffix to minimize collision risk
            portfolioUsername = candidate + "_" + Math.floor(Math.random() * 9000 + 1000);
          }

          // Create default portfolio document immediately after signup
          const defaultPortfolio = {
            username: portfolioUsername,
            displayName,
            bio: "Full Stack Engineer & Digital Creator 🚀 Designing the future of link interfaces.",
            avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
            themeId: "glassmorphism",
            fontId: "font-sans",
            buttonShapeId: "rounded-full",
            layoutId: "classic",
            hiddenSocials: [],
            bioAnimationId: "typewriter",
            ownerUid: user.uid,
            socials: { email: user.email },
            links: [
              {
                id: "1",
                title: "My Personal Website 🌐",
                url: "https://example.com",
                visible: true,
                icon: "globe",
              },
            ],
          };

          // Save to localStorage immediately (works offline)
          localStorage.setItem("portfolio_data", JSON.stringify(defaultPortfolio));
          // Try Firestore — if offline, persistence layer will sync when back online
          try {
            await setDoc(doc(db, "portfolios", portfolioUsername), defaultPortfolio);
          } catch {
            console.warn("Firestore write deferred (offline) — data saved to localStorage");
          }
        }

        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", user.email!);
        localStorage.setItem("username", portfolioUsername);
        localStorage.setItem("displayName", displayName);

        router.push("/dashboard");
      } catch (err: any) {
        console.error("Google Sign-Up Error:", err);
        setError(err.message || "Google Sign-Up failed. Please try again.");
        setIsLoading(false);
      }
    } else {
      // Mock mode
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", "googleuser@gmail.com");
        localStorage.setItem("username", "google_creator");
        localStorage.setItem("displayName", "Google Creator Mock");
        router.push("/dashboard");
      }, 1000);
    }
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

        {/* Content Body & Visuals */}
        <div className="relative my-auto flex flex-col items-start gap-8 z-10">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-550/30 bg-rose-500/10 px-3.5 py-1 text-sm font-medium text-rose-300">
              <Sparkles className="size-3.5 text-rose-450" />
              Join 100k+ Creators
            </span>
            <h1 className="max-w-md text-4xl font-extrabold leading-[1.15] tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Claim your unique web space today.
            </h1>
            <p className="max-w-sm text-base text-zinc-400 font-normal leading-relaxed">
              Create an account to start configuring your personal portal, adding links, custom icons, and choosing custom templates.
            </p>
          </div>

          {/* Floating UI cards preview */}
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl space-y-4 mt-4">
            <div className="h-6 w-32 rounded-md bg-white/10 border border-white/5 animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-full h-8 rounded-lg bg-white/10 border border-white/5 flex items-center px-3 text-xs text-white/50">
                <span>Choose your username...</span>
              </div>
              <div className="w-full h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-between px-3 text-xs text-indigo-200">
                <span>freecard.co/{username || "yourname"}</span>
                {usernameAvailable && <CheckCircle className="size-3 text-emerald-450" />}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} FreeCard Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:px-16 lg:w-1/2 bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-sm space-y-6">
          
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 shadow">
              <Layers className="size-4.5 text-white" />
            </div>
            <span className="font-bold text-lg">FreeCard</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Claim your link domain name and set up your profile template.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-3 text-sm text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute top-2.5 left-3 size-4 text-zinc-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="username">
                  Username
                </label>
                {username && (
                  <span className="text-[10px] flex items-center gap-1 font-medium">
                    {isCheckingUsername ? (
                      <span className="text-zinc-400">Checking...</span>
                    ) : usernameAvailable ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="size-3" /> Available
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-0.5">
                        <AlertCircle className="size-3" /> Unavailable / Invalid
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm text-zinc-400 font-medium select-none">
                  freecard.co/
                </span>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  className="pl-[90px]"
                  disabled={isLoading}
                  required
                />
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">
                Use 3-15 letters, numbers, or underscores.
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
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
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="password">
                Password
              </label>
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
                  required
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
              className="w-full h-9 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium rounded-lg text-sm flex items-center justify-center gap-1.5 shadow active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Free Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            <span className="flex-shrink mx-3 text-zinc-400 text-xs uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-55 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              <GithubIcon className="size-3.5" />
              Sign up with Github
            </button>
             <button
              onClick={handleGoogleSignup}
              className="h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-55 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              disabled={isLoading}
            >
              <GoogleIcon className="size-3.5" />
              Sign up with Google
            </button>
          </div>

          <p className="text-center text-xs text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-zinc-900 hover:underline dark:text-zinc-300">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
