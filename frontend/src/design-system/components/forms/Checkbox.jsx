import React from "react";
import { Icon } from "../core/Icon.jsx";
function useControllableState(value,defaultValue,onChange){
  const [inner,setInner]=React.useState(defaultValue);
  const controlled=React.useRef(value!==undefined).current;
  const cur=controlled?value:inner;
  const cb=React.useRef(onChange);cb.current=onChange;
  const set=React.useCallback(next=>{if(Object.is(next,cur))return;if(!controlled)setInner(next);cb.current&&cb.current(next);},[cur,controlled]);
  return [cur,set];
}
/** Native checkbox drawn as a rounded square. Fills pink when checked; unchecked shows a 2px control border. */
export const Checkbox=React.forwardRef(function Checkbox({checked,defaultChecked=false,onCheckedChange,label,size=32,hit=48,disabled=false,style={},...rest},ref){
  const [on,setOn]=useControllableState(checked,defaultChecked,onCheckedChange);
  return <label className="pjs-check" style={{"--box":size+"px","--hit":Math.max(hit,size)+"px",minHeight:Math.max(hit,size),opacity:disabled?.45:1,...style}}>
    <input ref={ref} type="checkbox" checked={on} disabled={disabled} onChange={e=>setOn(e.target.checked)} {...rest}/>
    <span className="pjs-check__box" style={{width:size,height:size,borderRadius:"var(--radius-sm)",display:"flex",alignItems:"center",justifyContent:"center",background:on?"var(--accent)":"var(--surface-card)",border:on?"2px solid var(--accent)":"2px solid var(--border-control)",color:"var(--text-on-accent)",transition:"background-color var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)"}}>{on&&<Icon name="check" size={Math.round(size*0.6)} strokeWidth={3}/>}</span>
    {label&&<span style={{fontSize:"var(--fs-body)"}}>{label}</span>}
  </label>;
});
