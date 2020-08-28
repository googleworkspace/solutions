/**
 * See if the folder of Agenda docs exists, or otherwise create it.
 *
 * @return {*} Drive folder id for the app.
 */
function checkFolder() {
  const folders = DriveApp.getFoldersByName('Agenda Maker - App');
  // Find the folder if it exists
  while (folders.hasNext()) {
    var folder = folders.next();
    if (
      folder.getDescription() ==
        'App Script App - Do not change this description' &&
      folder.getOwner().getEmail() == Session.getActiveUser().getEmail()
    ) {
      return folder.getId();
    }
  }
  // If the folder doesn't exist, create one
  var folder = DriveApp.createFolder('Agenda Maker - App');
  folder.setDescription('Apps Script App - Do not change this description');
  return folder.getId();
}

/**
 * Find the template agenda doc, or create a default if it doesn't exist
 */
function getTemplateId(folderId) {
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByName('Agenda TEMPLATE##');

  // If there is a file, return the ID.
  while (files.hasNext()) {
    const file = files.next();
    return file.getId();
  }

  // Otherwise, create the agenda template.
  // Feel free to adjust the default template here
  const doc = DocumentApp.create('Agenda TEMPLATE##');
  const body = doc.getBody();

  body
      .appendParagraph('##Attendees##')
      .setHeading(DocumentApp.ParagraphHeading.HEADING1)
      .editAsText()
      .setBold(true);
  body.appendParagraph(' ').editAsText().setBold(false);

  body
      .appendParagraph('Overview')
      .setHeading(DocumentApp.ParagraphHeading.HEADING1)
      .editAsText()
      .setBold(true);
  body.appendParagraph(' ');
  body.appendParagraph('- Topic 1: ').editAsText().setBold(true);
  body.appendParagraph(' ').editAsText().setBold(false);
  body.appendParagraph('- Topic 2: ').editAsText().setBold(true);
  body.appendParagraph(' ').editAsText().setBold(false);
  body.appendParagraph('- Topic 3: ').editAsText().setBold(true);
  body.appendParagraph(' ').editAsText().setBold(false);

  body
      .appendParagraph('Next Steps')
      .setHeading(DocumentApp.ParagraphHeading.HEADING1)
      .editAsText()
      .setBold(true);
  body.appendParagraph('- Takeaway 1: ').editAsText().setBold(true);
  body.appendParagraph('- Responsible: ').editAsText().setBold(false);
  body.appendParagraph('- Accountable: ');
  body.appendParagraph('- Consult: ');
  body.appendParagraph('- Inform: ');
  body.appendParagraph(' ');
  body.appendParagraph('- Takeaway 2: ').editAsText().setBold(true);
  body.appendParagraph('- Responsible: ').editAsText().setBold(false);
  body.appendParagraph('- Accountable: ');
  body.appendParagraph('- Consult: ');
  body.appendParagraph('- Inform: ');
  body.appendParagraph(' ');
  body.appendParagraph('- Takeaway 3: ').editAsText().setBold(true);
  body.appendParagraph('- Responsible: ').editAsText().setBold(false);
  body.appendParagraph('- Accountable: ');
  body.appendParagraph('- Consult: ');
  body.appendParagraph('- Inform: ');
  
  doc.saveAndClose();

  folder.addFile(DriveApp.getFileById(doc.getId()));

  return doc.getId();
}

/**
 * This is triggered whenever there is a change to the calendar
 * When there is a change, it searches for events that include "#agenda"
 * in the decrisption.
 *
 */
function onCalendarChange() {
  // Get recent events with the tag
  const now = new Date();
  const events = CalendarApp.getEvents(
      now,
      new Date(now.getTime() + 2 * 60 * 60 * 1000000),
      {search: '#agenda'},
  );

  const folderId = checkFolder();
  const templateId = getTemplateId(folderId);

  const folder = DriveApp.getFolderById(folderId);

  // Go through any events found
  for (i = 0; i < events.length; i++) {
    const event = events[i];

    // Confirm whether the event has the tag
    let description = event.getDescription();
    if (description.search('#agenda') == -1) continue;

    // Only work with events created by the owner of this calendar
    if (event.isOwnedByMe()) {
      // Create a new document from the template, for an agenda for this event
      const newDoc = DriveApp.getFileById(templateId).makeCopy();
      newDoc.setName('Agenda for ' + event.getTitle());

      const file = DriveApp.getFileById(newDoc.getId());
      folder.addFile(file);

      const doc = DocumentApp.openById(newDoc.getId());
      const body = doc.getBody();

      // Fill in the template with information about the attendees from the
      // calendar event
      const conf = body.findText('##Attendees##');
      if (conf) {
        const ref = conf.getStartOffset();

        for (var i in event.getGuestList()) {
          var guest = event.getGuestList()[i];

          body.insertParagraph(ref + 2, guest.getEmail());
        }
        body.replaceText('##Attendees##', 'Attendees');
      }

      // Replace the tag with a link to the agenda document
      const agendaUrl = 'https://docs.google.com/document/d/' + newDoc.getId();
      description = description.replace(
          '##agenda',
          '<a href=' + agendaUrl + '>Agenda Doc</a>',
      );
      event.setDescription(description);

      // Invite attendees to the Google doc so they automatically receive access to the agenda
      newDoc.addEditor(newDoc.getOwner());

      for (var i in event.getGuestList()) {
        var guest = event.getGuestList()[i];

        newDoc.addEditor(guest.getEmail());
      }
    }
  }
  return;
}

/**
 * Register a trigger to watch for calendar changes.
 */
function setUp() {
  var email = Session.getActiveUser().getEmail();
  ScriptApp.newTrigger("onCalendarChange").forUserCalendar(email).onEventUpdated().create();
}
