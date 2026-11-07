import React from "react";
import { IconButton } from "../core/IconButton.jsx";
const ToneCtx=React.createContext("default");
/** 52px bar with a centered title (rendered as the screen's h1) and optional leading/trailing slots.
 *  tone="overMedia" puts it on photography: actions become solid overlay chips and text uses the on-media palette. */
export function TopBar({children,leading,trailing,tone="default",divider=false,as:Title="h1",style={},...rest}){
  const media=tone==="overMedia";
  return <ToneCtx.Provider value={tone}><header data-surface={media?"media":undefined} {...rest} style={{display:"grid",gridTemplateColumns:"minmax(44px,auto) minmax(0,1fr) minmax(44px,auto)",alignItems:"center",gap:8,height:"var(--topbar-height)",padding:"0 12px",borderBottom:divider?"1px solid var(--border-subtle)":"none",color:"var(--text-1)",...style}}>
    <div style={{display:"flex",justifyContent:"flex-start"}}>{leading}</div>
    {typeof children==="string"||typeof children==="number"?<Title style={{margin:0,textAlign:"center",fontSize:"var(--fs-title-s)",fontWeight:"var(--weight-bold)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{children}</Title>:<div style={{display:"flex",justifyContent:"center",minWidth:0}}>{children}</div>}
    <div style={{display:"flex",justifyContent:"flex-end"}}>{trailing}</div>
  </header></ToneCtx.Provider>;
}
function TopBarAction(props){const tone=React.useContext(ToneCtx);return <IconButton variant={tone==="overMedia"?"overlay":"plain"} {...props}/>;}
TopBar.Action=TopBarAction;
