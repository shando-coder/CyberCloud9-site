// Mission 1 uses the same stored decisions as the original help-desk activities.
const harbourStops=['Help desk','Crew checks','Crew chat','Ticket collection'];
const shiftNotes=[
  'The first scan uses the ticket, so the crew advises visitors to keep ticket pictures private. Maya keeps her booking password private and uses the official sign-in or reset route. The organiser supports account security by giving safe guidance and never asking for passwords. The volunteer contact list stays with the organisers, and the booking site needs to work. These are three different things worth protecting: account access, private information and a working service.',
  'The organiser can now take three useful actions: give volunteers their own sign-ins, restrict the contact sheet and arrange the tablet update. Each action addresses a different weakness.',
  'Mairi’s booking stays as she left it. The supervising adult can secure the session without anyone making a test change. A friend’s suggestion cannot give you permission to use someone else’s account.',
  'The ticket desk supervisor closes the open session before the next visitor uses the desk. You helped the visitor without taking a photo of their private details.'
];
function handoverCard(label,clue,inside){
  return '<details class="handover"><summary>'+label+'<small>'+clue+'</small></summary><p>'+inside+'</p></details>';
}
function shiftEvidence(index){
  if(index===0)return '<clydebeat-gate></clydebeat-gate><aside class="desk-evidence"><h3>Morning handover</h3><p>The crew also needs help with an unexpected password request, a volunteer list and the booking website. Open each note, then make your recommendations below.</p><div class="handover-grid">'+
    handoverCard('Password request','Box office · Visitor enquiry','“Maya received a message asking for her password to confirm her booking. She hasn’t replied. We never ask visitors for passwords. How should we help her check her booking safely?”')+
    handoverCard('Volunteer contact list','Festival organiser','“I keep volunteers’ names and mobile numbers together so I can tell them if a shift moves. This list is for the organisers who manage the shifts.”')+
    handoverCard('Ticket booking site','Box office · Website down now','<strong>What has happened:</strong> The Clydebeat website is down right now. Visitors cannot read the event information or buy tickets online. Some may think the festival is poorly organised and lose confidence in it.')+'</div></aside>';
  if(index===1)return '<aside class="desk-evidence"><h3>Three notes from the crew</h3><div class="crew-notes"><p><b>Booking desk</b> Three volunteers use one account. The activity log shows “crew” beside a changed booking.</p><p><b>Contact sheet</b> The volunteer sheet pairs names with mobile numbers. Its link currently opens for anyone.</p><p><b>Gate tablet</b> An update fixes a known fault. The tablet still shows “Update pending”.</p></div><clydebeat-contact-sheet></clydebeat-contact-sheet></aside>';
  if(index===2)return '<aside class="desk-evidence"><h3>Crew chat</h3><div class="chat-bubble"><b>Euan · to you</b><p>Mairi used the festival’s ticket collection tablet and walked away without signing out. Can you try changing her booking to see if the account is safe? We can change it back.</p></div><details class="mini-demo"><summary>Open your decision card</summary><dl class="decision-card"><dt>Stop</dt><dd>Leave the booking untouched while you decide.</dd><dt>Check</dt><dd>Who owns the account? Who has given permission?</dd><dt>Choose</dt><dd>Choose an action you are allowed to take.</dd><dt>Tell</dt><dd>Who can secure the account without sharing the details?</dd></dl></details></aside>';
  return '<aside class="desk-evidence"><h3>At festival ticket collection</h3><p>Later, a different visitor collects their tickets and walks away. Their festival booking is still open on the shared tablet.</p><div class="booking-slip"><b>Clydebeat ticket booking</b><dl><dt>Visitor</dt><dd>Callum Reid</dd><dt>Home address</dt><dd>8 Harbour Lane, Port Clyde</dd><dt>Session</dt><dd>Signed in · Booking can be changed</dd></dl><small>Fictional booking</small></div><div class="chat-bubble"><b>Euan · beside you</b><p>Can you send me a picture of that?</p></div></aside>';
}

class ClydebeatGate extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<section class="desk-evidence" aria-label="Gate scanner activity">
      <h3>I posted my ticket. What now?</h3>
      <p>Isla tells the box office, “I was so excited I got a Clydebeat ticket that I posted it on Instagram. My friend just pointed out you can see the QR code. Could someone else get in with it?”</p><p>The gate supervisor gives you a practice ticket and a screenshot with the same code. Try scanning both. Use what happens to advise Isla.</p>
      <p><strong>Before you scan:</strong> If the screenshot is scanned first, what do you think Isla will see when she scans her ticket? Make your prediction, then try it.</p>
      <div class="gate-phone" data-state="ready">
        <div class="gate-sensor" aria-hidden="true"></div>
        <div class="gate-top"><b>Clydebeat</b><span>Harbour Gate</span></div>
        <div class="gate-lens" aria-hidden="true">
          <div class="gate-frame"><img width="116" height="116" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0AQAAAAB84SuKAAAAt0lEQVR4nOWUuw3DQAxDH4P01AbefyxvoJuAKZwin8ZWmbARBOiB0gE8hVetG+/6g15SLZWkGvFOoNvJwP8OyOCjTO8pXZv/7E3N+TRtSM/4JVFHGb1fgFXOdH+xREBD3kVvUK66zpPQBjrupAe8nbYT4+v8DdhVNLX3yfkP/yShcWew/x0Etr1Q5vnTyjbJzzN/+wb7Sb8v/tDa6DHvRnT1iA+lEGrgryDwogFf//+f+Ts9/2v9AxlZToEMLsOqAAAAAElFTkSuQmCC" alt=""><i></i></div>
        </div>
        <div class="gate-result" aria-hidden="true"></div>
        <div class="gate-display"><strong data-head>Ready to scan</strong>
          <span>Festival day pass · CB-204</span></div>
        <div class="gate-home" aria-hidden="true"></div>
      </div>
      <p role="status" aria-live="polite" data-screen>Choose which ticket arrives first.</p>
      <div class="bar">
        <button type="button" data-ticket="original">Scan Isla’s ticket</button>
        <button type="button" data-ticket="copy">Scan the screenshot</button>
        <button type="button" class="subtle" data-replay hidden>Try the other order</button>
      </div>
      <fieldset data-advice hidden><legend>What should the box office tell Isla?</legend><button type="button" data-choice="group">Take the post down and assume the ticket is safe</button> <button type="button" data-choice="text">Take the post down and contact the official box office about the exposed code</button><p role="status" data-reply></p></fieldset>
    </section>`;
    const screen = this.querySelector('[data-screen]');
    const tickets = Array.from(this.querySelectorAll('[data-ticket]'));
    const replay = this.querySelector('[data-replay]');
    const phone = this.querySelector('.gate-phone');
    const heading = phone.querySelector('[data-head]');
    function showState(state, title) {
      phone.dataset.state = state;
      heading.textContent = title;
    }
    const advice = this.querySelector('[data-advice]');
    const reply = advice.querySelector('[data-reply]');
    for (const choice of advice.querySelectorAll('button')) {
      choice.onclick = () => {
        reply.textContent = choice.dataset.choice === 'text'
          ? 'Isla removes the post. The box office can check her booking and help her replace the exposed code if needed. Next time she can share her excitement without showing her ticket.'
          : 'Taking the post down stops more people seeing it there. Someone may already have saved a screenshot. Who can help Isla with the exposed code? Try again.';
      };
    }
    let scans = 0;
    for (const button of tickets) {
      button.onclick = () => {
        const isla = button.dataset.ticket === 'original';
        button.disabled = true;
        scans += 1;
        if (scans === 1) {
          showState('accepted', 'Welcome!');
          screen.textContent = isla
            ? 'Entry allowed. Isla gets in. The scanner marks CB-204 as used. Now scan the screenshot.'
            : 'Entry allowed. The visitor with the screenshot gets in. The scanner marks CB-204 as used. Now scan Isla’s ticket.';
          tickets.find(ticket => !ticket.disabled).focus();
        } else {
          showState('used', 'Already used');
          screen.textContent = isla
            ? 'Already used. Isla has the original ticket, but the screenshot was scanned first. The gate volunteer refers Isla to the box office.'
            : 'Already used. Isla got in first, so the visitor with the screenshot is turned away. Both versions carry the same code.';
          replay.hidden = false;
          advice.hidden = false;
          advice.querySelector('button').focus();
        }
      };
    }
    replay.onclick = () => {
      advice.hidden = true;
      reply.textContent = '';
      scans = 0;
      showState('ready', 'Ready to scan');
      for (const button of tickets) button.disabled = false;
      replay.hidden = true;
      screen.textContent = 'Scanner reset. Try sending the other ticket through first.';
      tickets[0].focus();
    };
  }
}
customElements.define('clydebeat-gate', ClydebeatGate);

class ClydebeatContactSheet extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<section aria-label="Volunteer contact list activity">
      <h3>Who can open the crew list?</h3>
      <p>A link to the volunteer contact list has landed in a festival visitors’ chat. Open it as a visitor and see what you can find out.</p>
      <div class="booking-slip">
        <strong>Visitor’s phone · Festival chat</strong>
        <p>Forwarded link: Clydebeat volunteer contacts</p>
        <button type="button" data-open>Open link as a visitor</button>
        <div role="status" aria-live="polite" aria-atomic="true" data-result></div>
      </div>
      <label>Try the organiser’s sharing setting
        <select data-access disabled>
          <option value="any">Anyone with the link</option>
          <option value="crew">Named crew members only</option>
        </select>
      </label>
      <p data-prompt>Open the link once to unlock the sharing setting.</p>
    </section>`;
    const access = this.querySelector('[data-access]');
    const result = this.querySelector('[data-result]');
    const prompt = this.querySelector('[data-prompt]');
    this.querySelector('[data-open]').onclick = () => {
      access.disabled = false;
      if (access.value === 'any') {
        result.innerHTML = '<p><strong>List opened.</strong> The visitor can see who is on shift and how to contact them.</p><dl><dt>Fictional volunteer</dt><dd>Rory Kerr · Harbour Gate · 07700 900126</dd><dt>Fictional volunteer</dt><dd>Leila Grant · Box office · 07700 900182</dd></dl>';
        prompt.textContent = 'Choose “Named crew members only”, then open the same link again.';
      } else {
        result.innerHTML = '<p><strong>Access denied.</strong> This visitor is outside the crew. The link still works for named crew members.</p>';
        prompt.textContent = 'What would you tell the organiser? Changing the setting stops visitors opening the list again. Anyone who already saw it could have saved a copy.';
      }
    };
    access.onchange = () => {
      result.textContent = 'Sharing setting changed. Open the forwarded link again to see the visitor’s view.';
      prompt.textContent = 'The visitor still has the same link.';
    };
  }
}
customElements.define('clydebeat-contact-sheet', ClydebeatContactSheet);
