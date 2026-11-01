(()=>{
const {TopBar,SegmentedControl,StatTile,MuscleRow,SectionHeader,BarChart}=window.PJSGymDesignSystem_ff31cf;
const DATA={
  week:{per:"day",bars:[["M","Monday",2400],["T","Tuesday",0],["W","Wednesday",4320],["T","Thursday",3300],["F","Friday",0],["S","Saturday",5280],["S","Sunday",1800]],workouts:5,time:"3h 12m",prs:3,muscles:[["Glutes",14],["Core",10],["Quads",9],["Shoulders",9],["Hamstrings",8]]},
  month:{per:"week",bars:[["W1","Week 1",14200],["W2","Week 2",16800],["W3","Week 3",12100],["W4","Week 4",17100]],workouts:19,time:"12h 40m",prs:7,muscles:[["Quads",13],["Glutes",12],["Back",11],["Chest",9],["Core",8]]},
  year:{per:"month",bars:"JFMAMJJASOND".split("").map((l,i)=>[l,["January","February","March","April","May","June","July","August","September","October","November","December"][i],[41,52,58,66,61,70,74,0,0,0,0,0][i]*1000]),workouts:142,time:"96h",prs:31,muscles:[["Quads",12],["Back",12],["Glutes",11],["Chest",10],["Shoulders",9]]}
};
const k=v=>v>=10000?(v/1000).toFixed(1).replace(/\.0$/,"")+"k":v.toLocaleString("en-US");
function ProgressScreen(){
  const ScrollBody=window.ScrollBody;
  const [range,setRange]=React.useState("week");
  const d=DATA[range];
  const bars=d.bars.map(([label,fullLabel,value])=>({label,fullLabel,value}));
  const total=bars.reduce((a,b)=>a+b.value,0);
  const peak=bars.reduce((m,b,i)=>b.value>bars[m].value?i:m,0);
  const top=d.muscles[0];
  return <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",paddingTop:50}}>
    <TopBar divider>Progress</TopBar>
    <ScrollBody style={{gap:16}}>
      <SegmentedControl label="Time range" options={[{value:"week",label:"Week"},{value:"month",label:"Month"},{value:"year",label:"Year"}]} value={range} onValueChange={setRange}/>
      <SectionHeader title={"Volume peaked "+(range==="week"?"on ":"in ")+bars[peak].fullLabel}/>
      <BarChart bars={bars} unit="kg" highlight={peak} format={v=>v.toLocaleString("en-US")} caption={"Total weight lifted per "+d.per+". Bars start at zero; days without a workout show no bar."}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}><StatTile label="Volume" value={k(total)} unit="kg"/><StatTile label="Workouts" value={d.workouts}/><StatTile label="Time" value={d.time}/><StatTile label="New PRs" value={d.prs}/></div>
      <SectionHeader title={top[0]+" did the most work"}/>
      <div>{d.muscles.map(([n,p],i)=><MuscleRow key={n} name={n} percent={p} max={top[1]} highlight={i===0}/>)}</div>
      <p style={{margin:0,fontSize:"var(--fs-body-s)",color:"var(--text-2)"}}>Share of total working time this {range}. The rest is spread across other muscles.</p>
    </ScrollBody>
  </div>;
}
window.ProgressScreen=ProgressScreen;
})();
