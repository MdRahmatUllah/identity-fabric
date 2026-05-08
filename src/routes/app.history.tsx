import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileX } from "lucide-react";

export const Route = createFileRoute("/app/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_cards")
        .select("id, created_at, data, preview_url, templates(name, category)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-display font-bold tracking-tight">Generation history</h1>
      <p className="mt-1 text-muted-foreground">A complete record of every card you've generated.</p>

      <div className="mt-8 space-y-3">
        {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {data && data.length === 0 && (
          <Card className="p-12 text-center">
            <FileX className="size-8 mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No cards generated yet.</p>
            <Link to="/app/templates" className="mt-4 inline-block">
              <Button variant="outline">Browse templates</Button>
            </Link>
          </Card>
        )}
        {data?.map((c) => {
          const d = c.data as Record<string, string>;
          return (
            <Card key={c.id} className="p-4 flex items-center gap-4">
              {c.preview_url ? (
                <img src={c.preview_url} alt="" className="w-24 h-16 rounded object-cover bg-accent" />
              ) : (
                <div className="w-24 h-16 rounded bg-accent" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{d?.full_name || "Unnamed"}</div>
                <div className="text-xs text-muted-foreground">
                  {(c as any).templates?.name} · {new Date(c.created_at).toLocaleString()}
                </div>
              </div>
              <Badge variant="secondary">{(c as any).templates?.category}</Badge>
              {c.preview_url && (
                <Button variant="ghost" size="icon" onClick={() => {
                  const a = document.createElement("a");
                  a.href = c.preview_url!;
                  a.download = `${(d?.full_name || "card").replace(/\s+/g, "_")}.png`;
                  a.click();
                }}>
                  <Download className="size-4" />
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
