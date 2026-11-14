import React from "react";
/** Bottom sheet: PJS Gym's only dialog. The parent must be position:relative (the screen or app frame).
 *  While open, everything outside the sheet is inert, Escape closes it, and focus returns to the opener. */
function inertOutside(node){
  const changed=[];let el=node;
  while(el&&el!==document.body&&el.parentElement){
    for(const sib of el.parentElement.children){if(sib!==el&&!sib.inert&&sib.tagName!=="SCRIPT"){sib.inert=true;changed.push(sib);}}
    el=el.parentElement;
  }
  return ()=>changed.forEach(s=>{s.inert=false;});
}
export function Sheet({open=false,onOpenChange,title,children,returnFocusRef,style={},...rest}){
  const [present,setPresent]=React.useState(open);
  const [shown,setShown]=React.useState(false);
  const root=React.useRef(null),panel=React.useRef(null),opener=React.useRef(null);
  const tid=React.useId();
  React.useEffect(()=>{if(open){opener.current=document.activeElement;setPresent(true);}},[open]);
  React.useEffect(()=>{
    if(!present)return;
    if(open){const r=requestAnimationFrame(()=>setShown(true));return ()=>cancelAnimationFrame(r);}
    setShown(false);const t=setTimeout(()=>setPresent(false),200);return ()=>clearTimeout(t);
  },[open,present]);
  React.useEffect(()=>{
    if(!present||!open||!root.current)return;
    const restore=inertOutside(root.current);
    panel.current&&panel.current.focus({preventScroll:true});
    const frame=root.current.parentElement;
    return ()=>{restore();
      // Back to the opener; if it is gone (e.g. "Remove exercise"), to returnFocusRef, then to the screen's h1.
      let back=opener.current&&opener.current.isConnected?opener.current:(returnFocusRef&&returnFocusRef.current);
      if(!back||!back.isConnected){back=frame&&frame.querySelector("h1");if(back&&!back.hasAttribute("tabindex"))back.setAttribute("tabindex","-1");}
      if(back&&back.focus)back.focus({preventScroll:true});};
  },[present,open]);
  React.useEffect(()=>{if(panel.current)panel.current.inert=!open;},[open,present]);
  if(!present)return null;
  const close=()=>onOpenChange&&onOpenChange(false);
  return <div ref={root} style={{position:"absolute",inset:0,zIndex:"var(--z-sheet)",display:"flex",flexDirection:"column",justifyContent:"flex-end",overscrollBehavior:"contain"}}>
    <div aria-hidden="true" onClick={close} style={{position:"absolute",inset:0,background:"var(--scrim)",opacity:shown?1:0,transition:"opacity "+(shown?"var(--dur-slow)":"var(--dur-base)")+" var(--ease-standard)"}}/>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={title?tid:undefined} tabIndex={-1} className="pjs-sheet__panel"
      onKeyDown={e=>{if(e.key==="Escape"){e.stopPropagation();close();}}} {...rest}
      style={{position:"relative",maxHeight:"90%",overflowY:"auto",overscrollBehavior:"contain",background:"var(--surface-card)",borderRadius:"var(--radius-xl) var(--radius-xl) 0 0",padding:"24px var(--gutter-screen) calc(20px + env(safe-area-inset-bottom))",boxShadow:"var(--shadow-sheet)",display:"flex",flexDirection:"column",gap:16,transform:shown?"none":"translateY(100%)",transition:shown?"transform var(--dur-slow) var(--ease-emphasized)":"transform var(--dur-base) var(--ease-standard)",...style}}>
      {title&&<h2 id={tid} style={{margin:0,fontSize:"var(--fs-title-m)",lineHeight:"var(--lh-title-m)",fontWeight:"var(--weight-bold)",textAlign:"center"}}>{title}</h2>}
      {children}
    </div>
  </div>;
}
