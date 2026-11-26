// All exhibits are fictional. The controls below each exhibit hold the learner's marked answers.
const ticketImage = '<div class="sample-pass"><div><small>CLYDEBEAT · DAY PASS</small><b>Harbour Gate</b><span>One entry per ticket</span></div><img width="76" height="76" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0AQAAAAB84SuKAAAAt0lEQVR4nOWUuw3DQAxDH4P01AbefyxvoJuAKZwin8ZWmbARBOiB0gE8hVetG+/6g15SLZWkGvFOoNvJwP8OyOCjTO8pXZv/7E3N+TRtSM/4JVFHGb1fgFXOdH+xREBD3kVvUK66zpPQBjrupAe8nbYT4+v8DdhVNLX3yfkP/yShcWew/x0Etr1Q5vnTyjbJzzN/+wb7Sb8v/tDa6DHvRnT1iA+lEGrgryDwogFf//+f+Ts9/2v9AxlZToEMLsOqAAAAAElFTkSuQmCC" alt="Entry QR code on a practice ticket"></div>';
const festivalPhoto = '<figure class="post-photo"><img src="../festival-photo.webp" alt="Friends standing together near an outdoor festival stage"><figcaption>Festival photo attachment</figcaption></figure>';

function reveal(label, body) {
  return '<details class="exhibit-detail"><summary>'+label+'</summary><div>'+body+'</div></details>';
}
function screen(app, title, body) {
  return '<section class="mock-device" aria-label="'+app+'"><div class="device-bar"><span>'+app+'</span><i aria-hidden="true"></i></div><div class="device-body"><h3>'+title+'</h3>'+body+'</div></section>';
}
function accountRows(labels, values) {
  return '<dl class="account-rows">'+labels.map((label,i)=>'<div><dt>'+label+'</dt><dd>'+values[i]+'</dd></div>').join('')+'</dl>';
}
function bubble(name, message) {
  return '<div class="mock-bubble"><b>'+name+'</b><p>'+message+'</p></div>';
}
function accountPreview(step, record) {
  const defaults=['Reused password','Off','Public profile'];
  return screen('Clydebeat staff account','Niamh’s security settings',accountRows(['Password','Second sign-in check','Recovery email'],step.questions.map((q,i)=>q.options[record.choices[i]]??defaults[i])));
}
const rowanPhoto = '<img class="rowan-photo" width="920" height="920" src="rowan-at-home.webp" alt="Rowan smiles at home, holding up a phone. Her Clydebeat day pass shows an entry QR code and the mobile number 07700 900164.">';
function socialPreview(step, record) {
  const [caption,attachment,audience]=record.choices;
  const media=attachment===0?rowanPhoto:attachment===1?festivalPhoto:'';
  return screen('Instagram · Draft','Rowan’s post','<small>'+ (step.questions[2].options[audience]??'Choose an audience')+'</small><p>'+(step.questions[0].options[caption]??'Choose a caption below.')+'</p>'+media+'<small>'+(step.questions[1].options[attachment]??'Choose an attachment below.')+'</small>');
}
function missionExhibit(id, index, step, record) {
  let exhibit;
  if (id==='vault') {
    const screens=[
      ()=>screen('Mail · Security notice','Notice from XBLOCKS Games Inc','<small>To Amina</small><p>Some players’ passwords have been exposed. Please review the accounts where you use your games password.</p>'+reveal('Compare Amina’s two accounts',accountRows(['Games account','Clydebeat tickets'],['Uses Amina’s games passphrase','Uses the same passphrase']))),
      ()=>accountPreview(step,record),
      ()=>screen('Messages · Amina','A message from a familiar name',bubble('Festival helper','Amina, your ticket needs fixed. Read me the six digits that just appeared.')+reveal('Read the sign-in notification',bubble('Clydebeat accounts','A sign-in was requested. Your practice code is 438 205. Only use it for a sign-in you started.'))+'<p><b>Amina</b> · “I haven’t tried to sign in today.”</p>'),
      ()=>screen('Clydebeat staff account','Volunteer coordinator',accountRows(['Password','Two-step verification','Sign-in alerts'],['Unique to this account','On','On'])+reveal('Inspect recovery email',accountRows(['Visible to','Mailbox owner'],['Only the account owner','Previous volunteer coordinator'])))
    ];
    exhibit=screens[index]();
  } else {
    const screens=[
      ()=>screen('Instagram · Unpublished draft','Rowan’s post','<div class="insta-author"><b aria-hidden="true">R</b><strong>rowan</strong></div>'+rowanPhoto+'<p><strong>rowan</strong> Festival tonight! Can’t wait 🎶 I’m home alone getting ready if anyone wants to pop down. 14 Shore Road!</p>'+reveal('Look closer at the phone','<p>The day pass on Rowan’s screen shows her entry QR code. Underneath it you can read her mobile number: 07700 900164.</p>')),
      ()=>socialPreview(step,record),
      ()=>screen('Rowan’s phone','After the show',reveal('Direct message · Game friend',bubble('Game friend','Share your live location so I can find you. Come on, just switch it on!'))+reveal('Group chat · Festival friends',bubble('Festival friends','Someone posted a hurtful edit of Euan’s photo. Another person is asking for a copy.'))+reveal('Prize message · Entry form','<b>Win a Clydebeat prize!</b>'+accountRows(['Date of birth','Home address'],['Required','Required'])+'<p>No details about the draw are shown.</p>')),
      ()=>screen('Festival friends · Private group','Isla’s draft','<p>Collect my spare pass!</p>'+reveal('Inspect the attached photo',festivalPhoto+ticketImage+'<p>The ticket code and a friend’s face are both visible in Isla’s photo.</p>')+bubble('Friend','Want me to forward this to my other groups?'))
    ];
    exhibit=screens[index]();
  }
  return '<aside class="desk-evidence"><h3>'+step.source+'</h3><p>'+step.evidence+'</p><div class="exhibit-preview"'+(index===1?' aria-live="polite"':'')+'>'+exhibit+'</div></aside>';
}
