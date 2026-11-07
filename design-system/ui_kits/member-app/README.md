# PJS Gym — Member app UI kit
Mobile (390×844) click-through of the PJS Gym member app, built only from the design-system bundle (`window.PJSGymDesignSystem_ff31cf`). Light theme by default; the workout detail screen switches to `data-theme="dark"` because it is a full-bleed media screen.

Flow: **Home** → tap "Mobility and core" → **Workout detail** (hero, Save / Schedule / Download, Workout plan / Body activity / Equipment tabs) → Start workout → **Active workout**:
- type weight and reps inline (Enter moves weight → reps → next set), or tick a set to log the planned values;
- ticking starts the docked rest timer (−15s, +15s, Skip rest); it turns pink with "Rest over" when done;
- ⋯ on an exercise opens its menu (move, remove last set, remove exercise; removals offer Undo);
- Add exercise opens a searchable multi-select picker;
- the chevron minimizes the workout: it keeps running and a Resume bar sits above the tab bar. It is saved to localStorage on every change, so a reload keeps it;
- Finish (top right) → "Finish workout?" sheet → Finish workout, Keep training, or Discard workout (confirmed).

**Train** tab: Start empty workout, routine folders, Start routine. **Progress**: Week / Month / Year bar chart, stat tiles and body activity that all follow the range.

Files: Phone.jsx (device frame, ScrollBody, ElapsedTime), HomeScreen.jsx, TrainScreen.jsx, WorkoutDetailScreen.jsx, ActiveWorkoutScreen.jsx, ProgressScreen.jsx, index.html (app shell: routing, persistence, toasts).

Photography slots are dark placeholders (`--media-placeholder`); swap in real PJS imagery through each component's `image` prop.
