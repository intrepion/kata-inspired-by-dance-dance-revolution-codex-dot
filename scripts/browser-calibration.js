// Chrome CDP developer test: dispatches normal Space taps, skips 2 and 4,
// and tries two taps on every other click. UI count must stay at 10 unique taps.
new Promise(resolve => {
 const sent = new Set();
 const timer = setInterval(() => {
  const text = document.querySelector('#overlay-text').textContent;
  const m = text.match(/^(\d+) \/ 12/);
  if (m) {
   const i = Number(m[1]);
   if (i > 0 && !sent.has(i)) {
    sent.add(i);
    if (i !== 2 && i !== 4) for (let j = 0; j < 2; j++) {
     window.dispatchEvent(new KeyboardEvent('keydown', {code:'Space',bubbles:true}));
     window.dispatchEvent(new KeyboardEvent('keyup', {code:'Space',bubbles:true}));
    }
   }
  }
  if (document.querySelector('#status').textContent === 'MENU') {
   clearInterval(timer);
   resolve({title:document.querySelector('#overlay-title').textContent,text:document.querySelector('#overlay-text').textContent,offset:document.querySelector('#offset-value').textContent,lastCount:text});
  }
 }, 4);
});
