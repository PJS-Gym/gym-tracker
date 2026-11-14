import React from "react";
import { Media } from "../core/Media.jsx";
import { IconButton } from "../core/IconButton.jsx";
import { Icon } from "../core/Icon.jsx";
/** An exercise in a plan or picker: 64px thumbnail, name, sets or duration.
 *  `onClick` makes the row a button; `selectable` + `selected` turns it into a toggle for the exercise picker;
 *  `onMenu` adds a labelled options button. */
export function ExerciseRow({name,meta,image,selected,selectable=false,onClick,onMenu,style={},...rest}){
  const body=<>
    <span style={{width:64,height:64,flex:"none",borderRadius:"var(--radius-sm)",overflow:"hidden",display:"block"}}><Media src={image}/></span>
    <span style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:2}}>
      <span style={{fontSize:"var(--fs-title-s)",fontWeight:"var(--weight-semibold)",color:"var(--text-1)"}}>{name}</span>
      {meta&&<span style={{fontSize:"var(--fs-body-s)",color:"var(--text-2)",fontVariantNumeric:"tabular-nums"}}>{meta}</span>}
    </span>
    {selectable&&<span aria-hidden="true" style={{width:28,height:28,flex:"none",borderRadius:"var(--radius-pill)",display:"flex",alignItems:"center",justifyContent:"center",background:selected?"var(--accent)":"transparent",border:selected?"2px solid var(--accent)":"2px solid var(--border-control)",color:"var(--text-on-accent)"}}>{selected&&<Icon name="check" size={16} strokeWidth={3}/>}</span>}
  </>;
  const row={display:"flex",alignItems:"center",gap:16,padding:"10px 0",flex:1,minWidth:0,border:0,background:"transparent",fontFamily:"var(--font-body)",textAlign:"left",color:"inherit",borderRadius:"var(--radius-md)"};
  return <div {...rest} style={{display:"flex",alignItems:"center",gap:4,...style}}>
    {onClick||selectable?<button type="button" onClick={onClick} aria-pressed={selectable?!!selected:undefined} className="pjs-i" style={row}>{body}</button>:<div style={row}>{body}</div>}
    {onMenu&&<IconButton icon="ellipsis" label={"Options for "+name} onClick={onMenu} style={{color:"var(--text-2)"}}/>}
  </div>;
}
