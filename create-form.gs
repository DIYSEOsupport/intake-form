/**
 * DIYSEO Intake Form — builds the Google Form + a responses Sheet.
 * Questions come from form1.html, reworded to fit any local business.
 *
 * Run while signed in as diyseo.support@gmail.com:
 * script.google.com > New project > paste this > Save > Run createDiyseoForm > allow access.
 * The edit + share links print in the Execution log, plus a "Web page hookup" line for the web page.
 *
 * Branding (Google doesn't let scripts set a form's theme — do this once by hand):
 *   Open the form > palette icon (Customize theme) >
 *     Header: Upload > form-header.gif (spinning cog arrow; form-header.png is the still version)
 *     Color: + (custom) > #446386
 *     Background: the lightest swatch
 *     Font style: Basic
 *
 * Before running: upload logo-small.gif to My Drive (it becomes the animated logo at the bottom right).
 */
function createDiyseoForm() {
  const form = FormApp.create('New Website Intake Form')
    .setDescription('Tell us about your business so we can build your website.')
    // tells you who sent each response, without adding a question. Responder input (not Verified)
    // so the web page at diyseosupport.github.io/intake-form can submit into this form.
    .setEmailCollectionType(FormApp.EmailCollectionType.RESPONDER_INPUT)
    .setConfirmationMessage('Thanks! We got your answers and will reply within 24 hours. Have more photos? Watch for our email and reply to it with them attached.');

  // ex = example shown in small grey text under the question. 
  let n = 0, inGroup = false;
  const num = q => q; // questions aren't numbered
  // several write-in lines on the web page (count, default 5); one long-answer box in the Google Form (the page sends the lines joined)
  const lines = (q, ex, count) => form.addParagraphTextItem().setTitle(num(q)).setHelpText(ex || '').setRequired(true);
  // explain: one long-answer box in the Google Form; the web page shows a write-in space + upload under each
  // option ticked in the question above, and sends them joined ("About us: ...")
  const explain = (q, ex) => form.addParagraphTextItem().setTitle(num(q)).setHelpText(ex || '').setRequired(true);
  const note = (q, ex) => form.addParagraphTextItem().setTitle(num(q)).setHelpText(ex || '');                  // long answer, optional
  const para = (q, ex) => form.addParagraphTextItem().setTitle(num(q)).setHelpText(ex || '').setRequired(true); // long answer
  const text = (q, ex) => form.addTextItem().setTitle(num(q)).setHelpText(ex || '').setRequired(true);           // short answer
  // boxes: a numbered header, then its lines (not numbered). field = required line, link = optional line,
  // ifYes = optional line the web page only shows after Yes on the question above
  const section = q => { inGroup = false; form.addSectionHeaderItem().setTitle(num(q)); };
  // heading: an unnumbered header (stands apart from the numbered questions); its rows follow, like a section
  const heading = q => { inGroup = false; form.addSectionHeaderItem().setTitle(q); };
  // group: a numbered header; every question after it sits inside its box (until the next section/group)
  const group = q => { inGroup = false; form.addSectionHeaderItem().setTitle(num(q)); inGroup = true; };
  const field = (q, ex) => form.addTextItem().setTitle(q).setHelpText(ex || '').setRequired(true);
  const link = (q, ex) => form.addTextItem().setTitle(q).setHelpText(ex || '');
  const ifYes = (q, ex) => form.addTextItem().setTitle(q + ' (if Yes)').setHelpText(ex || '');
  // optional single tick box that belongs to the question above it (not numbered)
  const box = (q, label) => form.addCheckboxItem().setTitle(q).setChoiceValues([label]);
  // file upload under the question above. Scripts can't add Google's file-upload question, so the form
  // gets a note here instead; the web page shows a real upload box. (Add one by hand in the editor if wanted.)
  const upload = (q, ex) => form.addSectionHeaderItem().setTitle(q).setHelpText(ex);
  // 'Other' in a list becomes Google's write-in "Other:" box
  const opts = (item, list) => item.setChoiceValues(list.filter(o => o !== 'Other')).showOtherOption(list.includes('Other'));
  const choice = (q, list) => opts(form.addMultipleChoiceItem().setTitle(num(q)), list).setRequired(true); // pick one
  // pick several; "Pick up to N." in the title sets the limit, otherwise any number
  const checks = (q, list) => {
    const item = opts(form.addCheckboxItem().setTitle(num(q)), list).setRequired(true);
    const max = q.match(/Pick up to (\d+)/);
    if (max) item.setValidation(FormApp.createCheckboxValidation().requireSelectAtMost(+max[1]).build());
  };

  section('Business info');
  field('Business name');
  field('Contact name');
  field('Phone');
  field('Business address');
  field('City');
  field('State');
  field('ZIP');
  choice('Do you already own a website address (domain name)?', [
    'Yes',
    'No',
  ]);
  ifYes('Website address');
  para('What makes your business different from others nearby?',
    'e.g. family-owned since 1998, live music Fridays, happy hour 4–7pm, free estimates');
  checks('What is the overall vibe? Pick up to 2.', [
    'Laid-back and casual',
    'Family-friendly',
    'Fun and lively',
    'Upscale',
    'Professional and trustworthy',
    'Modern',
    'Other',
  ]);
  para('What are your best products or services that must be front and center on the homepage?',
    'e.g. wings and craft beer, or emergency AC repair and free estimates');
  choice('What is the number one thing you want a visitor to do within 5 seconds of landing on the site?', [
    'Call us',
    'Get directions',
    'Book or reserve',
    'Order online',
    'Ask for a quote',
    'Send us a message',
    'Other',
  ]);
  lines('What questions do customers ask your staff most often over the phone?',
    'e.g. Are you open today? Do you take walk-ins? Is there parking?');
  checks('What are the main goals for this website? Pick up to 3.', [
    'Increase foot traffic or sales',
    'More phone calls',
    'More bookings or reservations',
    'More online orders',
    'Show up on Google Maps',
    'Look more professional',
    'Answer common questions (hours, menu, prices)',
    'Other',
  ]);
  text('Do you have a slogan or catchy line?',
    'e.g. "Your table is always ready" or "We show up when we say we will"');
  checks('Which of these photos and files can you send us? Pick all you have.', [
    'Logo',
    'Outside of your business',
    'Inside your business',
    'Products, food, or services',
    'You and your team',
    'Work in action or before and after',
    'Happy customers',
    'Menu, price list, or flyers',
    'None yet, use placeholder photos',
    'Other',
  ]);
  upload('Upload your photos, logo, or other files', 'Optional. Clear, bright, in-focus photos work best. Phone photos are fine: take them in daylight, hold steady, no filters, and send the full-size file (not a screenshot). Or email them to DIYSEO.support@gmail.com');
  choice('Do you want a dark or light website?', [
    'Dark',
    'Light',
  ]);
  lines('Are there other business websites you really like? Paste links if you have them.',
    'e.g. https://diyseosupport.github.io, I like how it shows the menu', 2);
  choice('Do you want a QR code on your printed menus, flyers, or signs that links to your new website?', [
    'Yes, definitely',
    'No, not at this time',
  ]);
  text('What local towns or neighborhoods do you want to reach most when people search on Google?',
    'e.g. Port Charlotte, Punta Gorda, Englewood');
  checks('When customers look you up on their phones, what should be easiest to reach? Pick up to 3.', [
    'Call button',
    'Directions',
    'Hours',
    'Booking',
    'Menu or prices',
    'Text us',
    'Other',
  ]);
  choice('Do you want a contact form that sends customer messages to your email?', [
    'Yes',
    'No',
  ]);
  heading('Socials');
  link('Google Business Profile link');
  box('Not sure what that is?', 'I don’t know what a Google Business Profile is');
  link('Facebook');
  link('Instagram');
  link('TikTok');
  link('Yelp');
  link('Other social links');
  group('Your vision');
  checks('Which pages or features matter most on your website? Pick up to 3.', [
    'About us',
    'Calendar or events',
    'Menu or price list',
    'Photo gallery',
    'Customer reviews',
    'Specials or happy hour',
    'Questions and answers (FAQ)',
    'Other',
  ]);
  explain('Tell us about each one you picked.',
    'Upload a file or photo if you can. A quality image we can use for inspiration or put on your site works best.');
  note('About us: tell us your story.',
    'Optional. e.g. how you got started, who runs it, what you care about');
  note('Is there something we missed? Explain your vision.',
    'Optional. e.g. "I want it to feel like walking into the shop", a feature you have in mind, or anything else');

  // Animated logo, bottom right, just above Submit
  form.addImageItem()
    .setImage(DriveApp.getFilesByName('logo-small.gif').next().getBlob())
    .setAlignment(FormApp.Alignment.RIGHT)
    .setWidth(120);

  const sheet = SpreadsheetApp.create('New Website Intake Form (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Entry IDs for the web page: a pre-filled link is the only place Google shows them.
  const pre = form.createResponse();
  form.getItems().forEach(it => {
    if (it.getType() === FormApp.ItemType.PARAGRAPH_TEXT) pre.withItemResponse(it.asParagraphTextItem().createResponse('x'));
    if (it.getType() === FormApp.ItemType.TEXT) pre.withItemResponse(it.asTextItem().createResponse('x'));
    if (it.getType() === FormApp.ItemType.CHECKBOX) pre.withItemResponse(it.asCheckboxItem().createResponse([it.asCheckboxItem().getChoices()[0].getValue()]));
    if (it.getType() === FormApp.ItemType.MULTIPLE_CHOICE) pre.withItemResponse(it.asMultipleChoiceItem().createResponse(it.asMultipleChoiceItem().getChoices()[0].getValue()));
  });
  const entries = pre.toPrefilledUrl().match(/entry\.\d+/g);
  Logger.log('Web page hookup (send this line to Claude): ' + JSON.stringify({
    action: form.getPublishedUrl().replace(/viewform.*/, 'formResponse'), entries: entries }));

  Logger.log('Edit form:  ' + form.getEditUrl());
  Logger.log('Share link: ' + form.getPublishedUrl());
  Logger.log('Responses:  ' + sheet.getUrl());

  // emails each person a thank-you with a "send more photos" ask, every time the form is submitted
  ScriptApp.newTrigger('sendConfirmation').forForm(form).onFormSubmit().create();
}

// Runs on each submission (trigger above). Sent from the account that ran the script.
function sendConfirmation(e) {
  const to = e.response.getRespondentEmail();
  if (!to) return;
  MailApp.sendEmail({
    to: to,
    subject: 'We got your website intake form',
    body: 'Thanks! We got your answers and will reply within 24 hours.\n\n' +
      'HAVE MORE PHOTOS? Reply to this email with them attached.\n' +
      'Storefront, inside, products, your team, happy customers: the more the better.\n' +
      'Clear, bright, in-focus photos work best. Phone photos are fine: take them in daylight, hold steady, ' +
      'no filters, and send the full-size file (not a screenshot).\n\n' +
      'Diana M. Leff, owner/operator\nDIYSEO\nCall/Text: 941.500.3707\nDIYSEO.support@gmail.com',
  });
}
