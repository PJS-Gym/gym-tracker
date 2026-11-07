Rounded-square check built on a real `<input type="checkbox">`, so it is focusable and announced. Unchecked shows a 2px `--border-control` edge (3.6:1); checked fills pink with an ink tick.
```jsx
<Checkbox aria-label="Set 3 done" checked={done} onCheckedChange={setDone}/>
<Checkbox label="Warm-up set" defaultChecked/>
```
The fill confirms the action; no bounce.
