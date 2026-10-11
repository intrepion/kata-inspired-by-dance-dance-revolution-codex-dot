export class Calibration {
 readonly used=new Set<number>(); readonly samples:number[]=[];
 constructor(readonly start:number,readonly count=12,readonly interval=.6){}
 tap(time:number) {
  const index=Math.round((time-this.start)/this.interval);
  if(index<0||index>=this.count||this.used.has(index))return false;
  const delta=time-(this.start+index*this.interval);
  if(Math.abs(delta)>.25)return false;
  this.used.add(index);this.samples.push(delta*1000);return true;
 }
 result() {if(this.samples.length<6)return null;const s=[...this.samples].sort((a,b)=>a-b);const mid=Math.floor(s.length/2);return Math.round(Math.max(-200,Math.min(200,s.length%2?s[mid]:(s[mid-1]+s[mid])/2)));}
}
export class Generation { private value=0; next(){return ++this.value;} valid(token:number){return token===this.value;} }
