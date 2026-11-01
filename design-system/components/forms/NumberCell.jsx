import React from "react";
const parse=s=>{const t=String(s).trim().replace(",",".");if(t==="")return null;if(!/^\d*\.?\d+$|^\d+\.$/.test(t))return NaN;return Number(t);};
const show=(v,dp)=>v===null||v===undefined||v===""?"":(typeof v==="number"&&Number.isFinite(v)?v.toFixed(dp):String(v));
/** Inline-editable number for the set logger. Numeric keypad, selects on focus, accepts "," or "." as decimal,
 *  commits on blur or Enter, keeps invalid text (never clears it). Empty cells show `placeholder` (target or last time).
 *  Values render with a fixed number of decimals (weight 135.0, reps 8) in tabular figures, so nothing shifts as they change. */
export const NumberCell=React.forwardRef(function NumberCell({value,onValueChange,onValidityChange,label,placeholder,mode="decimal",decimals,max=9999,onEnter,style={},...rest},ref){
  const dp=decimals!=null?decimals:(mode==="integer"?0:1);
  const [text,setText]=React.useState(show(value,dp));
  const [bad,setBad]=React.useState(false);
  const focused=React.useRef(false);
  React.useEffect(()=>{onValidityChange&&onValidityChange(!bad);},[bad]);
  React.useEffect(()=>{if(!focused.current){setText(show(value,dp));setBad(false);}},[value,dp]);
  const commit=()=>{const n=parse(text);
    if(Number.isNaN(n)||(n!==null&&(n>max||(mode==="integer"&&!Number.isInteger(n))))){setBad(true);return false;}
    setBad(false);setText(show(n,dp));if(n!==value&&onValueChange)onValueChange(n);return true;};
  return <input ref={ref} className="pjs-cell" type="text" inputMode={mode==="integer"?"numeric":"decimal"} enterKeyHint="next" autoComplete="off" aria-label={label} aria-invalid={bad||undefined}
    placeholder={placeholder!=null&&placeholder!==""?show(placeholder,dp):undefined} value={text}
    onFocus={e=>{focused.current=true;e.target.select();}}
    onChange={e=>setText(e.target.value)}
    onBlur={()=>{focused.current=false;commit();}}
    onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();if(commit()&&onEnter)onEnter(e);}}}
    {...rest}
    style={{width:"100%",minWidth:0,height:"var(--tap-logger)",border:0,borderRadius:"var(--radius-sm)",background:"var(--surface-card)",color:"var(--text-1)",fontFamily:"var(--font-body)",fontSize:17,fontWeight:"var(--weight-bold)",fontVariantNumeric:"tabular-nums",textAlign:"center",padding:0,scrollMarginBottom:160,...style}}/>;
});
