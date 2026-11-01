import React from "react";
import { Icon } from "../core/Icon.jsx";
/** 56px row for menus and settings inside a Sheet or a list. `destructive` colours label and icon with the danger token. */
export const ListRow=React.forwardRef(function ListRow({icon,label,detail,destructive=false,trailing,onClick,disabled=false,style={},...rest},ref){
  const c=destructive?"var(--status-danger)":"var(--text-1)";
  return <button ref={ref} type="button" onClick={onClick} disabled={disabled} {...rest} className="pjs-i" style={{opacity:disabled?.45:1,display:"flex",alignItems:"center",gap:14,width:"100%",minHeight:56,padding:"0 12px",border:0,borderRadius:"var(--radius-md)",background:"transparent",color:c,fontFamily:"var(--font-body)",fontSize:"var(--fs-body)",fontWeight:"var(--weight-semibold)",textAlign:"left",...style}}>
    {icon&&<Icon name={icon} size={22}/>}<span style={{flex:1,minWidth:0}}>{label}</span>
    {detail&&<span style={{fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-regular)",color:"var(--text-2)",fontVariantNumeric:"tabular-nums"}}>{detail}</span>}
    {trailing}
  </button>;
});
