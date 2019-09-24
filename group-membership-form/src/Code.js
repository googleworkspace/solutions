var ADDED_TO_GROUP_SUBJECT = 'Added to group';
var ADDED_TO_GROUP_DOC_URL = 'https://docs.google.com/document/d/1-ajkkIP8gUWqMcnpXhkqwlM_2Y18USLdJ-pFZdDEZ70/edit?usp=sharing';

var ALREADY_IN_GROUP_SUBJECT = 'Already in group';
var ALREADY_IN_GROUP_DOC_URL = 'https://docs.google.com/document/d/11AO7vwk6179ohuxGO_NXSoDB0m_H5e-5XEtwiWRVNOM/edit?usp=sharing';

/**
 * Installs a trigger on the Spreadsheet when a Form response is submitted.
 */
function installTrigger() {
  ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onFormSubmit()
      .create();
}

/**
 * Sends a customized email for every response in a form.
 *
 * @param {Object} e - Form submit event.
 */
function onFormSubmit(e) {
  var responses = e.namedValues;

  // If the question title is a label, it can be accessed as an object field.
  // If it has spaces or other characters, it can be accessed as a dictionary.
  var timestamp = responses.Timestamp[0];
  var userEmail = responses['Email Address'][0].trim();
  var groupEmail = responses['Google Group'][0].trim();

  // Check if the group contains the user's email.
  var status = '';
  var group = GroupsApp.getGroupByEmail(groupEmail);
  if (group.hasUser(userEmail)) {
    // User is already in group, send a confirmation email.
    var alreadyInGroupDocId = DocumentApp.openByUrl(ALREADY_IN_GROUP_DOC_URL).getId();
    var emailBody = docToHtml(alreadyInGroupDocId);
    emailBody = emailBody.replace('{{EMAIL}}', userEmail);
    emailBody = emailBody.replace('{{GOOGLE_GROUP}}', groupEmail);
    MailApp.sendEmail({
      to: userEmail,
      subject: ALREADY_IN_GROUP_SUBJECT,
      htmlBody: emailBody,
    });
    status = 'Already in group';
  } else {
    // User is not part of the group, add user to group.
    var member = {email: userEmail, role: 'MEMBER'};
    AdminDirectory.Members.insert(member, groupEmail);

    // Send a confirmation email that the member was now added.
    var addedToGroupDocId = DocumentApp.openByUrl(ADDED_TO_GROUP_DOC_URL).getId();
    var emailBody = docToHtml(addedToGroupDocId);
    emailBody = emailBody.replace('{{EMAIL}}', userEmail);
    emailBody = emailBody.replace('{{GOOGLE_GROUP}}', groupEmail);
    MailApp.sendEmail({
      to: userEmail,
      subject: ADDED_TO_GROUP_SUBJECT,
      htmlBody: emailBody,
    });
    status = 'Newly added';
  }

  // Append the status on the spreadsheet to the responses' row.
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = e.range.getRow();
  var column = e.values.length + 1;
  sheet.getRange(row, column).setValue(status);

  Logger.log('status=' + status + '; responses=' + JSON.stringify(responses));
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
