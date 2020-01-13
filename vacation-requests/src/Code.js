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

var APPROVED_DROPDOWN = {
  APPROVED: 'APPROVED',
  NOT_APPROVED: 'NOT APPROVED',
  IN_PROGRESS: 'IN PROGRESS',
};

var NOTIFIED_DROPDOWN = {
  NOTIFIED: 'NOTIFIED',
  NOT_NOTIFIED: 'NOT NOTIFIED',
};

var VACATION_REASONS = [
  'Vacation',
  'Sick leave',
  'Maternity/Paternity',
  'Bereavement',
  'Leave of absence',
  'Personal time',
];

var REJECTION_EMAIL_SUBJECT = 'ERR: Vacation Time Request NOT Approved';
var EVENT_TITLE = 'VACATION FOR ';

/** TODO: Hard code your manager's email */
var MANAGER_EMAIL = 'your-manager-email';

/**
 * Add custom menu items when opening the sheet.
 */
function onOpen() {
  var sheetUi = SpreadsheetApp.getUi();
  sheetUi.createMenu('TimeOff')
      .addItem('Form Setup', 'setUpForm')
      .addItem('Column Setup', 'createNewColumns')
      .addItem('Notify Employees', 'notifyEmployees')
      .addToUi();
}

/**
 * Creates a new column for a manager to input her approval
 * of each employee's vacation request. Uses a helper function
 * to create an additional notification column.
 */
function createNewColumns() {
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
  var dropdownValues = [APPROVED_DROPDOWN.APPROVED, APPROVED_DROPDOWN.NOT_APPROVED,
    APPROVED_DROPDOWN.IN_PROGRESS];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  approvalColumnRange.setDataValidation(rule);
  approvalColumnRange.setValue(APPROVED_DROPDOWN.IN_PROGRESS);

  // Calls helper function to repeat the above code but for the NOTIFIED column.
  createNotifiedColumn();
}

/**
 * Adds a column to allow managers to view which employees
 * have or have not yet been notified. The value of the cells
 * is set to 'NOT NOTIFIED' on default & changed accordingly.
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
  var dropdownValues = [NOTIFIED_DROPDOWN.NOTIFIED, NOTIFIED_DROPDOWN.NOT_NOTIFIED];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  notifiedColumnRange.setDataValidation(rule);
  notifiedColumnRange.setValue(NOTIFIED_DROPDOWN.NOT_NOTIFIED);
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
  var descriptionText = Utilities.formatString('Your vacation time from %s to %s has been approved. Enjoy!',
      startDate, endDate);
  var event = managerCal.createEvent(EVENT_TITLE + employeeName,
      startDate, endDate, {
        description: descriptionText,
        guests: employeeEmail,
        sendInvites: true,
      });
}

/**
 * Sends emails to employees whose vacation time request
 * was NOT approved.
 * @param {String} employeeEmail Email of employee.
 */
function sendRejectionEmail(employeeEmail, startDate, endDate) {
  // Craft specific e mail body.
  var emailBody = Utilities.formatString('Your vacation time request from %s to %s has NOT been approved.',
      startDate, endDate);

  // Send email.
  MailApp.sendEmail(employeeEmail, REJECTION_EMAIL_SUBJECT,
      emailBody);
}

/**
 * Checks the approval status of each employee and notifies
 * them of their status accordingly, either through creating
 * a shared calendar event or sending a notification email.
 *
 * @param {String} employeeEmail Email of employee.
 * @param {String} employeeName Name of employee.
 * @param {String} approvalStatus Manager-set status.
 * @param {date} startDate Vacation request start date.
 * @param {date} endDate Vacation request end date.
 *
 * @return {String} Value of whether or not employee needs to be notified.
 */
function approvalCase(employeeEmail, employeeName,
    approvalStatus, startDate, endDate) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var managerCal = CalendarApp.getCalendarById(MANAGER_EMAIL);

  // Checks approval status.
  if (approvalStatus == APPROVED_DROPDOWN.NOT_APPROVED) {
    // Sends email of disapproval.
    sendRejectionEmail(employeeEmail, startDate, endDate);
    return 'NOTIFY';
  } else if (approvalStatus == APPROVED_DROPDOWN.APPROVED) {
    // Creates calendar event.
    createCalEvent(employeeName, employeeEmail,
        startDate, endDate);
    return 'NOTIFY';
  } else if (approvalStatus == APPROVED_DROPDOWN.IN_PROGRESS) {
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
  var numRows = lastRow - startRow;
  var numCols = COLUMN_NUMBER.NOTIFY - COLUMN_NUMBER.EMAIL;

  // Go through every employee's information.
  for (var i = 0; i < numRows; i++) {
    var currentStartRow = i + startRow;

    // Obtains current employee's values.
    var range = sheet.getRange(currentStartRow, COLUMN_NUMBER.EMAIL,
        1, COLUMN_NUMBER.NOTIFIED - COLUMN_NUMBER.EMAIL + 1);
    var rangeValues = range.getValues();

    // Ensures does not notify twice.
    var notifiedStatus = rangeValues[0][COLUMN_NUMBER.NOTIFIED - COLUMN_NUMBER.EMAIL];
    if (notifiedStatus == NOTIFIED_DROPDOWN.NOTIFIED) {
      continue;
    }

    // Obtains necessary variables for notification.
    var employeeEmail = rangeValues[0][COLUMN_NUMBER.EMAIL - COLUMN_NUMBER.EMAIL];
    var employeeName = rangeValues[0][COLUMN_NUMBER.NAME - COLUMN_NUMBER.EMAIL];
    var startDate = rangeValues[0][COLUMN_NUMBER.START_DATE - COLUMN_NUMBER.EMAIL];
    var endDate = rangeValues[0][COLUMN_NUMBER.END_DATE - COLUMN_NUMBER.EMAIL];
    var approvalStatus = rangeValues[0][COLUMN_NUMBER.APPROVAL - COLUMN_NUMBER.EMAIL];

    // Calls helper function to check approval & notify accordingly.
    var notifyKey = approvalCase(employeeEmail, employeeName, approvalStatus,
        startDate, endDate);

    // Set values to 'NOTIFIED'.
    if (notifyKey == 'NOTIFY') {
      sheet.getRange(currentStartRow, COLUMN_NUMBER.NOTIFIED)
          .setValue(NOTIFIED_DROPDOWN.NOTIFIED);
    }
  }
}

/**
 * Set up the Vacation Time Requests form, & link the form's trigger to
 * send manager an email when a new request is submitted.
 */
function setUpForm() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (sheet.getFormUrl()) {
    var msg = 'Form already exists. Unlink the form and try again.';
    SpreadsheetApp.getUi().alert(msg);
    return;
  }

  // Create the form.
  var form = FormApp.create('Vacation Time Requests')
      .setCollectEmail(true)
      .setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId())
      .setLimitOneResponsePerUser(false);
  form.addTextItem().setTitle('Employee Name:').setRequired(true);
  form.addDateItem().setTitle('Start Date:').setRequired(true);
  form.addDateItem().setTitle('End Date:').setRequired(true);
  form.addListItem().setTitle('Reason:').setChoiceValues(VACATION_REASONS);

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
