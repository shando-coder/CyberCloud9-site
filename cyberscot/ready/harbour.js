// Mission 1 uses the same stored decisions as the original help-desk activities.
const harbourStops=['Help desk','Crew checks','Crew chat','Library desk'];
const shiftNotes=[
  'Isla keeps control of her tickets. The register stays with the school office. Visitors can still rely on the library booking service. These are three different things worth protecting: access, private information and a working service.',
  'The organiser can now take three useful actions: give volunteers their own sign-ins, restrict the contact sheet and arrange the tablet update. Each action addresses a different weakness.',
  'Mairi’s booking stays as she left it. The supervising adult can secure the session without anyone making a test change. A friend’s suggestion cannot give you permission to use someone else’s account.',
  'The librarian closes the open session before the next visitor uses the desk. You helped the visitor without taking a photo of their private details.'
];
function handoverCard(label,clue,inside){
  return '<details class="handover"><summary>'+label+'<small>'+clue+'</small></summary><p>'+inside+'</p></details>';
}
function shiftEvidence(index){
  if(index===0)return '<aside class="desk-evidence"><h3>Morning handover</h3><p>Open a card to hear what each person needs.</p><div class="handover-grid">'+
    handoverCard('Isla’s ticket','Ticket desk','“My two tickets are in my account. If someone changes the booking, we could be turned away at the gate.”')+
    handoverCard('Class register','School office','“We keep pupil names beside family contact numbers so we can reach the right person. Only the school office needs the register.”')+
    handoverCard('Quiet-space booking','Library','“Visitors use our website to reserve a quiet space. Even if the records are private, the service needs to work when people need it.”')+'</div></aside>';
  if(index===1)return '<aside class="desk-evidence"><h3>Three notes from the crew</h3><div class="crew-notes"><p><b>Booking desk</b> Three volunteers use one account. The activity log shows “crew” beside a changed booking.</p><p><b>Contact sheet</b> The volunteer sheet pairs names with mobile numbers. Its link currently opens for anyone.</p><p><b>Library tablet</b> An update fixes a known fault. The tablet still shows “Update pending”.</p></div><details class="mini-demo"><summary>Try the contact sheet’s sharing setting</summary><p>You are previewing the organiser’s settings. Select an audience to see who would have access.</p><label>Who can open the sheet? <select id="audience-demo"><option value="any">Anyone with the link</option><option value="crew">Named crew members</option></select></label><p id="audience-effect" aria-live="polite">A visitor who receives a forwarded link can open the sheet.</p></details></aside>';
  if(index===2)return '<aside class="desk-evidence"><h3>Crew chat</h3><div class="chat-bubble"><b>Euan · to Isla</b><p>Mairi left her ticket account open. Can you try changing her booking to see if the account is safe? We can change it back.</p></div><details class="mini-demo"><summary>Open your decision card</summary><dl class="decision-card"><dt>Stop</dt><dd>Leave the booking untouched while you decide.</dd><dt>Check</dt><dd>Who owns the account? Who has given permission?</dd><dt>Choose</dt><dd>Choose an action you are allowed to take.</dd><dt>Tell</dt><dd>Who can secure the account without sharing the details?</dd></dl></details></aside>';
  return '<aside class="desk-evidence"><h3>At the library desk</h3><p>A visitor walks away. Their booking is still on the shared screen.</p><div class="booking-slip"><b>Quiet-space reservation</b><dl><dt>Visitor</dt><dd>Callum Reid</dd><dt>Home address</dt><dd>8 Harbour Lane, Port Clyde</dd><dt>Session</dt><dd>Signed in · Booking can be changed</dd></dl><small>Fictional booking</small></div><div class="chat-bubble"><b>Euan · beside you</b><p>Can you send me a picture of that?</p></div></aside>';
}
