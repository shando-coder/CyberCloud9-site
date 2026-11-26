'use strict';
const view=document.querySelector('#view');
const prefix='cyberscot-ready-v1/';
const validCode=/^(DEMO-001|CS-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4})$/;
let code='DEMO-001', state={}, localOK=true, message='';
let activeStep=0,hints=[];
const blank=()=>({choices:[],attempts:0,passed:false});
function records(m){return state[m.id]??=m.steps.map(blank)}
function count(m){return records(m).filter(x=>x.passed).length}
function persist(){
  try{localStorage.setItem(prefix+code,JSON.stringify(state));localOK=true}catch{localOK=false}
}
function readCode(value){
  code=value;state={};message='';
  try{state=JSON.parse(localStorage.getItem(prefix+code)||'{}');if(!state||typeof state!=='object')state={}}catch{localOK=false}
}
function status(){
  const el=document.querySelector('#sync');if(!el)return;
  el.textContent=message||(localOK?'Progress is saved in this browser for '+code+'.':'Browser storage is unavailable. Keep this page open.');
}
function missionCards(){
  const all=[...missions,{id:'inbox',number:2,title:'The Festival Inbox',intro:'Four messages reach the box office. Check what each one says, spot the clues and advise the crew what to trust, verify or report.'}].sort((a,b)=>a.number-b.number);
  return all.map(m=>'<article class="card'+(m.id==='community'?' harbour-card':'')+'"><span class="kicker">Mission '+m.number+'</span><h2>'+m.title+'</h2><p>'+m.intro+'</p>'+(m.steps?'<p>'+count(m)+' of 4 activities complete</p>':'')+'<a class="btn" href="'+(m.steps?'#'+m.id:'../demo/')+'">'+(m.steps&&count(m)?'Resume or review':'Open mission')+'</a></article>').join('');
}
function home(){
  view.innerHTML='<section class="hero"><small>Port Clyde · Clydebeat Festival</small><h1>Cyber Ready missions</h1><p>Help the Clydebeat crew prepare for opening day by spotting risks in festival tickets, messages, accounts and online posts.</p></section><section class="briefing" aria-labelledby="briefing-title"><span class="kicker">Your festival briefing</span><h2 id="briefing-title">Clydebeat needs a cyber-safety check</h2><p class="briefing-lead">Clydebeat is a local music festival based in Port Clyde. It has a number of bands playing, there is a website advertising the event, giving information and tickets can be bought on the website. Attendees receive a QR code for entry. Clydebeat has a number of volunteers to help run the festival, their duties include helping at the entry gates. The festival crew use accounts, contact lists and online posts to keep the event running smoothly.</p><div class="briefing-grid"><article><h3>Your role</h3><p>Your role in this mission is to advise staff at the Clydebeat help desk as they prepare for opening day. You review some situations, identify what might be risky and recommend what staff should do next. The authorised festival staff will then be able to change the accounts and systems.</p></article><article><h3>What you will do</h3><p>Read a crew note, look closely at the fictional example, then decide what is at risk and what safe next step to recommend. Each mission explores a different part of the festival story.</p></article></div><p class="briefing-note"><strong>How to use the missions:</strong> Try the activities, use the worked examples or hints when you need them, and read the feedback to understand why a choice is safe. After the four practice missions, you will get a fresh final challenge to complete with less guidance.</p><p class="briefing-note safety"><strong>Practice only:</strong> Every person, message, account and ticket here is made up. Never enter a real password, share a real ticket QR code, or use anyone’s private details.</p></section><details class="profile"><summary>Practice code · '+code+'</summary><p>Try DEMO-001 or enter your own class practice code. Use the same browser and code to resume. People sharing a browser may see its practice records.</p><form id="join"><label>Practice code <input type="text" id="code" maxlength="17" autocomplete="off" placeholder="CS-XXXX-XXXX-XXXX" required></label> <button>Use code</button><p id="code-msg" role="status"></p></form></details><div class="cards">'+missionCards()+'</div><p id="sync" role="status"></p>';
  document.querySelector('#join').onsubmit=e=>{e.preventDefault();const v=document.querySelector('#code').value.trim().toUpperCase();if(!validCode.test(v)){document.querySelector('#code-msg').textContent='Use DEMO-001 or the practice code supplied by your teacher.';return}readCode(v);home()};status();
}
function ordered(q,si,qi){
  const indexes=q.options.map((_,i)=>i);const offset=(si+qi+1)%indexes.length;
  return indexes.slice(offset).concat(indexes.slice(0,offset));
}
function control(m,s,q,qi,r){
  const values=ordered(q,activeStep,qi);const selected=r.choices[qi];const locked=r.passed?' disabled':'';
  const hint=hints.includes(qi)?'<p class="hint">'+q.hint+'</p>':'';
  if((m.id==='vault'&&activeStep===1)||s.preview)return '<label class="setting"><b>'+q.prompt+'</b><select data-q="'+qi+'"'+locked+'><option value="">Choose…</option>'+values.map(i=>'<option value="'+i+'"'+(selected===i?' selected':'')+'>'+q.options[i]+'</option>').join('')+'</select></label>'+hint;
  return '<fieldset><legend>'+q.prompt+'</legend>'+values.map(i=>'<label class="choice"><input type="radio" name="q'+qi+'" data-q="'+qi+'" value="'+i+'"'+(selected===i?' checked':'')+locked+'>'+q.options[i]+'</label>').join('')+hint+'</fieldset>';
}
function activity(m,focus=false){
  const rs=records(m),s=m.steps[activeStep],r=rs[activeStep],done=count(m)===4;
  const harbour=m.id==='community';
  const overview=harbour
    ? '<section class="harbour-hero"><div><span class="mission-sign">CYBER READY / MISSION 1</span><h1>Port Clyde<br>Goes Online</h1><p>'+m.intro+'</p></div></section>'
    : '<section class="hero"><small>Mission '+m.number+' · Lessons '+m.lessons+'</small><h1>'+m.title+'</h1><p>'+m.intro+'</p><progress max="4" value="'+count(m)+'"></progress> '+count(m)+' / 4 activities</section>';
  view.innerHTML='<a href="#home">All Cyber Ready missions</a>'+overview+'<nav class="activity-nav" aria-label="Mission '+m.number+' activities">'+m.steps.map((step,i)=>'<button type="button" data-step="'+i+'"'+(i===activeStep?' aria-current="step"':'')+'><span>'+(rs[i].passed?'✓':i+1)+'</span>'+step.title+'</button>').join('')+'</nav><p class="nav-help">Choose any activity to go back and review it. Your saved decisions stay in place.</p><section class="activity'+(harbour?' shift-work':'')+'" tabindex="-1"><div class="kicker">Lesson '+m.lessons.split('–')[activeStep<2?0:1]+' · Activity '+(activeStep+1)+' of 4 · Planned '+s.time+' min</div><h2>'+s.title+'</h2><p>'+s.brief+'</p>'+teachingPanel(m.id,activeStep)+(harbour?shiftEvidence(activeStep):missionExhibit(m.id,activeStep,s,r))+s.questions.map((q,i)=>control(m,s,q,i,r)).join('')+'<p role="status" class="'+(r.passed?'result':'hint')+'">'+(r.passed?(harbour?'<b>Shift report</b><br>'+shiftNotes[activeStep]:'<b>Why it works</b><br>'+lessonTakeaway[m.id][activeStep]):hints.length?'Check the hints beside your choices and try again.':'')+'</p><div class="bar">'+(activeStep?'<button class="subtle" id="back">Previous activity</button>':'')+(r.passed?(activeStep<3?'<button id="next">Continue</button>':''):'<button id="check">Check my decisions</button>')+(code==='DEMO-001'?'<button type="button" class="subtle" id="reset">Reset demo progress</button>':'')+'</div>'+(code==='DEMO-001'?'<p class="nav-help">Reset is for the demo only. Pupils can use the activity buttons to go back without resetting.</p>':'')+'</section>'+(done?'<section class="card"><span class="kicker">Mission complete</span><h2>'+m.badge+'</h2><p>You completed all four activities. Your marked decisions are available below.</p><details><summary>Review mission record</summary>'+rs.map((v,i)=>'<h3>'+m.steps[i].title+'</h3><p>Checks: '+v.attempts+'</p><ul>'+m.steps[i].questions.map((q,j)=>'<li>'+q.prompt+' — '+q.options[v.choices[j]]+'</li>').join('')+'</ul>').join('')+'</details><a href="#home">Choose another mission</a></section>':'')+'<p id="sync" role="status"></p>';
  view.querySelectorAll('[data-step]').forEach(button=>button.onclick=()=>{activeStep=Number(button.dataset.step);hints=[];activity(m,true)});
  view.onchange=e=>{if(e.target.dataset.q===undefined||r.passed)return;const idx=Number(e.target.dataset.q);r.choices[idx]=e.target.value===''?null:Number(e.target.value);persist();status();if(activeStep===1&&!harbour)view.querySelector('.exhibit-preview').innerHTML=m.id==='vault'?accountPreview(s,r):socialPreview(s,r)};
  const check=document.querySelector('#check');if(check)check.onclick=()=>{r.attempts++;hints=s.questions.flatMap((q,i)=>r.choices[i]===q.answer?[]:[i]);r.passed=!hints.length;persist();activity(m);if(r.passed&&count(m)===4)saveOnline(m)};
  const reset=document.querySelector('#reset');if(reset)reset.onclick=()=>{if(!window.confirm('Are you sure you want to reset the DEMO-001 demo progress in this browser? This is only for the demo. Pupils can use the activity buttons to go back without resetting.'))return;state={};for(const item of missions){try{localStorage.removeItem(prefix+'record/'+code+'/'+item.id)}catch{}}activeStep=0;hints=[];message='DEMO-001 demo progress reset in this browser.';persist();activity(m,true)};
  for(const [id,delta] of [['back',-1],['next',1]]){const b=document.getElementById(id);if(b)b.onclick=()=>{activeStep+=delta;hints=[];activity(m,true)}}
  status();if(focus)document.querySelector('.activity').focus();
}
async function saveOnline(m){
  if(location.protocol==='file:'||!m)return;
  const currentCode=code,rs=records(m),payload={version:1,learner:code,mission:m.id,steps:rs.map(r=>({choices:r.choices,attempts:r.attempts}))};
  let key;try{const k=prefix+'record/'+code+'/'+m.id;key=localStorage.getItem(k);if(!key){key=Array.from(crypto.getRandomValues(new Uint8Array(24)),n=>n.toString(16).padStart(2,'0')).join('');localStorage.setItem(k,key)}}catch{return}
  try{const reply=await fetch('./api/record',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify(payload)});if(!reply.ok||!(await reply.json()).saved)throw Error();if(code===currentCode && location.hash==='#'+m.id){
    message='Completed mission saved on the site for '+code+'.';status();
    const link=document.createElement('a');link.href='#record='+key;link.textContent='Open saved record';
    document.querySelector('#sync').append(' ',link);return
  }}
  catch{if(code===currentCode)message=localOK?'Your marked record is saved in this browser. Online saving is unavailable here. Reopen the mission to retry.':'Online and browser saving are unavailable. Keep this page open.'}
  if(code===currentCode)status();
}
async function openRecord(key){
  view.innerHTML='<h1>Saved mission record</h1><p role="status">Opening record…</p>';
  try{
    const response=await fetch('./api/record',{headers:{Authorization:'Bearer '+key},cache:'no-store'});
    if(!response.ok)throw Error();
    const saved=await response.json(),m=missions.find(x=>x.id===saved.mission);
    if(location.hash!=='#record='+key)return;
    if(!m||!validCode.test(saved.learner))throw Error();
    view.innerHTML='<a href="#home">All Cyber Ready missions</a><section class="hero"><small>'+m.badge+'</small><h1>'+m.title+'</h1><p>Completed · '+saved.learner+'</p></section><section class="activity"><h2>Marked decisions</h2>'+m.steps.map((s,i)=>'<h3>'+s.title+'</h3><p>Checks: '+Number(saved.steps[i].attempts)+'</p><ul>'+s.questions.map((q,j)=>'<li>'+q.prompt+' — '+q.options[saved.steps[i].choices[j]]+'</li>').join('')+'</ul>').join('')+'<p>Anyone with this record link can view it.</p></section>';
  }catch{if(location.hash==='#record='+key)view.innerHTML='<a href="#home">All missions</a><p>This record could not be opened. Check the link and connection.</p>'}
}
function route(){
  const key=/^#record=([a-f0-9]{48})$/.exec(location.hash);
  if(key){openRecord(key[1]);return}
  const m=missions.find(x=>x.id===location.hash.slice(1));hints=[];message='';view.onchange=null;
  if(!m){home();return}activeStep=records(m).findIndex(x=>!x.passed);if(activeStep<0)activeStep=3;activity(m);if(count(m)===4)saveOnline(m);
}
readCode('DEMO-001');window.addEventListener('hashchange',route);route();
