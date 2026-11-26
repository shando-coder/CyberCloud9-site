// Worked examples use a different situation from the marked decisions.
const teaching = {
  community: [
    ['What are we protecting?', 'An asset is something you need to keep safe or working. Ask what someone might lose if something goes wrong. It could be control of their account, privacy, or the use of a service.',
     'Before Clydebeat opens, the crew has three things to protect: a staff login that lets authorised crew change bookings; a private list of volunteers’ names and phone numbers; and ticket scanners that need to work so visitors can get in. Each matters for a different reason: controlling access, keeping personal details private, and keeping a service working. In cyber security, a valuable thing that needs protecting is called an asset.',
     'Use the test ticket at Harbour Gate to decide what the box office should tell Isla. Then open the handover cards and advise the crew on the other risks.'],
    ['A weakness makes harm possible', 'A threat is something that could cause harm. A vulnerability is a weakness that makes that harm easier. The consequence is what could happen as a result.',
     'A sports club leaves its tablet signed in by the door. That is the weakness. A passer-by might use it to cancel a booking. Losing the booking is the consequence. The open tablet alone does not tell you that anyone has used it.',
     'For each crew note, work out what could realistically happen. Read words such as “could” and “definitely” carefully.'],
    ['Being able to do something is different from having permission', 'Permission means the person responsible has agreed that you can do a particular thing. A screen left open may let you press a button, but only the account owner or an authorised person can give you permission to act.',
     'Someone leaves a club membership form open on a shared tablet. You pause, check that it belongs to someone else, leave their details alone and quietly tell the club organiser. That is Stop, Check, Choose, Tell.',
     'Read Euan’s message. Decide who can give permission and how you could get help without changing the booking.'],
    ['Use the smallest safe action', 'When details about another person are visible, protect them by keeping the information with the person or team responsible. Taking a screenshot creates another copy that can spread.',
     'A club laptop displays a member’s phone number. You step away and quietly tell the person running the club. They can close the screen without sending the number to anyone else.',
     'Look at the festival booking. Identify one detail that creates a risk, then choose who can act and what you can safely do.']
  ],
  vault: [
    ['Long and unique do different jobs', 'Long passwords are harder to guess. Unique means each account has a different password. This limits the damage if a password is exposed. A password manager can create and remember different passwords for you.',
     'Jo uses a long password for a drawing app and for email. If someone finds out the drawing app password, they can try the same one on Jo’s email. Giving email its own password breaks that link.',
     'Work out why the games-service problem might affect Amina’s tickets. Then pick a replacement that solves that specific problem.'],
    ['Give each account three kinds of protection', 'A passphrase is a password made from several words. A second sign-in check asks for another proof, such as approval from the owner’s device. A recovery address is where the service sends help if the owner loses access.',
     'A club treasurer uses a unique passphrase, keeps the second check on their own phone and sends recovery messages to a private mailbox they still control. Each setting has a different job.',
     'Choose all three settings. Check that the second sign-in method and the recovery address are controlled by the person responsible for the account.'],
    ['A sign-in code is like a temporary key', 'A verification code can let someone complete a sign-in. Treat it as private, even if a message shows a familiar name or says the code expires soon. Use a contact route you already trust to check the request.',
     'A message claiming to be from a sports centre asks for a code. You ignore the request and call the centre using the number on your membership card. If you already shared the code, tell the real service promptly so they can help secure the account.',
     'Choose what Amina should do before sharing a code, then what she should do if it has already been shared.'],
    ['Check who can recover the account', 'Recovery details need to be private, correct and controlled by someone authorised. A sign-in alert tells you something happened. A second sign-in check asks for extra proof before access is allowed.',
     'When a club secretary leaves, their private recovery mailbox can still receive reset messages. The new secretary updates that address through the real club service and keeps the other protections on.',
     'Find the one setting that needs repairing. Explain why the other controls still have a job to do.']
  ],
  footprint: [
    ['Read a post as someone who barely knows you', 'Your digital footprint includes details you share online and details other people share about you. Two small details can reveal more when someone puts them together. A ticket QR may also work as an entry pass.',
     'A post says “I train every Tuesday at six.” A photo shows the name on the sports hall. Together they can tell a stranger where and when to find the person.',
     'Look for details that reveal where Rowan is, how to contact them, or how someone could use their ticket.'],
    ['Choose the message, attachment and audience', 'Start with what you want the post to say. Share only the details needed for that purpose. Audience means who can see it. Ask before posting someone else’s photo.',
     'You want to tell two friends you enjoyed a match. You send a short message to those friends. You leave out a photo of a membership card and ask your teammate before sharing a photo of them.',
     'Use the three choices to edit Rowan’s draft. Read the preview as if it had just appeared on your screen.'],
    ['Pause when someone pushes you to share', 'You can say no, stop replying and ask a trusted adult for help. If an image is hurting someone, tell a trusted adult or use the chat’s reporting tool and avoid passing it on. If a form asks for private details, check who runs it and why they need them.',
     'A message offers a free backstage pass if you enter your ticket password. Do not use its link or share the password. Open the festival’s ticket site from a bookmark you already trust, or ask at the box office. That lets you check the offer without giving someone access to your account.',
     'Treat each message separately. Choose what protects the people involved and who can help with that particular situation.'],
    ['A private audience can still copy a post', 'A restricted group limits who can see the original. Anyone in the group may still copy it or take a screenshot. Remove unnecessary private information before choosing who can see the post.',
     'A friend shares a photo of a team pass in a small group. Someone saves the photo before it is deleted. The pass can still be seen in the saved copy.',
     'Help Isla keep the useful part of her message. Check what could happen if someone forwards a screenshot.']
  ]
};
function teachingPanel(missionId, stepIndex) {
  const [title, explanation, example, task] = teaching[missionId][stepIndex];
  return '<section class="learn-panel"><h3>'+title+'</h3><p>'+explanation+'</p>'+
    '<details open><summary>Worked example</summary><p>'+example+'</p></details>'+
    '<p><strong>Your turn</strong> '+task+'</p></section>';
}
const lessonTakeaway = {
  vault: [
    'A fresh, long password stops this particular exposed password from opening Amina’s ticket account. Keeping it unique is what breaks the link between the two services.',
    'The password protects the first check, the owner’s second check adds another barrier, and the private recovery address gives the right person a way back in.',
    'Keeping the code private protects the sign-in. The published help desk can check what happened and help secure the account if the code was shared.',
    'Updating the recovery address gives the current team control. Alerts help people notice activity and the extra sign-in check helps prevent unauthorised access.'
  ],
  footprint: [
    'An address and a time can reveal where someone will be. A phone number gives strangers a contact route and the QR could be used as a ticket.',
    'The edited draft still tells friends Rowan is excited. It keeps the ticket and contact details private and gives Euan a say in whether his photo is shared.',
    'Each response limits the spread of private information and gets help from someone who can act. Checking the prize first avoids sharing details with an unverified organiser.',
    'A text-only offer gives the group what it needs. Using the official transfer keeps the entry code out of posts and screenshots.'
  ]
};
