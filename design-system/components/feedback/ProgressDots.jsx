import React from "react";
/** Pager dots for a carousel. The active dot becomes a 24px pill. */
export function ProgressDots({count=5,index=0,style={},...rest}){
  return <div {...rest} style={{display:"flex",gap:8,alignItems:"center",justifyContent:"center",...style}}>
    <span className="pjs-vh">{"Item "+(index+1)+" of "+count}</span>
    {Array.from({length:count}).map((_,i)=><span key={i} aria-hidden="true" style={{width:i===index?24:8,height:8,borderRadius:"var(--radius-pill)",background:i===index?"var(--accent)":"var(--border-control)",transition:"width var(--dur-base) var(--ease-standard),background-color var(--dur-base) var(--ease-standard)"}}/>)}
  </div>;
}
