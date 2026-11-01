import React from "react";
/** Unboxed metric: label, big tabular number, neutral detail line. Peers share one row and identical type. */
export function StatTile({label,value,unit,detail,style={},...rest}){
  return <div {...rest} style={{color:"var(--text-1)",display:"flex",flexDirection:"column",gap:6,minWidth:0,...style}}>
    <div style={{fontSize:"var(--fs-body-s)",color:"var(--text-2)"}}>{label}</div>
    <div style={{fontVariantNumeric:"tabular-nums",fontSize:"var(--fs-metric-l)",fontWeight:"var(--weight-heavy)",lineHeight:1}}>{value}{unit&&<span style={{fontSize:"var(--fs-body)",fontWeight:"var(--weight-semibold)",color:"var(--text-2)"}}>{"\u00a0"+unit}</span>}</div>
    {detail&&<div style={{fontSize:"var(--fs-label)",color:"var(--text-2)"}}>{detail}</div>}
  </div>;
}
