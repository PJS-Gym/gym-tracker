import React from "react";
import { Icon } from "./Icon.jsx";
export const Chip=React.forwardRef(function Chip({children,selected=false,icon,className="",style={},...rest},ref){
  return <button ref={ref} type="button" aria-pressed={selected} {...rest} className={"pjs-i pjs-press"+(className?" "+className:"")} style={{display:"inline-flex",alignItems:"center",gap:6,height:44,padding:"0 16px",flex:"none",borderRadius:"var(--radius-pill)",border:0,fontFamily:"var(--font-body)",fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-semibold)",whiteSpace:"nowrap",background:selected?"var(--surface-inverse)":"var(--surface-raised)",color:selected?"var(--text-inverse)":"var(--text-1)",...style}}>{icon&&<Icon name={icon} size={16}/>}{children}</button>;
});
