(()=>{
const {Icon}=window.PJSGymDesignSystem_ff31cf;
/* Device frame for previews only: 390×844 with status bar and home indicator. */
function Phone({children,theme,overlay}){
  return <div data-theme={theme} style={{width:390,height:844,borderRadius:48,overflow:"hidden",position:"relative",background:"var(--surface-app)",color:"var(--text-1)",boxShadow:"0 0 0 10px #1E1216, 0 30px 80px rgba(30,18,22,.35)"}}>
    <div aria-hidden="true" style={{position:"absolute",top:0,left:0,right:0,height:50,zIndex:40,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 32px 0 40px",fontSize:16,fontWeight:700,color:overlay?"#fff":"var(--text-1)",pointerEvents:"none"}}><span>9:41</span><span style={{display:"flex",gap:6}}><Icon name="signal" size={17}/><Icon name="wifi" size={17}/><Icon name="battery-full" size={20}/></span></div>
    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column"}}>{children}</div>
    <div aria-hidden="true" style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",width:134,height:5,borderRadius:3,background:overlay?"#fff":"var(--text-1)",zIndex:60,pointerEvents:"none"}}/>
  </div>;
}
/* A scrolling screen body. Grid rows (not a flex column) so children never shrink. */
function ScrollBody({children,style={},padBottom=24}){
  return <div style={{flex:1,minHeight:0,overflowY:"auto",display:"grid",gridTemplateColumns:"minmax(0,1fr)",gridAutoRows:"max-content",alignContent:"start",padding:"16px var(--gutter-screen) "+padBottom+"px",scrollPaddingBottom:padBottom,...style}}>{children}</div>;
}
/* Elapsed workout time. Derived from startedAt so it survives a locked screen; only this leaf re-renders each second. */
function ElapsedTime({since,style}){
  const [now,setNow]=React.useState(null);
  React.useEffect(()=>{let t;const tick=()=>{const n=Date.now();setNow(n);t=setTimeout(tick,1000-(n%1000)+5);};tick();return ()=>clearTimeout(t);},[since]);
  if(now===null)return <span style={{display:"inline-block",minWidth:"5ch",textAlign:"center",...style}}>–:––</span>;
  const s=Math.max(0,Math.floor((now-since)/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;
  const txt=(h?h+":"+String(m).padStart(2,"0"):m)+":"+String(x).padStart(2,"0");
  return <span style={{display:"inline-block",minWidth:txt.length>5?"7ch":"5ch",textAlign:"center",fontVariantNumeric:"tabular-nums",...style}}>{txt}</span>;
}
window.Phone=Phone;window.ScrollBody=ScrollBody;window.ElapsedTime=ElapsedTime;
})();
