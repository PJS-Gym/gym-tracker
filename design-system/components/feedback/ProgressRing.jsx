import React from "react";
/** Circular progress for the rest timer and goals. Put the readable value in `children`. */
export function ProgressRing({value=0,max=100,size=200,stroke=14,label,valueText,transition="stroke-dashoffset var(--dur-slow) var(--ease-standard)",children,style={},...rest}){
  const r=(size-stroke)/2,c=2*Math.PI*r,f=Math.max(0,Math.min(1,value/max));
  return <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.round(value)} aria-valuetext={valueText} {...rest} style={{position:"relative",width:size,height:size,...style}}>
    <svg aria-hidden="true" width={size} height={size} style={{transform:"rotate(-90deg)",display:"block"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--data-track)" strokeWidth={stroke}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--data-1)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-f)} style={{transition}}/></svg>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>{children}</div>
  </div>;
}
