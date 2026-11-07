Scrollable underline tabs for detail pages. Compound so tabs and panels are linked for assistive tech.
```jsx
<Tabs defaultValue="plan">
  <Tabs.List aria-label="Workout sections"><Tabs.Tab value="plan">Workout plan</Tabs.Tab><Tabs.Tab value="body">Body activity</Tabs.Tab></Tabs.List>
  <Tabs.Panel value="plan">…</Tabs.Panel><Tabs.Panel value="body">…</Tabs.Panel>
</Tabs>
```
