import { useState, useRef, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KImage,
  Transformer,
  Group,
  Circle,
} from "react-konva";
import type Konva from "konva";
import useImage from "use-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Plus,
  Type,
  Square,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import type { IDCardTemplate } from "./IDCardPreview";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LayerKind = "text" | "image" | "rect" | "qr";

export interface CanvasLayer {
  id: string;
  kind: LayerKind;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  // text
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  fill?: string;
  align?: "left" | "center" | "right";
  // image
  src?: string;
  circle?: boolean;
  // rect
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
  // qr
  qrContent?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _uid = 0;
function uid() {
  return `l${Date.now()}${_uid++}`;
}

function isDark(hex: string): boolean {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  } catch {
    return true;
  }
}

// ─── Default layer layout ─────────────────────────────────────────────────────

export function createDefaultLayers(
  template: IDCardTemplate,
  data: Record<string, string> = {}
): CanvasLayer[] {
  const isLS = template.orientation === "landscape";
  const W = isLS ? 720 : 454;
  const H = isLS ? 454 : 720;
  const dark = isDark(template.primaryColor);
  const textColor = dark ? "#ffffff" : "#1a1a1a";
  const dimColor = dark ? "#94a3b8" : "#64748b";

  function t(
    key: string,
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    extra: Partial<CanvasLayer> = {}
  ): CanvasLayer {
    return {
      id: uid(),
      kind: "text",
      name,
      x,
      y,
      w,
      h,
      rot: 0,
      opacity: 1,
      visible: true,
      locked: false,
      text: data[key] || "",
      fill: textColor,
      fontSize: 14,
      fontFamily: "Inter, sans-serif",
      align: "left",
      bold: false,
      italic: false,
      ...extra,
    };
  }

  function r(
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    extra: Partial<CanvasLayer> = {}
  ): CanvasLayer {
    return {
      id: uid(),
      kind: "rect",
      name,
      x,
      y,
      w,
      h,
      rot: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill,
      stroke: undefined,
      strokeWidth: 0,
      radius: 0,
      ...extra,
    };
  }

  function img(
    name: string,
    x: number,
    y: number,
    w: number,
    h: number,
    src: string | undefined,
    extra: Partial<CanvasLayer> = {}
  ): CanvasLayer {
    return {
      id: uid(),
      kind: "image",
      name,
      x,
      y,
      w,
      h,
      rot: 0,
      opacity: 1,
      visible: true,
      locked: false,
      src,
      ...extra,
    };
  }

  if (isLS) {
    return [
      r("Background", 0, 0, W, H, template.primaryColor, { locked: true }),
      r("Accent Top", 0, 0, W, 10, template.accentColor),
      r("Accent Bottom", 0, H - 6, W, 6, template.accentColor),
      img("Profile Photo", 28, H / 2 - 52, 104, 104, data.photo, { circle: true }),
      img("Company Logo", W - 110, 14, 88, 38, data.logo),
      t("full_name", "Full Name", 152, 56, 360, 32, {
        fontSize: 22,
        bold: true,
        text: data.full_name || "Full Name",
      }),
      t("title", "Job Title", 152, 95, 360, 22, {
        fontSize: 14,
        text: data.title || "Job Title / Role",
      }),
      t("department", "Department", 152, 122, 360, 20, {
        fontSize: 12,
        fill: dimColor,
        text: data.department || "Department",
      }),
      t("organization", "Organization", 152, 146, 360, 20, {
        fontSize: 12,
        text: data.organization || "Organization",
      }),
      t("employee_id", "Employee ID", 152, 192, 220, 18, {
        fontSize: 12,
        fill: dimColor,
        text: data.employee_id || "EMP-0001",
      }),
      t("email", "Email", 152, 216, 300, 18, {
        fontSize: 11,
        fill: dimColor,
        text: data.email || "",
      }),
      t("phone", "Phone", 152, 236, 240, 18, {
        fontSize: 11,
        fill: dimColor,
        text: data.phone || "",
      }),
      t("valid_until", "Valid Until", 152, 256, 240, 18, {
        fontSize: 11,
        fill: dimColor,
        text: data.valid_until || "",
      }),
      {
        id: uid(),
        kind: "qr",
        name: "QR Code",
        x: W - 108,
        y: H - 112,
        w: 90,
        h: 90,
        rot: 0,
        opacity: 1,
        visible: true,
        locked: false,
        qrContent: data.employee_id || "IDENTICA",
      },
    ];
  } else {
    return [
      r("Background", 0, 0, W, H, template.primaryColor, { locked: true }),
      r("Accent Top", 0, 0, W, 10, template.accentColor),
      r("Accent Bottom", 0, H - 6, W, 6, template.accentColor),
      img("Company Logo", W / 2 - 44, 18, 88, 38, data.logo),
      t("organization", "Organization", 0, 66, W, 22, {
        fontSize: 13,
        align: "center",
        text: data.organization || "Organization Name",
      }),
      r("Divider", 28, 96, W - 56, 1, template.accentColor, { opacity: 0.6 }),
      img("Profile Photo", W / 2 - 65, 108, 130, 130, data.photo, { circle: true }),
      t("full_name", "Full Name", 0, 254, W, 34, {
        fontSize: 24,
        bold: true,
        align: "center",
        text: data.full_name || "Full Name",
      }),
      t("title", "Job Title", 0, 293, W, 22, {
        fontSize: 14,
        align: "center",
        text: data.title || "Job Title",
      }),
      t("department", "Department", 0, 320, W, 20, {
        fontSize: 12,
        align: "center",
        fill: dimColor,
        text: data.department || "",
      }),
      r("Divider 2", 28, 348, W - 56, 1, template.accentColor, { opacity: 0.6 }),
      t("employee_id", "Employee ID", 30, 362, W - 60, 20, {
        fontSize: 12,
        fill: dimColor,
        text: data.employee_id || "EMP-0001",
      }),
      t("email", "Email", 30, 386, W - 60, 18, {
        fontSize: 11,
        fill: dimColor,
        text: data.email || "",
      }),
      t("phone", "Phone", 30, 408, W - 60, 18, {
        fontSize: 11,
        fill: dimColor,
        text: data.phone || "",
      }),
      t("valid_until", "Valid Until", 30, 430, W - 60, 18, {
        fontSize: 11,
        fill: dimColor,
        text: data.valid_until || "",
      }),
      {
        id: uid(),
        kind: "qr",
        name: "QR Code",
        x: W / 2 - 65,
        y: H - 152,
        w: 130,
        h: 130,
        rot: 0,
        opacity: 1,
        visible: true,
        locked: false,
        qrContent: data.employee_id || "IDENTICA",
      },
    ];
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImageLayer({
  layer,
  onSelect,
  onChange,
}: {
  layer: CanvasLayer;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasLayer>) => void;
}) {
  const [img] = useImage(layer.src || "");

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    onChange({
      x: node.x(),
      y: node.y(),
      w: Math.max(20, layer.w * node.scaleX()),
      h: Math.max(20, layer.h * node.scaleY()),
      rot: node.rotation(),
    });
    node.scaleX(1);
    node.scaleY(1);
  };

  const common = {
    id: layer.id,
    x: layer.x,
    y: layer.y,
    rotation: layer.rot,
    opacity: layer.visible ? layer.opacity : 0,
    draggable: !layer.locked,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  if (layer.circle) {
    return (
      <Group
        {...common}
        clipFunc={(ctx) => {
          ctx.arc(
            layer.w / 2,
            layer.h / 2,
            Math.min(layer.w, layer.h) / 2,
            0,
            Math.PI * 2,
            false
          );
        }}
      >
        {img ? (
          <KImage x={0} y={0} image={img} width={layer.w} height={layer.h} />
        ) : (
          <Rect
            x={0}
            y={0}
            width={layer.w}
            height={layer.h}
            fill="rgba(148,163,184,0.25)"
            stroke="rgba(148,163,184,0.6)"
            strokeWidth={1}
          />
        )}
        <Circle
          x={layer.w / 2}
          y={layer.h / 2}
          radius={Math.min(layer.w, layer.h) / 2}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.5}
          fill="transparent"
          listening={false}
        />
      </Group>
    );
  }

  if (img) {
    return <KImage {...common} image={img} width={layer.w} height={layer.h} />;
  }

  return (
    <Rect
      {...common}
      width={layer.w}
      height={layer.h}
      fill="rgba(148,163,184,0.15)"
      stroke="rgba(148,163,184,0.5)"
      strokeWidth={1}
      dash={[5, 4]}
    />
  );
}

function QrLayer({
  layer,
  onSelect,
  onChange,
}: {
  layer: CanvasLayer;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasLayer>) => void;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!layer.qrContent) return;
    import("qrcode").then((qr) => {
      qr.default
        .toDataURL(layer.qrContent!, {
          width: 200,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
        })
        .then(setQrDataUrl)
        .catch(() => {});
    });
  }, [layer.qrContent]);

  const [qrImg] = useImage(qrDataUrl || "");

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const size = Math.max(20, layer.w * node.scaleX());
    onChange({ x: node.x(), y: node.y(), w: size, h: size, rot: node.rotation() });
    node.scaleX(1);
    node.scaleY(1);
  };

  const common = {
    id: layer.id,
    x: layer.x,
    y: layer.y,
    rotation: layer.rot,
    opacity: layer.visible ? layer.opacity : 0,
    draggable: !layer.locked,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
  };

  if (qrImg) {
    return <KImage {...common} image={qrImg} width={layer.w} height={layer.h} />;
  }

  return (
    <Rect
      {...common}
      width={layer.w}
      height={layer.h}
      fill="rgba(148,163,184,0.15)"
      stroke="rgba(148,163,184,0.5)"
      strokeWidth={1}
      dash={[5, 4]}
    />
  );
}

// ─── Layers panel ─────────────────────────────────────────────────────────────

function LayersPanel({
  layers,
  selectedId,
  onSelect,
  onUpdate,
  onDelete,
  onReorder,
}: {
  layers: CanvasLayer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<CanvasLayer>) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
}) {
  const displayed = [...layers].reverse();

  return (
    <div className="w-48 border-r bg-card flex flex-col min-h-0">
      <div className="px-3 py-2 border-b">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layers</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {displayed.map((layer, displayIdx) => {
          const realIdx = layers.length - 1 - displayIdx;
          const isSelected = layer.id === selectedId;
          return (
            <div
              key={layer.id}
              onClick={() => onSelect(layer.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 text-xs cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10 text-primary" : "hover:bg-accent/50"
              }`}
            >
              <button
                className="shrink-0 hover:text-foreground text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(layer.id, { visible: !layer.visible });
                }}
              >
                {layer.visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
              </button>
              <button
                className="shrink-0 hover:text-foreground text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(layer.id, { locked: !layer.locked });
                }}
              >
                {layer.locked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
              </button>
              <span className="flex-1 truncate">{layer.name}</span>
              <div className="flex shrink-0 gap-0.5">
                <button
                  className="hover:text-foreground text-muted-foreground disabled:opacity-30"
                  disabled={realIdx === layers.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder(realIdx, realIdx + 1);
                  }}
                >
                  <ChevronUp className="size-3" />
                </button>
                <button
                  className="hover:text-foreground text-muted-foreground disabled:opacity-30"
                  disabled={realIdx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder(realIdx, realIdx - 1);
                  }}
                >
                  <ChevronDown className="size-3" />
                </button>
                {!layer.locked && (
                  <button
                    className="hover:text-destructive text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(layer.id);
                    }}
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Properties panel ─────────────────────────────────────────────────────────

function PropertiesPanel({
  layer,
  onUpdate,
}: {
  layer: CanvasLayer | null;
  onUpdate: (id: string, patch: Partial<CanvasLayer>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  if (!layer) {
    return (
      <div className="w-64 border-l bg-card flex items-center justify-center p-4">
        <p className="text-xs text-muted-foreground text-center">Select a layer to edit its properties</p>
      </div>
    );
  }

  const u = (patch: Partial<CanvasLayer>) => onUpdate(layer.id, patch);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Max 10 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => u({ src: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-64 border-l bg-card overflow-y-auto">
      <div className="px-3 py-2 border-b">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {layer.name}
        </p>
      </div>

      <div className="p-3 space-y-4">
        {/* Text-specific */}
        {layer.kind === "text" && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Content</Label>
              <textarea
                className="w-full text-xs border rounded-md p-2 resize-none bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                rows={3}
                value={layer.text || ""}
                onChange={(e) => u({ text: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Font</Label>
              <Select
                value={layer.fontFamily || "Inter, sans-serif"}
                onValueChange={(v) => u({ fontFamily: v })}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Inter, sans-serif", "Arial", "Georgia", "Courier New", "Impact", "Trebuchet MS"].map((f) => (
                    <SelectItem key={f} value={f} className="text-xs">
                      {f.split(",")[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Size</Label>
                <Input
                  type="number"
                  min={6}
                  max={96}
                  className="h-7 text-xs"
                  value={layer.fontSize || 14}
                  onChange={(e) => u({ fontSize: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Color</Label>
                <input
                  type="color"
                  className="w-full h-7 rounded-md border cursor-pointer"
                  value={layer.fill || "#ffffff"}
                  onChange={(e) => u({ fill: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => u({ bold: !layer.bold })}
                className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-md border transition-colors ${
                  layer.bold ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                <Bold className="size-3" /> Bold
              </button>
              <button
                onClick={() => u({ italic: !layer.italic })}
                className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-md border transition-colors ${
                  layer.italic ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                <Italic className="size-3" /> Italic
              </button>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Alignment</Label>
              <div className="flex border rounded-md overflow-hidden">
                {(["left", "center", "right"] as const).map((a) => {
                  const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                  return (
                    <button
                      key={a}
                      onClick={() => u({ align: a })}
                      className={`flex-1 flex items-center justify-center py-1.5 transition-colors ${
                        (layer.align || "left") === a ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      }`}
                    >
                      <Icon className="size-3" />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Image-specific */}
        {layer.kind === "image" && (
          <>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="size-3 mr-1.5" />
                {layer.src ? "Replace image" : "Upload image"}
              </Button>
              {layer.src && (
                <button
                  className="w-full mt-1.5 text-xs text-destructive hover:underline"
                  onClick={() => u({ src: undefined })}
                >
                  Remove image
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="circle-clip"
                checked={!!layer.circle}
                onChange={(e) => u({ circle: e.target.checked })}
                className="cursor-pointer"
              />
              <Label htmlFor="circle-clip" className="text-xs cursor-pointer">
                Circular clip
              </Label>
            </div>
          </>
        )}

        {/* QR-specific */}
        {layer.kind === "qr" && (
          <div className="space-y-1.5">
            <Label className="text-xs">QR Content</Label>
            <Input
              className="text-xs h-7"
              value={layer.qrContent || ""}
              placeholder="Text or URL to encode"
              onChange={(e) => u({ qrContent: e.target.value })}
            />
          </div>
        )}

        {/* Rect-specific */}
        {layer.kind === "rect" && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Fill</Label>
                <input
                  type="color"
                  className="w-full h-7 rounded-md border cursor-pointer"
                  value={layer.fill || "#000000"}
                  onChange={(e) => u({ fill: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Stroke</Label>
                <input
                  type="color"
                  className="w-full h-7 rounded-md border cursor-pointer"
                  value={layer.stroke || "#000000"}
                  onChange={(e) => u({ stroke: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Stroke W</Label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  className="h-7 text-xs"
                  value={layer.strokeWidth || 0}
                  onChange={(e) => u({ strokeWidth: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Radius</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="h-7 text-xs"
                  value={layer.radius || 0}
                  onChange={(e) => u({ radius: Number(e.target.value) })}
                />
              </div>
            </div>
          </>
        )}

        {/* Common position/size */}
        <div className="border-t pt-3 space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Transform</Label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { label: "X", key: "x" },
                { label: "Y", key: "y" },
                { label: "W", key: "w" },
                { label: "H", key: "h" },
              ] as { label: string; key: keyof CanvasLayer }[]
            ).map(({ label, key }) => (
              <div key={key} className="space-y-0.5">
                <Label className="text-xs">{label}</Label>
                <Input
                  type="number"
                  className="h-7 text-xs"
                  value={Math.round(layer[key] as number)}
                  onChange={(e) => u({ [key]: Number(e.target.value) })}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <Label className="text-xs">Rotation °</Label>
              <Input
                type="number"
                min={-360}
                max={360}
                className="h-7 text-xs"
                value={Math.round(layer.rot)}
                onChange={(e) => u({ rot: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-xs">Opacity %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                className="h-7 text-xs"
                value={Math.round(layer.opacity * 100)}
                onChange={(e) => u({ opacity: Number(e.target.value) / 100 })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Editor draft persistence ─────────────────────────────────────────────────

const EDITOR_DRAFT_KEY = (templateId: string) => `idcard-editor-draft-${templateId}`;

interface EditorDraft {
  layers: CanvasLayer[];
  history: CanvasLayer[][];
  histIdx: number;
  savedAt: number;
}

function loadEditorDraft(templateId: string): EditorDraft | null {
  try {
    const raw = localStorage.getItem(EDITOR_DRAFT_KEY(templateId));
    return raw ? (JSON.parse(raw) as EditorDraft) : null;
  } catch {
    return null;
  }
}

function saveEditorDraft(templateId: string, draft: EditorDraft) {
  try {
    // Strip image data URLs from history to keep localStorage size manageable —
    // only persist the CURRENT layers with image data; history entries get images stripped.
    const historyCompact = draft.history.map((snapshot) =>
      snapshot.map((l) =>
        l.kind === "image" && l.src && l.src.startsWith("data:")
          ? { ...l, src: "__image_omitted__" }
          : l
      )
    );
    const payload: EditorDraft = {
      ...draft,
      history: historyCompact,
    };
    localStorage.setItem(EDITOR_DRAFT_KEY(templateId), JSON.stringify(payload));
  } catch {
    // If storage is full, fall back to persisting only the current snapshot
    try {
      const fallback: EditorDraft = {
        layers: draft.layers,
        history: [draft.layers],
        histIdx: 0,
        savedAt: draft.savedAt,
      };
      localStorage.setItem(EDITOR_DRAFT_KEY(templateId), JSON.stringify(fallback));
    } catch {}
  }
}

function clearEditorDraft(templateId: string) {
  try {
    localStorage.removeItem(EDITOR_DRAFT_KEY(templateId));
  } catch {}
}

// ─── Main CardEditor ──────────────────────────────────────────────────────────

export function CardEditor({
  template,
  initialData = {},
}: {
  template: IDCardTemplate;
  initialData?: Record<string, string>;
}) {
  const [mounted, setMounted] = useState(false);
  const isLS = template.orientation === "landscape";
  const CARD_W = isLS ? 720 : 454;
  const CARD_H = isLS ? 454 : 720;

  const draft = loadEditorDraft(template.id);

  const initLayers = () => createDefaultLayers(template, initialData);
  const [layers, setLayers] = useState<CanvasLayer[]>(draft?.layers ?? initLayers());
  const [history, setHistory] = useState<CanvasLayer[][]>(draft?.history ?? [initLayers()]);
  const [histIdx, setHistIdx] = useState(draft?.histIdx ?? 0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [hasDraft] = useState(!!draft);

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => setMounted(true), []);

  // Persist to localStorage whenever layers or history changes
  useEffect(() => {
    saveEditorDraft(template.id, { layers, history, histIdx, savedAt: Date.now() });
  }, [layers, history, histIdx, template.id]);

  // Connect transformer to selected node
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (selectedId) {
      const node = stageRef.current.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, layers]);

  const commit = useCallback(
    (next: CanvasLayer[]) => {
      setLayers(next);
      setHistory((h) => [...h.slice(0, histIdx + 1), next]);
      setHistIdx((i) => i + 1);
    },
    [histIdx]
  );

  const updateLayer = useCallback(
    (id: string, patch: Partial<CanvasLayer>) => {
      const next = layers.map((l) => (l.id === id ? { ...l, ...patch } : l));
      commit(next);
    },
    [layers, commit]
  );

  const deleteLayer = useCallback(
    (id: string) => {
      if (id === selectedId) setSelectedId(null);
      commit(layers.filter((l) => l.id !== id));
    },
    [layers, commit, selectedId]
  );

  const reorderLayers = useCallback(
    (fromIdx: number, toIdx: number) => {
      const next = [...layers];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      commit(next);
    },
    [layers, commit]
  );

  const undo = () => {
    if (histIdx <= 0) return;
    const prev = history[histIdx - 1];
    setLayers(prev);
    setHistIdx((i) => i - 1);
    setSelectedId(null);
  };

  const redo = () => {
    if (histIdx >= history.length - 1) return;
    const next = history[histIdx + 1];
    setLayers(next);
    setHistIdx((i) => i + 1);
    setSelectedId(null);
  };

  const addText = () => {
    const dark = isDark(layers[0]?.fill || "#ffffff");
    const newLayer: CanvasLayer = {
      id: uid(),
      kind: "text",
      name: "New Text",
      x: CARD_W / 2 - 80,
      y: CARD_H / 2 - 12,
      w: 160,
      h: 28,
      rot: 0,
      opacity: 1,
      visible: true,
      locked: false,
      text: "New Text",
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      bold: false,
      italic: false,
      fill: dark ? "#ffffff" : "#1a1a1a",
      align: "center",
    };
    const next = [...layers, newLayer];
    commit(next);
    setSelectedId(newLayer.id);
  };

  const addRect = () => {
    const newLayer: CanvasLayer = {
      id: uid(),
      kind: "rect",
      name: "Rectangle",
      x: CARD_W / 2 - 60,
      y: CARD_H / 2 - 30,
      w: 120,
      h: 60,
      rot: 0,
      opacity: 0.8,
      visible: true,
      locked: false,
      fill: "#3b82f6",
      stroke: undefined,
      strokeWidth: 0,
      radius: 6,
    };
    const next = [...layers, newLayer];
    commit(next);
    setSelectedId(newLayer.id);
  };

  const exportCard = async (format: "png" | "pdf") => {
    const stage = stageRef.current;
    if (!stage) return;
    setExporting(true);
    try {
      // Deselect any active transformer handles so they don't appear in the export
      setSelectedId(null);
      if (transformerRef.current) transformerRef.current.nodes([]);

      // Konva renders the stage canvas at card resolution (CARD_W × CARD_H) regardless of
      // the CSS zoom applied on the wrapper div — capturing directly is correct and avoids
      // a race condition that would arise from changing zoom state before capture.
      const rawCanvas = stage.toCanvas({ pixelRatio: 3 });

      // Composite onto a white background so transparency doesn't produce blank PDF pages.
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = rawCanvas.width;
      exportCanvas.height = rawCanvas.height;
      const ctx = exportCanvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      ctx.drawImage(rawCanvas, 0, 0);
      const dataUrl = exportCanvas.toDataURL("image/png");

      if (format === "png") {
        downloadUrl(dataUrl, "id_card.png");
        toast.success("Exported as PNG");
      } else {
        const { jsPDF } = await import("jspdf");
        // jsPDF v4 reads document.body computed styles on construction; Tailwind CSS v4 uses
        // oklch() colors which jsPDF cannot parse. Override with plain hex inline styles first.
        const bs = document.body.style;
        const prevBg = bs.backgroundColor;
        const prevColor = bs.color;
        bs.backgroundColor = "#ffffff";
        bs.color = "#000000";
        try {
          const pdf = new jsPDF({
            orientation: isLS ? "landscape" : "portrait",
            unit: "mm",
            format: [85.6, 54],
          });
          pdf.addImage(dataUrl, "PNG", 0, 0, isLS ? 85.6 : 54, isLS ? 54 : 85.6);
          pdf.save("id_card.pdf");
          toast.success("Exported as PDF");
        } finally {
          bs.backgroundColor = prevBg;
          bs.color = prevColor;
        }
      }

    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const selectedLayer = layers.find((l) => l.id === selectedId) ?? null;

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Loading editor…
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-card shrink-0 flex-wrap">
        <div className="font-display font-semibold text-sm truncate max-w-[160px]">
          {template.name}
        </div>
        <div className="h-4 w-px bg-border mx-1" />

        <Button variant="ghost" size="sm" onClick={addText} className="h-7 text-xs gap-1">
          <Type className="size-3" /> Text
        </Button>
        <Button variant="ghost" size="sm" onClick={addRect} className="h-7 text-xs gap-1">
          <Square className="size-3" /> Shape
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={histIdx <= 0}
          className="h-7 w-7 p-0"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={histIdx >= history.length - 1}
          className="h-7 w-7 p-0"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="size-3.5" />
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))}
          className="h-7 w-7 p-0"
        >
          <ZoomOut className="size-3.5" />
        </Button>
        <span className="text-xs text-muted-foreground w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom((z) => Math.min(2, +(z + 0.25).toFixed(2)))}
          className="h-7 w-7 p-0"
        >
          <ZoomIn className="size-3.5" />
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => exportCard("png")}
          disabled={exporting}
        >
          <Download className="size-3" /> PNG
        </Button>
        <Button
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => exportCard("pdf")}
          disabled={exporting}
        >
          <Download className="size-3" /> PDF
        </Button>
        <div className="ml-auto flex items-center gap-2">
          {hasDraft && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
              Draft restored
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => {
              if (confirm("Reset all changes and clear draft?")) {
                clearEditorDraft(template.id);
                const fresh = createDefaultLayers(template, initialData);
                setLayers(fresh);
                setHistory([fresh]);
                setHistIdx(0);
                setSelectedId(null);
              }
            }}
          >
            <Plus className="size-3 rotate-45" /> Reset
          </Button>
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        <LayersPanel
          layers={layers}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={updateLayer}
          onDelete={deleteLayer}
          onReorder={reorderLayers}
        />

        {/* Canvas area */}
        <div
          className="flex-1 overflow-auto bg-muted/40 flex items-center justify-center p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
              borderRadius: 4,
              lineHeight: 0,
            }}
          >
            <Stage
              ref={stageRef}
              width={CARD_W}
              height={CARD_H}
              onClick={(e) => {
                if (e.target === e.target.getStage()) setSelectedId(null);
              }}
            >
              <Layer>
                {layers.map((layer) => {
                  if (!layer.visible) return null;

                  if (layer.kind === "rect") {
                    return (
                      <Rect
                        key={layer.id}
                        id={layer.id}
                        x={layer.x}
                        y={layer.y}
                        width={layer.w}
                        height={layer.h}
                        rotation={layer.rot}
                        opacity={layer.opacity}
                        fill={layer.fill}
                        stroke={layer.stroke}
                        strokeWidth={layer.strokeWidth || 0}
                        cornerRadius={layer.radius || 0}
                        draggable={!layer.locked}
                        onClick={() => setSelectedId(layer.id)}
                        onTap={() => setSelectedId(layer.id)}
                        onDragEnd={(e) =>
                          updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })
                        }
                        onTransformEnd={(e) => {
                          const node = e.target;
                          updateLayer(layer.id, {
                            x: node.x(),
                            y: node.y(),
                            w: Math.max(4, layer.w * node.scaleX()),
                            h: Math.max(4, layer.h * node.scaleY()),
                            rot: node.rotation(),
                          });
                          node.scaleX(1);
                          node.scaleY(1);
                        }}
                      />
                    );
                  }

                  if (layer.kind === "text") {
                    return (
                      <Text
                        key={layer.id}
                        id={layer.id}
                        x={layer.x}
                        y={layer.y}
                        width={layer.w}
                        text={layer.text || ""}
                        fontSize={layer.fontSize || 14}
                        fontFamily={layer.fontFamily || "Inter, sans-serif"}
                        fontStyle={
                          layer.bold && layer.italic
                            ? "bold italic"
                            : layer.bold
                            ? "bold"
                            : layer.italic
                            ? "italic"
                            : ""
                        }
                        fill={layer.fill || "#ffffff"}
                        align={layer.align || "left"}
                        rotation={layer.rot}
                        opacity={layer.opacity}
                        draggable={!layer.locked}
                        onClick={() => setSelectedId(layer.id)}
                        onTap={() => setSelectedId(layer.id)}
                        onDragEnd={(e) =>
                          updateLayer(layer.id, { x: e.target.x(), y: e.target.y() })
                        }
                        onTransformEnd={(e) => {
                          const node = e.target;
                          updateLayer(layer.id, {
                            x: node.x(),
                            y: node.y(),
                            w: Math.max(20, layer.w * node.scaleX()),
                            rot: node.rotation(),
                          });
                          node.scaleX(1);
                          node.scaleY(1);
                        }}
                      />
                    );
                  }

                  if (layer.kind === "image") {
                    return (
                      <ImageLayer
                        key={layer.id}
                        layer={layer}
                        onSelect={() => setSelectedId(layer.id)}
                        onChange={(patch) => updateLayer(layer.id, patch)}
                      />
                    );
                  }

                  if (layer.kind === "qr") {
                    return (
                      <QrLayer
                        key={layer.id}
                        layer={layer}
                        onSelect={() => setSelectedId(layer.id)}
                        onChange={(patch) => updateLayer(layer.id, patch)}
                      />
                    );
                  }

                  return null;
                })}
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 10 || newBox.height < 10) return oldBox;
                    return newBox;
                  }}
                  enabledAnchors={[
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                    "middle-left",
                    "middle-right",
                  ]}
                  rotateEnabled={true}
                  borderStroke="#3b82f6"
                  borderStrokeWidth={1.5}
                  anchorFill="#ffffff"
                  anchorStroke="#3b82f6"
                  anchorSize={8}
                  anchorCornerRadius={2}
                />
              </Layer>
            </Stage>
          </div>
        </div>

        <PropertiesPanel layer={selectedLayer} onUpdate={updateLayer} />
      </div>
    </div>
  );
}

function downloadUrl(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}
