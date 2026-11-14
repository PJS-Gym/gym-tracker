import React from "react";
/** Linear or segmented progress. Always show the value as text next to it: pink on a light track is a graphic, not a label. */
export function ProgressBar({value=0,max=100,variant="continuous",label,valueText,height=6,style={},...rest}){
  const v=Math.max(0,Math.min(max,value));
  const aria={role:"progressbar","aria-label":label,"aria-valuemin":0,"aria-valuemax":max,"aria-valuenow":v,"aria-valuetext":valueText};
  if(variant==="segmented")return <div {...aria} {...rest} style={{display:"flex",gap:4,...style}}>{Array.from({length:max}).map((_,i)=><span key={i} style={{flex:1,height,borderRadius:"var(--radius-pill)",background:i<v?"var(--data-1)":"var(--data-track)",transition:"background-color var(--dur-base) var(--ease-standard)"}}/>)}</div>;
  return <div {...aria} {...rest} style={{height,borderRadius:"var(--radius-pill)",background:"var(--data-track)",overflow:"hidden",...style}}><div style={{width:(v/max*100)+"%",height:"100%",borderRadius:"var(--radius-pill)",background:"var(--data-1)",transition:"width var(--dur-slow) var(--ease-emphasized)"}}/></div>;
}
