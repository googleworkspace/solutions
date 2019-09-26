/**
 * Creates custom menu for user to run scripts
 */
function onOpen() {
  
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Form Reply Tool')
    .addItem('Enable auto draft replies','installTrigger')
    .addToUi();
  
}

/**
 * Installs a trigger on the Spreadsheet for when a Form response is submitted.
 */
function installTrigger() {
  ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onFormSubmit()
      .create();
}

/**
 * Creates a draft email for every response on a form
 *
 * @param {Object} event - Form submit event
 */
function onFormSubmit(e) {
  var responses = e.namedValues;

  // parse form response data
  var timestamp = responses.Timestamp[0];
  var email = responses['Email Address'][0].trim();
  
  // create email body
  var emailBody = createEmailBody(responses);
  
  // create draft email
  createDraft(timestamp, email, emailBody);
}

/**
 * Creates email body and includes feedback from Google Form.
 *
 * @param {string} responses - The form response data
 * @return {string} - The email body as an HTML string
 */
function createEmailBody(responses) {
  
  // parse form response data
  var name = responses.Name[0].trim();
  var industry = responses['What industry do you work in?'][0];
  var source = responses['How did you find out about product XYZ?'][0];
  var rating = responses['On a scale of 1 - 5 how would you rate this product?'][0];
  var productFeedback = responses['What could be different to make it a 5 rating?'][0];
  var otherFeedback = responses['Any other feedback?'][0];
  
  // create email body
  var htmlBody = 'Hi ' + name + ',<br><br>' +
    'Thanks for responding to our course feedback questionnaire.<br><br>' +
      'It\'s really useful to us to help improve this course.<br><br>' +
        'Have a great day!<br><br>' +
          'Thanks,<br>' +
            'Course Team<br><br>' +
              '****************************************************************<br><br>' +
                '<i>Your feedback:<br><br>' +
                  'What industry do you work in?<br><br>' +
                    industry + '<br><br>' +
                      'How did you find out about this course?<br><br>' +
                        source + '<br><br>' +
                          'On a scale of 1 - 5 how would you rate this course?<br><br>' +
                            rating + '<br><br>' +
                              'What could be different to make it a 5 rating?<br><br>' +
                                productFeedback + '<br><br>' +
                                  'Any other feedback?<br><br>' +
                                    otherFeedback + '<br><br></i>';
  
  return htmlBody; 
}

/**
 * Create a draft email with the feedback
 *
 * @param {string} timestamp Timestamp for the form response
 * @param {string} email Email address from the form response
 * @param {string} emailBody The email body as an HTML string
 */
function createDraft(timestamp, email, emailBody) {
  
  Logger.log("draft email create process started")

  // create subject line
  var subjectLine = 'Thanks for your product feedback! ' + timestamp;

  // create draft email
  GmailApp.createDraft(
    email, 
    subjectLine, 
    '', 
    { 
      htmlBody: emailBody
    }
  );
}