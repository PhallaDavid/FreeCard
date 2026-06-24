"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { 
  THEME_PRESETS, 
  FONT_PRESETS, 
  BUTTON_SHAPES, 
  DEFAULT_PORTFOLIO_DATA, 
  type PortfolioData 
} from "@/lib/theme-presets";
import { 
  ExternalLink, 
  Globe,
  Layers,
  Sparkles,
  Heart,
  BookOpen,
  Briefcase,
  Play,
  Coffee
} from "lucide-react";
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  MailIcon,
  YoutubeIcon
} from "@/components/social-icons";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default function PublicPortfolioPage({ params }: PageProps) {
  // Resolve React 19 async params
  const resolvedParams = use(params);
  const rawUsername = resolvedParams.username;
  const username = decodeURIComponent(rawUsername).toLowerCase();

  const [data, setData] = useState<PortfolioData | null>(null);
  const [typedBio, setTypedBio] = useState("");

  useEffect(() => {
    const animId = data?.bioAnimationId || "typewriter";
    if (animId !== "typewriter" || !data?.bio) {
      setTypedBio(data?.bio || "");
      return;
    }
    
    let isMounted = true;
    setTypedBio("");
    let currentIdx = 0;
    const fullText = data.bio;
    
    const delayTimeout = setTimeout(() => {
      if (!isMounted) return;
      
      const interval = setInterval(() => {
        if (!isMounted) return;
        if (currentIdx < fullText.length) {
          setTypedBio(fullText.slice(0, currentIdx + 1));
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 45);
      
      return () => clearInterval(interval);
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(delayTimeout);
    };
  }, [data?.bio, data?.bioAnimationId]);

  useEffect(() => {
    // Attempt to load current user data from localStorage
    const localData = localStorage.getItem("portfolio_data");
    if (localData) {
      try {
        const parsed: PortfolioData = JSON.parse(localData);
        // If the route matches the customized username, use it
        if (parsed.username.toLowerCase() === username) {
          setData(parsed);
          return;
        }
      } catch (e) {
        console.error("Error parsing local portfolio data", e);
      }
    }

    // Fallback: If navigating to "johndoe", use defaults
    if (username === "johndoe" || username === "demo") {
      setData(DEFAULT_PORTFOLIO_DATA);
      return;
    }

    // Dynamically generate a nice portfolio if another username is visited
    const dynamicData: PortfolioData = {
      username: username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      bio: `Welcome to my profile hub! I am a passionate creator building cool things on the web. Follow my journeys below! ✨`,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
      themeId: THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)].id,
      fontId: "font-sans",
      buttonShapeId: "rounded-full",
      layoutId: "classic",
      socials: {
        github: `https://github.com/${username}`,
        twitter: `https://twitter.com/${username}`,
        email: `${username}@example.com`,
      },
      links: [
        {
          id: "1",
          title: "💻 Visit My Projects Hub",
          url: "https://github.com",
          visible: true,
        },
        {
          id: "2",
          title: "☕ Buy Me a Coffee",
          url: "https://buymeacoffee.com",
          visible: true,
        },
        {
          id: "3",
          title: "📱 Follow Me on Socials",
          url: "https://linktr.ee",
          visible: true,
        },
      ],
    };
    setData(dynamicData);
  }, [username]);

  if (!data) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-400 font-mono text-xs">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Resolving profile...</span>
        </div>
      </div>
    );
  }

  const currentTheme = THEME_PRESETS.find((t) => t.id === data.themeId) || THEME_PRESETS[0];
  const currentFont = FONT_PRESETS.find((f) => f.id === data.fontId) || FONT_PRESETS[0];
  const currentButtonShape = BUTTON_SHAPES.find((s) => s.id === data.buttonShapeId) || BUTTON_SHAPES[0];

  const bioAnimId = data.bioAnimationId || "typewriter";
  let bioAnimationClass = "";
  if (bioAnimId === "fade") {
    bioAnimationClass = "animate-bio-fade";
  } else if (bioAnimId === "slide") {
    bioAnimationClass = "animate-bio-slide";
  } else if (bioAnimId === "pulse") {
    bioAnimationClass = "animate-bio-pulse";
  }

  const getSocialIcon = (key: string) => {
    switch (key) {
      case "github":
        return <GithubIcon className="size-5" />;
      case "twitter":
        return <TwitterIcon className="size-5" />;
      case "linkedin":
        return <LinkedinIcon className="size-5" />;
      case "instagram":
        return <InstagramIcon className="size-5" />;
      case "email":
        return <MailIcon className="size-5" />;
      default:
        return <Globe className="size-5" />;
    }
  };

  const getLinkIcon = (iconName?: string) => {
    switch (iconName) {
      case "globe":
        return <Globe className="size-4.5 opacity-75 shrink-0" />;
      case "github":
        return <GithubIcon className="size-4.5 opacity-75 shrink-0" />;
      case "linkedin":
        return <LinkedinIcon className="size-4.5 opacity-75 shrink-0" />;
      case "twitter":
        return <TwitterIcon className="size-4.5 opacity-75 shrink-0" />;
      case "mail":
        return <MailIcon className="size-4.5 opacity-75 shrink-0" />;
      case "coffee":
        return <Coffee className="size-4.5 opacity-75 shrink-0" />;
      case "book":
        return <BookOpen className="size-4.5 opacity-75 shrink-0" />;
      case "youtube":
        return <YoutubeIcon className="size-4.5 opacity-75 shrink-0" />;
      case "instagram":
        return <InstagramIcon className="size-4.5 opacity-75 shrink-0" />;
      case "briefcase":
        return <Briefcase className="size-4.5 opacity-75 shrink-0" />;
      case "play":
        return <Play className="size-4.5 opacity-75 shrink-0" />;
      case "heart":
        return <Heart className="size-4.5 opacity-75 shrink-0" />;
      default:
        return null;
    }
  };

  const getSocialUrl = (key: string, val: string) => {
    if (key === "email") return `mailto:${val}`;
    return val.startsWith("http") ? val : `https://${val}`;
  };



  const visibleLinks = data.links.filter((link) => link.visible);

  const renderLinks = () => {
    if (visibleLinks.length === 0) {
      return (
        <div className={`text-center py-10 italic text-sm opacity-60 ${currentTheme.subtextClass}`}>
          This portfolio doesn&apos;t have any links yet.
        </div>
      );
    }

    const layout = data.layoutId || "classic";

    if (layout === "grid") {
      return (
        <div className="w-full grid grid-cols-2 gap-4">
          {visibleLinks.map((link, idx) => (
            <a
              key={link.id}
              href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                animationDelay: `${idx * 80}ms`,
                animationFillMode: "both",
                backgroundColor: data.customButtonBg || undefined,
                color: data.customButtonText || undefined,
                borderColor: data.customButtonText ? `${data.customButtonText}30` : undefined,
              }}
              className={`flex flex-col items-center justify-center p-5 text-xs font-bold aspect-square text-center shadow-md select-none gap-3 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] border animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${data.customButtonBg ? "" : currentTheme.cardStyle} ${currentButtonShape.class}`}
            >
              <div 
                className="flex items-center justify-center size-10 rounded-full bg-black/5 dark:bg-white/5 shrink-0"
                style={{ color: data.customButtonText || undefined }}
              >
                {getLinkIcon(link.icon) || <Globe className="size-5" />}
              </div>
              <span 
                className={`line-clamp-2 w-full text-center px-1 leading-snug ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                style={{ color: data.customButtonText || undefined }}
              >
                {link.title || "Link"}
              </span>
            </a>
          ))}
        </div>
      );
    }

    if (layout === "featured") {
      const [firstLink, ...otherLinks] = visibleLinks;
      return (
        <div className="w-full flex flex-col gap-3.5">
          {/* Hero Highlighted Link */}
          <a
            href={firstLink.url.startsWith("http") ? firstLink.url : `https://${firstLink.url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: data.customButtonBg || undefined,
              color: data.customButtonText || undefined,
              borderColor: data.customButtonBg ? (data.customTextColor || undefined) : "var(--color-indigo-500)",
            }}
            className={`w-full flex items-center justify-between py-5 px-7 text-base font-extrabold shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] border-2 relative overflow-hidden group/hero animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${data.customButtonBg ? "" : currentTheme.cardStyle} ${currentButtonShape.class}`}
          >
            {/* Pulsing indicator */}
            <span className="absolute top-2.5 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>

            <span 
              className="flex items-center size-5 shrink-0"
              style={{ color: data.customButtonText || undefined }}
            >
              {getLinkIcon(firstLink.icon) || <Globe className="size-4.5" />}
            </span>
            <span 
              className={`truncate flex-1 text-center font-extrabold tracking-wide ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
              style={{ color: data.customButtonText || undefined }}
            >
              {firstLink.title || "Featured Release"}
            </span>
            <ExternalLink 
              className={`size-4.5 opacity-65 group-hover/hero:opacity-100 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
              style={{ color: data.customButtonText || undefined }}
            />
          </a>

          {/* Remaining Links */}
          {otherLinks.map((link, idx) => (
            <a
              key={link.id}
              href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                animationDelay: `${(idx + 1) * 80}ms`,
                animationFillMode: "both",
                backgroundColor: data.customButtonBg || undefined,
                color: data.customButtonText || undefined,
                borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined,
              }}
              className={`w-full flex items-center justify-between py-3.5 px-6 text-sm font-bold shadow-md transition-all duration-300 select-none hover:-translate-y-0.5 active:scale-[0.98] animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${data.customButtonBg ? "" : currentTheme.cardStyle} ${currentButtonShape.class}`}
            >
              <span 
                className="flex items-center size-4.5 shrink-0"
                style={{ color: data.customButtonText || undefined }}
              >
                {getLinkIcon(link.icon)}
              </span>
              <span 
                className={`truncate flex-1 text-center tracking-wide ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                style={{ color: data.customButtonText || undefined }}
              >
                {link.title || "Untitled Link"}
              </span>
              <ExternalLink 
                className={`size-4 opacity-50 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                style={{ color: data.customButtonText || undefined }}
              />
            </a>
          ))}
        </div>
      );
    }

    if (layout === "minimal-text") {
      return (
        <div className="w-full flex flex-col gap-5">
          {visibleLinks.map((link, idx) => (
            <a
              key={link.id}
              href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                animationDelay: `${idx * 80}ms`,
                animationFillMode: "both",
                color: data.customTextColor || undefined,
                borderBottomColor: data.customTextColor ? `${data.customTextColor}25` : undefined,
              }}
              className={`w-full flex items-center justify-between py-3 border-b border-current/15 hover:border-current/35 hover:underline transition-all duration-300 text-sm font-bold leading-normal animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${data.customTextColor ? "" : currentTheme.textClass}`}
            >
              <span className="flex items-center size-4.5 shrink-0">
                {getLinkIcon(link.icon) || <Globe className="size-4" />}
              </span>
              <span className="truncate flex-1 text-center font-extrabold tracking-wide">
                {link.title || "Untitled Link"}
              </span>
              <ExternalLink className="size-4 opacity-40 shrink-0" />
            </a>
          ))}
        </div>
      );
    }

    if (layout === "alternate-zigzag") {
      return (
        <div className="w-full flex flex-col gap-4">
          {visibleLinks.map((link, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <a
                key={link.id}
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  animationDelay: `${idx * 80}ms`,
                  animationFillMode: "both",
                  backgroundColor: data.customButtonBg || undefined,
                  color: data.customButtonText || undefined,
                  borderColor: data.customButtonText ? `${data.customButtonText}30` : undefined,
                  transform: isEven ? "translateX(-6px)" : "translateX(6px)"
                }}
                className={`w-full flex items-center justify-between py-4 px-6 text-sm font-bold shadow-md transition-all duration-300 select-none hover:-translate-y-0.5 active:scale-[0.98] border animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${data.customButtonBg ? "" : currentTheme.cardStyle} ${currentButtonShape.class} ${isEven ? "flex-row" : "flex-row-reverse"}`}
              >
                <span 
                  className="flex items-center size-4.5 shrink-0"
                  style={{ color: data.customButtonText || undefined }}
                >
                  {getLinkIcon(link.icon) || <Globe className="size-4.5" />}
                </span>
                <span 
                  className={`truncate flex-1 text-center px-3 tracking-wide ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                  style={{ color: data.customButtonText || undefined }}
                >
                  {link.title || "Untitled Link"}
                </span>
                <ExternalLink 
                  className={`size-4 opacity-40 hover:opacity-100 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                  style={{ color: data.customButtonText || undefined }}
                />
              </a>
            );
          })}
        </div>
      );
    }

    if (layout === "timeline") {
      return (
        <div className="w-full flex flex-col gap-6 pl-5 relative">
          <div 
            className="absolute left-[27px] top-4 bottom-8 w-0.5 bg-current opacity-15"
            style={{ color: data.customTextColor || undefined }}
          ></div>
          
          {visibleLinks.map((link, idx) => (
            <div 
              key={link.id} 
              className="flex items-center gap-4 relative w-full animate-in fade-in-0 slide-in-from-bottom-3 duration-500"
              style={{
                animationDelay: `${idx * 80}ms`,
                animationFillMode: "both"
              }}
            >
              <div 
                className="size-4 rounded-full border-2 bg-background shrink-0 z-10 flex items-center justify-center border-current/35 shadow-sm"
                style={{ color: data.customTextColor || undefined, backgroundColor: data.customBackground || undefined }}
              >
                <div 
                  className="size-2 rounded-full bg-current"
                  style={{ color: data.customTextColor || undefined }}
                ></div>
              </div>

              <a
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-between py-3.5 px-6 text-sm font-bold shadow-md transition-all duration-300 select-none hover:-translate-y-0.5 active:scale-[0.98] ${data.customButtonBg ? "" : currentTheme.cardStyle} ${currentButtonShape.class}`}
                style={{
                  backgroundColor: data.customButtonBg || undefined,
                  color: data.customButtonText || undefined,
                  borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined
                }}
              >
                <span 
                  className="flex items-center size-4.5 shrink-0"
                  style={{ color: data.customButtonText || undefined }}
                >
                  {getLinkIcon(link.icon)}
                </span>
                <span 
                  className={`truncate flex-1 text-center ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                  style={{ color: data.customButtonText || undefined }}
                >
                  {link.title || "Untitled Link"}
                </span>
                <ExternalLink 
                  className={`size-4 opacity-50 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                  style={{ color: data.customButtonText || undefined }}
                />
              </a>
            </div>
          ))}
        </div>
      );
    }

    if (layout === "detailed-feed") {
      return (
        <div className="w-full flex flex-col gap-4">
          {visibleLinks.map((link, idx) => {
            let displayUrl = link.url;
            try {
              const cleanUrl = link.url.startsWith("http") ? link.url : `https://${link.url}`;
              displayUrl = new URL(cleanUrl).hostname;
            } catch (e) {}

            return (
              <a
                key={link.id}
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  animationDelay: `${idx * 80}ms`,
                  animationFillMode: "both",
                  backgroundColor: data.customButtonBg || undefined,
                  color: data.customButtonText || undefined,
                  borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined,
                }}
                className={`w-full flex items-center gap-4 py-4 px-6 text-sm font-semibold shadow-md transition-all duration-300 select-none border animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${data.customButtonBg ? "" : currentTheme.cardStyle} ${currentButtonShape.class}`}
              >
                <div 
                  className="size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-current/10"
                  style={{ color: data.customButtonText || undefined }}
                >
                  {getLinkIcon(link.icon) || <Globe className="size-5" />}
                </div>
                
                <div className="flex-grow min-w-0 text-left space-y-0.5">
                  <span 
                    className={`truncate block font-bold leading-normal ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                    style={{ color: data.customButtonText || undefined }}
                  >
                    {link.title || "Untitled Link"}
                  </span>
                  <span className="truncate block text-[10px] text-zinc-400 font-mono opacity-80 leading-none">
                    {displayUrl}
                  </span>
                </div>
                
                <ExternalLink 
                  className={`size-4 opacity-50 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                  style={{ color: data.customButtonText || undefined }}
                />
              </a>
            );
          })}
        </div>
      );
    }

    // Default "classic" stack
    return (
      <div className="w-full flex flex-col gap-3">
        {visibleLinks.map((link, idx) => (
          <a
            key={link.id}
            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              animationDelay: `${idx * 80}ms`,
              animationFillMode: "both",
              backgroundColor: data.customButtonBg || undefined,
              color: data.customButtonText || undefined,
              borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined,
            }}
            className={`w-full flex items-center justify-between py-3.5 px-6 text-sm font-bold shadow-md transition-all duration-300 select-none hover:-translate-y-0.5 active:scale-[0.98] animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${data.customButtonBg ? "" : currentTheme.cardStyle} ${currentButtonShape.class}`}
          >
            <span 
              className="flex items-center size-4.5 shrink-0"
              style={{ color: data.customButtonText || undefined }}
            >
              {getLinkIcon(link.icon)}
            </span>
            <span 
              className={`truncate flex-1 text-center tracking-wide ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
              style={{ color: data.customButtonText || undefined }}
            >
              {link.title || "Untitled Link"}
            </span>
            <ExternalLink 
              className={`size-4 opacity-50 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
              style={{ color: data.customButtonText || undefined }}
            />
          </a>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center py-16 px-4 relative overflow-hidden select-none transition-all duration-500 ${data.customBackground ? "" : currentTheme.background} ${currentFont.class}`}
      style={{
        backgroundColor: data.customBackground || undefined,
        color: data.customTextColor || undefined,
      }}
    >
      
      {/* Decorative Blur Blobs for custom gradients */}
      {!data.customBackground && data.themeId === "glassmorphism" && (
        <>
          <div className="absolute top-1/4 -left-32 size-80 rounded-full bg-indigo-500/20 blur-[90px] -z-10 animate-pulse"></div>
          <div className="absolute bottom-1/3 -right-32 size-80 rounded-full bg-pink-500/15 blur-[90px] -z-10"></div>
        </>
      )}
      {!data.customBackground && data.themeId === "ios-26-glass" && (
        <>
          <div className="absolute -top-12 -right-12 size-72 rounded-full bg-rose-500/25 blur-[80px] -z-10 animate-pulse duration-[8000ms]"></div>
          <div className="absolute top-1/2 -left-24 size-80 rounded-full bg-indigo-650/20 blur-[90px] -z-10"></div>
          <div className="absolute -bottom-16 right-10 size-64 rounded-full bg-cyan-500/20 blur-[75px] -z-10 animate-pulse duration-[6000ms]"></div>
        </>
      )}



      {/* Main Profile container */}
      <main className="w-full max-w-md flex flex-col items-center flex-1">
        {/* Profile Details */}
        <div className="flex flex-col items-center text-center mb-6">
          {data.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.avatarUrl}
              alt={data.displayName}
              className="size-24 rounded-full object-cover border-4 border-white/10 shadow-lg mb-4 hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${data.displayName}`;
              }}
            />
          ) : (
            <div className="size-24 rounded-full bg-zinc-800 flex items-center justify-center border-4 border-white/10 text-white font-bold text-3xl mb-4 hover:scale-105 transition-transform shadow-lg">
              {data.displayName ? data.displayName.charAt(0) : "U"}
            </div>
          )}

          <h1 className="text-xl font-bold tracking-tight">
            {data.displayName}
          </h1>
          <p 
            className={`text-sm font-semibold opacity-90 mt-0.5 tracking-wide ${data.customTextColor ? "" : currentTheme.textClass}`}
            style={{ color: data.customTextColor || undefined }}
          >
            @{data.username}
          </p>
          <p 
            key={data.bio + "-" + bioAnimId}
            className={`text-sm mt-3.5 max-w-sm px-4 leading-relaxed font-normal opacity-85 ${bioAnimationClass} ${data.customTextColor ? "" : currentTheme.subtextClass}`}
            style={{ color: data.customTextColor ? `${data.customTextColor}d0` : undefined }}
          >
            {typedBio}
            {bioAnimId === "typewriter" && typedBio.length < (data.bio || "").length && (
              <span className="animate-pulse ml-0.5 font-mono">|</span>
            )}
          </p>
        </div>

        {/* Social Row */}
        {Object.entries(data.socials).some(([key, val]) => val && !data.hiddenSocials?.includes(key)) && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(data.socials).map(([key, value]) => {
              if (!value || data.hiddenSocials?.includes(key)) return null;
              return (
                <a
                  key={key}
                  href={getSocialUrl(key, value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm border ${
                    data.customButtonBg 
                      ? "" 
                      : data.themeId === "ios-26-glass"
                      ? "btn-ios-glass text-white"
                      : data.themeId === "minimal-light"
                      ? "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50"
                      : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                  }`}
                  style={{
                    backgroundColor: data.customButtonBg || undefined,
                    color: data.customButtonText || undefined,
                    borderColor: data.customButtonText ? `${data.customButtonText}30` : undefined,
                  }}
                  aria-label={key}
                >
                  {getSocialIcon(key)}
                </a>
              );
            })}
          </div>
        )}

        {/* Links Stack with dynamic layout style */}
        <div className="w-full px-1 mb-12">
          {renderLinks()}
        </div>
      </main>

      {/* Floating brand footer */}
      <footer className="mt-auto pt-6 text-[11px] font-medium tracking-wide flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
        <Link 
          href="/register" 
          className={`flex items-center gap-1.5 px-4.5 py-2 rounded-full border shadow-sm transition-all active:scale-95 ${
            data.customButtonBg 
              ? "" 
              : data.themeId === "ios-26-glass"
              ? "btn-ios-glass text-white"
              : data.themeId === "minimal-light"
              ? "bg-zinc-950 text-white hover:bg-zinc-800"
              : "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50"
          }`}
          style={{
            backgroundColor: data.customButtonBg || undefined,
            color: data.customButtonText || undefined,
            borderColor: data.customButtonText ? `${data.customButtonText}30` : undefined,
          }}
        >
          <Layers className="size-3.5 fill-current" />
          <span>Create your own FreeCard</span>
        </Link>
        <span 
          className={`flex items-center gap-1 font-semibold ${data.customTextColor ? "" : currentTheme.subtextClass}`}
          style={{ color: data.customTextColor ? `${data.customTextColor}c0` : undefined }}
        >
          Made with <Heart className="size-3 text-rose-500 fill-rose-500" /> FreeCard
        </span>
      </footer>

    </div>
  );
}
