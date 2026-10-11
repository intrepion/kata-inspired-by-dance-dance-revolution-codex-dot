// Developer fault injection for actual UI lifecycle tests, reset by reload.
// Delay resume to reproduce old async completions; never write run/score state.
(() => {
 window.__qaOriginalResume=AudioContext.prototype.resume;
 window.__qaPending=[];
 AudioContext.prototype.resume=function(){window.__qaContext=this;return new Promise((resolve,reject)=>{window.__qaPending.push(()=>window.__qaOriginalResume.call(this).then(resolve,reject));});};
 return 'Audio activation delay enabled';
})()
