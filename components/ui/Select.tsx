import type { SelectHTMLAttributes } from "react";
import { Icon } from "./Icon";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
};

export function Select({ label, options, id, className = "", ...props }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <label htmlFor={selectId} className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <span className="relative block">
        <select
          id={selectId}
          className={`h-12 w-full appearance-none rounded-xl border border-line bg-paper px-4 pr-11 text-sm text-ink outline-none transition focus:border-pine focus:ring-4 focus:ring-pine/10 ${className}`}
          defaultValue={props.value !== undefined ? undefined : ""}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <Icon name="chevron-down" size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
      </span>
    </label>
  );
}
