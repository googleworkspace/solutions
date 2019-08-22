/*
TODOS TO MAKE YOUR SOLUTION WORK:
1) Enable Admin Directory API (Resources -> Advanced Google Services...
2) Paste your Google Doc IDs below
3) Make Google Doc shareable to anyone with the link (or anyone in 
   your organization).
4) Run function `installTrigger` to auto create onFormSubmit function
*/

var addedToGroupSubject = 'Added to group';
var addedToGroupDocId = '1-ajkkIP8gUWqMcnpXhkqwlM_2Y18USLdJ-pFZdDEZ70';

var alreadyInGroupSubject = 'Already in group';
var alreadyInGroupDocId = '11AO7vwk6179ohuxGO_NXSoDB0m_H5e-5XEtwiWRVNOM';

/**
 * Must click this function from the top drop-down and click 'run' icon to
 * create the onFormSubmit trigger.
 */
function installTrigger() {
  ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onFormSubmit()
      .create();
}

/**
 * Sends a customized email for every response on a form.
 *
 * To see more of the onFormSubmit event, see:
 * https://developers.google.com/apps-script/guides/triggers/events#form-submit
 */
function onFormSubmit(e) {
  var responses = e.namedValues;

  // Get all the response values and store them in local variables.
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
    var emailBody = docToHtml(alreadyInGroupDocId);
    emailBody = emailBody.replace('{{EMAIL}}', userEmail);
    emailBody = emailBody.replace('{{GOOGLE_GROUP}}', groupEmail);
    MailApp.sendEmail({
      to: userEmail,
      subject: alreadyInGroupSubject,
      htmlBody: emailBody,
    });
    status = 'Already in group';
  }
  else {
    // User is not part of the group, add user to group.
    var member = {email: userEmail, role: 'MEMBER'};
    AdminDirectory.Members.insert(member, groupEmail);

    // Send a confirmation email that the member was now added.
    var emailBody = docToHtml(addedToGroupDocId);
    emailBody = emailBody.replace('{{EMAIL}}', userEmail);
    emailBody = emailBody.replace('{{GOOGLE_GROUP}}', groupEmail);
    MailApp.sendEmail({
      to: userEmail,
      subject: addedToGroupSubject,
      htmlBody: emailBody,
    });
    status = 'Newly added';
  }

  // Append the status on the spreadsheet to the responses' row.
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = e.range.getRow();
  var column = e.values.length + 1;
  sheet.getRange(row, column).setValue(status);

  // Log activity.
  Logger.log("status=" + status + "; responses=" + JSON.stringify(responses));
}

/**
 * Fetches a Google Doc as an HTML string.
 * 
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  // This is only used to ask for Drive scope permissions.
  // It can be commented out like it is below.
  // DriveApp.getStorageUsed();
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id=" +
            docId + "&exportFormat=html";
  var param = {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
