import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ID_CARD_TEMPLATES } from "@/components/IDCardPreview";

const CardEditor = lazy(() =>
  import("@/components/CardEditor").then((m) => ({ default: m.CardEditor }))
);

const searchSchema = z.object({
  full_name: z.string().optional(),
  title: z.string().optional(),
  department: z.string().optional(),
  organization: z.string().optional(),
  employee_id: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  valid_until: z.string().optional(),
  blood_type: z.string().optional(),
  emergency_contact: z.string().optional(),
});

export const Route = createFileRoute("/app/editor/$templateId")({
  validateSearch: searchSchema,
  component: EditorPage,
});

function EditorPage() {
  const { templateId } = Route.useParams();
  const search = Route.useSearch();
  const template = ID_CARD_TEMPLATES.find((t) => t.id === templateId);

  if (!template) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Template not found.{" "}
        <Link to="/app/templates" className="text-primary underline">
          Browse templates
        </Link>
      </div>
    );
  }

  const initialData: Record<string, string> = Object.fromEntries(
    Object.entries(search).filter(([, v]) => v !== undefined)
  ) as Record<string, string>;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div className="flex items-center gap-3 px-4 py-2 border-b bg-card shrink-0 h-10">
        <Link
          to="/app/generate/$templateId"
          params={{ templateId }}
          search={search}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to form
        </Link>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs font-medium">Visual Editor · {template.name}</span>
      </div>

      <div className="flex-1 min-h-0">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin" /> Loading editor…
            </div>
          }
        >
          <CardEditor template={template} initialData={initialData} />
        </Suspense>
      </div>
    </div>
  );
}
