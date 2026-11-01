56px row for menus inside a Sheet and for settings lists. `destructive` uses the danger token for label and icon.
```jsx
<ListRow icon="arrow-up" label="Move up" onClick={up}/>
<ListRow icon="trash-2" label="Remove exercise" destructive onClick={remove}/>
```
Removals that are cheap to redo happen immediately and offer Undo in a Toast; rare, unrecoverable ones confirm in a Sheet.
