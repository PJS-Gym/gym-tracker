import React from "react";
import { Button } from "../core/Button.jsx";
const fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
function useRemaining(endsAt){
  const [now,setNow]=React.useState(null); // null until mounted: never compute time during render (hydration)
  React.useEffect(()=>{
    if(!endsAt)return;let t;
    const tick=()=>{const n=Date.now();setNow(n);if(n<endsAt)t=setTimeout(tick,1000-(n%1000)+5);};
    tick();
    const vis=()=>{if(document.visibilityState==="visible"){clearTimeout(t);tick();}};
    document.addEventListener("visibilitychange",vis);
    return ()=>{clearTimeout(t);document.removeEventListener("visibilitychange",vis);};
  },[endsAt]);
  if(now===null)return [null,false];
  return [Math.max(0,Math.ceil((endsAt-now)/1000)),now-endsAt>3000]; // late: it ended while the screen was off or the bar unmounted
}
/** Docked rest countdown. Non-modal: the logger stays usable behind it. Time is derived from `endsAt` (ms epoch),
 *  so it stays right when the screen locks. When rest ends the bar turns pink and calls `onEnd` once. */
export function RestTimerBar({endsAt,total,next,onAdjust,onSkip,onEnd,style={},...rest}){
  const [left,late]=useRemaining(endsAt);
  const over=left===0;
  const ended=React.useRef(false);
  React.useEffect(()=>{ended.current=false;},[endsAt]);
  React.useEffect(()=>{if(over&&!ended.current){ended.current=true;if(!late&&onEnd)onEnd();}},[over]); // a stale end shows the end state silently
  const frac=left===null||!total?1:Math.min(1,left/total);
  return <div {...rest} style={{position:"relative",display:"flex",alignItems:"center",gap:6,minHeight:64,padding:"8px 8px 8px 14px",borderRadius:"var(--radius-lg)",overflow:"hidden",background:over?"var(--accent)":"var(--surface-inverse)",color:over?"var(--text-on-accent)":"var(--text-inverse)",boxShadow:"var(--shadow-float)",transition:"background-color var(--dur-base) var(--ease-standard),color var(--dur-base) var(--ease-standard)",...style}}>
    {!over&&<span aria-hidden="true" style={{position:"absolute",left:0,top:0,height:3,width:(frac*100)+"%",background:"var(--accent)",transition:"width 1s linear"}}/>}
    <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
      {over?<>
        <span style={{fontSize:"var(--fs-title-s)",fontWeight:"var(--weight-heavy)"}}>Rest over</span>
        {next&&<span style={{fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-semibold)"}}>{"Next: "+next}</span>}
      </>:<>
        <span style={{fontSize:"var(--fs-caption)",fontWeight:"var(--weight-semibold)"}}>Rest</span>
        <span role="timer" aria-label="Rest remaining" style={{display:"inline-block",minWidth:"4ch",fontSize:28,lineHeight:1,fontWeight:"var(--weight-heavy)",fontVariantNumeric:"tabular-nums"}}>{left===null?"–:––":fmt(left)}</span>
      </>}
    </div>
    {!over&&<>
      <Button variant="tonal" size="md" onClick={()=>onAdjust&&onAdjust(-15)} style={{padding:"0 10px",background:"color-mix(in srgb, currentColor 14%, transparent)",color:"inherit"}}>−15s</Button>
      <Button variant="tonal" size="md" onClick={()=>onAdjust&&onAdjust(15)} style={{padding:"0 10px",background:"color-mix(in srgb, currentColor 14%, transparent)",color:"inherit"}}>+15s</Button>
    </>}
    <Button variant={over?"secondary":"primary"} size="md" onClick={onSkip} style={{padding:"0 14px"}}>{over?"Done":"Skip rest"}</Button>
  </div>;
}
