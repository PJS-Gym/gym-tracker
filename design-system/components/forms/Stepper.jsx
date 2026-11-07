import React from "react";
import { IconButton } from "../core/IconButton.jsx";
const decimals=n=>{const s=String(n);const i=s.indexOf(".");return i<0?0:s.length-i-1;};
/** Big-number +/- control for one value (rest time, bodyweight). In the set logger use NumberCell instead. */
export function Stepper({label,value=0,step=1,min=0,max=Infinity,unit,format,decimals:dp,onValueChange,style={},...rest}){
  const d=dp!=null?dp:decimals(step);
  const set=v=>{const n=Number(Math.min(max,Math.max(min,v)).toFixed(Math.max(d,decimals(step))));if(n!==value&&onValueChange)onValueChange(n);};
  const shown=format?format(value):Number(value).toFixed(d); // fixed decimals: 135.0 → 137.5 never changes width
  const onKey=e=>{const k=e.key;if(k==="ArrowUp"||k==="ArrowRight"){e.preventDefault();set(value+step);}else if(k==="ArrowDown"||k==="ArrowLeft"){e.preventDefault();set(value-step);}else if(k==="Home"&&min>-Infinity){e.preventDefault();set(min);}else if(k==="End"&&max<Infinity){e.preventDefault();set(max);}};
  return <div role="group" aria-label={label} {...rest} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,...style}}>
    <span aria-hidden="true" style={{fontSize:"var(--fs-body-s)",color:"var(--text-2)"}}>{label}</span>
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <IconButton icon="minus" variant="tonal" size={48} label={"Decrease "+String(label).toLowerCase()} aria-disabled={value<=min||undefined} onClick={()=>set(value-step)}/>
      <span role="spinbutton" tabIndex={0} aria-label={label+(unit?" ("+unit+")":"")} aria-valuenow={value} aria-valuemin={min>-Infinity?min:undefined} aria-valuemax={max<Infinity?max:undefined} aria-valuetext={shown+(unit?" "+unit:"")} onKeyDown={onKey}
        style={{minWidth:96,textAlign:"center",fontVariantNumeric:"tabular-nums",fontSize:"var(--fs-metric-l)",fontWeight:"var(--weight-heavy)",lineHeight:1,borderRadius:"var(--radius-sm)"}}>{shown}{unit&&<span style={{fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-semibold)",color:"var(--text-2)"}}>{"\u00a0"+unit}</span>}</span>
      <IconButton icon="plus" variant="tonal" size={48} label={"Increase "+String(label).toLowerCase()} aria-disabled={value>=max||undefined} onClick={()=>set(value+step)}/>
    </div>
  </div>;
}
