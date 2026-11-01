(()=>{
const {TopBar,SectionHeader,ActionTile,RoutineCard,CollapsibleSection,IconButton}=window.PJSGymDesignSystem_ff31cf;
function TrainScreen({onStartEmpty,onStartRoutine}){
  const ScrollBody=window.ScrollBody;
  return <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",paddingTop:50}}>
    <TopBar divider>Train</TopBar>
    <ScrollBody style={{gap:12}}>
      <SectionHeader title="Quick start"/>
      <ActionTile icon="plus" label="Start empty workout" onClick={onStartEmpty}/>
      <SectionHeader title="Routines" style={{marginTop:8}} trailing={<IconButton icon="folder-plus" label="New folder"/>}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><ActionTile icon="clipboard-list" label="New routine"/><ActionTile icon="search" label="Explore"/></div>
      <CollapsibleSection title="Push, pull, legs" count={0} trailing={<IconButton icon="ellipsis" label="Options for Push, pull, legs"/>}>
        <ActionTile icon="plus" label="New routine" dashed/>
      </CollapsibleSection>
      <CollapsibleSection title="My routines" count={1}>
        <RoutineCard title="Push day" exercises={["Bench Press (Barbell)","Incline Bench Press (Dumbbell)","Shoulder Press (Dumbbell)","Lateral Raise (Cable)","Triceps Pushdown (Cable)"]} meta="5 exercises · 55 min" onStart={onStartRoutine} onMenu={()=>{}}/>
      </CollapsibleSection>
    </ScrollBody>
  </div>;
}
window.TrainScreen=TrainScreen;
})();
