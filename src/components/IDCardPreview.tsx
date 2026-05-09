import { useEffect, useRef } from "react";
import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardFieldType = "text" | "date" | "image" | "number";

export interface CardField {
  key: string;
  label: string;
  type: CardFieldType;
  required?: boolean;
  max?: number;
  placeholder?: string;
}

export interface IDCardTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  orientation: "landscape" | "portrait";
  primaryColor: string;
  accentColor: string;
}

export interface CardOptions {
  showPhoto: boolean;
  showQR: boolean;
  showLogo: boolean;
  side: "front" | "back";
}

export const DEFAULT_OPTIONS: CardOptions = {
  showPhoto: true,
  showQR: true,
  showLogo: true,
  side: "front",
};

// ─── Fields shared by all templates ──────────────────────────────────────────

export const CARD_FIELDS: CardField[] = [
  { key: "full_name", label: "Full Name", type: "text", required: true, max: 40 },
  { key: "title", label: "Job Title / Role", type: "text", required: true, max: 50 },
  { key: "department", label: "Department", type: "text", max: 50 },
  { key: "organization", label: "Organization", type: "text", required: true, max: 50 },
  { key: "employee_id", label: "ID Number", type: "text", required: true, placeholder: "EMP-0001" },
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "valid_until", label: "Valid Until", type: "date" },
  { key: "blood_type", label: "Blood Type", type: "text", placeholder: "A+, B-, O+…" },
  { key: "emergency_contact", label: "Emergency Contact", type: "text" },
  { key: "photo", label: "Profile Photo", type: "image" },
  { key: "logo", label: "Company / Org Logo", type: "image" },
];

// ─── 20 Template definitions ──────────────────────────────────────────────────
// 12 landscape + 8 portrait

export const ID_CARD_TEMPLATES: IDCardTemplate[] = [
  // ── Landscape ──────────────────────────────────────────────────────────────
  {
    id: "minimal-white",
    name: "Minimal White",
    category: "Minimal",
    description: "Ultra-clean white card with slim colored accent bars top and bottom",
    orientation: "landscape",
    primaryColor: "#1f2937",
    accentColor: "#3b82f6",
  },
  {
    id: "corporate-navy",
    name: "Corporate Navy",
    category: "Corporate",
    description: "Navy left panel with clean white content area and photo inset",
    orientation: "landscape",
    primaryColor: "#1e3a5f",
    accentColor: "#60a5fa",
  },
  {
    id: "executive-dark",
    name: "Executive Dark",
    category: "Premium",
    description: "Near-black background with warm gold accents for senior leadership",
    orientation: "landscape",
    primaryColor: "#0a0a0a",
    accentColor: "#f5a623",
  },
  {
    id: "tech-purple",
    name: "Tech Purple",
    category: "Tech",
    description: "Deep purple with neon violet — perfect for engineering and tech teams",
    orientation: "landscape",
    primaryColor: "#3b0764",
    accentColor: "#c084fc",
  },
  {
    id: "modern-red",
    name: "Modern Red",
    category: "Bold",
    description: "Full-bleed vivid red with white text and a circular photo cut-out",
    orientation: "landscape",
    primaryColor: "#991b1b",
    accentColor: "#fca5a5",
  },
  {
    id: "geometric-blue",
    name: "Geometric Blue",
    category: "Modern",
    description: "Royal blue background with angular accent lines and white typography",
    orientation: "landscape",
    primaryColor: "#1d4ed8",
    accentColor: "#bfdbfe",
  },
  {
    id: "cyber-matrix",
    name: "Cyber Matrix",
    category: "Tech",
    description: "Dark terminal aesthetic — near-black with neon green text and data style",
    orientation: "landscape",
    primaryColor: "#0d1117",
    accentColor: "#22c55e",
  },
  {
    id: "gradient-ocean",
    name: "Gradient Ocean",
    category: "Creative",
    description: "Smooth blue-to-teal gradient wash with white text and circular photo",
    orientation: "landscape",
    primaryColor: "#0369a1",
    accentColor: "#0d9488",
  },
  {
    id: "enterprise-teal",
    name: "Enterprise Teal",
    category: "Corporate",
    description: "White card with a bold teal left-edge strip and structured layout",
    orientation: "landscape",
    primaryColor: "#0f766e",
    accentColor: "#2dd4bf",
  },
  {
    id: "classic-formal",
    name: "Classic Formal",
    category: "Classic",
    description: "Traditional white card with double-rule border — formal and official",
    orientation: "landscape",
    primaryColor: "#1e293b",
    accentColor: "#475569",
  },
  {
    id: "diagonal-slash",
    name: "Diagonal Slash",
    category: "Creative",
    description: "Bold diagonal color split between purple and white — striking and modern",
    orientation: "landscape",
    primaryColor: "#6d28d9",
    accentColor: "#ddd6fe",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    category: "Nature",
    description: "Deep forest green background with vibrant leaf-green accent highlights",
    orientation: "landscape",
    primaryColor: "#14532d",
    accentColor: "#4ade80",
  },
  // ── Portrait ───────────────────────────────────────────────────────────────
  {
    id: "portrait-clean",
    name: "Portrait Clean",
    category: "Minimal",
    description: "Clean portrait card — sky-blue top strip, photo circle, centered info",
    orientation: "portrait",
    primaryColor: "#0ea5e9",
    accentColor: "#0369a1",
  },
  {
    id: "portrait-dark",
    name: "Portrait Dark",
    category: "Premium",
    description: "Very dark background with a violet accent ring and centered layout",
    orientation: "portrait",
    primaryColor: "#0f0f1a",
    accentColor: "#7c3aed",
  },
  {
    id: "portrait-gradient",
    name: "Portrait Gradient",
    category: "Creative",
    description: "Purple-to-pink gradient fills the top half, white body below with photo bridge",
    orientation: "portrait",
    primaryColor: "#6d28d9",
    accentColor: "#ec4899",
  },
  {
    id: "portrait-corporate",
    name: "Portrait Corporate",
    category: "Corporate",
    description: "Bold blue header section with photo inset and structured info rows below",
    orientation: "portrait",
    primaryColor: "#1e40af",
    accentColor: "#93c5fd",
  },
  {
    id: "portrait-creative",
    name: "Portrait Creative",
    category: "Creative",
    description: "Full-bleed magenta gradient — vibrant and arresting for creative roles",
    orientation: "portrait",
    primaryColor: "#9d174d",
    accentColor: "#fbcfe8",
  },
  {
    id: "portrait-medical",
    name: "Portrait Medical",
    category: "Healthcare",
    description: "Clean white healthcare ID with blue cross motif and prominent blood type",
    orientation: "portrait",
    primaryColor: "#0284c7",
    accentColor: "#bae6fd",
  },
  {
    id: "portrait-academic",
    name: "Portrait Academic",
    category: "Academic",
    description: "Dark navy with gold accents and a crest area for academic institutions",
    orientation: "portrait",
    primaryColor: "#1e3a5f",
    accentColor: "#fbbf24",
  },
  {
    id: "portrait-luxury",
    name: "Portrait Luxury",
    category: "Premium",
    description: "All-black card with rose-gold name and minimal premium aesthetic",
    orientation: "portrait",
    primaryColor: "#0a0a0a",
    accentColor: "#c9a47e",
  },
];

// ─── Dimensions (CR-80 card ratio) ───────────────────────────────────────────

const LS_W = 360; // landscape base width
const LS_H = 227; // landscape base height
const PT_W = 227; // portrait base width
const PT_H = 360; // portrait base height

// ─── Main component ───────────────────────────────────────────────────────────

interface IDCardPreviewProps {
  templateId: string;
  data: Record<string, string>;
  photoDataUrl?: string | null;
  logoDataUrl?: string | null;
  options?: CardOptions;
  scale?: number;
}

export function IDCardPreview({
  templateId,
  data,
  photoDataUrl,
  logoDataUrl,
  options = DEFAULT_OPTIONS,
  scale = 1,
}: IDCardPreviewProps) {
  const template = ID_CARD_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;

  const isLandscape = template.orientation === "landscape";
  const w = (isLandscape ? LS_W : PT_W) * scale;
  const h = (isLandscape ? LS_H : PT_H) * scale;
  const s = scale;

  const ctx: Ctx = {
    s,
    w,
    h,
    primary: template.primaryColor,
    accent: template.accentColor,
    name: data.full_name || "Full Name",
    title: data.title || "Job Title",
    department: data.department || "",
    organization: data.organization || "Organization",
    employeeId: data.employee_id || "",
    email: data.email || "",
    phone: data.phone || "",
    validUntil: data.valid_until || "",
    bloodType: data.blood_type || "",
    emergencyContact: data.emergency_contact || "",
    photo: photoDataUrl || null,
    logo: logoDataUrl || null,
    showPhoto: options.showPhoto,
    showQR: options.showQR,
    showLogo: options.showLogo,
    qrData:
      [data.full_name, data.employee_id, data.organization].filter(Boolean).join("|") ||
      templateId,
  };

  return (
    <div
      data-card-preview
      style={{
        width: w,
        height: h,
        position: "relative",
        overflow: "hidden",
        borderRadius: `${6 * s}px`,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {options.side === "back" ? renderBack(templateId, ctx) : renderFront(templateId, ctx)}
    </div>
  );
}

// ─── Render context ───────────────────────────────────────────────────────────

interface Ctx {
  s: number;
  w: number;
  h: number;
  primary: string;
  accent: string;
  name: string;
  title: string;
  department: string;
  organization: string;
  employeeId: string;
  email: string;
  phone: string;
  validUntil: string;
  bloodType: string;
  emergencyContact: string;
  photo: string | null;
  logo: string | null;
  showPhoto: boolean;
  showQR: boolean;
  showLogo: boolean;
  qrData: string;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function PhotoCircle({
  photo,
  size,
  showPhoto,
  borderColor = "rgba(255,255,255,0.9)",
  borderW = 2,
}: {
  photo: string | null;
  size: number;
  showPhoto: boolean;
  borderColor?: string;
  borderW?: number;
}) {
  if (!showPhoto) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: `${borderW}px solid ${borderColor}`,
        flexShrink: 0,
        backgroundColor: "rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {photo ? (
        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: size * 0.35, opacity: 0.4, color: "white" }}>●</div>
        </div>
      )}
    </div>
  );
}

function PhotoRect({
  photo,
  w,
  h,
  showPhoto,
  radius = 4,
  borderColor,
  borderW = 0,
}: {
  photo: string | null;
  w: number;
  h: number;
  showPhoto: boolean;
  radius?: number;
  borderColor?: string;
  borderW?: number;
}) {
  if (!showPhoto) return null;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: `${radius}px`,
        overflow: "hidden",
        flexShrink: 0,
        backgroundColor: "rgba(255,255,255,0.12)",
        border: borderColor ? `${borderW}px solid ${borderColor}` : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {photo ? (
        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ fontSize: h * 0.3, opacity: 0.3, color: "white" }}>●</div>
      )}
    </div>
  );
}

function LogoBox({
  logo,
  size,
  showLogo,
  dark = false,
}: {
  logo: string | null;
  size: number;
  showLogo: boolean;
  dark?: boolean;
}) {
  if (!showLogo) return null;
  return (
    <div
      style={{
        width: size,
        height: size * 0.55,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {logo ? (
        <img src={logo} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      ) : (
        <div
          style={{
            fontSize: size * 0.12,
            color: dark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.35)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          LOGO
        </div>
      )}
    </div>
  );
}

function QrBlock({
  data,
  size,
  showQR,
  dark = false,
}: {
  data: string;
  size: number;
  showQR: boolean;
  dark?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!showQR || !ref.current) return;
    let cancelled = false;
    import("qrcode").then((QR) => {
      if (cancelled || !ref.current) return;
      QR.toCanvas(ref.current, data || "id", {
        width: size * 2,
        margin: 1,
        color: { dark: dark ? "#1a1a1a" : "#ffffff", light: "#00000000" },
      }).catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [data, size, showQR, dark]);
  if (!showQR) return null;
  return (
    <canvas
      ref={ref}
      width={size * 2}
      height={size * 2}
      style={{ width: size, height: size, borderRadius: 2 }}
    />
  );
}

function BarcodeStrip({
  value,
  w,
  h,
  dark = false,
}: {
  value: string;
  w: number;
  h: number;
  dark?: boolean;
}) {
  const seed = (value || "0000000000").padEnd(14, "0");
  const bars: { bw: number; gw: number }[] = Array.from(seed).map((ch) => {
    const c = ch.charCodeAt(0);
    return { bw: ((c % 3) + 1) * (w / 70), gw: ((c % 2) + 1) * (w / 140) };
  });
  const color = dark ? "#1a1a1a" : "#ffffff";
  return (
    <div style={{ display: "flex", alignItems: "stretch", height: h, overflow: "hidden" }}>
      {bars.map((b, i) => (
        <React.Fragment key={i}>
          <div style={{ width: b.bw, backgroundColor: color, flexShrink: 0 }} />
          <div style={{ width: b.gw, flexShrink: 0 }} />
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Front renderer dispatcher ────────────────────────────────────────────────

function renderFront(id: string, c: Ctx): React.ReactNode {
  const map: Record<string, (c: Ctx) => React.ReactNode> = {
    "minimal-white": frontMinimalWhite,
    "corporate-navy": frontCorporateNavy,
    "executive-dark": frontExecutiveDark,
    "tech-purple": frontTechPurple,
    "modern-red": frontModernRed,
    "geometric-blue": frontGeometricBlue,
    "cyber-matrix": frontCyberMatrix,
    "gradient-ocean": frontGradientOcean,
    "enterprise-teal": frontEnterpriseTeal,
    "classic-formal": frontClassicFormal,
    "diagonal-slash": frontDiagonalSlash,
    "forest-green": frontForestGreen,
    "portrait-clean": frontPortraitClean,
    "portrait-dark": frontPortraitDark,
    "portrait-gradient": frontPortraitGradient,
    "portrait-corporate": frontPortraitCorporate,
    "portrait-creative": frontPortraitCreative,
    "portrait-medical": frontPortraitMedical,
    "portrait-academic": frontPortraitAcademic,
    "portrait-luxury": frontPortraitLuxury,
  };
  return (map[id] ?? frontMinimalWhite)(c);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FRONT TEMPLATES — LANDSCAPE (12)
// ═══════════════════════════════════════════════════════════════════════════════

// 1 · Minimal White ────────────────────────────────────────────────────────────
function frontMinimalWhite(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", position: "relative" }}>
      <div style={{ height: `${7 * s}px`, backgroundColor: c.accent }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${7 * s}px`, backgroundColor: c.primary }} />
      <div style={{ padding: `${10 * s}px ${14 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center", height: `${c.h - 14 * s}px`, boxSizing: "border-box" as const }}>
        <PhotoCircle photo={c.photo} size={56 * s} showPhoto={c.showPhoto} borderColor={c.accent} borderW={2 * s} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: `${14 * s}px`, fontWeight: 800, color: c.primary, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{c.name}</div>
          <div style={{ fontSize: `${9.5 * s}px`, color: c.accent, fontWeight: 600, marginTop: `${2 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "#6b7280", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ fontSize: `${9 * s}px`, color: "#374151", marginTop: `${4 * s}px`, fontWeight: 500 }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${8 * s}px`, color: "#9ca3af", marginTop: `${2 * s}px` }}>{c.email}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", justifyContent: "space-between", height: "100%", paddingTop: `${2 * s}px`, paddingBottom: `${2 * s}px` }}>
          <LogoBox logo={c.logo} size={36 * s} showLogo={c.showLogo} dark />
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} dark />
          <div style={{ fontSize: `${7 * s}px`, color: "#9ca3af" }}>#{c.employeeId || "—"}</div>
        </div>
      </div>
    </div>
  );
}

// 2 · Corporate Navy ───────────────────────────────────────────────────────────
function frontCorporateNavy(c: Ctx) {
  const s = c.s;
  const leftW = c.w * 0.37;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <div style={{ width: leftW, backgroundColor: c.primary, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: `${10 * s}px ${8 * s}px`, gap: `${8 * s}px` }}>
        <PhotoCircle photo={c.photo} size={58 * s} showPhoto={c.showPhoto} borderColor={c.accent} borderW={2 * s} />
        <LogoBox logo={c.logo} size={38 * s} showLogo={c.showLogo} />
        <div style={{ fontSize: `${7 * s}px`, color: "rgba(255,255,255,0.4)", textAlign: "center" as const }}>#{c.employeeId || "—"}</div>
      </div>
      <div style={{ flex: 1, backgroundColor: "#ffffff", padding: `${14 * s}px ${14 * s}px`, display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
        <div style={{ height: `${3 * s}px`, width: `${32 * s}px`, backgroundColor: c.accent, marginBottom: `${8 * s}px`, borderRadius: `${2 * s}px` }} />
        <div style={{ fontSize: `${15 * s}px`, fontWeight: 800, color: c.primary, lineHeight: 1.15 }}>{c.name}</div>
        <div style={{ fontSize: `${9.5 * s}px`, color: c.accent, fontWeight: 600, marginTop: `${3 * s}px` }}>{c.title}</div>
        {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "#6b7280", marginTop: `${1 * s}px` }}>{c.department}</div>}
        <div style={{ fontSize: `${9 * s}px`, color: "#374151", marginTop: `${6 * s}px`, fontWeight: 500 }}>{c.organization}</div>
        {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${2 * s}px` }}>{c.email}</div>}
        {c.phone && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${1 * s}px` }}>{c.phone}</div>}
        <div style={{ marginTop: "auto", paddingTop: `${6 * s}px` }}>
          <QrBlock data={c.qrData} size={40 * s} showQR={c.showQR} dark />
        </div>
      </div>
    </div>
  );
}

// 3 · Executive Dark ───────────────────────────────────────────────────────────
function frontExecutiveDark(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, position: "relative" }}>
      <div style={{ position: "absolute", top: `${16 * s}px`, left: 0, right: 0, height: `${1 * s}px`, backgroundColor: `${c.accent}44` }} />
      <div style={{ position: "absolute", bottom: `${16 * s}px`, left: 0, right: 0, height: `${1 * s}px`, backgroundColor: `${c.accent}44` }} />
      <div style={{ padding: `${22 * s}px ${18 * s}px`, display: "flex", gap: `${14 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const }}>
        <PhotoRect photo={c.photo} w={56 * s} h={68 * s} showPhoto={c.showPhoto} radius={4 * s} borderColor={c.accent} borderW={1 * s} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: `${15 * s}px`, fontWeight: 800, color: c.accent, letterSpacing: "0.02em", lineHeight: 1.15 }}>{c.name}</div>
          <div style={{ fontSize: `${9.5 * s}px`, color: "rgba(255,255,255,0.65)", marginTop: `${3 * s}px`, fontWeight: 400, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.4)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.55)", marginTop: `${5 * s}px` }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.35)", marginTop: `${3 * s}px` }}>{c.email}</div>}
          {c.validUntil && <div style={{ fontSize: `${7.5 * s}px`, color: `${c.accent}99`, marginTop: `${3 * s}px` }}>Valid: {c.validUntil}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", justifyContent: "space-between", height: "100%", paddingTop: `${4 * s}px`, paddingBottom: `${4 * s}px` }}>
          <LogoBox logo={c.logo} size={40 * s} showLogo={c.showLogo} />
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} />
          <div style={{ fontSize: `${6.5 * s}px`, color: `${c.accent}77` }}>#{c.employeeId || "—"}</div>
        </div>
      </div>
    </div>
  );
}

// 4 · Tech Purple ──────────────────────────────────────────────────────────────
function frontTechPurple(c: Ctx) {
  const s = c.s;
  const mono = "ui-monospace, 'Cascadia Code', monospace";
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: `${60 * s}px`, height: `${60 * s}px`, borderLeft: `${1 * s}px solid ${c.accent}33`, borderBottom: `${1 * s}px solid ${c.accent}33`, borderBottomLeftRadius: `${60 * s}px`, opacity: 0.5 }} />
      <div style={{ padding: `${14 * s}px ${16 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const }}>
        <PhotoCircle photo={c.photo} size={60 * s} showPhoto={c.showPhoto} borderColor={c.accent} borderW={1.5 * s} />
        <div style={{ flex: 1, minWidth: 0, fontFamily: mono }}>
          <div style={{ fontSize: `${7.5 * s}px`, color: `${c.accent}88`, marginBottom: `${2 * s}px` }}>{"// identity.card"}</div>
          <div style={{ fontSize: `${14 * s}px`, fontWeight: 700, color: c.accent, letterSpacing: "0.01em" }}>{c.name}</div>
          <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${2 * s}px` }}>{"> "}{c.title}</div>
          {c.department && <div style={{ fontSize: `${8 * s}px`, color: "rgba(255,255,255,0.35)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.6)", marginTop: `${4 * s}px` }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.3)", marginTop: `${2 * s}px` }}>{c.email}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", justifyContent: "space-between", height: "100%", paddingTop: `${4 * s}px`, paddingBottom: `${4 * s}px` }}>
          <LogoBox logo={c.logo} size={36 * s} showLogo={c.showLogo} />
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} />
          <div style={{ fontSize: `${6.5 * s}px`, color: `${c.accent}55`, fontFamily: mono }}>#{c.employeeId || "—"}</div>
        </div>
      </div>
    </div>
  );
}

// 5 · Modern Red ───────────────────────────────────────────────────────────────
function frontModernRed(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, position: "relative" }}>
      <div style={{ position: "absolute", top: `${10 * s}px`, right: `${12 * s}px` }}>
        <LogoBox logo={c.logo} size={38 * s} showLogo={c.showLogo} />
      </div>
      <div style={{ padding: `${14 * s}px ${16 * s}px`, display: "flex", gap: `${14 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const }}>
        <PhotoCircle photo={c.photo} size={70 * s} showPhoto={c.showPhoto} borderColor="rgba(255,255,255,0.8)" borderW={3 * s} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${15 * s}px`, fontWeight: 900, color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.01em" }}>{c.name}</div>
          <div style={{ fontSize: `${9.5 * s}px`, color: c.accent, fontWeight: 600, marginTop: `${3 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.55)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.8)", marginTop: `${5 * s}px`, fontWeight: 500 }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.4)", marginTop: `${2 * s}px` }}>{c.email}</div>}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: `${6 * s}px` }}>
            <div style={{ fontSize: `${7 * s}px`, color: "rgba(255,255,255,0.35)" }}>#{c.employeeId || "—"}</div>
            <QrBlock data={c.qrData} size={36 * s} showQR={c.showQR} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 6 · Geometric Blue ──────────────────────────────────────────────────────────
function frontGeometricBlue(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, position: "relative", overflow: "hidden" }}>
      {/* Geometric decoration */}
      <div style={{ position: "absolute", top: `-${20 * s}px`, right: `-${20 * s}px`, width: `${80 * s}px`, height: `${80 * s}px`, border: `${8 * s}px solid ${c.accent}22`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: `-${15 * s}px`, left: `${100 * s}px`, width: `${50 * s}px`, height: `${50 * s}px`, border: `${4 * s}px solid ${c.accent}18`, transform: "rotate(45deg)" }} />
      <div style={{ padding: `${14 * s}px ${16 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const, position: "relative" }}>
        <PhotoCircle photo={c.photo} size={62 * s} showPhoto={c.showPhoto} borderColor={c.accent} borderW={2 * s} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${14 * s}px`, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>{c.name}</div>
          <div style={{ fontSize: `${9.5 * s}px`, color: c.accent, fontWeight: 600, marginTop: `${2 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.75)", marginTop: `${5 * s}px` }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.4)", marginTop: `${2 * s}px` }}>{c.email}</div>}
          <div style={{ fontSize: `${7 * s}px`, color: "rgba(255,255,255,0.3)", marginTop: `${3 * s}px` }}>#{c.employeeId || "—"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", justifyContent: "space-between", height: "100%", paddingTop: `${4 * s}px`, paddingBottom: `${4 * s}px` }}>
          <LogoBox logo={c.logo} size={36 * s} showLogo={c.showLogo} />
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} />
        </div>
      </div>
    </div>
  );
}

// 7 · Cyber Matrix ────────────────────────────────────────────────────────────
function frontCyberMatrix(c: Ctx) {
  const s = c.s;
  const mono = "ui-monospace, 'Cascadia Code', monospace";
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: `${3 * s}px`, backgroundColor: c.accent }} />
      <div style={{ padding: `${14 * s}px ${16 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const }}>
        <PhotoRect photo={c.photo} w={54 * s} h={66 * s} showPhoto={c.showPhoto} radius={2 * s} borderColor={c.accent} borderW={1 * s} />
        <div style={{ flex: 1, fontFamily: mono }}>
          <div style={{ fontSize: `${7 * s}px`, color: `${c.accent}55`, marginBottom: `${3 * s}px` }}>$ whoami</div>
          <div style={{ fontSize: `${14 * s}px`, fontWeight: 700, color: c.accent }}>{c.name}</div>
          <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${2 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8 * s}px`, color: "rgba(255,255,255,0.3)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ height: `${1 * s}px`, backgroundColor: `${c.accent}33`, margin: `${6 * s}px 0` }} />
          <div style={{ fontSize: `${8 * s}px`, color: "rgba(255,255,255,0.5)" }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.3)", marginTop: `${1 * s}px` }}>{c.email}</div>}
          <div style={{ fontSize: `${6.5 * s}px`, color: `${c.accent}44`, marginTop: `${4 * s}px` }}>id: {c.employeeId || "—"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", justifyContent: "space-between", height: "100%", paddingTop: `${4 * s}px`, paddingBottom: `${4 * s}px` }}>
          <LogoBox logo={c.logo} size={34 * s} showLogo={c.showLogo} />
          <QrBlock data={c.qrData} size={42 * s} showQR={c.showQR} />
        </div>
      </div>
    </div>
  );
}

// 8 · Gradient Ocean ──────────────────────────────────────────────────────────
function frontGradientOcean(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${c.primary} 0%, ${c.accent} 100%)`, position: "relative" }}>
      <div style={{ padding: `${14 * s}px ${16 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const }}>
        <PhotoCircle photo={c.photo} size={64 * s} showPhoto={c.showPhoto} borderColor="rgba(255,255,255,0.8)" borderW={2.5 * s} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${15 * s}px`, fontWeight: 800, color: "#ffffff", lineHeight: 1.15 }}>{c.name}</div>
          <div style={{ fontSize: `${9.5 * s}px`, color: "rgba(255,255,255,0.8)", fontWeight: 500, marginTop: `${2 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.55)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.9)", marginTop: `${5 * s}px`, fontWeight: 600 }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${2 * s}px` }}>{c.email}</div>}
          {c.phone && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${1 * s}px` }}>{c.phone}</div>}
          <div style={{ fontSize: `${7 * s}px`, color: "rgba(255,255,255,0.35)", marginTop: `${3 * s}px` }}>#{c.employeeId || "—"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", justifyContent: "space-between", height: "100%", paddingTop: `${4 * s}px`, paddingBottom: `${4 * s}px` }}>
          <LogoBox logo={c.logo} size={36 * s} showLogo={c.showLogo} />
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} />
        </div>
      </div>
    </div>
  );
}

// 9 · Enterprise Teal ─────────────────────────────────────────────────────────
function frontEnterpriseTeal(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", display: "flex" }}>
      <div style={{ width: `${8 * s}px`, backgroundColor: c.primary, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: `${12 * s}px ${14 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center" }}>
        <PhotoCircle photo={c.photo} size={60 * s} showPhoto={c.showPhoto} borderColor={c.primary} borderW={2 * s} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: `${14 * s}px`, fontWeight: 800, color: c.primary, lineHeight: 1.2 }}>{c.name}</div>
          <div style={{ fontSize: `${9.5 * s}px`, color: c.accent, fontWeight: 600, marginTop: `${2 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "#6b7280", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ fontSize: `${9 * s}px`, color: "#374151", marginTop: `${4 * s}px`, fontWeight: 500 }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${2 * s}px` }}>{c.email}</div>}
          {c.phone && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${1 * s}px` }}>{c.phone}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", justifyContent: "space-between", height: "100%", paddingTop: `${2 * s}px`, paddingBottom: `${2 * s}px` }}>
          <LogoBox logo={c.logo} size={38 * s} showLogo={c.showLogo} dark />
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} dark />
          <div style={{ fontSize: `${7 * s}px`, color: "#9ca3af" }}>#{c.employeeId || "—"}</div>
        </div>
      </div>
    </div>
  );
}

// 10 · Classic Formal ─────────────────────────────────────────────────────────
function frontClassicFormal(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", position: "relative" }}>
      <div style={{ position: "absolute", inset: `${4 * s}px`, border: `${1.5 * s}px solid ${c.primary}`, borderRadius: `${3 * s}px` }} />
      <div style={{ position: "absolute", inset: `${8 * s}px`, border: `${0.5 * s}px solid ${c.primary}55`, borderRadius: `${2 * s}px` }} />
      <div style={{ padding: `${16 * s}px ${18 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: `${6 * s}px`, flexShrink: 0 }}>
          <LogoBox logo={c.logo} size={40 * s} showLogo={c.showLogo} dark />
          <PhotoRect photo={c.photo} w={52 * s} h={64 * s} showPhoto={c.showPhoto} radius={2 * s} borderColor={c.primary} borderW={1 * s} />
          <div style={{ fontSize: `${6.5 * s}px`, color: "#9ca3af" }}>#{c.employeeId || "—"}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${7.5 * s}px`, textTransform: "uppercase" as const, letterSpacing: "0.2em", color: "#9ca3af", marginBottom: `${4 * s}px` }}>{c.organization}</div>
          <div style={{ fontSize: `${15 * s}px`, fontWeight: 700, color: c.primary, lineHeight: 1.2 }}>{c.name}</div>
          <div style={{ height: `${1 * s}px`, backgroundColor: c.primary, margin: `${5 * s}px 0`, opacity: 0.2 }} />
          <div style={{ fontSize: `${9 * s}px`, color: "#374151", fontWeight: 500 }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "#6b7280", marginTop: `${1 * s}px` }}>{c.department}</div>}
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${4 * s}px` }}>{c.email}</div>}
          {c.phone && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${1 * s}px` }}>{c.phone}</div>}
          {c.validUntil && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${3 * s}px` }}>Valid: {c.validUntil}</div>}
          <div style={{ marginTop: "auto", paddingTop: `${6 * s}px` }}>
            <QrBlock data={c.qrData} size={36 * s} showQR={c.showQR} dark />
          </div>
        </div>
      </div>
    </div>
  );
}

// 11 · Diagonal Slash ─────────────────────────────────────────────────────────
function frontDiagonalSlash(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Purple triangle */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: `${c.h}px ${c.w * 0.55}px 0 0`, borderColor: `${c.primary} transparent transparent transparent` }} />
      <div style={{ padding: `${14 * s}px ${16 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: `${8 * s}px` }}>
          <PhotoCircle photo={c.photo} size={62 * s} showPhoto={c.showPhoto} borderColor="rgba(255,255,255,0.85)" borderW={2.5 * s} />
          <LogoBox logo={c.logo} size={36 * s} showLogo={c.showLogo} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${15 * s}px`, fontWeight: 900, color: "#ffffff", lineHeight: 1.15, textShadow: `${1 * s}px ${1 * s}px ${3 * s}px rgba(0,0,0,0.3)` }}>{c.name}</div>
          <div style={{ fontSize: `${9 * s}px`, color: c.accent, fontWeight: 600, marginTop: `${2 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8 * s}px`, color: "rgba(255,255,255,0.65)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.75)", marginTop: `${4 * s}px` }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7 * s}px`, color: "rgba(255,255,255,0.45)", marginTop: `${2 * s}px` }}>{c.email}</div>}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: `${6 * s}px` }}>
            <div style={{ fontSize: `${6.5 * s}px`, color: "rgba(255,255,255,0.35)" }}>#{c.employeeId || "—"}</div>
            <QrBlock data={c.qrData} size={36 * s} showQR={c.showQR} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 12 · Forest Green ───────────────────────────────────────────────────────────
function frontForestGreen(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: `${5 * s}px`, backgroundColor: c.accent }} />
      <div style={{ padding: `${16 * s}px ${16 * s}px`, display: "flex", gap: `${12 * s}px`, alignItems: "center", height: "100%", boxSizing: "border-box" as const }}>
        <PhotoCircle photo={c.photo} size={64 * s} showPhoto={c.showPhoto} borderColor={c.accent} borderW={2 * s} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${14 * s}px`, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>{c.name}</div>
          <div style={{ fontSize: `${9.5 * s}px`, color: c.accent, fontWeight: 600, marginTop: `${2 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          <div style={{ height: `${1 * s}px`, backgroundColor: `${c.accent}44`, margin: `${5 * s}px 0` }} />
          <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.4)", marginTop: `${2 * s}px` }}>{c.email}</div>}
          <div style={{ fontSize: `${7 * s}px`, color: `${c.accent}77`, marginTop: `${3 * s}px` }}>#{c.employeeId || "—"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", justifyContent: "space-between", height: "100%", paddingTop: `${4 * s}px`, paddingBottom: `${4 * s}px` }}>
          <LogoBox logo={c.logo} size={36 * s} showLogo={c.showLogo} />
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FRONT TEMPLATES — PORTRAIT (8)
// ═══════════════════════════════════════════════════════════════════════════════

// 13 · Portrait Clean ─────────────────────────────────────────────────────────
function frontPortraitClean(c: Ctx) {
  const s = c.s;
  const headerH = c.h * 0.32;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff" }}>
      <div style={{ height: headerH, backgroundColor: c.primary, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "flex-end", paddingBottom: `${34 * s}px` }}>
        <LogoBox logo={c.logo} size={50 * s} showLogo={c.showLogo} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: `${-28 * s}px`, position: "relative" }}>
        <PhotoCircle photo={c.photo} size={56 * s} showPhoto={c.showPhoto} borderColor="#ffffff" borderW={3 * s} />
      </div>
      <div style={{ textAlign: "center" as const, padding: `${8 * s}px ${16 * s}px ${10 * s}px` }}>
        <div style={{ fontSize: `${13 * s}px`, fontWeight: 800, color: "#1f2937", lineHeight: 1.2 }}>{c.name}</div>
        <div style={{ fontSize: `${9 * s}px`, color: c.primary, fontWeight: 600, marginTop: `${3 * s}px` }}>{c.title}</div>
        {c.department && <div style={{ fontSize: `${8 * s}px`, color: "#6b7280", marginTop: `${1 * s}px` }}>{c.department}</div>}
        <div style={{ height: `${1 * s}px`, backgroundColor: "#e5e7eb", margin: `${8 * s}px auto`, width: "60%" }} />
        <div style={{ fontSize: `${8.5 * s}px`, color: "#374151", fontWeight: 500 }}>{c.organization}</div>
        {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${3 * s}px` }}>{c.email}</div>}
        {c.phone && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${1 * s}px` }}>{c.phone}</div>}
        {c.validUntil && <div style={{ fontSize: `${7 * s}px`, color: "#9ca3af", marginTop: `${3 * s}px` }}>Valid: {c.validUntil}</div>}
        <div style={{ display: "flex", justifyContent: "center", gap: `${10 * s}px`, alignItems: "center", marginTop: `${10 * s}px` }}>
          <div style={{ fontSize: `${7 * s}px`, color: "#d1d5db" }}>#{c.employeeId || "—"}</div>
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} dark />
        </div>
      </div>
    </div>
  );
}

// 14 · Portrait Dark ──────────────────────────────────────────────────────────
function frontPortraitDark(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, display: "flex", flexDirection: "column" as const, alignItems: "center", padding: `${18 * s}px ${16 * s}px`, boxSizing: "border-box" as const }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: `${14 * s}px` }}>
        <LogoBox logo={c.logo} size={44 * s} showLogo={c.showLogo} />
        <div style={{ fontSize: `${7 * s}px`, color: `${c.accent}66` }}>#{c.employeeId || "—"}</div>
      </div>
      <div style={{ border: `${3 * s}px solid ${c.accent}`, borderRadius: "50%", padding: `${3 * s}px` }}>
        <PhotoCircle photo={c.photo} size={64 * s} showPhoto={c.showPhoto} borderColor="transparent" borderW={0} />
      </div>
      <div style={{ height: `${2 * s}px`, width: `${40 * s}px`, backgroundColor: c.accent, borderRadius: `${1 * s}px`, margin: `${12 * s}px 0 ${8 * s}px` }} />
      <div style={{ textAlign: "center" as const }}>
        <div style={{ fontSize: `${14 * s}px`, fontWeight: 800, color: "#ffffff", lineHeight: 1.15 }}>{c.name}</div>
        <div style={{ fontSize: `${9 * s}px`, color: c.accent, fontWeight: 600, marginTop: `${3 * s}px` }}>{c.title}</div>
        {c.department && <div style={{ fontSize: `${8 * s}px`, color: "rgba(255,255,255,0.4)", marginTop: `${1 * s}px` }}>{c.department}</div>}
        <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.65)", marginTop: `${6 * s}px` }}>{c.organization}</div>
        {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.35)", marginTop: `${3 * s}px` }}>{c.email}</div>}
      </div>
      <div style={{ marginTop: "auto" }}>
        <QrBlock data={c.qrData} size={48 * s} showQR={c.showQR} />
      </div>
    </div>
  );
}

// 15 · Portrait Gradient ──────────────────────────────────────────────────────
function frontPortraitGradient(c: Ctx) {
  const s = c.s;
  const gradH = c.h * 0.44;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", position: "relative" }}>
      <div style={{ height: gradH, background: `linear-gradient(160deg, ${c.primary} 0%, ${c.accent} 100%)`, position: "relative" }}>
        <div style={{ position: "absolute", top: `${10 * s}px`, left: `${12 * s}px`, right: `${12 * s}px`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <LogoBox logo={c.logo} size={44 * s} showLogo={c.showLogo} />
          <div style={{ fontSize: `${7 * s}px`, color: "rgba(255,255,255,0.5)" }}>#{c.employeeId || "—"}</div>
        </div>
        <div style={{ position: "absolute", bottom: `-${30 * s}px`, left: "50%", transform: "translateX(-50%)" }}>
          <PhotoCircle photo={c.photo} size={60 * s} showPhoto={c.showPhoto} borderColor="#ffffff" borderW={3 * s} />
        </div>
      </div>
      <div style={{ paddingTop: `${36 * s}px`, textAlign: "center" as const, padding: `${36 * s}px ${16 * s}px ${12 * s}px` }}>
        <div style={{ fontSize: `${13 * s}px`, fontWeight: 800, color: "#1f2937", lineHeight: 1.2 }}>{c.name}</div>
        <div style={{ fontSize: `${9 * s}px`, color: c.primary, fontWeight: 600, marginTop: `${3 * s}px` }}>{c.title}</div>
        {c.department && <div style={{ fontSize: `${8 * s}px`, color: "#6b7280", marginTop: `${1 * s}px` }}>{c.department}</div>}
        <div style={{ height: `${1 * s}px`, backgroundColor: "#f3f4f6", margin: `${8 * s}px auto`, width: "70%" }} />
        <div style={{ fontSize: `${9 * s}px`, color: "#374151", fontWeight: 600 }}>{c.organization}</div>
        {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${3 * s}px` }}>{c.email}</div>}
        {c.phone && <div style={{ fontSize: `${7.5 * s}px`, color: "#9ca3af", marginTop: `${1 * s}px` }}>{c.phone}</div>}
        <div style={{ display: "flex", justifyContent: "center", marginTop: `${10 * s}px` }}>
          <QrBlock data={c.qrData} size={46 * s} showQR={c.showQR} dark />
        </div>
      </div>
    </div>
  );
}

// 16 · Portrait Corporate ─────────────────────────────────────────────────────
function frontPortraitCorporate(c: Ctx) {
  const s = c.s;
  const headerH = c.h * 0.36;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#f8fafc" }}>
      <div style={{ height: headerH, backgroundColor: c.primary, padding: `${14 * s}px ${14 * s}px`, display: "flex", flexDirection: "column" as const, justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <LogoBox logo={c.logo} size={44 * s} showLogo={c.showLogo} />
          <PhotoCircle photo={c.photo} size={52 * s} showPhoto={c.showPhoto} borderColor={c.accent} borderW={2 * s} />
        </div>
        <div>
          <div style={{ fontSize: `${8 * s}px`, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${2 * s}px` }}>Authorized Personnel</div>
          <div style={{ height: `${1 * s}px`, backgroundColor: c.accent, opacity: 0.6 }} />
        </div>
      </div>
      <div style={{ padding: `${12 * s}px ${14 * s}px` }}>
        <div style={{ fontSize: `${14 * s}px`, fontWeight: 800, color: "#1e293b", lineHeight: 1.2 }}>{c.name}</div>
        <div style={{ fontSize: `${9.5 * s}px`, color: c.primary, fontWeight: 600, marginTop: `${3 * s}px` }}>{c.title}</div>
        {c.department && <div style={{ fontSize: `${8.5 * s}px`, color: "#64748b", marginTop: `${1 * s}px` }}>{c.department}</div>}
        <div style={{ height: `${1 * s}px`, backgroundColor: "#e2e8f0", margin: `${8 * s}px 0` }} />
        <div style={{ fontSize: `${8.5 * s}px`, color: "#374151" }}>{c.organization}</div>
        {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "#94a3b8", marginTop: `${3 * s}px` }}>{c.email}</div>}
        {c.phone && <div style={{ fontSize: `${7.5 * s}px`, color: "#94a3b8", marginTop: `${1 * s}px` }}>{c.phone}</div>}
        {c.validUntil && <div style={{ fontSize: `${7.5 * s}px`, color: "#94a3b8", marginTop: `${3 * s}px` }}>Valid: {c.validUntil}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: `${12 * s}px` }}>
          <div style={{ fontSize: `${7 * s}px`, color: "#cbd5e1" }}>#{c.employeeId || "—"}</div>
          <QrBlock data={c.qrData} size={46 * s} showQR={c.showQR} dark />
        </div>
      </div>
    </div>
  );
}

// 17 · Portrait Creative ──────────────────────────────────────────────────────
function frontPortraitCreative(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", background: `linear-gradient(200deg, ${c.primary} 0%, #6d28d9 60%, ${c.accent}44 100%)`, display: "flex", flexDirection: "column" as const, alignItems: "center", padding: `${16 * s}px`, boxSizing: "border-box" as const }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: `${14 * s}px` }}>
        <LogoBox logo={c.logo} size={42 * s} showLogo={c.showLogo} />
        <div style={{ fontSize: `${7 * s}px`, color: "rgba(255,255,255,0.4)" }}>#{c.employeeId || "—"}</div>
      </div>
      <div style={{ border: `${3 * s}px solid rgba(255,255,255,0.8)`, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
        <PhotoCircle photo={c.photo} size={68 * s} showPhoto={c.showPhoto} borderColor="transparent" borderW={0} />
      </div>
      <div style={{ textAlign: "center" as const, marginTop: `${14 * s}px`, flex: 1 }}>
        <div style={{ fontSize: `${15 * s}px`, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>{c.name}</div>
        <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.75)", marginTop: `${3 * s}px` }}>{c.title}</div>
        {c.department && <div style={{ fontSize: `${8 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${1 * s}px` }}>{c.department}</div>}
        <div style={{ height: `${1 * s}px`, backgroundColor: "rgba(255,255,255,0.25)", margin: `${8 * s}px auto`, width: "60%" }} />
        <div style={{ fontSize: `${9 * s}px`, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{c.organization}</div>
        {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.45)", marginTop: `${4 * s}px` }}>{c.email}</div>}
      </div>
      <QrBlock data={c.qrData} size={46 * s} showQR={c.showQR} />
    </div>
  );
}

// 18 · Portrait Medical ───────────────────────────────────────────────────────
function frontPortraitMedical(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", position: "relative" }}>
      {/* Top bar */}
      <div style={{ height: `${32 * s}px`, backgroundColor: c.primary, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${12 * s}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: `${6 * s}px` }}>
          {/* Cross */}
          <div style={{ position: "relative", width: `${16 * s}px`, height: `${16 * s}px` }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: `${5 * s}px`, backgroundColor: "#ffffff", transform: "translateY(-50%)" }} />
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: `${5 * s}px`, backgroundColor: "#ffffff", transform: "translateX(-50%)" }} />
          </div>
          <div style={{ fontSize: `${8.5 * s}px`, color: "#ffffff", fontWeight: 700, letterSpacing: "0.05em" }}>MEDICAL ID</div>
        </div>
        <LogoBox logo={c.logo} size={34 * s} showLogo={c.showLogo} />
      </div>
      <div style={{ padding: `${12 * s}px`, textAlign: "center" as const }}>
        <PhotoCircle photo={c.photo} size={56 * s} showPhoto={c.showPhoto} borderColor={c.primary} borderW={2 * s} />
        <div style={{ marginTop: `${8 * s}px`, fontSize: `${13 * s}px`, fontWeight: 800, color: "#1e293b" }}>{c.name}</div>
        <div style={{ fontSize: `${9 * s}px`, color: c.primary, fontWeight: 600, marginTop: `${2 * s}px` }}>{c.title}</div>
        {c.department && <div style={{ fontSize: `${8 * s}px`, color: "#64748b", marginTop: `${1 * s}px` }}>{c.department}</div>}
        <div style={{ height: `${1 * s}px`, backgroundColor: "#e2e8f0", margin: `${8 * s}px 0` }} />
        <div style={{ fontSize: `${8.5 * s}px`, color: "#334155" }}>{c.organization}</div>
        {c.bloodType && (
          <div style={{ display: "inline-block", backgroundColor: c.primary, color: "#ffffff", borderRadius: `${3 * s}px`, padding: `${2 * s}px ${8 * s}px`, fontSize: `${9 * s}px`, fontWeight: 700, marginTop: `${6 * s}px` }}>
            Blood: {c.bloodType}
          </div>
        )}
        {c.emergencyContact && (
          <div style={{ fontSize: `${7.5 * s}px`, color: "#64748b", marginTop: `${4 * s}px` }}>Emergency: {c.emergencyContact}</div>
        )}
        {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "#94a3b8", marginTop: `${3 * s}px` }}>{c.email}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: `${10 * s}px` }}>
          <div style={{ fontSize: `${7 * s}px`, color: "#cbd5e1" }}>#{c.employeeId || "—"}</div>
          <QrBlock data={c.qrData} size={42 * s} showQR={c.showQR} dark />
        </div>
      </div>
    </div>
  );
}

// 19 · Portrait Academic ──────────────────────────────────────────────────────
function frontPortraitAcademic(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, position: "relative" }}>
      <div style={{ height: `${8 * s}px`, backgroundColor: c.accent }} />
      <div style={{ padding: `${12 * s}px`, display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
        {/* Crest area */}
        <div style={{ width: `${44 * s}px`, height: `${44 * s}px`, borderRadius: "50%", border: `${2 * s}px solid ${c.accent}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: `${8 * s}px`, overflow: "hidden" }}>
          {c.showLogo && c.logo ? (
            <img src={c.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ fontSize: `${10 * s}px`, color: c.accent, fontWeight: 700 }}>✦</div>
          )}
        </div>
        <div style={{ fontSize: `${7.5 * s}px`, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.2em", marginBottom: `${4 * s}px` }}>{c.organization}</div>
        <div style={{ height: `${1 * s}px`, width: `${60 * s}px`, backgroundColor: `${c.accent}55`, marginBottom: `${10 * s}px` }} />
        <PhotoCircle photo={c.photo} size={60 * s} showPhoto={c.showPhoto} borderColor={c.accent} borderW={2 * s} />
        <div style={{ textAlign: "center" as const, marginTop: `${10 * s}px` }}>
          <div style={{ fontSize: `${13 * s}px`, fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>{c.name}</div>
          <div style={{ fontSize: `${9 * s}px`, color: c.accent, marginTop: `${2 * s}px` }}>{c.title}</div>
          {c.department && <div style={{ fontSize: `${8 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${1 * s}px` }}>{c.department}</div>}
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.35)", marginTop: `${5 * s}px` }}>{c.email}</div>}
          {c.validUntil && <div style={{ fontSize: `${7 * s}px`, color: `${c.accent}99`, marginTop: `${3 * s}px` }}>Valid: {c.validUntil}</div>}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: `${10 * s}px`, left: 0, right: 0, display: "flex", justifyContent: "center", gap: `${12 * s}px`, alignItems: "center" }}>
        <div style={{ fontSize: `${6.5 * s}px`, color: `${c.accent}55` }}>#{c.employeeId || "—"}</div>
        <QrBlock data={c.qrData} size={38 * s} showQR={c.showQR} />
      </div>
    </div>
  );
}

// 20 · Portrait Luxury ────────────────────────────────────────────────────────
function frontPortraitLuxury(c: Ctx) {
  const s = c.s;
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.primary, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: `${16 * s}px`, boxSizing: "border-box" as const }}>
      <div style={{ position: "absolute", top: `${12 * s}px`, left: `${14 * s}px`, right: `${14 * s}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <LogoBox logo={c.logo} size={44 * s} showLogo={c.showLogo} />
        <div style={{ fontSize: `${7 * s}px`, color: `${c.accent}66`, letterSpacing: "0.15em" }}>{c.employeeId || "—"}</div>
      </div>
      <PhotoCircle photo={c.photo} size={66 * s} showPhoto={c.showPhoto} borderColor={c.accent} borderW={1.5 * s} />
      <div style={{ width: `${50 * s}px`, height: `${1 * s}px`, backgroundColor: c.accent, margin: `${12 * s}px 0`, opacity: 0.6 }} />
      <div style={{ textAlign: "center" as const }}>
        <div style={{ fontSize: `${15 * s}px`, fontWeight: 300, color: c.accent, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{c.name}</div>
        <div style={{ fontSize: `${8.5 * s}px`, color: "rgba(255,255,255,0.5)", marginTop: `${5 * s}px`, letterSpacing: "0.08em" }}>{c.title}</div>
        {c.department && <div style={{ fontSize: `${7.5 * s}px`, color: "rgba(255,255,255,0.3)", marginTop: `${1 * s}px` }}>{c.department}</div>}
        <div style={{ fontSize: `${8 * s}px`, color: `${c.accent}99`, marginTop: `${8 * s}px`, letterSpacing: "0.1em" }}>{c.organization}</div>
        {c.email && <div style={{ fontSize: `${7 * s}px`, color: "rgba(255,255,255,0.25)", marginTop: `${4 * s}px` }}>{c.email}</div>}
      </div>
      <div style={{ position: "absolute", bottom: `${12 * s}px`, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <QrBlock data={c.qrData} size={40 * s} showQR={c.showQR} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACK SIDES
// ═══════════════════════════════════════════════════════════════════════════════

function renderBack(id: string, c: Ctx): React.ReactNode {
  const template = ID_CARD_TEMPLATES.find((t) => t.id === id)!;
  const isDark = isDarkColor(template.primaryColor);
  const isPortrait = template.orientation === "portrait";
  return isPortrait ? renderBackPortrait(c, isDark) : renderBackLandscape(c, isDark);
}

function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function renderBackLandscape(c: Ctx, isDark: boolean) {
  const s = c.s;
  const bg = isDark ? c.primary : "#f1f5f9";
  const text = isDark ? "rgba(255,255,255,0.85)" : "#1f2937";
  const sub = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const borderCol = isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0";
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: bg, position: "relative" }}>
      {/* Magnetic stripe */}
      <div style={{ height: `${24 * s}px`, backgroundColor: "#0a0a0a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: `${3 * s}px`, left: 0, right: 0, height: `${7 * s}px`, backgroundColor: "#141414" }} />
        <div style={{ position: "absolute", top: `${12 * s}px`, left: 0, right: 0, height: `${5 * s}px`, backgroundColor: "#111" }} />
        <div style={{ position: "absolute", top: `${19 * s}px`, left: 0, right: 0, height: `${3 * s}px`, backgroundColor: "#141414" }} />
      </div>
      {/* Signature strip */}
      <div style={{ margin: `${5 * s}px ${10 * s}px`, padding: `${3 * s}px ${8 * s}px`, backgroundColor: "rgba(255,255,255,0.9)", borderRadius: `${2 * s}px`, border: `${0.5 * s}px solid ${borderCol}`, display: "flex", alignItems: "center", gap: `${8 * s}px` }}>
        <div style={{ fontSize: `${6.5 * s}px`, color: "#9ca3af", flexShrink: 0, fontStyle: "italic" }}>Authorized Signature</div>
        <div style={{ flex: 1, height: `${1 * s}px`, backgroundColor: "#e5e7eb" }} />
        <div style={{ fontSize: `${7 * s}px`, color: "#9ca3af", fontStyle: "italic" }}>{c.name.split(" ")[0]}</div>
      </div>
      {/* Main area */}
      <div style={{ display: "flex", padding: `${4 * s}px ${10 * s}px`, gap: `${10 * s}px`, alignItems: "flex-start" }}>
        {/* Barcode */}
        <div>
          <BarcodeStrip value={c.employeeId || "0000000"} w={90 * s} h={28 * s} dark={!isDark} />
          <div style={{ fontSize: `${6 * s}px`, color: sub, textAlign: "center" as const, marginTop: `${2 * s}px`, letterSpacing: "0.1em" }}>
            {(c.employeeId || "0000000").split("").join(" ")}
          </div>
        </div>
        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${7 * s}px`, color: sub, marginBottom: `${3 * s}px` }}>If found, please return to:</div>
          <div style={{ fontSize: `${9 * s}px`, color: text, fontWeight: 700 }}>{c.organization}</div>
          {c.email && <div style={{ fontSize: `${7.5 * s}px`, color: sub, marginTop: `${1 * s}px` }}>{c.email}</div>}
          {c.phone && <div style={{ fontSize: `${7.5 * s}px`, color: sub }}>{c.phone}</div>}
          {c.emergencyContact && (
            <div style={{ marginTop: `${4 * s}px`, fontSize: `${7 * s}px`, color: sub }}>
              Emergency: <span style={{ color: text, fontWeight: 600 }}>{c.emergencyContact}</span>
            </div>
          )}
          {c.validUntil && <div style={{ fontSize: `${7 * s}px`, color: sub, marginTop: `${3 * s}px` }}>Valid until: {c.validUntil}</div>}
        </div>
        {/* QR + Logo */}
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: `${4 * s}px` }}>
          <QrBlock data={c.qrData} size={44 * s} showQR={c.showQR} dark={!isDark} />
          <LogoBox logo={c.logo} size={34 * s} showLogo={c.showLogo} dark={!isDark} />
        </div>
      </div>
      {/* Fine print */}
      <div style={{ position: "absolute", bottom: `${5 * s}px`, left: `${10 * s}px`, right: `${10 * s}px`, fontSize: `${5.5 * s}px`, color: sub, textAlign: "center" as const, lineHeight: 1.4 }}>
        This card is the property of {c.organization}. Unauthorized use is strictly prohibited. Card No: {c.employeeId || "N/A"}
      </div>
    </div>
  );
}

function renderBackPortrait(c: Ctx, isDark: boolean) {
  const s = c.s;
  const bg = isDark ? c.primary : "#f8fafc";
  const text = isDark ? "rgba(255,255,255,0.85)" : "#1f2937";
  const sub = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: bg, position: "relative" }}>
      {/* Magnetic stripe */}
      <div style={{ height: `${24 * s}px`, backgroundColor: "#0a0a0a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: `${3 * s}px`, left: 0, right: 0, height: `${7 * s}px`, backgroundColor: "#141414" }} />
        <div style={{ position: "absolute", top: `${13 * s}px`, left: 0, right: 0, height: `${5 * s}px`, backgroundColor: "#111" }} />
        <div style={{ position: "absolute", top: `${20 * s}px`, left: 0, right: 0, height: `${3 * s}px`, backgroundColor: "#141414" }} />
      </div>
      {/* Signature strip */}
      <div style={{ margin: `${6 * s}px ${12 * s}px`, padding: `${4 * s}px ${10 * s}px`, backgroundColor: "rgba(255,255,255,0.9)", borderRadius: `${2 * s}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: `${8 * s}px` }}>
          <div style={{ fontSize: `${6.5 * s}px`, color: "#9ca3af", fontStyle: "italic", flexShrink: 0 }}>Authorized Signature</div>
          <div style={{ flex: 1, height: `${1 * s}px`, backgroundColor: "#e5e7eb" }} />
        </div>
      </div>
      {/* Info section */}
      <div style={{ padding: `${8 * s}px ${14 * s}px`, textAlign: "center" as const }}>
        <div style={{ fontSize: `${7.5 * s}px`, color: sub, marginBottom: `${4 * s}px` }}>If found, please return to:</div>
        <div style={{ fontSize: `${11 * s}px`, color: text, fontWeight: 700 }}>{c.organization}</div>
        {c.email && <div style={{ fontSize: `${8 * s}px`, color: sub, marginTop: `${2 * s}px` }}>{c.email}</div>}
        {c.phone && <div style={{ fontSize: `${8 * s}px`, color: sub }}>{c.phone}</div>}
        {c.emergencyContact && (
          <div style={{ marginTop: `${6 * s}px`, fontSize: `${7.5 * s}px`, color: sub }}>
            Emergency: <span style={{ color: text, fontWeight: 600 }}>{c.emergencyContact}</span>
          </div>
        )}
        {c.bloodType && (
          <div style={{ display: "inline-block", backgroundColor: isDark ? `${c.accent}33` : "#fee2e2", color: isDark ? c.accent : "#dc2626", borderRadius: `${3 * s}px`, padding: `${2 * s}px ${8 * s}px`, fontSize: `${8 * s}px`, fontWeight: 700, marginTop: `${6 * s}px` }}>
            Blood Type: {c.bloodType}
          </div>
        )}
        {c.validUntil && <div style={{ fontSize: `${7.5 * s}px`, color: sub, marginTop: `${5 * s}px` }}>Valid until: {c.validUntil}</div>}
      </div>
      {/* QR */}
      <div style={{ display: "flex", justifyContent: "center", padding: `${8 * s}px` }}>
        <QrBlock data={c.qrData} size={60 * s} showQR={c.showQR} dark={!isDark} />
      </div>
      {/* Barcode */}
      <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", padding: `${4 * s}px ${14 * s}px` }}>
        <BarcodeStrip value={c.employeeId || "0000000"} w={160 * s} h={28 * s} dark={!isDark} />
        <div style={{ fontSize: `${6 * s}px`, color: sub, marginTop: `${2 * s}px`, letterSpacing: "0.12em" }}>
          {(c.employeeId || "0000000").split("").join(" ")}
        </div>
      </div>
      {/* Logo + fine print */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: `${6 * s}px ${14 * s}px` }}>
        <LogoBox logo={c.logo} size={38 * s} showLogo={c.showLogo} dark={!isDark} />
        <div style={{ fontSize: `${5.5 * s}px`, color: sub, textAlign: "right" as const, maxWidth: "55%", lineHeight: 1.4 }}>
          Property of {c.organization}. Unauthorized use prohibited. #{c.employeeId || "N/A"}
        </div>
      </div>
    </div>
  );
}
