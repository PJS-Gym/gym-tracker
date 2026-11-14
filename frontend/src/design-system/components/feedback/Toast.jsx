import React from "react";
import { Icon } from "../core/Icon.jsx";
/** Floating pill confirmation. Render it inside a ToastRegion so screen readers announce it.
 *  `action` adds one inline action such as Undo. Neutral by default; there is no celebratory colour for PRs. */
export function Toast({message,icon,action,tone="neutral",style={},...rest}){
  const danger=tone==="danger";
  return <div {...rest} style={{display:"inline-flex",alignItems:"center",gap:10,minHeight:48,padding:action?"4px 6px 4px 18px":"12px 18px",borderRadius:"var(--radius-pill)",background:danger?"var(--pjs-flare)":"var(--surface-inverse)",color:danger?"var(--text-on-danger)":"var(--text-inverse)",fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-bold)",boxShadow:"var(--shadow-float)",maxWidth:"100%",...style}}>
    {icon&&<Icon name={icon} size={18}/>}<span style={{minWidth:0}}>{message}</span>
    {action&&<button type="button" onClick={action.onAction} className="pjs-i" style={{height:40,padding:"0 14px",border:0,borderRadius:"var(--radius-pill)",background:"transparent",color:"inherit",fontFamily:"var(--font-body)",fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-heavy)",textDecoration:"underline",textUnderlineOffset:3}}>{action.label}</button>}
  </div>;
}
/** Always-mounted polite live region. Place it once per screen frame; swap the toast inside it. */
export function ToastRegion({children,placement="bottom",offset=0,style={},...rest}){
  const pos=placement==="top"?{top:offset}:{bottom:"calc("+(typeof offset==="number"?offset+"px":offset)+" + env(safe-area-inset-bottom))"};
  return <div role="status" aria-live="polite" aria-atomic="true" {...rest} style={{position:"absolute",left:16,right:16,...pos,zIndex:"var(--z-toast)",display:"flex",justifyContent:"center",pointerEvents:"none",...style}}>
    <div style={{pointerEvents:"auto",maxWidth:"100%"}}>{children}</div>
  </div>;
}
