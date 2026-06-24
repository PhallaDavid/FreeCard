"use client";

import React, { useState, useEffect } from "react";
import { THEME_PRESETS, FONT_PRESETS, BUTTON_SHAPES, type PortfolioData } from "@/lib/theme-presets";
import { 
  ExternalLink,
  Globe,
  BookOpen,
  Briefcase,
  Play,
  Heart,
  Coffee,
  Layers
} from "lucide-react";
import {
  GithubIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  MailIcon,
  YoutubeIcon
} from "@/components/social-icons";

interface PreviewPhoneProps {
  data: PortfolioData;
  device?: "mobile" | "tablet" | "desktop" | "iphone" | "pixel" | "watch" | "ipad" | "macbook";
}

export function PreviewPhone({ data, device = "iphone" }: PreviewPhoneProps) {
  const [typedBio, setTypedBio] = useState("");

  useEffect(() => {
    const animId = data.bioAnimationId || "typewriter";
    if (animId !== "typewriter" || !data.bio) {
      setTypedBio(data.bio || "");
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
  }, [data.bio, data.bioAnimationId]);

  const currentTheme = THEME_PRESETS.find((t) => t.id === data.themeId) || THEME_PRESETS[0];
  const currentFont = FONT_PRESETS.find((f) => f.id === data.fontId) || FONT_PRESETS[0];
  const currentButtonShape = BUTTON_SHAPES.find((s) => s.id === data.buttonShapeId) || BUTTON_SHAPES[0];

  // Device type categorizations
  const isWatch = device === "watch";
  const isDesktop = device === "desktop" || device === "macbook";
  const isTablet = device === "tablet" || device === "ipad";
  const isPhone = !isWatch && !isDesktop && !isTablet;

  // Scaling factors for different devices
  const avatarClass = isWatch 
    ? "size-10 border shadow-sm mb-1.5" 
    : isPhone 
    ? "size-16 border-2 shadow-md mb-2.5" 
    : "size-20 border-2 shadow-md mb-3";

  const nameClass = isWatch 
    ? "text-[9px] font-bold" 
    : isPhone 
    ? "text-sm font-bold" 
    : "text-base font-bold";

  const bioClass = isWatch 
    ? "text-[7px] max-w-[130px] mt-0.5 line-clamp-2 opacity-85 leading-tight" 
    : isPhone 
    ? "text-xs max-w-[210px] mt-1 line-clamp-2 leading-relaxed opacity-90" 
    : "text-xs max-w-[240px] mt-1.5 line-clamp-2 leading-relaxed opacity-90";

  const socialsGapClass = isWatch 
    ? "gap-1.5 mb-3 w-full" 
    : isPhone 
    ? "gap-3 mb-4.5 w-full" 
    : "gap-3.5 mb-5 w-full";

  const socialIconClass = isWatch 
    ? "p-1 rounded-full border text-[8px] size-5 flex items-center justify-center" 
    : isPhone 
    ? "p-1.5 rounded-full border text-xs size-7 flex items-center justify-center" 
    : "p-2 rounded-full border text-sm size-8 flex items-center justify-center";

  const socialSvgClass = isWatch ? "size-2.5" : "size-3.5";
  const linkIconClass = isWatch ? "size-3" : "size-3.5";

  const getSocialIcon = (key: string) => {
    switch (key) {
      case "github":
        return <GithubIcon className={socialSvgClass} />;
      case "twitter":
        return <TwitterIcon className={socialSvgClass} />;
      case "linkedin":
        return <LinkedinIcon className={socialSvgClass} />;
      case "instagram":
        return <InstagramIcon className={socialSvgClass} />;
      case "email":
        return <MailIcon className={socialSvgClass} />;
      default:
        return <Globe className={socialSvgClass} />;
    }
  };

  const getLinkIcon = (iconName?: string) => {
    switch (iconName) {
      case "globe":
        return <Globe className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "github":
        return <GithubIcon className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "linkedin":
        return <LinkedinIcon className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "twitter":
        return <TwitterIcon className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "mail":
        return <MailIcon className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "coffee":
        return <Coffee className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "book":
        return <BookOpen className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "youtube":
        return <YoutubeIcon className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "instagram":
        return <InstagramIcon className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "briefcase":
        return <Briefcase className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "play":
        return <Play className={`${linkIconClass} opacity-70 shrink-0`} />;
      case "heart":
        return <Heart className={`${linkIconClass} opacity-70 shrink-0`} />;
      default:
        return null;
    }
  };

  const getSocialUrl = (key: string, val: string) => {
    if (key === "email") {
      return `mailto:${val}`;
    }
    return val.startsWith("http") ? val : `https://${val}`;
  };

  const visibleLinks = data.links.filter((link) => link.visible);

  const renderLinks = () => {
    if (visibleLinks.length === 0) {
      return (
        <div className={`text-center py-6 text-[10px] italic opacity-60 ${currentTheme.subtextClass}`}>
          No links to display
        </div>
      );
    }

    const layout = data.layoutId || "classic";

    if (layout === "grid") {
      return (
        <div className={`w-full grid grid-cols-2 ${isWatch ? "gap-1.5 pb-3" : "gap-2.5 pb-6"}`}>
          {visibleLinks.map((link, idx) => (
            <a
              key={link.id}
              href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center text-center shadow-sm select-none border transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${
                data.customButtonBg ? "" : currentTheme.cardStyle
              } ${currentButtonShape.class} ${
                isWatch ? "p-2 gap-1.5 text-[8px]" : "p-3 gap-2 text-[10px] font-semibold"
              }`}
              style={{
                animationDelay: `${idx * 80}ms`,
                animationFillMode: "both",
                backgroundColor: data.customButtonBg || undefined,
                color: data.customButtonText || undefined,
                borderColor: data.customButtonText ? `${data.customButtonText}30` : undefined,
                aspectRatio: "1/1"
              }}
            >
              <div 
                className={`flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 shrink-0 ${
                  isWatch ? "size-5" : "size-7"
                }`}
                style={{ color: data.customButtonText || undefined }}
              >
                {getLinkIcon(link.icon) || <Globe className={isWatch ? "size-2.5" : "size-3.5"} />}
              </div>
              <span 
                className={`line-clamp-2 w-full text-center px-1 leading-tight ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
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
        <div className={`w-full flex flex-col ${isWatch ? "gap-1.5 pb-3" : "gap-2.5 pb-6"}`}>
          {/* Hero Highlighted Link */}
          <a
            href={firstLink.url.startsWith("http") ? firstLink.url : `https://${firstLink.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] border-2 relative overflow-hidden group/hero animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${
              data.customButtonBg ? "" : currentTheme.cardStyle
            } ${currentButtonShape.class} ${
              isWatch ? "py-2 px-3 text-[9px] font-bold" : "py-4 px-5 text-xs font-bold"
            }`}
            style={{
              animationDelay: "0ms",
              animationFillMode: "both",
              backgroundColor: data.customButtonBg || undefined,
              color: data.customButtonText || undefined,
              borderColor: data.customButtonBg ? (data.customTextColor || undefined) : "var(--color-indigo-500)",
            }}
          >
            {/* Pulsing indicator */}
            <span className="absolute top-1.5 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>

            <span 
              className="flex items-center size-4 shrink-0"
              style={{ color: data.customButtonText || undefined }}
            >
              {getLinkIcon(firstLink.icon) || <Globe className={isWatch ? "size-3" : "size-3.5"} />}
            </span>
            <span 
              className={`truncate flex-1 text-center font-extrabold tracking-wide ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
              style={{ color: data.customButtonText || undefined }}
            >
              {firstLink.title || "Featured Release"}
            </span>
            <ExternalLink 
              className={`size-3 opacity-60 group-hover/hero:opacity-100 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
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
              className={`w-full flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] select-none shadow-sm animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${
                data.customButtonBg ? "" : currentTheme.cardStyle
              } ${currentButtonShape.class} ${
                isWatch ? "py-1.5 px-2 text-[8px]" : "py-2.5 px-4 text-[10px] font-medium"
              }`}
              style={{
                animationDelay: `${(idx + 1) * 80}ms`,
                animationFillMode: "both",
                backgroundColor: data.customButtonBg || undefined,
                color: data.customButtonText || undefined,
                borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined
              }}
            >
              <span 
                className="flex items-center size-3.5 shrink-0"
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
                className={`size-3 opacity-40 hover:opacity-100 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                style={{ color: data.customButtonText || undefined }}
              />
            </a>
          ))}
        </div>
      );
    }

    if (layout === "minimal-text") {
      return (
        <div className={`w-full flex flex-col ${isWatch ? "gap-2.5 pb-3" : "gap-4 pb-6"}`}>
          {visibleLinks.map((link, idx) => (
            <a
              key={link.id}
              href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-between border-b border-current/15 hover:border-current/35 hover:underline transition-all duration-300 leading-normal animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${
                data.customTextColor ? "" : currentTheme.textClass
              } ${isWatch ? "py-1.5 text-[8px]" : "py-2 text-[10px] font-bold"}`}
              style={{
                animationDelay: `${idx * 80}ms`,
                animationFillMode: "both",
                color: data.customTextColor || undefined,
                borderBottomColor: data.customTextColor ? `${data.customTextColor}25` : undefined
              }}
            >
              <span className="flex items-center size-4 shrink-0">
                {getLinkIcon(link.icon) || <Globe className={isWatch ? "size-3" : "size-3.5"} />}
              </span>
              <span className="truncate flex-1 text-center font-extrabold tracking-wide">
                {link.title || "Untitled Link"}
              </span>
              <ExternalLink className="size-3 opacity-30 shrink-0" />
            </a>
          ))}
        </div>
      );
    }

    if (layout === "alternate-zigzag") {
      return (
        <div className={`w-full flex flex-col ${isWatch ? "gap-2 pb-3" : "gap-3 pb-6"}`}>
          {visibleLinks.map((link, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <a
                key={link.id}
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] select-none shadow-sm animate-in fade-in-0 slide-in-from-bottom-3 duration-500 border ${
                  data.customButtonBg ? "" : currentTheme.cardStyle
                } ${currentButtonShape.class} ${isEven ? "flex-row" : "flex-row-reverse"} ${
                  isWatch ? "py-1.5 px-2 text-[8px]" : "py-2.5 px-4 text-[10px] font-medium"
                }`}
                style={{
                  animationDelay: `${idx * 80}ms`,
                  animationFillMode: "both",
                  backgroundColor: data.customButtonBg || undefined,
                  color: data.customButtonText || undefined,
                  borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined,
                  transform: isEven 
                    ? `translateX(${isWatch ? "-1.5px" : "-3px"})` 
                    : `translateX(${isWatch ? "1.5px" : "3px"})`
                }}
              >
                <span 
                  className="flex items-center size-3.5 shrink-0"
                  style={{ color: data.customButtonText || undefined }}
                >
                  {getLinkIcon(link.icon) || <Globe className={isWatch ? "size-3" : "size-3.5"} />}
                </span>
                <span 
                  className={`truncate flex-1 text-center px-2 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                  style={{ color: data.customButtonText || undefined }}
                >
                  {link.title || "Untitled Link"}
                </span>
                <ExternalLink 
                  className={`size-3 opacity-30 hover:opacity-100 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
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
        <div className={`w-full flex flex-col relative ${isWatch ? "gap-3 pb-3 pl-2" : "gap-5 pb-6 pl-3"}`}>
          <div 
            className="absolute top-4 bottom-8 w-0.5 bg-current opacity-15"
            style={{ 
              color: data.customTextColor || undefined,
              left: isWatch ? "12px" : "19px" 
            }}
          ></div>
          
          {visibleLinks.map((link, idx) => (
            <div 
              key={link.id} 
              className="flex items-center gap-3 relative w-full animate-in fade-in-0 slide-in-from-bottom-3 duration-500"
              style={{
                animationDelay: `${idx * 80}ms`,
                animationFillMode: "both"
              }}
            >
              <div 
                className="rounded-full border bg-background shrink-0 z-10 flex items-center justify-center border-current/35 shadow-xs"
                style={{ 
                  color: data.customTextColor || undefined, 
                  backgroundColor: data.customBackground || undefined,
                  width: isWatch ? "8px" : "12px",
                  height: isWatch ? "8px" : "12px"
                }}
              >
                <div 
                  className="rounded-full bg-current"
                  style={{ 
                    color: data.customTextColor || undefined,
                    width: isWatch ? "4px" : "6px",
                    height: isWatch ? "4px" : "6px"
                  }}
                ></div>
              </div>

              <a
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] select-none shadow-sm ${
                  data.customButtonBg ? "" : currentTheme.cardStyle
                } ${currentButtonShape.class} ${
                  isWatch ? "py-1.5 px-2 text-[8px]" : "py-2 px-3 text-[10px] font-medium"
                }`}
                style={{
                  backgroundColor: data.customButtonBg || undefined,
                  color: data.customButtonText || undefined,
                  borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined
                }}
              >
                <span 
                  className="flex items-center size-3.5 shrink-0"
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
                  className={`size-3 opacity-45 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
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
        <div className={`w-full flex flex-col ${isWatch ? "gap-2 pb-3" : "gap-2.5 pb-6"}`}>
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
                className={`w-full flex items-center transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] select-none border animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${
                  data.customButtonBg ? "" : currentTheme.cardStyle
                } ${currentButtonShape.class} ${
                  isWatch ? "py-1.5 px-2 gap-1.5 text-[8px]" : "py-2 px-3 gap-2.5 text-[10px] font-semibold"
                }`}
                style={{
                  animationDelay: `${idx * 80}ms`,
                  animationFillMode: "both",
                  backgroundColor: data.customButtonBg || undefined,
                  color: data.customButtonText || undefined,
                  borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined
                }}
              >
                <div 
                  className="rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 border border-current/10"
                  style={{ 
                    color: data.customButtonText || undefined,
                    width: isWatch ? "18px" : "28px",
                    height: isWatch ? "18px" : "28px"
                  }}
                >
                  {getLinkIcon(link.icon) || <Globe className={isWatch ? "size-2.5" : "size-3.5"} />}
                </div>
                
                <div className="flex-grow min-w-0 text-left">
                  <span 
                    className={`truncate block font-bold leading-normal ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
                    style={{ color: data.customButtonText || undefined }}
                  >
                    {link.title || "Untitled Link"}
                  </span>
                  {!isWatch && (
                    <span className="truncate block text-[8px] text-zinc-400 font-mono opacity-80 leading-none">
                      {displayUrl}
                    </span>
                  )}
                </div>
                
                <ExternalLink 
                  className={`size-3 opacity-40 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
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
      <div className={`w-full flex flex-col ${isWatch ? "gap-2 pb-3" : "gap-2.5 pb-6"}`}>
        {visibleLinks.map((link, idx) => (
          <a
            key={link.id}
            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] select-none shadow-sm animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ${
              data.customButtonBg ? "" : currentTheme.cardStyle
            } ${currentButtonShape.class} ${
              isWatch ? "py-1.5 px-2.5 text-[8px]" : "py-2.5 px-4 text-xs font-medium"
            }`}
            style={{
              animationDelay: `${idx * 80}ms`,
              animationFillMode: "both",
              backgroundColor: data.customButtonBg || undefined,
              color: data.customButtonText || undefined,
              borderColor: data.customButtonText ? `${data.customButtonText}15` : undefined
            }}
          >
            <span 
              className="flex items-center size-3.5 shrink-0"
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
              className={`size-3 opacity-40 hover:opacity-100 shrink-0 ${data.customButtonText ? "" : currentTheme.buttonTextClass}`}
              style={{ color: data.customButtonText || undefined }}
            />
          </a>
        ))}
      </div>
    );
  };

  // Define device styles
  let deviceContainerStyle = "";
  let notchMarkup = null;
  let bottomIndicatorMarkup = null;
  let browserBarMarkup = null;
  let laptopKeyboardMarkup = null;
  let screenPaddingStyle = "";

  if (device === "watch") {
    deviceContainerStyle = "w-[220px] h-[270px] rounded-[40px] p-2 border-[9px] border-zinc-900 ring-2 ring-zinc-800 bg-zinc-950 shadow-2xl relative";
    screenPaddingStyle = "rounded-[30px] py-4 px-3";
    notchMarkup = (
      <div className="w-full flex justify-center text-[7px] opacity-70 absolute top-1 font-mono left-0 right-0 pointer-events-none select-none z-30">
        <span>09:41</span>
      </div>
    );
  } else if (device === "tablet" || device === "ipad") {
    deviceContainerStyle = "w-[360px] h-[480px] rounded-[30px] p-3.5 shadow-2xl border-[10px] border-zinc-850 ring-2 ring-zinc-750/50 bg-zinc-950 relative";
    screenPaddingStyle = "rounded-[20px] py-9 px-6";
    notchMarkup = (
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 size-1.5 bg-zinc-900 rounded-full z-30"></div>
    );
    bottomIndicatorMarkup = (
      <div className="w-24 h-1 bg-zinc-450/20 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20"></div>
    );
  } else if (device === "desktop" || device === "macbook") {
    deviceContainerStyle = "w-[440px] h-[270px] rounded-t-2xl p-0.5 shadow-2xl border-[8px] border-zinc-900 ring-1 ring-zinc-800 bg-zinc-950 relative";
    screenPaddingStyle = "rounded-none py-6 px-6";
    notchMarkup = (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-zinc-900 rounded-b-md z-30 flex items-center justify-center">
        <div className="size-1 bg-zinc-950 rounded-full"></div>
      </div>
    );
    browserBarMarkup = (
      <div className="w-full h-7 bg-zinc-900 border-b border-zinc-850 flex items-center px-3 gap-1 shrink-0 z-20">
        <div className="size-1.5 rounded-full bg-rose-500"></div>
        <div className="size-1.5 rounded-full bg-amber-500"></div>
        <div className="size-1.5 rounded-full bg-emerald-500"></div>
        <div className="flex-grow max-w-[200px] h-3.5 bg-zinc-800/60 rounded-md mx-auto text-[8px] text-zinc-400 flex items-center justify-center font-mono truncate px-2">
          freecard.co/{data.username || "johndoe"}
        </div>
      </div>
    );
    laptopKeyboardMarkup = (
      <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-[462px] h-3.5 bg-zinc-800 rounded-b-xl border-t border-zinc-700/50 shadow-lg z-20 flex justify-center">
        <div className="w-16 h-1 bg-zinc-900 rounded-b-md"></div>
      </div>
    );
  } else if (device === "pixel") {
    deviceContainerStyle = "w-[280px] h-[570px] rounded-[36px] p-3 shadow-2xl border-[7px] border-zinc-800 ring-1 ring-zinc-750 bg-zinc-950 relative";
    screenPaddingStyle = "rounded-[28px] py-8 px-4";
    notchMarkup = (
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 size-2 bg-zinc-900 rounded-full border border-zinc-850 z-30"></div>
    );
    bottomIndicatorMarkup = (
      <div className="w-16 h-0.5 bg-zinc-450/30 rounded-full absolute bottom-2 left-1/2 -translate-x-1/2 z-20"></div>
    );
  } else {
    // iphone or default mobile
    deviceContainerStyle = "w-[280px] h-[570px] rounded-[46px] p-3.5 shadow-2xl border-[8px] border-zinc-900 ring-2 ring-zinc-800/50 bg-zinc-950 relative";
    screenPaddingStyle = "rounded-[34px] py-9 px-4";
    notchMarkup = (
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-30 flex items-center justify-center gap-1.5 px-3">
        <div className="w-6 h-0.5 bg-zinc-900 rounded-full"></div>
        <div className="size-1.5 bg-zinc-900 rounded-full"></div>
      </div>
    );
    bottomIndicatorMarkup = (
      <div className="w-20 h-1 bg-zinc-400/30 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20"></div>
    );
  }

  // Animation classes for bio paragraph based on bioAnimationId
  const bioAnimId = data.bioAnimationId || "typewriter";
  let bioAnimationClass = "";
  if (bioAnimId === "fade") {
    bioAnimationClass = "animate-bio-fade";
  } else if (bioAnimId === "slide") {
    bioAnimationClass = "animate-bio-slide";
  } else if (bioAnimId === "pulse") {
    bioAnimationClass = "animate-bio-pulse";
  }

  return (
    <div className={deviceContainerStyle}>
      {/* Device notch/indicators */}
      {notchMarkup}

      {/* Browser address bar if laptop/desktop */}
      {browserBarMarkup}

      {/* Screen area */}
      <div 
        className={`w-full h-full overflow-y-auto overflow-x-hidden ${
          data.customBackground ? "" : currentTheme.background
        } ${currentFont.class} flex flex-col items-center relative transition-all duration-350 scrollbar-none z-10 ${screenPaddingStyle}`}
        style={{
          backgroundColor: data.customBackground || undefined,
          color: data.customTextColor || undefined
        }}
      >
        {/* Decorative Blur Blobs for custom gradients (glassmorphism theme) */}
        {!data.customBackground && data.themeId === "glassmorphism" && (
          <>
            <div className="absolute top-1/4 -left-12 size-24 rounded-full bg-indigo-500/20 blur-[28px] -z-10 animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-1/3 -right-12 size-24 rounded-full bg-pink-500/15 blur-[28px] -z-10 pointer-events-none"></div>
          </>
        )}
        {!data.customBackground && data.themeId === "ios-26-glass" && (
          <>
            <div className="absolute top-[10%] -right-8 size-32 rounded-full bg-rose-500/25 blur-[32px] -z-10 animate-pulse duration-[8000ms] pointer-events-none"></div>
            <div className="absolute top-[45%] -left-10 size-36 rounded-full bg-indigo-600/20 blur-[36px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[10%] right-4 size-28 rounded-full bg-cyan-500/20 blur-[28px] -z-10 animate-pulse duration-[6000ms] pointer-events-none"></div>
          </>
        )}



        {/* Status Bar Mock (only for mobile/tablet) */}
        {!isWatch && !isDesktop && (
          <div className="w-full flex justify-between px-6 text-[9px] opacity-60 absolute top-2 font-mono left-0 right-0 pointer-events-none select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <div className="w-3.5 h-2 border border-current rounded-xs p-0.5 flex items-center animate-pulse">
                <div className="w-full h-full bg-current rounded-3xs"></div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div className="flex flex-col items-center mt-4 mb-5 text-center w-full">
          {data.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.avatarUrl}
              alt={data.displayName}
              className={`rounded-full object-cover border-white/20 shadow-md ${avatarClass}`}
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${data.displayName}`;
              }}
            />
          ) : (
            <div className={`rounded-full bg-zinc-800 flex items-center justify-center border border-white/20 text-white font-bold ${avatarClass} ${isWatch ? "text-sm" : "text-base"}`}>
              {data.displayName ? data.displayName.charAt(0) : "U"}
            </div>
          )}
          
          <h2 
            className={`leading-tight ${nameClass} ${data.customTextColor ? "" : currentTheme.textClass}`}
            style={{ color: data.customTextColor || undefined }}
          >
            @{data.username || "username"}
          </h2>
          <p 
            key={data.bio + "-" + bioAnimId}
            className={`${bioClass} ${bioAnimationClass} ${data.customTextColor ? "" : currentTheme.subtextClass}`}
            style={{ color: data.customTextColor ? `${data.customTextColor}d0` : undefined }}
          >
            {typedBio}
            {bioAnimId === "typewriter" && typedBio.length < (data.bio || "").length && (
              <span className="animate-pulse ml-0.5 font-mono">|</span>
            )}
          </p>
        </div>

        {/* Social Icons row */}
        {Object.entries(data.socials).some(([key, val]) => val && !data.hiddenSocials?.includes(key)) && (
          <div className={`flex flex-wrap justify-center ${socialsGapClass}`}>
            {Object.entries(data.socials).map(([key, value]) => {
              if (!value || data.hiddenSocials?.includes(key)) return null;
              return (
                <div
                  key={key}
                  className={`${socialIconClass} ${
                    data.customButtonBg 
                      ? "" 
                      : currentTheme.id === "ios-26-glass"
                      ? "btn-ios-glass text-white"
                      : currentTheme.id === "minimal-light" 
                      ? "bg-zinc-100 text-zinc-900 border border-zinc-200" 
                      : "bg-white/10 text-white border border-white/10"
                  }`}
                  style={{
                    backgroundColor: data.customButtonBg || undefined,
                    color: data.customButtonText || undefined,
                    borderColor: data.customButtonText ? `${data.customButtonText}30` : undefined
                  }}
                >
                  {getSocialIcon(key)}
                </div>
              );
            })}
          </div>
        )}

        {/* Links list */}
        <div className="w-full pb-6 overflow-x-hidden scrollbar-none">
          {renderLinks()}
        </div>

        {/* Floating brand footer */}
        {!isWatch && (
          <div className="mt-auto pt-5 pb-2 text-[9px] font-medium tracking-wide flex flex-col items-center gap-1 opacity-70 w-full shrink-0 scale-90 origin-bottom">
            <div 
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm ${
                data.customButtonBg 
                  ? "" 
                  : data.themeId === "minimal-light"
                  ? "bg-zinc-950 text-white"
                  : "bg-white text-zinc-900 border border-zinc-200"
              }`}
              style={{
                backgroundColor: data.customButtonBg || undefined,
                color: data.customButtonText || undefined,
                borderColor: data.customButtonText ? `${data.customButtonText}30` : undefined,
              }}
            >
              <Layers className="size-3 fill-current" />
              <span>Create your own FreeCard</span>
            </div>
            <span 
              className={`flex items-center gap-1 font-semibold ${data.customTextColor ? "" : currentTheme.subtextClass}`}
              style={{ color: data.customTextColor ? `${data.customTextColor}c0` : undefined }}
            >
              Made with <Heart className="size-2.5 text-rose-500 fill-rose-500" /> FreeCard
            </span>
          </div>
        )}
      </div>

      {/* Screen bottom indicators (Home Swipe bar) */}
      {bottomIndicatorMarkup}

      {/* Laptop Keyboard deck hinge (only for macbook/desktop) */}
      {laptopKeyboardMarkup}
    </div>
  );
}
