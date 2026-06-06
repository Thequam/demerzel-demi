# Demerzel (Demi) - Design System

> The visual language for Demi: a calm, technical, "quiet-strategist" aesthetic built on a family of blues, grounded by gunmetal gray, and warmed by a single gold accent. Works in light and dark, optimized for long reading and dense tool UIs.

- Version: 0.1 (Draft)
- Pairs with: `PRD.md`
- Implementation target: Tailwind CSS tokens + CSS variables (Electron + React)

---

## 1. Brand

- **Name:** Demerzel (full) / **Demi** (short, UI + casual).
- **Personality:** composed, capable, understated. A strategist that does heavy work quietly and presents clean results.
- **Voice:** precise, warm, no hype. Short verbs, plain language.
- **Logo direction:** a monogram "D" or an abstract mark suggesting a node/orbit (a small gold point orbiting a blue core - the "quiet companion"). Mark uses Royal Blue with a single Gold accent dot. Wordmark in the display typeface, tight tracking.

---

## 2. Color System

Demi's palette: **primary = Demerzel Teal (the logo/brand lead) + a family of blues** (Royal Blue, Azure, Turquoise, Cyan), **secondary = gunmetal + light grays**, **accent = gold** (with tan/beige/olive as supporting warmth), plus black/white/neutral grays. Every hue ships a 50-900 ramp so components can compose consistently across light and dark.

### 2.1 Primary - Demerzel Teal (lead brand / logo color)
The signature color of the Demerzel logo and Demi's primary brand accent.
```
teal-50    #E6F7F7
teal-100   #C2ECEC
teal-200   #8FDCDC
teal-300   #54C7C7
teal-400   #1FACAC
teal-500   #008B8B   <- base (brand / logo)
teal-600   #007373
teal-700   #075C5C
teal-800   #094A4A
teal-900   #0A3838
```

### 2.2 Primary - Royal Blue (lead brand color)
```
royal-50   #EEF2FF
royal-100  #DCE3FF
royal-200  #B9C7FF
royal-300  #8FA3FF
royal-400  #6478F5
royal-500  #4154D6   <- base
royal-600  #3140B0
royal-700  #26328C
royal-800  #1D2769
royal-900  #141B4A
```

### 2.3 Primary - Azure / Cobalt (the "other blue")
```
azure-50   #E8F2FF
azure-100  #CFE4FF
azure-200  #9FC8FF
azure-300  #6BA8FF
azure-400  #3D8AF0
azure-500  #1E6FE0   <- base
azure-600  #135BBF
azure-700  #0E4799
azure-800  #0A3673
azure-900  #07254D
```

### 2.4 Primary - Turquoise
```
turq-50    #E6FBF7
turq-100   #C3F5EC
turq-200   #8EEBDB
turq-300   #54DCC6
turq-400   #25C6AE
turq-500   #0FB39A   <- base
turq-600   #0B907D
turq-700   #0A7062
turq-800   #08534A
turq-900   #063A34
```

### 2.5 Primary - Cyan
```
cyan-50    #E4FBFF
cyan-100   #BAF3FF
cyan-200   #82E9FF
cyan-300   #43D8F7
cyan-400   #1AC2E6
cyan-500   #06A6CC   <- base
cyan-600   #0585A6
cyan-700   #066780
cyan-800   #064E60
cyan-900   #053744
```

> Brand/blue usage order: **Teal** (`#008B8B`) = the lead brand and logo color, used for primary brand identity moments and the new teal gradient. **Royal** = brand / primary actions. **Azure** = informational, links, secondary actions. **Turquoise** = success / "local model" accent. **Cyan** = highlights, data viz, "live"/streaming states. Used together the blues form Demi's signature gradient: `royal-500 -> azure-500 -> cyan-400`; the teal-led variant is `teal-500 -> turq-500 -> cyan-300` (see 3.3).

### 2.6 Secondary - Gunmetal Gray
```
gun-50     #F1F3F5
gun-100    #DDE1E6
gun-200    #BBC2CB
gun-300    #939DAA
gun-400    #6B7685
gun-500    #4A5563   <- base gunmetal
gun-600    #39424E
gun-700    #2B323B
gun-800    #1E232A
gun-900    #13171C
```

### 2.7 Secondary - Light Gray
```
lg-50      #FAFBFC
lg-100     #F2F4F6
lg-200     #E7EAEE
lg-300     #D6DBE1
lg-400     #C0C7CF
lg-500     #A7B0BA
```

### 2.8 Accent - Gold (lead accent)
```
gold-50    #FBF6E9
gold-100   #F6EBC8
gold-200   #EDD692
gold-300   #E3C158
gold-400   #D6AC2E
gold-500   #C29318   <- base gold
gold-600   #9E7611
gold-700   #7C5B0E
gold-800   #5C430C
gold-900   #3F2E09
```

### 2.9 Accent - Supporting warmth (tan / beige / olive)
```
beige-200  #F0E7D3
beige-300  #E8DDC7   <- soft surfaces, callouts
tan-400    #D2B488
tan-500    #C9A86A   <- subtle borders/badges on warm surfaces
olive-500  #7C7A3F   <- rare, for "earthy"/secondary tags
olive-600  #5F5E30
```

> Accent rule: **Gold is the only accent that drives attention** (highlights, selected states, premium/pro markers, the logo dot). Tan/beige are surface warmth; olive is a rare tertiary tag color. Never use two accents on the same element.

### 2.10 Neutrals
```
black      #0B0E11   <- app near-black
true-black #000000
white      #FFFFFF
off-white  #FAFAFA
```

### 2.11 Semantic status colors
```
success-500 #0FB39A   (turquoise family)
info-500    #1E6FE0   (azure family)
warning-500 #D6AC2E   (gold family)
error-500   #D64550
error-400   #E66670
```

---

## 3. Semantic Tokens (Light & Dark)

These map raw ramps to roles. Implement as CSS variables switched by `data-theme`. Components reference only semantic tokens, never raw ramp values.

### 3.1 Light theme
```
--bg                canvas   #ECEEF1   (soft neutral gray canvas)
--bg-subtle         canvas-  #E4E7EB   (a step darker for hover/subtle fills)
--surface           white    #FFFFFF
--surface-raised    white    #FFFFFF   (+ shadow)
--border            edge     #DCE0E6
--border-strong     lg-300   #D6DBE1
--text              gun-900  #13171C
--text-secondary    gun-500  #4A5563
--text-muted        gun-300  #939DAA
--primary           teal-500 #008B8B
--primary-hover     teal-600 #007373
--primary-fg        white    #FFFFFF
--accent            gold-500 #C29318
--accent-fg         gun-900  #13171C
--brand-teal        teal-500 #008B8B
--brand-teal-fg     white    #FFFFFF
--link              azure-600 #135BBF
--success           turq-500 #0FB39A
--info              azure-500 #1E6FE0
--warning           gold-400 #D6AC2E
--error             error-500 #D64550
--focus-ring        teal-400 #1FACAC
```
> **Light mode uses a soft gray canvas with white surfaces:** `--bg` is a soft neutral gray (`#ECEEF1`) so white `--surface` cards, panels, and the composer lift off the background; `--border` (`#DCE0E6`) keeps card edges legible against the grayer canvas. The user chat bubble is white (`bg-surface` + `border`) in light mode so it stays distinct from the gray canvas.
> **Primary actions now use Demerzel Teal** (`#008B8B`), not royal/indigo. All `bg-primary` buttons and `text-primary` icons read teal. Gold remains the only attention accent.

### 3.2 Dark theme (metallic gunmetal)
The dark theme is tuned to read like cool brushed gunmetal: the grays are shifted slightly blue/steel and stacked into layered metal "plates" (base -> plate -> raised plate) rather than flat charcoal.
```
--bg                gunmetal-base    #11151B   (darkened from #161A20)
--bg-subtle         gunmetal-deep    #090C10   (darkened from #0E1116)
--surface           gunmetal-plate   #20262E
--surface-raised    gunmetal-raised  #2A323C
--border            steel            #333C47
--border-strong     steel-strong     #44505D
--text              lg-100           #F2F4F6
--text-secondary    gun-200          #BBC2CB
--text-muted        gun-400          #6B7685
--primary           teal-400         #1FACAC   (bright teal, reads on gunmetal)
--primary-hover     teal-300         #54C7C7
--primary-fg        near-black-teal  #06201F   (dark fg on the bright teal button)
--accent            gold-300         #E3C158
--accent-fg         gun-900          #13171C
--brand-teal        teal-400         #1FACAC   (brighter for contrast on gunmetal)
--brand-teal-fg     teal-900         #0A3838
--link              azure-300        #6BA8FF
--success           turq-300 #54DCC6
--info              azure-300 #6BA8FF
--warning           gold-300 #E3C158
--error             error-400 #E66670
--focus-ring        teal-400 #1FACAC
```
> **Primary actions now use Demerzel Teal** (bright `teal-400 #1FACAC` on gunmetal), not royal/indigo. Base backgrounds were darkened slightly (`--bg` -> `#11151B`, `--bg-subtle` -> `#090C10`) while surfaces stay lighter so the layered "plate" stacking still reads. `--text #F2F4F6` remains well above 4.5:1 on the darker `--bg`. Gold remains the only attention accent.

### 3.3 Signature gradients
- **Brand gradient** (`bg-brand-gradient`): `linear-gradient(135deg, #4154D6 0%, #1E6FE0 50%, #43D8F7 100%)` (royal -> azure -> cyan). Use sparingly: onboarding headers, the model-switcher "active" glow, empty-state hero, artifact header bars.
- **Teal brand gradient** (`bg-brand-gradient-teal`): `linear-gradient(135deg, #008B8B 0%, #0FB39A 50%, #43D8F7 100%)` (teal -> turquoise -> cyan). Demi's logo-led identity gradient; use for brand moments where the Demerzel Teal should lead (brand headers, splash, account/brand marks). Same "use sparingly" rule applies.

---

## 4. Typography

- **Display / UI:** Inter (or a geometric grotesque like Geist) - clean, neutral, excellent at small sizes.
- **Mono (code, terminal, model tags):** JetBrains Mono (or Geist Mono).
- **Optional serif for long-form artifact reading:** a humanist serif (e.g. Source Serif) only inside rendered artifacts.

### Type scale (rem, 16px base)
```
display     2.25 / 2.6    700
h1          1.75 / 2.1    700
h2          1.375 / 1.7   600
h3          1.125 / 1.5   600
body-lg     1.0625 / 1.7  400
body        0.9375 / 1.6  400
small       0.8125 / 1.45 400
caption     0.75 / 1.4    500
mono        0.875 / 1.5   400  (code/terminal)
```
- Tracking: tight on display/headings (-0.01em), normal on body.
- Numerals: tabular for usage stats, token counts, and progress.

---

## 5. Spacing, Radius, Elevation, Motion

### Spacing scale (px)
```
2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
```
Base unit = 4px. Default component padding = 12-16px; section gaps = 24-32px.

### Radius
```
radius-sm   6px    (chips, badges, inputs)
radius-md   10px   (buttons, cards)
radius-lg   16px   (panels, modals, composer)
radius-xl   24px   (hero/empty-state cards)
radius-full 9999   (pills, avatars, model chip)
```

### Elevation (shadows)
- Tuned for light theme; in dark, lean on `--surface-raised` + subtle border instead of heavy shadow.
```
shadow-sm   0 1px 2px rgba(19,23,28,0.06)
shadow-md   0 4px 12px rgba(19,23,28,0.08)
shadow-lg   0 12px 32px rgba(19,23,28,0.12)
shadow-glow 0 0 0 3px rgba(31,172,172,0.35)   (teal focus / active model chip)
```

#### Smooth gunmetal finish (dark only)
- The gunmetal treatment is built from **smooth gradients only** - there is no 1px `repeating-linear-gradient` grain. Earlier drafts used a hairline brushed grain, but at 1px it read as noise/banding rather than premium metal, so it was removed in favor of a quiet, low-contrast brushed-panel look.
- `.metal-surface` (horizontal top bar): a soft **top-down sheen** - a gentle highlight near the top edge fading through neutral to a slightly darker base - layered over a faint cool **steel tint**. A tasteful bevel completes it: a 1px inset top highlight (`inset 0 1px 0 rgba(255,255,255,0.05)`) plus a soft inner bottom shadow. Active only under `[data-theme="dark"]`; a no-op in light mode.
- `.metal-rail` (tall/narrow left rail): a soft **diagonal sheen** (~105deg) so light reads as coming from the top-left and fades to a slightly darker far edge, over the same faint steel tint, with a 1px inset top highlight and an inset right-edge shadow.
- `.gunmetal-texture` (optional): just the smooth top-down sheen (no bevel shadow), dark-only. Layer it on cards or plates that want the metallic sheen without the panel bevel. Keep it subtle.
- All layers are pure CSS gradients (no external assets) with low alphas (~0.012-0.07) so text/icons stay readable; they are static and respect `prefers-reduced-motion` by nature. The surface color tokens (`--surface #20262E`, `--surface-raised #2A323C`) are unchanged - the finish only adds a sheen.
- Keep these subtle. Dark elevation still leans primarily on `--surface-raised` + `--border`; the sheen is an accent on large metal "plates" (rail, composer, panel headers, raised cards), not something to apply everywhere. Do not stack it on small chips/badges.

### Motion
- Durations: 120ms (micro), 200ms (default), 320ms (panel/overlay).
- Easing: `cubic-bezier(0.2, 0, 0, 1)` for enter, `cubic-bezier(0.4, 0, 1, 1)` for exit.
- Streaming text: token fade-in (80ms); "thinking" trace uses a soft cyan pulse.
- Respect `prefers-reduced-motion`.

---

## 6. Component Specs (mapped to the UI)

### 6.1 App shell & left rail
- Fixed left rail (~260px), `--surface` background, `--border` right edge.
- Top: mode tabs **Chat / Cowork / Code** (segmented, active tab uses `--primary` text + 2px underline or pill).
- Then: New, Projects, Artifacts, Customize. Pinned + Recents lists below with muted labels.
- Footer: account chip + plan badge (gold "Pro" pill), update banner.

### 6.2 Composer (with model switcher)
- `--surface-raised`, `radius-lg`, subtle `shadow-md`, focus -> `--focus-ring`.
- **Model chip** (bottom-right): pill showing `<model>  <effort>` (e.g. `gemma4  High`), mono model name, capability dots (vision/tools/thinking). Active chip carries a faint brand-gradient glow.
- Left "+" for attachments; mic; send. Quick-action buttons below (Write / Learn / From Folder).

### 6.3 Model switcher popover
- Search field on top; two groups: **Local** (turquoise dot) and **Cloud** (azure dot).
- Each row: name (mono), size + context, capability badges, install state. Not-installed local models show a "Pull" affordance.
- VRAM-fit warning row uses `--warning`.

### 6.4 Chat bubbles
- User: right-aligned, white `--surface` + `--border` (light) / `gun-700` (dark) surface, `radius-lg` — white in light mode so the bubble lifts off the gray canvas.
- Assistant: left-aligned, transparent on `--bg`, full-width text column (max ~720px).
- Per-message **model badge** (mono, muted) with tooltip showing provider + effort.
- **Thinking trace:** collapsible block, cyan left-border, monospace, dimmed; auto-collapses when final answer starts.

### 6.5 Artifact panel
- Right side panel, `radius-lg`, header bar uses brand gradient with title + type chip.
- Toolbar: preview/source toggle, copy, download, "open in browser."
- Card list of artifacts uses `--surface` cards with type icon (HTML/MD/code/svg).

### 6.6 Model Manager
- Grid of model cards: name (mono), provider, size, context, capability badges, est. VRAM.
- **Pull progress:** linear progress bar in cyan with byte/ETA caption; multi-layer rollup.
- States: Available (Pull button, royal), Installed (turquoise check), Loaded (cyan "live" dot), Update available (gold).

### 6.7 Project cards
- `--surface`, `radius-md`, `shadow-sm`; title + last-updated + small description.
- "Open as Folder" action (azure secondary button). Linked-folder badge with a tan accent when bound to disk.

### 6.8 Connector rows (MCP)
- Row per tool with name + description; **permission control** = 3-state segmented: Allow (turquoise) / Ask (gold) / Deny (gun). Read-only tools grouped under a collapsible header with a "Needs approval" default.

### 6.9 Code mode layout
- Three-pane: file tree (left, `--surface`), Monaco editor (center), terminal (xterm, bottom) + preview (right/toggle).
- Editor matches theme; terminal uses mono + gun-900 background even in light mode (optional).
- **Usage dashboard:** stat tiles (Sessions / Messages / Total tokens / Active days) with tabular numerals; activity heatmap uses a royal->cyan intensity ramp; streak + favorite-model chips.

### 6.10 Scheduled task cards (Cowork)
- Card with task name, schedule pill (e.g. "Every Monday ~9:00 AM" in turquoise), status, Active toggle.
- Detail view: run **History** list with status glyphs (success = turquoise dot, warn = gold triangle, fail = red), and **Instructions** column. "Keep awake" toggle and "Run now" (royal primary).

### 6.11 Buttons
- **Primary:** `--primary` bg, `--primary-fg`, `radius-md`, `shadow-sm`; hover -> `--primary-hover`.
- **Secondary:** transparent, `--border-strong`, `--text`; hover -> `--bg-subtle`.
- **Accent/Pro:** gold bg (`--accent`) with dark fg - reserved for upgrade/premium actions.
- **Ghost/icon:** transparent, muted icon, hover surface tint.
- Sizes: sm (28px) / md (36px) / lg (44px). Disabled = 40% opacity.

### 6.12 Badges & status
- Capability badges (vision/tools/thinking): small mono pills, `--bg-subtle` with colored dot.
- Status dots: success/info/warning/error per semantic tokens.
- "Live/streaming" indicator: pulsing cyan dot.

---

## 7. Accessibility

- Body text contrast >= 4.5:1; large text/UI >= 3:1 (both themes). Royal `#4154D6` on white and on gun-900 both pass for text/UI per these targets - verify final combos with a checker.
- Never encode state by color alone (pair dots/badges with icons or labels - e.g. permission states also show "Allow/Ask/Deny" text).
- Visible focus ring (`--focus-ring`) on all interactive elements; full keyboard navigation.
- Honor `prefers-reduced-motion` and `prefers-color-scheme` (system theme default).

---

## 8. Implementation Notes (Tailwind + CSS variables)

- Define ramps under `theme.extend.colors` (teal/royal/azure/turquoise/cyan/gun/lg/gold/tan/beige/olive + semantic statuses).
- Expose semantic tokens as CSS variables on `:root` and `[data-theme="dark"]`; map Tailwind semantic utilities (e.g. `bg-surface`, `text-secondary`, `border-default`) to `var(--...)` so components stay theme-agnostic.
- Ship the brand gradients as reusable utilities (`bg-brand-gradient`, `bg-brand-gradient-teal`).
- Icon set: Lucide (consistent 1.5px stroke). Mono font for all model ids/tags/terminal.
