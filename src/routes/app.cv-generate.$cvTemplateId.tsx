import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { CvPreview, CV_TEMPLATES, type CvField } from "@/components/CvPreview";
import { toast } from "sonner";

export const Route = createFileRoute("/app/cv-generate/$cvTemplateId")({
  component: CvGeneratorPage,
});

function CvGeneratorPage() {
  const { cvTemplateId } = Route.useParams();
  const [data, setData] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const template = CV_TEMPLATES.find((t) => t.id === cvTemplateId);

  if (!template) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Template not found.{" "}
        <Link to="/app/cv" className="text-primary underline">
          Browse templates
        </Link>
      </div>
    );
  }

  const requiredMissing = template.fields
    .filter((f) => f.required)
    .filter((f) => (f.type === "image" ? !photo : !data[f.key]?.trim()));

  const handlePhoto = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large (max 10 MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const exportCv = async (format: "png" | "pdf") => {
    if (requiredMissing.length > 0) {
      toast.error(`Please fill in: ${requiredMissing.map((f) => f.label).join(", ")}`);
      return;
    }
    if (!previewRef.current) return;

    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const el = previewRef.current.querySelector("[data-cv-preview]") as HTMLElement;
      if (!el) throw new Error("Preview not ready");

      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");

      const filenameBase = (data.full_name || template.name)
        .replace(/[^a-z0-9]+/gi, "_")
        .toLowerCase();

      if (format === "png") {
        downloadFromUrl(dataUrl, `${filenameBase}_cv.png`);
        toast.success("CV exported as PNG");
      } else {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
        pdf.save(`${filenameBase}_cv.pdf`);
        toast.success("CV exported as PDF");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <Link
        to="/app/cv"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to CV templates
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">{template.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{template.category}</Badge>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportCv("png")} disabled={exporting}>
            {exporting ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Download className="size-4 mr-2" />
            )}{" "}
            PNG
          </Button>
          <Button onClick={() => exportCv("pdf")} disabled={exporting}>
            {exporting ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Download className="size-4 mr-2" />
            )}{" "}
            PDF (A4)
          </Button>
        </div>
      </div>

      <div className="mt-8 grid xl:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="p-6">
          <h2 className="font-display font-semibold mb-5">Your details</h2>
          <div className="space-y-5">
            {template.fields.map((f) => (
              <CvFieldInput
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

        {/* Preview */}
        <div className="xl:sticky xl:top-6 self-start">
          <Card className="p-4 bg-gradient-to-br from-accent/30 to-background overflow-hidden">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
              Live preview · A4
            </p>
            <div
              className="flex justify-center overflow-hidden rounded-md"
              style={{ maxHeight: 700 }}
            >
              <div
                ref={previewRef}
                style={{
                  transform: "scale(0.58)",
                  transformOrigin: "top center",
                  marginBottom: "-36%",
                }}
              >
                <CvPreview
                  templateId={cvTemplateId}
                  data={data}
                  photoDataUrl={photo}
                />
              </div>
            </div>

            {requiredMissing.length > 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md mt-4">
                Required: {requiredMissing.map((f) => f.label).join(", ")}
              </p>
            )}
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-3">
            Preview is scaled to fit. Exported PDF will be full A4 quality.
          </p>
        </div>
      </div>
    </div>
  );
}

function CvFieldInput({
  field,
  value,
  photo,
  onChange,
  onPhoto,
}: {
  field: CvField;
  value: string;
  photo: string | null;
  onChange: (v: string) => void;
  onPhoto: (f: File) => void;
}) {
  if (field.type === "image") {
    return (
      <div className="space-y-1.5">
        <Label>
          {field.label}
          {field.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        <label className="flex items-center gap-3 px-3 py-2.5 border border-dashed rounded-md cursor-pointer hover:bg-accent/40 transition-colors">
          {photo ? (
            <img src={photo} alt="" className="size-12 rounded-full object-cover shrink-0" />
          ) : (
            <div className="size-12 rounded-full bg-accent flex items-center justify-center shrink-0">
              <ImageIcon className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 text-sm">
            <div className="font-medium">{photo ? "Replace photo" : "Upload photo"}</div>
            <div className="text-xs text-muted-foreground">JPG, PNG, WEBP · max 10 MB</div>
          </div>
          <Upload className="size-4 text-muted-foreground" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPhoto(f);
            }}
          />
        </label>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <Label>
          {field.label}
          {field.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        <Textarea
          value={value}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="resize-y text-sm font-mono leading-relaxed"
        />
        {field.placeholder && field.type === "textarea" && (
          <p className="text-xs text-muted-foreground">
            Format: <code className="bg-muted px-1 rounded text-[10px]">Title | Company | Period</code> then description on the next line. Separate entries with a blank line.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.type === "url" ? "url" : "text"}
        value={value}
        maxLength={field.max}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.max && (
        <p className="text-xs text-muted-foreground text-right">
          {value.length}/{field.max}
        </p>
      )}
    </div>
  );
}

function downloadFromUrl(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}
