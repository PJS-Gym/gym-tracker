import React from "react";
import { Media } from "../core/Media.jsx";
/** Full-bleed photo header: bottom scrim, date line, expanded sentence-case title (the screen's one display statement).
 *  Content sits in the bottom 40% where the scrim is at least .60, and uses the on-media palette. */
export function WorkoutHero({image,alt="",eyebrow,title,minHeight=520,as:Title="h1",children,style={},...rest}){
  return <section {...rest} style={{position:"relative",minHeight,display:"flex",flexDirection:"column",justifyContent:"flex-end",overflow:"hidden",background:"var(--ink-950)",...style}}>
    <div style={{position:"absolute",inset:0}}><Media src={image} alt={alt}/></div>
    <div aria-hidden="true" style={{position:"absolute",inset:0,background:"var(--scrim-bottom)"}}/>
    <div aria-hidden="true" style={{position:"absolute",left:0,right:0,top:0,height:160,background:"var(--scrim-top)"}}/>
    <div data-surface="media" style={{position:"relative",padding:"0 var(--gutter-screen) 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,textAlign:"center"}}>
      {eyebrow&&<p style={{margin:0,fontSize:"var(--fs-body)",fontWeight:"var(--weight-bold)",color:"var(--text-2)"}}>{eyebrow}</p>}
      <Title style={{margin:0,fontFamily:"var(--font-display)",fontStretch:"var(--stretch-display)",fontWeight:"var(--weight-heavy)",fontSize:"var(--fs-display-l)",lineHeight:"var(--lh-display-l)",letterSpacing:"var(--tracking-display)",textWrap:"balance"}}>{title}</Title>
      {children}
    </div>
  </section>;
}
