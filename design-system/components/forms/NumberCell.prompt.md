48px number cell on a white fill with the control border. Opens the numeric keypad, selects all on focus, accepts "," or "." as the decimal mark, and commits on blur or Enter. Invalid input keeps its text and shows a danger ring; it is never cleared.
```jsx
<NumberCell label="Set 1 weight, kg" value={w} placeholder={80} onValueChange={setW}/>
```
Empty cells show the plan (target or last time) in regular-weight text-3; entered values are bold ink.

Weights always show one decimal (135.0, 137.5) and use tabular figures, so adding 0.5 or 2.5 never changes the width. Focus turns the cell's own edge into a 2px deep-rose ring: one ring, no outline outside it.
