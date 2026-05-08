import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { CardPreview, type TemplateLite, type TemplateField } from "@/components/CardPreview";
import { toast } from "sonner";

export const Route = createFileRoute("/app/generate/$templateId")({
  component: GeneratorPage,
});

function GeneratorPage() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: template, isLoading } = useQuery({
    queryKey: ["template", templateId],
    queryFn: async () => {
      const { data, error } = await supabase.from("templates").select("*").eq("id", templateId).single();
      if (error) throw error;
      return data as unknown as TemplateLite;
    },
  });

  const requiredMissing = template?.field_manifest
    .filter((f) => f.required)
    .filter((f) => (f.type === "image" ? !photo : !data[f.key]?.trim())) ?? [];

  const handlePhoto = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error("Image too large (max 10 MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const exportCard = async (format: "png" | "pdf") => {
    if (requiredMissing.length > 0) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const cardEl = cardRef.current.querySelector("[data-card-preview]") as HTMLElement;
      if (!cardEl) throw new Error("Preview not ready");
      const canvas = await html2canvas(cardEl, { scale: 4, backgroundColor: null, useCORS: true });
      const dataUrl = canvas.toDataURL("image/png");

      const filenameBase = (data.full_name || template?.name || "card")
        .replace(/[^a-z0-9]+/gi, "_").toLowerCase();

      if (format === "png") {
        downloadFromUrl(dataUrl, `${filenameBase}.png`);
      } else {
        const { jsPDF } = await import("jspdf");
        const isLandscape = template?.orientation === "landscape";
        const pdf = new jsPDF({ orientation: isLandscape ? "landscape" : "portrait", unit: "mm", format: [85.6, 54] });
        const w = isLandscape ? 85.6 : 54;
        const h = isLandscape ? 54 : 85.6;
        pdf.addImage(dataUrl, "PNG", 0, 0, w, h);
        pdf.save(`${filenameBase}.pdf`);
      }

      // Save to history
      setSaving(true);
      const { data: profile } = await supabase.from("profiles").select("organization_id").single();
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from("generated_cards").insert({
        template_id: templateId,
        template_version: 1,
        organization_id: profile?.organization_id ?? null,
        generated_by: userData.user!.id,
        data: { ...data, _photo: photo ? "embedded" : null },
        preview_url: dataUrl.slice(0, 200000), // truncated for storage
      });
      toast.success(`Card exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
      setSaving(false);
    }
  };

  if (isLoading || !template) {
    return <div className="p-12 text-center text-muted-foreground">Loading template…</div>;
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <Link to="/app/templates" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to templates
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">{template.name}</h1>
          <p className="text-sm text-muted-foreground">{template.category} · {template.field_manifest.length} fields</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportCard("png")} disabled={exporting || saving}>
            {exporting ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Download className="size-4 mr-2" />} PNG
          </Button>
          <Button onClick={() => exportCard("pdf")} disabled={exporting || saving}>
            {exporting ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Download className="size-4 mr-2" />} PDF
          </Button>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-4">Card details</h2>
          <div className="space-y-4">
            {template.field_manifest.map((f) => (
              <FieldInput
                key={f.key}
                field={f}
                value={data[f.key] || ""}
                photo={photo}
                onChange={(v) => setData((d) => ({ ...d, [f.key]: v }))}
                onPhoto={handlePhoto}
              />
            ))}
          </div>
        </Card>
        <div className="lg:sticky lg:top-6 self-start">
          <Card className="p-6 bg-gradient-to-br from-accent/40 to-background">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Live preview</p>
            <div className="flex justify-center" ref={cardRef}>
              <CardPreview template={template} data={data} photoDataUrl={photo} scale={1.2} />
            </div>
            {requiredMissing.length > 0 && (
              <p className="text-xs text-warning-foreground bg-warning/20 px-3 py-2 rounded-md mt-4">
                Missing: {requiredMissing.map((f) => f.label).join(", ")}
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ field, value, photo, onChange, onPhoto }: {
  field: TemplateField;
  value: string;
  photo: string | null;
  onChange: (v: string) => void;
  onPhoto: (f: File) => void;
}) {
  if (field.type === "image") {
    return (
      <div className="space-y-1.5">
        <Label>{field.label}{field.required && <span className="text-destructive">*</span>}</Label>
        <label className="flex items-center gap-3 px-3 py-2.5 border border-dashed rounded-md cursor-pointer hover:bg-accent/40 transition-colors">
          {photo ? (
            <img src={photo} alt="" className="size-12 rounded object-cover" />
          ) : (
            <div className="size-12 rounded bg-accent flex items-center justify-center">
              <ImageIcon className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 text-sm">
            <div className="font-medium">{photo ? "Replace photo" : "Upload photo"}</div>
            <div className="text-xs text-muted-foreground">JPG, PNG, WEBP up to 10 MB</div>
          </div>
          <Upload className="size-4 text-muted-foreground" />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]; if (f) onPhoto(f);
          }} />
        </label>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <Label>{field.label}{field.required && <span className="text-destructive">*</span>}</Label>
      <Input
        type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
        value={value}
        maxLength={field.max}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.max && <p className="text-xs text-muted-foreground">{value.length}/{field.max}</p>}
    </div>
  );
}

function downloadFromUrl(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}
