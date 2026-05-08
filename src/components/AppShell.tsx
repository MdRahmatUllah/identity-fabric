import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, IdCard, History, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/app/templates", label: "Templates", icon: IdCard },
  { to: "/app/history", label: "History", icon: History },
] as const;

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2 px-6 h-16 border-b">
          <div className="size-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="font-display font-semibold tracking-tight">Identica</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm truncate">{user?.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="size-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
