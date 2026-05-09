import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import { IDCardPreview, ID_CARD_TEMPLATES, DEFAULT_OPTIONS } from "@/components/IDCardPreview";

export const Route = createFileRoute("/app/templates")({
  component: TemplatesPage,
});

const PREVIEW_DATA = {
  full_name: "Alex Morgan",
  title: "Senior Engineer",
  department: "Product & Engineering",
  organization: "Identica Corp",
  employee_id: "EMP-2024",
  email: "alex@identica.co",
  phone: "+1 555 000 0000",
  valid_until: "2026-12-31",
};

function TemplatesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(ID_CARD_TEMPLATES.map((t) => t.category));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return ID_CARD_TEMPLATES.filter((t) => {
      if (category && t.category !== category) return false;
      if (
        query &&
        !`${t.name} ${t.category} ${t.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [query, category]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">ID Card templates</h1>
        <p className="mt-1 text-muted-foreground">
          20 modern designs — landscape &amp; portrait, all fully customizable with
          photo, QR code, and company logo toggles.
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
              category === null
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-accent"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((t) => {
          const isPortrait = t.orientation === "portrait";
          return (
            <Link
              key={t.id}
              to="/app/generate/$templateId"
              params={{ templateId: t.id }}
              className="group"
            >
              <Card className="p-4 transition-all hover:shadow-lg hover:border-primary/40 h-full flex flex-col">
                {/* Preview thumbnail */}
                <div
                  className="flex justify-center items-center bg-accent/20 rounded-lg overflow-hidden mb-3"
                  style={{ height: isPortrait ? 200 : 140 }}
                >
                  <div
                    style={{
                      transform: isPortrait ? "scale(0.52)" : "scale(0.36)",
                      transformOrigin: "center center",
                      pointerEvents: "none",
                    }}
                  >
                    <IDCardPreview
                      templateId={t.id}
                      data={PREVIEW_DATA}
                      options={DEFAULT_OPTIONS}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display font-semibold text-sm leading-tight">{t.name}</h3>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {t.orientation === "landscape" ? "LS" : "PT"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                  <Badge variant="outline" className="text-xs mt-2">
                    {t.category}
                  </Badge>
                </div>

                <div className="mt-3 text-sm text-primary inline-flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Customize <ArrowRight className="size-3.5" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No templates match your filters.
        </div>
      )}
    </div>
  );
}
