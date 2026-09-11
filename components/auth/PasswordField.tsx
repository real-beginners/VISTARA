"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Icon } from "@/components/ui/Icon";

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string };

export function PasswordField({ label, hint, id, className = "", ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <span className="relative block">
        <input id={inputId} type={visible ? "text" : "password"} className={`h-12 w-full rounded-xl border border-line bg-paper px-4 pr-12 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-pine focus:ring-4 focus:ring-pine/10 ${className}`} {...props} />
        <button type="button" onClick={() => setVisible((value) => !value)} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-moss hover:text-pine" aria-label={visible ? "Hide password" : "Show password"}><Icon name={visible ? "eye-off" : "eye"} size={17} /></button>
      </span>
      {hint ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
