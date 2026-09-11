import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
};

export function EmptyState({ icon = "compass", title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "px-4 py-10" : "px-6 py-16"}`}>
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-moss text-pine">
        <Icon name={icon} size={25} />
      </div>
      <h3 className="font-display text-xl tracking-[-0.02em] text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
