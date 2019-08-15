/*
1) Resources -> Advanced Google Services...
    Admin Directory API
    Google Sheets API
2) Paste your Google Doc IDs below

TODO:group used myfavoritegroup@googlegroups.com, change body
3) 
*/

var addedToGroupSubject = 'Added to group';
var addedToGroupDocId = '1umU1M67IKdvdf6UpKsGpcxhTJc_78hrlRU7OtXviCtU';

var alreadyInGroupSubject = 'Already in group';
var alreadyInGroupDocId = '16U9nddvplFHOFLmEawt8Kxzf7Vtplntlty0S0C9mePQ';

// Reviews each row upon submission from form.
function onFormSubmit() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // ObjApp library uses the rangeToObjects() method to create a list of
  // objects from the spreadsheet's rows.
  // Each row is converted into an object, which we will refer to as `user`.
  var users = ObjApp.rangeToObjects(rows);
  for (var i in users) {
    // `user` includes all the fields in a row as an object.
    var user = users[i];

    // If we make any changes to `user`, we want to keep track that there
    // were changes so we can mirror those changes in the spreadsheet.
    var rowUpdated = false;

    // Check if the group contains the user's email.
    var group = GroupsApp.getGroupByEmail(user.googleGroup);
    if (group.hasUser(user.email)) {
      // User is already in group, send a confirmation email.
      var emailBody = docToHtml(alreadyInGroupDocId);
      emailBody = emailBody.replace('{{EMAIL}}', user.email);
      MailApp.sendEmail({
        to: user.email,
        subject: alreadyInGroupSubject,
        htmlBody: emailBody,
      });

      // If the membership status is blank, means the user was already added.
      if (!user.membershipStatus) {
        user.membershipStatus = 'ALREADY ADDED';
        rowUpdated = true;
      }
    }
    else {
      // User is not part of the group, add user to group.
      var member = {email: user.email, role: 'MEMBER'};
      AdminDirectory.Members.insert(member, user.googleGroup);
  
      // Send a confirmation email that the member was now added.
      var emailBody = docToHtml(addedToGroupDocId);
      emailBody = emailBody.replace('{{EMAIL}}', user.email);
      MailApp.sendEmail({
        to: user.email,
        subject: addedToGroupSubject,
        htmlBody: emailBody,
      });

      // Mark the membership status to the current date.
      user.membershipStatus = new Date().toString();
      rowUpdated = true;
    }

    if (rowUpdated) {
      // Update the entire row in the sheet with the new `user` values.
      var userRow = ObjApp.objectToArray(headers, [user]);
      sheet.getRange(i+2, 1, 1, userRow.length).setValues(userRow);
    }
  }
}

// Fetches a Google Doc as an HTML string for email. 
function docToHtml(docId) {
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id="+docId+"&exportFormat=html";
  var param = {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
