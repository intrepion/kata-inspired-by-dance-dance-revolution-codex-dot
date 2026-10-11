export interface RecordScore {score:number;grade:string;combo:number;accuracy:number}
export interface Save {version:1;volume:number;offset:number;lead:number;reduced:boolean;records:Record<string,RecordScore>}
export const defaults=():Save=>({version:1,volume:.65,offset:0,lead:1.8,reduced:false,records:{}});
function bounded(x:unknown,min:number,max:number,fallback:number) {return typeof x==='number'&&Number.isFinite(x)?Math.max(min,Math.min(max,x)):fallback;}
export function normalize(raw:unknown):Save {
 const d=defaults();if(!raw||typeof raw!=='object')return d;
 const r=raw as Record<string,unknown>;if(r.version!==1)return d;
 d.volume=bounded(r.volume,0,1,d.volume);d.offset=bounded(r.offset,-200,200,0);d.lead=bounded(r.lead,1,3,1.8);d.reduced=r.reduced===true;
 if(r.records&&typeof r.records==='object')for(const [key,value]of Object.entries(r.records)){
  if(!/^(copper|glass|after)-[012]$/.test(key)||!value||typeof value!=='object')continue;
  const v=value as Record<string,unknown>;
  if(typeof v.score!=='number'||!Number.isFinite(v.score)||v.score<0||v.score>200000||typeof v.grade!=='string'||!['S','A','B','C','D','F'].includes(v.grade)||typeof v.combo!=='number'||v.combo<0||v.combo>200||!Number.isFinite(v.combo)||typeof v.accuracy!=='number'||v.accuracy<0||v.accuracy>1||!Number.isFinite(v.accuracy))continue;
  d.records[key]={score:Math.floor(v.score),grade:v.grade,combo:Math.floor(v.combo),accuracy:v.accuracy};
 }return d;
}
export interface StorageLike {getItem(key:string):string|null;setItem(key:string,value:string):void}
export function readSave(storage:StorageLike):Save {try{return normalize(JSON.parse(storage.getItem('switchyard-v1')??'null'));}catch{return defaults();}}
export function writeSave(storage:StorageLike,save:Save) {try{storage.setItem('switchyard-v1',JSON.stringify(save));return true;}catch{return false;}}
