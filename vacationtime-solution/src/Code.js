// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var COLUMN_NUMBER = {
  EMAIL: 2,
  NAME: 3,
  START_DATE: 4,
  END_DATE: 5,
  APPROVAL: 7,
  NOTIFIED: 8,
};

var REJECTION_EMAIL_MESSAGE = 'Your vacation time request was not approved.';
var REJECTION_EMAIL_SUBJECT = 'ERR: Vacation Time Request NOT Approved';

/** TODO: Hard code your manager's email */
var MANAGER_EMAIL = 'your-manager-email';

/**
 * Add custom menu items when opening the sheet.
 */
function onOpen() {
  var sheetUi = SpreadsheetApp.getUi();
  sheetUi.createMenu('TimeOff')
      .addItem('Form Setup', 'setUpForm')
      .addItem('Manager Approval', 'managerApproval')
      .addItem('Notify Employees', 'notifyEmployees')
      .addToUi();
}

/**
 * Adds manager approval column with drop-down options.
 */
function managerApproval() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var frozenRows = sheet.getFrozenRows();
  var startRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;

  // Creates approval column.
  sheet.insertColumnAfter(lastCol);
  sheet.getRange(frozenRows, COLUMN_NUMBER.APPROVAL)
      .setValue('APPROVAL');

  // Sets drop-down menu cells in approval column.
  var approvalColumnRange = sheet.getRange(startRow, COLUMN_NUMBER.APPROVAL,
      numRows, 1);
  var dropdownValues = ['APPROVED', 'NOT APPROVED', 'IN PROGRESS'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  approvalColumnRange.setDataValidation(rule);
  approvalColumnRange.setValue('IN PROGRESS');
}

/** 
 * Creates Notified Column.
 *
 * @return {Object} Range of the notified column.
 */
function createNotifiedColumn() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var frozenRows = sheet.getFrozenRows();
  var startRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;
  
  // Sets up column properties.
  sheet.insertColumnAfter(lastCol); 
  sheet.getRange(frozenRows, COLUMN_NUMBER.NOTIFIED)
      .setValue('NOTIFIED STATUS');

  // Sets column's cells to be drop-down menus.
  var notifiedColumnRange = sheet.getRange(startRow, COLUMN_NUMBER.NOTIFIED, 
                                           numRows, 1);
  var dropdownValues = ['NOTIFIED', 'NOT NOTIFIED'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  notifiedColumnRange.setDataValidation(rule);
  notifiedColumnRange.setValue('NOT NOTIFIED');
  return notifiedColumnRange;
}

/**
 * Creates a calendar event for an employee whose vacation
 * request has been approved.
 * @param {String} employeeName Name of employee.
 * @param {String} employeeEmail Email of employee.
 * @param {date} startDate Vacation request start date.
 * @param {date} endDate Vacation request end date.
**/
function createCalEvent(employeeName, employeeEmail,
                       startDate, endDate) { 
    var managerCal = CalendarApp.getCalendarById(MANAGER_EMAIL);
    // Creates a calendar event.
    var event = managerCal.createEvent('APPROVED VACATION TIME FOR ' +
        employeeName, startDate, endDate, {
        description: 'Your vacation time from ' +
                                            startDate + ' to ' + endDate +
                                            ' has been approved! Enjoy!',
        guests: employeeEmail,
        sendInvites: true,
    });
}

/**
 * Sends e mails to employees whose vacation time request
 * was NOT approved.
 * @param {String} employeeEmail Email of employee.
 */
function sendEmails(employeeEmail) {
  MailApp.sendEmail(employeeEmail, REJECTION_EMAIL_SUBJECT, 
                        REJECTION_EMAIL_MESSAGE);
}

/**
 * Checks the approval status of each employee and notifies
 * them of their status accordingly.
 * @param {String} employeeEmail Email of employee.
 * @param {String} employeeName Name of employee.
 * @param {String} approvalStatus Manager-set status.
 * @param {date} startDate Vacation request start date.
 * @param {date} endDate Vacation request end date.
 *
 * @return {String} Value of whether or not employee needs to be notified.
 */
function checkApproval(employeeEmail, employeeName, 
                       approvalStatus, startDate, endDate) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var managerCal = CalendarApp.getCalendarById(MANAGER_EMAIL);
    
    // Checks approval status.
    if (approvalStatus == 'NOT APPROVED') {
      // Sends email of disapproval.
      sendEmails(employeeEmail);
      return 'NOTIFY';
    } else if (approvalStatus == 'APPROVED') {
      // Creates calendar event.
      createCalEvent(employeeName, employeeEmail,
                      startDate, endDate);
      return 'NOTIFY';
    } else if (approvalStatus == 'IN PROGRESS') {
      return 'DO NOT NOTIFY';
    }
}

/**
 * Checks the notification status of each employee and, if not notified,
 * notifies them of their status accordingly, through use of helper 
 * functions.
 */
function notifyEmployees() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var frozenRows = sheet.getFrozenRows();
  var startRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;
  var numCols = COLUMN_NUMBER.APPROVAL - COLUMN_NUMBER.EMAIL + 1;

  // Gets  notified column values.
  createNotifiedColumn();
  var notifiedRange = createNotifiedColumn();
  var notidiedStatus = notifiedRange.getValues();
  
  // Obtains range values of rows
  var range = sheet.getRange(startRow, COLUMN_NUMBER.EMAIL, 
                                           numRows, numCols);

  for (var i = 0; i <= lastRow - startRow; i++) {
    // Ensures does not notify twice.
    if (notifiedStatus[i][0] == 'NOTIFIED') {
      continue;
    }
    
    // Obtains necessary variables.
    var currentStartRow = i + startRow;
    var rangeValues = range.getValues();
    var employeeEmail = rangeValues[i][0];
    var employeeName = rangeValues[i][1];    
    var approvalStatus = rangeValues[i][5];
    var startDate = rangeValues[i][2];
    var endDate = rangeValues[i][3];
    
    // Checks approval of each employee & notifies them accordingly.
    var notifyKey = checkApproval(employeeEmail, employeeName, approvalStatus,
                  startDate, endDate);
    
    // Set values to 'NOTIFIED'.
    if (notifyKey == 'NOTIFY'){
      sheet.getRange(currentStartRow, COLUMN_NUMBER.NOTIFIED)
      .setValue('NOTIFIED');
    }
  }
}

/** 
 * Set up the linked form's trigger to send manager an email
 * upon form submit.
 */
function setUpForm() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var formUrl = SpreadsheetApp.getActive().getFormUrl();
  var form = FormApp.openByUrl(formUrl);
 
  // Set up on form submit trigger.
  ScriptApp.newTrigger('onFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create(); 
}

/**
 * Handle new form submissions to trigger the workflow.
 *
 * @param {Object} event Form submit event
 */
function onFormSubmit(event) {
  var response = getResponsesByName(event.response);
  sendFormSubmitEmail(response);
  
  // Load form responses into a new row.
  var row = ['New',
    '',
    response['Emoloyee Email:'],
    response['Employee Name:'],
    response['Start Date:'],
    response['End Date:'],
    response['Reason:']];
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  sheet.appendRow(row);
}

/**
 * Converts a form response to an object keyed by the item titles. Allows easier
 * access to response values.
 *
 * @param {FormResponse} response
 * @return {Object} Form values keyed by question title
 */
function getResponsesByName(response) {
  var initialValue = {
    email: response.getRespondentEmail(),
    timestamp: response.getTimestamp(),
  };
  return response.getItemResponses().reduce(function(obj, itemResponse) {
    var key = itemResponse.getItem().getTitle();
    obj[key] = itemResponse.getResponse();
    return obj;
  }, initialValue);
}
 
/**
 * Sends email notifying the manager a new vacation time request
 * has been submitted.
 *
 * @param {Object} request Form request details.
 */
function sendFormSubmitEmail(request) {
  var template = HtmlService.createTemplateFromFile('new-vacationtime-request.html');
  template.request = request;
  template.sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  var msg = template.evaluate();
  
  // Send email to manager.
  MailApp.sendEmail({
    to: MANAGER_EMAIL,
    subject: 'New Vacation Time Request',
    htmlBody: msg.getContent(),
  });
}