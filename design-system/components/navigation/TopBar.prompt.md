52px bar with a centered title and optional leading/trailing slots.
```jsx
<TopBar divider leading={<TopBar.Action icon="chevron-left" label="Back" onClick={back}/>}>Workout details</TopBar>
<TopBar tone="overMedia" leading={<TopBar.Action icon="chevron-left" label="Back"/>}/>
<TopBar trailing={<Button variant="ghost" size="sm">Finish</Button>}><span className="pjs-num">28:52</span></TopBar>
```
