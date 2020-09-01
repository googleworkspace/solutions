var slideTemplateId = "SLIDE-ID-GOES-HERE"; // Sample: https://docs.google.com/spreadsheets/d/1cgK1UETpMF5HWaXfRE6c0iphWHhl7v-dQ81ikFtkIVk
var tempFolderId = "TEMPORARY-FOLDER-ID-GOES-HERE"; // Create an empty folder in Google Drive

/**
 * Creates a custom menu "Appreciation" in the spreadsheet
 * with drop-down options to create and send certificates
 */
function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Appreciation')
  .addItem('Create certificates', 'createCertificates')
  .addSeparator()
  .addItem('Send certificates', 'sendCertificates')
  .addToUi();
}

/**
 * Creates a personalized certificate for each employee
 * and stores every individual Slides doc on Google Drive
 */
function createCertificates() {
  
  // Load the Google Slide template file
  var template = DriveApp.getFileById(slideTemplateId);
  
  // Get all employee data from the spreadsheet and identify the headers
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var empNameIndex = headers.indexOf("Employee Name");
  var dateIndex = headers.indexOf("Date");
  var managerNameIndex = headers.indexOf("Manager Name");
  var titleIndex = headers.indexOf("Title");
  var compNameIndex = headers.indexOf("Company Name");
  var empEmailIndex = headers.indexOf("Employee Email");
  var empSlideIndex = headers.indexOf("Employee Slide");
  var statusIndex = headers.indexOf("Status");
  
  // Iterate through each row to capture individual details
  for (var i = 1; i < values.length; i++) {
    var rowData = values[i];
    var empName = rowData[empNameIndex];
    var date = rowData[dateIndex];
    var managerName = rowData[managerNameIndex];
    var title = rowData[titleIndex];
    var compName = rowData[compNameIndex];
    
    // Make a copy of the Slide template and rename it with employee name
    var tempFolder = DriveApp.getFolderById(tempFolderId);
    var empSlideId = template.makeCopy(tempFolder).setName(empName).getId();        
    var empSlide = SlidesApp.openById(empSlideId).getSlides()[0];
    
    // Replace placeholder values with actual employee related details
    empSlide.replaceAllText("Employee Name", empName);
    empSlide.replaceAllText("Date", "Date: " + Utilities.formatDate(date, Session.getScriptTimeZone(), "MMMM dd, yyyy"));
    empSlide.replaceAllText("Your Name", managerName);
    empSlide.replaceAllText("Title", title);
    empSlide.replaceAllText("Company Name", compName);
    
    // Update the spreadsheet with the new Slide Id and status
    sheet.getRange(i + 1, empSlideIndex + 1).setValue(empSlideId);
    sheet.getRange(i + 1, statusIndex + 1).setValue("CREATED");
    SpreadsheetApp.flush();
  }
}

/**
 * Send an email to each individual employee
 * with a PDF attachment of their appreciation certificate
 */
function sendCertificates() {
  
  // Get all employee data from the spreadsheet and identify the headers
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var empNameIndex = headers.indexOf("Employee Name");
  var dateIndex = headers.indexOf("Date");
  var managerNameIndex = headers.indexOf("Manager Name");
  var titleIndex = headers.indexOf("Title");
  var compNameIndex = headers.indexOf("Company Name");
  var empEmailIndex = headers.indexOf("Employee Email");
  var empSlideIndex = headers.indexOf("Employee Slide");
  var statusIndex = headers.indexOf("Status");
  
  // Iterate through each row to capture individual details
  for (var i = 1; i < values.length; i++) {
    var rowData = values[i];
    var empName = rowData[empNameIndex];
    var date = rowData[dateIndex];
    var managerName = rowData[managerNameIndex];
    var title = rowData[titleIndex];
    var compName = rowData[compNameIndex];
    var empSlideId = rowData[empSlideIndex];
    var empEmail = rowData[empEmailIndex];
    
    // Load the employee's personalized Google Slide file
    var attachment = DriveApp.getFileById(empSlideId);
    
    // Setup the required parameters and send them the email
    var senderName = "CertBot";
    var subject = empName + ", you're awesome!";
    var body = "Please find your employee appreciation certificate attached."
    + "\n\n" + compName + " team";
    GmailApp.sendEmail(empEmail, subject, body, {
      attachments: [attachment.getAs(MimeType.PDF)],
      name: senderName
    });
    
    // Update the spreadsheet with email status
    sheet.getRange(i + 1, statusIndex + 1).setValue("SENT");
    SpreadsheetApp.flush();
  }
}
