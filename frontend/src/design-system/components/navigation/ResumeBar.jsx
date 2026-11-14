import React from "react";
import { Icon } from "../core/Icon.jsx";
/** A minimized workout that is still running. Sits above the TabBar; the whole bar reopens the logger. */
export function ResumeBar({title,detail,onResume,style={},...rest}){
  return <button type="button" onClick={onResume} className="pjs-i" {...rest} style={{display:"flex",alignItems:"center",gap:12,width:"100%",minHeight:56,padding:"8px 16px",border:0,borderRadius:"var(--radius-md)",background:"var(--surface-inverse)",color:"var(--text-inverse)",fontFamily:"var(--font-body)",textAlign:"left",boxShadow:"var(--shadow-float)",...style}}>
    <span style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:2}}>
      <span style={{fontSize:"var(--fs-body)",fontWeight:"var(--weight-bold)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{title}</span>
      {detail&&<span style={{fontSize:"var(--fs-body-s)",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{detail}</span>}
    </span>
    <span style={{display:"flex",alignItems:"center",gap:4,fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-bold)"}}>Resume<Icon name="chevron-up" size={20}/></span>
  </button>;
}
