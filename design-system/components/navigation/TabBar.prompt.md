Bottom tab bar for 3–5 destinations. The active item gets `aria-current="page"` and the pink pill; inactive labels are text-2. Pads for the home indicator with `env(safe-area-inset-bottom)`.
```jsx
<TabBar items={[{id:"home",label:"Home",icon:"house"},{id:"train",label:"Train",icon:"dumbbell"}]} value={tab} onValueChange={setTab}/>
```
