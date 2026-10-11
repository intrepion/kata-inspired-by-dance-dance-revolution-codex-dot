import type {Route} from './charts';
export class Audio {
 context:AudioContext|null=null; private source:AudioBufferSourceNode|null=null; private gain:GainNode|null=null;
 private clicks=new Set<OscillatorNode>();
 private buffers=new Map<string,AudioBuffer>(); epoch=0; offset=0;
 async activate() {this.context??=new AudioContext({latencyHint:'interactive'});await this.context.resume();if(this.context.state!=='running')throw Error('Audio is unavailable. Try Start again.');}
 now(){return this.context?.currentTime??0;}
 volume(v:number){if(this.gain&&this.context)this.gain.gain.setTargetAtTime(v,this.now(),.02);}
 stop(){for(const o of this.clicks){try{o.stop();}catch{/* already ended */}o.disconnect();}this.clicks.clear();if(this.source){try{this.source.stop();}catch{/* already ended */}this.source.disconnect();this.source=null;}this.gain?.disconnect();this.gain=null;}
 play(route:Route,offset:number,volume:number) {
  if(!this.context)throw Error('Activate audio first');this.stop();
  const buffer=this.buffers.get(route.id)??this.compose(route);this.buffers.set(route.id,buffer);
  this.gain=this.context.createGain();this.gain.gain.value=volume;this.gain.connect(this.context.destination);
  this.source=this.context.createBufferSource();this.source.buffer=buffer;this.source.connect(this.gain);
  this.epoch=this.now()+.08-offset;this.offset=offset;
  // Negative offsets are the silent countdown; positive offsets resume in-song.
  this.source.start(this.now()+.08+Math.max(0,-offset),Math.max(0,offset));
 }
 click(at:number) {if(!this.context)return;const o=this.context.createOscillator(),g=this.context.createGain();o.frequency.value=1000;o.connect(g);g.connect(this.context.destination);g.gain.setValueAtTime(.15,at);g.gain.exponentialRampToValueAtTime(.001,at+.07);this.clicks.add(o);o.onended=()=>{this.clicks.delete(o);o.disconnect();g.disconnect();};o.start(at);o.stop(at+.08);}
 private compose(route:Route) {
  const c=this.context!,sr=c.sampleRate,beat=60/route.bpm,duration=34*beat;
  const buffer=c.createBuffer(2,Math.ceil(duration*sr),sr);const left=buffer.getChannelData(0),right=buffer.getChannelData(1);
  const tone=(at:number,len:number,freq:number,amp:number,kind:'bass'|'bell'|'kick'|'noise',pan=0)=>{
   const start=Math.floor(at*sr),count=Math.floor(len*sr);
   for(let i=0;i<count&&start+i<left.length;i++) {
    const t=i/sr,env=Math.exp(-t/(kind==='bell'?.14:kind==='bass'?.10:.045))*(Math.min(1,t/.003));
    let wave=0;
    if(kind==='kick')wave=Math.sin(2*Math.PI*(48*t+5*(1-Math.exp(-t*25))));
    else if(kind==='noise')wave=Math.sin(i*78.233+start*12.9898)*Math.sin(i*9.17);
    else wave=Math.sin(2*Math.PI*freq*t)+(kind==='bell'?.35*Math.sin(2*Math.PI*freq*2.01*t):.3*Math.sin(2*Math.PI*freq*2*t));
    const v=wave*env*amp;left[start+i]+=v*(1-pan*.25);right[start+i]+=v*(1+pan*.25);
   }
  };
  const hz=(m:number)=>440*2**((m-69)/12);
  for(let b=0;b<32;b++) {
   tone(b*beat,.3,50,.48,'kick');
   if(b%2===1)tone(b*beat,.15,0,.22,'noise');
   for(let s=0;s<2;s++)tone((b+s*.5)*beat,.06,0,.065,'noise',s?1:-1);
   tone(b*beat,beat*.8,hz(route.key+route.motif[Math.floor(b/4)%8]),.22,'bass');
   for(let s=0;s<2;s++)tone((b+s*.5)*beat,.45,hz(route.key+24+route.motif[(b*2+s)%8]),.10,'bell',s?1:-1);
  }
  for(let i=0;i<left.length;i++){left[i]=Math.tanh(left[i])*.8;right[i]=Math.tanh(right[i])*.8;}
  return buffer;
 }
}
