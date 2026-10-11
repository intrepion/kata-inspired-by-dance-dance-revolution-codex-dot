export type Lane = 0 | 1 | 2 | 3;
export interface Note { id:number; lane:Lane; time:number; end?:number }
export type Judgment = 'PERFECT'|'GREAT'|'GOOD'|'MISS'|'HOLD'|'BREAK';
export interface Signal { text:Judgment; delta:number; lane:Lane }
export class Engine {
 readonly states: ('waiting'|'holding'|'done')[];
 readonly down = new Set<Lane>();
 score=0; combo=0; maxCombo=0; energy=100; failed=false;
 counts: Record<Judgment,number> = {PERFECT:0,GREAT:0,GOOD:0,MISS:0,HOLD:0,BREAK:0};
 signal:Signal|null=null;
 constructor(readonly notes:Note[]) { this.states=notes.map(()=> 'waiting'); }
 get maximum() {return this.notes.reduce((s,n)=>s+(n.end===undefined?1000:2000),0);}
 get accuracy() {return this.maximum?this.score/this.maximum:0;}
 get grade() {return this.failed?'F':this.accuracy>=.95?'S':this.accuracy>=.85?'A':this.accuracy>=.7?'B':this.accuracy>=.5?'C':'D';}
 private award(text:Judgment,lane:Lane,delta=0) {
  this.signal={text,lane,delta}; this.counts[text]++;
  if(text==='MISS'||text==='BREAK') {this.combo=0;this.energy=Math.max(0,this.energy-8);this.failed=this.energy===0;}
  else {this.score+=text==='GOOD'?400:text==='GREAT'?750:1000;this.combo++;this.maxCombo=Math.max(this.maxCombo,this.combo);this.energy=Math.min(100,this.energy+2);}
 }
 press(lane:Lane,time:number) {
  if(this.failed||this.down.has(lane))return;
  this.update(time); if(this.failed)return; this.down.add(lane);
  const i=this.notes.findIndex((n,i)=>n.lane===lane&&this.states[i]==='waiting'&&Math.abs(n.time-time)<=.140001);
  if(i<0)return;
  const n=this.notes[i],delta=time-n.time,abs=Math.abs(delta);
  this.award(abs<=.045001?'PERFECT':abs<=.090001?'GREAT':'GOOD',lane,delta);
  this.states[i]=n.end===undefined?'done':'holding';
 }
 release(lane:Lane,time:number) {
  this.update(time); this.down.delete(lane);
  this.notes.forEach((n,i)=>{if(n.lane===lane&&this.states[i]==='holding') {this.states[i]='done';this.award(time>=(n.end??0)-.090001?'HOLD':'BREAK',lane);}});
 }
 update(time:number) {
  if(this.failed)return;
  this.notes.forEach((n,i)=>{
   if(this.failed)return;
   if(this.states[i]==='waiting'&&time>n.time+.140001){this.states[i]='done';this.award('MISS',n.lane);if(n.end!==undefined)this.award('BREAK',n.lane);}
   if(this.states[i]==='holding'&&time>=(n.end??Infinity)){this.states[i]='done';this.award(this.down.has(n.lane)?'HOLD':'BREAK',n.lane);}
  });
 }
 clearHeld(time:number) { for(const lane of [...this.down])this.release(lane,time); }
}
