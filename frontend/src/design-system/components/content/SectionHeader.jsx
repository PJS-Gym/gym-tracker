import React from "react";
/** Section title (h2 by default) with an optional trailing slot for one action, e.g.
 *  <Button variant="ghost" size="sm">See all</Button> or a labelled IconButton. */
export function SectionHeader({title,as:Title="h2",trailing,style={},...rest}){
  return <div {...rest} style={{display:"flex",alignItems:"center",gap:8,minHeight:44,...style}}>
    <Title style={{flex:1,minWidth:0,margin:0,fontSize:"var(--fs-title-m)",lineHeight:"var(--lh-title-m)",fontWeight:"var(--weight-bold)"}}>{title}</Title>
    {trailing}
  </div>;
}
