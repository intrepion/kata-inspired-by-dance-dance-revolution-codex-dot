// Run in Mac Chrome's tab via cua_repl CDP Runtime.evaluate after clicking Start.
// Only dispatches normal keyboard events; never mutates the engine, clock or score.
(async ({bpm,route,level,skip=-1,breakHold=false,delay=0}) => {
 const codes=['ArrowLeft','ArrowDown','ArrowUp','ArrowRight'],beat=60/bpm,events=[];
 const add=(b,l,end)=>{events.push({t:b*beat+delay,l,down:true,skip:b===skip});events.push({t:(end??b)*beat+(end===undefined?.04+delay:.02),l,down:false,skip:b===skip});};
 for(let b=2;b<32;b++) {const lane=(b+route*2)%4,hold=level>0&&b%8===2;add(b,lane,hold?(breakHold&&b===2?b+.3:b+1.5):undefined);if(level>0&&b%8===6)add(b,(lane+2)%4);if(level===1&&b%8===4)add(b+.5,(lane+1)%4);if(level===2&&b%4!==2)add(b+.5,(lane+2)%4);}
 events.sort((a,b)=>a.t-b.t);let i=0,signals=new Set();
 return await new Promise(resolve=>{const timer=setInterval(()=>{const status=document.querySelector('#status').textContent,t=Number(document.querySelector('#field').dataset.songTime);if(status==='SIGNAL LIVE'){while(i<events.length&&t>=events[i].t){const e=events[i++];if(!e.skip)window.dispatchEvent(new KeyboardEvent(e.down?'keydown':'keyup',{code:codes[e.l],key:codes[e.l],bubbles:true}));}const s=document.querySelector('#signal').textContent;if(s)signals.add(s);}if(status==='RESULT'||status==='MENU'){clearInterval(timer);resolve({title:document.querySelector('#overlay-title').textContent,result:document.querySelector('#overlay-text').textContent,signals:[...signals],events:i});}},4);});
})
