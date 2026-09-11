import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

function JourneyPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:mr-0">
      <div className="absolute -left-5 top-10 hidden h-24 w-24 rounded-full border border-white/15 lg:block" />
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1d5751] p-5 shadow-[0_24px_70px_rgba(8,42,38,0.28)] sm:p-7">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[42px] border-white/[0.06]" />
        <div className="absolute -bottom-36 -left-16 h-80 w-80 rounded-full border-[45px] border-[#d87b61]/20" />
        <div className="relative">
          <div className="flex items-start justify-between text-white">
            <div>
              <p className="eyebrow text-[10px] font-semibold text-white/55">A new journey</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">Find your way<br />to somewhere new.</h2>
            </div>
            <Icon name="more" size={22} className="text-white/60" />
          </div>
          <div className="mt-9 grid grid-cols-[1.05fr_0.95fr] gap-3">
            <div className="rounded-2xl bg-[#f5e7d2] p-4 text-ink">
              <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.14em] text-[#a06e49]">Destination</span><Icon name="compass" size={17} className="text-[#a06e49]" /></div>
              <p className="mt-8 font-display text-2xl tracking-[-0.04em]">Somewhere<br />worth going</p>
              <p className="mt-4 text-xs font-semibold text-ink/50">Start with a feeling.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex-1 rounded-2xl bg-white/10 p-4 text-white backdrop-blur-sm"><Icon name="users" size={18} className="text-[#f0b19e]" /><p className="mt-7 text-sm font-semibold">Bring your people</p><p className="mt-1 text-xs leading-5 text-white/55">One plan, shared.</p></div>
              <div className="flex-1 rounded-2xl bg-[#d87b61] p-4 text-white"><Icon name="sparkle" size={18} /><p className="mt-7 text-sm font-semibold">Make it yours</p><p className="mt-1 text-xs leading-5 text-white/70">Built around you.</p></div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur-sm"><span className="text-xs font-semibold text-white/70">Your trip, at your pace</span><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-pine"><Icon name="arrow-up-right" size={15} /></span></div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-2 hidden items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 shadow-soft sm:flex lg:-left-10"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral-soft text-coral"><Icon name="check" size={17} /></span><div><p className="text-xs font-bold text-ink">A plan that feels like you</p><p className="mt-0.5 text-[11px] text-muted">Less logistics, more living.</p></div></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-canvas">
      <section className="relative bg-pine text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(216,123,97,.35), transparent 25%), radial-gradient(circle at 15% 90%, rgba(255,255,255,.12), transparent 22%)" }} />
        <Navbar light />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 lg:px-10 lg:pb-36 lg:pt-20">
          <div className="max-w-xl"><p className="eyebrow mb-6 text-xs font-bold text-coral-soft">Your world, thoughtfully planned</p><h1 className="font-display text-5xl leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.3rem]">Go somewhere<br /><em className="font-normal text-coral-soft">that feels like you.</em></h1><p className="mt-7 max-w-md text-base leading-7 text-white/70 sm:text-lg">VISTARA brings your people, preferences, and possibilities into one calm space for planning your next great escape.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button href="/trips/create-trip" variant="soft" className="bg-coral text-white hover:bg-[#c66a50]">Plan your journey <Icon name="arrow-right" size={17} /></Button><Button href="/dashboard" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Explore the workspace</Button></div><div className="mt-12 flex items-center gap-3 text-xs text-white/55"><span className="h-px w-9 bg-white/25" /> Made for the way you travel</div></div>
          <JourneyPreview />
        </div>
      </section>
      <section id="approach" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.7fr_1.3fr] lg:px-10"><div><p className="eyebrow text-xs font-bold text-coral">The VISTARA approach</p><h2 className="mt-4 max-w-sm font-display text-4xl leading-tight tracking-[-0.04em]">The best trips start before you leave.</h2></div><div className="grid gap-4 sm:grid-cols-3">{[{ number: "01", title: "Start with you", copy: "Your budget, pace, and curiosities are the starting point." }, { number: "02", title: "Plan together", copy: "Make space for everyone’s ideas without losing the thread." }, { number: "03", title: "Leave room", copy: "A good plan gives you direction—and room to wander." }].map((item) => <div key={item.number} className="rounded-2xl border border-line bg-paper p-5"><span className="text-xs font-bold text-coral">{item.number}</span><h3 className="mt-9 font-display text-xl tracking-[-0.02em]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{item.copy}</p></div>)}</div></section>
      <section id="groups" className="border-y border-line bg-sand/45"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center lg:px-10"><div><p className="eyebrow text-xs font-bold text-coral">For the whole crew</p><h2 className="mt-3 font-display text-3xl tracking-[-0.03em]">One shared space for every point of view.</h2></div><Link href="/signup" className="inline-flex items-center gap-2 text-sm font-bold text-pine hover:text-coral">Bring your people <Icon name="arrow-right" size={16} /></Link></div></section>
      <footer id="about" className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><LogoFooter /></footer>
    </main>
  );
}

function LogoFooter() {
  return <div className="flex items-center justify-between sm:contents"><span className="text-[15px] font-bold tracking-[0.2em] text-ink">VISTARA</span><p>Thoughtful travel planning, together.</p></div>;
}
