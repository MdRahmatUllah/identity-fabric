# ID Card Feature — State-of-the-Art Improvement Report

**Project:** Identica · Identity Fabric  
**Date:** 2026-05-09  
**Scope:** ID Card generation feature gap analysis and enhancement roadmap  
**Benchmark tools:** BadgeMaker, ID Works, AlphaCard, EasyBadge, Canva, Figma, Asure Software

---

## Executive Summary

The current ID card feature delivers a solid foundation: 20 templates, front/back sides, photo/QR/logo toggles, and PNG/PDF export. However, it operates as a **form-that-generates-a-card** rather than a true **ID card design tool**. The gap between the two is significant. This report documents every enhancement needed to reach state-of-the-art quality, grouped by impact tier and priority.

---

## Priority Tiers

| Tier | Label | Description |
|------|-------|-------------|
| P0 | **Critical** | Transforms the product category. Build immediately. |
| P1 | **High** | Major differentiators that drive retention and B2B revenue. |
| P2 | **Medium** | Strong secondary features that round out the product. |
| P3 | **Moat** | Specialized capabilities that competitors lack at this price point. |

---

---

# P0 — Critical Features

---

## 1. Visual Drag-and-Drop Card Editor

### Why It Matters
The single most transformative missing capability. Every professional ID card tool (BadgeMaker, ID Works, AlphaCard) is built around a visual canvas. Currently users fill a form and hope the output looks correct — they have zero spatial control. This change shifts the product from "template filler" to "card design tool."

### Feature Description
A full visual editor where every element on the card is selectable, draggable, and resizable directly on the card canvas.

### Sub-Features

**Selection & Manipulation**
- Click any element (text, photo, logo, QR, shape) to select it
- Blue selection handles appear with resize anchors on corners and edges
- Drag selected element to any position on the card
- Resize by dragging handles; hold Shift to constrain aspect ratio
- Rotate element by dragging the rotation handle (circle above selection box)
- Double-click text to enter inline edit mode
- Press Escape to deselect / exit text edit
- Delete key removes selected element

**Smart Alignment Guides**
- Snap-to-grid: configurable grid size (2mm, 5mm, custom)
- Smart snap lines appear automatically when element edge or center aligns with another element or card boundary
- Snap to card center (horizontal and vertical)
- Snap to bleed boundary and safe zone
- Snap distance threshold configurable in settings
- Hold Alt to temporarily disable snapping while dragging

**Layer Panel**
- Sidebar panel listing all elements in z-order (top to bottom)
- Drag layers to reorder (changes z-index)
- Eye icon to show/hide individual elements
- Lock icon to prevent accidental editing
- Rename layers for clarity
- Group / ungroup multiple selected elements
- Duplicate layer

**Multi-Selection**
- Drag a marquee (rubber-band select) to select multiple elements
- Shift+click to add/remove from selection
- Align selection tools: align left edges, center horizontally, align right edges, align top edges, center vertically, align bottom edges
- Distribute evenly: horizontal spacing, vertical spacing

**Canvas Controls**
- Zoom in/out with Ctrl+scroll or pinch-to-zoom
- Zoom presets: Fit, 50%, 100%, 150%, 200%
- Pan canvas by holding Space + drag
- Minimap overview in corner for zoomed-in navigation
- Toggle rulers (px / mm / inches)
- Toggle grid overlay
- Toggle bleed/safe zone guides

### Implementation Notes
- Use a canvas library such as **Fabric.js** or **Konva.js** for the interactive canvas
- Keep a JSON-serializable document model (list of layer objects with position, size, style, content)
- Render the same JSON model to a static DOM tree for html2canvas export (decouple editor canvas from export renderer)
- Store document model in React state with immer for immutability

### Complexity
High — 3–4 weeks of focused development. This is the core investment.

---

## 2. Per-Field Typography & Text Styling

### Why It Matters
Currently every text element on a card uses template-defined styling. Users cannot change the font, size, or color of their name field independently from the title field. This is a dealbreaker for brand-conscious organizations.

### Sub-Features

**Font Family**
- Curated font picker with 40–60 fonts (not an overwhelming full Google Fonts list)
- Organized by category: Sans-serif, Serif, Display, Monospace
- Live preview of font applied to selected text
- Google Fonts API integration for loading fonts on demand
- Recently used fonts pinned at top
- Favorite fonts saved per user
- Suggested "pairs" for heading + body combination

**Font Size**
- Numeric input field (accepts decimals for fine control)
- Slider for quick adjustment
- Preset sizes: 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 24, 32, 48
- Auto-shrink option: text scales down to fit within its bounding box instead of overflowing
- Min/max font size bounds for auto-shrink

**Text Formatting**
- Bold toggle (font-weight 700)
- Italic toggle
- Underline toggle
- Strikethrough toggle
- ALL CAPS toggle (CSS text-transform)
- Small caps toggle

**Text Color**
- Color picker: hex input, RGB sliders, HSL sliders, opacity slider
- Color history (last 12 used colors)
- Organization color palette swatches
- Eyedropper tool to sample any color from the card canvas
- Gradient text (linear gradient across the text string)

**Text Alignment & Spacing**
- Horizontal alignment: left / center / right / justify
- Letter spacing (tracking): -0.05em to +0.5em, slider + input
- Line height (leading): 0.8 to 3.0, slider + input
- Paragraph spacing (for multi-line text blocks)

**Text Effects**
- Drop shadow: X offset, Y offset, blur, color, opacity
- Text stroke: width and color
- Background fill: color with padding and border-radius
- Text opacity

**Text Box Behaviour**
- Fixed size: text clips or auto-shrinks within defined bounds
- Auto-width: box grows with content
- Word wrap toggle

### Complexity
Medium — 1–2 weeks. Typography controls are well-understood UI patterns.

---

## 3. Color, Gradient & Background Customization

### Why It Matters
Templates have fixed color palettes. Organizations have brand colors. A user from a company with a teal brand should not be forced to use a "Corporate Navy" template — they should be able to recolor any template instantly.

### Sub-Features

**Card Background**
- Solid color: full color picker with hex, RGB, HSL, opacity
- Two-color linear gradient: pick start color, end color, and angle (0–360°)
- Two-color radial gradient: inner and outer color, focal point position
- Mesh gradient: 4-point control with interpolation (advanced)
- Image background: upload any image, set opacity, fit/fill/tile
- Pattern library (see Section 5 on Design Elements)

**Primary & Accent Color Pickers**
- Dedicated "primary color" and "accent color" swatches in the toolbar
- Changing these recolors all template elements that reference those tokens
- Color token system: elements are tagged as "primary", "accent", "text-on-primary", etc.
- Instant live recolor preview

**Gradient Editor**
- Visual gradient bar with draggable color stops
- Add / remove color stops (click to add, drag off to remove)
- Stop position: numeric input or drag
- Each stop: full color picker + opacity
- Direction control: angle wheel for linear, focal point drag for radial
- Preset gradients: 30+ named presets (Sunset, Ocean, Forest, Neon, etc.)
- Copy CSS gradient string to clipboard

**Color Palette System**
- System palette: default Identica colors
- Organization palette: brand colors uploaded by admin (3–10 swatches)
- Project palette: colors extracted from uploaded logo / photo
- Recent colors: last 20 used across all editing sessions

**Template Color Variants**
- Each of the 20 templates ships with 5 color variants (100 total combinations)
- User can apply a variant as a starting point then customize further
- "Randomize colors" button applies a harmonious random color scheme

### Complexity
Medium — 1.5 weeks.

---

---

# P1 — High Impact Features

---

## 4. Bulk / Batch Card Generation from CSV

### Why It Matters
The highest-value B2B use case. A school administrator needs 400 student IDs. An event organizer needs 200 badge passes. A hospital needs cards for every staff member. Without batch generation, these users either pay for enterprise software or abandon the tool entirely.

### Sub-Features

**CSV / Excel Import**
- Upload `.csv`, `.xlsx`, or `.xls` file
- Column header auto-detection: headers like "Full Name", "full_name", "Name" all map to the `full_name` field
- Manual column mapping UI: dropdown to assign each spreadsheet column to a card field
- Preview table showing first 10 rows with mapped data
- Validation pass before generation: highlight rows with missing required fields
- Row count indicator: "482 valid rows, 3 rows with errors"
- Option to skip invalid rows or halt on first error

**Photo Import for Batch**
- Photo column: specify a filename in the CSV (e.g., `john_smith.jpg`)
- Upload a ZIP of photos alongside the CSV — system matches filenames
- Fallback: use a default photo for rows with no photo file found
- Photo column can also contain a URL (fetched during generation)

**Generation Process**
- Progress bar: "Generating 147 of 482 cards…"
- Cancel button mid-generation
- Individual card preview as they are generated (thumbnail stream)
- Error log: cards that failed to generate with reason

**Export Options for Batch**
- ZIP of individual PNG files, named by ID or full name
- Multi-page PDF (one card per page, print-shop ready)
- Print sheet PDF: 8 cards per A4 page (standard business card layout), 10 per Letter
- Front-only, back-only, or both sides (front/back on consecutive pages)
- Filename template: `{employee_id}_{full_name}` with variable substitution

**Data Preview & Dry Run**
- "Preview mode": render first 5 cards before committing to full batch
- Edit individual rows inline in the preview before generating
- Save the column mapping configuration for reuse

### Complexity
High — 2 weeks. The generation loop itself is straightforward; the file parsing, photo matching, and ZIP bundling require careful implementation.

---

## 5. Advanced Photo Editing Tools

### Why It Matters
ID card photos are often poor quality. A passport-style crop tool, background removal, and basic adjustments dramatically improve the output quality without requiring users to pre-process photos in external software.

### Sub-Features

**Interactive Crop & Pan**
- After upload, photo opens in a crop modal
- Drag to pan the photo within a fixed aspect-ratio frame
- Pinch/scroll to zoom in and out
- "Crop to face" button: uses the browser's Face Detection API or a client-side ML model (face-api.js) to auto-center on the detected face
- Crop shape selector: circle, rectangle, rounded rectangle, hexagon, diamond
- The selected shape becomes the photo mask on the card
- Preview shows masked photo in real-time before confirming

**Background Removal**
- One-click "Remove Background" button
- Integrates with the [remove.bg API](https://www.remove.bg/api) or runs a client-side model (rembg WASM / ONNX)
- Result: transparent-background PNG composited on the card background
- Manual refinement: paint-over tool to add back or erase parts of the mask
- Works for both the profile photo and the company logo

**Adjustments**
- Brightness: –100 to +100
- Contrast: –100 to +100
- Saturation: –100 to +100 (0 = grayscale)
- Warmth/Temperature: cool to warm shift
- Sharpness: 0 to +100
- Vignette: strength and radius
- All applied in real-time via CSS `filter` or a canvas filter pipeline
- "Auto Enhance" button: applies AI-suggested optimal adjustments

**Filters / Presets**
- 12 named photo presets: Natural, Vivid, Matte, B&W, High Contrast, Faded, Cool, Warm, Documentary, Faded Film, Cinematic, Passport
- Each filter is a named combination of the adjustment values above
- One-click apply; adjustments are still individually editable after

**Photo Orientation**
- Rotate 90° CW / CCW
- Flip horizontal (mirror)
- Flip vertical
- Free rotation with degree input

**Photo Frame Styles**
- No frame
- Thin border (color picker, width slider)
- Shadow drop (offset X/Y, blur, color)
- Glow effect (color, intensity)
- Inner stroke
- Rounded corners (independent corner radii)

### Complexity
Medium-High — 2 weeks. The crop/pan UI is well-documented; background removal requires API integration or WASM model bundling.

---

## 6. Enhanced QR Code & Barcode System

### Why It Matters
Currently the QR code is a fixed data dump of name + ID + org. This serves verification but not much else. Professional ID systems encode structured data that links to a live profile, enables digital check-in, or carries emergency medical information.

### Sub-Features

**QR Code Content Types**
- Plain text (current default)
- URL: links to a web page (employee profile, digital card viewer, company website)
- vCard 3.0: encodes name, organization, phone, email — scanning adds the person to contacts
- WiFi credentials: SSID, password, encryption type (useful for event badges)
- Email: pre-addressed email compose
- Phone number: tap-to-call
- Digital card URL: links to a hosted Identica profile page
- Custom JSON payload: for system integrations

**QR Code Visual Customization**
- Dot style: square (standard), rounded, dots, extra-rounded, classy, classy-rounded
- Corner square style: square, extra-rounded, dot
- Corner dot style: square, dot
- Foreground color: full color picker
- Background color: transparent or custom color
- Embed logo in center: upload image to display in the QR center (15–30% coverage max)
- Error correction level: L (7%), M (15%), Q (25%), H (30%) — higher = more damage-resilient
- Size: small / medium / large / custom px

**Barcode Formats**
- Code 128 (default — compact alphanumeric)
- Code 39 (widely supported industrial)
- EAN-13 (retail product code format)
- EAN-8
- UPC-A
- Interleaved 2-of-5
- PDF417 (2D, high data capacity — used on driver's licenses)
- Data Matrix (compact 2D)
- Aztec (used on boarding passes)
- Show/hide human-readable text below barcode
- Barcode color and background color

**QR Code Position & Size**
- Not locked to corners — drag anywhere in visual editor
- Size slider
- Show/hide border/padding around QR

**Dynamic QR Codes (Premium)**
- QR content is a short URL redirect (e.g., `identica.co/q/ABC123`)
- Destination URL configurable without regenerating the card
- Scan count analytics: how many times the QR was scanned
- Time-limited QR: expires after a date or number of scans
- Redirect by device type: mobile users → digital card, desktop → employee directory

### Complexity
Medium — 1.5 weeks. Libraries like `qr-code-styling` handle most visual QR rendering; barcode formats need a library like `JsBarcode`.

---

## 7. Print-Ready Professional Export

### Why It Matters
The current export produces a screen-resolution image. Card printers (Zebra ZC300, HID FARGO, Matica) require 300 DPI minimum. Offset print shops need crop marks and bleed. Without this, the tool cannot serve professional printing workflows.

### Sub-Features

**Resolution Options**
- Screen (96 DPI): fast preview, small file
- Standard (150 DPI): good for home inkjet printing
- Professional (300 DPI): required for card printers and print shops
- Ultra-High (600 DPI): archival quality, large file
- Custom DPI input
- Display resulting pixel dimensions and estimated file size before exporting

**Bleed & Crop Marks**
- Add 3mm bleed area around all four card edges (industry standard)
- Bleed fills the background color/gradient to the bleed boundary
- Show/hide crop marks and registration marks on export
- Safe zone guide (inset 3mm from card edge) shown in editor as a dashed line
- Warning indicator if any critical text falls outside the safe zone

**Sheet Layout Export**
- "Print Sheet" mode: arrange multiple cards on a standard paper size
- Paper size: A4, A3, Letter, Legal
- Layout presets:
  - 2 × 4 landscape cards on A4 (8 per sheet)
  - 3 × 3 portrait cards on A4 (9 per sheet)
  - 2 × 5 landscape cards on Letter (10 per sheet)
  - Custom rows × columns
- Margin and gutter controls
- Toggle: crop marks between cards for cutting guide
- Toggle: include back sides (alternating pages or side-by-side)
- Export as single PDF ready to send to a print shop

**Export Formats**
- PNG: lossless, transparent background option, configurable DPI
- JPEG: compressed, configurable quality (85–100%), DPI
- PDF: vector text preserved where possible, embedded fonts, proper DPI
- SVG: fully scalable vector (no raster elements, photos embedded as base64)
- TIFF: professional archival format, LZW compression, 300+ DPI
- PDF/X-1a: print-shop industry standard with embedded fonts and CMYK profile

**CMYK Color Information**
- Display CMYK equivalent for all colors in the design
- Warning flag if any color is out-of-gamut for CMYK printing
- Soft-proofing: shift card colors to simulate CMYK rendering
- One-click convert to CMYK-safe palette

**Card Printer Integration**
- Export in Zebra ZPL format (direct card printer language)
- Export in YMCK ribbon color channel separated files (for HID FARGO printers)
- Print profile presets saved per printer model

### Complexity
Medium — 1.5 weeks. html2canvas scale factor covers DPI; bleed and sheet layout require custom canvas compositing logic.

---

## 8. Undo / Redo & Session Persistence

### Why It Matters
Losing work is a cardinal UX sin. Inability to undo a mistake forces users to start over. This is table-stakes for any design tool.

### Sub-Features

**Undo / Redo Stack**
- Full command history stored as a stack of state snapshots
- Ctrl+Z / Cmd+Z: undo last action
- Ctrl+Shift+Z / Cmd+Shift+Z: redo
- Dedicated undo/redo toolbar buttons with hover tooltip showing action name ("Undo: Move Name field", "Redo: Change accent color")
- Stack depth: minimum 50 actions
- Actions captured: field value changes, element moves/resizes, style changes, element add/delete, color changes
- Clear history button (with confirmation)

**Auto-Save**
- Auto-save current state to `localStorage` every 30 seconds
- Keyed by templateId + userId so multiple cards don't collide
- "Unsaved changes" indicator dot in header (like VS Code)
- Explicit "Save Draft" button
- Save drafts to server (Supabase) for cross-device access

**Session Recovery**
- On template open: detect if a saved draft exists
- Prompt: "You have unsaved work from 2 hours ago — Continue editing or Start fresh?"
- Show a thumbnail preview of the saved draft in the prompt

**Named Save Slots**
- Save current state with a custom name ("John's Badge v2", "Conference 2026")
- Up to 10 named saves per template
- Load any saved state with a click
- Delete saves
- Displayed with timestamp

**Version History (Server-Saved)**
- Each "Export" or manual save creates a version entry
- View timeline of versions with thumbnails
- Restore any past version
- Diff view: side-by-side comparison of two versions

### Complexity
Medium — 1 week. The undo stack is an immutable state history; auto-save to localStorage is straightforward. Server-side version history requires a DB table and thumbnail storage.

---

---

# P2 — Medium Priority Features

---

## 9. Security & Anti-Counterfeiting Layer

### Why It Matters
Government IDs, access badges, and official credentials require tamper-evident visual security features. No SaaS ID card tool at this price point provides guilloche generation or microtext. This is a genuine product moat.

### Sub-Features

**Guilloche Pattern Generator**
- Guilloche patterns are the complex, interlocking wave patterns found on banknotes, passports, and official documents
- Parameter controls:
  - Wave frequency (1–20)
  - Wave amplitude (1–50)
  - Number of wave lines (5–200)
  - Rotation angle
  - Color (single or gradient)
  - Opacity (typically 5–15% over the card background)
- Pattern types: rose, rosette, wavy lines, spirograph, mesh
- Rendered as SVG paths for vector scalability
- Can be placed as a full card background or partial overlay
- Export includes the guilloche in the full-res output

**Microtext**
- Embed very small text (0.3–0.8pt) readable only under 10× magnification
- Typically placed along borders or within design elements
- Content: organization name, card serial, legal disclaimer, date issued
- Appear as decorative lines to the naked eye
- Configurable color (usually slightly different from background)
- Path-based microtext: text follows a curve or border shape

**Serial Number Auto-Generation**
- Configurable format: `[PREFIX]-[YEAR]-[SEQUENCE]`
- Example formats: `EMP-2026-00142`, `BADGE-A04821`, `MED-20260509-001`
- Sequence auto-increments across all cards generated in the same session or org
- Include as both human-readable text and encoded in QR/barcode
- Sequential, random, or alphanumeric ID types
- Checksum digit option (Luhn algorithm)

**UV / Invisible Ink Layer Design**
- Design mode toggle: "UV layer view"
- In UV mode, canvas shows a dark background simulating UV light
- Elements tagged as "UV only" are visible in this mode
- On export: UV layer elements exported as a separate file (for dual-pass printing on UV printers)
- Common UV elements: logo duplicate, star pattern, "AUTHENTIC" text
- Note and guide educating users about UV printer compatibility

**Hologram Placeholder**
- Standard hologram sticker size/position indicator (30mm × 30mm round or 40mm × 20mm oval)
- Preview shows a simulated iridescent texture as placeholder
- Export: area is marked with a registration mark for hologram application
- Standard hologram types: starburst, kinegram, dove

**Digital Signature Embedding**
- Generate a cryptographic signature of the card data (name, ID, issued date)
- Encode signature in QR code alongside card data
- Verification API endpoint: scan QR → verify signature → confirm authenticity
- Private/public key pair generated per organization
- Tamper detection: if card data is altered, signature verification fails

### Complexity
Medium-High (for guilloche) — 2 weeks. Guilloche generation is a well-documented mathematical problem (Spirograph equations). Microtext and serial numbers are straightforward. Digital signatures require a backend endpoint.

---

## 10. Digital Card Delivery & Wallet Integration

### Why It Matters
Physical card + digital equivalent = complete identity solution. Apple Wallet and Google Wallet passes are free to create, scannable, updateable without reprinting, and live on users' phones permanently.

### Sub-Features

**Apple Wallet Pass (PKPass)**
- Generate a `.pkpass` file downloadable directly from the browser
- Pass types: Generic (ID badge), Event Ticket, Boarding Pass (for event credentials)
- Fields mapped from card data: name, org, title, ID, valid until, photo
- Pass design: background color, label color, foreground color from template palette
- QR or barcode on the back of the pass
- Organization logo on the pass strip
- Updateable via Apple Push Notification Service (APN): change valid date or revoke without user action
- Download as `.pkpass` + email delivery to card recipient
- Requires: Apple Developer account, pass signing certificate

**Google Wallet Pass**
- Google Pay API: Generic pass class and object
- Same fields as Apple Wallet
- Add to Google Wallet button embedded in email or card detail page
- Updateable via Google Pay API
- Works on Android without any additional app

**Shareable Web Card URL**
- Each generated card gets a unique URL: `identica.co/card/ABC123XYZ`
- Page shows a beautiful digital version of both front and back
- Viewer is mobile-responsive
- Optional privacy: password-protected link, expiry date for link, domain-restricted viewing
- Recipient can add the card to their contacts (downloads a `.vcf` vCard file)
- Open Graph meta tags: when link is shared on Slack/WhatsApp, a preview image of the card appears

**NFC Encoding**
- Web NFC API support (Chrome on Android)
- Write card data to an NFC tag/sticker with one tap
- Encoded as a URL pointing to the shareable web card page
- Or encode as a NDEF record with structured contact data
- Instructions shown for pairing with NFC-enabled access control readers
- QR fallback for devices without NFC

**Email Delivery**
- Send card directly to recipient's email from the generator
- Email contains: card image (front + back), PDF attachment, download links
- Template email design with organization branding
- Delivery tracking: "Card sent to alex@company.com at 14:32"
- Recipient can reply "Card received" to acknowledge

### Complexity
Medium (web card URL, email) to High (Wallet passes require Apple/Google developer accounts and server-side signing).

---

## 11. Custom Template Builder

### Why It Matters
20 fixed templates cannot satisfy every organization's brand. The template builder turns customers into creators, expands the template library organically, and enables a marketplace model.

### Sub-Features

**Blank Canvas Start**
- "Create new template" option alongside "Browse templates"
- Choose orientation (landscape / portrait) and card size
- Empty canvas with grid and guides

**Element Toolbar**
- Text box: static text or data-bound field variable
- Image box: photo placeholder, logo placeholder, or static image
- Shape: rectangle, rounded rectangle, circle/ellipse, line, triangle, polygon (custom sides)
- QR code element
- Barcode element
- Divider line
- Background shape (full-bleed, decorative)

**Field Variables**
- Any text box can be bound to a card data field
- Variable picker: click `{}` button to insert `{{full_name}}`, `{{title}}`, `{{employee_id}}`, etc.
- Preview mode: fill template with sample data to see how it renders
- Required field marker on bound text boxes

**Template Properties Panel**
- Template name
- Category
- Description
- Thumbnail (auto-generated from canvas or manually uploaded)
- Orientation lock

**Save & Manage**
- Save to "My Templates" library
- Templates appear alongside the built-in 20 in the gallery
- Edit existing custom template
- Duplicate (as starting point for a variant)
- Delete with confirmation
- Export template as JSON file (portable, importable)
- Import template JSON

**Template Sharing**
- Share template with your organization (all org members can use it)
- Generate a share link to send to another Identica user
- Submit to public template marketplace (reviewed before approval)
- Template versioning: update a template without breaking existing generated cards

### Complexity
High — 3 weeks (shares much of the drag-and-drop editor code from Feature #1, which is why #1 is P0 and this is P2 — they are built on the same foundation).

---

## 12. Card Lifecycle Management

### Why It Matters
Generating a card is the beginning, not the end. Organizations need to know who has active cards, when they expire, and how to revoke access when someone leaves. This transforms Identica from a card maker into an identity management platform.

### Sub-Features

**Card Issuance**
- After generating a card, "Issue" button officially records it as active
- Issuance record stored with: recipient info, template used, issue date, expiry date, issuer (logged-in user), organization
- Card status: `Draft` → `Issued` → `Expired` / `Revoked`
- Issue confirmation email sent to recipient (if email on file)
- Card number auto-assigned if not provided manually

**Card Registry**
- Dashboard table of all issued cards for the organization
- Columns: Name, ID, Template, Status, Issued Date, Expiry Date, Issuer
- Filter by status, template, date range
- Search by name or ID number
- Export registry as CSV for compliance/HR records

**Expiry Alerts**
- Email notification to card admin 60, 30, and 7 days before card expiry
- In-app alert badge on the History / Registry page
- "Cards expiring soon" widget on the dashboard
- Option to auto-revoke on expiry date

**Card Renewal**
- One-click "Renew" from the card registry
- Opens generator pre-filled with all existing card data
- New expiry date field (auto-suggested: +1 year from today)
- New card issued with incremented version number
- Old card automatically moves to `Superseded` status
- Renewal confirmation email to recipient

**Card Revocation**
- "Revoke" button with reason field (employee left, card lost, security breach)
- Revoked status immediately invalidates the QR code verification
- Revocation reason and timestamp recorded in audit log
- Revocation notification sent to recipient (optional)
- Revoked cards shown with red badge in registry
- Bulk revoke: select multiple cards and revoke at once

**Lost Card Reporting**
- "Report Lost" flow: marks card as lost, triggers revocation, prompts to issue replacement
- Replacement card issued with "REPLACEMENT" flag in internal record
- Lost card history tracked (card serial blacklisted)

**Audit Log**
- Every action on every card logged: issued by, revoked by, renewed by, exported by, viewed by
- Timestamps in UTC with local time display
- Filter log by user, date range, action type
- Export audit log as CSV for compliance

**Analytics**
- Total cards issued this month / year
- Active vs expired vs revoked breakdown (pie chart)
- Cards by template (bar chart)
- Cards expiring in next 30/60/90 days
- Top card issuers (by team member)

### Complexity
Medium (tracking + UI) to High (QR revocation backend, email notifications).

---

---

# P3 — Moat Features

---

## 13. Organization Brand Kit

### Why It Matters
Teams generating cards should not need to configure colors and logos on every single card. The brand kit sets defaults once and enforces them consistently. This is how Canva Teams and Figma organizations work.

### Sub-Features

**Brand Kit Setup**
- Dedicated "Brand Settings" page (org admin only)
- Upload primary logo (light version and dark version)
- Upload secondary/alternate logo
- Define primary brand color
- Define accent/secondary color
- Define text-on-primary color
- Define text-on-white color
- Upload brand font files (WOFF2) or specify Google Fonts names
- Set default card template for the organization

**Lock Fields for Non-Admins**
- Admin can mark any field as "locked": value is pre-filled and non-editable by regular users
- Typical locked fields: Organization name, department prefix, logo, primary color
- Locked fields displayed with a lock icon in the form
- Locked elements not draggable in the visual editor

**Brand Color Auto-Application**
- When a user opens a template, primary and accent colors auto-apply from brand kit
- User can override if unlocked
- "Reset to brand colors" button

**Brand Compliance Check**
- Before export: validate card against brand guidelines
- Warnings for: wrong logo, off-brand color, non-brand font
- Admin can set warnings as blocking (must fix before export) or advisory

### Complexity
Medium — 1.5 weeks.

---

## 14. Smart Field Types & Dynamic Content

### Why It Matters
The current fields are all free-text. Real-world use cases require validated, computed, and conditional fields.

### Sub-Features

**Dropdown / Select Fields**
- Field type: `select` with predefined options
- Admin configures options list for each dropdown field
- Examples:
  - Department: dropdown populated from HR data or manually configured list
  - Blood Type: A+, A-, B+, B-, O+, O-, AB+, AB-
  - Access Level: Standard, Elevated, Administrator, Visitor
  - Card Type: Employee, Contractor, Visitor, Student

**Auto-Increment ID Field**
- Field type: `auto-id`
- Format string with placeholders: `EMP-{YEAR}-{SEQ:4}` → `EMP-2026-0042`
- Sequence stored per organization, increments with each generated card
- Reset sequence per template or globally
- Preview next ID before generating

**Computed Date Fields**
- "Issued On" field: auto-populates with today's date on generation
- "Valid Until" field: can be set as `issued_date + 365 days` formula
- Date display format: configurable (YYYY-MM-DD, DD/MM/YYYY, MMM D, YYYY, etc.)
- "Time Since Issue" dynamic display (shows age of card when viewed in digital card URL)

**Conditional Field Visibility**
- Show/hide fields based on another field's value
- Examples:
  - "Emergency Contact" field only visible when "Card Type = Medical"
  - "Contractor Company" field only visible when "Employee Type = Contractor"
  - "Blood Type" field only visible when "Department = Healthcare"
- Configured in template settings by admin

**Character Validation**
- Regex validation on text fields (e.g., ID must match `EMP-\d{4}`)
- Length min/max enforcement with live counter
- Format hints shown below field (e.g., "+1 (XXX) XXX-XXXX")
- Email format validation on email fields
- Date range validation on date fields (can't set expiry before today)

**Linked / Lookup Fields**
- Integration point: field value fetched from an external source by entering an ID
- Type an employee ID → auto-fill name, department, title from an HR system API
- Supported lookups: REST API (custom URL), Google Sheets, Airtable
- Fallback: manual entry if lookup fails

### Complexity
Medium — 1.5 weeks for dropdown/computed fields; High for linked/lookup fields (requires API integration framework).

---

---

# UX Polish & Quick Wins

These are individually small changes but collectively create a professional, polished experience.

---

## 15. Canvas & Preview Enhancements

| Enhancement | Description |
|---|---|
| **3D Flip Animation** | CSS `perspective` + `rotateY` animation when toggling front/back. Smooth 0.6s flip. |
| **Side-by-side front/back view** | Optional layout showing both sides simultaneously at reduced scale |
| **Zoom controls on preview** | Magnifier button / scroll to zoom the preview panel independently |
| **Mobile screenshot mockup** | Toggle to show card rendered as if photographed on a table or held in a hand |
| **Dark/light card background** | Toggle preview background between white, dark, and checkered (for transparency) |
| **Bleed guide overlay** | Dashed line showing safe zone, toggleable |
| **Ruler overlay** | Horizontal and vertical rulers in mm/px, toggleable |
| **Print preview mode** | Simulate how the card looks printed on paper under room lighting |

---

## 16. Editor UX Shortcuts

| Enhancement | Description |
|---|---|
| **Keyboard shortcuts panel** | `?` key opens floating shortcuts reference |
| **Ctrl+Z / Ctrl+Y** | Undo / Redo (see Section 8) |
| **Tab to cycle fields** | Tab key moves focus through form fields in logical order |
| **Ctrl+P** | Open print preview |
| **Ctrl+E** | Open export dialog |
| **Ctrl+D** | Duplicate selected element |
| **Ctrl+G / Ctrl+Shift+G** | Group / ungroup selected elements |
| **Arrow keys** | Nudge selected element by 1px; Shift+Arrow = 10px |
| **Ctrl+A** | Select all elements |
| **Ctrl+Shift+H / V** | Align selected to horizontal / vertical center |
| **F** | Fit canvas to window |
| **1 / 2 / 3** | Zoom to 100% / 150% / 200% |

---

## 17. Data Entry Improvements

| Enhancement | Description |
|---|---|
| **"Fill with sample data" button** | One click fills all fields with realistic demo data to preview the template |
| **Copy data between templates** | Switch template without re-entering all field values |
| **Import from LinkedIn/vCard** | Paste a vCard `.vcf` file or LinkedIn profile URL → auto-fill name, title, email, photo |
| **Field autocomplete** | Organization field autocompletes from previous entries |
| **Paste image from clipboard** | Ctrl+V pastes an image directly into the photo field |
| **Drag image from desktop** | Drag a photo from the OS file manager onto the photo dropzone |
| **Camera capture** | On mobile: tap photo field → opens device camera to take a live photo |
| **Field history** | Dropdown of last 5 values used for each field across sessions |

---

## 18. Template Gallery Improvements

| Enhancement | Description |
|---|---|
| **Hover to see back side** | Hovering a template card in gallery flips it to reveal the back side |
| **Color variant swatches** | Show 5 color variants per template in gallery with one-click preview |
| **"New" and "Popular" badges** | Tag recently added or frequently used templates |
| **Favorites** | Heart icon to save templates to a favorites list |
| **Recently used** | "Continue where you left off" section at top of gallery |
| **Comparison mode** | Select 2–3 templates to view side-by-side |
| **Template preview with your data** | After filling data once, gallery shows previews with your actual data |
| **Filter by orientation** | Landscape / Portrait / Both filter pill |
| **Sort options** | Sort by: Newest, Most Popular, Alphabetical, Category |

---

---

# Technical Architecture Notes

## Recommended Libraries

| Capability | Library | Notes |
|---|---|---|
| Visual editor canvas | **Fabric.js** v6 or **Konva.js** | Fabric for feature richness; Konva for React integration |
| QR code visual styling | **qr-code-styling** | Supports dots, logo in center, color |
| Barcode generation | **JsBarcode** | All formats, lightweight |
| Photo background removal | **@imgly/background-removal** | Runs in browser via WASM, no API key required |
| Face detection for crop | **face-api.js** | TensorFlow.js based, runs client-side |
| CSV parsing | **PapaParse** | Robust, handles edge cases |
| Excel parsing | **SheetJS (xlsx)** | Reads .xlsx/.xls |
| ZIP generation | **JSZip** | For bulk PNG download |
| PDF generation | **jsPDF** (already in use) | Extend for multi-page, bleed |
| Guilloche patterns | Custom SVG math | Spirograph equations — no library needed |
| Microtext | Custom SVG `textPath` | Text along a path |
| Apple Wallet passes | **passkit-generator** (Node.js) | Server-side; requires Apple cert |
| Google Wallet passes | **Google Pay API** (REST) | Server-side |
| Undo/redo | **Immer** + custom stack | Immutable state snapshots |
| Auto-save | `localStorage` + Supabase | Local first, sync to DB |

---

## Database Schema Additions

```sql
-- Card lifecycle
CREATE TABLE issued_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_template   TEXT NOT NULL,             -- template id (e.g. "corporate-navy")
  card_data       JSONB NOT NULL,
  status          TEXT NOT NULL DEFAULT 'issued',  -- draft|issued|expired|revoked|superseded
  issued_to       TEXT,                      -- recipient email
  issued_by       UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  issue_date      DATE NOT NULL DEFAULT current_date,
  expiry_date     DATE,
  serial_number   TEXT UNIQUE,
  revocation_reason TEXT,
  revoked_at      TIMESTAMPTZ,
  revoked_by      UUID REFERENCES auth.users(id),
  preview_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit log
CREATE TABLE card_audit_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id      UUID REFERENCES issued_cards(id) ON DELETE CASCADE,
  action       TEXT NOT NULL,   -- issued|exported|renewed|revoked|lost_reported|viewed
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata     JSONB
);

-- Custom templates
CREATE TABLE custom_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  category        TEXT,
  orientation     TEXT NOT NULL DEFAULT 'landscape',
  canvas_document JSONB NOT NULL,            -- visual editor serialized state
  thumbnail_url   TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_by      UUID REFERENCES auth.users(id),
  is_public       BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Draft saves
CREATE TABLE card_drafts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id     TEXT NOT NULL,
  name            TEXT,
  field_data      JSONB NOT NULL,
  options         JSONB NOT NULL,
  user_id         UUID REFERENCES auth.users(id),
  last_saved_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Organization brand kit
ALTER TABLE organizations
  ADD COLUMN brand_primary_color   TEXT,
  ADD COLUMN brand_accent_color    TEXT,
  ADD COLUMN brand_font_heading    TEXT,
  ADD COLUMN brand_font_body       TEXT,
  ADD COLUMN brand_logo_url        TEXT,
  ADD COLUMN brand_logo_dark_url   TEXT,
  ADD COLUMN locked_fields         JSONB DEFAULT '[]';
```

---

## Implementation Roadmap

```
Sprint 1 (Weeks 1–2)    Visual editor foundation (Fabric.js / Konva.js canvas)
Sprint 2 (Weeks 3–4)    Per-field typography + color customization
Sprint 3 (Weeks 5–6)    Undo/redo + auto-save + session recovery
Sprint 4 (Weeks 7–8)    Bulk CSV generation + ZIP/multi-page PDF export
Sprint 5 (Weeks 9–10)   Photo tools (crop/pan, background removal, adjustments)
Sprint 6 (Weeks 11–12)  Enhanced QR/barcode + print-ready export (300 DPI, bleed, sheets)
Sprint 7 (Weeks 13–14)  Card lifecycle (issuance, registry, expiry alerts, revocation)
Sprint 8 (Weeks 15–16)  Digital card delivery (web URL, email, Apple/Google Wallet)
Sprint 9 (Weeks 17–18)  Custom template builder
Sprint 10 (Weeks 19–20) Brand kit + smart fields + security patterns (guilloche, microtext)
```

---

## Feature Priority Matrix

```
                    Impact
                Low         High
           ┌────────────┬────────────┐
      Low  │  UX polish │  Bulk CSV  │
Effort     │  Quick wins│  Lifecycle │
           ├────────────┼────────────┤
      High │  Security  │  Visual    │
           │  patterns  │  Editor    │
           └────────────┴────────────┘
                              ↑ Build first
```

---

*Report generated: 2026-05-09 · Identica / Identity Fabric*
