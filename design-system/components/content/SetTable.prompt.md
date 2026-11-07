Logging grid for one exercise: set, previous, weight, reps, done. Weight and reps are NumberCells; Enter moves weight → reps → next set.
```jsx
<SetTable label="Bench Press (Barbell)" unit="kg">
  <SetTable.Header/>
  {sets.map((s,i)=><SetTable.Row key={s.id} index={i+1} previous={s.previous} weight={s.weight} reps={s.reps} done={s.done}
     onValueChange={v=>update(s.id,v)} onDoneChange={d=>tick(s.id,d)}/>)}
</SetTable>
```
Ticking a set with empty cells logs the placeholders (target, else last time), so one tap logs a set as planned. If reps are unknown, or a cell holds something that is not a number, the tick is refused: focus moves to that cell, a message under the table says what to enter, and screen readers hear it. A value the member cannot see is never logged. Previous reads "80.0 × 8" (the unit is in the column header) and wraps rather than truncating on narrow phones. Done rows take the strawberry fill, a rose-800 set number and a filled check, so colour is never the only cue. Unticking is the undo for a tick: do not add a toast per set.
