Bottom sheet (28px top radius, scrim): PJS Gym's only dialog; there is no centered modal. The parent must be `position: relative` (the screen or app frame). While open, everything outside it is inert, Escape or a scrim tap closes it, and focus returns to the opener. Enters in 320ms emphasized, exits in 200ms.
```jsx
<Sheet open={open} onOpenChange={setOpen} title="Finish workout?">
  <Button size="lg" fullWidth onClick={finish}>Finish workout</Button>
  <Button variant="tonal" fullWidth onClick={()=>setOpen(false)}>Keep training</Button>
</Sheet>
```
Use a Sheet to confirm rare, unrecoverable actions (Discard workout). For everyday removals, act and offer Undo.
