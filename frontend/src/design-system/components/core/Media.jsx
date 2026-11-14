import React from "react";
/** Photo or video frame. Without `src` it shows the dark placeholder until real PJS photography exists. */
export function Media({src,alt="",radius=0,style={},...rest}){
  if(src)return <img src={src} alt={alt} {...rest} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:radius,display:"block",...style}}/>;
  return <div aria-hidden="true" {...rest} style={{width:"100%",height:"100%",borderRadius:radius,background:"var(--media-placeholder)",...style}}/>;
}
