import type { SVGProps } from "react";

export type IconName =
  | "apple" | "arrow-left" | "arrow-right" | "arrow-up-right" | "bell" | "bookmark"
  | "calendar" | "check" | "check-circle" | "chevron-down" | "chevron-right" | "clock"
  | "compass" | "edit" | "eye" | "eye-off" | "globe" | "heart" | "home" | "info"
  | "lock" | "logout" | "mail" | "map" | "map-pin" | "menu" | "message" | "more"
  | "navigation" | "plus" | "search" | "settings" | "sparkle" | "sliders" | "star" | "sun"
  | "user-plus" | "users" | "wallet" | "wand" | "x" | "google"
  | "image" | "folder" | "external-link";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
    ...props,
  };

  switch (name) {
    case "apple": return <svg {...common}><path d="M16.7 12.7c0-2.1 1.7-3.1 1.8-3.2-1-.1-2.1-.9-2.5-.9-1-.1-2 .6-2.5.6-.5 0-1.3-.6-2.1-.6-1.1 0-2.2.7-2.8 1.7-1.2 2-.3 5 .8 6.6.6.8 1.2 1.7 2.1 1.7.8 0 1.1-.5 2.1-.5s1.3.5 2.1.5 1.4-.8 2-1.6c.7-.9 1-1.8 1-1.9-.1 0-2-.8-2-2.4ZM15.1 8.5c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.1-.5.5-.9 1.4-.8 2.3.9.1 1.7-.4 2.2-1Z" fill="currentColor" stroke="none" /></svg>;
    case "arrow-left": return <svg {...common}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>;
    case "arrow-right": return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case "arrow-up-right": return <svg {...common}><path d="M7 17 17 7M7 7h10v10" /></svg>;
    case "bell": return <svg {...common}><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></svg>;
    case "bookmark": return <svg {...common}><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3-6 3V4.5Z" /></svg>;
    case "calendar": return <svg {...common}><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M16 3v4M8 3v4M3.5 10h17" /></svg>;
    case "check": return <svg {...common}><path d="m5 12 4.5 4.5L19 7" /></svg>;
    case "check-circle": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
    case "chevron-down": return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>;
    case "chevron-right": return <svg {...common}><path d="m9 6 6 6-6 6" /></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></svg>;
    case "compass": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" /></svg>;
    case "edit": return <svg {...common}><path d="m4 16.5-.8 3.8 3.8-.8L18.7 7.8a2 2 0 0 0-2.8-2.8L4 16.5Z" /><path d="m14.5 6.5 3 3" /></svg>;
    case "eye": return <svg {...common}><path d="M2.8 12s3.3-5 9.2-5 9.2 5 9.2 5-3.3 5-9.2 5-9.2-5-9.2-5Z" /><circle cx="12" cy="12" r="2" /></svg>;
    case "eye-off": return <svg {...common}><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.7 5.3A10.5 10.5 0 0 1 12 5c5.9 0 9.2 7 9.2 7a16.8 16.8 0 0 1-3 3.7M6.2 6.2C3.9 7.6 2.8 12 2.8 12s3.3 7 9.2 7c1.2 0 2.3-.2 3.3-.6" /></svg>;
    case "globe": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3.5 12h17M12 3c2.2 2.4 3.2 5.4 3.2 9s-1 6.6-3.2 9c-2.2-2.4-3.2-9-3.2-9S9.8 5.4 12 3Z" /></svg>;
    case "heart": return <svg {...common}><path d="M20.4 8.8c0 5-8.4 10-8.4 10s-8.4-5-8.4-10A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.4 2.7Z" /></svg>;
    case "home": return <svg {...common}><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9Z" /><path d="M9 20v-6h6v6" /></svg>;
    case "info": return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>;
    case "lock": return <svg {...common}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
    case "logout": return <svg {...common}><path d="M10 5H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h5M14 16l4-4-4-4M18 12H9" /></svg>;
    case "mail": return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
    case "map": return <svg {...common}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></svg>;
    case "map-pin": return <svg {...common}><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></svg>;
    case "menu": return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "message": return <svg {...common}><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.5-.8L4 20l1.6-3.5A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" /></svg>;
    case "more": return <svg {...common}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></svg>;
    case "navigation": return <svg {...common}><path d="m21 3-7.5 18-2.3-7.2L4 11.5 21 3Z" /></svg>;
    case "plus": return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case "search": return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
    case "settings": return <svg {...common}><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" /><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .9v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.9l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.9-3h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 .9-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.9v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3 .9l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .9 3h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-.9 3Z" /></svg>;
    case "sparkle": return <svg {...common}><path d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3ZM19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" /></svg>;
    case "sliders": return <svg {...common}><path d="M4 7h8M16 7h4M4 17h4M12 17h8" /><circle cx="14" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>;
    case "star": return <svg {...common}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>;
    case "sun": return <svg {...common}><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
    case "user-plus": return <svg {...common}><path d="M15 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-4A3.5 3.5 0 0 0 4 18.5V20M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 8v6M16 11h6" /></svg>;
    case "users": return <svg {...common}><path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 4.5a3.5 3.5 0 0 1 0 6.8M16 15h1.5a3.5 3.5 0 0 1 3.5 3.5V20" /></svg>;
    case "wallet": return <svg {...common}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" /><path d="M4 8h14M16 14h.01" /></svg>;
    case "wand": return <svg {...common}><path d="m15 4 5 5M13 6l5 5M4 20l9.8-9.8" /><path d="M5 4v4M3 6h4M19 16v4M17 18h4" /></svg>;
    case "x": return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
    case "google": return <svg {...common}><path d="M21 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7.1Z" fill="currentColor" stroke="none" /><path d="M12 21c2.6 0 4.8-.9 6.3-2.5l-3.1-2.4c-.9.6-1.9.9-3.2.9-2.5 0-4.6-1.7-5.4-4H3.4v2.5A9.5 9.5 0 0 0 12 21Z" fill="currentColor" stroke="none" opacity=".75" /><path d="M6.6 13a5.7 5.7 0 0 1 0-3.6V6.9H3.4a9.5 9.5 0 0 0 0 8.6L6.6 13Z" fill="currentColor" stroke="none" opacity=".55" /><path d="M12 5.4c1.4 0 2.7.5 3.7 1.5l2.8-2.8C16.8 2.5 14.6 1.5 12 1.5a9.5 9.5 0 0 0-8.6 5.4L6.6 9.4c.8-2.4 2.9-4 5.4-4Z" fill="currentColor" stroke="none" opacity=".9" /></svg>;
    case "image": return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
    case "folder": return <svg {...common}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
    case "external-link": return <svg {...common}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>;
    default: return null;
  }
}

