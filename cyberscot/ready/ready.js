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
  const all=[...missions,{id:'inbox',number:2,title:'The Festival Inbox',intro:'Inspect four festival messages and decide what to trust.'}].sort((a,b)=>a.number-b.number);
  return all.map(m=>'<article class="card'+(m.id==='community'?' harbour-card':'')+'"><span class="kicker">Mission '+m.number+'</span><h2>'+m.title+'</h2><p>'+m.intro+'</p>'+(m.steps?'<p>'+count(m)+' of 4 activities complete</p>':'')+'<a class="btn" href="'+(m.steps?'#'+m.id:'../demo/')+'">'+(m.steps&&count(m)?'Resume or review':'Open mission')+'</a></article>').join('');
}
function home(){
  view.innerHTML='<section class="hero"><small>Port Clyde · Clydebeat Festival</small><h1>Cyber Ready missions</h1><p>Join the festival crew. Protect a booking, secure an account and decide what is safe to share.</p></section><section class="profile"><h2>Teaching resources</h2><p>Follow the 15-period plan from induction through the four missions to the final practical and feedback.</p><div class="bar"><a href="../#missions/ready">Lesson plan and teaching notes</a><a href="../#design/ready">Final practical and marking guidance</a></div></section><details class="profile"><summary>Practice code · '+code+'</summary><p>Try DEMO-001 or enter your own class practice code. Use the same browser and code to resume. People sharing a browser may see its practice records.</p><form id="join"><label>Practice code <input type="text" id="code" maxlength="17" autocomplete="off" placeholder="CS-XXXX-XXXX-XXXX" required></label> <button>Use code</button><p id="code-msg" role="status"></p></form></details><div class="cards">'+missionCards()+'</div><p id="sync" role="status"></p>';
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
function preview(s,r){return s.questions.map((q,i)=>q.options[r.choices[i]]||'—').join(' · ')}
function activity(m,focus=false){
  const rs=records(m),s=m.steps[activeStep],r=rs[activeStep],done=count(m)===4;
  const harbour=m.id==='community';
  const overview=harbour
    ? '<section class="harbour-hero"><div><span class="mission-sign">CYBER READY / MISSION 1</span><h1>Port Clyde<br>Goes Online</h1><p>You’re on the Clydebeat help desk. Four jobs are waiting before the gates open. Can you help the crew protect their visitors?</p></div></section><ol class="shift-route" aria-label="Help-desk shift">'+harbourStops.map((name,i)=>'<li '+(i===activeStep?'aria-current="step"':'')+'><span aria-hidden="true">'+(rs[i].passed?'✓':i+1)+'</span>'+name+'</li>').join('')+'</ol>'
    : '<section class="hero"><small>Mission '+m.number+' · Lessons '+m.lessons+'</small><h1>'+m.title+'</h1><p>'+m.intro+'</p><progress max="4" value="'+count(m)+'"></progress> '+count(m)+' / 4 activities</section>';
  view.innerHTML='<a href="#home">All Cyber Ready missions</a>'+overview+'<section class="activity'+(harbour?' shift-work':'')+'" tabindex="-1"><div class="kicker">Lesson '+m.lessons.split('–')[activeStep<2?0:1]+' · Activity '+(activeStep+1)+' of 4 · Planned '+s.time+' min</div><h2>'+s.title+'</h2><p>'+s.brief+'</p>'+teachingPanel(m.id,activeStep)+(harbour?shiftEvidence(activeStep):'<aside class="source"><h3>'+s.source+'</h3><p>'+s.evidence+'</p></aside>')+s.questions.map((q,i)=>control(m,s,q,i,r)).join('')+(s.preview?'<aside class="source"><h3>Your draft preview</h3><p id="draft">'+preview(s,r)+'</p></aside>':'')+'<p role="status" class="'+(r.passed?'result':'hint')+'">'+(r.passed?(harbour?'<b>Shift report</b><br>'+shiftNotes[activeStep]:'<b>Why it works</b><br>'+lessonTakeaway[m.id][activeStep]):hints.length?'Check the hints beside your choices and try again.':'')+'</p><div class="bar">'+(activeStep?'<button class="subtle" id="back">Previous activity</button>':'')+(r.passed?(activeStep<3?'<button id="next">Continue</button>':''):'<button id="check">Check my decisions</button>')+'</div></section>'+(done?'<section class="card"><span class="kicker">Mission complete</span><h2>'+m.badge+'</h2><p>You completed all four activities. Your marked decisions are available below.</p><details><summary>Review mission record</summary>'+rs.map((v,i)=>'<h3>'+m.steps[i].title+'</h3><p>Checks: '+v.attempts+'</p><ul>'+m.steps[i].questions.map((q,j)=>'<li>'+q.prompt+' — '+q.options[v.choices[j]]+'</li>').join('')+'</ul>').join('')+'</details><a href="#home">Choose another mission</a></section>':'')+'<p id="sync" role="status"></p>';
  const audience=document.getElementById('audience-demo');
  if(audience)audience.onchange=()=>{document.getElementById('audience-effect').textContent=audience.value==='crew'?'Only named crew members can open the sheet. Forwarding the link gives a visitor no access.':'A visitor who receives a forwarded link can open the sheet.'};
  view.onchange=e=>{if(e.target.dataset.q===undefined||r.passed)return;const idx=Number(e.target.dataset.q);r.choices[idx]=e.target.value===''?null:Number(e.target.value);persist();status();if(s.preview)document.querySelector('#draft').textContent=preview(s,r)};
  const check=document.querySelector('#check');if(check)check.onclick=()=>{r.attempts++;hints=s.questions.flatMap((q,i)=>r.choices[i]===q.answer?[]:[i]);r.passed=!hints.length;persist();activity(m);if(r.passed&&count(m)===4)saveOnline(m)};
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
