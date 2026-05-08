import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { IdCard, Layers, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Identica — ID Cards at Scale" },
      { name: "description", content: "Design, manage and generate professional identity cards. Single cards in 30 seconds, bulk batches of thousands." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <IdCard className="size-4" />
            </div>
            <span className="font-display font-semibold tracking-tight">Identica</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#security" className="hover:text-foreground">Security</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/auth" search={{ mode: "signup" } as never}><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
              <span className="size-1.5 rounded-full bg-success" />
              Now generating cards in under 30 seconds
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.05]">
              Identity cards,<br />
              <span className="text-primary">built for scale.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              A multi-tenant platform for HR, education, healthcare and event teams to design, generate and audit print-ready identity cards — single or in bulk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" search={{ mode: "signup" } as never}>
                <Button size="lg" className="gap-2">Start free <ArrowRight className="size-4" /></Button>
              </Link>
              <a href="#features"><Button size="lg" variant="outline">See how it works</Button></a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["10+ templates","Bulk CSV import","300 DPI export","Full audit log"].map((f) => (
                <div key={f} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />{f}</div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 via-accent/40 to-primary/10 border p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <CardPreview color="oklch(0.42 0.17 264)" name="Sarah Chen" role="Engineering" />
                <CardPreview color="oklch(0.62 0.16 155)" name="Marcus Park" role="Healthcare" tilt="rotate-3" />
                <CardPreview color="oklch(0.55 0.18 25)" name="Lia Müller" role="Visitor" tilt="-rotate-2" />
                <CardPreview color="oklch(0.5 0.18 290)" name="Diego Soto" role="Delegate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-display font-bold tracking-tight">Everything you need to issue identity at scale.</h2>
            <p className="mt-3 text-muted-foreground">From a curated template library to bulk pipelines and tamper-evident audit logs — Identica replaces fragmented design tools with one governed workflow.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: "Curated template library", body: "10+ professionally-designed templates across employee, student, healthcare, visitor, event and more — with versioning and brand overrides." },
              { icon: Zap, title: "Single & bulk generation", body: "Issue one card in under 30 seconds via guided forms, or generate thousands from a CSV with row-level validation." },
              { icon: ShieldCheck, title: "Audit-ready by default", body: "Every generation event logged. Role-based access, encryption at rest, GDPR-compliant retention policies." },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-xl border bg-card">
                <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.icon className="size-5" />
                </div>
                <h3 className="font-display font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-display font-bold tracking-tight">Issue your first card in 10 minutes.</h2>
          <p className="mt-3 text-muted-foreground">Free tier includes 50 cards/month. No credit card required.</p>
          <div className="mt-6">
            <Link to="/auth" search={{ mode: "signup" } as never}>
              <Button size="lg" className="gap-2">Create your account <ArrowRight className="size-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Identica. Built by InfinitiBit.
      </footer>
    </div>
  );
}

function CardPreview({ color, name, role, tilt = "" }: { color: string; name: string; role: string; tilt?: string }) {
  return (
    <div className={`aspect-[1.586/1] rounded-lg shadow-lg p-3 text-white text-xs flex flex-col justify-between ${tilt}`}
      style={{ backgroundColor: color }}>
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold tracking-wider text-[10px]">IDENTICA</span>
        <div className="size-4 rounded bg-white/30" />
      </div>
      <div className="flex items-end gap-2">
        <div className="size-9 rounded bg-white/30" />
        <div className="leading-tight">
          <div className="font-semibold">{name}</div>
          <div className="opacity-80 text-[10px]">{role}</div>
        </div>
      </div>
    </div>
  );
}
