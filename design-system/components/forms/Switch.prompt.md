On/off toggle for settings ("Vibrate when rest ends"). Pink track when on; the thumb slides with no overshoot. Off state shows the control border.
```jsx
<Switch label="Sound when rest ends" checked={sound} onCheckedChange={setSound}/>
```
Use for settings that apply immediately; use Checkbox for items in a list.
