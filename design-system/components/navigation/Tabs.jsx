import React from "react";
const Ctx=React.createContext(null);
/** Underline tabs for detail pages. Compound: <Tabs> <Tabs.List> <Tabs.Tab value/> </Tabs.List> <Tabs.Panel value/> </Tabs>. */
export function Tabs({value,defaultValue,onValueChange,children,style={},...rest}){
  const [inner,setInner]=React.useState(defaultValue);
  const cur=value!==undefined?value:inner;
  const setValue=React.useCallback(v=>{if(value===undefined)setInner(v);onValueChange&&onValueChange(v);},[value,onValueChange]);
  const base="pjs-tabs"+React.useId().replace(/[^a-zA-Z0-9_-]/g,"");
  const ctx=React.useMemo(()=>({value:cur,setValue,base}),[cur,setValue,base]);
  return <Ctx.Provider value={ctx}><div {...rest} style={style}>{children}</div></Ctx.Provider>;
}
function TabsList({children,style={},...rest}){
  const ref=React.useRef(null);
  const onKey=e=>{const tabs=[...ref.current.querySelectorAll('[role="tab"]')];const i=tabs.indexOf(document.activeElement);if(i<0)return;
    let n=null;if(e.key==="ArrowRight")n=(i+1)%tabs.length;else if(e.key==="ArrowLeft")n=(i-1+tabs.length)%tabs.length;else if(e.key==="Home")n=0;else if(e.key==="End")n=tabs.length-1;
    if(n!==null){e.preventDefault();tabs[n].focus();tabs[n].click();}};
  return <div ref={ref} role="tablist" onKeyDown={onKey} {...rest} style={{display:"flex",gap:24,overflowX:"auto",scrollbarWidth:"none",borderBottom:"1px solid var(--border-subtle)",padding:"0 var(--gutter-screen)",...style}}>{children}</div>;
}
function Tab({value,children,style={},...rest}){
  const c=React.useContext(Ctx);const a=c.value===value;const ref=React.useRef(null);
  React.useEffect(()=>{if(a&&ref.current&&ref.current.scrollIntoView)ref.current.scrollIntoView({block:"nearest",inline:"nearest"});},[a]);
  return <button ref={ref} type="button" role="tab" id={c.base+"-t-"+value} aria-selected={a} aria-controls={c.base+"-p-"+value} tabIndex={a?0:-1} onClick={()=>c.setValue(value)} {...rest}
    style={{position:"relative",flex:"none",minHeight:48,padding:"0 2px",border:0,background:"transparent",cursor:"pointer",whiteSpace:"nowrap",fontFamily:"var(--font-body)",fontSize:"var(--fs-body)",fontWeight:a?"var(--weight-bold)":"var(--weight-regular)",color:a?"var(--text-1)":"var(--text-2)",...style}}>
    {children}<span aria-hidden="true" style={{position:"absolute",left:0,right:0,bottom:-1,height:3,borderRadius:3,background:a?"var(--text-1)":"transparent"}}/>
  </button>;
}
function TabsPanel({value,children,style={},...rest}){
  const c=React.useContext(Ctx);const a=c.value===value;
  return <div role="tabpanel" id={c.base+"-p-"+value} aria-labelledby={c.base+"-t-"+value} hidden={!a} tabIndex={a?0:-1} {...rest} style={style}>{a?children:null}</div>;
}
Tabs.List=TabsList;Tabs.Tab=Tab;Tabs.Panel=TabsPanel;
