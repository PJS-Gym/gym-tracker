Row of stacked icon + label actions under a hero (Save, Schedule, Download). Sets `data-surface="media"`, so it is legible over photos. Every icon has a visible label; toggles change the label and fill the glyph, never only the colour.
```jsx
<ActionRow items={[{id:"save",icon:"heart",label:saved?"Saved":"Save",pressed:saved,onClick:toggle}]}/>
```
