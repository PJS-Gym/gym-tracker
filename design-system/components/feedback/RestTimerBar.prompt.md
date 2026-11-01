Docked rest countdown above the bottom edge. The logger stays usable behind it. Time is derived from `endsAt`, so it stays right after the screen locks. −15s / +15s / Skip rest are 48px. When rest ends the bar turns pink with ink text "Rest over · Next: …" and stays until the next tick or Done.
```jsx
{rest && <RestTimerBar endsAt={rest.endsAt} total={90} next="Bench press, set 3" onAdjust={adjust} onSkip={skip} onEnd={()=>{vibrate();announce("Rest over")}}/>}
```
Announce only the end, once, through a live region; the ticking digits are a role="timer" and stay silent.
