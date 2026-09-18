# DESIGN SYSTEM & VISUAL SPECIFICATION
## "Antigravity" Structural Blueprint Design Framework
*Extracted from Stitch MCP Canvas Workspace & Industrial Construction Guidelines*

---

## 1. Design Philosophy
- **Digital Blueprint Aesthetic**: UI surfaces emulate an architectural drawing or engineering drafting table.
- **Structural Integrity**: Strict 1px solid structural lines replace generic drop-shadows and glassmorphism.
- **Asymmetric Grid**: Broken layout offsets (`offset-asymmetric: 48px`, `gutter: 16px`) delivering deliberate architectural pacing.
- **Sharp Precision**: Border radii are rigidly clamped between `0px` and `4px` to evoke industrial steel-and-concrete precision.

---

## 2. Color Palette (Premium Industrial Construction)

| Token Name | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `$bg-base` | `#F9F8F6` | Warm, soft stone off-white canvas. (Pure white `#FFF` is strictly prohibited for main canvas). |
| `$surface-card` | `#FFFFFF` | Blueprint card fill, framed strictly with 1px concrete borders. |
| `$surface-tint` | `#F2EFE9` | High-density table headers, active filter pills, secondary structural blocks. |
| `$charcoal` | `#1A1A1A` | Primary structural text, deep raw charcoal gray for headers and technical figures. |
| `$charcoal-muted`| `#5A5D61` | Secondary labels, measurement units, specifications, and metadata. |
| `$raw-umber` | `#8B5A2B` | Primary high-end earthy construction brown accent for action alerts, trust stars, and primary CTAs. |
| `$raw-umber-light`| `#B48A63` | Accent highlights, hover states, filter badges. |
| `$raw-umber-subtle`| `#F7F2EB` | Subtle accent fill for highlighted rows and flash offer callouts. |
| `$cement` | `#E2DFD8` | Soft concrete gray for all 1px modular grid dividers and card borders. |
| `$cement-dark` | `#CBC6BD` | Active input strokes, focused card edges, structural dividers. |
| `$verified-green`| `#2E7D32` | Time verification badge ("Verified Today at [Time]"). |
| `$verified-bg` | `#EDF7ED` | Verified background fill. |
| `$alert-stale` | `#C62828` | Prominent warning for prices older than 24 hours ("Prices last updated [X] days ago"). |
| `$alert-bg` | `#FDEDED` | Stale warning background fill. |

---

## 3. Typography Scales & Pairings

### Font Pairings
- **Display & Technical Numerics**: `'Space Grotesk'`, `'Outfit'`, sans-serif
- **System Copy & Engineering Labels**: `'Plus Jakarta Sans'`, sans-serif
- **Tabular Data / Unit Prices**: Monospace tabular numerals (`font-mono` / `tabular-nums`)

### Type Scales (Stitch Canvas Mapping)
- **`headline-xl`**: `fontSize: 48px`, `fontWeight: 800`, `lineHeight: 56px`, `letterSpacing: -0.03em`
- **`headline-lg`**: `fontSize: 32px`, `fontWeight: 700`, `lineHeight: 40px`, `letterSpacing: -0.02em`
- **`headline-md`**: `fontSize: 24px`, `fontWeight: 700`, `lineHeight: 32px`
- **`headline-sm`**: `fontSize: 18px`, `fontWeight: 600`, `lineHeight: 26px`
- **`body-lg`**: `fontSize: 16px`, `fontWeight: 400`, `lineHeight: 24px`
- **`body-md`**: `fontSize: 14px`, `fontWeight: 400`, `lineHeight: 20px`
- **`data-tabular`**: `fontSize: 13px`, `fontWeight: 600`, `letterSpacing: -0.01em`
- **`label-caps`**: `fontSize: 11px`, `fontWeight: 700`, `letterSpacing: 0.08em`, `text-transform: uppercase`

---

## 4. Layout, Spacing & Grid System
- **Base Grid Unit**: `4px`
- **Gutter**: `16px` (or `24px` on desktop)
- **Safe Margin**: `32px`
- **Border Thickness**: Strictly `1px solid #E2DFD8` (`border-cement`)
- **Border Radius**: Strictly `rounded-none` (`0px`) or `rounded-sm` (`2px` - `4px` max)
- **Shadows**: Explicitly `shadow-none`. Depth is communicated exclusively via 1px border contrast and layered offsets.

---

## 5. Component Visual Taxonomy

### Micro-Stamps (Status Badges)
- High-contrast, sharp or subtle pill status indicators anchored to card headers:
  - Fresh Sync: `border border-green-700/30 bg-green-50 text-green-800 font-mono text-xs px-2 py-0.5`
  - Stale Price: `border border-red-700/30 bg-red-50 text-red-800 font-mono text-xs px-2 py-0.5`
  - Flash Offer: `border border-[#8B5A2B]/40 bg-[#F7F2EB] text-[#8B5A2B] font-bold text-xs px-2 py-0.5`

### High-Density Material Tables
- Minimal row heights (`py-2.5`), hairline borders (`border-b border-[#E2DFD8]`), alternating subtle fills (`hover:bg-[#F2EFE9]`).
- Price numbers rendered with large tabular weight for instant visual scanning.

### Blueprint Action Buttons
- Primary: Solid Charcoal (`#1A1A1A`) or Raw Umber (`#8B5A2B`), crisp 0-2px border-radius, uppercase tracked label (`label-caps`).
- Ghost / Structural: White background, 1px `#E2DFD8` border, charcoal text, sharp hover inversion.
