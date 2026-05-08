import { useEffect, useRef } from "react";

export type FieldType = "text" | "date" | "image" | "number" | "qr";

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;
}

export interface TemplateLite {
  id: string;
  name: string;
  category: string;
  orientation: "landscape" | "portrait";
  primary_color?: string | null;
  accent_color?: string | null;
  field_manifest: TemplateField[];
}

interface Props {
  template: TemplateLite;
  data: Record<string, string>;
  photoDataUrl?: string | null;
  className?: string;
  /** Render scale to multiply the base 340 px width (landscape) or 240 px (portrait). */
  scale?: number;
}

const ASPECT_LANDSCAPE = 1.586; // CR-80
const BASE_WIDTH = 360;

/**
 * Renders an HTML representation of a card. Used both for live preview
 * and as the source for html2canvas → PNG/PDF export.
 */
export function CardPreview({ template, data, photoDataUrl, className = "", scale = 1 }: Props) {
  const isLandscape = template.orientation === "landscape";
  const width = (isLandscape ? BASE_WIDTH : BASE_WIDTH / ASPECT_LANDSCAPE) * scale;
  const height = (isLandscape ? BASE_WIDTH / ASPECT_LANDSCAPE : BASE_WIDTH) * scale;
  const primary = template.primary_color || "#1f2937";
  const accent = template.accent_color || "#3b82f6";

  const photoField = template.field_manifest.find((f) => f.type === "image");
  const textFields = template.field_manifest.filter((f) => f.type !== "image");
  const primaryField = textFields[0];
  const restFields = textFields.slice(1);

  return (
    <div
      data-card-preview
      className={`relative shadow-xl overflow-hidden rounded-xl text-white ${className}`}
      style={{ width, height, backgroundColor: primary, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: accent }} />

      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase opacity-80">
        <span>Identica</span>
        <span>{template.category}</span>
      </div>

      {/* Body */}
      {isLandscape ? (
        <div className="px-4 pt-3 flex gap-4 items-start">
          {photoField && (
            <PhotoBox photoDataUrl={photoDataUrl} />
          )}
          <div className="flex-1 min-w-0 mt-1">
            <div className="font-display font-bold text-base leading-tight truncate">
              {data[primaryField?.key] || primaryField?.label || ""}
            </div>
            <div className="mt-2 space-y-1.5">
              {restFields.slice(0, 4).map((f) => (
                <div key={f.key} className="text-[10px]">
                  <div className="opacity-60 uppercase tracking-wider text-[8px]">{f.label}</div>
                  <div className="truncate">{data[f.key] || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pt-3 flex flex-col items-center text-center">
          {photoField && <PhotoBox photoDataUrl={photoDataUrl} large />}
          <div className="mt-2 font-display font-bold text-base leading-tight truncate w-full">
            {data[primaryField?.key] || primaryField?.label || ""}
          </div>
          <div className="mt-2 space-y-1 w-full">
            {restFields.slice(0, 3).map((f) => (
              <div key={f.key} className="text-[10px]">
                <span className="opacity-60 uppercase tracking-wider text-[8px] mr-1">{f.label}:</span>
                <span>{data[f.key] || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR */}
      <div className="absolute bottom-3 right-3">
        <QrPlaceholder text={Object.values(data).filter(Boolean).join("|") || template.id} />
      </div>
      <div className="absolute bottom-3 left-3 text-[9px] opacity-70">
        ID#{(data.employee_id || data.student_id || data.staff_id || data.member_id || data.ticket_id || data.badge_id || data.id_number || data.credential_id || "").toString().slice(0, 12) || "—"}
      </div>
    </div>
  );
}

function PhotoBox({ photoDataUrl, large }: { photoDataUrl?: string | null; large?: boolean }) {
  const size = large ? "size-20" : "size-16";
  return (
    <div className={`${size} rounded-md bg-white/15 overflow-hidden flex items-center justify-center text-[9px] opacity-70 shrink-0`}>
      {photoDataUrl ? (
        <img src={photoDataUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span>PHOTO</span>
      )}
    </div>
  );
}

function QrPlaceholder({ text }: { text: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancelled = false;
    import("qrcode").then((QR) => {
      if (cancelled || !ref.current) return;
      QR.toCanvas(ref.current, text || "identica", { width: 56, margin: 0, color: { dark: "#ffffff", light: "#00000000" } }).catch(() => {});
    });
    return () => { cancelled = true; };
  }, [text]);
  return <canvas ref={ref} className="rounded bg-white/10" width={56} height={56} />;
}
