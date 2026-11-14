import React from "react";
import { Icon } from "./Icon.jsx";
const V={overlay:{background:"var(--surface-overlay)",color:"#FFFFFF"},tonal:{background:"var(--surface-raised)",color:"var(--text-1)"},plain:{background:"transparent",color:"var(--text-1)"},accent:{background:"var(--accent)",color:"var(--text-on-accent)"},soft:{background:"var(--accent-soft)",color:"var(--text-on-accent-soft)"}};
const DEV=typeof process==="undefined"||process.env.NODE_ENV!=="production";
export const IconButton=React.forwardRef(function IconButton({icon,label,variant="plain",size=44,pressed,className="",style={},...rest},ref){
  if(DEV&&!label&&!rest["aria-label"]&&!rest["aria-labelledby"])console.error("[PJS IconButton] `label` is required: it is the button's accessible name (icon: "+icon+").");
  const glyph=Math.round(size*0.5);
  return <button ref={ref} type="button" aria-label={label} aria-pressed={pressed} {...rest} className={"pjs-i pjs-press--icon"+(size<44?" pjs-hit":"")+(className?" "+className:"")} style={{width:size,height:size,minWidth:size,borderRadius:"var(--radius-pill)",border:0,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,...V[variant],...style}}><Icon name={icon} size={glyph} fill={pressed?"currentColor":"none"}/></button>;
});
