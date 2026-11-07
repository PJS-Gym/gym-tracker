Bar chart that follows the honest-data rules: zero baseline, one scale, 0 draws no bar, the decisive bar is pink and labelled directly, the rest are ink-500 context. A visually hidden table carries every value.
```jsx
<SectionHeader title="Volume peaked on Saturday"/>
<BarChart unit="kg" bars={[{label:"M",fullLabel:"Monday",value:2400}]} caption="Total weight lifted per day. Bars start at zero."/>
```
Put the finding in the heading above the chart and say what the bars measure in the caption.
