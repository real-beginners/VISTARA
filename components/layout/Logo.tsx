import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${light ? "text-white" : "text-ink"}`} aria-label="VISTARA home">
      <span className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${light ? "bg-white/15" : "bg-pine"}`}>
        <span className="h-3.5 w-3.5 rotate-45 rounded-[4px] border-2 border-coral" />
      </span>
      <span className="text-[15px] font-bold tracking-[0.2em]">VISTARA</span>
    </Link>
  );
}
