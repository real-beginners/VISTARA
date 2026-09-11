import { Icon } from "@/components/ui/Icon";

export function AuthVisual({ mode = "welcome" }: { mode?: "welcome" | "login" | "signup" }) {
  const isSignup = mode === "signup";
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-pine p-8 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,123,97,.4),transparent_32%),radial-gradient(circle_at_90%_85%,rgba(255,255,255,.12),transparent_30%)]" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1500&q=80)", backgroundPosition: "center", backgroundSize: "cover", mixBlendMode: "screen" }} />
      <div className="relative z-10 flex items-center justify-between"><span className="text-[15px] font-bold tracking-[0.2em]">VISTARA</span><span className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">Travel, together</span></div>
      <div className="relative z-10 mx-auto w-full max-w-lg py-12">
        <div className="mb-10 flex items-center gap-3 text-coral-soft"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><Icon name="sparkle" size={20} /></span><span className="eyebrow text-[10px] font-bold">{isSignup ? "Start with a feeling" : mode === "login" ? "Welcome back" : "A calmer way to go"}</span></div>
        <h2 className="max-w-md font-display text-5xl leading-[1.02] tracking-[-0.055em]">{isSignup ? "Make room for somewhere new." : "The best journeys have a little room to wander."}</h2>
        <p className="mt-6 max-w-sm text-sm leading-6 text-white/65">{isSignup ? "Gather the people, places, and possibilities that make a trip feel like yours." : "Bring your people, preferences, and possibilities into one thoughtful travel space."}</p>
        <div className="mt-10 max-w-sm rounded-[1.75rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-white/50"><span>AI journey sketch</span><Icon name="more" size={16} /></div>
          <div className="mt-4 rounded-2xl bg-[#f5e7d2] p-4 text-ink"><div className="flex items-center justify-between"><div><p className="eyebrow text-[9px] font-bold text-[#a06e49]">Saturday · 6 hours</p><p className="mt-2 font-display text-2xl tracking-[-0.04em]">Pune, at your pace</p></div><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 text-[#a06e49]"><Icon name="map-pin" size={17} /></span></div><div className="mt-4 flex items-center gap-2 text-xs font-semibold text-ink/55"><span className="h-2 w-2 rounded-full bg-coral" /> Four friends <span className="text-ink/20">•</span> ₹2,000</div></div>
        </div>
      </div>
      <p className="relative z-10 text-xs text-white/40">VISTARA · Discover places. Plan journeys. Create memories together.</p>
    </div>
  );
}
