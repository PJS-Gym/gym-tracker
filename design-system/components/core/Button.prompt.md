Pill-shaped action button. Use `primary` (pink fill, ink label) for the single main action on a screen; everything else is secondary, tonal, outline or ghost.
```jsx
<Button size="lg" fullWidth onClick={start}>Start workout</Button>
<Button variant="tonal" size="sm" icon="plus">Add set</Button>
<Button variant="ghost" size="sm">See all</Button>
```
Labels are sentence case and name exactly what happens; the same verb carries through the flow (Finish → Finish workout → "Workout finished"). Press scales to .98; hover (pointer devices) and press use a state layer from `tokens/interaction.css`. Never white text on pink.
