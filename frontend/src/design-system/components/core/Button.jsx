import React from "react";
import { Icon } from "./Icon.jsx";
const V={
  primary:{background:"var(--accent)",color:"var(--text-on-accent)"},
  secondary:{background:"var(--surface-inverse)",color:"var(--text-inverse)"},
  tonal:{background:"var(--surface-raised)",color:"var(--text-1)"},
  outline:{background:"transparent",color:"var(--text-1)",boxShadow:"inset 0 0 0 1.5px var(--border-control)"},
  ghost:{background:"transparent",color:"var(--text-accent)"},
  danger:{background:"var(--status-danger)",color:"var(--text-on-danger)"}
};
const S={sm:{height:40,padding:"0 16px",fontSize:14,gap:6,icon:18},md:{height:48,padding:"0 20px",fontSize:16,gap:8,icon:20},lg:{height:60,padding:"0 28px",fontSize:17,gap:10,icon:22}};
export const Button=React.forwardRef(function Button({children,variant="primary",size="md",icon,iconRight,fullWidth=false,type="button",disabled=false,className="",style={},...rest},ref){
  const s=S[size]||S.md;
  return <button ref={ref} type={type} disabled={disabled} {...rest} className={"pjs-i pjs-press"+(size==="sm"?" pjs-hit":"")+(className?" "+className:"")} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:s.gap,height:s.height,padding:s.padding,width:fullWidth?"100%":undefined,border:0,borderRadius:"var(--radius-pill)",fontFamily:"var(--font-body)",fontSize:s.fontSize,fontWeight:"var(--weight-bold)",lineHeight:1,whiteSpace:"nowrap",opacity:disabled?.45:1,...V[variant],...style}}>
    {icon&&<Icon name={icon} size={s.icon}/>}{children}{iconRight&&<Icon name={iconRight} size={s.icon}/>}
  </button>;
});
