import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, IdCard, History as HistoryIcon, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const cards = useQuery({
    queryKey: ["recent-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generated_cards")
        .select("id, created_at, data, templates(name, category)")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [{ count: total }, { count: templates }] = await Promise.all([
        supabase.from("generated_cards").select("*", { count: "exact", head: true }),
        supabase.from("templates").select("*", { count: "exact", head: true }).eq("status", "published"),
      ]);
      return { total: total ?? 0, templates: templates ?? 0 };
    },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-display font-bold tracking-tight mt-1">{user?.email?.split("@")[0]}</h1>
        </div>
        <Link to="/app/templates">
          <Button className="gap-2"><Plus className="size-4" />New card</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cards generated</span>
            <HistoryIcon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-3 text-3xl font-display font-bold">{stats.data?.total ?? "—"}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Templates available</span>
            <IdCard className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-3 text-3xl font-display font-bold">{stats.data?.templates ?? "—"}</div>
        </Card>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">Recent activity</h2>
          <Link to="/app/history" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        <Card className="divide-y">
          {cards.isLoading && <div className="p-6 text-sm text-muted-foreground">Loading…</div>}
          {cards.data && cards.data.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No cards yet. Pick a template to get started.</p>
              <Link to="/app/templates" className="mt-3 inline-block">
                <Button variant="outline" size="sm">Browse templates</Button>
              </Link>
            </div>
          )}
          {cards.data?.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{(c.data as any)?.full_name || "Unnamed"}</div>
                <div className="text-xs text-muted-foreground">{(c as any).templates?.name} · {new Date(c.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
