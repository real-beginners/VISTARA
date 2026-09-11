import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function Input({ label, hint, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <input
        id={inputId}
        className={`h-12 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-pine focus:ring-4 focus:ring-pine/10 ${className}`}
        {...props}
      />
      {hint ? <span className="mt-1.5 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
