import React from "react";
import { Icon } from "../core/Icon.jsx";
/** Labelled icon actions under a hero (Save, Schedule, Share). Toggle items pass `pressed`; give them a
 *  different label and a filled glyph when on (e.g. "Saved"), so colour is never the only cue. */
export function ActionRow({items=[],style={},...rest}){
  return <div data-surface="media" {...rest} style={{display:"flex",justifyContent:"space-around",...style}}>
    {items.map(it=><button key={it.id||it.label} type="button" onClick={it.onClick} aria-pressed={it.pressed} className="pjs-i"
      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,minWidth:64,minHeight:64,padding:"6px 4px",border:0,borderRadius:"var(--radius-md)",background:"transparent",color:"var(--text-1)",fontFamily:"var(--font-body)"}}>
      <Icon name={it.icon} size={26} fill={it.pressed?"currentColor":"none"}/><span style={{fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-semibold)",color:"var(--text-2)"}}>{it.label}</span>
    </button>)}
  </div>;
}
