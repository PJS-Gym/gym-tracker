import React from "react";
const T={
  neutral:["var(--surface-raised)","var(--text-2)"],
  soft:["var(--accent-soft)","var(--text-on-accent-soft)"],
  accent:["var(--accent)","var(--text-on-accent)"],
  success:["var(--status-success-soft)","var(--status-success)"],
  live:["var(--pjs-flare)","var(--text-on-danger)"]
};
export function Badge({children,tone="neutral",style={},...rest}){
  const [bg,fg]=T[tone]||T.neutral;
  return <span {...rest} style={{display:"inline-flex",alignItems:"center",gap:4,height:24,padding:"0 10px",borderRadius:"var(--radius-pill)",background:bg,color:fg,fontSize:"var(--fs-caption)",fontWeight:"var(--weight-semibold)",whiteSpace:"nowrap",...style}}>{children}</span>;
}
