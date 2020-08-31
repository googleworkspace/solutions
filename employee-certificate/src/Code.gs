var slideTemplateId = "SLIDE-ID-GOES-HERE"; // Demo: https://docs.google.com/presentation/d/1bFj09xI7g_kbA76Xb60tYyxVdi-zrpm6zQ6gu696vKs
var sheetId = "SHEET-ID-GOES-HERE"; // Demo: https://docs.google.com/spreadsheets/d/1cgK1UETpMF5HWaXfRE6c0iphWHhl7v-dQ81ikFtkIVk
var tempFolderId = "TEMPORARY-FOLDER-ID-GOES-HERE";

function createCertificates() {
  var template = DriveApp.getFileById(slideTemplateId);
  
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
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
  
  for (var i = 1; i < values.length; i++) {
    var rowData = values[i];
    var empName = rowData[empNameIndex];
    var date = rowData[dateIndex];
    var managerName = rowData[managerNameIndex];
    var title = rowData[titleIndex];
    var compName = rowData[compNameIndex];
    
    var tempFolder = DriveApp.getFolderById(tempFolderId);
    var empSlideId = template.makeCopy(tempFolder).setName(empName).getId();        
    var empSlide = SlidesApp.openById(empSlideId).getSlides()[0];
    
    empSlide.replaceAllText("Employee Name", empName);
    empSlide.replaceAllText("Date", "Date: " + Utilities.formatDate(date, Session.getScriptTimeZone(), "MMMM dd, yyyy"));
    empSlide.replaceAllText("Your Name", managerName);
    empSlide.replaceAllText("Title", title);
    empSlide.replaceAllText("Company Name", compName);
    
    sheet.getRange(i + 1, empSlideIndex + 1).setValue(empSlideId);
    sheet.getRange(i + 1, statusIndex + 1).setValue("CREATED");
    SpreadsheetApp.flush();
  }
}

function sendCertificates() {
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
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
  
  for (var i = 1; i < values.length; i++) {
    var rowData = values[i];
    var empName = rowData[empNameIndex];
    var date = rowData[dateIndex];
    var managerName = rowData[managerNameIndex];
    var title = rowData[titleIndex];
    var compName = rowData[compNameIndex];
    var empSlideId = rowData[empSlideIndex];
    var empEmail = rowData[empEmailIndex];
    
    var attachment = DriveApp.getFileById(empSlideId);
    var senderName = "CertBot";
    var subject = empName + ", you're awesome!";
    var body = "Please find your employee appreciation certificate attached."
    + "\n\n" + compName + " team";
    GmailApp.sendEmail(empEmail, subject, body, {
      attachments: [attachment.getAs(MimeType.PDF)],
      name: senderName
    });
    sheet.getRange(i + 1, statusIndex + 1).setValue("SENT");
    SpreadsheetApp.flush();
  }
}
