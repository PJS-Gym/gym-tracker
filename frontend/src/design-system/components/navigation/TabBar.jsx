import React from "react";
import { Icon } from "../core/Icon.jsx";
/** Bottom app navigation, 3–5 destinations. The active icon sits in a pink pill and the item carries aria-current="page". */
export function TabBar({items=[],value,onValueChange,label="Main",style={},...rest}){
  return <nav aria-label={label} {...rest} style={{display:"flex",justifyContent:"space-around",padding:"6px 8px max(8px, env(safe-area-inset-bottom))",background:"var(--surface-app)",borderTop:"1px solid var(--border-subtle)",...style}}>
    {items.map(it=>{const a=it.id===value;const El=it.href?"a":"button";
      return <El key={it.id} {...(it.href?{href:it.href}:{type:"button"})} aria-current={a?"page":undefined} onClick={e=>{if(onValueChange){if(it.href)e.preventDefault();onValueChange(it.id);}}} className="pjs-i"
        style={{flex:1,minHeight:56,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,border:0,borderRadius:"var(--radius-md)",background:"transparent",color:a?"var(--text-1)":"var(--text-2)",fontFamily:"var(--font-body)",fontSize:"var(--fs-caption)",fontWeight:"var(--weight-bold)",textDecoration:"none"}}>
        <span style={{width:56,height:32,borderRadius:"var(--radius-pill)",display:"flex",alignItems:"center",justifyContent:"center",background:a?"var(--accent)":"transparent",color:a?"var(--text-on-accent)":"inherit",transition:"background-color var(--dur-base) var(--ease-standard)"}}><Icon name={it.icon} size={22}/></span>{it.label}
      </El>;})}
  </nav>;
}
