import React from "react";
import { IconButton } from "../core/IconButton.jsx";
import { Button } from "../core/Button.jsx";
/** A saved routine: title, two-line exercise summary, meta, and one Start routine button. */
export function RoutineCard({title,exercises=[],meta,onStart,onMenu,startLabel="Start routine",as:Title="h3",style={},...rest}){
  return <article {...rest} style={{background:"var(--surface-card)",border:"1px solid var(--border-subtle)",borderRadius:"var(--radius-lg)",padding:20,display:"flex",flexDirection:"column",gap:16,...style}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
      <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:4}}>
        <Title style={{margin:0,fontSize:"var(--fs-title-m)",fontWeight:"var(--weight-bold)",lineHeight:"var(--lh-title-m)"}}>{title}</Title>
        <p style={{margin:0,fontSize:"var(--fs-body-s)",color:"var(--text-2)",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{exercises.join(", ")}</p>
        {meta&&<p style={{margin:0,fontSize:"var(--fs-body-s)",color:"var(--text-2)",fontVariantNumeric:"tabular-nums"}}>{meta}</p>}
      </div>
      {onMenu&&<IconButton icon="ellipsis" label={"Options for "+title} onClick={onMenu} style={{margin:"-10px -10px 0 0"}}/>}
    </div>
    <Button variant="primary" fullWidth onClick={onStart}>{startLabel}</Button>
  </article>;
}
