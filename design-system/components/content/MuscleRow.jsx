import React from "react";
/** One row of body activity on a shared label / bar / value grid. Bar length uses one scale for the whole set
 *  (`max` = the largest value in the set), with no track, so a bar never reads as "full". */
export function MuscleRow({name,percent=0,max=100,highlight=false,divider=true,style={},...rest}){
  const w=Math.max(0,Math.min(100,percent/(max||100)*100));
  return <div {...rest} style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(64px,120px) 48px",gap:12,alignItems:"center",minHeight:48,borderBottom:divider?"1px solid var(--border-subtle)":"none",...style}}>
    <span style={{fontSize:"var(--fs-body)",fontWeight:highlight?"var(--weight-bold)":"var(--weight-regular)"}}>{name}</span>
    <span aria-hidden="true" style={{height:8}}><span style={{display:"block",width:w+"%",minWidth:percent>0?2:0,height:"100%",borderRadius:2,background:highlight?"var(--data-1)":"var(--data-context)"}}/></span>
    <span style={{fontVariantNumeric:"tabular-nums",fontSize:"var(--fs-body)",fontWeight:highlight?"var(--weight-bold)":"var(--weight-regular)",textAlign:"right"}}>{percent}%</span>
  </div>;
}
