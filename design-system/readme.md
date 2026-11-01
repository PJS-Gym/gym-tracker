# PJS Gym Design System

PJS Gym is a gym brand. This system defines the look and behaviour of its member-facing mobile app: browsing sessions and classes, starting a workout, logging sets live, resting between sets, and tracking progress. Light and restrained: a white canvas, a pastel pink palette for mood and soft fills, hot pink for the one action that matters, deep rose and warm plum ink for anything that must be read, and hierarchy built from typography and spacing.

## Sources
No codebase, Figma file, logo or existing PJS product was provided. The system is an original synthesis from reference screenshots of workout apps (routine lists, full-bleed workout heroes, set loggers, body-activity charts) and Material 3 Expressive concept art for shape language. The palette comes from a supplied pastel pink swatch sheet: blush, ballet pink, pink frosting, cotton candy, strawberry milk, rosewater, cherry blossom, petal pink and dusty rose. None of the referenced brands' marks, photos or names are used.

## Principles
1. **Start with the member's job.** Each screen answers one question (what do I train today, what do I lift next, did I improve). Put that answer first.
2. **Quiet palette, loud contrast.** Pastels set the mood but never carry meaning on light surfaces. Ink, deep rose and pink carry action, state and data, at 4.5:1 or higher for text and 3:1 for control edges and graphics. Never colour a number because it is good.
3. **Typography before surfaces.** Build hierarchy with size, weight and spacing. Add a card or border only for a real group or a tap target.
4. **One focal object per screen.** Supporting content is quieter. Peers share identical type, size and alignment.
5. **Honest data.** Zero baselines, one shared scale per set of bars, no bar for a zero, direct labels instead of legends, a heading that says what to notice.
6. **Still by default.** Motion only confirms a change. No bounce, parallax, scroll reveals or pulsing.
7. **No decoration.** No decorative gradients, glows, blobs, glass, textures, icon tiles or all-caps eyebrows. Scrims over photos are allowed for legibility.
8. **Built for the gym floor.** 44px targets everywhere and 48px in the logger, visible focus, colour never the only cue, reduced motion respected, nothing lost when the member minimizes, locks the phone or gets interrupted.

## Index
- `styles.css`: entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`, `interaction.css`. Every consumer must load it: focus rings, hover and press states live in CSS, not in component inline styles.
- `assets/fonts/`: Archivo variable woff2 (roman + italic, wdth 62–125, wght 100–900, Latin with Polish and other Latin Extended-A glyphs, tabular figures). OFL.txt alongside.
- `guidelines/`: foundation specimen cards. They read token values live, so they cannot drift from `tokens/`.
- `components/`: React primitives, one folder per group; each component has `.jsx`, `.d.ts` and `.prompt.md`, and each group a `.card.html` preview.
- `ui_kits/member-app/`: clickable recreation of the member app (`index.html`).
- `_ds_bundle.js`: compiled bundle on `window.PJSGymDesignSystem_ff31cf`, regenerated from the JSX.
- `thumbnail.html`, `SKILL.md`.

## Components
- **core/**: Icon, Button, IconButton, Badge, Chip, Media, Wordmark
- **forms/**: TextField, NumberCell, Stepper, Checkbox, Switch, SegmentedControl
- **navigation/**: TopBar (+ TopBar.Action), Tabs (+ List, Tab, Panel), TabBar, ResumeBar
- **content/**: WorkoutHero, MediaCard, ActionRow, SectionHeader, CollapsibleSection, ActionTile, RoutineCard, ExerciseRow, SetTable (+ Header, Row), StatTile, MuscleRow, BarChart, ListRow
- **feedback/**: RestTimerBar, Sheet, Toast + ToastRegion, ProgressBar, ProgressRing, ProgressDots, EmptyState

The dialog pattern is `Sheet` (bottom sheet); there is no centered modal. Gym-specific pieces: `SetTable` and `NumberCell` (inline set logging), `RestTimerBar` (non-modal rest), `ResumeBar` (a minimized workout), `MuscleRow` and `BarChart` (honest progress data).

### API conventions
- Every component passes extra props (`aria-*`, `id`, `data-*`, `className`) to its root or interactive element; interactive ones forward refs. React 18 and 19.
- State props are consistent: `checked / defaultChecked / onCheckedChange`, `value / defaultValue / onValueChange`, `open / onOpenChange`. Form controls work controlled or uncontrolled.
- Accessible names are required, not inferred: `IconButton label`, `TextField label` (with `hideLabel`), `SegmentedControl label`, `ProgressBar label`. Name the object ("Options for Push day"), not the glyph.
- Slots over flags: `TopBar leading/trailing`, `SectionHeader trailing`. Compound parts for linked structures: `Tabs.List/Tab/Panel`, `SetTable.Header/Row`.
- Interactive roots carry `pjs-i` (state layer) and, for buttons, icon buttons and chips, `pjs-press` (scale). Never set `transform`, `scale`, `filter` or `outline` inline on them.

## UI kits
- `ui_kits/member-app/`: Home, Train, Workout detail, Active workout (inline set logging, docked rest timer, exercise menu and picker, minimize and resume, finish or discard), Progress.

---

## CONTENT FUNDAMENTALS
- **Voice:** a coach on the floor. Short, direct, encouraging without hype. Speak to the member as "you". The gym speaks as "we" rarely, and only for the club ("Classes at PJS").
- **Casing:** sentence case everywhere: titles, buttons, labels, headings, folder names ("Start workout", "Start routine", "My routines"). No all-caps eyebrows or tracked labels. The only uppercase is the PJS GYM wordmark.
- **Headings state the point,** not the genre: "Glutes did the most work", "Volume peaked on Saturday", not "Body activity" or "Stats".
- **One verb through a flow.** The button, the confirmation and the toast share a verb: Finish → "Finish workout?" → Finish workout → "Workout finished". Discard → "Discard this workout?" → Discard workout → "Workout discarded".
- **Confirm or undo.** Rare actions that cannot be recovered (Discard workout) confirm in a Sheet that says what will be lost. Frequent, cheap ones (remove a set or an exercise) happen at once and offer Undo in a Toast for 8 s. Unticking a set is the undo for ticking it: no toast per set.
- **No em dashes.** Use a period, a colon or "·".
- **Numbers hold still.** Every number that changes in place (weights, reps, timers, steppers) uses tabular figures and a fixed format: weights always show one decimal (135.0 kg, 137.5 kg), timers keep their width (1:30, 0:59). Adding 0.5 kg never makes the layout jump.
- **Numbers do the talking.** "5×5 Barbell Back Squat", "3 × 10 · 60s rest", "82.5 kg", "28:00". Use × for sets × reps and · as a separator. Units are lowercase after a non-breaking space (82.5 kg, 28 min), and short in lists ("1m", "30s"). Members may type "82,5": accept both decimal marks.
- **Exercise names:** Name (Equipment), e.g. "Bench Press (Barbell)", "Shoulder Press (Dumbbell)".
- **Greetings and nudges** are one sentence with a reason: "Morning, Jordan. You trained legs yesterday, so today is mobility."
- **Celebrate PRs plainly:** "New PR: bench 82.5 kg", in a neutral toast or a success badge. No exclamation marks, no celebratory colour or effects.
- **Say only what the data supports.** "Up 8% on last week", not "Crushing it".
- **Errors and empty states give direction.** Say what happened and what to do, in the interface's voice, without apology: "Enter a number, like 72.5". "No exercises yet. Add an exercise to start logging sets." Placeholders are examples ending in "…", never the label.
- **No emoji.** Icons carry the meaning.

## VISUAL FOUNDATIONS
- **Colour roles.**
  - Surfaces: white app and card; raised and field fills are ink-100 (#F5EDEF), a warm tint from the ink ramp; sunken (ink-200) is a non-text surface.
  - Text: warm plum ink. `text-1` ink-900 (16.4:1 on white), `text-2` ink-700 (8.8:1), `text-3` ink-600 (5.7:1).
  - **Pink #FF4FA0** (`--accent`) is the primary action colour: the primary button, active tab pill, checked boxes, progress and the focal chart mark. It is a fill only, always with **ink labels (5.37:1)**, never white text (3.05:1) and never pink text on white.
  - Text accents (links, ghost buttons, active names) use **deep rose #9C3A57** (`--text-accent`, 6.65:1). Text on the strawberry soft fill uses rose-800 (`--text-on-accent-soft`, 6.30:1).
  - Control edges (unchecked checkbox, switch track, text field, number cell) use `--border-control` ink-500 (3.6:1 on white, 3.1:1 on fills), so every control is visible before it is touched.
  - Pastels fill selected and completed states (strawberry), tracks (ballet) and nothing else on light surfaces. None reaches 3:1 on white. Blush never fills a component on a light surface; it merges with ink-100.
  - Flare #C62F4B is for live and danger only, with white text (5.37:1).
- **Focus.** One ring, never two. Buttons, chips, checks and links get a 2px deep-rose outline with a 2px offset (`--focus`; petal in dark; white on media). Text fields and number cells have no outline: their own edge turns into the 2px focus ring (and the field fill turns white), so an input never shows an inner border plus an outer ring. Deep rose passes on white, fills and strawberry, which pink would not.
- **Themes.** White is the default and the norm. `data-theme="dark"` (plum-black surfaces, pink accent with ink labels, petal text accent, tinted status colours) is only for full-bleed media screens such as workout detail or a live class. A photo inside a light screen uses `data-surface="media"`: text becomes white and blush, focus becomes white, in either theme.
- **Media and scrims.** Text sits only where the bottom scrim is at least .60 opaque (the lower 40% of `--scrim-bottom`); white and blush pass there even over a white photo region. Petal on media is for icons and large text only. The top scrim holds .55 to 110px so a centered top-bar title stays readable.
- **Charts.** Pink `--data-1` marks the one value that matters and is always labelled directly; everything else is `--data-context` (ink-500, 3.58:1), which keeps the focal bar distinct. Tracks are ballet. Zero baseline, one scale per set of bars, no bar for a zero, values right-aligned in tabular figures, and a visually hidden table with every value. MuscleRow has no full-width track, so the top row never reads as 100%.
- **Type.** One family, Archivo, at two widths. Display is Archivo Expanded (wdth 125) at 800, sentence case, line-height ~0.9, for at most one statement per screen; 900 is reserved for the wordmark. UI and body use normal width at 400, 600, 700 and 800. Metrics (timers, weights) use tabular figures at 800. Sizes come from the tokens only: display 56/40/30, title 26/20/17, body 16/14, label 13, caption 12, metric 56/36/22. Titles that wrap use line-height 1.2.
- **Spacing.** 4px base. 20px screen gutter. 12px gap between tiles, 16–20px card padding, 44px minimum target, 48px for logger controls (`--tap-logger`).
- **Radii.** 6 (previous-value cell), 10 (thumbnails, checkboxes, set rows), 14 (fields, quick-action tiles), 20 (cards, rest bar), 28 (sheets, media tiles), 36 (featured media card), pill (buttons, chips, segmented control, toasts).
- **Imagery.** Real members and coaches in the PJS gym, one key light, neutral grade. Use a photo only when it shows the session. No stock, no AI illustration, no brand-colour tints, no decorative shape crops. Until real photos exist, `--media-placeholder` stands in.
- **Cards.** Use one only for a real tap target or group (RoutineCard, MediaCard, Sheet). Metrics, charts and lists sit on the canvas unboxed. Never nest cards and never use a coloured left border. A light card is white with a 1px `--border-subtle`; it has no shadow.
- **Elevation.** Depth comes from surface steps. Shadows only on floating things: sheets, toasts, the rest bar, the resume bar, a floating CTA. Light shadows are plum-tinted and soft; dark keeps deeper black shadows.
- **Transparency and blur.** No glass or blur. Icon buttons over photos use the solid `--surface-overlay` chip. Scrim behind sheets.
- **Borders.** 1px subtle hairlines for list dividers and the tab bar. 1.5–2px `--border-control` for control edges. 1.5px dashed for empty "add" slots.
- **Motion.** Still by default. State changes use `--ease-standard` at 200ms; sheets enter with `--ease-emphasized` at 320ms and leave in 200ms. Press scales buttons, icon buttons and chips to .98 (.96 for icon buttons); rows, cards and inputs never move. No overshoot, bounce, parallax, scroll reveals or pulsing. `prefers-reduced-motion` turns all transitions off.
- **Hover and press.** A state layer in `currentColor` (8% hover on pointer devices, 12% press) from `tokens/interaction.css`, so it works on every fill and in both themes.
- **Layout.** Fixed bottom tab bar (84px including the home indicator) with the resume bar above it while a workout is minimized. Top bars are 52px with centered titles, transparent over media. The rest bar docks above the bottom edge of the logger; Finish lives in the logger's top bar, out of reach of a stray thumb. Bottom-fixed elements add `env(safe-area-inset-bottom)`. Scroll containers are grids (rows never shrink) with bottom padding so docked bars never cover the focused field.

## THE LOGGER (rules that make it work between sets)
- **Type, don't tap.** Weight and reps are NumberCells: numeric keypad, select-all on focus, "," or "." accepted, Enter moves weight → reps → next set.
- **One tap logs the plan.** Empty cells show the target (or last time) as a regular-weight placeholder; ticking the set logs those values. Tapping the Previous value copies it in.
- **Rest never blocks logging.** Ticking a set starts the docked RestTimerBar (−15s, +15s, Skip rest). It runs from an end timestamp, so it stays right when the screen locks. At zero it turns pink with "Rest over · Next: …", vibrates once where supported and announces once.
- **Nothing is lost.** The active workout is saved on every change. The chevron minimizes; a ResumeBar brings it back. Only Finish or a confirmed Discard ends it. Keep the screen awake while logging (Wake Lock, re-requested when the page becomes visible).

## ICONOGRAPHY
- **Set:** [Lucide](https://lucide.dev) outline icons (lucide-static 0.469.0, ISC), 2px stroke, rounded caps, inlined as SVG in `Icon.jsx`. No network request, and icons stay visible in forced-colors mode. Unknown names render a circle and log an error in development; add new glyphs to the registry.
- **Use sparingly:** only when an established glyph makes an action faster to recognize (play, back, close, more, add). Every icon in an action row has a text label. No icons on metrics, no icon tiles.
- **Sizes:** 18–20 in buttons, 22–24 in nav and rows, 26 in hero action rows.
- **Colour:** inherit text colour. A filled glyph (pressed IconButton, "Saved" heart) marks a toggled state together with a label change.
- **No emoji, no unicode glyph icons.** Use `×` and `·` only as typographic separators.
- **Logo:** none provided. Use the `Wordmark` component: "PJS GYM" in Archivo Expanded Black, one colour (ink on white or pink, blush on dark). The pink-GYM lockup is for dark or media surfaces at 28px or larger only (pink on ink-1000 is 6.40:1). Do not invent a symbol.

## Fonts
Archivo is from Google Fonts (SIL Open Font License), chosen as the stand-in brand face, and is self-hosted in `assets/fonts/`, subset to Latin and Latin Extended-A so Polish names ("Łukasz", "Zażółć") render in the brand face. Replace it if PJS Gym has its own typeface.
