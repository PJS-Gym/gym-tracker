import React from "react";
const norm=o=>typeof o==="object"?o:{value:o,label:String(o)};
/** 2–4 mutually exclusive options. Native radios, so arrow keys work. `label` names the group for screen readers. */
export function SegmentedControl({label,options=[],value,defaultValue,onValueChange,name,style={},...rest}){
  const auto=React.useId();const group=name||"pjs-seg"+auto;
  const opts=options.map(norm);
  const [inner,setInner]=React.useState(defaultValue!==undefined?defaultValue:(opts[0]&&opts[0].value));
  const cur=value!==undefined?value:inner;
  const pick=v=>{if(value===undefined)setInner(v);onValueChange&&onValueChange(v);};
  return <fieldset className="pjs-seg" {...rest} style={{display:"flex",padding:4,gap:4,borderRadius:"var(--radius-pill)",background:"var(--surface-field)",...style}}>
    <legend className="pjs-vh">{label}</legend>
    {opts.map(o=>{const a=o.value===cur;return <label key={String(o.value)} className="pjs-i" style={{position:"relative",flex:1,minWidth:0,borderRadius:"var(--radius-pill)",color:a?"var(--text-inverse)":"var(--text-2)",background:a?"var(--surface-inverse)":"transparent"}}>
      <input type="radio" name={group} value={String(o.value)} checked={a} onChange={()=>pick(o.value)}/>
      <span style={{display:"flex",alignItems:"center",justifyContent:"center",height:40,borderRadius:"var(--radius-pill)",fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-bold)",whiteSpace:"nowrap"}}>{o.label}</span>
    </label>;})}
  </fieldset>;
}
