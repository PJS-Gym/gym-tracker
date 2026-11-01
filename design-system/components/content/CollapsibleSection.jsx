import React from "react";
import { Icon } from "../core/Icon.jsx";
/** Folder-style group that opens and closes (routine folders). The title is one disclosure button. */
export function CollapsibleSection({title,count,open,defaultOpen=true,onOpenChange,trailing,as:Title="h2",children,style={},...rest}){
  const [inner,setInner]=React.useState(defaultOpen);
  const isOpen=open!==undefined?open:inner;
  const toggle=()=>{const v=!isOpen;if(open===undefined)setInner(v);onOpenChange&&onOpenChange(v);};
  const rid="pjs-cs"+React.useId().replace(/[^a-zA-Z0-9_-]/g,"");
  return <section {...rest} style={{display:"flex",flexDirection:"column",gap:12,...style}}>
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <Title style={{flex:1,minWidth:0,margin:0,font:"inherit"}}>
        <button type="button" aria-expanded={isOpen} aria-controls={rid} onClick={toggle} className="pjs-i" style={{display:"flex",alignItems:"center",gap:8,width:"100%",minHeight:44,padding:"0 8px 0 0",border:0,borderRadius:"var(--radius-sm)",background:"transparent",color:"var(--text-2)",fontFamily:"var(--font-body)",fontSize:"var(--fs-title-s)",fontWeight:"var(--weight-semibold)",textAlign:"left"}}>
          <Icon name="chevron-down" size={20} style={{transform:isOpen?"none":"rotate(-90deg)",transition:"transform var(--dur-base) var(--ease-standard)"}}/>
          <span style={{flex:1,minWidth:0}}>{title}{count!=null&&<span style={{fontVariantNumeric:"tabular-nums"}}>{"\u00a0("+count+")"}</span>}</span>
        </button>
      </Title>
      {trailing}
    </div>
    <div id={rid} hidden={!isOpen} style={{display:isOpen?"flex":"none",flexDirection:"column",gap:12}}>{children}</div>
  </section>;
}
