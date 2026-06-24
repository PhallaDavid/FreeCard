export interface ThemePreset {
  id: string;
  name: string;
  background: string;
  cardStyle: string;
  textClass: string;
  subtextClass: string;
  buttonTextClass: string;
  previewBg: string; // For the dashboard preset selector preview
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "minimal-light",
    name: "Minimalist Light",
    background: "bg-zinc-50 text-zinc-950",
    cardStyle: "bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 active:scale-[0.98]",
    textClass: "text-zinc-900",
    subtextClass: "text-zinc-500",
    buttonTextClass: "text-zinc-900",
    previewBg: "bg-zinc-100 border border-zinc-200",
  },
  {
    id: "sleek-dark",
    name: "Sleek Dark",
    background: "bg-zinc-950 text-zinc-50",
    cardStyle: "bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 active:scale-[0.98]",
    textClass: "text-zinc-50",
    subtextClass: "text-zinc-400",
    buttonTextClass: "text-zinc-50",
    previewBg: "bg-zinc-900 border border-zinc-800",
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    background: "bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white",
    cardStyle: "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 active:scale-[0.98]",
    textClass: "text-white",
    subtextClass: "text-indigo-200",
    buttonTextClass: "text-white",
    previewBg: "bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 border border-indigo-950",
  },
  {
    id: "ios-26-glass",
    name: "iOS 26 Frosted Glass",
    background: "bg-ios-glass text-white",
    cardStyle: "btn-ios-glass",
    textClass: "text-white",
    subtextClass: "text-zinc-300",
    buttonTextClass: "text-white",
    previewBg: "bg-ios-glass border border-white/10",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    background: "bg-gradient-to-br from-orange-450 via-rose-500 to-amber-500 text-white",
    cardStyle: "bg-white text-zinc-900 shadow-lg hover:bg-zinc-50 active:scale-[0.98]",
    textClass: "text-white",
    subtextClass: "text-orange-100",
    buttonTextClass: "text-zinc-900",
    previewBg: "bg-gradient-to-br from-orange-400 via-rose-450 to-amber-400 border border-orange-500/30",
  },
  {
    id: "aurora",
    name: "Aurora Borealis",
    background: "bg-gradient-to-tr from-teal-900 via-emerald-950 to-indigo-950 text-emerald-50",
    cardStyle: "bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/20 active:scale-[0.98]",
    textClass: "text-emerald-50",
    subtextClass: "text-emerald-300",
    buttonTextClass: "text-emerald-100",
    previewBg: "bg-gradient-to-tr from-teal-900 via-emerald-950 to-indigo-950 border border-emerald-950",
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    background: "bg-slate-950 text-fuchsia-400",
    cardStyle: "bg-black border-2 border-fuchsia-500 text-cyan-400 shadow-[0_0_8px_rgba(240,46,170,0.3)] hover:shadow-[0_0_12px_rgba(240,46,170,0.5)] active:scale-[0.98]",
    textClass: "text-fuchsia-500",
    subtextClass: "text-cyan-400 font-mono",
    buttonTextClass: "text-cyan-400 font-medium",
    previewBg: "bg-slate-950 border border-fuchsia-500/40",
  },
  {
    id: "midnight-forest",
    name: "Midnight Forest",
    background: "bg-gradient-to-br from-emerald-955 via-slate-950 to-stone-950 text-emerald-50",
    cardStyle: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 hover:bg-emerald-500/25 active:scale-[0.98]",
    textClass: "text-emerald-100",
    subtextClass: "text-emerald-400",
    buttonTextClass: "text-emerald-200",
    previewBg: "bg-gradient-to-br from-emerald-900 via-slate-950 to-stone-950 border border-emerald-900/40",
  },
  {
    id: "rosewater",
    name: "Rosewater Lavender",
    background: "bg-gradient-to-tr from-rose-100 via-purple-50 to-indigo-150 text-rose-950",
    cardStyle: "bg-white/80 border border-rose-200/50 shadow-md hover:bg-rose-50/50 text-rose-950 active:scale-[0.98]",
    textClass: "text-rose-950",
    subtextClass: "text-rose-600/80",
    buttonTextClass: "text-rose-950",
    previewBg: "bg-gradient-to-tr from-rose-100 via-purple-50 to-indigo-150 border border-rose-250/30",
  },
  {
    id: "monochrome-dark",
    name: "Stark Monochrome",
    background: "bg-zinc-950 text-white",
    cardStyle: "bg-white text-zinc-950 border border-white hover:bg-zinc-100 active:scale-[0.98]",
    textClass: "text-white",
    subtextClass: "text-zinc-400",
    buttonTextClass: "text-zinc-955 font-bold",
    previewBg: "bg-zinc-900 border border-zinc-50/10 shadow-sm",
  },
  {
    id: "neon-amethyst",
    name: "Neon Amethyst",
    background: "bg-gradient-to-br from-slate-955 via-purple-955 to-slate-950 text-purple-300",
    cardStyle: "bg-black border border-purple-500 text-purple-400 hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] active:scale-[0.98]",
    textClass: "text-purple-300",
    subtextClass: "text-purple-400/80",
    buttonTextClass: "text-purple-400",
    previewBg: "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 border border-purple-800/40",
  },
  {
    id: "animated-sunset",
    name: "Animated Sunset",
    background: "bg-animated-gradient text-white",
    cardStyle: "bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 active:scale-[0.98]",
    textClass: "text-white",
    subtextClass: "text-rose-100",
    buttonTextClass: "text-white",
    previewBg: "bg-animated-gradient border border-rose-500/20",
  },
  {
    id: "animated-cosmic",
    name: "Animated Cosmic",
    background: "bg-animated-cosmic text-indigo-200",
    cardStyle: "bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 active:scale-[0.98]",
    textClass: "text-indigo-100",
    subtextClass: "text-indigo-300/70",
    buttonTextClass: "text-indigo-100",
    previewBg: "bg-animated-cosmic border border-indigo-950/20",
  },
  {
    id: "animated-ocean",
    name: "Animated Ocean",
    background: "bg-animated-ocean text-cyan-50",
    cardStyle: "bg-white/20 backdrop-blur-sm border border-white/10 hover:bg-white/30 active:scale-[0.98]",
    textClass: "text-white",
    subtextClass: "text-cyan-200",
    buttonTextClass: "text-white",
    previewBg: "bg-animated-ocean border border-cyan-800/20",
  },
  {
    id: "animated-cyber",
    name: "Animated Cyberpulse",
    background: "bg-animated-fire text-orange-300",
    cardStyle: "bg-black/60 border border-orange-500/40 text-orange-400 hover:shadow-[0_0_12px_rgba(249,115,22,0.2)] active:scale-[0.98]",
    textClass: "text-orange-200",
    subtextClass: "text-orange-400/80 font-mono",
    buttonTextClass: "text-orange-400",
    previewBg: "bg-animated-fire border border-orange-800/20",
  }
];

export interface FontPreset {
  id: string;
  name: string;
  class: string;
}

export const FONT_PRESETS: FontPreset[] = [
  { id: "font-sans", name: "Modern Sans (Inter)", class: "font-sans" },
  { id: "font-serif", name: "Classic Serif (Playfair)", class: "font-serif" },
  { id: "font-mono", name: "Retro Monospace (JetBrains)", class: "font-mono" },
  { id: "font-kantumruy", name: "Kantumruy Pro", class: "font-kantumruy" },
];

export interface ButtonShape {
  id: string;
  name: string;
  class: string;
}

export const BUTTON_SHAPES: ButtonShape[] = [
  { id: "rounded-lg", name: "Soft Rounded", class: "rounded-lg" },
  { id: "rounded-full", name: "Capsule (Full)", class: "rounded-full" },
  { id: "rounded-none", name: "Sharp Rectangle", class: "rounded-none" },
];

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
}

export const LAYOUT_PRESETS: LayoutPreset[] = [
  { id: "classic", name: "Classic Stack", description: "Standard, clean vertical list aligned to center" },
  { id: "grid", name: "Modern Grid", description: "Saves vertical space with a grid of compact square cards" },
  { id: "featured", name: "Hero Highlight", description: "Highlights your latest release or main project at the top" },
  { id: "minimal-text", name: "Minimal Text List", description: "Elegant text links with line breaks, no card background" },
  { id: "alternate-zigzag", name: "Zig-Zag Stack", description: "Alternating offset cards for a dynamic flow" },
  { id: "timeline", name: "Timeline Stream", description: "A chronological timeline connecting your links" },
  { id: "detailed-feed", name: "Detailed Feed", description: "Taller cards showing titles and description URLs" },
];

export interface PortfolioData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  themeId: string;
  fontId: string;
  buttonShapeId: string;
  layoutId: string; // Dynamic Page Layout
  customBackground?: string;
  customTextColor?: string;
  customButtonBg?: string;
  customButtonText?: string;
  customIconColor?: string;
  hiddenSocials?: string[];
  bioAnimationId?: string;
  socials: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    email?: string;
  };
  links: {
    id: string;
    title: string;
    url: string;
    visible: boolean;
    icon?: string;
  }[];
}

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  username: "johndoe",
  displayName: "John Doe",
  bio: "Full Stack Engineer & Digital Creator 🚀 Designing the future of link interfaces.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop",
  themeId: "glassmorphism",
  fontId: "font-sans",
  buttonShapeId: "rounded-full",
  layoutId: "classic",
  hiddenSocials: [],
  bioAnimationId: "typewriter",
  socials: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    email: "john@example.com",
  },
  links: [
    {
      id: "1",
      title: "My Personal Website",
      url: "https://johndoe.dev",
      visible: true,
      icon: "globe",
    },
    {
      id: "2",
      title: "Read My Latest Blog Posts",
      url: "https://blog.johndoe.dev",
      visible: true,
      icon: "book",
    },
    {
      id: "3",
      title: "Check Out My GitHub Projects",
      url: "https://github.com/johndoe",
      visible: true,
      icon: "github",
    },
    {
      id: "4",
      title: "Buy Me A Coffee",
      url: "https://buymeacoffee.com",
      visible: true,
      icon: "coffee",
    },
  ],
};
