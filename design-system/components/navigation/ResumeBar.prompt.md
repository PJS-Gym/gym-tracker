Shows a workout that is still running after the member minimizes the logger. The whole bar reopens it. Plum inverse fill, 56px.
```jsx
{workout && <ResumeBar title="Push day" detail="3 of 5 sets · started 28 min ago" onResume={open}/>}
```
Minimizing never ends a workout; only Finish or a confirmed Discard does.
