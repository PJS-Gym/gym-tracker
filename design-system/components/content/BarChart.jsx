import React from "react";
/** Honest bar chart: zero baseline, one scale, a value of 0 draws no bar, the decisive bar is pink and labelled
 *  directly, the rest are context. A visually hidden table carries every value for screen readers. */
export function BarChart({bars=[],unit="",highlight,caption,height=140,format=v=>v.toLocaleString(),style={},...rest}){
  const max=Math.max(1,...bars.map(b=>b.value));
  const hi=highlight!==undefined?highlight:bars.reduce((m,b,i)=>b.value>bars[m].value?i:m,0);
  return <figure {...rest} style={{margin:0,display:"flex",flexDirection:"column",gap:8,...style}}>
    <div aria-hidden="true" style={{display:"flex",alignItems:"flex-end",gap:6,height,paddingTop:22,borderBottom:"1px solid var(--border-strong)"}}>
      {bars.map((b,i)=>{const on=i===hi;const h=(b.value/max*100)+"%";return <div key={i} style={{position:"relative",flex:1,height:"100%",display:"flex",alignItems:"flex-end"}}>
        {b.value>0&&<div style={{width:"100%",height:h,borderRadius:"2px 2px 0 0",background:on?"var(--data-1)":"var(--data-context)",transition:"height var(--dur-base) var(--ease-standard)"}}/>}
        {on&&b.value>0&&<span style={{position:"absolute",left:"50%",bottom:"calc("+h+" + 4px)",translate:"-50% 0",fontSize:"var(--fs-label)",fontWeight:"var(--weight-semibold)",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap"}}>{format(b.value)+(unit?"\u00a0"+unit:"")}</span>}
      </div>;})}
    </div>
    <div aria-hidden="true" style={{display:"flex",gap:6}}>{bars.map((b,i)=><span key={i} style={{flex:1,textAlign:"center",fontSize:"var(--fs-caption)",fontWeight:i===hi?"var(--weight-bold)":"var(--weight-regular)",color:i===hi?"var(--text-1)":"var(--text-2)"}}>{b.label}</span>)}</div>
    {caption&&<figcaption style={{fontSize:"var(--fs-body-s)",color:"var(--text-2)"}}>{caption}</figcaption>}
    <table className="pjs-vh"><thead><tr><th scope="col">Period</th><th scope="col">{"Value"+(unit?" ("+unit+")":"")}</th></tr></thead>
      <tbody>{bars.map((b,i)=><tr key={i}><th scope="row">{b.fullLabel||b.label}</th><td>{b.value>0?format(b.value):"none"}</td></tr>)}</tbody></table>
  </figure>;
}
