"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  DEFAULT_PORTFOLIO_DATA, 
  THEME_PRESETS, 
  FONT_PRESETS, 
  BUTTON_SHAPES, 
  LAYOUT_PRESETS, 
  type PortfolioData 
} from "@/lib/theme-presets";
import { PreviewPhone } from "@/components/preview-phone";
import { auth, db, isFirebaseConfigured, savePortfolio, getPortfolioByOwnerUid } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings, 
  Layout, 
  Link as LinkIcon, 
  LogOut, 
  ExternalLink, 
  ChevronUp, 
  ChevronDown, 
  Share2, 
  Check, 
  Copy, 
  Layers, 
  Smartphone,
  Sparkles,
  User,
  Globe,
  BookOpen,
  Briefcase,
  Play,
  Heart,
  Coffee,
  Sun,
  Moon
} from "lucide-react";
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  MailIcon,
  YoutubeIcon
} from "@/components/social-icons";

const Twitter = TwitterIcon;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const router = useRouter();
  
  // App state
  const [data, setData] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [activeTab, setActiveTab] = useState<"links" | "appearance" | "settings">("links");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving..." | "Ready">("Ready");
  const [selectedIcon, setSelectedIcon] = useState("globe");
  const [appTheme, setAppTheme] = useState<"dark" | "light">("dark");
  const [previewDevice, setPreviewDevice] = useState<"iphone" | "pixel" | "watch" | "ipad" | "macbook">("iphone");

  const getLinkIcon = (iconName?: string) => {
    switch (iconName) {
      case "globe":
        return <Globe className="size-4 opacity-75 shrink-0" />;
      case "github":
        return <GithubIcon className="size-4 opacity-75 shrink-0" />;
      case "linkedin":
        return <LinkedinIcon className="size-4 opacity-75 shrink-0" />;
      case "twitter":
        return <TwitterIcon className="size-4 opacity-75 shrink-0" />;
      case "mail":
        return <MailIcon className="size-4 opacity-75 shrink-0" />;
      case "coffee":
        return <Coffee className="size-4 opacity-75 shrink-0" />;
      case "book":
        return <BookOpen className="size-4 opacity-75 shrink-0" />;
      case "youtube":
        return <YoutubeIcon className="size-4 opacity-75 shrink-0" />;
      case "instagram":
        return <InstagramIcon className="size-4 opacity-75 shrink-0" />;
      case "briefcase":
        return <Briefcase className="size-4 opacity-75 shrink-0" />;
      case "play":
        return <Play className="size-4 opacity-75 shrink-0" />;
      case "heart":
        return <Heart className="size-4 opacity-75 shrink-0" />;
      default:
        return null;
    }
  };

  // Load from local storage
  // Load from local storage or Firebase
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.push("/login");
          return;
        }

        try {
          const dbPortfolio = await getPortfolioByOwnerUid(user.uid);
          if (dbPortfolio) {
            setData(dbPortfolio);
            localStorage.setItem("portfolio_data", JSON.stringify(dbPortfolio));
            localStorage.setItem("username", dbPortfolio.username);
            localStorage.setItem("displayName", dbPortfolio.displayName);
          } else {
            // Document doesn't exist yet, initialize it
            const username = localStorage.getItem("username") || "johndoe";
            const displayName = localStorage.getItem("displayName") || user.displayName || "Creator";
            const email = user.email || "creator@freecard.co";
            
            const initialData = {
              ...DEFAULT_PORTFOLIO_DATA,
              username: username.toLowerCase().trim(),
              displayName,
              ownerUid: user.uid,
              socials: {
                ...DEFAULT_PORTFOLIO_DATA.socials,
                email,
              }
            };
            
            setData(initialData);
            await savePortfolio(username, initialData);
          }
        } catch (e) {
          console.error("Error loading portfolio from Firebase:", e);
        }
      });
      
      return () => unsubscribe();
    } else {
      // Check local storage authentication fallback
      const isLoggedIn = localStorage.getItem("userLoggedIn");
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }

      const localData = localStorage.getItem("portfolio_data");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          setData(parsed);
        } catch (e) {
          console.error("Error parsing local portfolio data:", e);
        }
      } else {
        const username = localStorage.getItem("username") || "johndoe";
        const displayName = localStorage.getItem("displayName") || "John Doe";
        const email = localStorage.getItem("userEmail") || "john@example.com";
        
        const initialData = {
          ...DEFAULT_PORTFOLIO_DATA,
          username,
          displayName,
          socials: {
            ...DEFAULT_PORTFOLIO_DATA.socials,
            email,
          }
        };
        
        setData(initialData);
        localStorage.setItem("portfolio_data", JSON.stringify(initialData));
      }
    }

    // Load theme mode
    const savedTheme = localStorage.getItem("theme_mode") as "dark" | "light" | null;
    if (savedTheme) {
      setAppTheme(savedTheme);
    }
  }, [router]);

  // Sync back to local storage and Firestore on modification
  const updateData = async (newData: PortfolioData) => {
    setData(newData);
    setSaveStatus("Saving...");
    
    // Always mirror to local storage
    localStorage.setItem("portfolio_data", JSON.stringify(newData));
    
    try {
      if (isFirebaseConfigured) {
        await savePortfolio(newData.username, newData);
      }
      setSaveStatus("Saved");
    } catch (e) {
      console.error("Error saving updates to backend:", e);
      setSaveStatus("Ready");
    }
  };

  const handleThemeChange = (theme: "dark" | "light") => {
    setAppTheme(theme);
    localStorage.setItem("theme_mode", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Log out
  const handleLogout = async () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("portfolio_data");
    
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Firebase logout error:", e);
      }
    }
    
    router.push("/login");
  };

  // Link actions
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    const newLink = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: formattedUrl,
      visible: true,
      icon: selectedIcon
    };

    const updated = {
      ...data,
      links: [newLink, ...data.links]
    };

    updateData(updated);
    setNewTitle("");
    setNewUrl("");
    setSelectedIcon("globe");
  };

  const handleToggleVisibility = (id: string) => {
    const updatedLinks = data.links.map((link) => 
      link.id === id ? { ...link, visible: !link.visible } : link
    );
    updateData({ ...data, links: updatedLinks });
  };

  const handleToggleSocialVisibility = (socialKey: string) => {
    const hidden = data.hiddenSocials || [];
    const updatedHidden = hidden.includes(socialKey)
      ? hidden.filter((k) => k !== socialKey)
      : [...hidden, socialKey];
    updateData({ ...data, hiddenSocials: updatedHidden });
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = data.links.filter((link) => link.id !== id);
    updateData({ ...data, links: updatedLinks });
  };

  const handleMoveLink = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === data.links.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedLinks = [...data.links];
    const temp = updatedLinks[index];
    updatedLinks[index] = updatedLinks[newIndex];
    updatedLinks[newIndex] = temp;

    updateData({ ...data, links: updatedLinks });
  };

  // Pre-configured link helper
  const addPresetLink = (title: string, urlPlaceholder: string, icon: string) => {
    setNewTitle(title);
    setNewUrl(urlPlaceholder);
    setSelectedIcon(icon);
  };

  // Copy shareable link
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/${data.username}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 overflow-hidden font-sans relative">
      {/* Decorative Grid & Bubble Gradients */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 dashboard-grid-pattern"></div>
        <div className="absolute -top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-[30%] -right-[10%] w-[550px] h-[550px] rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[130px] animate-pulse duration-[12000ms]"></div>
        <div className="absolute -bottom-[15%] left-[15%] w-[350px] h-[350px] rounded-full bg-cyan-500/8 dark:bg-cyan-500/12 blur-[100px]"></div>
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 shadow">
            <Layers className="size-4.5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">FreeCard</span>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline ml-1 border-l border-zinc-200 dark:border-zinc-800 pl-2">
            Creator Studio
          </span>
        </div>

        {/* Live URL & Save State */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 px-4 py-1 text-xs">
            <span className="text-zinc-400">Your link:</span>
            <a 
              href={`/${data.username}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="font-medium hover:underline text-indigo-650 dark:text-indigo-400 flex items-center gap-1"
            >
              freecard.co/{data.username}
              <ExternalLink className="size-3" />
            </a>
          </div>

          {saveStatus !== "Ready" && (
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${
              saveStatus === "Saved" ? "text-emerald-500" : "text-zinc-400 animate-pulse"
            }`}>
              {saveStatus}
            </span>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyLink}
            className="h-8 gap-1.5 rounded-full"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Share2 className="size-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon-sm"
            onClick={handleLogout}
            className="size-8 rounded-full border border-zinc-200 dark:border-zinc-800"
            title="Log Out"
          >
            <LogOut className="size-3.5 text-zinc-500" />
          </Button>
        </div>
      </header>

      {/* Main Workspace grid */}
      <div className="flex flex-1 overflow-hidden justify-center relative w-full">
        <div className="flex w-full max-w-6xl h-full justify-between relative">
          {/* Left Customizer Interface */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-3xl">
          {/* Tab buttons */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6 mb-6">
            <button
              onClick={() => setActiveTab("links")}
              className={`pb-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "links" 
                  ? "border-zinc-900 text-zinc-950 dark:border-zinc-100 dark:text-zinc-50" 
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              <LinkIcon className="size-4" />
              Links
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`pb-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "appearance" 
                  ? "border-zinc-900 text-zinc-950 dark:border-zinc-100 dark:text-zinc-50" 
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              <Layout className="size-4" />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-2.5 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === "settings" 
                  ? "border-zinc-900 text-zinc-950 dark:border-zinc-100 dark:text-zinc-50" 
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            >
              <Settings className="size-4" />
              Settings
            </button>
          </div>

          {/* Links Customization View */}
          {activeTab === "links" && (
            <div className="space-y-6">
              {/* Add New Link Card */}
              <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Plus className="size-4 text-indigo-500" />
                  Add New Card
                </h3>
                <form onSubmit={handleAddLink} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      type="text"
                      placeholder="Title (e.g. My GitHub)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="URL (e.g. github.com/myusername)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                  </div>

                  {/* Icon selector grid */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Select Card Icon</label>
                    <div className="flex flex-wrap gap-1 bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      {[
                        { id: "globe", icon: <Globe className="size-3.5" />, label: "Globe" },
                        { id: "github", icon: <GithubIcon className="size-3.5" />, label: "GitHub" },
                        { id: "linkedin", icon: <LinkedinIcon className="size-3.5" />, label: "LinkedIn" },
                        { id: "twitter", icon: <TwitterIcon className="size-3.5" />, label: "Twitter" },
                        { id: "mail", icon: <MailIcon className="size-3.5" />, label: "Mail" },
                        { id: "coffee", icon: <Coffee className="size-3.5" />, label: "Coffee" },
                        { id: "book", icon: <BookOpen className="size-3.5" />, label: "Book" },
                        { id: "youtube", icon: <YoutubeIcon className="size-3.5" />, label: "YouTube" },
                        { id: "instagram", icon: <InstagramIcon className="size-3.5" />, label: "Instagram" },
                        { id: "briefcase", icon: <Briefcase className="size-3.5" />, label: "Briefcase" },
                        { id: "play", icon: <Play className="size-3.5" />, label: "Play" },
                        { id: "heart", icon: <Heart className="size-3.5" />, label: "Heart" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedIcon(item.id)}
                          title={item.label}
                          className={`p-1.5 rounded transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                            selectedIcon === item.id 
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm" 
                              : "text-zinc-500"
                          }`}
                        >
                          {item.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Sparkles className="size-3 text-indigo-400" />
                      Tip: Use quick presets below to fill quickly
                    </span>
                    <Button 
                      type="submit" 
                      size="sm"
                      className="h-8 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-medium px-4 rounded-lg active:scale-[0.98]"
                      disabled={!newTitle.trim() || !newUrl.trim()}
                    >
                      Create Card
                    </Button>
                  </div>
                </form>

                {/* Preset Suggestions */}
                <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Quick presets</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Button 
                      variant="outline"
                      size="xs"
                      onClick={() => addPresetLink("GitHub Portfolio", "github.com/", "github")}
                    >
                      + GitHub
                    </Button>
                    <Button 
                      variant="outline"
                      size="xs"
                      onClick={() => addPresetLink("Connect on LinkedIn", "linkedin.com/in/", "linkedin")}
                    >
                      + LinkedIn
                    </Button>
                    <Button 
                      variant="outline"
                      size="xs"
                      onClick={() => addPresetLink("My Twitter X Feed", "x.com/", "twitter")}
                    >
                      + Twitter
                    </Button>
                    <Button 
                      variant="outline"
                      size="xs"
                      onClick={() => addPresetLink("Send Me an Email", "mailto:", "mail")}
                    >
                      + Email
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Links ({data.links.length})</h3>
                  <span className="text-[10px] text-zinc-400">Changes auto-save instantly</span>
                </div>

                {data.links.length > 0 ? (
                  <div className="space-y-2.5">
                    {data.links.map((link, index) => (
                      <div 
                        key={link.id}
                        className={`rounded-xl border p-3 sm:p-4 bg-white dark:bg-zinc-900 transition-all flex items-start gap-2 sm:gap-3.5 shadow-sm group/card ${
                          link.visible ? "border-zinc-200 dark:border-zinc-800" : "border-zinc-250 dark:border-zinc-800/40 opacity-60"
                        }`}
                      >
                        {/* Order sorting controls */}
                        <div className="flex flex-col gap-1.5 self-center">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleMoveLink(index, "up")}
                            disabled={index === 0}
                            title="Move Up"
                          >
                            <ChevronUp className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleMoveLink(index, "down")}
                            disabled={index === data.links.length - 1}
                            title="Move Down"
                          >
                            <ChevronDown className="size-3.5" />
                          </Button>
                        </div>

                        {/* Link Icon selector */}
                        <div className="flex flex-col gap-1 items-center justify-center p-1 sm:p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 min-w-[65px] sm:min-w-[75px] shrink-0 self-center">
                          {getLinkIcon(link.icon)}
                          <Select
                            value={link.icon || "globe"}
                            onValueChange={(val) => {
                              const updated = [...data.links];
                              updated[index].icon = val || undefined;
                              updateData({ ...data, links: updated });
                            }}
                          >
                            <SelectTrigger className="w-full h-5 border-none bg-transparent text-[9px] font-bold text-zinc-500 flex justify-center items-center p-0 shadow-none outline-none focus-visible:ring-0">
                              <SelectValue placeholder="Icon" />
                            </SelectTrigger>
                            <SelectContent className="min-w-[125px]">
                              <SelectItem value="globe">Globe</SelectItem>
                              <SelectItem value="github">GitHub</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="mail">Mail</SelectItem>
                              <SelectItem value="coffee">Coffee</SelectItem>
                              <SelectItem value="book">Book</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="briefcase">Briefcase</SelectItem>
                              <SelectItem value="play">Play</SelectItem>
                              <SelectItem value="heart">Heart</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Link content edit */}
                        <div className="flex-1 space-y-2 min-w-0">
                          <Input
                            type="text"
                            value={link.title}
                            onChange={(e) => {
                              const updated = [...data.links];
                              updated[index].title = e.target.value;
                              updateData({ ...data, links: updated });
                            }}
                            className="!w-full !h-auto !text-xs !font-bold !bg-transparent !border-none !shadow-none !ring-0 !p-0 !outline-none !pb-0.5 truncate text-zinc-800 dark:text-zinc-200"
                            placeholder="Link Title"
                          />
                          <Input
                            type="text"
                            value={link.url}
                            onChange={(e) => {
                              const updated = [...data.links];
                              updated[index].url = e.target.value;
                              updateData({ ...data, links: updated });
                            }}
                            className="!w-full !h-auto !text-[10px] !font-mono !bg-transparent !border-none !shadow-none !ring-0 !p-0 !outline-none !pb-0.5 text-zinc-400 truncate"
                            placeholder="Destination URL"
                          />
                        </div>

                        {/* Visibility & Delete options */}
                        <div className="flex items-center gap-1 self-center">
                          <Button
                            variant={link.visible ? "secondary" : "outline"}
                            size="icon-sm"
                            onClick={() => handleToggleVisibility(link.id)}
                            title={link.visible ? "Hide Link" : "Show Link"}
                          >
                            {link.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => handleDeleteLink(link.id)}
                            title="Delete Link"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center bg-white dark:bg-zinc-900">
                    <p className="text-xs text-zinc-450 italic">No links added yet. Use the card creator above to build links.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Profile Config */}
              <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <User className="size-4 text-indigo-500" />
                  Profile Details
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  {/* Image edit mockup */}
                  <div className="relative group/avatar cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={data.avatarUrl} 
                      alt="Avatar" 
                      className="size-16 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-800"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-[10px] text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                      Change
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Display Name</label>
                        <Input
                          type="text"
                          value={data.displayName}
                          onChange={(e) => updateData({ ...data, displayName: e.target.value })}
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Avatar Image URL</label>
                        <Input
                          type="text"
                          value={data.avatarUrl}
                          onChange={(e) => updateData({ ...data, avatarUrl: e.target.value })}
                          placeholder="https://unsplash.com/..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Bio Details</label>
                      <Textarea
                        value={data.bio}
                        onChange={(e) => updateData({ ...data, bio: e.target.value })}
                        rows={2}
                        className="resize-none leading-relaxed"
                        placeholder="Tell visitors about yourself..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Bio Entry Animation</label>
                      <Select
                        value={data.bioAnimationId || "typewriter"}
                        onValueChange={(val) => updateData({ ...data, bioAnimationId: val || undefined })}
                      >
                        <SelectTrigger className="w-full h-8.5 text-xs">
                          <SelectValue placeholder="Choose entry animation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="typewriter">Typewriter (Typing)</SelectItem>
                          <SelectItem value="fade">Smooth Fade In</SelectItem>
                          <SelectItem value="slide">Slide Up Entrance</SelectItem>
                          <SelectItem value="pulse">Pulsing Glow</SelectItem>
                          <SelectItem value="none">Static (None)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Selector */}
              <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <Layout className="size-4 text-indigo-500" />
                    Page Layouts
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 dark:text-zinc-500">Choose how your cards and content links are arranged.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LAYOUT_PRESETS.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => updateData({ ...data, layoutId: layout.id })}
                      className={`rounded-xl p-3.5 border text-left flex flex-col justify-between min-h-[92px] transition-all relative overflow-hidden group/layout ${
                        (data.layoutId || "classic") === layout.id 
                          ? "border-zinc-900 ring-1 ring-zinc-950/10 dark:border-zinc-100 dark:ring-white/10 bg-zinc-50/60 dark:bg-zinc-850/40" 
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                      }`}
                    >
                      <div className="z-10">
                        <span className="text-xs font-bold block">{layout.name}</span>
                        <span className="text-[10px] text-zinc-400 mt-1 block leading-relaxed pr-6">{layout.description}</span>
                      </div>
                      {/* Subtle layout visualization pattern in the bottom right corner */}
                      <div className="absolute right-3.5 bottom-3.5 opacity-10 group-hover/layout:opacity-20 transition-all duration-300 pointer-events-none text-zinc-900 dark:text-zinc-150">
                        {layout.id === "classic" && (
                          <div className="flex flex-col gap-1 w-6">
                            <div className="h-1 bg-current rounded-xs"></div>
                            <div className="h-1 bg-current rounded-xs"></div>
                            <div className="h-1 bg-current rounded-xs"></div>
                          </div>
                        )}
                        {layout.id === "grid" && (
                          <div className="grid grid-cols-2 gap-0.5 w-6">
                            <div className="h-2.5 bg-current rounded-xs"></div>
                            <div className="h-2.5 bg-current rounded-xs"></div>
                            <div className="h-2.5 bg-current rounded-xs"></div>
                            <div className="h-2.5 bg-current rounded-xs"></div>
                          </div>
                        )}
                        {layout.id === "featured" && (
                          <div className="flex flex-col gap-1 w-6">
                            <div className="h-2 bg-indigo-500 dark:bg-indigo-400 rounded-xs"></div>
                            <div className="h-1 bg-current rounded-xs"></div>
                            <div className="h-1 bg-current rounded-xs"></div>
                          </div>
                        )}
                        {layout.id === "minimal-text" && (
                          <div className="flex flex-col gap-1 w-6 font-serif text-[10px] leading-none font-bold uppercase">
                            Aa
                          </div>
                        )}
                        {layout.id === "alternate-zigzag" && (
                          <div className="flex flex-col gap-1 w-6">
                            <div className="h-1 bg-current w-4 rounded-xs"></div>
                            <div className="h-1 bg-current w-4 rounded-xs self-end"></div>
                            <div className="h-1 bg-current w-4 rounded-xs"></div>
                          </div>
                        )}
                        {layout.id === "timeline" && (
                          <div className="flex gap-1 w-6 items-center h-6 justify-center">
                            <div className="w-0.5 h-full bg-current opacity-50 shrink-0"></div>
                            <div className="flex flex-col gap-1 w-full">
                              <div className="h-1 bg-current rounded-xs"></div>
                              <div className="h-1 bg-current rounded-xs"></div>
                            </div>
                          </div>
                        )}
                        {layout.id === "detailed-feed" && (
                          <div className="flex flex-col gap-1 w-6">
                            <div className="h-2 bg-current rounded-xs"></div>
                            <div className="h-2 bg-current rounded-xs"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <Layout className="size-4 text-indigo-500" />
                    Premium Themes
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Choose your portfolio background and styling aesthetic.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEME_PRESETS.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => updateData({ ...data, themeId: theme.id })}
                      className={`rounded-xl p-3 border text-left flex flex-col justify-between h-20 transition-all ${
                        data.themeId === theme.id 
                          ? "border-zinc-900 ring-2 ring-zinc-950/20 dark:border-white dark:ring-white/20" 
                          : "border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                      }`}
                    >
                      <div className={`size-6 rounded-md ${theme.previewBg}`}></div>
                      <span className="text-xs font-semibold">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-1.5">
                      <Sparkles className="size-4 text-indigo-500" />
                      Custom Theme Colors
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Override the theme preset with your own designer colors.</p>
                  </div>
                  {(data.customBackground || data.customTextColor || data.customButtonBg || data.customButtonText) && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        updateData({
                          ...data,
                          customBackground: undefined,
                          customTextColor: undefined,
                          customButtonBg: undefined,
                          customButtonText: undefined,
                          customIconColor: undefined,
                        });
                      }}
                      className="text-[10px] text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
                    >
                      Reset Colors
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Background Color */}
                  <div className="space-y-1.5 text-center sm:text-left">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Background</label>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <input
                        type="color"
                        value={data.customBackground || "#09090b"}
                        onChange={(e) => updateData({ ...data, customBackground: e.target.value })}
                        className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-hidden bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-zinc-500">{data.customBackground || "None"}</span>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-1.5 text-center sm:text-left">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Text & Icons</label>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <input
                        type="color"
                        value={data.customTextColor || "#fafafa"}
                        onChange={(e) => updateData({ ...data, customTextColor: e.target.value })}
                        className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-hidden bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-zinc-500">{data.customTextColor || "None"}</span>
                    </div>
                  </div>

                  {/* Button Bg Color */}
                  <div className="space-y-1.5 text-center sm:text-left">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Button Bg</label>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <input
                        type="color"
                        value={data.customButtonBg || "#18181b"}
                        onChange={(e) => updateData({ ...data, customButtonBg: e.target.value })}
                        className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-hidden bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-zinc-500">{data.customButtonBg || "None"}</span>
                    </div>
                  </div>

                  {/* Button Text Color */}
                  <div className="space-y-1.5 text-center sm:text-left">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Button Text</label>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <input
                        type="color"
                        value={data.customButtonText || "#fafafa"}
                        onChange={(e) => updateData({ ...data, customButtonText: e.target.value })}
                        className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-800 cursor-pointer overflow-hidden bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-zinc-500">{data.customButtonText || "None"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fonts & Card shapes customization */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Font Preset Selector */}
                <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-3">
                  <label className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Typography Font</label>
                  <div className="flex flex-col gap-2">
                    {FONT_PRESETS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => updateData({ ...data, fontId: font.id })}
                        className={`w-full py-2 px-3 text-left rounded-lg border text-xs font-medium transition-all ${
                          data.fontId === font.id 
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950" 
                            : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                        }`}
                      >
                        <span className={font.class}>{font.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Shapes Selector */}
                <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-3">
                  <label className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Button Styling</label>
                  <div className="flex flex-col gap-2">
                    {BUTTON_SHAPES.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => updateData({ ...data, buttonShapeId: shape.id })}
                        className={`w-full py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${
                          data.buttonShapeId === shape.id 
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-950" 
                            : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                        }`}
                      >
                        <span>{shape.name}</span>
                        <div className={`w-8 h-4 border border-current opacity-70 ${shape.class}`}></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Account Setting Profile URL */}
              <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Settings className="size-4 text-indigo-500" />
                  Account Settings
                </h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dynamic URL Extension</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-zinc-400 font-medium select-none">
                      freecard.co/
                    </span>
                    <Input
                      type="text"
                      value={data.username}
                      onChange={(e) => updateData({ ...data, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() })}
                      className="pl-[90px]"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight">Changing this updates your public access URL immediately.</p>
                </div>
              </div>

              {/* Interface Theme Settings */}
              <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <Sparkles className="size-4 text-indigo-500" />
                    Interface Theme
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 dark:text-zinc-500">Customize your personal viewing mode for FreeCard.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`flex items-center gap-3 rounded-xl p-4 border text-left transition-all cursor-pointer ${
                      appTheme === "dark"
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500"
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${appTheme === "dark" ? "bg-indigo-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                      <Moon className="size-4.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Dark Mode</span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-0.5">Default high contrast</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`flex items-center gap-3 rounded-xl p-4 border text-left transition-all cursor-pointer ${
                      appTheme === "light"
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500"
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${appTheme === "light" ? "bg-indigo-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                      <Sun className="size-4.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Light Mode</span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-0.5">Clean and bright</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Social Channels row edits */}
              <div className="rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5">
                    <Share2 className="size-4 text-indigo-500" />
                    Social Network Integrations
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">These will display as circular icons below your profile bio.</p>
              <div className="space-y-3">
                  {/* GitHub edit */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-xs font-semibold text-zinc-500 dark:text-zinc-455 flex items-center gap-1">
                      <GithubIcon className="size-3.5" /> GitHub
                    </div>
                    <Input
                      type="text"
                      value={data.socials.github || ""}
                      onChange={(e) => updateData({
                        ...data,
                        socials: { ...data.socials, github: e.target.value }
                      })}
                      placeholder="https://github.com/myusername"
                      className="flex-1"
                    />
                    <Button
                      variant={!(data.hiddenSocials || []).includes("github") ? "secondary" : "outline"}
                      size="icon-sm"
                      type="button"
                      onClick={() => handleToggleSocialVisibility("github")}
                      title={!(data.hiddenSocials || []).includes("github") ? "Hide GitHub" : "Show GitHub"}
                      disabled={!data.socials.github}
                    >
                      {!(data.hiddenSocials || []).includes("github") ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </Button>
                  </div>

                  {/* Twitter edit */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-xs font-semibold text-zinc-500 dark:text-zinc-455 flex items-center gap-1">
                      <TwitterIcon className="size-3.5" /> Twitter X
                    </div>
                    <Input
                      type="text"
                      value={data.socials.twitter || ""}
                      onChange={(e) => updateData({
                        ...data,
                        socials: { ...data.socials, twitter: e.target.value }
                      })}
                      placeholder="https://x.com/myusername"
                      className="flex-1"
                    />
                    <Button
                      variant={!(data.hiddenSocials || []).includes("twitter") ? "secondary" : "outline"}
                      size="icon-sm"
                      type="button"
                      onClick={() => handleToggleSocialVisibility("twitter")}
                      title={!(data.hiddenSocials || []).includes("twitter") ? "Hide Twitter" : "Show Twitter"}
                      disabled={!data.socials.twitter}
                    >
                      {!(data.hiddenSocials || []).includes("twitter") ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </Button>
                  </div>

                  {/* LinkedIn edit */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-xs font-semibold text-zinc-500 dark:text-zinc-455 flex items-center gap-1">
                      <LinkedinIcon className="size-3.5" /> LinkedIn
                    </div>
                    <Input
                      type="text"
                      value={data.socials.linkedin || ""}
                      onChange={(e) => updateData({
                        ...data,
                        socials: { ...data.socials, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/myusername"
                      className="flex-1"
                    />
                    <Button
                      variant={!(data.hiddenSocials || []).includes("linkedin") ? "secondary" : "outline"}
                      size="icon-sm"
                      type="button"
                      onClick={() => handleToggleSocialVisibility("linkedin")}
                      title={!(data.hiddenSocials || []).includes("linkedin") ? "Hide LinkedIn" : "Show LinkedIn"}
                      disabled={!data.socials.linkedin}
                    >
                      {!(data.hiddenSocials || []).includes("linkedin") ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </Button>
                  </div>

                  {/* Instagram edit */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-xs font-semibold text-zinc-500 dark:text-zinc-455 flex items-center gap-1">
                      <InstagramIcon className="size-3.5" /> Instagram
                    </div>
                    <Input
                      type="text"
                      value={data.socials.instagram || ""}
                      onChange={(e) => updateData({
                        ...data,
                        socials: { ...data.socials, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/myusername"
                      className="flex-1"
                    />
                    <Button
                      variant={!(data.hiddenSocials || []).includes("instagram") ? "secondary" : "outline"}
                      size="icon-sm"
                      type="button"
                      onClick={() => handleToggleSocialVisibility("instagram")}
                      title={!(data.hiddenSocials || []).includes("instagram") ? "Hide Instagram" : "Show Instagram"}
                      disabled={!data.socials.instagram}
                    >
                      {!(data.hiddenSocials || []).includes("instagram") ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </Button>
                  </div>

                  {/* Email edit */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-xs font-semibold text-zinc-505 dark:text-zinc-455 flex items-center gap-1">
                      <MailIcon className="size-3.5" /> Email
                    </div>
                    <Input
                      type="text"
                      value={data.socials.email || ""}
                      onChange={(e) => updateData({
                        ...data,
                        socials: { ...data.socials, email: e.target.value }
                      })}
                      placeholder="name@example.com"
                      className="flex-1"
                    />
                    <Button
                      variant={!(data.hiddenSocials || []).includes("email") ? "secondary" : "outline"}
                      size="icon-sm"
                      type="button"
                      onClick={() => handleToggleSocialVisibility("email")}
                      title={!(data.hiddenSocials || []).includes("email") ? "Hide Email" : "Show Email"}
                      disabled={!data.socials.email}
                    >
                      {!(data.hiddenSocials || []).includes("email") ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </Button>
                  </div>
                </div>      </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Phone Mockup Sticky Panel (hidden on mobile, sticky on md+) */}
        <aside className="hidden lg:flex w-[480px] shrink-0 bg-zinc-100 dark:bg-zinc-900/40 border-l border-zinc-200 dark:border-zinc-800 flex-col items-center justify-center p-8 sticky top-14 h-[calc(100vh-3.5rem)] gap-4 select-none">
          <div className="flex items-center gap-1 bg-zinc-200/60 dark:bg-zinc-800/60 p-1.5 rounded-2xl">
            {[
              { id: "iphone", label: "iPhone 15 Pro" },
              { id: "pixel", label: "Pixel 8" },
              { id: "watch", label: "Watch S9" },
              { id: "ipad", label: "iPad Pro" },
              { id: "macbook", label: "Macbook Air" }
            ].map((deviceOpt) => (
              <button
                key={deviceOpt.id}
                onClick={() => setPreviewDevice(deviceOpt.id as any)}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all cursor-pointer ${
                  previewDevice === deviceOpt.id
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200"
                }`}
              >
                {deviceOpt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <PreviewPhone data={data} device={previewDevice} />
            <div className="text-[10px] text-zinc-450 font-mono tracking-tight text-center">
              * Live Preview matches public presentation
            </div>
          </div>
        </aside>
      </div>
      </div>

      {/* Floating Action Button for Mobile Preview */}
      <button
        onClick={() => setIsMobilePreviewOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-full shadow-2xl p-3.5 active:scale-95 transition-all flex items-center gap-1.5"
      >
        <Smartphone className="size-4" />
        <span className="text-xs font-bold">Preview</span>
      </button>

      {/* Mobile Preview Modal overlay */}
      {isMobilePreviewOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-full">
            {/* Close modal button */}
            <button
              onClick={() => setIsMobilePreviewOpen(false)}
              className="absolute -top-12 right-2 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full font-bold text-xs"
            >
              Close Preview
            </button>
            <PreviewPhone data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
