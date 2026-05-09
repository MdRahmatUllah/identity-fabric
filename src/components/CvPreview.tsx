export type CvFieldType = "text" | "textarea" | "image" | "email" | "url" | "tel";

export interface CvField {
  key: string;
  label: string;
  type: CvFieldType;
  required?: boolean;
  max?: number;
  placeholder?: string;
  rows?: number;
}

export interface CvTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  fields: CvField[];
}

const STANDARD_FIELDS: CvField[] = [
  { key: "full_name", label: "Full name", type: "text", required: true, max: 80 },
  { key: "headline", label: "Professional headline", type: "text", required: true, max: 100, placeholder: "e.g. Senior Software Engineer" },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+1 (555) 000-0000" },
  { key: "location", label: "Location", type: "text", placeholder: "City, Country" },
  { key: "website", label: "LinkedIn / Website", type: "url", placeholder: "linkedin.com/in/yourname" },
  { key: "photo", label: "Profile photo", type: "image" },
  { key: "summary", label: "Professional summary", type: "textarea", required: true, rows: 4, placeholder: "2–3 sentences about your professional background and key strengths…" },
  { key: "experience", label: "Work experience", type: "textarea", rows: 8, placeholder: "Job Title | Company | 2020–2023\nKey responsibilities and achievements…\n\nPrevious Role | Company | 2018–2020\nDescription…" },
  { key: "education", label: "Education", type: "textarea", rows: 4, placeholder: "Degree | University | 2018\nMajor or relevant details…" },
  { key: "skills", label: "Skills", type: "text", placeholder: "Python, React, Docker, AWS, Leadership, …" },
  { key: "languages", label: "Languages", type: "text", placeholder: "English (Native), Spanish (Fluent), …" },
  { key: "certifications", label: "Certifications & Awards", type: "textarea", rows: 3, placeholder: "AWS Solutions Architect | Amazon | 2023\nGoogle Cloud Professional | Google | 2022" },
];

export const CV_TEMPLATES: CvTemplate[] = [
  {
    id: "classic",
    name: "Classic Professional",
    category: "Professional",
    description: "Timeless two-column layout with navy sidebar and clean blue accents",
    primaryColor: "#1e3a5f",
    accentColor: "#2563eb",
    fields: STANDARD_FIELDS,
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    category: "Professional",
    description: "Ultra-clean single-column with indigo accents and maximum whitespace",
    primaryColor: "#111827",
    accentColor: "#6366f1",
    fields: STANDARD_FIELDS,
  },
  {
    id: "executive",
    name: "Executive Dark",
    category: "Professional",
    description: "Premium dark navy sidebar with gold accents for C-suite and senior roles",
    primaryColor: "#0f172a",
    accentColor: "#f59e0b",
    fields: STANDARD_FIELDS,
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    category: "Creative",
    description: "Vibrant purple-to-pink gradient header, perfect for designers and creatives",
    primaryColor: "#7c3aed",
    accentColor: "#ec4899",
    fields: STANDARD_FIELDS,
  },
  {
    id: "academic",
    name: "Academic CV",
    category: "Academic",
    description: "Formal academic format for researchers, professors, and PhD candidates",
    primaryColor: "#1e293b",
    accentColor: "#0369a1",
    fields: STANDARD_FIELDS,
  },
  {
    id: "tech-dark",
    name: "Tech Developer",
    category: "Tech",
    description: "Dark terminal-inspired theme with green accents for software engineers",
    primaryColor: "#0d1117",
    accentColor: "#22c55e",
    fields: STANDARD_FIELDS,
  },
  {
    id: "elegant-serif",
    name: "Elegant Serif",
    category: "Premium",
    description: "Warm cream tones with burgundy accents and refined serif typography",
    primaryColor: "#3d2b1f",
    accentColor: "#9c4221",
    fields: STANDARD_FIELDS,
  },
  {
    id: "bold-accent",
    name: "Bold Accent",
    category: "Creative",
    description: "High-contrast design with vivid red sidebar strip that commands attention",
    primaryColor: "#1a1a1a",
    accentColor: "#dc2626",
    fields: STANDARD_FIELDS,
  },
  {
    id: "timeline",
    name: "Timeline Resume",
    category: "Modern",
    description: "Visual teal timeline layout showing career progression at a glance",
    primaryColor: "#0f766e",
    accentColor: "#14b8a6",
    fields: STANDARD_FIELDS,
  },
  {
    id: "compact",
    name: "Compact Power",
    category: "Professional",
    description: "Information-dense layout ideal for 10+ years of experience on one page",
    primaryColor: "#334155",
    accentColor: "#3b82f6",
    fields: STANDARD_FIELDS,
  },
  {
    id: "bio-profile",
    name: "Bio Profile",
    category: "Biography",
    description: "Photo-centric biography format for speakers, executives, and public figures",
    primaryColor: "#1e1b4b",
    accentColor: "#8b5cf6",
    fields: STANDARD_FIELDS,
  },
  {
    id: "corporate",
    name: "Corporate Blue",
    category: "Professional",
    description: "Traditional two-column corporate resume with formal structure and blue branding",
    primaryColor: "#003366",
    accentColor: "#0066cc",
    fields: STANDARD_FIELDS,
  },
];

// ─── Parsing helpers ────────────────────────────────────────────────────────

interface Entry {
  title: string;
  company: string;
  period: string;
  description: string;
}

function parseEntries(text: string): Entry[] {
  if (!text?.trim()) return [];
  return text
    .trim()
    .split(/\n[ \t]*\n/)
    .map((block) => {
      const lines = block.trim().split("\n");
      const header = lines[0] || "";
      const parts = header.split("|").map((p) => p.trim());
      return {
        title: parts[0] || "",
        company: parts[1] || "",
        period: parts[2] || "",
        description: lines.slice(1).join(" ").trim(),
      };
    })
    .filter((e) => e.title);
}

function parseList(text: string): string[] {
  if (!text?.trim()) return [];
  return text.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
}

// ─── CvPreview component ────────────────────────────────────────────────────

interface CvPreviewProps {
  templateId: string;
  data: Record<string, string>;
  photoDataUrl?: string | null;
  scale?: number;
}

const BASE_W = 620;
const BASE_H = 877; // A4 ratio

export function CvPreview({ templateId, data, photoDataUrl, scale = 1 }: CvPreviewProps) {
  const template = CV_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return <div>Template not found</div>;

  const s = scale;
  const w = BASE_W * s;
  const h = BASE_H * s;

  const ctx: Ctx = {
    s,
    w,
    h,
    name: data.full_name || "Your Name",
    headline: data.headline || "Professional Headline",
    email: data.email || "",
    phone: data.phone || "",
    location: data.location || "",
    website: data.website || "",
    summary: data.summary || "",
    primary: template.primaryColor,
    accent: template.accentColor,
    photo: photoDataUrl || null,
    experience: parseEntries(data.experience || ""),
    education: parseEntries(data.education || ""),
    certifications: parseEntries(data.certifications || ""),
    skills: parseList(data.skills || ""),
    languages: parseList(data.languages || ""),
  };

  const renderers: Record<string, (c: Ctx) => React.ReactNode> = {
    classic: renderClassic,
    "modern-minimal": renderModernMinimal,
    executive: renderExecutive,
    "creative-gradient": renderCreativeGradient,
    academic: renderAcademic,
    "tech-dark": renderTechDark,
    "elegant-serif": renderElegantSerif,
    "bold-accent": renderBoldAccent,
    timeline: renderTimeline,
    compact: renderCompact,
    "bio-profile": renderBioProfile,
    corporate: renderCorporate,
  };

  const render = renderers[templateId] ?? renderClassic;

  return (
    <div
      data-cv-preview
      style={{
        width: w,
        height: h,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#ffffff",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: `${11 * s}px`,
        lineHeight: 1.5,
        boxSizing: "border-box",
      }}
    >
      {render(ctx)}
    </div>
  );
}

// ─── Render context ──────────────────────────────────────────────────────────

interface Ctx {
  s: number;
  w: number;
  h: number;
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  primary: string;
  accent: string;
  photo: string | null;
  experience: Entry[];
  education: Entry[];
  certifications: Entry[];
  skills: string[];
  languages: string[];
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function SectionHeading({ title, accent, s, light = false }: { title: string; accent: string; s: number; light?: boolean }) {
  return (
    <div style={{ marginBottom: `${6 * s}px`, marginTop: `${14 * s}px` }}>
      <div style={{ fontSize: `${8.5 * s}px`, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: light ? "rgba(255,255,255,0.7)" : accent }}>
        {title}
      </div>
      <div style={{ height: `${1 * s}px`, backgroundColor: light ? "rgba(255,255,255,0.2)" : accent, marginTop: `${3 * s}px`, opacity: 0.5 }} />
    </div>
  );
}

function EntryItem({ entry, s, light = false, accentColor }: { entry: Entry; s: number; light?: boolean; accentColor?: string }) {
  const titleColor = light ? "#ffffff" : "#111827";
  const subColor = light ? "rgba(255,255,255,0.65)" : "#6b7280";
  const descColor = light ? "rgba(255,255,255,0.8)" : "#374151";
  return (
    <div style={{ marginBottom: `${8 * s}px` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: `${4 * s}px` }}>
        <div style={{ fontWeight: 600, fontSize: `${10 * s}px`, color: titleColor }}>{entry.title}</div>
        {entry.period && <div style={{ fontSize: `${8.5 * s}px`, color: accentColor || subColor, whiteSpace: "nowrap" as const }}>{entry.period}</div>}
      </div>
      {entry.company && <div style={{ fontSize: `${9 * s}px`, color: subColor, fontStyle: "italic" }}>{entry.company}</div>}
      {entry.description && <div style={{ fontSize: `${9 * s}px`, color: descColor, marginTop: `${3 * s}px`, lineHeight: 1.55 }}>{entry.description}</div>}
    </div>
  );
}

function ContactRow({ icon, text, s, color = "#374151" }: { icon: string; text: string; s: number; color?: string }) {
  if (!text) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${4 * s}px`, marginBottom: `${4 * s}px`, fontSize: `${9 * s}px`, color }}>
      <span style={{ fontSize: `${10 * s}px` }}>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{text}</span>
    </div>
  );
}

function SkillPill({ text, bg, color, s }: { text: string; bg: string; color: string; s: number }) {
  return (
    <span style={{ display: "inline-block", backgroundColor: bg, color, borderRadius: `${3 * s}px`, padding: `${2 * s}px ${7 * s}px`, fontSize: `${8.5 * s}px`, marginRight: `${4 * s}px`, marginBottom: `${4 * s}px` }}>
      {text}
    </span>
  );
}

// ─── Template 1: Classic ─────────────────────────────────────────────────────

function renderClassic(c: Ctx) {
  const sideW = c.w * 0.35;
  const mainW = c.w - sideW;
  const p = c.s * 20;
  const sp = c.s * 16;

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: sideW, backgroundColor: c.primary, padding: `${p}px ${sp}px`, color: "white", overflow: "hidden" }}>
        {c.photo && (
          <div style={{ textAlign: "center", marginBottom: `${12 * c.s}px` }}>
            <img src={c.photo} alt="" style={{ width: `${72 * c.s}px`, height: `${72 * c.s}px`, borderRadius: "50%", objectFit: "cover", border: `${2 * c.s}px solid ${c.accent}` }} />
          </div>
        )}
        <SectionHeading title="Contact" accent={c.accent} s={c.s} light />
        <ContactRow icon="✉" text={c.email} s={c.s} color="rgba(255,255,255,0.85)" />
        <ContactRow icon="📞" text={c.phone} s={c.s} color="rgba(255,255,255,0.85)" />
        <ContactRow icon="📍" text={c.location} s={c.s} color="rgba(255,255,255,0.85)" />
        <ContactRow icon="🔗" text={c.website} s={c.s} color="rgba(255,255,255,0.85)" />

        {c.skills.length > 0 && (
          <>
            <SectionHeading title="Skills" accent={c.accent} s={c.s} light />
            <div style={{ display: "flex", flexWrap: "wrap" as const }}>
              {c.skills.slice(0, 12).map((sk, i) => (
                <SkillPill key={i} text={sk} bg={`${c.accent}44`} color="white" s={c.s} />
              ))}
            </div>
          </>
        )}

        {c.languages.length > 0 && (
          <>
            <SectionHeading title="Languages" accent={c.accent} s={c.s} light />
            {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, opacity: 0.85, marginBottom: `${3 * c.s}px` }}>{l}</div>)}
          </>
        )}

        {c.certifications.length > 0 && (
          <>
            <SectionHeading title="Certifications" accent={c.accent} s={c.s} light />
            {c.certifications.slice(0, 3).map((e, i) => (
              <div key={i} style={{ marginBottom: `${6 * c.s}px` }}>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 600 }}>{e.title}</div>
                {e.company && <div style={{ fontSize: `${8.5 * c.s}px`, opacity: 0.65 }}>{e.company} {e.period && `· ${e.period}`}</div>}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main */}
      <div style={{ width: mainW, padding: `${p}px ${p}px`, overflow: "hidden" }}>
        <div style={{ borderBottom: `${3 * c.s}px solid ${c.accent}`, paddingBottom: `${10 * c.s}px`, marginBottom: `${4 * c.s}px` }}>
          <div style={{ fontSize: `${22 * c.s}px`, fontWeight: 800, color: c.primary, lineHeight: 1.15 }}>{c.name}</div>
          <div style={{ fontSize: `${10 * c.s}px`, color: c.accent, fontWeight: 600, marginTop: `${4 * c.s}px`, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{c.headline}</div>
        </div>

        {c.summary && (
          <>
            <SectionHeading title="Profile" accent={c.accent} s={c.s} />
            <p style={{ fontSize: `${9.5 * c.s}px`, color: "#374151", lineHeight: 1.6, margin: 0 }}>{c.summary}</p>
          </>
        )}

        {c.experience.length > 0 && (
          <>
            <SectionHeading title="Experience" accent={c.accent} s={c.s} />
            {c.experience.slice(0, 4).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
          </>
        )}

        {c.education.length > 0 && (
          <>
            <SectionHeading title="Education" accent={c.accent} s={c.s} />
            {c.education.slice(0, 3).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Template 2: Modern Minimal ──────────────────────────────────────────────

function renderModernMinimal(c: Ctx) {
  const p = c.s * 42;
  return (
    <div style={{ padding: `${p}px`, height: "100%", boxSizing: "border-box" as const, overflow: "hidden" }}>
      <div style={{ borderBottom: `${1 * c.s}px solid #e5e7eb`, paddingBottom: `${16 * c.s}px`, marginBottom: `${4 * c.s}px`, display: "flex", gap: `${16 * c.s}px`, alignItems: "flex-start" }}>
        {c.photo && <img src={c.photo} alt="" style={{ width: `${60 * c.s}px`, height: `${60 * c.s}px`, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />}
        <div>
          <div style={{ fontSize: `${26 * c.s}px`, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>{c.name}</div>
          <div style={{ fontSize: `${11 * c.s}px`, color: c.accent, fontWeight: 500, marginTop: `${3 * c.s}px` }}>{c.headline}</div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: `${10 * c.s}px`, marginTop: `${6 * c.s}px` }}>
            {[c.email, c.phone, c.location, c.website].filter(Boolean).map((v, i) => (
              <span key={i} style={{ fontSize: `${8.5 * c.s}px`, color: "#6b7280" }}>{v}</span>
            ))}
          </div>
        </div>
      </div>

      {c.summary && <p style={{ fontSize: `${9.5 * c.s}px`, color: "#374151", lineHeight: 1.65, margin: `${4 * c.s}px 0 ${16 * c.s}px` }}>{c.summary}</p>}

      <div style={{ display: "flex", gap: `${30 * c.s}px` }}>
        <div style={{ flex: "1 1 55%" }}>
          {c.experience.length > 0 && (
            <>
              <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: c.accent, marginBottom: `${8 * c.s}px` }}>Experience</div>
              {c.experience.slice(0, 4).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
        </div>
        <div style={{ flex: "1 1 40%" }}>
          {c.education.length > 0 && (
            <>
              <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: c.accent, marginBottom: `${8 * c.s}px` }}>Education</div>
              {c.education.slice(0, 3).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
          {c.skills.length > 0 && (
            <>
              <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: c.accent, margin: `${14 * c.s}px 0 ${8 * c.s}px` }}>Skills</div>
              <div>{c.skills.slice(0, 10).map((sk, i) => <SkillPill key={i} text={sk} bg="#f3f4f6" color="#374151" s={c.s} />)}</div>
            </>
          )}
          {c.languages.length > 0 && (
            <>
              <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: c.accent, margin: `${14 * c.s}px 0 ${6 * c.s}px` }}>Languages</div>
              {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px` }}>{l}</div>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Template 3: Executive Dark ──────────────────────────────────────────────

function renderExecutive(c: Ctx) {
  const sideW = c.w * 0.33;
  const mainW = c.w - sideW;
  const p = c.s * 22;

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Dark sidebar */}
      <div style={{ width: sideW, backgroundColor: c.primary, padding: `${p}px ${p * 0.8}px`, overflow: "hidden" }}>
        {c.photo ? (
          <img src={c.photo} alt="" style={{ width: `${80 * c.s}px`, height: `${80 * c.s}px`, borderRadius: `${6 * c.s}px`, objectFit: "cover", marginBottom: `${14 * c.s}px`, border: `${2 * c.s}px solid ${c.accent}` }} />
        ) : (
          <div style={{ width: `${80 * c.s}px`, height: `${80 * c.s}px`, borderRadius: `${6 * c.s}px`, backgroundColor: `${c.accent}33`, marginBottom: `${14 * c.s}px` }} />
        )}
        <div style={{ color: c.accent, fontSize: `${9 * c.s}px`, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: `${12 * c.s}px`, borderBottom: `${1 * c.s}px solid ${c.accent}33`, paddingBottom: `${8 * c.s}px` }}>CONTACT</div>
        {[
          { icon: "✉", val: c.email },
          { icon: "☎", val: c.phone },
          { icon: "⌖", val: c.location },
          { icon: "⟐", val: c.website },
        ].filter((x) => x.val).map(({ icon, val }, i) => (
          <div key={i} style={{ marginBottom: `${6 * c.s}px` }}>
            <div style={{ fontSize: `${7.5 * c.s}px`, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.1em", opacity: 0.7 }}>{icon}</div>
            <div style={{ fontSize: `${8.5 * c.s}px`, color: "rgba(255,255,255,0.85)", marginTop: `${1 * c.s}px`, wordBreak: "break-word" as const }}>{val}</div>
          </div>
        ))}

        {c.skills.length > 0 && (
          <>
            <div style={{ color: c.accent, fontSize: `${9 * c.s}px`, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.15em", margin: `${16 * c.s}px 0 ${8 * c.s}px`, borderBottom: `${1 * c.s}px solid ${c.accent}33`, paddingBottom: `${8 * c.s}px` }}>SKILLS</div>
            {c.skills.slice(0, 10).map((sk, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: `${6 * c.s}px`, marginBottom: `${5 * c.s}px` }}>
                <div style={{ width: `${4 * c.s}px`, height: `${4 * c.s}px`, borderRadius: "50%", backgroundColor: c.accent, flexShrink: 0 }} />
                <span style={{ fontSize: `${9 * c.s}px`, color: "rgba(255,255,255,0.85)" }}>{sk}</span>
              </div>
            ))}
          </>
        )}

        {c.languages.length > 0 && (
          <>
            <div style={{ color: c.accent, fontSize: `${9 * c.s}px`, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.15em", margin: `${16 * c.s}px 0 ${8 * c.s}px`, borderBottom: `${1 * c.s}px solid ${c.accent}33`, paddingBottom: `${8 * c.s}px` }}>LANGUAGES</div>
            {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "rgba(255,255,255,0.75)", marginBottom: `${4 * c.s}px` }}>{l}</div>)}
          </>
        )}
      </div>

      {/* Light main */}
      <div style={{ width: mainW, padding: `${p}px ${p}px`, backgroundColor: "#f8fafc", overflow: "hidden" }}>
        <div style={{ marginBottom: `${18 * c.s}px` }}>
          <div style={{ fontSize: `${24 * c.s}px`, fontWeight: 800, color: c.primary, letterSpacing: "-0.02em" }}>{c.name}</div>
          <div style={{ fontSize: `${10 * c.s}px`, color: c.accent, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginTop: `${4 * c.s}px` }}>{c.headline}</div>
        </div>

        {c.summary && (
          <div style={{ borderLeft: `${3 * c.s}px solid ${c.accent}`, paddingLeft: `${10 * c.s}px`, marginBottom: `${16 * c.s}px` }}>
            <p style={{ fontSize: `${9.5 * c.s}px`, color: "#475569", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{c.summary}</p>
          </div>
        )}

        {c.experience.length > 0 && (
          <>
            <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, marginBottom: `${10 * c.s}px` }}>Experience</div>
            {c.experience.slice(0, 4).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
          </>
        )}

        {c.education.length > 0 && (
          <>
            <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, margin: `${14 * c.s}px 0 ${10 * c.s}px` }}>Education</div>
            {c.education.slice(0, 2).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
          </>
        )}

        {c.certifications.length > 0 && (
          <>
            <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, margin: `${14 * c.s}px 0 ${10 * c.s}px` }}>Certifications</div>
            {c.certifications.slice(0, 3).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Template 4: Creative Gradient ───────────────────────────────────────────

function renderCreativeGradient(c: Ctx) {
  const p = c.s * 24;
  const headerH = c.h * 0.27;

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      {/* Gradient header */}
      <div style={{ height: headerH, background: `linear-gradient(135deg, ${c.primary} 0%, ${c.accent} 100%)`, padding: `${p}px`, display: "flex", alignItems: "flex-end", gap: `${16 * c.s}px` }}>
        {c.photo && <img src={c.photo} alt="" style={{ width: `${70 * c.s}px`, height: `${70 * c.s}px`, borderRadius: "50%", objectFit: "cover", border: `${3 * c.s}px solid rgba(255,255,255,0.6)`, flexShrink: 0 }} />}
        <div>
          <div style={{ fontSize: `${24 * c.s}px`, fontWeight: 800, color: "white", lineHeight: 1.15 }}>{c.name}</div>
          <div style={{ fontSize: `${10 * c.s}px`, color: "rgba(255,255,255,0.85)", marginTop: `${4 * c.s}px`, fontWeight: 500 }}>{c.headline}</div>
          <div style={{ display: "flex", gap: `${10 * c.s}px`, marginTop: `${6 * c.s}px`, flexWrap: "wrap" as const }}>
            {[c.email, c.phone, c.location].filter(Boolean).map((v, i) => (
              <span key={i} style={{ fontSize: `${8 * c.s}px`, color: "rgba(255,255,255,0.75)", backgroundColor: "rgba(255,255,255,0.15)", padding: `${2 * c.s}px ${7 * c.s}px`, borderRadius: `${20 * c.s}px` }}>{v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", padding: `${p}px`, gap: `${24 * c.s}px`, height: `${c.h - headerH}px`, boxSizing: "border-box" as const, overflow: "hidden" }}>
        <div style={{ flex: "1 1 58%" }}>
          {c.summary && <p style={{ fontSize: `${9.5 * c.s}px`, color: "#374151", lineHeight: 1.65, margin: `0 0 ${14 * c.s}px` }}>{c.summary}</p>}
          {c.experience.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: `${8 * c.s}px` }}>Experience</div>
              {c.experience.slice(0, 4).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
        </div>
        <div style={{ flex: "1 1 36%" }}>
          {c.education.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: `${8 * c.s}px` }}>Education</div>
              {c.education.slice(0, 2).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
          {c.skills.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.1em", margin: `${12 * c.s}px 0 ${8 * c.s}px` }}>Skills</div>
              <div>{c.skills.slice(0, 10).map((sk, i) => <SkillPill key={i} text={sk} bg={`${c.primary}18`} color={c.primary} s={c.s} />)}</div>
            </>
          )}
          {c.languages.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.1em", margin: `${12 * c.s}px 0 ${6 * c.s}px` }}>Languages</div>
              {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px` }}>{l}</div>)}
            </>
          )}
          {c.certifications.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.1em", margin: `${12 * c.s}px 0 ${6 * c.s}px` }}>Certifications</div>
              {c.certifications.slice(0, 3).map((e, i) => (
                <div key={i} style={{ fontSize: `${9 * c.s}px`, marginBottom: `${5 * c.s}px` }}>
                  <div style={{ fontWeight: 600, color: "#1f2937" }}>{e.title}</div>
                  {e.company && <div style={{ color: "#6b7280" }}>{e.company}{e.period ? ` · ${e.period}` : ""}</div>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Template 5: Academic ────────────────────────────────────────────────────

function renderAcademic(c: Ctx) {
  const p = c.s * 40;
  return (
    <div style={{ padding: `${p * 0.8}px ${p}px`, height: "100%", boxSizing: "border-box" as const, overflow: "hidden", backgroundColor: "#ffffff" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: `${16 * c.s}px`, borderBottom: `${2 * c.s}px solid ${c.primary}`, paddingBottom: `${14 * c.s}px` }}>
        {c.photo && <img src={c.photo} alt="" style={{ width: `${60 * c.s}px`, height: `${60 * c.s}px`, borderRadius: "50%", objectFit: "cover", marginBottom: `${8 * c.s}px` }} />}
        <div style={{ fontSize: `${22 * c.s}px`, fontWeight: 700, color: c.primary, letterSpacing: "0.01em" }}>{c.name}</div>
        <div style={{ fontSize: `${10 * c.s}px`, color: "#475569", marginTop: `${3 * c.s}px`, fontStyle: "italic" }}>{c.headline}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: `${14 * c.s}px`, marginTop: `${6 * c.s}px`, flexWrap: "wrap" as const }}>
          {[c.email, c.phone, c.location, c.website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: `${8.5 * c.s}px`, color: "#6b7280" }}>{v}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: `${28 * c.s}px` }}>
        <div style={{ flex: "1 1 60%" }}>
          {c.summary && (
            <>
              <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: `${6 * c.s}px` }}>Research Interests / Summary</div>
              <p style={{ fontSize: `${9.5 * c.s}px`, color: "#374151", lineHeight: 1.65, margin: `0 0 ${14 * c.s}px` }}>{c.summary}</p>
            </>
          )}
          {c.experience.length > 0 && (
            <>
              <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: `${8 * c.s}px`, borderBottom: `${1 * c.s}px solid #d1d5db`, paddingBottom: `${4 * c.s}px` }}>Positions Held</div>
              {c.experience.slice(0, 4).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
          {c.education.length > 0 && (
            <>
              <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.15em", margin: `${12 * c.s}px 0 ${8 * c.s}px`, borderBottom: `${1 * c.s}px solid #d1d5db`, paddingBottom: `${4 * c.s}px` }}>Education</div>
              {c.education.slice(0, 3).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
        </div>
        <div style={{ flex: "1 1 36%" }}>
          {c.skills.length > 0 && (
            <>
              <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.15em", marginBottom: `${8 * c.s}px` }}>Areas of Expertise</div>
              {c.skills.slice(0, 12).map((sk, i) => (
                <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px`, paddingLeft: `${8 * c.s}px`, borderLeft: `${2 * c.s}px solid ${c.accent}` }}>{sk}</div>
              ))}
            </>
          )}
          {c.certifications.length > 0 && (
            <>
              <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.15em", margin: `${14 * c.s}px 0 ${8 * c.s}px` }}>Publications & Awards</div>
              {c.certifications.slice(0, 4).map((e, i) => (
                <div key={i} style={{ fontSize: `${9 * c.s}px`, marginBottom: `${5 * c.s}px`, color: "#374151" }}>
                  <div style={{ fontWeight: 600 }}>{e.title}</div>
                  {(e.company || e.period) && <div style={{ color: "#6b7280", fontStyle: "italic" }}>{[e.company, e.period].filter(Boolean).join(", ")}</div>}
                </div>
              ))}
            </>
          )}
          {c.languages.length > 0 && (
            <>
              <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.15em", margin: `${14 * c.s}px 0 ${6 * c.s}px` }}>Languages</div>
              {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px` }}>{l}</div>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Template 6: Tech Dark ───────────────────────────────────────────────────

function renderTechDark(c: Ctx) {
  const p = c.s * 22;
  const mono = "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace";
  return (
    <div style={{ height: "100%", backgroundColor: c.primary, color: "#e6edf3", fontFamily: mono, overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{ backgroundColor: "#161b22", borderBottom: `${1 * c.s}px solid #30363d`, padding: `${8 * c.s}px ${p}px`, display: "flex", alignItems: "center", gap: `${8 * c.s}px` }}>
        <div style={{ width: `${10 * c.s}px`, height: `${10 * c.s}px`, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
        <div style={{ width: `${10 * c.s}px`, height: `${10 * c.s}px`, borderRadius: "50%", backgroundColor: "#febc2e" }} />
        <div style={{ width: `${10 * c.s}px`, height: `${10 * c.s}px`, borderRadius: "50%", backgroundColor: "#28c840" }} />
        <span style={{ marginLeft: `${12 * c.s}px`, fontSize: `${8.5 * c.s}px`, color: "#6e7681" }}>resume.json — {c.name}</span>
      </div>

      <div style={{ display: "flex", height: `${c.h - 30 * c.s}px` }}>
        {/* Line numbers sidebar */}
        <div style={{ width: `${32 * c.s}px`, backgroundColor: "#0d1117", borderRight: `${1 * c.s}px solid #21262d`, padding: `${p}px ${6 * c.s}px`, color: "#484f58", fontSize: `${8 * c.s}px`, lineHeight: 2 }}>
          {Array.from({ length: 35 }).map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: `${p}px`, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: `${16 * c.s}px`, marginBottom: `${18 * c.s}px` }}>
            {c.photo && <img src={c.photo} alt="" style={{ width: `${56 * c.s}px`, height: `${56 * c.s}px`, borderRadius: `${4 * c.s}px`, objectFit: "cover", border: `${1 * c.s}px solid #30363d` }} />}
            <div>
              <div style={{ color: c.accent, fontSize: `${22 * c.s}px`, fontWeight: 700 }}>{c.name}</div>
              <div style={{ color: "#8b949e", fontSize: `${9.5 * c.s}px`, marginTop: `${3 * c.s}px` }}>// {c.headline}</div>
              <div style={{ color: "#6e7681", fontSize: `${8.5 * c.s}px`, marginTop: `${4 * c.s}px` }}>{[c.email, c.phone, c.location].filter(Boolean).join("  ·  ")}</div>
            </div>
          </div>

          {c.summary && (
            <>
              <div style={{ color: "#8b949e", fontSize: `${8.5 * c.s}px`, marginBottom: `${4 * c.s}px` }}>{"/* summary */"}</div>
              <p style={{ color: "#c9d1d9", fontSize: `${9 * c.s}px`, lineHeight: 1.65, margin: `0 0 ${14 * c.s}px`, borderLeft: `${2 * c.s}px solid ${c.accent}`, paddingLeft: `${10 * c.s}px` }}>{c.summary}</p>
            </>
          )}

          <div style={{ display: "flex", gap: `${24 * c.s}px` }}>
            <div style={{ flex: "1 1 55%" }}>
              {c.experience.length > 0 && (
                <>
                  <div style={{ color: c.accent, fontSize: `${8.5 * c.s}px`, fontWeight: 600, marginBottom: `${8 * c.s}px` }}>{">"} experience</div>
                  {c.experience.slice(0, 3).map((e, i) => (
                    <div key={i} style={{ marginBottom: `${8 * c.s}px`, paddingLeft: `${10 * c.s}px` }}>
                      <div style={{ color: "#f0f6fc", fontWeight: 600, fontSize: `${9.5 * c.s}px` }}>{e.title}</div>
                      <div style={{ color: "#8b949e", fontSize: `${8.5 * c.s}px` }}>{e.company}{e.period ? ` | ${e.period}` : ""}</div>
                      {e.description && <div style={{ color: "#6e7681", fontSize: `${8.5 * c.s}px`, marginTop: `${2 * c.s}px`, lineHeight: 1.5 }}>{e.description}</div>}
                    </div>
                  ))}
                </>
              )}
            </div>
            <div style={{ flex: "1 1 40%" }}>
              {c.skills.length > 0 && (
                <>
                  <div style={{ color: c.accent, fontSize: `${8.5 * c.s}px`, fontWeight: 600, marginBottom: `${8 * c.s}px` }}>{">"} skills</div>
                  <div style={{ paddingLeft: `${10 * c.s}px` }}>
                    {c.skills.slice(0, 10).map((sk, i) => (
                      <span key={i} style={{ display: "inline-block", color: "#58a6ff", marginRight: `${6 * c.s}px`, marginBottom: `${4 * c.s}px`, fontSize: `${8.5 * c.s}px` }}>"{sk}"</span>
                    ))}
                  </div>
                </>
              )}
              {c.education.length > 0 && (
                <>
                  <div style={{ color: c.accent, fontSize: `${8.5 * c.s}px`, fontWeight: 600, margin: `${12 * c.s}px 0 ${6 * c.s}px` }}>{">"} education</div>
                  {c.education.slice(0, 2).map((e, i) => (
                    <div key={i} style={{ paddingLeft: `${10 * c.s}px`, marginBottom: `${6 * c.s}px` }}>
                      <div style={{ color: "#f0f6fc", fontSize: `${9 * c.s}px` }}>{e.title}</div>
                      <div style={{ color: "#8b949e", fontSize: `${8.5 * c.s}px` }}>{e.company}{e.period ? ` | ${e.period}` : ""}</div>
                    </div>
                  ))}
                </>
              )}
              {c.languages.length > 0 && (
                <>
                  <div style={{ color: c.accent, fontSize: `${8.5 * c.s}px`, fontWeight: 600, margin: `${12 * c.s}px 0 ${6 * c.s}px` }}>{">"} languages</div>
                  <div style={{ paddingLeft: `${10 * c.s}px` }}>
                    {c.languages.map((l, i) => <div key={i} style={{ color: "#c9d1d9", fontSize: `${8.5 * c.s}px`, marginBottom: `${3 * c.s}px` }}>{l}</div>)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template 7: Elegant Serif ───────────────────────────────────────────────

function renderElegantSerif(c: Ctx) {
  const serif = "Georgia, 'Times New Roman', serif";
  const p = c.s * 40;
  return (
    <div style={{ height: "100%", backgroundColor: "#faf8f3", fontFamily: serif, overflow: "hidden" }}>
      {/* Decorative top strip */}
      <div style={{ height: `${8 * c.s}px`, backgroundColor: c.accent }} />
      <div style={{ padding: `${p * 0.7}px ${p}px`, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: `${18 * c.s}px` }}>
          {c.photo && <img src={c.photo} alt="" style={{ width: `${64 * c.s}px`, height: `${64 * c.s}px`, borderRadius: "50%", objectFit: "cover", marginBottom: `${10 * c.s}px`, border: `${2 * c.s}px solid ${c.accent}` }} />}
          <div style={{ fontSize: `${26 * c.s}px`, fontWeight: 700, color: c.primary, letterSpacing: "0.04em" }}>{c.name}</div>
          <div style={{ height: `${1 * c.s}px`, width: `${80 * c.s}px`, backgroundColor: c.accent, margin: `${8 * c.s}px auto` }} />
          <div style={{ fontSize: `${10.5 * c.s}px`, color: "#78716c", fontStyle: "italic", letterSpacing: "0.06em" }}>{c.headline}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: `${16 * c.s}px`, marginTop: `${8 * c.s}px`, flexWrap: "wrap" as const }}>
            {[c.email, c.phone, c.location, c.website].filter(Boolean).map((v, i) => (
              <span key={i} style={{ fontSize: `${8.5 * c.s}px`, color: "#78716c" }}>{v}</span>
            ))}
          </div>
        </div>

        {c.summary && (
          <p style={{ fontSize: `${10 * c.s}px`, color: "#57534e", lineHeight: 1.7, textAlign: "center", fontStyle: "italic", margin: `0 ${p * 0.3}px ${16 * c.s}px`, borderTop: `${1 * c.s}px solid #d6d3d1`, borderBottom: `${1 * c.s}px solid #d6d3d1`, padding: `${10 * c.s}px 0` }}>
            {c.summary}
          </p>
        )}

        <div style={{ display: "flex", gap: `${28 * c.s}px` }}>
          <div style={{ flex: "1 1 58%" }}>
            {c.experience.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.2em", marginBottom: `${10 * c.s}px` }}>Career History</div>
                {c.experience.slice(0, 4).map((e, i) => (
                  <div key={i} style={{ marginBottom: `${10 * c.s}px` }}>
                    <div style={{ fontWeight: 700, fontSize: `${10 * c.s}px`, color: c.primary }}>{e.title}</div>
                    <div style={{ fontSize: `${9 * c.s}px`, color: c.accent, fontStyle: "italic" }}>{[e.company, e.period].filter(Boolean).join(" · ")}</div>
                    {e.description && <div style={{ fontSize: `${9 * c.s}px`, color: "#57534e", marginTop: `${3 * c.s}px`, lineHeight: 1.6 }}>{e.description}</div>}
                  </div>
                ))}
              </>
            )}
            {c.education.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.2em", margin: `${12 * c.s}px 0 ${10 * c.s}px` }}>Education</div>
                {c.education.slice(0, 2).map((e, i) => (
                  <div key={i} style={{ marginBottom: `${8 * c.s}px` }}>
                    <div style={{ fontWeight: 700, fontSize: `${10 * c.s}px`, color: c.primary }}>{e.title}</div>
                    <div style={{ fontSize: `${9 * c.s}px`, color: "#78716c", fontStyle: "italic" }}>{[e.company, e.period].filter(Boolean).join(", ")}</div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div style={{ flex: "1 1 36%" }}>
            {c.skills.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.2em", marginBottom: `${8 * c.s}px` }}>Expertise</div>
                {c.skills.slice(0, 10).map((sk, i) => (
                  <div key={i} style={{ fontSize: `${9.5 * c.s}px`, color: "#57534e", marginBottom: `${4 * c.s}px`, paddingLeft: `${8 * c.s}px`, borderLeft: `${1.5 * c.s}px solid ${c.accent}` }}>{sk}</div>
                ))}
              </>
            )}
            {c.languages.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.2em", margin: `${14 * c.s}px 0 ${8 * c.s}px` }}>Languages</div>
                {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9.5 * c.s}px`, color: "#57534e", marginBottom: `${4 * c.s}px`, fontStyle: "italic" }}>{l}</div>)}
              </>
            )}
            {c.certifications.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 700, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.2em", margin: `${14 * c.s}px 0 ${8 * c.s}px` }}>Honours</div>
                {c.certifications.slice(0, 3).map((e, i) => (
                  <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#57534e", marginBottom: `${5 * c.s}px` }}>
                    <div style={{ fontWeight: 600, color: c.primary }}>{e.title}</div>
                    {(e.company || e.period) && <div style={{ fontStyle: "italic" }}>{[e.company, e.period].filter(Boolean).join(", ")}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template 8: Bold Accent ─────────────────────────────────────────────────

function renderBoldAccent(c: Ctx) {
  const strip = c.s * 7;
  const p = c.s * 24;
  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Red strip */}
      <div style={{ width: strip, backgroundColor: c.accent, flexShrink: 0 }} />

      {/* Content */}
      <div style={{ flex: 1, padding: `${p}px`, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: `${16 * c.s}px`, alignItems: "flex-start", marginBottom: `${16 * c.s}px`, borderBottom: `${2 * c.s}px solid #f3f4f6`, paddingBottom: `${14 * c.s}px` }}>
          {c.photo && <img src={c.photo} alt="" style={{ width: `${68 * c.s}px`, height: `${68 * c.s}px`, objectFit: "cover", borderRadius: `${4 * c.s}px`, flexShrink: 0 }} />}
          <div>
            <div style={{ fontSize: `${26 * c.s}px`, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{c.name}</div>
            <div style={{ fontSize: `${10 * c.s}px`, color: c.accent, fontWeight: 700, marginTop: `${4 * c.s}px`, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>{c.headline}</div>
            <div style={{ display: "flex", gap: `${10 * c.s}px`, marginTop: `${6 * c.s}px`, flexWrap: "wrap" as const }}>
              {[c.email, c.phone, c.location, c.website].filter(Boolean).map((v, i) => (
                <span key={i} style={{ fontSize: `${8.5 * c.s}px`, color: "#6b7280" }}>{v}</span>
              ))}
            </div>
          </div>
        </div>

        {c.summary && <p style={{ fontSize: `${9.5 * c.s}px`, color: "#374151", lineHeight: 1.65, margin: `0 0 ${14 * c.s}px` }}>{c.summary}</p>}

        <div style={{ display: "flex", gap: `${22 * c.s}px` }}>
          <div style={{ flex: "1 1 55%" }}>
            {c.experience.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 800, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${8 * c.s}px` }}>Experience</div>
                {c.experience.slice(0, 4).map((e, i) => (
                  <div key={i} style={{ marginBottom: `${9 * c.s}px`, paddingLeft: `${8 * c.s}px`, borderLeft: `${2 * c.s}px solid ${i === 0 ? c.accent : "#e5e7eb"}` }}>
                    <div style={{ fontWeight: 700, fontSize: `${10 * c.s}px`, color: "#111827" }}>{e.title}</div>
                    <div style={{ fontSize: `${8.5 * c.s}px`, color: "#6b7280" }}>{e.company}{e.period ? ` · ${e.period}` : ""}</div>
                    {e.description && <div style={{ fontSize: `${8.5 * c.s}px`, color: "#374151", marginTop: `${2 * c.s}px`, lineHeight: 1.55 }}>{e.description}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
          <div style={{ flex: "1 1 40%" }}>
            {c.education.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 800, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${8 * c.s}px` }}>Education</div>
                {c.education.slice(0, 3).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
              </>
            )}
            {c.skills.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 800, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.12em", margin: `${12 * c.s}px 0 ${6 * c.s}px` }}>Skills</div>
                <div>{c.skills.slice(0, 10).map((sk, i) => <SkillPill key={i} text={sk} bg="#f9fafb" color="#374151" s={c.s} />)}</div>
              </>
            )}
            {c.languages.length > 0 && (
              <>
                <div style={{ fontSize: `${9 * c.s}px`, fontWeight: 800, color: c.accent, textTransform: "uppercase" as const, letterSpacing: "0.12em", margin: `${12 * c.s}px 0 ${6 * c.s}px` }}>Languages</div>
                {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px` }}>{l}</div>)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template 9: Timeline ────────────────────────────────────────────────────

function renderTimeline(c: Ctx) {
  const p = c.s * 24;
  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      {/* Teal header */}
      <div style={{ backgroundColor: c.primary, padding: `${p}px`, display: "flex", gap: `${16 * c.s}px`, alignItems: "center" }}>
        {c.photo && <img src={c.photo} alt="" style={{ width: `${60 * c.s}px`, height: `${60 * c.s}px`, borderRadius: "50%", objectFit: "cover", border: `${2 * c.s}px solid ${c.accent}`, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${22 * c.s}px`, fontWeight: 800, color: "white" }}>{c.name}</div>
          <div style={{ fontSize: `${10 * c.s}px`, color: c.accent, marginTop: `${3 * c.s}px`, fontWeight: 500 }}>{c.headline}</div>
          <div style={{ display: "flex", gap: `${10 * c.s}px`, marginTop: `${5 * c.s}px`, flexWrap: "wrap" as const }}>
            {[c.email, c.phone, c.location, c.website].filter(Boolean).map((v, i) => (
              <span key={i} style={{ fontSize: `${8 * c.s}px`, color: "rgba(255,255,255,0.7)" }}>{v}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", height: `${c.h * 0.72}px`, overflow: "hidden" }}>
        {/* Left: summary + education + skills */}
        <div style={{ width: c.w * 0.36, borderRight: `${1 * c.s}px solid #e5e7eb`, padding: `${p}px ${p * 0.7}px`, overflow: "hidden" }}>
          {c.summary && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${6 * c.s}px` }}>About</div>
              <p style={{ fontSize: `${9 * c.s}px`, color: "#374151", lineHeight: 1.6, margin: `0 0 ${14 * c.s}px` }}>{c.summary}</p>
            </>
          )}
          {c.skills.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${6 * c.s}px` }}>Skills</div>
              <div style={{ marginBottom: `${14 * c.s}px` }}>{c.skills.slice(0, 10).map((sk, i) => <SkillPill key={i} text={sk} bg={`${c.accent}22`} color={c.primary} s={c.s} />)}</div>
            </>
          )}
          {c.education.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${6 * c.s}px` }}>Education</div>
              {c.education.slice(0, 2).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
          {c.languages.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", margin: `${10 * c.s}px 0 ${6 * c.s}px` }}>Languages</div>
              {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px` }}>{l}</div>)}
            </>
          )}
        </div>

        {/* Right: timeline */}
        <div style={{ flex: 1, padding: `${p}px ${p * 0.8}px`, overflow: "hidden" }}>
          <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${12 * c.s}px` }}>Career Timeline</div>
          {c.experience.slice(0, 5).map((e, i) => (
            <div key={i} style={{ display: "flex", gap: `${12 * c.s}px`, marginBottom: `${10 * c.s}px` }}>
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", width: `${16 * c.s}px`, flexShrink: 0 }}>
                <div style={{ width: `${10 * c.s}px`, height: `${10 * c.s}px`, borderRadius: "50%", backgroundColor: i === 0 ? c.accent : c.primary, border: `${2 * c.s}px solid ${c.accent}`, flexShrink: 0 }} />
                {i < c.experience.length - 1 && <div style={{ width: `${2 * c.s}px`, flex: 1, backgroundColor: "#d1d5db", marginTop: `${2 * c.s}px`, minHeight: `${20 * c.s}px` }} />}
              </div>
              <div style={{ paddingBottom: `${4 * c.s}px` }}>
                <div style={{ fontWeight: 700, fontSize: `${10 * c.s}px`, color: "#111827" }}>{e.title}</div>
                <div style={{ fontSize: `${8.5 * c.s}px`, color: c.accent, fontWeight: 500 }}>{e.company}{e.period ? ` · ${e.period}` : ""}</div>
                {e.description && <div style={{ fontSize: `${8.5 * c.s}px`, color: "#6b7280", marginTop: `${2 * c.s}px`, lineHeight: 1.5 }}>{e.description}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Template 10: Compact Power ──────────────────────────────────────────────

function renderCompact(c: Ctx) {
  const p = c.s * 20;
  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      {/* Header bar */}
      <div style={{ backgroundColor: c.primary, padding: `${p * 0.8}px ${p}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: `${8 * c.s}px` }}>
          <div style={{ display: "flex", gap: `${12 * c.s}px`, alignItems: "center" }}>
            {c.photo && <img src={c.photo} alt="" style={{ width: `${48 * c.s}px`, height: `${48 * c.s}px`, borderRadius: "50%", objectFit: "cover", border: `${2 * c.s}px solid ${c.accent}` }} />}
            <div>
              <div style={{ fontSize: `${20 * c.s}px`, fontWeight: 800, color: "white", lineHeight: 1.15 }}>{c.name}</div>
              <div style={{ fontSize: `${9.5 * c.s}px`, color: c.accent, marginTop: `${2 * c.s}px` }}>{c.headline}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" as const }}>
            {[c.email, c.phone, c.location, c.website].filter(Boolean).map((v, i) => (
              <div key={i} style={{ fontSize: `${8 * c.s}px`, color: "rgba(255,255,255,0.7)", marginBottom: `${2 * c.s}px` }}>{v}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: `${p * 0.7}px ${p}px`, overflow: "hidden" }}>
        {c.summary && <p style={{ fontSize: `${9 * c.s}px`, color: "#374151", lineHeight: 1.6, margin: `0 0 ${12 * c.s}px`, borderLeft: `${3 * c.s}px solid ${c.accent}`, paddingLeft: `${8 * c.s}px` }}>{c.summary}</p>}

        <div style={{ display: "flex", gap: `${18 * c.s}px` }}>
          <div style={{ flex: "1 1 60%" }}>
            {c.experience.length > 0 && (
              <>
                <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${1.5 * c.s}px solid ${c.accent}`, paddingBottom: `${3 * c.s}px`, marginBottom: `${7 * c.s}px` }}>Experience</div>
                {c.experience.slice(0, 5).map((e, i) => (
                  <div key={i} style={{ marginBottom: `${7 * c.s}px` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div style={{ fontWeight: 700, fontSize: `${9.5 * c.s}px`, color: "#111827" }}>{e.title}</div>
                      <div style={{ fontSize: `${8 * c.s}px`, color: "#9ca3af", whiteSpace: "nowrap" as const }}>{e.period}</div>
                    </div>
                    <div style={{ fontSize: `${8.5 * c.s}px`, color: c.accent, fontStyle: "italic" }}>{e.company}</div>
                    {e.description && <div style={{ fontSize: `${8.5 * c.s}px`, color: "#6b7280", marginTop: `${2 * c.s}px`, lineHeight: 1.5 }}>{e.description}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
          <div style={{ flex: "1 1 36%" }}>
            {c.education.length > 0 && (
              <>
                <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${1.5 * c.s}px solid ${c.accent}`, paddingBottom: `${3 * c.s}px`, marginBottom: `${7 * c.s}px` }}>Education</div>
                {c.education.slice(0, 3).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
              </>
            )}
            {c.skills.length > 0 && (
              <>
                <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${1.5 * c.s}px solid ${c.accent}`, paddingBottom: `${3 * c.s}px`, margin: `${10 * c.s}px 0 ${6 * c.s}px` }}>Skills</div>
                <div>{c.skills.slice(0, 12).map((sk, i) => <SkillPill key={i} text={sk} bg="#f1f5f9" color="#334155" s={c.s} />)}</div>
              </>
            )}
            {c.languages.length > 0 && (
              <>
                <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${1.5 * c.s}px solid ${c.accent}`, paddingBottom: `${3 * c.s}px`, margin: `${10 * c.s}px 0 ${6 * c.s}px` }}>Languages</div>
                {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${8.5 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px` }}>{l}</div>)}
              </>
            )}
            {c.certifications.length > 0 && (
              <>
                <div style={{ fontSize: `${8 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${1.5 * c.s}px solid ${c.accent}`, paddingBottom: `${3 * c.s}px`, margin: `${10 * c.s}px 0 ${6 * c.s}px` }}>Certifications</div>
                {c.certifications.slice(0, 3).map((e, i) => (
                  <div key={i} style={{ fontSize: `${8.5 * c.s}px`, marginBottom: `${5 * c.s}px` }}>
                    <div style={{ fontWeight: 600, color: "#1f2937" }}>{e.title}</div>
                    {(e.company || e.period) && <div style={{ color: "#6b7280" }}>{[e.company, e.period].filter(Boolean).join(" · ")}</div>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template 11: Bio Profile ────────────────────────────────────────────────

function renderBioProfile(c: Ctx) {
  const p = c.s * 30;
  return (
    <div style={{ height: "100%", overflow: "hidden", background: `linear-gradient(170deg, ${c.primary} 0%, ${c.primary}ee 35%, #f8f7ff 35%)` }}>
      {/* Top photo section */}
      <div style={{ padding: `${p}px`, paddingBottom: `${p * 0.5}px`, textAlign: "center" as const }}>
        {c.photo ? (
          <img src={c.photo} alt="" style={{ width: `${88 * c.s}px`, height: `${88 * c.s}px`, borderRadius: "50%", objectFit: "cover", border: `${4 * c.s}px solid ${c.accent}`, boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }} />
        ) : (
          <div style={{ width: `${88 * c.s}px`, height: `${88 * c.s}px`, borderRadius: "50%", backgroundColor: `${c.accent}44`, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", border: `${4 * c.s}px solid ${c.accent}` }}>
            <span style={{ color: "white", fontSize: `${28 * c.s}px` }}>{c.name.charAt(0)}</span>
          </div>
        )}
        <div style={{ marginTop: `${12 * c.s}px`, fontSize: `${24 * c.s}px`, fontWeight: 800, color: "white" }}>{c.name}</div>
        <div style={{ fontSize: `${10 * c.s}px`, color: c.accent, fontWeight: 600, marginTop: `${4 * c.s}px`, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>{c.headline}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: `${12 * c.s}px`, marginTop: `${10 * c.s}px`, flexWrap: "wrap" as const }}>
          {[c.email, c.phone, c.location, c.website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: `${8 * c.s}px`, color: "rgba(255,255,255,0.75)", backgroundColor: "rgba(255,255,255,0.15)", padding: `${3 * c.s}px ${10 * c.s}px`, borderRadius: `${20 * c.s}px` }}>{v}</span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `${p * 0.6}px ${p}px`, overflow: "hidden" }}>
        {c.summary && (
          <p style={{ fontSize: `${10 * c.s}px`, color: "#1e1b4b", lineHeight: 1.7, textAlign: "center" as const, margin: `0 ${p * 0.3}px ${18 * c.s}px`, fontStyle: "italic" }}>
            "{c.summary}"
          </p>
        )}

        <div style={{ display: "flex", gap: `${24 * c.s}px` }}>
          <div style={{ flex: "1 1 55%" }}>
            {c.experience.length > 0 && (
              <>
                <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${8 * c.s}px`, borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px` }}>Professional Journey</div>
                {c.experience.slice(0, 4).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
              </>
            )}
            {c.education.length > 0 && (
              <>
                <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", margin: `${12 * c.s}px 0 ${8 * c.s}px`, borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px` }}>Education</div>
                {c.education.slice(0, 2).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
              </>
            )}
          </div>
          <div style={{ flex: "1 1 40%" }}>
            {c.skills.length > 0 && (
              <>
                <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: `${8 * c.s}px`, borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px` }}>Expertise</div>
                <div>{c.skills.slice(0, 10).map((sk, i) => <SkillPill key={i} text={sk} bg={`${c.accent}1a`} color={c.primary} s={c.s} />)}</div>
              </>
            )}
            {c.certifications.length > 0 && (
              <>
                <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", margin: `${12 * c.s}px 0 ${8 * c.s}px`, borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px` }}>Achievements</div>
                {c.certifications.slice(0, 3).map((e, i) => (
                  <div key={i} style={{ marginBottom: `${6 * c.s}px` }}>
                    <div style={{ fontWeight: 600, fontSize: `${9 * c.s}px`, color: "#1f2937" }}>{e.title}</div>
                    {(e.company || e.period) && <div style={{ fontSize: `${8.5 * c.s}px`, color: "#6b7280" }}>{[e.company, e.period].filter(Boolean).join(" · ")}</div>}
                  </div>
                ))}
              </>
            )}
            {c.languages.length > 0 && (
              <>
                <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", margin: `${12 * c.s}px 0 ${6 * c.s}px`, borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px` }}>Languages</div>
                {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px` }}>{l}</div>)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template 12: Corporate ──────────────────────────────────────────────────

function renderCorporate(c: Ctx) {
  const p = c.s * 24;
  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      {/* Corporate header */}
      <div style={{ backgroundColor: c.primary, padding: `${p * 0.8}px ${p}px`, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: `${14 * c.s}px`, alignItems: "flex-end" }}>
          {c.photo && <img src={c.photo} alt="" style={{ width: `${56 * c.s}px`, height: `${56 * c.s}px`, borderRadius: `${4 * c.s}px`, objectFit: "cover", border: `${2 * c.s}px solid rgba(255,255,255,0.3)` }} />}
          <div>
            <div style={{ fontSize: `${22 * c.s}px`, fontWeight: 700, color: "white", lineHeight: 1.15 }}>{c.name}</div>
            <div style={{ fontSize: `${9.5 * c.s}px`, color: c.accent, fontWeight: 600, marginTop: `${3 * c.s}px`, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{c.headline}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" as const }}>
          {[c.email, c.phone, c.location, c.website].filter(Boolean).map((v, i) => (
            <div key={i} style={{ fontSize: `${8 * c.s}px`, color: "rgba(255,255,255,0.75)", marginBottom: `${2 * c.s}px` }}>{v}</div>
          ))}
        </div>
      </div>
      {/* Blue accent bar */}
      <div style={{ height: `${4 * c.s}px`, backgroundColor: c.accent }} />

      <div style={{ display: "flex", padding: `${p}px`, gap: `${22 * c.s}px`, overflow: "hidden", height: `${c.h * 0.72}px`, boxSizing: "border-box" as const }}>
        {/* Left */}
        <div style={{ flex: "1 1 60%" }}>
          {c.summary && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, marginBottom: `${8 * c.s}px` }}>Executive Summary</div>
              <p style={{ fontSize: `${9.5 * c.s}px`, color: "#374151", lineHeight: 1.65, margin: `0 0 ${14 * c.s}px` }}>{c.summary}</p>
            </>
          )}
          {c.experience.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, marginBottom: `${10 * c.s}px` }}>Professional Experience</div>
              {c.experience.slice(0, 4).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
        </div>

        {/* Right */}
        <div style={{ flex: "1 1 36%" }}>
          {c.education.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, marginBottom: `${10 * c.s}px` }}>Education</div>
              {c.education.slice(0, 3).map((e, i) => <EntryItem key={i} entry={e} s={c.s} accentColor={c.accent} />)}
            </>
          )}
          {c.skills.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, margin: `${12 * c.s}px 0 ${8 * c.s}px` }}>Core Competencies</div>
              <div>{c.skills.slice(0, 10).map((sk, i) => <SkillPill key={i} text={sk} bg="#eff6ff" color={c.primary} s={c.s} />)}</div>
            </>
          )}
          {c.languages.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, margin: `${12 * c.s}px 0 ${8 * c.s}px` }}>Languages</div>
              {c.languages.map((l, i) => <div key={i} style={{ fontSize: `${9 * c.s}px`, color: "#374151", marginBottom: `${3 * c.s}px` }}>{l}</div>)}
            </>
          )}
          {c.certifications.length > 0 && (
            <>
              <div style={{ fontSize: `${8.5 * c.s}px`, fontWeight: 700, color: c.primary, textTransform: "uppercase" as const, letterSpacing: "0.12em", borderBottom: `${2 * c.s}px solid ${c.accent}`, paddingBottom: `${4 * c.s}px`, margin: `${12 * c.s}px 0 ${8 * c.s}px` }}>Certifications</div>
              {c.certifications.slice(0, 4).map((e, i) => (
                <div key={i} style={{ fontSize: `${9 * c.s}px`, marginBottom: `${5 * c.s}px` }}>
                  <div style={{ fontWeight: 600, color: "#1f2937" }}>{e.title}</div>
                  {(e.company || e.period) && <div style={{ color: "#6b7280" }}>{[e.company, e.period].filter(Boolean).join(" · ")}</div>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// needed for JSX
import React from "react";
