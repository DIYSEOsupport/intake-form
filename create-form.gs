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
 *     Color: + (custom) > #385873
 *     Background: the lightest swatch
 *     Font style: Basic
 *
 * Before running: upload logo-small.gif to My Drive (it becomes the animated logo at the bottom right).
 * Contact links: Forms links the email on its own. For a tap-to-call phone, select the number
 * in the description > link icon > tel:+19415003707.
 */
function createDiyseoForm() {
  const form = FormApp.create('Intake Form')
    .setDescription('• Call/Text: 941.500.3707\n' +
      '• Email: DIYSEO.support@gmail.com\n\n' +
      'Tell us about your business so we can build your website.')
    // tells you who sent each response, without adding a question. Responder input (not Verified)
    // so the web page at diyseosupport.github.io/intake-form can submit into this form.
    .setEmailCollectionType(FormApp.EmailCollectionType.RESPONDER_INPUT)
    .setConfirmationMessage('Thanks! We got your answers and will reply within 24 hours.');

  // ex = example shown in small grey text under the question
  const para = (q, ex) => form.addParagraphTextItem().setTitle(q).setHelpText(ex || '').setRequired(true);
  const choice = (q, opts) => form.addMultipleChoiceItem().setTitle(q).setChoiceValues(opts).setRequired(true);

  para('What makes your business different from others nearby, and what is the overall vibe?',
    'e.g. family-owned since 1998, laid-back, live music Fridays');
  para('What are your best products or services that must be front and center on the homepage?',
    'e.g. wings and craft beer, or emergency AC repair and free estimates');
  para('Who are your typical customers, and what are they looking for when they visit your site?',
    'e.g. locals after work, families on weekends. They want hours, menu, directions');
  para('What is the number one thing you want a visitor to do within 5 seconds of landing on the site?',
    'e.g. call us, book a table, get directions, order online');
  para('What questions do customers ask your staff most often over the phone?',
    'e.g. Are you open today? Do you take walk-ins? Is there parking?');
  para('What is the main goal for this website?',
    'e.g. more calls, more bookings, show up on Google Maps');
  para('Do you have a final logo, specific fonts, or official colors that you already use?',
    'e.g. Yes, I have a logo file. Or: No, I need help');
  para('Do you have a slogan or catchy line?',
    'e.g. "Best wings in Port Charlotte" or "Fixed right the first time"');
  choice('Do you have good photos of your products, services, and space?', [
    'Yes, professional high-res photos ready',
    'Basic smartphone photos only',
    'No, I need placeholder photos',
  ]);
  choice('Do you prefer a dark website or a bright, clean, modern look?', [
    'Dark',
    'Bright, clean, modern',
  ]);
  para('Are there other business websites you really like? Paste links if you have them.',
    'e.g. I like how one site shows the menu');
  choice('Do you want a QR code on your printed menus, flyers, or signs that links to your new website?', [
    'Yes, definitely',
    'No, not at this time',
    'I want to learn more about how this works',
  ]);
  para('What local towns or neighborhoods do you want to reach most when people search on Google?',
    'e.g. Port Charlotte, Punta Gorda, Englewood');
  para('When customers look you up on their phones, what should be easiest to reach?',
    'e.g. call button, directions, hours, booking, menu');
  para('Do you want a contact form that sends customer messages to your email?',
    'e.g. Yes. We add a note: "We reply within 24 hours."');

  // Animated logo, bottom right, just above Submit
  form.addImageItem()
    .setImage(DriveApp.getFilesByName('logo-small.gif').next().getBlob())
    .setAlignment(FormApp.Alignment.RIGHT)
    .setWidth(120);

  const sheet = SpreadsheetApp.create('Intake Form (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Entry IDs for the web page: a pre-filled link is the only place Google shows them.
  const pre = form.createResponse();
  form.getItems().forEach(it => {
    if (it.getType() === FormApp.ItemType.PARAGRAPH_TEXT) pre.withItemResponse(it.asParagraphTextItem().createResponse('x'));
    if (it.getType() === FormApp.ItemType.MULTIPLE_CHOICE) pre.withItemResponse(it.asMultipleChoiceItem().createResponse(it.asMultipleChoiceItem().getChoices()[0].getValue()));
  });
  const entries = pre.toPrefilledUrl().match(/entry\.\d+/g);
  Logger.log('Web page hookup (send this line to Claude): ' + JSON.stringify({
    action: form.getPublishedUrl().replace(/viewform.*/, 'formResponse'), entries: entries }));

  Logger.log('Edit form:  ' + form.getEditUrl());
  Logger.log('Share link: ' + form.getPublishedUrl());
  Logger.log('Responses:  ' + sheet.getUrl());
}
