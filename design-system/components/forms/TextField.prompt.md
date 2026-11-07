Filled text input: 52px, 14px radius, 1.5px control edge. On focus the edge itself becomes a 2px deep-rose ring and the fill turns white: one ring, never an inner border plus an outer outline. Forwards native props (name, autoComplete, inputMode, enterKeyHint…).
```jsx
<TextField label="Search exercises" hideLabel icon="search" placeholder="Search exercises…" type="search"/>
<TextField label="Bodyweight" inputMode="decimal" error="Enter a number, like 72.5"/>
```
Placeholders are examples ending in "…", never the label. Errors keep what the member typed.
