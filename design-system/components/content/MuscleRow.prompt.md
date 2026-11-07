Body-activity row. Pass the set's largest value as `max` so all rows share one scale. There is no track behind the bar, so the top row never looks like 100%. Bars are ink-500 context; the highlighted row is pink. The value is always printed.
```jsx
{rows.map(([n,p],i)=><MuscleRow key={n} name={n} percent={p} max={rows[0][1]} highlight={i===0}/>)}
```
