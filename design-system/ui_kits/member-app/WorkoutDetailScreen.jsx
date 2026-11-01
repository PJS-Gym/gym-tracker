(()=>{
const {WorkoutHero,TopBar,ActionRow,Button,Tabs,ExerciseRow,MuscleRow,SectionHeader}=window.PJSGymDesignSystem_ff31cf;
function Group({title,time,children}){return <section style={{display:"flex",flexDirection:"column"}}>
  <SectionHeader as="h3" title={title} trailing={<span style={{fontSize:"var(--fs-body)",color:"var(--text-2)",fontVariantNumeric:"tabular-nums"}}>{time}</span>} style={{paddingTop:12}}/>{children}</section>;}
function WorkoutDetailScreen({onBack,onStart}){
  const [saved,setSaved]=React.useState(false);
  return <div style={{flex:1,minHeight:0,overflowY:"auto",background:"var(--surface-app)"}}>
    <div style={{position:"relative"}}>
      <TopBar tone="overMedia" leading={<TopBar.Action icon="chevron-left" label="Back" onClick={onBack}/>} trailing={<TopBar.Action icon="send" label="Share workout"/>} style={{position:"absolute",top:50,left:0,right:0,zIndex:5}}/>
      <WorkoutHero minHeight={560} eyebrow="Thursday, June 27 · 28 min" title={<>Mobility<br/>and core</>}>
        <ActionRow style={{width:"100%",marginTop:16}} items={[{id:"save",icon:"heart",label:saved?"Saved":"Save",pressed:saved,onClick:()=>setSaved(!saved)},{id:"schedule",icon:"calendar-days",label:"Schedule"},{id:"download",icon:"download",label:"Download"}]}/>
      </WorkoutHero>
    </div>
    <div style={{padding:"16px var(--gutter-screen) 24px"}}><Button size="lg" fullWidth onClick={onStart}>Start workout</Button></div>
    <Tabs defaultValue="plan">
      <Tabs.List aria-label="Workout sections"><Tabs.Tab value="plan">Workout plan</Tabs.Tab><Tabs.Tab value="body">Body activity</Tabs.Tab><Tabs.Tab value="kit">Equipment</Tabs.Tab></Tabs.List>
      <div style={{padding:"8px var(--gutter-screen) 40px"}}>
        <Tabs.Panel value="plan">
          <Group title="Mobility" time="3 min"><ExerciseRow name="Cat Cow" meta="1m"/><ExerciseRow name="World's Greatest Stretch" meta="1m"/><ExerciseRow name="Bear Plank" meta="30s"/></Group>
          <Group title="Core" time="25 min"><ExerciseRow name="Dead Bug" meta="3 × 12"/><ExerciseRow name="Pallof Press" meta="3 × 10 each side"/><ExerciseRow name="Hollow Hold" meta="3 × 30s"/></Group>
        </Tabs.Panel>
        <Tabs.Panel value="body">
          <SectionHeader as="h3" title="Core carries a third of this session" style={{paddingTop:12}}/>
          {[["Core",34],["Glutes",14],["Hip flexors",12],["Obliques",9],["Shoulders",6]].map(([n,p],i)=><MuscleRow key={n} name={n} percent={p} max={34} highlight={i===0}/>)}
          <p style={{margin:"12px 0 0",fontSize:"var(--fs-body-s)",color:"var(--text-2)"}}>Share of total working time. The other 25% is spread across smaller muscles.</p>
        </Tabs.Panel>
        <Tabs.Panel value="kit"><p style={{margin:0,padding:"16px 0",color:"var(--text-2)"}}>Mat · Loop band · Cable station</p></Tabs.Panel>
      </div>
    </Tabs>
  </div>;
}
window.WorkoutDetailScreen=WorkoutDetailScreen;
})();
