import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import { CardPreview, type TemplateLite } from "@/components/CardPreview";

export const Route = createFileRoute("/app/templates")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const templates = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("status", "published")
        .order("name");
      if (error) throw error;
      return data as unknown as TemplateLite[];
    },
  });

  const categories = useMemo(() => {
    const set = new Set(templates.data?.map((t) => t.category) ?? []);
    return Array.from(set).sort();
  }, [templates.data]);

  const filtered = useMemo(() => {
    return (templates.data ?? []).filter((t) => {
      if (category && t.category !== category) return false;
      if (query && !`${t.name} ${t.category}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [templates.data, query, category]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Template library</h1>
        <p className="mt-1 text-muted-foreground">Choose a starting point. All templates are print-ready and brand-customizable.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              category === null ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
            }`}
          >All</button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === c ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
              }`}
            >{c}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.isLoading && Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="aspect-[4/3] animate-pulse" />
        ))}
        {filtered.map((t) => (
          <Link
            key={t.id}
            to="/app/generate/$templateId"
            params={{ templateId: t.id }}
            className="group"
          >
            <Card className="p-6 transition-all hover:shadow-lg hover:border-primary/40 h-full flex flex-col">
              <div className="flex justify-center items-center bg-accent/40 rounded-lg p-6 mb-4">
                <div style={{ transform: "scale(0.7)" }}>
                  <CardPreview template={t} data={{}} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold">{t.name}</h3>
                  <Badge variant="secondary" className="text-xs">{t.orientation}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.category} · {t.field_manifest.length} fields</p>
              </div>
              <div className="mt-4 text-sm text-primary inline-flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Use template <ArrowRight className="size-3.5" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && !templates.isLoading && (
        <div className="text-center py-16 text-muted-foreground">No templates match your filters.</div>
      )}
    </div>
  );
}
