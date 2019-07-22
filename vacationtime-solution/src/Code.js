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
  MANAGER_EMAIL: 4,
  START_DATE: 5,
  END_DATE: 6,
  APPROVAL: 8,
  NOTIFIED: 9,
};

var REJECTION_EMAIL_MESSAGE = 'Your vacation time request was not approved.';
var REJECTION_EMAIL_SUBJECT = 'ERR: Vacation Time Request NOT Approved';

/**
 * Add custom menu items when opening the sheet.
 */
function onOpen() {
  var sheetUi = SpreadsheetApp.getUi();
  sheetUi.createMenu('TimeOff')
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
 */
function createNotifiedColumn() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var frozenRows = sheet.getFrozenRows();
  var startRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;
  
  // Sets up column properties.
  sheet.insertColumnAfter(lastCol);
  sheet.getRange(1, COLUMN_NUMBER.NOTIFIED)
      .setValue('NOTIFIED STATUS');
  var notifiedValues = ['NOTIFIED', 'NOT NOTIFIED'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(notifiedValues)
      .build();

  // Sets column's cells to be drop-down menus.
  var notifiedColRange = sheet.getRange(startRow, COLUMN_NUMBER.NOTIFIED,
      lastRow - frozenRows, 1);
  notifiedColRange.setDataValidation(rule);
  notifiedColRange.setValue('NOT NOTIFIED'); 
  return notifiedColRange;
}

/**
 * Creates a calendar event for an employee whose vacation
 * request has been approved.
 * @param {String} managerEmail Manager's email.
 * @param {String} employeeName Name of employee.
 * @param {String} employeeEmail Email of employee.
 * @param {date} startDate Vacation request start date.
 * @param {date} endDate Vacation request end date.
**/
function createCalEvent(managerEmail, employeeName, employeeEmail,
                       startDate, endDate) { 
    var managerCal = CalendarApp.getCalendarById(managerEmail);
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
**/
function sendEmails(employeeEmail) {
  MailApp.sendEmail(employeeEmail, REJECTION_EMAIL_SUBJECT, 
                        REJECTION_EMAIL_MESSAGE);
}

/**
 * Checks the approval status of each employee and notifies
 * them of their status accordingly.
 * @param {String} employeeEmail Email of employee.
 * @param {String} managerEmail Manager's email.
 * @param {String} employeeName Name of employee.
 * @param {String} approvalStatus Manager-set status.
 * @param {date} startDate Vacation request start date.
 * @param {date} endDate Vacation request end date.
**/
function checkApproval(employeeEmail, managerEmail, employeeName, 
                       approvalStatus, startDate, endDate) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var managerCal = CalendarApp.getCalendarById(managerEmail);
    
    // Checks approval status.
    if (approvalStatus == 'NOT APPROVED') {
      // Sends email of disapproval.
      sendEmails(employeeEmail);
    } else if (approvalStatus == 'APPROVED') {
      // Creates calendar event.
      createCalEvent(managerEmail, employeeName, employeeEmail,
                      startDate, endDate);
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

  // Gets  notified column values.
  var notifiedColRange = createNotifiedColumn();
  var notifiedStatus = notifiedColRange.getValues();

  for (var i = 0; i <= lastRow - startRow; i++) {
    // Ensures does not notify twice.
    if (notifiedStatus[i][0] == 'NOTIFIED') {
      continue;
    }
    
    var currentStartRow = i + startRow;
    
    // Obtains necessary values.
    var rangeValues = sheet.getRange(currentStartRow, COLUMN_NUMBER.EMAIL,
        1, COLUMN_NUMBER.APPROVAL - COLUMN_NUMBER.EMAIL + 1).getValues();
    var employeeEmail = rangeValues[i][0];
    var managerEmail = rangeValues[i][COLUMN_NUMBER.MANAGER_EMAIL -
        COLUMN_NUMBER.EMAIL];
    var employeeName = rangeValues[i][1];
    var approvalStatus = rangeValues[i][6];
    var startDate = rangeValues[i][4];
    var endDate = rangeValues[i][5];
      
    // Checks approval of each employee & notifies them accordingly.
    checkApproval(employeeEmail, managerEmail, employeeName, approvalStatus,
                  startDate, endDate);
    
    // Set values to 'NOTIFIED'.
    sheet.getRange(currentStartRow, COLUMN_NUMBER.NOTIFIED)
          .setValue('NOTIFIED');
  }
}