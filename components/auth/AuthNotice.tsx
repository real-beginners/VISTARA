import { Icon } from "@/components/ui/Icon";

export function AuthNotice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "error" | "success" }) {
  const classes = tone === "error" ? "bg-coral-soft text-[#984f3a]" : tone === "success" ? "bg-moss text-pine" : "bg-blue-soft text-[#47727d]";
  return <div role="status" className={`flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-xs leading-5 ${classes}`}><Icon name={tone === "success" ? "check-circle" : "info"} size={16} className="mt-0.5 shrink-0" /><span>{children}</span></div>;
}
