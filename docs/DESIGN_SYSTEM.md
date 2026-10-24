# Design System & Token Specification
**System Name:** FOUNDATION — Day-Based Career Preparation Operating System  
**Design Paradigm:** Editorial Productivity / Quiet Technical Luxury  
**Version:** 1.0.0

---

## 1. Strict Color Foundations (No Blue / No Saturated Rainbows)

The interface is intentionally disciplined to eliminate cognitive fatigue and promote deep focus. All bright primaries, neon accents, and blue shades are strictly prohibited.

### 1.1 Light Theme Tokens (Default)
```scss
:root[data-theme="light"], :root {
  --canvas: #F7F7F3;         // Warm stone off-white
  --surface: #FFFFFF;        // Pure clean paper white
  --surface-soft: #F0F0EC;   // Soft panel tint
  --surface-hover: #EBEBE6;  // Subtle hover layer
  --ink: #21231F;            // Deep charcoal reading ink
  --ink-secondary: #40443D;  // Secondary body ink
  --muted: #676B64;          // Technical metadata and labels
  --hairline: #E1E3DC;       // Crisp 1px division lines
  --hairline-subtle: #ECEEE8;// Extra-faint dividers
  --accent: #485B49;         // Deep muted sage green
  --accent-soft: #E8EDE6;    // Muted sage pill background
  --accent-hover: #3D4E3E;   // Darkened sage interaction
  --warning: #80674D;        // Earthy warm walnut brown
  --warning-soft: #F5EFE8;   // Earthy callout container
  --danger: #78352C;         // Muted terra cotta red
  --danger-soft: #FCEEEC;    // Terra cotta soft badge
  --shadow-subtle: 0 1px 3px rgba(20, 25, 20, 0.04), 0 3px 12px rgba(20, 25, 20, 0.03);
  --shadow-float: 0 8px 24px rgba(20, 25, 20, 0.07);
}
```

### 1.2 Dark Theme Tokens
```scss
:root[data-theme="dark"] {
  --canvas: #121412;         // Organic obsidian background
  --surface: #1B1E1A;        // Quiet charcoal-tinted stone
  --surface-soft: #252922;   // Secondary elevated surface
  --surface-hover: #2D322A;  // Hover layer
  --ink: #ECEEE7;            // Off-white soft reading text
  --ink-secondary: #CBD0C5;  // Secondary reading ink
  --muted: #B0B7AB;          // Subdued metadata gray-green
  --hairline: #353B34;       // Restrained dark border
  --hairline-subtle: #272C25;// Very quiet border
  --accent: #A5B49D;         // Pale sage for dark mode legibility
  --accent-soft: #1E281D;    // Deep olive-sage container
  --accent-hover: #BAC6B3;   // Lightened sage interaction
  --warning: #BCA384;        // Sandstone amber
  --warning-soft: #2E261E;   // Dark amber container
  --danger: #D47E72;         // Desaturated clay red
  --danger-soft: #2D1A18;    // Dark clay container
  --shadow-subtle: 0 1px 4px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.2);
  --shadow-float: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

---

## 2. Typography Scale

- **Primary UI Sans:** Geist Sans, Inter, system-ui fallback.
- **Code & Mono:** Geist Mono, IBM Plex Mono, JetBrains Mono, monospace fallback.

| Token | Size | Line Height | Tracking | Weight | Usage |
|---|---|---|---|---|---|
| `font-headline` | 32px / 2rem | 1.25 | -0.025em | 600 | Page title (desktop) |
| `font-title` | 24px / 1.5rem | 1.3 | -0.02em | 600 | Phase / module headings |
| `font-subhead` | 18px / 1.125rem | 1.4 | -0.015em | 500 | Card titles, section leads |
| `font-body` | 15px / 0.9375rem | 1.55 | -0.005em | 400 | Standard readable content |
| `font-caption` | 13px / 0.8125rem | 1.45 | 0 | 400 | Secondary metadata, hints |
| `font-eyebrow` | 11px / 0.6875rem | 1.2 | +0.06em | 600 | Uppercase category markers |
| `font-mono-code` | 13px / 0.8125rem | 1.5 | 0 | 450 | Code snippets, day indices |

---

## 3. Spacing Rhythm & Geometry

- **Grid Base:** 8px rhythm with 4px micro-increments: `4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px`.
- **Border Radius:**
  - Containers & Cards: `14px`–`16px`
  - Modal Sheets & Dialogs: `16px`–`20px`
  - Inputs & Controls: `10px`
  - Button Shapes: `10px`–`12px`
  - Badges & Pills: `6px` or full circular `999px`
- **Border Width:** Exact `1px solid var(--hairline)`.

---

## 4. Signature Component Language

### 4.1 Signature Primary Button
Features an intentional **inset icon capsule** that creates a restrained, tactile hallmark:
```scss
.buttonPrimary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: var(--ink);
  color: var(--canvas);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 10px 8px 16px;
  border-radius: 11px;
  border: 1px solid transparent;
  transition: transform 140ms ease, background-color 140ms ease;
  min-height: 44px; // WCAG Touch Target Compliance
  cursor: pointer;

  .iconCapsule {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 7px;
    background-color: rgba(255, 255, 255, 0.14);
    color: currentColor;
  }

  &:hover {
    transform: translateY(-1px);
    background-color: var(--accent);
  }
}
```

### 4.2 Architectural Vertical Rail
Phases are interconnected with an unbroken `1px` vertical spine and discrete status discs (`Locked`, `Available`, `In Progress`, `Passed`) rendered in mono typography with numeric offsets.

### 4.3 Task Checkbox
Square rounded `20x20px` checkbox with deliberate micro-animation and instant database synchronization. Completing strikes through text with muted contrast and triggers sequence recalculations.
