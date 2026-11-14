import React from "react";
function useControllableState(value,defaultValue,onChange){
  const [inner,setInner]=React.useState(defaultValue);
  const controlled=React.useRef(value!==undefined).current;
  const cur=controlled?value:inner;
  const cb=React.useRef(onChange);cb.current=onChange;
  const set=React.useCallback(next=>{if(Object.is(next,cur))return;if(!controlled)setInner(next);cb.current&&cb.current(next);},[cur,controlled]);
  return [cur,set];
}
/** On/off setting. Native checkbox with role="switch"; the whole row is the target. */
export const Switch=React.forwardRef(function Switch({checked,defaultChecked=false,onCheckedChange,label,disabled=false,style={},...rest},ref){
  const [on,setOn]=useControllableState(checked,defaultChecked,onCheckedChange);
  return <label className="pjs-check" style={{"--box":"52px","--hit":"52px",minHeight:44,gap:12,opacity:disabled?.45:1,...style}}>
    <input ref={ref} type="checkbox" role="switch" checked={on} disabled={disabled} onChange={e=>setOn(e.target.checked)} {...rest}/>
    <span className="pjs-check__box" style={{width:52,height:32,borderRadius:"var(--radius-pill)",padding:2,display:"flex",alignItems:"center",background:on?"var(--accent)":"var(--surface-field)",border:on?"2px solid var(--accent)":"2px solid var(--border-control)",transition:"background-color var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)"}}>
      <span style={{width:24,height:24,borderRadius:"var(--radius-pill)",background:on?"var(--surface-card)":"var(--border-control)",transform:on?"translateX(20px)":"none",transition:"transform var(--dur-base) var(--ease-standard)"}}/>
    </span>
    {label&&<span style={{fontSize:"var(--fs-body)",color:"var(--text-1)"}}>{label}</span>}
  </label>;
});
