import React from "react";
const SIZES={s:22,m:40,l:96};
/** The Gym Tracker name set in Archivo Expanded Black. One colour (currentColor) by default.
 *  `lockup` sets "GYM" in pink: only on dark or media surfaces, at 28px or larger. */
export function Wordmark({size="s",lockup=false,as:Tag="span",style={},...rest}){
  const px=typeof size==="number"?size:(SIZES[size]||SIZES.s);
  return <Tag translate="no" {...rest} style={{display:"inline-block",fontFamily:"var(--font-display)",fontStretch:"var(--stretch-display)",fontWeight:"var(--weight-black)",fontSize:px,lineHeight:.9,letterSpacing:px<=24?"var(--tracking-wordmark)":"var(--tracking-display)",textTransform:"uppercase",whiteSpace:"nowrap",margin:0,...style}}>
    {lockup?<span style={{color:"var(--pjs-pink)"}}>Gym</span>:"Gym"} Tracker
  </Tag>;
}
