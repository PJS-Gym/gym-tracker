2–4 mutually exclusive options (kg/lb, Week/Month/Year). Native radios, so arrow keys and screen readers work without extra code.
```jsx
<SegmentedControl label="Time range" options={[{value:"week",label:"Week"},{value:"month",label:"Month"}]} value={range} onValueChange={setRange}/>
```
