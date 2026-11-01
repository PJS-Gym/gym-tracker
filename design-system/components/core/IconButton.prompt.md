Circular icon-only button. `label` is required and becomes the accessible name; name the object, not the glyph ("Options for Push day", not "ellipsis").
```jsx
<IconButton icon="chevron-left" label="Back" onClick={back}/>
<IconButton icon="heart" variant="soft" label="Save" pressed={saved} onClick={toggle}/>
```
Use `overlay` over photos, `plain` in top bars, `accent` only for a big hero play.
