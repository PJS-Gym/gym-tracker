Big-number −/+ control for one value outside the set grid: rest time, bodyweight, a default increment. The number is a spinbutton (arrow keys, Home/End); buttons are 48px and labelled.
```jsx
<Stepper label="Rest time" value={90} step={15} min={15} max={600} format={s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`} onValueChange={setRest}/>
```
For weight and reps in the logger use NumberCell: typing is faster than tapping.
