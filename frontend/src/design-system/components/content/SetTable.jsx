import React from "react";
import { NumberCell } from "../forms/NumberCell.jsx";
import { Checkbox } from "../forms/Checkbox.jsx";
const Ctx=React.createContext({unit:"kg",label:"",weightDecimals:1,focusNext:()=>{},report:()=>{},say:()=>{}});
const COLS="32px minmax(0,1fr) 72px 60px 48px";
// Previous is shown compactly ("80.0 × 8"): the unit is already in the column header. The accessible name keeps it.
const fmtPrev=(p,dp)=>p&&p.weight!=null?Number(p.weight).toFixed(dp)+"\u00a0×\u00a0"+p.reps:p&&p.reps!=null?p.reps+"\u00a0reps":"–";
const sayPrev=(p,unit,dp)=>p&&p.weight!=null?Number(p.weight).toFixed(dp)+" "+unit+" for "+p.reps+" reps":p&&p.reps!=null?p.reps+" reps":"none";
/** The set logger for one exercise. Compound: <SetTable label unit> <SetTable.Header/> <SetTable.Row …/> </SetTable>.
 *  Enter moves weight → reps → next set. Ticking a set with empty cells logs the placeholders (target or last time),
 *  so one tap logs a set as planned. Unticking is the undo for a tick. */
export function SetTable({label,unit="kg",weightDecimals=1,children,style={},...rest}){
  const ref=React.useRef(null);
  const [errors,setErrors]=React.useState({});   // cell label -> true while invalid
  const [msg,setMsg]=React.useState("");
  const focusNext=React.useCallback(from=>{const cells=[...ref.current.querySelectorAll("input.pjs-cell")];const i=cells.indexOf(from);if(i>=0&&cells[i+1])cells[i+1].focus();else from.blur();},[]);
  const report=React.useCallback((cell,ok)=>setErrors(e=>{if(ok===!e[cell])return e;const n={...e};if(ok)delete n[cell];else n[cell]=true;return n;}),[]);
  const say=React.useCallback(t=>{setMsg("");setTimeout(()=>setMsg(t),30);},[]);
  const ctx=React.useMemo(()=>({unit,label,weightDecimals,focusNext,report,say}),[unit,label,weightDecimals,focusNext,report,say]);
  const bad=Object.keys(errors);
  return <Ctx.Provider value={ctx}><div {...rest} style={{display:"flex",flexDirection:"column",gap:4,...style}}>
    <div ref={ref} role="table" aria-label={label?label+", sets":undefined} style={{display:"flex",flexDirection:"column",gap:4}}>{children}</div>
    {bad.length>0&&<p role="alert" style={{margin:"2px 8px 0",display:"flex",gap:6,alignItems:"center",fontSize:"var(--fs-label)",fontWeight:"var(--weight-semibold)",color:"var(--status-danger)"}}>{bad[0]+": enter a number"+(bad[0].includes("reps")?", like 8.":", like 82.5.")}</p>}
    <span className="pjs-vh" role="status" aria-live="polite">{msg}</span>
  </div></Ctx.Provider>;
}
function Header({style={},...rest}){
  const {unit}=React.useContext(Ctx);
  const h={fontSize:"var(--fs-label)",fontWeight:"var(--weight-semibold)",color:"var(--text-2)"};
  return <div role="row" {...rest} style={{display:"grid",gridTemplateColumns:COLS,gap:6,alignItems:"center",padding:"0 8px",...style}}>
    <span role="columnheader" style={{...h,textAlign:"center"}}>Set</span><span role="columnheader" style={h}>Previous</span>
    <span role="columnheader" style={{...h,textAlign:"center"}}>{unit}</span><span role="columnheader" style={{...h,textAlign:"center"}}>Reps</span>
    <span role="columnheader" style={{...h,textAlign:"center"}}><span className="pjs-vh">Done</span></span>
  </div>;
}
function Row({index,previous,target,weight=null,reps=null,done=false,onDoneChange,onValueChange,style={},...rest}){
  const {unit,weightDecimals:wd,focusNext,report,say}=React.useContext(Ctx);
  const wRef=React.useRef(null),rRef=React.useRef(null);
  const ph={weight:target&&target.weight!=null?target.weight:previous&&previous.weight,reps:target&&target.reps!=null?target.reps:previous&&previous.reps};
  const n=typeof index==="number"?"Set "+index:String(index);
  const tick=v=>{
    if(!v){onDoneChange&&onDoneChange(false);return;}
    // Never log a value the member can't see: an invalid cell blocks the tick and takes focus.
    const invalid=[wRef,rRef].find(r=>r.current&&r.current.getAttribute("aria-invalid")==="true");
    if(invalid){invalid.current.focus();say("Fix "+invalid.current.getAttribute("aria-label")+" to log "+n.toLowerCase()+".");return;}
    const w=weight!=null?weight:ph.weight,r=reps!=null?reps:ph.reps;
    if(r==null){rRef.current&&rRef.current.focus();say("Add reps to log "+n.toLowerCase()+".");return;}
    if((w!==weight||r!==reps)&&onValueChange)onValueChange({weight:w==null?null:w,reps:r});
    onDoneChange&&onDoneChange(true);
  };
  const copyPrev=()=>{if(previous&&onValueChange)onValueChange({weight:previous.weight!=null?previous.weight:weight,reps:previous.reps!=null?previous.reps:reps});};
  return <div role="row" {...rest} style={{display:"grid",gridTemplateColumns:COLS,gap:6,alignItems:"center",padding:"4px 8px",borderRadius:"var(--radius-sm)",background:done?"var(--accent-soft)":"transparent",transition:"background-color var(--dur-base) var(--ease-standard)",...style}}>
    <span role="cell" style={{textAlign:"center",fontSize:"var(--fs-body)",fontWeight:"var(--weight-bold)",fontVariantNumeric:"tabular-nums",color:done?"var(--text-on-accent-soft)":"var(--text-1)"}}>{index}</span>
    <span role="cell" style={{minWidth:0}}>{previous?<button type="button" onClick={copyPrev} className="pjs-i" aria-label={"Use last time for "+n.toLowerCase()+": "+sayPrev(previous,unit,wd)} style={{display:"block",width:"100%",minHeight:44,padding:"0 4px",border:0,borderRadius:"var(--radius-xs)",background:"transparent",textAlign:"left",fontFamily:"var(--font-body)",fontSize:"var(--fs-body-s)",color:"var(--text-2)",fontVariantNumeric:"tabular-nums",lineHeight:1.2,overflowWrap:"anywhere"}}>{fmtPrev(previous,wd)}</button>:<span style={{fontSize:"var(--fs-body-s)",color:"var(--text-2)"}}>–</span>}</span>
    <span role="cell"><NumberCell ref={wRef} label={n+" weight, "+unit} onValidityChange={ok=>report(n+" weight",ok)} value={weight} placeholder={ph.weight} mode="decimal" decimals={wd} onValueChange={v=>onValueChange&&onValueChange({weight:v,reps})} onEnter={e=>focusNext(e.target)}/></span>
    <span role="cell"><NumberCell ref={rRef} label={n+" reps"} onValidityChange={ok=>report(n+" reps",ok)} value={reps} placeholder={ph.reps} mode="integer" onValueChange={v=>onValueChange&&onValueChange({weight,reps:v})} onEnter={e=>focusNext(e.target)}/></span>
    <span role="cell" style={{display:"flex",justifyContent:"center"}}><Checkbox aria-label={n+" done"} checked={done} onCheckedChange={tick} size={32} hit={48}/></span>
  </div>;
}
SetTable.Header=Header;SetTable.Row=Row;
