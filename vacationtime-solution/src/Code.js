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

// Create column number variables.
var COLUMN_NUMBER = {
  EMAIL: 2,
  NAME: 3,
  MANAGER_EMAIL: 4,
  START_DATE: 5,
  END_DATE: 6,
  APPROVAL: 8,
  NOTIFIED: 9,
};

// Global variables.
var EMAIL_MESSAGE = ' ';
var EMAIL_SUBJECT = ' ';

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
  var beginningRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;

  // Creates approval column.
  sheet.insertColumnAfter(lastCol);
  sheet.getRange(frozenRows, COLUMN_NUMBER.APPROVAL)
      .setValue('APPROVAL');

  // Sets drop-down menu cells in approval column.
  var bigRange = sheet.getRange(beginningRow, COLUMN_NUMBER.APPROVAL,
      numRows, 1);
  var dropdownValues = ['APPROVED', 'NOT APPROVED', 'IN PROGRESS'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  bigRange.setDataValidation(rule);
  bigRange.setValue('IN PROGRESS');
}

/** Creates Notified Column
**/
function createNotifiedColumn() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var frozenRows = sheet.getFrozenRows();
  var beginningRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;
    
  sheet.insertColumnAfter(lastCol);
  sheet.getRange(1, COLUMN_NUMBER.NOTIFIED)
      .setValue('NOTIFIED STATUS');
  var notifiedValues = ['NOTIFIED', 'NOT NOTIFIED'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(notifiedValues)
      .build();

  // Sets cells to be drop-down menus.
  var notifiedColRange = sheet.getRange(beginningRow, COLUMN_NUMBER.NOTIFIED,
      lastRow - frozenRows, 1);
  notifiedColRange.setDataValidation(rule);
  notifiedColRange.setValue('NOT NOTIFIED');
    
  // Return column range.
  return notifiedColRange;
}

/** 
* Helper function that creates a calendar event for employees
* whose vacation time has been approved.
**/
function createCalEvent(rangeValues, i) {
    var rangeValues = rangeValues;
    var i = i;
    
    // Get necessary values.
    var managerEmail = rangeValues[i][COLUMN_NUMBER.MANAGER_EMAIL -
        COLUMN_NUMBER.EMAIL];
    var managerCal = CalendarApp.getCalendarById(managerEmail);
    var employeeEmail = rangeValues[i][0];
    var employeeName = rangeValues[i][1];
    var startDate = rangeValues[i][4];
    var endDate = rangeValues[i][5];
    var approvalStatus = rangeValues[i][6];
                                        
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
* Checks the approval status of each employee and notifies
* them of their status accordingly.
**/
function checkApproval(rangeValues, i, currentStartRow) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var rangeValues = rangeValues;
    var currentStartRow = currentStartRow;
    var i = i;
    
    // Gets necessary values.
    var employeeEmail = rangeValues[i][0];
    var employeeName = rangeValues[i][1];
    var approvalStatus = rangeValues[i][6];
    
    // Checks approval status.
    if (approvalStatus == 'NOT APPROVED') {
      EMAIL_SUBJECT = 'ERR: Vacation Time NOT Approved';
      EMAIL_MESSAGE = 'time not approved';
        
      // Sends email of disapproval.
      MailApp.sendEmail(employeeEmail, EMAIL_SUBJECT, EMAIL_MESSAGE);
      sheet.getRange(currentStartRow, COLUMN_NUMBER.NOTIFIED)
          .setValue('NOTIFIED');
    } else if (approvalStatus == 'APPROVED') {
        createCalEvent(rangeValues, i);
        sheet.getRange(currentStartRow, COLUMN_NUMBER.NOTIFIED)
            .setValue('NOTIFIED');
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
  var beginningRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;

  // Creates notified column.
  notifiedColRange = createNotifiedColumn();
  var notifiedStatus = notifiedColRange.getValues();

  for (var i = 0; i <= lastRow - beginningRow; i++) {
    // Ensures does not notify twice.
    if (notifiedStatus[i][0] == 'NOTIFIED') {
      continue;
    }
    
    var currentStartRow = i + beginningRow;
    
    // Obtains necessary values.
    var rangeValues = sheet.getRange(currentStartRow, COLUMN_NUMBER.EMAIL,
        1, COLUMN_NUMBER.APPROVAL - COLUMN_NUMBER.EMAIL + 1).getValues();
      
    // Checks approval of each employee & notifies them accordingly.
    checkApproval(rangeValues, i, currentStartRow);
  }
}
