import type {Lane,Note} from './engine';
export const levels=['Local','Express','Night Shift'] as const;
export const routes=[
 {id:'copper',name:'Copper Current',bpm:108,key:45,tag:'Warm acid / 108 BPM',color:'#f6ac73',motif:[0,7,10,7,3,7,12,10]},
 {id:'glass',name:'Glass Junction',bpm:124,key:50,tag:'Glass house / 124 BPM',color:'#8ee5c2',motif:[0,3,7,10,12,10,7,3]},
 {id:'after',name:'Afterhours Freight',bpm:140,key:42,tag:'Night break / 140 BPM',color:'#b9b0ff',motif:[0,0,7,10,3,12,10,7]},
];
export type Route=typeof routes[number];
export function chart(route:Route,level:number):Note[] {
 const notes:Note[]=[]; const beat=60/route.bpm;
 const add=(b:number,lane:Lane,end?:number)=>notes.push({id:notes.length,lane,time:b*beat,end:end===undefined?undefined:end*beat});
 for(let b=2;b<32;b++) {
  const lane=((b+routes.indexOf(route)*2)%4) as Lane;
  const hold=level>0&&b%8===2;
  add(b,lane,hold?b+1.5:undefined);
  if(level>0&&b%8===6)add(b,((lane+2)%4) as Lane);
  if(level===1&&b%8===4)add(b+.5,((lane+1)%4) as Lane);
  if(level===2&&b%4!==2)add(b+.5,((lane+2)%4) as Lane);
 }
 return notes.sort((a,b)=>a.time-b.time).map((n,id)=>({...n,id}));
}
