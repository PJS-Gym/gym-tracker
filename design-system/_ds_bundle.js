/* @ds-bundle: {"format":4,"namespace":"PJSGymDesignSystem_ff31cf","components":[{"name":"ActionRow","sourcePath":"components/content/ActionRow.jsx"},{"name":"ActionTile","sourcePath":"components/content/ActionTile.jsx"},{"name":"BarChart","sourcePath":"components/content/BarChart.jsx"},{"name":"CollapsibleSection","sourcePath":"components/content/CollapsibleSection.jsx"},{"name":"ExerciseRow","sourcePath":"components/content/ExerciseRow.jsx"},{"name":"ListRow","sourcePath":"components/content/ListRow.jsx"},{"name":"MediaCard","sourcePath":"components/content/MediaCard.jsx"},{"name":"MuscleRow","sourcePath":"components/content/MuscleRow.jsx"},{"name":"RoutineCard","sourcePath":"components/content/RoutineCard.jsx"},{"name":"SectionHeader","sourcePath":"components/content/SectionHeader.jsx"},{"name":"SetTable","sourcePath":"components/content/SetTable.jsx"},{"name":"StatTile","sourcePath":"components/content/StatTile.jsx"},{"name":"WorkoutHero","sourcePath":"components/content/WorkoutHero.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Media","sourcePath":"components/core/Media.jsx"},{"name":"Wordmark","sourcePath":"components/core/Wordmark.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"ProgressDots","sourcePath":"components/feedback/ProgressDots.jsx"},{"name":"ProgressRing","sourcePath":"components/feedback/ProgressRing.jsx"},{"name":"RestTimerBar","sourcePath":"components/feedback/RestTimerBar.jsx"},{"name":"Sheet","sourcePath":"components/feedback/Sheet.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"ToastRegion","sourcePath":"components/feedback/Toast.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"NumberCell","sourcePath":"components/forms/NumberCell.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Stepper","sourcePath":"components/forms/Stepper.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"ResumeBar","sourcePath":"components/navigation/ResumeBar.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"TopBar","sourcePath":"components/navigation/TopBar.jsx"}],"sourceHashes":{"components/content/ActionRow.jsx":"32230118136f","components/content/ActionTile.jsx":"383a6e2aaac4","components/content/BarChart.jsx":"2882463cfe79","components/content/CollapsibleSection.jsx":"2617fd7821bc","components/content/ExerciseRow.jsx":"0e17aad762de","components/content/ListRow.jsx":"2fd9f19434de","components/content/MediaCard.jsx":"49c975af4ae7","components/content/MuscleRow.jsx":"8a6a7578b14b","components/content/RoutineCard.jsx":"5b15720c2342","components/content/SectionHeader.jsx":"07fd17e6d8cb","components/content/SetTable.jsx":"ff14947de60b","components/content/StatTile.jsx":"45d649b8c08b","components/content/WorkoutHero.jsx":"30e0dcf7506d","components/core/Badge.jsx":"95fa940a4404","components/core/Button.jsx":"397769c8b339","components/core/Chip.jsx":"77ab634e1244","components/core/Icon.jsx":"dbf691e66430","components/core/IconButton.jsx":"ddff8b320563","components/core/Media.jsx":"0199aeb8fb7b","components/core/Wordmark.jsx":"d47c918107ee","components/feedback/EmptyState.jsx":"99b7c86144af","components/feedback/ProgressBar.jsx":"07093e8a83be","components/feedback/ProgressDots.jsx":"0d5b0db2b44d","components/feedback/ProgressRing.jsx":"325707fa1bd7","components/feedback/RestTimerBar.jsx":"2dc599e95e64","components/feedback/Sheet.jsx":"8e4ddc9675b3","components/feedback/Toast.jsx":"106126ca752b","components/forms/Checkbox.jsx":"1ed71a75c92b","components/forms/NumberCell.jsx":"bbfeba0f1fb7","components/forms/SegmentedControl.jsx":"f48f27f79482","components/forms/Stepper.jsx":"fe1871f84df7","components/forms/Switch.jsx":"84e6db5a2cf9","components/forms/TextField.jsx":"24345bacad50","components/navigation/ResumeBar.jsx":"2f4ec8a2f9af","components/navigation/TabBar.jsx":"e72721f2d2dd","components/navigation/Tabs.jsx":"32a92c9218b0","components/navigation/TopBar.jsx":"5fba4bc060bb","ui_kits/member-app/ActiveWorkoutScreen.jsx":"672cc0e2c36f","ui_kits/member-app/HomeScreen.jsx":"a11c47297193","ui_kits/member-app/Phone.jsx":"e682c793e626","ui_kits/member-app/ProgressScreen.jsx":"e9f2f46f8729","ui_kits/member-app/TrainScreen.jsx":"f8012ba501af","ui_kits/member-app/WorkoutDetailScreen.jsx":"9acd665d1dd2"},"inlinedExternals":[],"unexposedExports":[]} */
(() => {

const __ds_ns = (window.PJSGymDesignSystem_ff31cf = window.PJSGymDesignSystem_ff31cf || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
const ICONS = {
  "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  "arrow-up": '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  "battery-full": '<rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/><line x1="6" x2="6" y1="11" y2="13"/><line x1="10" x2="10" y1="11" y2="13"/><line x1="14" x2="14" y1="11" y2="13"/>',
  "bell": '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  "calendar-days": '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  "chart-no-axes-column": '<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
  "check": '<path d="M20 6 9 17l-5-5"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  "chevron-up": '<path d="m18 15-6-6-6 6"/>',
  "circle-alert": '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  "circle-check": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  "clipboard-list": '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  "copy": '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  "dumbbell": '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
  "ellipsis": '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  "flame": '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  "folder-plus": '<path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  "heart": '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  "history": '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  "house": '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  "info": '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  "list-plus": '<path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/>',
  "minus": '<path d="M5 12h14"/>',
  "pause": '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  "pencil": '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  "play": '<polygon points="6 3 20 12 6 21 6 3"/>',
  "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>',
  "replace": '<path d="M14 4a2 2 0 0 1 2-2"/><path d="M16 10a2 2 0 0 1-2-2"/><path d="M20 2a2 2 0 0 1 2 2"/><path d="M22 8a2 2 0 0 1-2 2"/><path d="m3 7 3 3 3-3"/><path d="M6 10V5a3 3 0 0 1 3-3h1"/><rect x="2" y="14" width="8" height="8" rx="2"/>',
  "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  "send": '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  "settings": '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  "signal": '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>',
  "skip-forward": '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>',
  "timer": '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
  "trash-2": '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  "trophy": '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  "undo-2": '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  "wifi": '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
  "wifi-off": '<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',
  "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};
const DEV = typeof process === "undefined" || process.env.NODE_ENV !== "production";
function Icon({ name = "circle", size = 24, strokeWidth = 2, style = {}, ...rest }) {
  let body = ICONS[name];
  if (!body) {
    if (DEV) console.error('[PJS Icon] Unknown icon "' + name + '". Add it to components/core/Icon.jsx.');
    body = '<circle cx="12" cy="12" r="10"/>';
  }
  return /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", focusable: "false", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", ...rest, style: { display: "inline-block", flex: "none", ...style }, dangerouslySetInnerHTML: { __html: body } });
}
Icon.names = Object.keys(ICONS);
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/content/ActionRow.jsx
try { (() => {
const { Icon } = __ds_scope;
function ActionRow({ items = [], style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("div", { "data-surface": "media", ...rest, style: { display: "flex", justifyContent: "space-around", ...style } }, items.map((it) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: it.id || it.label,
      type: "button",
      onClick: it.onClick,
      "aria-pressed": it.pressed,
      className: "pjs-i",
      style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 64, minHeight: 64, padding: "6px 4px", border: 0, borderRadius: "var(--radius-md)", background: "transparent", color: "var(--text-1)", fontFamily: "var(--font-body)" }
    },
    /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 26, fill: it.pressed ? "currentColor" : "none" }),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-semibold)", color: "var(--text-2)" } }, it.label)
  )));
}
Object.assign(__ds_scope, { ActionRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ActionRow.jsx", error: String((e && e.message) || e) }); }

// components/content/ActionTile.jsx
try { (() => {
const { Icon } = __ds_scope;
const ActionTile = React.forwardRef(function ActionTile2({ icon, label, dashed = false, style = {}, ...rest }, ref) {
  return /* @__PURE__ */ React.createElement("button", { ref, type: "button", ...rest, className: "pjs-i", style: { display: "flex", alignItems: "center", justifyContent: dashed ? "center" : "flex-start", gap: 12, minHeight: 60, padding: "0 18px", borderRadius: "var(--radius-md)", border: dashed ? "1.5px dashed var(--border-dashed)" : 0, background: dashed ? "transparent" : "var(--surface-raised)", color: dashed ? "var(--text-accent)" : "var(--text-1)", fontFamily: "var(--font-body)", fontSize: "var(--fs-title-s)", fontWeight: "var(--weight-semibold)", textAlign: "left", ...style } }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 22 }), label);
});
Object.assign(__ds_scope, { ActionTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ActionTile.jsx", error: String((e && e.message) || e) }); }

// components/content/BarChart.jsx
try { (() => {
function BarChart({ bars = [], unit = "", highlight, caption, height = 140, format = (v) => v.toLocaleString(), style = {}, ...rest }) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  const hi = highlight !== void 0 ? highlight : bars.reduce((m, b, i) => b.value > bars[m].value ? i : m, 0);
  return /* @__PURE__ */ React.createElement("figure", { ...rest, style: { margin: 0, display: "flex", flexDirection: "column", gap: 8, ...style } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { display: "flex", alignItems: "flex-end", gap: 6, height, paddingTop: 22, borderBottom: "1px solid var(--border-strong)" } }, bars.map((b, i) => {
    const on = i === hi;
    const h = b.value / max * 100 + "%";
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "relative", flex: 1, height: "100%", display: "flex", alignItems: "flex-end" } }, b.value > 0 && /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: h, borderRadius: "2px 2px 0 0", background: on ? "var(--data-1)" : "var(--data-context)", transition: "height var(--dur-base) var(--ease-standard)" } }), on && b.value > 0 && /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: "50%", bottom: "calc(" + h + " + 4px)", translate: "-50% 0", fontSize: "var(--fs-label)", fontWeight: "var(--weight-semibold)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" } }, format(b.value) + (unit ? "\xA0" + unit : "")));
  })), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { display: "flex", gap: 6 } }, bars.map((b, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { flex: 1, textAlign: "center", fontSize: "var(--fs-caption)", fontWeight: i === hi ? "var(--weight-bold)" : "var(--weight-regular)", color: i === hi ? "var(--text-1)" : "var(--text-2)" } }, b.label))), caption && /* @__PURE__ */ React.createElement("figcaption", { style: { fontSize: "var(--fs-body-s)", color: "var(--text-2)" } }, caption), /* @__PURE__ */ React.createElement("table", { className: "pjs-vh" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { scope: "col" }, "Period"), /* @__PURE__ */ React.createElement("th", { scope: "col" }, "Value" + (unit ? " (" + unit + ")" : "")))), /* @__PURE__ */ React.createElement("tbody", null, bars.map((b, i) => /* @__PURE__ */ React.createElement("tr", { key: i }, /* @__PURE__ */ React.createElement("th", { scope: "row" }, b.fullLabel || b.label), /* @__PURE__ */ React.createElement("td", null, b.value > 0 ? format(b.value) : "none"))))));
}
Object.assign(__ds_scope, { BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/content/CollapsibleSection.jsx
try { (() => {
const { Icon } = __ds_scope;
function CollapsibleSection({ title, count, open, defaultOpen = true, onOpenChange, trailing, as: Title = "h2", children, style = {}, ...rest }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const isOpen = open !== void 0 ? open : inner;
  const toggle = () => {
    const v = !isOpen;
    if (open === void 0) setInner(v);
    onOpenChange && onOpenChange(v);
  };
  const rid = "pjs-cs" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return /* @__PURE__ */ React.createElement("section", { ...rest, style: { display: "flex", flexDirection: "column", gap: 12, ...style } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Title, { style: { flex: 1, minWidth: 0, margin: 0, font: "inherit" } }, /* @__PURE__ */ React.createElement("button", { type: "button", "aria-expanded": isOpen, "aria-controls": rid, onClick: toggle, className: "pjs-i", style: { display: "flex", alignItems: "center", gap: 8, width: "100%", minHeight: 44, padding: "0 8px 0 0", border: 0, borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--text-2)", fontFamily: "var(--font-body)", fontSize: "var(--fs-title-s)", fontWeight: "var(--weight-semibold)", textAlign: "left" } }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron-down", size: 20, style: { transform: isOpen ? "none" : "rotate(-90deg)", transition: "transform var(--dur-base) var(--ease-standard)" } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0 } }, title, count != null && /* @__PURE__ */ React.createElement("span", { style: { fontVariantNumeric: "tabular-nums" } }, "\xA0(" + count + ")")))), trailing), /* @__PURE__ */ React.createElement("div", { id: rid, hidden: !isOpen, style: { display: isOpen ? "flex" : "none", flexDirection: "column", gap: 12 } }, children));
}
Object.assign(__ds_scope, { CollapsibleSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CollapsibleSection.jsx", error: String((e && e.message) || e) }); }

// components/core/Media.jsx
try { (() => {
function Media({ src, alt = "", radius = 0, style = {}, ...rest }) {
  if (src) return /* @__PURE__ */ React.createElement("img", { src, alt, ...rest, style: { width: "100%", height: "100%", objectFit: "cover", borderRadius: radius, display: "block", ...style } });
  return /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", ...rest, style: { width: "100%", height: "100%", borderRadius: radius, background: "var(--media-placeholder)", ...style } });
}
Object.assign(__ds_scope, { Media });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Media.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const { Icon } = __ds_scope;
const V = { overlay: { background: "var(--surface-overlay)", color: "#FFFFFF" }, tonal: { background: "var(--surface-raised)", color: "var(--text-1)" }, plain: { background: "transparent", color: "var(--text-1)" }, accent: { background: "var(--accent)", color: "var(--text-on-accent)" }, soft: { background: "var(--accent-soft)", color: "var(--text-on-accent-soft)" } };
const DEV = typeof process === "undefined" || process.env.NODE_ENV !== "production";
const IconButton = React.forwardRef(function IconButton2({ icon, label, variant = "plain", size = 44, pressed, className = "", style = {}, ...rest }, ref) {
  if (DEV && !label && !rest["aria-label"] && !rest["aria-labelledby"]) console.error("[PJS IconButton] `label` is required: it is the button's accessible name (icon: " + icon + ").");
  const glyph = Math.round(size * 0.5);
  return /* @__PURE__ */ React.createElement("button", { ref, type: "button", "aria-label": label, "aria-pressed": pressed, ...rest, className: "pjs-i pjs-press--icon" + (size < 44 ? " pjs-hit" : "") + (className ? " " + className : ""), style: { width: size, height: size, minWidth: size, borderRadius: "var(--radius-pill)", border: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, ...V[variant], ...style } }, /* @__PURE__ */ React.createElement(Icon, { name: icon, size: glyph, fill: pressed ? "currentColor" : "none" }));
});
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/content/ExerciseRow.jsx
try { (() => {
const { Media, IconButton, Icon } = __ds_scope;
function ExerciseRow({ name, meta, image, selected, selectable = false, onClick, onMenu, style = {}, ...rest }) {
  const body = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { width: 64, height: 64, flex: "none", borderRadius: "var(--radius-sm)", overflow: "hidden", display: "block" } }, /* @__PURE__ */ React.createElement(Media, { src: image })), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-title-s)", fontWeight: "var(--weight-semibold)", color: "var(--text-1)" } }, name), meta && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body-s)", color: "var(--text-2)", fontVariantNumeric: "tabular-nums" } }, meta)), selectable && /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { width: 28, height: 28, flex: "none", borderRadius: "var(--radius-pill)", display: "flex", alignItems: "center", justifyContent: "center", background: selected ? "var(--accent)" : "transparent", border: selected ? "2px solid var(--accent)" : "2px solid var(--border-control)", color: "var(--text-on-accent)" } }, selected && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 16, strokeWidth: 3 })));
  const row = { display: "flex", alignItems: "center", gap: 16, padding: "10px 0", flex: 1, minWidth: 0, border: 0, background: "transparent", fontFamily: "var(--font-body)", textAlign: "left", color: "inherit", borderRadius: "var(--radius-md)" };
  return /* @__PURE__ */ React.createElement("div", { ...rest, style: { display: "flex", alignItems: "center", gap: 4, ...style } }, onClick || selectable ? /* @__PURE__ */ React.createElement("button", { type: "button", onClick, "aria-pressed": selectable ? !!selected : void 0, className: "pjs-i", style: row }, body) : /* @__PURE__ */ React.createElement("div", { style: row }, body), onMenu && /* @__PURE__ */ React.createElement(IconButton, { icon: "ellipsis", label: "Options for " + name, onClick: onMenu, style: { color: "var(--text-2)" } }));
}
Object.assign(__ds_scope, { ExerciseRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ExerciseRow.jsx", error: String((e && e.message) || e) }); }

// components/content/ListRow.jsx
try { (() => {
const { Icon } = __ds_scope;
const ListRow = React.forwardRef(function ListRow2({ icon, label, detail, destructive = false, trailing, onClick, disabled = false, style = {}, ...rest }, ref) {
  const c = destructive ? "var(--status-danger)" : "var(--text-1)";
  return /* @__PURE__ */ React.createElement("button", { ref, type: "button", onClick, disabled, ...rest, className: "pjs-i", style: { opacity: disabled ? 0.45 : 1, display: "flex", alignItems: "center", gap: 14, width: "100%", minHeight: 56, padding: "0 12px", border: 0, borderRadius: "var(--radius-md)", background: "transparent", color: c, fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", fontWeight: "var(--weight-semibold)", textAlign: "left", ...style } }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 22 }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0 } }, label), detail && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-regular)", color: "var(--text-2)", fontVariantNumeric: "tabular-nums" } }, detail), trailing);
});
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/content/MediaCard.jsx
try { (() => {
const { Media, Icon } = __ds_scope;
const MediaCard = React.forwardRef(function MediaCard2({ title, meta, image, featured = false, onClick, style = {}, ...rest }, ref) {
  return /* @__PURE__ */ React.createElement("button", { ref, type: "button", onClick, ...rest, className: "pjs-i pjs-i--over", style: { position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", width: featured ? "100%" : 200, flex: "none", minHeight: featured ? 300 : 220, padding: 0, border: 0, borderRadius: featured ? "var(--radius-2xl)" : "var(--radius-xl)", overflow: "hidden", background: "var(--ink-950)", textAlign: "left", fontFamily: "var(--font-body)", color: "#FFFFFF", ...style } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", inset: 0 } }, /* @__PURE__ */ React.createElement(Media, { src: image })), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", inset: 0, background: "var(--scrim-bottom)" } }), featured && /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", zIndex: 2, right: 18, top: 18, width: 56, height: 56, borderRadius: "var(--radius-pill)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent)", color: "var(--text-on-accent)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "play", size: 26 })), /* @__PURE__ */ React.createElement("span", { "data-surface": "media", style: { position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 6, padding: 18 } }, meta && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-semibold)", color: "var(--text-2)", fontVariantNumeric: "tabular-nums" } }, meta), /* @__PURE__ */ React.createElement("span", { style: featured ? { fontFamily: "var(--font-display)", fontStretch: "var(--stretch-display)", fontWeight: "var(--weight-heavy)", fontSize: "var(--fs-display-m)", lineHeight: "var(--lh-display-m)" } : { fontSize: "var(--fs-title-m)", lineHeight: "var(--lh-title-m)", fontWeight: "var(--weight-bold)" } }, title)));
});
Object.assign(__ds_scope, { MediaCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/MediaCard.jsx", error: String((e && e.message) || e) }); }

// components/content/MuscleRow.jsx
try { (() => {
function MuscleRow({ name, percent = 0, max = 100, highlight = false, divider = true, style = {}, ...rest }) {
  const w = Math.max(0, Math.min(100, percent / (max || 100) * 100));
  return /* @__PURE__ */ React.createElement("div", { ...rest, style: { display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(64px,120px) 48px", gap: 12, alignItems: "center", minHeight: 48, borderBottom: divider ? "1px solid var(--border-subtle)" : "none", ...style } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body)", fontWeight: highlight ? "var(--weight-bold)" : "var(--weight-regular)" } }, name), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { height: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "block", width: w + "%", minWidth: percent > 0 ? 2 : 0, height: "100%", borderRadius: 2, background: highlight ? "var(--data-1)" : "var(--data-context)" } })), /* @__PURE__ */ React.createElement("span", { style: { fontVariantNumeric: "tabular-nums", fontSize: "var(--fs-body)", fontWeight: highlight ? "var(--weight-bold)" : "var(--weight-regular)", textAlign: "right" } }, percent, "%"));
}
Object.assign(__ds_scope, { MuscleRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/MuscleRow.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const { Icon } = __ds_scope;
const V = {
  primary: { background: "var(--accent)", color: "var(--text-on-accent)" },
  secondary: { background: "var(--surface-inverse)", color: "var(--text-inverse)" },
  tonal: { background: "var(--surface-raised)", color: "var(--text-1)" },
  outline: { background: "transparent", color: "var(--text-1)", boxShadow: "inset 0 0 0 1.5px var(--border-control)" },
  ghost: { background: "transparent", color: "var(--text-accent)" },
  danger: { background: "var(--status-danger)", color: "var(--text-on-danger)" }
};
const S = { sm: { height: 40, padding: "0 16px", fontSize: 14, gap: 6, icon: 18 }, md: { height: 48, padding: "0 20px", fontSize: 16, gap: 8, icon: 20 }, lg: { height: 60, padding: "0 28px", fontSize: 17, gap: 10, icon: 22 } };
const Button = React.forwardRef(function Button2({ children, variant = "primary", size = "md", icon, iconRight, fullWidth = false, type = "button", disabled = false, className = "", style = {}, ...rest }, ref) {
  const s = S[size] || S.md;
  return /* @__PURE__ */ React.createElement("button", { ref, type, disabled, ...rest, className: "pjs-i pjs-press" + (size === "sm" ? " pjs-hit" : "") + (className ? " " + className : ""), style: { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: s.gap, height: s.height, padding: s.padding, width: fullWidth ? "100%" : void 0, border: 0, borderRadius: "var(--radius-pill)", fontFamily: "var(--font-body)", fontSize: s.fontSize, fontWeight: "var(--weight-bold)", lineHeight: 1, whiteSpace: "nowrap", opacity: disabled ? 0.45 : 1, ...V[variant], ...style } }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: s.icon }), children, iconRight && /* @__PURE__ */ React.createElement(Icon, { name: iconRight, size: s.icon }));
});
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/content/RoutineCard.jsx
try { (() => {
const { IconButton, Button } = __ds_scope;
function RoutineCard({ title, exercises = [], meta, onStart, onMenu, startLabel = "Start routine", as: Title = "h3", style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("article", { ...rest, style: { background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 20, display: "flex", flexDirection: "column", gap: 16, ...style } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ React.createElement(Title, { style: { margin: 0, fontSize: "var(--fs-title-m)", fontWeight: "var(--weight-bold)", lineHeight: "var(--lh-title-m)" } }, title), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: "var(--fs-body-s)", color: "var(--text-2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } }, exercises.join(", ")), meta && /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: "var(--fs-body-s)", color: "var(--text-2)", fontVariantNumeric: "tabular-nums" } }, meta)), onMenu && /* @__PURE__ */ React.createElement(IconButton, { icon: "ellipsis", label: "Options for " + title, onClick: onMenu, style: { margin: "-10px -10px 0 0" } })), /* @__PURE__ */ React.createElement(Button, { variant: "primary", fullWidth: true, onClick: onStart }, startLabel));
}
Object.assign(__ds_scope, { RoutineCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/RoutineCard.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeader.jsx
try { (() => {
function SectionHeader({ title, as: Title = "h2", trailing, style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("div", { ...rest, style: { display: "flex", alignItems: "center", gap: 8, minHeight: 44, ...style } }, /* @__PURE__ */ React.createElement(Title, { style: { flex: 1, minWidth: 0, margin: 0, fontSize: "var(--fs-title-m)", lineHeight: "var(--lh-title-m)", fontWeight: "var(--weight-bold)" } }, title), trailing);
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/forms/NumberCell.jsx
try { (() => {
const parse = (s) => {
  const t = String(s).trim().replace(",", ".");
  if (t === "") return null;
  if (!/^\d*\.?\d+$|^\d+\.$/.test(t)) return NaN;
  return Number(t);
};
const show = (v, dp) => v === null || v === void 0 || v === "" ? "" : typeof v === "number" && Number.isFinite(v) ? v.toFixed(dp) : String(v);
const NumberCell = React.forwardRef(function NumberCell2({ value, onValueChange, onValidityChange, label, placeholder, mode = "decimal", decimals, max = 9999, onEnter, style = {}, ...rest }, ref) {
  const dp = decimals != null ? decimals : mode === "integer" ? 0 : 1;
  const [text, setText] = React.useState(show(value, dp));
  const [bad, setBad] = React.useState(false);
  const focused = React.useRef(false);
  React.useEffect(() => {
    onValidityChange && onValidityChange(!bad);
  }, [bad]);
  React.useEffect(() => {
    if (!focused.current) {
      setText(show(value, dp));
      setBad(false);
    }
  }, [value, dp]);
  const commit = () => {
    const n = parse(text);
    if (Number.isNaN(n) || n !== null && (n > max || mode === "integer" && !Number.isInteger(n))) {
      setBad(true);
      return false;
    }
    setBad(false);
    setText(show(n, dp));
    if (n !== value && onValueChange) onValueChange(n);
    return true;
  };
  return /* @__PURE__ */ React.createElement(
    "input",
    {
      ref,
      className: "pjs-cell",
      type: "text",
      inputMode: mode === "integer" ? "numeric" : "decimal",
      enterKeyHint: "next",
      autoComplete: "off",
      "aria-label": label,
      "aria-invalid": bad || void 0,
      placeholder: placeholder != null && placeholder !== "" ? show(placeholder, dp) : void 0,
      value: text,
      onFocus: (e) => {
        focused.current = true;
        e.target.select();
      },
      onChange: (e) => setText(e.target.value),
      onBlur: () => {
        focused.current = false;
        commit();
      },
      onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (commit() && onEnter) onEnter(e);
        }
      },
      ...rest,
      style: { width: "100%", minWidth: 0, height: "var(--tap-logger)", border: 0, borderRadius: "var(--radius-sm)", background: "var(--surface-card)", color: "var(--text-1)", fontFamily: "var(--font-body)", fontSize: 17, fontWeight: "var(--weight-bold)", fontVariantNumeric: "tabular-nums", textAlign: "center", padding: 0, scrollMarginBottom: 160, ...style }
    }
  );
});
Object.assign(__ds_scope, { NumberCell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/NumberCell.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
const { Icon } = __ds_scope;
function useControllableState(value, defaultValue, onChange) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = React.useRef(value !== void 0).current;
  const cur = controlled ? value : inner;
  const cb = React.useRef(onChange);
  cb.current = onChange;
  const set = React.useCallback((next) => {
    if (Object.is(next, cur)) return;
    if (!controlled) setInner(next);
    cb.current && cb.current(next);
  }, [cur, controlled]);
  return [cur, set];
}
const Checkbox = React.forwardRef(function Checkbox2({ checked, defaultChecked = false, onCheckedChange, label, size = 32, hit = 48, disabled = false, style = {}, ...rest }, ref) {
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  return /* @__PURE__ */ React.createElement("label", { className: "pjs-check", style: { "--box": size + "px", "--hit": Math.max(hit, size) + "px", minHeight: Math.max(hit, size), opacity: disabled ? 0.45 : 1, ...style } }, /* @__PURE__ */ React.createElement("input", { ref, type: "checkbox", checked: on, disabled, onChange: (e) => setOn(e.target.checked), ...rest }), /* @__PURE__ */ React.createElement("span", { className: "pjs-check__box", style: { width: size, height: size, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", background: on ? "var(--accent)" : "var(--surface-card)", border: on ? "2px solid var(--accent)" : "2px solid var(--border-control)", color: "var(--text-on-accent)", transition: "background-color var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)" } }, on && /* @__PURE__ */ React.createElement(Icon, { name: "check", size: Math.round(size * 0.6), strokeWidth: 3 })), label && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body)" } }, label));
});
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/content/SetTable.jsx
try { (() => {
const { NumberCell, Checkbox } = __ds_scope;
const Ctx = React.createContext({ unit: "kg", label: "", weightDecimals: 1, focusNext: () => {
}, report: () => {
}, say: () => {
} });
const COLS = "32px minmax(0,1fr) 72px 60px 48px";
const fmtPrev = (p, dp) => p && p.weight != null ? Number(p.weight).toFixed(dp) + "\xA0\xD7\xA0" + p.reps : p && p.reps != null ? p.reps + "\xA0reps" : "\u2013";
const sayPrev = (p, unit, dp) => p && p.weight != null ? Number(p.weight).toFixed(dp) + " " + unit + " for " + p.reps + " reps" : p && p.reps != null ? p.reps + " reps" : "none";
function SetTable({ label, unit = "kg", weightDecimals = 1, children, style = {}, ...rest }) {
  const ref = React.useRef(null);
  const [errors, setErrors] = React.useState({});
  const [msg, setMsg] = React.useState("");
  const focusNext = React.useCallback((from) => {
    const cells = [...ref.current.querySelectorAll("input.pjs-cell")];
    const i = cells.indexOf(from);
    if (i >= 0 && cells[i + 1]) cells[i + 1].focus();
    else from.blur();
  }, []);
  const report = React.useCallback((cell, ok) => setErrors((e) => {
    if (ok === !e[cell]) return e;
    const n = { ...e };
    if (ok) delete n[cell];
    else n[cell] = true;
    return n;
  }), []);
  const say = React.useCallback((t) => {
    setMsg("");
    setTimeout(() => setMsg(t), 30);
  }, []);
  const ctx = React.useMemo(() => ({ unit, label, weightDecimals, focusNext, report, say }), [unit, label, weightDecimals, focusNext, report, say]);
  const bad = Object.keys(errors);
  return /* @__PURE__ */ React.createElement(Ctx.Provider, { value: ctx }, /* @__PURE__ */ React.createElement("div", { ...rest, style: { display: "flex", flexDirection: "column", gap: 4, ...style } }, /* @__PURE__ */ React.createElement("div", { ref, role: "table", "aria-label": label ? label + ", sets" : void 0, style: { display: "flex", flexDirection: "column", gap: 4 } }, children), bad.length > 0 && /* @__PURE__ */ React.createElement("p", { role: "alert", style: { margin: "2px 8px 0", display: "flex", gap: 6, alignItems: "center", fontSize: "var(--fs-label)", fontWeight: "var(--weight-semibold)", color: "var(--status-danger)" } }, bad[0] + ": enter a number" + (bad[0].includes("reps") ? ", like 8." : ", like 82.5.")), /* @__PURE__ */ React.createElement("span", { className: "pjs-vh", role: "status", "aria-live": "polite" }, msg)));
}
function Header({ style = {}, ...rest }) {
  const { unit } = React.useContext(Ctx);
  const h = { fontSize: "var(--fs-label)", fontWeight: "var(--weight-semibold)", color: "var(--text-2)" };
  return /* @__PURE__ */ React.createElement("div", { role: "row", ...rest, style: { display: "grid", gridTemplateColumns: COLS, gap: 6, alignItems: "center", padding: "0 8px", ...style } }, /* @__PURE__ */ React.createElement("span", { role: "columnheader", style: { ...h, textAlign: "center" } }, "Set"), /* @__PURE__ */ React.createElement("span", { role: "columnheader", style: h }, "Previous"), /* @__PURE__ */ React.createElement("span", { role: "columnheader", style: { ...h, textAlign: "center" } }, unit), /* @__PURE__ */ React.createElement("span", { role: "columnheader", style: { ...h, textAlign: "center" } }, "Reps"), /* @__PURE__ */ React.createElement("span", { role: "columnheader", style: { ...h, textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "pjs-vh" }, "Done")));
}
function Row({ index, previous, target, weight = null, reps = null, done = false, onDoneChange, onValueChange, style = {}, ...rest }) {
  const { unit, weightDecimals: wd, focusNext, report, say } = React.useContext(Ctx);
  const wRef = React.useRef(null), rRef = React.useRef(null);
  const ph = { weight: target && target.weight != null ? target.weight : previous && previous.weight, reps: target && target.reps != null ? target.reps : previous && previous.reps };
  const n = typeof index === "number" ? "Set " + index : String(index);
  const tick = (v) => {
    if (!v) {
      onDoneChange && onDoneChange(false);
      return;
    }
    const invalid = [wRef, rRef].find((r2) => r2.current && r2.current.getAttribute("aria-invalid") === "true");
    if (invalid) {
      invalid.current.focus();
      say("Fix " + invalid.current.getAttribute("aria-label") + " to log " + n.toLowerCase() + ".");
      return;
    }
    const w = weight != null ? weight : ph.weight, r = reps != null ? reps : ph.reps;
    if (r == null) {
      rRef.current && rRef.current.focus();
      say("Add reps to log " + n.toLowerCase() + ".");
      return;
    }
    if ((w !== weight || r !== reps) && onValueChange) onValueChange({ weight: w == null ? null : w, reps: r });
    onDoneChange && onDoneChange(true);
  };
  const copyPrev = () => {
    if (previous && onValueChange) onValueChange({ weight: previous.weight != null ? previous.weight : weight, reps: previous.reps != null ? previous.reps : reps });
  };
  return /* @__PURE__ */ React.createElement("div", { role: "row", ...rest, style: { display: "grid", gridTemplateColumns: COLS, gap: 6, alignItems: "center", padding: "4px 8px", borderRadius: "var(--radius-sm)", background: done ? "var(--accent-soft)" : "transparent", transition: "background-color var(--dur-base) var(--ease-standard)", ...style } }, /* @__PURE__ */ React.createElement("span", { role: "cell", style: { textAlign: "center", fontSize: "var(--fs-body)", fontWeight: "var(--weight-bold)", fontVariantNumeric: "tabular-nums", color: done ? "var(--text-on-accent-soft)" : "var(--text-1)" } }, index), /* @__PURE__ */ React.createElement("span", { role: "cell", style: { minWidth: 0 } }, previous ? /* @__PURE__ */ React.createElement("button", { type: "button", onClick: copyPrev, className: "pjs-i", "aria-label": "Use last time for " + n.toLowerCase() + ": " + sayPrev(previous, unit, wd), style: { display: "block", width: "100%", minHeight: 44, padding: "0 4px", border: 0, borderRadius: "var(--radius-xs)", background: "transparent", textAlign: "left", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-s)", color: "var(--text-2)", fontVariantNumeric: "tabular-nums", lineHeight: 1.2, overflowWrap: "anywhere" } }, fmtPrev(previous, wd)) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body-s)", color: "var(--text-2)" } }, "\u2013")), /* @__PURE__ */ React.createElement("span", { role: "cell" }, /* @__PURE__ */ React.createElement(NumberCell, { ref: wRef, label: n + " weight, " + unit, onValidityChange: (ok) => report(n + " weight", ok), value: weight, placeholder: ph.weight, mode: "decimal", decimals: wd, onValueChange: (v) => onValueChange && onValueChange({ weight: v, reps }), onEnter: (e) => focusNext(e.target) })), /* @__PURE__ */ React.createElement("span", { role: "cell" }, /* @__PURE__ */ React.createElement(NumberCell, { ref: rRef, label: n + " reps", onValidityChange: (ok) => report(n + " reps", ok), value: reps, placeholder: ph.reps, mode: "integer", onValueChange: (v) => onValueChange && onValueChange({ weight, reps: v }), onEnter: (e) => focusNext(e.target) })), /* @__PURE__ */ React.createElement("span", { role: "cell", style: { display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Checkbox, { "aria-label": n + " done", checked: done, onCheckedChange: tick, size: 32, hit: 48 })));
}
SetTable.Header = Header;
SetTable.Row = Row;
Object.assign(__ds_scope, { SetTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SetTable.jsx", error: String((e && e.message) || e) }); }

// components/content/StatTile.jsx
try { (() => {
function StatTile({ label, value, unit, detail, style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("div", { ...rest, style: { color: "var(--text-1)", display: "flex", flexDirection: "column", gap: 6, minWidth: 0, ...style } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "var(--fs-body-s)", color: "var(--text-2)" } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontVariantNumeric: "tabular-nums", fontSize: "var(--fs-metric-l)", fontWeight: "var(--weight-heavy)", lineHeight: 1 } }, value, unit && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body)", fontWeight: "var(--weight-semibold)", color: "var(--text-2)" } }, "\xA0" + unit)), detail && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "var(--fs-label)", color: "var(--text-2)" } }, detail));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/content/WorkoutHero.jsx
try { (() => {
const { Media } = __ds_scope;
function WorkoutHero({ image, alt = "", eyebrow, title, minHeight = 520, as: Title = "h1", children, style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("section", { ...rest, style: { position: "relative", minHeight, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", background: "var(--ink-950)", ...style } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0 } }, /* @__PURE__ */ React.createElement(Media, { src: image, alt })), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", inset: 0, background: "var(--scrim-bottom)" } }), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { position: "absolute", left: 0, right: 0, top: 0, height: 160, background: "var(--scrim-top)" } }), /* @__PURE__ */ React.createElement("div", { "data-surface": "media", style: { position: "relative", padding: "0 var(--gutter-screen) 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" } }, eyebrow && /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: "var(--fs-body)", fontWeight: "var(--weight-bold)", color: "var(--text-2)" } }, eyebrow), /* @__PURE__ */ React.createElement(Title, { style: { margin: 0, fontFamily: "var(--font-display)", fontStretch: "var(--stretch-display)", fontWeight: "var(--weight-heavy)", fontSize: "var(--fs-display-l)", lineHeight: "var(--lh-display-l)", letterSpacing: "var(--tracking-display)", textWrap: "balance" } }, title), children));
}
Object.assign(__ds_scope, { WorkoutHero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/WorkoutHero.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const T = {
  neutral: ["var(--surface-raised)", "var(--text-2)"],
  soft: ["var(--accent-soft)", "var(--text-on-accent-soft)"],
  accent: ["var(--accent)", "var(--text-on-accent)"],
  success: ["var(--status-success-soft)", "var(--status-success)"],
  live: ["var(--pjs-flare)", "var(--text-on-danger)"]
};
function Badge({ children, tone = "neutral", style = {}, ...rest }) {
  const [bg, fg] = T[tone] || T.neutral;
  return /* @__PURE__ */ React.createElement("span", { ...rest, style: { display: "inline-flex", alignItems: "center", gap: 4, height: 24, padding: "0 10px", borderRadius: "var(--radius-pill)", background: bg, color: fg, fontSize: "var(--fs-caption)", fontWeight: "var(--weight-semibold)", whiteSpace: "nowrap", ...style } }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
const { Icon } = __ds_scope;
const Chip = React.forwardRef(function Chip2({ children, selected = false, icon, className = "", style = {}, ...rest }, ref) {
  return /* @__PURE__ */ React.createElement("button", { ref, type: "button", "aria-pressed": selected, ...rest, className: "pjs-i pjs-press" + (className ? " " + className : ""), style: { display: "inline-flex", alignItems: "center", gap: 6, height: 44, padding: "0 16px", flex: "none", borderRadius: "var(--radius-pill)", border: 0, fontFamily: "var(--font-body)", fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-semibold)", whiteSpace: "nowrap", background: selected ? "var(--surface-inverse)" : "var(--surface-raised)", color: selected ? "var(--text-inverse)" : "var(--text-1)", ...style } }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 16 }), children);
});
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Wordmark.jsx
try { (() => {
const SIZES = { s: 22, m: 40, l: 96 };
function Wordmark({ size = "s", lockup = false, as: Tag = "span", style = {}, ...rest }) {
  const px = typeof size === "number" ? size : SIZES[size] || SIZES.s;
  return /* @__PURE__ */ React.createElement(Tag, { translate: "no", ...rest, style: { display: "inline-block", fontFamily: "var(--font-display)", fontStretch: "var(--stretch-display)", fontWeight: "var(--weight-black)", fontSize: px, lineHeight: 0.9, letterSpacing: px <= 24 ? "var(--tracking-wordmark)" : "var(--tracking-display)", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0, ...style } }, "PJS ", lockup ? /* @__PURE__ */ React.createElement("span", { style: { color: "var(--pjs-pink)" } }, "Gym") : "Gym");
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function EmptyState({ title, body, action, as: Title = "h2", style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("div", { ...rest, style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, padding: "24px 0", ...style } }, /* @__PURE__ */ React.createElement(Title, { style: { margin: 0, fontSize: "var(--fs-title-m)", lineHeight: "var(--lh-title-m)", fontWeight: "var(--weight-bold)" } }, title), body && /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: "var(--fs-body)", color: "var(--text-2)", maxWidth: "36ch" } }, body), action && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, action));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({ value = 0, max = 100, variant = "continuous", label, valueText, height = 6, style = {}, ...rest }) {
  const v = Math.max(0, Math.min(max, value));
  const aria = { role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": v, "aria-valuetext": valueText };
  if (variant === "segmented") return /* @__PURE__ */ React.createElement("div", { ...aria, ...rest, style: { display: "flex", gap: 4, ...style } }, Array.from({ length: max }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: { flex: 1, height, borderRadius: "var(--radius-pill)", background: i < v ? "var(--data-1)" : "var(--data-track)", transition: "background-color var(--dur-base) var(--ease-standard)" } })));
  return /* @__PURE__ */ React.createElement("div", { ...aria, ...rest, style: { height, borderRadius: "var(--radius-pill)", background: "var(--data-track)", overflow: "hidden", ...style } }, /* @__PURE__ */ React.createElement("div", { style: { width: v / max * 100 + "%", height: "100%", borderRadius: "var(--radius-pill)", background: "var(--data-1)", transition: "width var(--dur-slow) var(--ease-emphasized)" } }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressDots.jsx
try { (() => {
function ProgressDots({ count = 5, index = 0, style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("div", { ...rest, style: { display: "flex", gap: 8, alignItems: "center", justifyContent: "center", ...style } }, /* @__PURE__ */ React.createElement("span", { className: "pjs-vh" }, "Item " + (index + 1) + " of " + count), Array.from({ length: count }).map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, "aria-hidden": "true", style: { width: i === index ? 24 : 8, height: 8, borderRadius: "var(--radius-pill)", background: i === index ? "var(--accent)" : "var(--border-control)", transition: "width var(--dur-base) var(--ease-standard),background-color var(--dur-base) var(--ease-standard)" } })));
}
Object.assign(__ds_scope, { ProgressDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressDots.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressRing.jsx
try { (() => {
function ProgressRing({ value = 0, max = 100, size = 200, stroke = 14, label, valueText, transition = "stroke-dashoffset var(--dur-slow) var(--ease-standard)", children, style = {}, ...rest }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, value / max));
  return /* @__PURE__ */ React.createElement("div", { role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": Math.round(value), "aria-valuetext": valueText, ...rest, style: { position: "relative", width: size, height: size, ...style } }, /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", width: size, height: size, style: { transform: "rotate(-90deg)", display: "block" } }, /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--data-track)", strokeWidth: stroke }), /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--data-1)", strokeWidth: stroke, strokeLinecap: "round", strokeDasharray: c, strokeDashoffset: c * (1 - f), style: { transition } })), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }, children));
}
Object.assign(__ds_scope, { ProgressRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressRing.jsx", error: String((e && e.message) || e) }); }

// components/feedback/RestTimerBar.jsx
try { (() => {
const { Button } = __ds_scope;
const fmt = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
function useRemaining(endsAt) {
  const [now, setNow] = React.useState(null);
  React.useEffect(() => {
    if (!endsAt) return;
    let t;
    const tick = () => {
      const n = Date.now();
      setNow(n);
      if (n < endsAt) t = setTimeout(tick, 1e3 - n % 1e3 + 5);
    };
    tick();
    const vis = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(t);
        tick();
      }
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      clearTimeout(t);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [endsAt]);
  if (now === null) return [null, false];
  return [Math.max(0, Math.ceil((endsAt - now) / 1e3)), now - endsAt > 3e3];
}
function RestTimerBar({ endsAt, total, next, onAdjust, onSkip, onEnd, style = {}, ...rest }) {
  const [left, late] = useRemaining(endsAt);
  const over = left === 0;
  const ended = React.useRef(false);
  React.useEffect(() => {
    ended.current = false;
  }, [endsAt]);
  React.useEffect(() => {
    if (over && !ended.current) {
      ended.current = true;
      if (!late && onEnd) onEnd();
    }
  }, [over]);
  const frac = left === null || !total ? 1 : Math.min(1, left / total);
  return /* @__PURE__ */ React.createElement("div", { ...rest, style: { position: "relative", display: "flex", alignItems: "center", gap: 6, minHeight: 64, padding: "8px 8px 8px 14px", borderRadius: "var(--radius-lg)", overflow: "hidden", background: over ? "var(--accent)" : "var(--surface-inverse)", color: over ? "var(--text-on-accent)" : "var(--text-inverse)", boxShadow: "var(--shadow-float)", transition: "background-color var(--dur-base) var(--ease-standard),color var(--dur-base) var(--ease-standard)", ...style } }, !over && /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: 0, top: 0, height: 3, width: frac * 100 + "%", background: "var(--accent)", transition: "width 1s linear" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" } }, over ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-title-s)", fontWeight: "var(--weight-heavy)" } }, "Rest over"), next && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-semibold)" } }, "Next: " + next)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-caption)", fontWeight: "var(--weight-semibold)" } }, "Rest"), /* @__PURE__ */ React.createElement("span", { role: "timer", "aria-label": "Rest remaining", style: { display: "inline-block", minWidth: "4ch", fontSize: 28, lineHeight: 1, fontWeight: "var(--weight-heavy)", fontVariantNumeric: "tabular-nums" } }, left === null ? "\u2013:\u2013\u2013" : fmt(left)))), !over && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { variant: "tonal", size: "md", onClick: () => onAdjust && onAdjust(-15), style: { padding: "0 10px", background: "color-mix(in srgb, currentColor 14%, transparent)", color: "inherit" } }, "\u221215s"), /* @__PURE__ */ React.createElement(Button, { variant: "tonal", size: "md", onClick: () => onAdjust && onAdjust(15), style: { padding: "0 10px", background: "color-mix(in srgb, currentColor 14%, transparent)", color: "inherit" } }, "+15s")), /* @__PURE__ */ React.createElement(Button, { variant: over ? "secondary" : "primary", size: "md", onClick: onSkip, style: { padding: "0 14px" } }, over ? "Done" : "Skip rest"));
}
Object.assign(__ds_scope, { RestTimerBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/RestTimerBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Sheet.jsx
try { (() => {
function inertOutside(node) {
  const changed = [];
  let el = node;
  while (el && el !== document.body && el.parentElement) {
    for (const sib of el.parentElement.children) {
      if (sib !== el && !sib.inert && sib.tagName !== "SCRIPT") {
        sib.inert = true;
        changed.push(sib);
      }
    }
    el = el.parentElement;
  }
  return () => changed.forEach((s) => {
    s.inert = false;
  });
}
function Sheet({ open = false, onOpenChange, title, children, returnFocusRef, style = {}, ...rest }) {
  const [present, setPresent] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  const root = React.useRef(null), panel = React.useRef(null), opener = React.useRef(null);
  const tid = React.useId();
  React.useEffect(() => {
    if (open) {
      opener.current = document.activeElement;
      setPresent(true);
    }
  }, [open]);
  React.useEffect(() => {
    if (!present) return;
    if (open) {
      const r = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    const t = setTimeout(() => setPresent(false), 200);
    return () => clearTimeout(t);
  }, [open, present]);
  React.useEffect(() => {
    if (!present || !open || !root.current) return;
    const restore = inertOutside(root.current);
    panel.current && panel.current.focus({ preventScroll: true });
    const frame = root.current.parentElement;
    return () => {
      restore();
      let back = opener.current && opener.current.isConnected ? opener.current : returnFocusRef && returnFocusRef.current;
      if (!back || !back.isConnected) {
        back = frame && frame.querySelector("h1");
        if (back && !back.hasAttribute("tabindex")) back.setAttribute("tabindex", "-1");
      }
      if (back && back.focus) back.focus({ preventScroll: true });
    };
  }, [present, open]);
  React.useEffect(() => {
    if (panel.current) panel.current.inert = !open;
  }, [open, present]);
  if (!present) return null;
  const close = () => onOpenChange && onOpenChange(false);
  return /* @__PURE__ */ React.createElement("div", { ref: root, style: { position: "absolute", inset: 0, zIndex: "var(--z-sheet)", display: "flex", flexDirection: "column", justifyContent: "flex-end", overscrollBehavior: "contain" } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", onClick: close, style: { position: "absolute", inset: 0, background: "var(--scrim)", opacity: shown ? 1 : 0, transition: "opacity " + (shown ? "var(--dur-slow)" : "var(--dur-base)") + " var(--ease-standard)" } }), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: panel,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": title ? tid : void 0,
      tabIndex: -1,
      className: "pjs-sheet__panel",
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close();
        }
      },
      ...rest,
      style: { position: "relative", maxHeight: "90%", overflowY: "auto", overscrollBehavior: "contain", background: "var(--surface-card)", borderRadius: "var(--radius-xl) var(--radius-xl) 0 0", padding: "24px var(--gutter-screen) calc(20px + env(safe-area-inset-bottom))", boxShadow: "var(--shadow-sheet)", display: "flex", flexDirection: "column", gap: 16, transform: shown ? "none" : "translateY(100%)", transition: shown ? "transform var(--dur-slow) var(--ease-emphasized)" : "transform var(--dur-base) var(--ease-standard)", ...style }
    },
    title && /* @__PURE__ */ React.createElement("h2", { id: tid, style: { margin: 0, fontSize: "var(--fs-title-m)", lineHeight: "var(--lh-title-m)", fontWeight: "var(--weight-bold)", textAlign: "center" } }, title),
    children
  ));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const { Icon } = __ds_scope;
function Toast({ message, icon, action, tone = "neutral", style = {}, ...rest }) {
  const danger = tone === "danger";
  return /* @__PURE__ */ React.createElement("div", { ...rest, style: { display: "inline-flex", alignItems: "center", gap: 10, minHeight: 48, padding: action ? "4px 6px 4px 18px" : "12px 18px", borderRadius: "var(--radius-pill)", background: danger ? "var(--pjs-flare)" : "var(--surface-inverse)", color: danger ? "var(--text-on-danger)" : "var(--text-inverse)", fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-bold)", boxShadow: "var(--shadow-float)", maxWidth: "100%", ...style } }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 18 }), /* @__PURE__ */ React.createElement("span", { style: { minWidth: 0 } }, message), action && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: action.onAction, className: "pjs-i", style: { height: 40, padding: "0 14px", border: 0, borderRadius: "var(--radius-pill)", background: "transparent", color: "inherit", fontFamily: "var(--font-body)", fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-heavy)", textDecoration: "underline", textUnderlineOffset: 3 } }, action.label));
}
function ToastRegion({ children, placement = "bottom", offset = 0, style = {}, ...rest }) {
  const pos = placement === "top" ? { top: offset } : { bottom: "calc(" + (typeof offset === "number" ? offset + "px" : offset) + " + env(safe-area-inset-bottom))" };
  return /* @__PURE__ */ React.createElement("div", { role: "status", "aria-live": "polite", "aria-atomic": "true", ...rest, style: { position: "absolute", left: 16, right: 16, ...pos, zIndex: "var(--z-toast)", display: "flex", justifyContent: "center", pointerEvents: "none", ...style } }, /* @__PURE__ */ React.createElement("div", { style: { pointerEvents: "auto", maxWidth: "100%" } }, children));
}
Object.assign(__ds_scope, { Toast, ToastRegion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
const norm = (o) => typeof o === "object" ? o : { value: o, label: String(o) };
function SegmentedControl({ label, options = [], value, defaultValue, onValueChange, name, style = {}, ...rest }) {
  const auto = React.useId();
  const group = name || "pjs-seg" + auto;
  const opts = options.map(norm);
  const [inner, setInner] = React.useState(defaultValue !== void 0 ? defaultValue : opts[0] && opts[0].value);
  const cur = value !== void 0 ? value : inner;
  const pick = (v) => {
    if (value === void 0) setInner(v);
    onValueChange && onValueChange(v);
  };
  return /* @__PURE__ */ React.createElement("fieldset", { className: "pjs-seg", ...rest, style: { display: "flex", padding: 4, gap: 4, borderRadius: "var(--radius-pill)", background: "var(--surface-field)", ...style } }, /* @__PURE__ */ React.createElement("legend", { className: "pjs-vh" }, label), opts.map((o) => {
    const a = o.value === cur;
    return /* @__PURE__ */ React.createElement("label", { key: String(o.value), className: "pjs-i", style: { position: "relative", flex: 1, minWidth: 0, borderRadius: "var(--radius-pill)", color: a ? "var(--text-inverse)" : "var(--text-2)", background: a ? "var(--surface-inverse)" : "transparent" } }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: group, value: String(o.value), checked: a, onChange: () => pick(o.value) }), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: 40, borderRadius: "var(--radius-pill)", fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-bold)", whiteSpace: "nowrap" } }, o.label));
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Stepper.jsx
try { (() => {
const { IconButton } = __ds_scope;
const decimals = (n) => {
  const s = String(n);
  const i = s.indexOf(".");
  return i < 0 ? 0 : s.length - i - 1;
};
function Stepper({ label, value = 0, step = 1, min = 0, max = Infinity, unit, format, decimals: dp, onValueChange, style = {}, ...rest }) {
  const d = dp != null ? dp : decimals(step);
  const set = (v) => {
    const n = Number(Math.min(max, Math.max(min, v)).toFixed(Math.max(d, decimals(step))));
    if (n !== value && onValueChange) onValueChange(n);
  };
  const shown = format ? format(value) : Number(value).toFixed(d);
  const onKey = (e) => {
    const k = e.key;
    if (k === "ArrowUp" || k === "ArrowRight") {
      e.preventDefault();
      set(value + step);
    } else if (k === "ArrowDown" || k === "ArrowLeft") {
      e.preventDefault();
      set(value - step);
    } else if (k === "Home" && min > -Infinity) {
      e.preventDefault();
      set(min);
    } else if (k === "End" && max < Infinity) {
      e.preventDefault();
      set(max);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { role: "group", "aria-label": label, ...rest, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, ...style } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { fontSize: "var(--fs-body-s)", color: "var(--text-2)" } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(IconButton, { icon: "minus", variant: "tonal", size: 48, label: "Decrease " + String(label).toLowerCase(), "aria-disabled": value <= min || void 0, onClick: () => set(value - step) }), /* @__PURE__ */ React.createElement(
    "span",
    {
      role: "spinbutton",
      tabIndex: 0,
      "aria-label": label + (unit ? " (" + unit + ")" : ""),
      "aria-valuenow": value,
      "aria-valuemin": min > -Infinity ? min : void 0,
      "aria-valuemax": max < Infinity ? max : void 0,
      "aria-valuetext": shown + (unit ? " " + unit : ""),
      onKeyDown: onKey,
      style: { minWidth: 96, textAlign: "center", fontVariantNumeric: "tabular-nums", fontSize: "var(--fs-metric-l)", fontWeight: "var(--weight-heavy)", lineHeight: 1, borderRadius: "var(--radius-sm)" }
    },
    shown,
    unit && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-semibold)", color: "var(--text-2)" } }, "\xA0" + unit)
  ), /* @__PURE__ */ React.createElement(IconButton, { icon: "plus", variant: "tonal", size: 48, label: "Increase " + String(label).toLowerCase(), "aria-disabled": value >= max || void 0, onClick: () => set(value + step) })));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function useControllableState(value, defaultValue, onChange) {
  const [inner, setInner] = React.useState(defaultValue);
  const controlled = React.useRef(value !== void 0).current;
  const cur = controlled ? value : inner;
  const cb = React.useRef(onChange);
  cb.current = onChange;
  const set = React.useCallback((next) => {
    if (Object.is(next, cur)) return;
    if (!controlled) setInner(next);
    cb.current && cb.current(next);
  }, [cur, controlled]);
  return [cur, set];
}
const Switch = React.forwardRef(function Switch2({ checked, defaultChecked = false, onCheckedChange, label, disabled = false, style = {}, ...rest }, ref) {
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  return /* @__PURE__ */ React.createElement("label", { className: "pjs-check", style: { "--box": "52px", "--hit": "52px", minHeight: 44, gap: 12, opacity: disabled ? 0.45 : 1, ...style } }, /* @__PURE__ */ React.createElement("input", { ref, type: "checkbox", role: "switch", checked: on, disabled, onChange: (e) => setOn(e.target.checked), ...rest }), /* @__PURE__ */ React.createElement("span", { className: "pjs-check__box", style: { width: 52, height: 32, borderRadius: "var(--radius-pill)", padding: 2, display: "flex", alignItems: "center", background: on ? "var(--accent)" : "var(--surface-field)", border: on ? "2px solid var(--accent)" : "2px solid var(--border-control)", transition: "background-color var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 24, height: 24, borderRadius: "var(--radius-pill)", background: on ? "var(--surface-card)" : "var(--border-control)", transform: on ? "translateX(20px)" : "none", transition: "transform var(--dur-base) var(--ease-standard)" } })), label && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body)", color: "var(--text-1)" } }, label));
});
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
const { Icon } = __ds_scope;
const TextField = React.forwardRef(function TextField2({ label, hideLabel = false, hint, error, icon, value, defaultValue, onValueChange, onChange, type = "text", id, style = {}, ...rest }, ref) {
  const auto = React.useId();
  const fid = id || "pjs-tf" + auto;
  const desc = error ? fid + "-err" : hint ? fid + "-hint" : void 0;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6, ...style } }, /* @__PURE__ */ React.createElement("label", { htmlFor: fid, className: hideLabel ? "pjs-vh" : void 0, style: { fontSize: "var(--fs-label)", fontWeight: "var(--weight-semibold)", color: "var(--text-2)" } }, label), /* @__PURE__ */ React.createElement("span", { className: "pjs-field__box", style: { display: "flex", alignItems: "center", gap: 10, height: 52, padding: "0 16px", borderRadius: "var(--radius-md)", background: "var(--surface-field)" } }, icon && /* @__PURE__ */ React.createElement(Icon, { name: icon, size: 20, style: { color: "var(--text-2)" } }), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref,
      id: fid,
      type,
      value,
      defaultValue,
      "aria-invalid": error ? true : void 0,
      "aria-describedby": desc,
      onChange: (e) => {
        onChange && onChange(e);
        onValueChange && onValueChange(e.target.value);
      },
      ...rest,
      style: { flex: 1, minWidth: 0, height: "100%", border: 0, background: "transparent", color: "var(--text-1)", fontFamily: "var(--font-body)", fontSize: "var(--fs-body)" }
    }
  )), hint && !error && /* @__PURE__ */ React.createElement("span", { id: fid + "-hint", style: { fontSize: "var(--fs-label)", color: "var(--text-2)" } }, hint), error && /* @__PURE__ */ React.createElement("span", { id: fid + "-err", role: "alert", style: { display: "flex", gap: 6, alignItems: "center", fontSize: "var(--fs-label)", fontWeight: "var(--weight-semibold)", color: "var(--status-danger)" } }, /* @__PURE__ */ React.createElement(Icon, { name: "circle-alert", size: 16 }), error));
});
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ResumeBar.jsx
try { (() => {
const { Icon } = __ds_scope;
function ResumeBar({ title, detail, onResume, style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("button", { type: "button", onClick: onResume, className: "pjs-i", ...rest, style: { display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 56, padding: "8px 16px", border: 0, borderRadius: "var(--radius-md)", background: "var(--surface-inverse)", color: "var(--text-inverse)", fontFamily: "var(--font-body)", textAlign: "left", boxShadow: "var(--shadow-float)", ...style } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body)", fontWeight: "var(--weight-bold)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, title), detail && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--fs-body-s)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, detail)), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 4, fontSize: "var(--fs-body-s)", fontWeight: "var(--weight-bold)" } }, "Resume", /* @__PURE__ */ React.createElement(Icon, { name: "chevron-up", size: 20 })));
}
Object.assign(__ds_scope, { ResumeBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ResumeBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
const { Icon } = __ds_scope;
function TabBar({ items = [], value, onValueChange, label = "Main", style = {}, ...rest }) {
  return /* @__PURE__ */ React.createElement("nav", { "aria-label": label, ...rest, style: { display: "flex", justifyContent: "space-around", padding: "6px 8px max(8px, env(safe-area-inset-bottom))", background: "var(--surface-app)", borderTop: "1px solid var(--border-subtle)", ...style } }, items.map((it) => {
    const a = it.id === value;
    const El = it.href ? "a" : "button";
    return /* @__PURE__ */ React.createElement(
      El,
      {
        key: it.id,
        ...it.href ? { href: it.href } : { type: "button" },
        "aria-current": a ? "page" : void 0,
        onClick: (e) => {
          if (onValueChange) {
            if (it.href) e.preventDefault();
            onValueChange(it.id);
          }
        },
        className: "pjs-i",
        style: { flex: 1, minHeight: 56, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: 0, borderRadius: "var(--radius-md)", background: "transparent", color: a ? "var(--text-1)" : "var(--text-2)", fontFamily: "var(--font-body)", fontSize: "var(--fs-caption)", fontWeight: "var(--weight-bold)", textDecoration: "none" }
      },
      /* @__PURE__ */ React.createElement("span", { style: { width: 56, height: 32, borderRadius: "var(--radius-pill)", display: "flex", alignItems: "center", justifyContent: "center", background: a ? "var(--accent)" : "transparent", color: a ? "var(--text-on-accent)" : "inherit", transition: "background-color var(--dur-base) var(--ease-standard)" } }, /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 22 })),
      it.label
    );
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const Ctx = React.createContext(null);
function Tabs({ value, defaultValue, onValueChange, children, style = {}, ...rest }) {
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value !== void 0 ? value : inner;
  const setValue = React.useCallback((v) => {
    if (value === void 0) setInner(v);
    onValueChange && onValueChange(v);
  }, [value, onValueChange]);
  const base = "pjs-tabs" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ctx = React.useMemo(() => ({ value: cur, setValue, base }), [cur, setValue, base]);
  return /* @__PURE__ */ React.createElement(Ctx.Provider, { value: ctx }, /* @__PURE__ */ React.createElement("div", { ...rest, style }, children));
}
function TabsList({ children, style = {}, ...rest }) {
  const ref = React.useRef(null);
  const onKey = (e) => {
    const tabs = [...ref.current.querySelectorAll('[role="tab"]')];
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n !== null) {
      e.preventDefault();
      tabs[n].focus();
      tabs[n].click();
    }
  };
  return /* @__PURE__ */ React.createElement("div", { ref, role: "tablist", onKeyDown: onKey, ...rest, style: { display: "flex", gap: 24, overflowX: "auto", scrollbarWidth: "none", borderBottom: "1px solid var(--border-subtle)", padding: "0 var(--gutter-screen)", ...style } }, children);
}
function Tab({ value, children, style = {}, ...rest }) {
  const c = React.useContext(Ctx);
  const a = c.value === value;
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (a && ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [a]);
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      ref,
      type: "button",
      role: "tab",
      id: c.base + "-t-" + value,
      "aria-selected": a,
      "aria-controls": c.base + "-p-" + value,
      tabIndex: a ? 0 : -1,
      onClick: () => c.setValue(value),
      ...rest,
      style: { position: "relative", flex: "none", minHeight: 48, padding: "0 2px", border: 0, background: "transparent", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", fontWeight: a ? "var(--weight-bold)" : "var(--weight-regular)", color: a ? "var(--text-1)" : "var(--text-2)", ...style }
    },
    children,
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { position: "absolute", left: 0, right: 0, bottom: -1, height: 3, borderRadius: 3, background: a ? "var(--text-1)" : "transparent" } })
  );
}
function TabsPanel({ value, children, style = {}, ...rest }) {
  const c = React.useContext(Ctx);
  const a = c.value === value;
  return /* @__PURE__ */ React.createElement("div", { role: "tabpanel", id: c.base + "-p-" + value, "aria-labelledby": c.base + "-t-" + value, hidden: !a, tabIndex: a ? 0 : -1, ...rest, style }, a ? children : null);
}
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabsPanel;
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopBar.jsx
try { (() => {
const { IconButton } = __ds_scope;
const ToneCtx = React.createContext("default");
function TopBar({ children, leading, trailing, tone = "default", divider = false, as: Title = "h1", style = {}, ...rest }) {
  const media = tone === "overMedia";
  return /* @__PURE__ */ React.createElement(ToneCtx.Provider, { value: tone }, /* @__PURE__ */ React.createElement("header", { "data-surface": media ? "media" : void 0, ...rest, style: { display: "grid", gridTemplateColumns: "minmax(44px,auto) minmax(0,1fr) minmax(44px,auto)", alignItems: "center", gap: 8, height: "var(--topbar-height)", padding: "0 12px", borderBottom: divider ? "1px solid var(--border-subtle)" : "none", color: "var(--text-1)", ...style } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-start" } }, leading), typeof children === "string" || typeof children === "number" ? /* @__PURE__ */ React.createElement(Title, { style: { margin: 0, textAlign: "center", fontSize: "var(--fs-title-s)", fontWeight: "var(--weight-bold)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, children) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", minWidth: 0 } }, children), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } }, trailing)));
}
function TopBarAction(props) {
  const tone = React.useContext(ToneCtx);
  return /* @__PURE__ */ React.createElement(IconButton, { variant: tone === "overMedia" ? "overlay" : "plain", ...props });
}
TopBar.Action = TopBarAction;
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopBar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ActionRow = __ds_scope.ActionRow;

__ds_ns.ActionTile = __ds_scope.ActionTile;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.CollapsibleSection = __ds_scope.CollapsibleSection;

__ds_ns.ExerciseRow = __ds_scope.ExerciseRow;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.MediaCard = __ds_scope.MediaCard;

__ds_ns.MuscleRow = __ds_scope.MuscleRow;

__ds_ns.RoutineCard = __ds_scope.RoutineCard;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.SetTable = __ds_scope.SetTable;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.WorkoutHero = __ds_scope.WorkoutHero;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Media = __ds_scope.Media;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.ProgressDots = __ds_scope.ProgressDots;

__ds_ns.ProgressRing = __ds_scope.ProgressRing;

__ds_ns.RestTimerBar = __ds_scope.RestTimerBar;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToastRegion = __ds_scope.ToastRegion;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.NumberCell = __ds_scope.NumberCell;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.ResumeBar = __ds_scope.ResumeBar;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.TopBar = __ds_scope.TopBar;

})();
