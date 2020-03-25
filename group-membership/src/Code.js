const EMAIL = 'Email';
const GOOGLE_GROUP = 'Google Group';
const ALLOWED = 'Allowed';
const EMAIL_TEMPLATE_DOC_URL = 'Email template doc URL';
const EMAIL_SUBJECT = 'Email subject';
const STATUS = 'Status';

const STATUS_VALUE = {
  sent: 'Sent',
  alreadyInGroup: 'Already in group',
  notSent: 'Not sent',
  requiredFieldMissing: 'Required field(s) missing: fill out all fields for this row',
  emptyRow: '',
};

/**
 * Installs a trigger in the Spreadsheet to run upon the Sheet being opened.
 * To learn more about triggers read:
 * https://developers.google.com/apps-script/guides/triggers
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Install trigger')
    .addItem('onEdit', 'installOnEditTrigger')
    .addToUi();
}

/**
 * Installs a trigger in the Spreadsheet that is scheduled
 * to run upon when values in the Sheet are edited.
 * To learn more about triggers read:
 * https://developers.google.com/apps-script/guides/triggers/installable
 */
function installOnEditTrigger() {
  ScriptApp.newTrigger('onEditInstallableTrigger')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
}

/**
 * Trigger that runs on edit after being installed via the interface.
 *
 * @param {Object} e - onEdit trigger event.
 */
function onEditInstallableTrigger(e) {
  // Get the headers, row range and values from the active sheet.
  let sheet = SpreadsheetApp.getActiveSheet();
  let headers = sheet.getDataRange().offset(0, 0, 1).getValues()[0];
  let range = sheet.getRange(e.range.getRow(), 1, 1, headers.length);
  let row = range.getValues()[0];

  // Convert the row Array into an entries Object using the headers for the
  // field names.
  let entries = headers.reduce((result, columnName, i) => {
    result[columnName] = row[i];
    return result;
  }, {});

  // Update the entries Object with the status returned by addToGroup().
  try {
    let statusValue = addToGroup(
        entries[EMAIL],
        entries[GOOGLE_GROUP],
        entries[ALLOWED],
        entries[EMAIL_TEMPLATE_DOC_URL],
        entries[EMAIL_SUBJECT]
    );
    entries[STATUS] = statusValue == STATUS_VALUE.sent
        ? `${statusValue}: ${new Date()}`
        : statusValue;
  } catch (e) {
    // If there's an error, report that as the status.
    entries[STATUS] = e;
  }

  // Convert the updated entries Object into a row Array.
  let rowToWrite = headers.map(columnName => entries[columnName]);

  // setValues() receives a 2D array, so we create an array with the row
  // contents.
  range.setValues([rowToWrite]);
}


/**
 * Trigger that runs on edit after being installed via the interface.
 *
 * @param {string} userEmail - email of user to add to the group.
 * @param {string} groupEmail - address of Google Group to add user to.
 * @param {string} allowed - 'yes' flag to add user to group.
 * @param {string} emailTemplateDocUrl - Google Doc URL that serves as template
 *        of the welcome email sent to a user added to the group.
 * @param {string} emailSubject - subject of welcome email sent to user added
 *        to group.
 * @return {string} - status if email was sent to a user added in the sheet.
 */
function addToGroup(userEmail, groupEmail, allowed, emailTemplateDocUrl, emailSubject) {
  if (!allowed) {
    return STATUS_VALUE.emptyRow;
  }
  if (!userEmail || !groupEmail || !emailTemplateDocUrl || !emailSubject) {
    return STATUS_VALUE.requiredFieldMissing;
  }
  if (allowed.toLowerCase() != 'yes') {
    return STATUS_VALUE.notSent;
  }

  // If the group does not contain the user's email, add it and send an email.
  let group = GroupsApp.getGroupByEmail(groupEmail);
  if (!group.hasUser(userEmail)) {
    // User is not part of the group, add user to the group.
    let member = {email: userEmail, role: 'MEMBER'};
    AdminDirectory.Members.insert(member, groupEmail);

    // Send a confirmation email that the member was now added.
    let docId = DocumentApp.openByUrl(emailTemplateDocUrl).getId();
    let emailBody = docToHtml(docId);

    // Replace the template variables like {{VARIABLE}} with real values.
    emailBody = emailBody
        .replace('{{EMAIL}}', userEmail)
        .replace('{{GOOGLE_GROUP}}', groupEmail);

    MailApp.sendEmail({
      to: userEmail,
      subject: emailSubject,
      htmlBody: emailBody,
    });

    // Set the status to the current date.
    return STATUS_VALUE.sent;
  }
  return STATUS_VALUE.alreadyInGroup;
}

/**
 * Fetches a Google Doc as an HTML string.
 *
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  let url = 'https://docs.google.com/feeds/download/documents/export/Export?id=' +
            docId + '&exportFormat=html';
  let param = {
    method: 'get',
    headers: {'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
