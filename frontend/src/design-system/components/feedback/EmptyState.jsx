import React from "react";
/** What to do when there is nothing here yet. Text and one action; no illustration. */
export function EmptyState({title,body,action,as:Title="h2",style={},...rest}){
  return <div {...rest} style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:8,padding:"24px 0",...style}}>
    <Title style={{margin:0,fontSize:"var(--fs-title-m)",lineHeight:"var(--lh-title-m)",fontWeight:"var(--weight-bold)"}}>{title}</Title>
    {body&&<p style={{margin:0,fontSize:"var(--fs-body)",color:"var(--text-2)",maxWidth:"36ch"}}>{body}</p>}
    {action&&<div style={{marginTop:8}}>{action}</div>}
  </div>;
}
