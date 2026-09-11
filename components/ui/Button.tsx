import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "soft";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-pine text-white shadow-sm hover:bg-pine-dark focus-visible:ring-pine/30",
  secondary: "bg-coral text-white shadow-sm hover:bg-[#c66a50] focus-visible:ring-coral/30",
  outline: "border border-line bg-transparent text-ink hover:border-pine hover:bg-moss/40 focus-visible:ring-pine/20",
  ghost: "text-muted hover:bg-moss/50 hover:text-ink focus-visible:ring-pine/20",
  soft: "bg-moss text-pine-dark hover:bg-[#cdddcf] focus-visible:ring-pine/20",
};

const baseClasses = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50";

export function Button({ children, href, variant = "primary", fullWidth, className = "", ...props }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>;
  }

  return <button className={classes} {...props}>{children}</button>;
}
