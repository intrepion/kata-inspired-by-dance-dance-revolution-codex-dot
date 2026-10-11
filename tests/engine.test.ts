import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine.js';
test('a head 45 ms late earns perfect and repeated input cannot score twice', () => {
 const e = new Engine([{id:0,lane:0,time:1}]);
 e.press(0,1.045); e.press(0,1.045);
 assert.equal(e.score,1000); assert.equal(e.combo,1);
});

test('judgment boundaries and late misses are explicit',()=>{
 for(const [delta,points]of [[.045,1000],[.046,750],[.09,750],[.091,400],[.14,400]] as const){const e=new Engine([{id:0,lane:0,time:1}]);e.press(0,1+delta);assert.equal(e.score,points);}
 const e=new Engine([{id:0,lane:0,time:1}]);e.update(1.141);assert.equal(e.counts.MISS,1);assert.equal(e.energy,92);
});
test('ghost input and same-lane repeats do not steal later notes',()=>{const e=new Engine([{id:0,lane:0,time:1},{id:1,lane:0,time:2}]);e.press(1,1);assert.equal(e.score,0);e.press(0,1);e.press(0,2);assert.equal(e.score,1000);e.release(0,2);e.press(0,2);assert.equal(e.score,2000);});
test('chord judges both lanes separately and reaches combo two',()=>{const e=new Engine([{id:0,lane:0,time:1},{id:1,lane:3,time:1}]);e.press(0,1);e.press(3,1.08);assert.equal(e.score,1750);assert.equal(e.combo,2);});
test('hold success, early release, and missed head resolve exactly once',()=>{
 const note={id:0,lane:0 as const,time:1,end:2};const success=new Engine([note]);success.press(0,1);success.release(0,1.91);success.update(3);assert.equal(success.score,2000);assert.equal(success.counts.HOLD,1);
 const broken=new Engine([note]);broken.press(0,1);broken.release(0,1.8);broken.update(3);assert.equal(broken.score,1000);assert.equal(broken.counts.BREAK,1);assert.equal(broken.combo,0);
 const missed=new Engine([note]);missed.update(3);assert.equal(missed.score,0);assert.equal(missed.counts.MISS,1);assert.equal(missed.counts.BREAK,1);
});
test('auto-completed tails and pause clearing cannot double-score',()=>{const e=new Engine([{id:0,lane:2,time:1,end:2}]);e.press(2,1);e.update(2);e.release(2,2.1);assert.equal(e.score,2000);assert.equal(e.maximum,2000);assert.equal(e.grade,'S');const p=new Engine([{id:0,lane:2,time:1,end:2}]);p.press(2,1);p.clearHeld(1.4);assert.equal(p.counts.BREAK,1);assert.equal(p.down.size,0);});
test('energy failure freezes scoring and grade',()=>{const e=new Engine(Array.from({length:20},(_,id)=>({id,lane:0 as const,time:id})));e.update(30);const score=e.score;e.press(0,30);assert.equal(e.failed,true);assert.equal(e.grade,'F');assert.equal(e.score,score);});
