import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  Loader2,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Pencil,
} from "lucide-react";
import {
  IDCardPreview,
  ID_CARD_TEMPLATES,
  CARD_FIELDS,
  type CardOptions,
  type CardField,
  DEFAULT_OPTIONS,
} from "@/components/IDCardPreview";
import { toast } from "sonner";

export const Route = createFileRoute("/app/generate/$templateId")({
  component: GeneratorPage,
});

const DRAFT_KEY = (id: string) => `idcard-draft-${id}`;

interface FormDraft {
  data: Record<string, string>;
  photo: string | null;
  logo: string | null;
  options: CardOptions;
  savedAt: number;
}

function loadDraft(templateId: string): FormDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY(templateId));
    return raw ? (JSON.parse(raw) as FormDraft) : null;
  } catch {
    return null;
  }
}

function saveDraft(templateId: string, draft: FormDraft) {
  try {
    localStorage.setItem(DRAFT_KEY(templateId), JSON.stringify(draft));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

function clearDraft(templateId: string) {
  try {
    localStorage.removeItem(DRAFT_KEY(templateId));
  } catch {}
}

function GeneratorPage() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();

  const draft = loadDraft(templateId);

  const [data, setData] = useState<Record<string, string>>(draft?.data ?? {});
  const [photo, setPhoto] = useState<string | null>(draft?.photo ?? null);
  const [logo, setLogo] = useState<string | null>(draft?.logo ?? null);
  const [options, setOptions] = useState<CardOptions>(draft?.options ?? { ...DEFAULT_OPTIONS });
  const [exporting, setExporting] = useState(false);
  const [hasDraft] = useState(!!draft);

  // Persist to localStorage on every change
  useEffect(() => {
    saveDraft(templateId, { data, photo, logo, options, savedAt: Date.now() });
  }, [data, photo, logo, options, templateId]);

  // Visible preview refs (one for front, one for back — only one shown at a time)
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  // Off-screen high-res render targets (always rendered, used for export)
  const exportFrontRef = useRef<HTMLDivElement>(null);
  const exportBackRef = useRef<HTMLDivElement>(null);

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

  const requiredMissing = CARD_FIELDS.filter((f) => f.required).filter((f) =>
    f.type === "image" ? false : !data[f.key]?.trim()
  );

  const handleImage = (file: File, setter: (v: string) => void) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large (max 10 MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const captureElement = async (el: HTMLElement): Promise<HTMLCanvasElement> => {
    const html2canvas = (await import("html2canvas-pro")).default;
    const target = el.querySelector("[data-card-preview]") as HTMLElement;
    if (!target) throw new Error("Preview element not found");
    const canvas = await html2canvas(target, {
      scale: 4,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
    // Composite onto a white canvas to ensure opaque output regardless of any transparency.
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    const ctx = out.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(canvas, 0, 0);
    return out;
  };

  const exportCard = async (format: "png" | "pdf-single" | "pdf-both") => {
    if (requiredMissing.length > 0) {
      toast.error(`Fill in: ${requiredMissing.map((f) => f.label).join(", ")}`);
      return;
    }
    setExporting(true);
    try {
      const filenameBase = (data.full_name || template.name)
        .replace(/[^a-z0-9]+/gi, "_")
        .toLowerCase();

      const isLandscape = template.orientation === "landscape";
      const cardW = isLandscape ? 85.6 : 54;
      const cardH = isLandscape ? 54 : 85.6;

      if (format === "png") {
        const ref = options.side === "front" ? exportFrontRef : exportBackRef;
        if (!ref.current) return;
        const canvas = await captureElement(ref.current);
        downloadFromUrl(canvas.toDataURL("image/png"), `${filenameBase}_${options.side}.png`);
        toast.success(`${options.side === "front" ? "Front" : "Back"} exported as PNG`);
      } else if (format === "pdf-single") {
        const ref = options.side === "front" ? exportFrontRef : exportBackRef;
        if (!ref.current) return;
        const canvas = await captureElement(ref.current);
        const { jsPDF } = await import("jspdf");
        withPlainBodyColor(() => {
          const pdf = new jsPDF({
            orientation: isLandscape ? "landscape" : "portrait",
            unit: "mm",
            format: [85.6, 54],
          });
          pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, cardW, cardH);
          pdf.save(`${filenameBase}_${options.side}.pdf`);
        });
        toast.success("Exported as PDF");
      } else {
        // Both sides — use off-screen high-res refs
        if (!exportFrontRef.current || !exportBackRef.current) return;
        const [frontCanvas, backCanvas] = await Promise.all([
          captureElement(exportFrontRef.current),
          captureElement(exportBackRef.current),
        ]);
        const { jsPDF } = await import("jspdf");
        withPlainBodyColor(() => {
          const pdf = new jsPDF({
            orientation: isLandscape ? "landscape" : "portrait",
            unit: "mm",
            format: [85.6, 54],
          });
          pdf.addImage(frontCanvas.toDataURL("image/png"), "PNG", 0, 0, cardW, cardH);
          pdf.addPage();
          pdf.addImage(backCanvas.toDataURL("image/png"), "PNG", 0, 0, cardW, cardH);
          pdf.save(`${filenameBase}_both_sides.pdf`);
        });
        toast.success("Both sides exported as PDF");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const toggleOpt = (key: keyof Omit<CardOptions, "side">) =>
    setOptions((o) => ({ ...o, [key]: !o[key] }));

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <Link
        to="/app/templates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to templates
      </Link>

      {hasDraft && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md w-fit">
          <span>Draft restored from your last session.</span>
          <button
            className="underline hover:no-underline"
            onClick={() => {
              clearDraft(templateId);
              setData({});
              setPhoto(null);
              setLogo(null);
              setOptions({ ...DEFAULT_OPTIONS });
            }}
          >
            Discard draft
          </button>
        </div>
      )}

      <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">{template.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="secondary">{template.category}</Badge>
            <Badge variant="outline">{template.orientation}</Badge>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
        </div>
        {/* Export controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const textData = Object.fromEntries(
                Object.entries(data).filter(([k]) => k !== "photo" && k !== "logo")
              );
              navigate({
                to: "/app/editor/$templateId",
                params: { templateId },
                search: textData,
              });
            }}
          >
            <Pencil className="size-4 mr-1.5" />
            Visual Editor
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCard("png")}
            disabled={exporting}
          >
            {exporting ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Download className="size-4 mr-1.5" />}
            PNG ({options.side})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCard("pdf-single")}
            disabled={exporting}
          >
            {exporting ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Download className="size-4 mr-1.5" />}
            PDF ({options.side})
          </Button>
          <Button
            size="sm"
            onClick={() => exportCard("pdf-both")}
            disabled={exporting}
          >
            {exporting ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Download className="size-4 mr-1.5" />}
            PDF (both sides)
          </Button>
        </div>
      </div>

      <div className="mt-8 grid xl:grid-cols-2 gap-8">
        {/* ── Left: form ─────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Customization toggles */}
          <Card className="p-5">
            <h2 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Customization
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {(
                [
                  { key: "showPhoto", label: "Profile photo" },
                  { key: "showQR", label: "QR code" },
                  { key: "showLogo", label: "Company logo" },
                ] as { key: keyof Omit<CardOptions, "side">; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-muted/30">
                  <Switch
                    checked={options[key]}
                    onCheckedChange={() => toggleOpt(key)}
                    id={key}
                  />
                  <Label htmlFor={key} className="text-xs text-center leading-tight cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </Card>

          {/* Card details form */}
          <Card className="p-6">
            <h2 className="font-display font-semibold mb-5">Card details</h2>
            <div className="space-y-4">
              {CARD_FIELDS.map((f) => (
                <CardFieldInput
                  key={f.key}
                  field={f}
                  value={data[f.key] || ""}
                  photo={f.key === "photo" ? photo : f.key === "logo" ? logo : null}
                  onChange={(v) => setData((d) => ({ ...d, [f.key]: v }))}
                  onPhoto={(file) =>
                    handleImage(file, f.key === "photo" ? setPhoto : setLogo)
                  }
                  showToggle={
                    (f.key === "photo" && !options.showPhoto) ||
                    (f.key === "logo" && !options.showLogo)
                  }
                />
              ))}
            </div>
          </Card>
        </div>

        {/* ── Right: preview ──────────────────────────────────────────────── */}
        <div className="xl:sticky xl:top-6 self-start space-y-4">
          {/* Front / Back tabs */}
          <Tabs
            value={options.side}
            onValueChange={(v) => setOptions((o) => ({ ...o, side: v as "front" | "back" }))}
          >
            <TabsList className="w-full">
              <TabsTrigger value="front" className="flex-1">Front side</TabsTrigger>
              <TabsTrigger value="back" className="flex-1">Back side</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="p-4 bg-gradient-to-br from-accent/30 to-background overflow-hidden">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
              Live preview · {template.orientation === "landscape" ? "85.6 × 54 mm" : "54 × 85.6 mm"}
            </p>
            <div
              className="flex justify-center overflow-hidden rounded-md"
              style={{ minHeight: template.orientation === "portrait" ? 220 : 160 }}
            >
              {/* This div is the visible preview — uses the front ref */}
              <div ref={frontRef} style={{ display: options.side === "front" ? "block" : "none" }}>
                <IDCardPreview
                  templateId={templateId}
                  data={data}
                  photoDataUrl={photo}
                  logoDataUrl={logo}
                  options={{ ...options, side: "front" }}
                  scale={template.orientation === "landscape" ? 0.92 : 0.82}
                />
              </div>
              <div ref={backRef} style={{ display: options.side === "back" ? "block" : "none" }}>
                <IDCardPreview
                  templateId={templateId}
                  data={data}
                  photoDataUrl={photo}
                  logoDataUrl={logo}
                  options={{ ...options, side: "back" }}
                  scale={template.orientation === "landscape" ? 0.92 : 0.82}
                />
              </div>
            </div>

            {requiredMissing.length > 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md mt-4">
                Required fields missing: {requiredMissing.map((f) => f.label).join(", ")}
              </p>
            )}
          </Card>

          {/* Reset */}
          <button
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            onClick={() => {
              clearDraft(templateId);
              setData({});
              setPhoto(null);
              setLogo(null);
              setOptions({ ...DEFAULT_OPTIONS });
            }}
          >
            <RotateCcw className="size-3" /> Reset all
          </button>
        </div>
      </div>

      {/* Off-screen high-res render targets — always in DOM for export.
          NOTE: do NOT use visibility:hidden here — it is an inherited property and would
          cause html2canvas to capture transparent pixels. Use only positional offscreen. */}
      <div style={{ position: "fixed", left: "-99999px", top: 0, pointerEvents: "none" }}>
        <div ref={exportFrontRef}>
          <IDCardPreview
            templateId={templateId}
            data={data}
            photoDataUrl={photo}
            logoDataUrl={logo}
            options={{ ...options, side: "front" }}
            scale={1}
          />
        </div>
        <div ref={exportBackRef} style={{ marginTop: 8 }}>
          <IDCardPreview
            templateId={templateId}
            data={data}
            photoDataUrl={photo}
            logoDataUrl={logo}
            options={{ ...options, side: "back" }}
            scale={1}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Field input component ────────────────────────────────────────────────────

function CardFieldInput({
  field,
  value,
  photo,
  onChange,
  onPhoto,
  showToggle,
}: {
  field: CardField;
  value: string;
  photo: string | null;
  onChange: (v: string) => void;
  onPhoto: (f: File) => void;
  showToggle?: boolean;
}) {
  if (field.type === "image") {
    const isPhoto = field.key === "photo";
    return (
      <div className={`space-y-1.5 ${showToggle ? "opacity-40 pointer-events-none" : ""}`}>
        <Label>
          {field.label}
          {showToggle && (
            <span className="ml-1.5 text-xs text-muted-foreground">(disabled)</span>
          )}
        </Label>
        <label className="flex items-center gap-3 px-3 py-2.5 border border-dashed rounded-md cursor-pointer hover:bg-accent/40 transition-colors">
          {photo ? (
            <img
              src={photo}
              alt=""
              className={`size-12 object-cover shrink-0 ${isPhoto ? "rounded-full" : "rounded"}`}
            />
          ) : (
            <div className={`size-12 bg-accent flex items-center justify-center shrink-0 ${isPhoto ? "rounded-full" : "rounded"}`}>
              <ImageIcon className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 text-sm">
            <div className="font-medium">{photo ? `Replace ${field.label.toLowerCase()}` : `Upload ${field.label.toLowerCase()}`}</div>
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

  return (
    <div className="space-y-1.5">
      <Label>
        {field.label}
        {field.required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
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

// jsPDF v4 reads document.body computed styles on construction. Tailwind CSS v4 uses oklch()
// colors which jsPDF cannot parse. Temporarily set plain hex inline styles to work around this.
function withPlainBodyColor(fn: () => void) {
  const bs = document.body.style;
  const prevBg = bs.backgroundColor;
  const prevColor = bs.color;
  bs.backgroundColor = "#ffffff";
  bs.color = "#000000";
  try {
    fn();
  } finally {
    bs.backgroundColor = prevBg;
    bs.color = prevColor;
  }
}
