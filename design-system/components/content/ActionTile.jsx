import React from "react";
import { Icon } from "../core/Icon.jsx";
/** Quick-action tile (Start empty workout, New routine). `dashed` marks an empty slot to add something. */
export const ActionTile=React.forwardRef(function ActionTile({icon,label,dashed=false,style={},...rest},ref){
  return <button ref={ref} type="button" {...rest} className="pjs-i" style={{display:"flex",alignItems:"center",justifyContent:dashed?"center":"flex-start",gap:12,minHeight:60,padding:"0 18px",borderRadius:"var(--radius-md)",border:dashed?"1.5px dashed var(--border-dashed)":0,background:dashed?"transparent":"var(--surface-raised)",color:dashed?"var(--text-accent)":"var(--text-1)",fontFamily:"var(--font-body)",fontSize:"var(--fs-title-s)",fontWeight:"var(--weight-semibold)",textAlign:"left",...style}}><Icon name={icon} size={22}/>{label}</button>;
});
