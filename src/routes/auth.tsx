import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { IdCard, Loader2 } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional().default("signin"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — Identica" }] }),
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session && !loading) navigate({ to: "/app" });
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const schema = z.object({
          email: z.string().email(),
          password: z.string().min(8, "At least 8 characters"),
          name: z.string().min(1).max(100),
          orgName: z.string().min(1).max(100),
        });
        const parsed = schema.parse({ email, password, name, orgName });
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: { full_name: parsed.name, organization_name: parsed.orgName },
          },
        });
        if (error) throw error;
        toast.success("Account created! Signing you in…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-primary-foreground/15 flex items-center justify-center">
            <IdCard className="size-4" />
          </div>
          <span className="font-display font-semibold">Identica</span>
        </Link>
        <div>
          <h2 className="text-3xl font-display font-bold leading-tight max-w-md">
            "Issuing 2,000 student IDs went from a two-week project to a Tuesday afternoon."
          </h2>
          <p className="mt-4 text-sm text-primary-foreground/70">— Registrar, mid-sized university</p>
        </div>
        <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} Identica</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-display font-bold tracking-tight">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Welcome back to Identica." : "Start issuing cards in minutes."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="org">Organization</Label>
                  <Input id="org" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
