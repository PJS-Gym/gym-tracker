import React from "react";
import { Media } from "../core/Media.jsx";
import { Icon } from "../core/Icon.jsx";
/** A session or class on a photo. The whole card is one button named by its title.
 *  `featured` is the screen's one display statement (expanded type, play mark); other cards use normal-width titles. */
export const MediaCard=React.forwardRef(function MediaCard({title,meta,image,featured=false,onClick,style={},...rest},ref){
  return <button ref={ref} type="button" onClick={onClick} {...rest} className="pjs-i pjs-i--over" style={{position:"relative",display:"flex",flexDirection:"column",justifyContent:"flex-end",width:featured?"100%":200,flex:"none",minHeight:featured?300:220,padding:0,border:0,borderRadius:featured?"var(--radius-2xl)":"var(--radius-xl)",overflow:"hidden",background:"var(--ink-950)",textAlign:"left",fontFamily:"var(--font-body)",color:"#FFFFFF",...style}}>
    <span style={{position:"absolute",inset:0}}><Media src={image}/></span>
    <span aria-hidden="true" style={{position:"absolute",inset:0,background:"var(--scrim-bottom)"}}/>
    {featured&&<span aria-hidden="true" style={{position:"absolute",zIndex:2,right:18,top:18,width:56,height:56,borderRadius:"var(--radius-pill)",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--accent)",color:"var(--text-on-accent)"}}><Icon name="play" size={26}/></span>}
    <span data-surface="media" style={{position:"relative",zIndex:2,display:"flex",flexDirection:"column",gap:6,padding:18}}>
      {meta&&<span style={{fontSize:"var(--fs-body-s)",fontWeight:"var(--weight-semibold)",color:"var(--text-2)",fontVariantNumeric:"tabular-nums"}}>{meta}</span>}
      <span style={featured?{fontFamily:"var(--font-display)",fontStretch:"var(--stretch-display)",fontWeight:"var(--weight-heavy)",fontSize:"var(--fs-display-m)",lineHeight:"var(--lh-display-m)"}:{fontSize:"var(--fs-title-m)",lineHeight:"var(--lh-title-m)",fontWeight:"var(--weight-bold)"}}>{title}</span>
    </span>
  </button>;
});
