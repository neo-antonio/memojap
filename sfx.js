// Duolingo-style answer sounds, synthesised with Web Audio (no audio files, works offline).
// Usage: SFX.ok() on a correct answer, SFX.bad() on a wrong one. SFX.on = true/false to mute (saved).
const SFX=(()=>{let ctx=null,on=true;try{on=localStorage.getItem('mj-sound')!=='0'}catch(e){}
const ac=()=>{try{if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A()}if(ctx.state==='suspended')ctx.resume();return ctx}catch(e){return null}};
// one soft bell/pluck note: fundamental + octave overtone, fast attack, exponential decay
const note=(c,f,t,d,type,vol,lp)=>{const o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),g2=c.createGain(),F=c.createBiquadFilter();
o.type=type;o2.type='sine';o.frequency.value=f;o2.frequency.value=f*2;F.type='lowpass';F.frequency.value=lp;
g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+d);g2.gain.value=0.25;
o.connect(g);o2.connect(g2);g2.connect(g);g.connect(F);F.connect(c.destination);o.start(t);o2.start(t);o.stop(t+d+0.05);o2.stop(t+d+0.05)};
return{get on(){return on},set on(v){on=!!v;try{localStorage.setItem('mj-sound',on?'1':'0')}catch(e){}},
// correct: bright rising "ba-ding" (G5 -> C6 -> E6)
ok(){if(!on)return;const c=ac();if(!c)return;const t=c.currentTime+0.01;note(c,784,t,0.28,'triangle',0.22,6000);note(c,1046.5,t+0.09,0.3,'triangle',0.22,6000);note(c,1318.5,t+0.18,0.55,'triangle',0.24,7000)},
// wrong: soft low descending "bonk-bonk"
bad(){if(!on)return;const c=ac();if(!c)return;const t=c.currentTime+0.01;note(c,277,t,0.22,'square',0.12,900);note(c,208,t+0.16,0.42,'square',0.12,800)}}})();
