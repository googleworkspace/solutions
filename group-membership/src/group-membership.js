var addedToGroupDocId = '1-ajkkIP8gUWqMcnpXhkqwlM_2Y18USLdJ-pFZdDEZ70';
var addedToGroupSubject = 'Added to group';

/**
 * Must click this function from the top drop-down and click 'run' icon to
 * create the onEdit trigger.
 */
function installTrigger() {
  ScriptApp.newTrigger('onEdit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onEdit()
      .create();
}

/**
 * Sends a customized email when a user is added to a group.
 *
 */
function onEdit(e) {
  // Get an object from the modified row.
  var sheet = SpreadsheetApp.getActiveSheet();
  var headers = sheet.getDataRange().offset(0, 0, 1).getValues()[0];
  var row = sheet.getRange(e.range.getRow(), 1, 1, headers.length).getValues();
  var responses = ObjApp.splitRangesToObjects(headers, row)[0];

  // Get all the response values and store them in local variables.
  // ObjApp will create an object with all the fields in camelCase.
  var userEmail = responses.email.trim();
  var groupEmail = responses.googleGroup.trim();
  var allowed = responses.allowed.toLowerCase();

  // If the user is not allowed, exit from function.
  if (allowed != 'yes')
    return;
  
  // Check if the group contains the user's email.
  var group = GroupsApp.getGroupByEmail(groupEmail);
  if (!group.hasUser(userEmail)) {
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
    responses.status = 'Newly added';
  }
  else {
    // User is already in group, do nothing.
    responses.status = 'Already in group';
  }

  // Append the status on the spreadsheet to the responses' row.
  var sheet = SpreadsheetApp.getActiveSheet();
  row = ObjApp.objectToArray(headers, [responses])[0];
  sheet.getRange(e.range.getRow(), 1, 1, row.length).setValues([row]);
  
  Logger.log("responses=" + JSON.stringify(responses));
}

/**
 * Fetches a Google Doc as an HTML string.
 * 
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id=" +
            docId + "&exportFormat=html";
  var param = {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
