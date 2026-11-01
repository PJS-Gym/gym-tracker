import React from "react";
import { Icon } from "../core/Icon.jsx";
/** Filled single-line input. `label` is required; pass `hideLabel` to keep it for screen readers only. */
export const TextField=React.forwardRef(function TextField({label,hideLabel=false,hint,error,icon,value,defaultValue,onValueChange,onChange,type="text",id,style={},...rest},ref){
  const auto=React.useId();const fid=id||"pjs-tf"+auto;
  const desc=error?fid+"-err":hint?fid+"-hint":undefined;
  return <div style={{display:"flex",flexDirection:"column",gap:6,...style}}>
    <label htmlFor={fid} className={hideLabel?"pjs-vh":undefined} style={{fontSize:"var(--fs-label)",fontWeight:"var(--weight-semibold)",color:"var(--text-2)"}}>{label}</label>
    <span className="pjs-field__box" style={{display:"flex",alignItems:"center",gap:10,height:52,padding:"0 16px",borderRadius:"var(--radius-md)",background:"var(--surface-field)"}}>
      {icon&&<Icon name={icon} size={20} style={{color:"var(--text-2)"}}/>}
      <input ref={ref} id={fid} type={type} value={value} defaultValue={defaultValue} aria-invalid={error?true:undefined} aria-describedby={desc}
        onChange={e=>{onChange&&onChange(e);onValueChange&&onValueChange(e.target.value);}} {...rest}
        style={{flex:1,minWidth:0,height:"100%",border:0,background:"transparent",color:"var(--text-1)",fontFamily:"var(--font-body)",fontSize:"var(--fs-body)"}}/>
    </span>
    {hint&&!error&&<span id={fid+"-hint"} style={{fontSize:"var(--fs-label)",color:"var(--text-2)"}}>{hint}</span>}
    {error&&<span id={fid+"-err"} role="alert" style={{display:"flex",gap:6,alignItems:"center",fontSize:"var(--fs-label)",fontWeight:"var(--weight-semibold)",color:"var(--status-danger)"}}><Icon name="circle-alert" size={16}/>{error}</span>}
  </div>;
});
