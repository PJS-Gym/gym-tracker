(()=>{
const {TopBar,Button,IconButton,ProgressBar,SetTable,Sheet,ListRow,RestTimerBar,TextField,ExerciseRow,EmptyState,Badge}=window.PJSGymDesignSystem_ff31cf;
const LIBRARY=["Bench Press (Barbell)","Incline Bench Press (Dumbbell)","Shoulder Press (Dumbbell)","Lateral Raise (Cable)","Triceps Pushdown (Cable)","Cable Fly","Push Up","Dips"];
const REST=90;
let uid=0;const nid=()=>Date.now().toString(36)+(uid++);
function useWakeLock(){
  React.useEffect(()=>{let lock=null,dead=false;
    const req=async()=>{try{if("wakeLock" in navigator&&document.visibilityState==="visible")lock=await navigator.wakeLock.request("screen");}catch(e){}};
    const vis=()=>{if(!dead&&document.visibilityState==="visible")req();};
    req();document.addEventListener("visibilitychange",vis);
    return ()=>{dead=true;document.removeEventListener("visibilitychange",vis);try{lock&&lock.release();}catch(e){}};},[]);
}
const buzz=p=>{try{navigator.vibrate&&navigator.vibrate(p);}catch(e){}};
/* The live logger. `workout` lives in the app shell and is saved on every change, so minimizing never loses sets. */
function ActiveWorkoutScreen({workout,onChange,onMinimize,onFinish,onDiscard,notify,announce}){
  const ElapsedTime=window.ElapsedTime;
  useWakeLock();
  const [menu,setMenu]=React.useState(null);      // exercise id
  const [picker,setPicker]=React.useState(false);
  const [pick,setPick]=React.useState([]);const [q,setQ]=React.useState("");
  const [finish,setFinish]=React.useState(false);const [confirm,setConfirm]=React.useState(false);
  const all=workout.exercises.flatMap(e=>e.sets);
  const done=all.filter(s=>s.done).length,total=all.length;
  const upd=fn=>onChange(w=>({...w,exercises:fn(w.exercises)}));
  const updSet=(eid,sid,patch)=>upd(xs=>xs.map(e=>e.id!==eid?e:{...e,sets:e.sets.map(s=>s.id!==sid?s:{...s,...patch})}));
  const nextLabel=()=>{for(const e of workout.exercises){const i=e.sets.findIndex(s=>!s.done);if(i>=0)return e.name.replace(/ \(.+\)/,"")+", set "+(i+1);}return null;};
  const tick=(e,s,v)=>{updSet(e.id,s.id,{done:v});if(v){buzz(15);onChange(w=>({...w,rest:{endsAt:Date.now()+REST*1000,total:REST}}));}};
  const ex=workout.exercises.find(e=>e.id===menu);
  const move=(id,d)=>upd(xs=>{const i=xs.findIndex(e=>e.id===id),j=i+d;if(j<0||j>=xs.length)return xs;const c=[...xs];[c[i],c[j]]=[c[j],c[i]];return c;});
  const removeExercise=id=>{const idx=workout.exercises.findIndex(e=>e.id===id);const gone=workout.exercises[idx];upd(xs=>xs.filter(e=>e.id!==id));setMenu(null);
    // Undo re-inserts into the CURRENT workout, so sets logged during the undo window are kept.
    notify({message:gone.name.replace(/ \(.+\)/,"")+" removed",action:{label:"Undo",onAction:()=>upd(xs=>xs.some(e=>e.id===gone.id)?xs:[...xs.slice(0,idx),gone,...xs.slice(idx)])}});};
  const removeLastSet=id=>{const e=workout.exercises.find(x=>x.id===id);if(!e||!e.sets.length)return;const last=e.sets[e.sets.length-1];
    upd(xs=>xs.map(x=>x.id!==id?x:{...x,sets:x.sets.slice(0,-1)}));setMenu(null);
    notify({message:"Set "+e.sets.length+" removed",action:{label:"Undo",onAction:()=>upd(xs=>xs.map(x=>x.id!==id?x:{...x,sets:[...x.sets,last]}))}});};
  const addSet=e=>{const l=e.sets[e.sets.length-1];upd(xs=>xs.map(x=>x.id!==e.id?x:{...x,sets:[...x.sets,{id:nid(),weight:null,reps:null,done:false,previous:l?{weight:l.weight!=null?l.weight:l.previous&&l.previous.weight,reps:l.reps!=null?l.reps:l.previous&&l.previous.reps}:null}]}));};
  const addPicked=()=>{upd(xs=>[...xs,...pick.map(n=>({id:nid(),name:n,sets:[{id:nid(),weight:null,reps:null,done:false,previous:null}]}))]);setPick([]);setQ("");setPicker(false);};
  const unticked=total-done;
  return <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",paddingTop:50,position:"relative"}}>
    <TopBar leading={<TopBar.Action icon="chevron-down" label="Minimize workout" onClick={onMinimize}/>}
      trailing={<Button variant="ghost" size="sm" onClick={()=>setFinish(true)}>Finish</Button>}>
      <h1 style={{margin:0,display:"flex",flexDirection:"column",alignItems:"center",fontSize:"var(--fs-body-s)",fontWeight:600,lineHeight:1.2}}><span>{workout.name}</span><ElapsedTime since={workout.startedAt} style={{fontSize:"var(--fs-title-s)",fontWeight:800}}/></h1>
    </TopBar>
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"4px var(--gutter-screen) 12px"}}>
      <ProgressBar value={done} max={Math.max(1,total)} label="Sets logged" valueText={done+" of "+total+" sets"} style={{flex:1}}/>
      <span style={{fontSize:"var(--fs-label)",fontWeight:700,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap"}}>{done} of {total} sets</span>
    </div>
    <div style={{flex:1,minHeight:0,overflowY:"auto",display:"grid",gridAutoRows:"max-content",gap:28,padding:"8px 12px 128px",scrollPaddingBottom:128}}>
      {workout.exercises.length===0&&<div style={{padding:"0 8px"}}><EmptyState title="No exercises yet" body="Add an exercise to start logging sets." action={<Button icon="plus" onClick={()=>setPicker(true)}>Add exercise</Button>}/></div>}
      {workout.exercises.map(e=><section key={e.id} style={{display:"flex",flexDirection:"column",gap:4}}>
        <div style={{display:"flex",alignItems:"center",gap:4,padding:"0 0 4px 8px"}}>
          <h2 style={{flex:1,margin:0,fontSize:"var(--fs-title-s)",fontWeight:700}}>{e.name}</h2>
          <IconButton icon="ellipsis" label={"Options for "+e.name} onClick={()=>setMenu(e.id)}/>
        </div>
        <SetTable label={e.name} unit="kg">
          <SetTable.Header/>
          {e.sets.map((s,i)=><SetTable.Row key={s.id} index={i+1} previous={s.previous} weight={s.weight} reps={s.reps} done={s.done}
            onValueChange={v=>updSet(e.id,s.id,v)} onDoneChange={v=>tick(e,s,v)}/>)}
        </SetTable>
        <Button variant="tonal" size="sm" icon="plus" style={{alignSelf:"flex-start",margin:"6px 8px 0"}} onClick={()=>addSet(e)}>Add set</Button>
      </section>)}
      {workout.exercises.length>0&&<Button variant="outline" icon="plus" style={{margin:"0 8px"}} onClick={()=>setPicker(true)}>Add exercise</Button>}
    </div>
    {workout.rest&&<div style={{position:"absolute",left:12,right:12,bottom:"calc(16px + env(safe-area-inset-bottom))",zIndex:"var(--z-dock)"}}>
      <RestTimerBar endsAt={workout.rest.endsAt} total={workout.rest.total} next={nextLabel()}
        onAdjust={d=>onChange(w=>({...w,rest:w.rest&&{endsAt:Math.max(Date.now()+1000,w.rest.endsAt+d*1000),total:Math.max(1,w.rest.total+d)}}))}
        onSkip={()=>onChange(w=>({...w,rest:null}))}
        onEnd={()=>{buzz([200,100,200]);const n=nextLabel();announce("Rest over."+(n?" Next: "+n+".":""));}}/>
    </div>}
    <Sheet open={!!ex} onOpenChange={o=>!o&&setMenu(null)} title={ex?ex.name:""}>
      {ex&&<div style={{display:"flex",flexDirection:"column"}}>
        <ListRow icon="arrow-up" label="Move up" disabled={workout.exercises[0]===ex} onClick={()=>move(ex.id,-1)}/>
        <ListRow icon="arrow-down" label="Move down" disabled={workout.exercises[workout.exercises.length-1]===ex} onClick={()=>move(ex.id,1)}/>
        <ListRow icon="minus" label="Remove last set" onClick={()=>removeLastSet(ex.id)}/>
        <ListRow icon="trash-2" label="Remove exercise" destructive onClick={()=>removeExercise(ex.id)}/>
      </div>}
    </Sheet>
    <Sheet open={picker} onOpenChange={o=>{if(!o){setPicker(false);setPick([]);setQ("");}}} title="Add exercises" style={{maxHeight:"86%"}}>
      <TextField label="Search exercises" hideLabel icon="search" placeholder="Search exercises…" value={q} onValueChange={setQ} type="search" enterKeyHint="search" autoComplete="off"/>
      <div style={{display:"flex",flexDirection:"column"}}>
        {LIBRARY.filter(n=>n.toLowerCase().includes(q.toLowerCase())).map(n=><ExerciseRow key={n} name={n} selectable selected={pick.includes(n)} onClick={()=>setPick(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n])}/>)}
        {!LIBRARY.some(n=>n.toLowerCase().includes(q.toLowerCase()))&&<EmptyState as="h3" title={"No exercises match \u201c"+q+"\u201d"} body="Check the spelling, or search by equipment, like cable or dumbbell."/>}
      </div>
      <Button size="lg" fullWidth disabled={!pick.length} onClick={addPicked} style={{position:"sticky",bottom:0}}>{pick.length?"Add "+pick.length+" exercise"+(pick.length>1?"s":""):"Select exercises"}</Button>
    </Sheet>
    <Sheet open={finish&&!confirm} onOpenChange={o=>!o&&setFinish(false)} title="Finish workout?">
      <p style={{margin:0,textAlign:"center",color:"var(--text-2)",fontVariantNumeric:"tabular-nums"}}>{done} of {total} sets done · <ElapsedTime since={workout.startedAt}/></p>
      {unticked>0&&<p style={{margin:0,textAlign:"center",fontSize:"var(--fs-body-s)",fontWeight:600}}>{unticked} unticked {unticked===1?"set":"sets"} won't be saved.</p>}
      <Button size="lg" fullWidth disabled={!done} onClick={onFinish}>Finish workout</Button>
      <Button variant="tonal" fullWidth onClick={()=>setFinish(false)}>Keep training</Button>
      <Button variant="ghost" fullWidth onClick={()=>setConfirm(true)} style={{color:"var(--status-danger)"}}>Discard workout</Button>
    </Sheet>
    <Sheet open={confirm} onOpenChange={o=>{if(!o){setConfirm(false);}}} title="Discard this workout?">
      <p style={{margin:0,textAlign:"center",color:"var(--text-2)"}}>{done} logged {done===1?"set":"sets"} will be deleted. This can't be undone.</p>
      <Button variant="danger" size="lg" fullWidth onClick={onDiscard}>Discard workout</Button>
      <Button variant="tonal" fullWidth onClick={()=>{setConfirm(false);setFinish(false);}}>Keep workout</Button>
    </Sheet>
  </div>;
}
window.ActiveWorkoutScreen=ActiveWorkoutScreen;
})();
