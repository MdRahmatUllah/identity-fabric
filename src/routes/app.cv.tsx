import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import { CvPreview, CV_TEMPLATES } from "@/components/CvPreview";

export const Route = createFileRoute("/app/cv")({
  component: CvTemplatesPage,
});

function CvTemplatesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(CV_TEMPLATES.map((t) => t.category));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return CV_TEMPLATES.filter((t) => {
      if (category && t.category !== category) return false;
      if (query && !`${t.name} ${t.category} ${t.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, category]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">CV & Biography templates</h1>
        <p className="mt-1 text-muted-foreground">
          Choose a template to build your CV or biography. Export as A4 PDF or high-resolution PNG.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              category === null ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === c ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <Link
            key={t.id}
            to="/app/cv-generate/$cvTemplateId"
            params={{ cvTemplateId: t.id }}
            className="group"
          >
            <Card className="p-5 transition-all hover:shadow-lg hover:border-primary/40 h-full flex flex-col">
              {/* Scaled preview */}
              <div className="flex justify-center items-center bg-accent/20 rounded-lg overflow-hidden mb-4" style={{ height: 200 }}>
                <div
                  style={{
                    transform: "scale(0.32)",
                    transformOrigin: "top center",
                    pointerEvents: "none",
                  }}
                >
                  <CvPreview
                    templateId={t.id}
                    data={{
                      full_name: "Alex Morgan",
                      headline: t.category === "Biography" ? "Author & Public Speaker" : "Senior Product Manager",
                      email: "alex@example.com",
                      phone: "+1 555 000 0000",
                      location: "San Francisco, CA",
                      website: "linkedin.com/in/alexmorgan",
                      summary:
                        "Experienced professional with a track record of delivering high-impact results across multiple industries. Passionate about building great teams and products.",
                      experience:
                        "Senior PM | TechCorp | 2021–Present\nLed a cross-functional team of 12 to ship 3 major product lines.\n\nProduct Manager | StartupXYZ | 2018–2021\nGrew user base from 50k to 500k through data-driven decisions.",
                      education:
                        "MBA | Stanford University | 2018\nConcentration in Technology & Innovation.\n\nB.Sc. Computer Science | UC Berkeley | 2016",
                      skills: "Strategy, Roadmapping, SQL, Python, Figma, Agile, Leadership",
                      languages: "English (Native), Spanish (Fluent)",
                      certifications: "PMP | PMI | 2022\nAWS Solutions Architect | Amazon | 2021",
                    }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-sm">{t.name}</h3>
                  <Badge variant="secondary" className="text-xs shrink-0">{t.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
              </div>

              <div className="mt-4 text-sm text-primary inline-flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Use template <ArrowRight className="size-3.5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No templates match your filters.</div>
      )}
    </div>
  );
}
