(()=>{
const {Wordmark,IconButton,ProgressBar,MediaCard,SectionHeader,Button,StatTile}=window.PJSGymDesignSystem_ff31cf;
function HomeScreen({onOpenWorkout}){
  const ScrollBody=window.ScrollBody;
  return <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",paddingTop:50}}>
    <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 12px 4px var(--gutter-screen)"}}>
      <Wordmark size="s" as="p"/>
      <div style={{display:"flex",gap:4}}><IconButton icon="bell" label="Notifications"/><IconButton icon="user" variant="tonal" label="Your profile"/></div>
    </header>
    <ScrollBody style={{gap:20,paddingTop:8}}>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        <p style={{margin:0,color:"var(--text-2)",fontWeight:600}}>Thursday, June 27</p>
        <h1 style={{margin:0,fontSize:"var(--fs-title-l)",lineHeight:"var(--lh-title-l)",fontWeight:700}}>Morning, Jordan. You trained legs yesterday, so today is mobility.</h1>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"var(--fs-label)"}}><span style={{color:"var(--text-2)"}}>This week</span><span style={{fontWeight:700,fontVariantNumeric:"tabular-nums"}}>3 of 4 sessions</span></div>
        <ProgressBar variant="segmented" value={3} max={4} label="Sessions this week" valueText="3 of 4 sessions"/>
      </div>
      <MediaCard featured title="Mobility and core" meta="Today · 28 min" onClick={onOpenWorkout}/>
      <SectionHeader title="Classes at PJS" trailing={<Button variant="ghost" size="sm">See all</Button>}/>
      <div style={{display:"flex",gap:12,overflowX:"auto",margin:"-12px calc(-1 * var(--gutter-screen)) -4px",padding:"4px var(--gutter-screen)",scrollbarWidth:"none"}}>
        <MediaCard title="Power hour" meta="6:30 pm · Studio 2"/>
        <MediaCard title="Engine room" meta="7:30 pm · Rig"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}><StatTile label="Volume this week" value="17.1k" unit="kg" detail="Up 8% on last week"/><StatTile label="New PRs" value="3" detail="Bench, row, squat"/></div>
    </ScrollBody>
  </div>;
}
window.HomeScreen=HomeScreen;
})();
