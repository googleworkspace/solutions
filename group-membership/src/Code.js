var EMAIL = 'Email';
var GOOGLE_GROUP = 'Google Group';
var ALLOWED = 'Allowed';
var EMAIL_TEMPLATE_DOC_URL = 'Email template doc URL';
var EMAIL_SUBJECT = 'Email subject';
var STATUS = 'Status';

/**
 * Trigger that runs on edit after being installed via the interface.
 *
 * @param {Object} e - onEdit trigger event.
 */
function onEditInstallableTrigger(e) {
  // Get the headers, row range and values from the active sheet.
  var sheet = SpreadsheetApp.getActiveSheet();
  var headers = sheet.getDataRange().offset(0, 0, 1).getValues()[0];
  var range = sheet.getRange(e.range.getRow(), 1, 1, headers.length);
  var row = range.getValues()[0];

  // Convert the row Array into an entries Object using the headers for the
  // field names.
  var entries = headers.reduce(function(result, columnName, i) {
    result[columnName] = row[i];
    return result;
  }, {});

  // Update the entries Object with the status returned by addToGroup().
  try {
    entries[STATUS] = addToGroup(
        entries[EMAIL],
        entries[GOOGLE_GROUP],
        entries[ALLOWED],
        entries[EMAIL_TEMPLATE_DOC_URL],
        entries[EMAIL_SUBJECT]
    );
  } catch (e) {
    // If there's an error, report that as the status.
    entries[STATUS] = e;
  }

  // Convert the updated entries Object into a row Array.
  var rowToWrite = headers.map(function(columnName) {
    return entries[columnName];
  });

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
 * @param {string} emailSubject - subject of welcome email sent to user added to group.
 * @return {string} - status if email was sent to a user added in the sheet.
 */
function addToGroup(userEmail, groupEmail, allowed, emailTemplateDocUrl, emailSubject) {
  if (allowed.toLowerCase() != 'yes') {
    return 'Not sent';
  }

  // If the group does not contain the user's email, add it and send an email.
  var group = GroupsApp.getGroupByEmail(groupEmail);
  if (!group.hasUser(userEmail)) {
    // User is not part of the group, add user to the group.
    var member = {email: userEmail, role: 'MEMBER'};
    AdminDirectory.Members.insert(member, groupEmail);

    // Send a confirmation email that the member was now added.
    var docId = DocumentApp.openByUrl(emailTemplateDocUrl).getId();
    var emailBody = docToHtml(docId);
    
    // Replace the template variables like {{VARIABLE}} with real values.
    emailBody = emailBody.replace('{{EMAIL}}', userEmail);
    emailBody = emailBody.replace('{{GOOGLE_GROUP}}', groupEmail);

    MailApp.sendEmail({
      to: userEmail,
      subject: emailSubject,
      htmlBody: emailBody,
    });

    // Set the status to the current date.
    return new Date();
  }
  return 'Already in group';
}

/**
 * Fetches a Google Doc as an HTML string.
 *
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  var url = 'https://docs.google.com/feeds/download/documents/export/Export?id=' +
            docId + '&exportFormat=html';
  var param = {
    method: 'get',
    headers: {'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
