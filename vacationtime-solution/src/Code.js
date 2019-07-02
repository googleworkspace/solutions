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

/**
* Creates menu items to run scripts.
*/
function onOpen() {
  var sheetUi = SpreadsheetApp.getUi();
  sheetUi.createMenu('TimeOff')
      .addItem('Manager Approval', 'managerApproval')
      .addItem('Notify Employees', 'notifyEmployees')
      .addToUi();
}

/**
* SCRIPT: Adds manager approval column with drop-down options.
*/
function managerApproval() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var frozenRows = sheet.getFrozenRows();

  // create column
  sheet.insertColumnAfter(lastCol);
  var setTitle = sheet.getRange(frozenRows, COLUMN_NUMBER.APPROVAL)
      .setValue('APPROVAL');

  // set drop down menu
  var bigRange = sheet.getRange(frozenRows + 1, COLUMN_NUMBER.APPROVAL,
      lastRow - frozenRows, 1);
  var dropdownValues = ['APPROVED', 'NOT APPROVED', 'IN PROGRESS'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  bigRange.setDataValidation(rule);
  bigRange.setValue('IN PROGRESS');
}

/**
* SCRIPT: If vacation time is not approved, send notification e mail.
* Otherwise, create a calendar event of the approved vacation time.
* Update the approval column + status of notification to avoid double e mails.
*/
function notifyEmployees() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var frozenRows = sheet.getFrozenRows();
  var beginningRow = frozenRows + 1;

  // create NOTIFIED column
  sheet.insertColumnAfter(lastCol);
  var setTitle = sheet.getRange(1, COLUMN_NUMBER.NOTIFIED)
      .setValue('NOTIFIED STATUS');
  var notifiedValues = ['NOTIFIED', 'NOT NOTIFIED'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(notifiedValues)
      .build();

  var notifiedColRange = sheet.getRange(beginningRow, COLUMN_NUMBER.NOTIFIED,
      lastRow - frozenRows, 1);
  notifiedColRange.setDataValidation(rule);
  notifiedColRange.setValue('NOT NOTIFIED');
  var notifiedStatus = notifiedColRange.getValues();

  for (var i = 0; i <= lastRow - beginningRow; i++) {
    // don't notify twice
    if (notifiedStatus[i][0] == 'NOTIFIED') {
      continue;
    }

    // get values all at once
    var rangeValues = sheet.getRange(i + beginningRow, COLUMN_NUMBER.EMAIL,
        1, COLUMN_NUMBER.APPROVAL - COLUMN_NUMBER.EMAIL + 1).getValues();
    var employeeEmail = rangeValues[i][0];
    var employeeName = rangeValues[i][1];
    var startDate = rangeValues[i][4];
    var endDate = rangeValues[i][5];
    var approvalStatus = rangeValues[i][6];

    // deals with approval cases
    if (approvalStatus == 'NOT APPROVED') {
      var subject = 'ERR: Vacation Time NOT Approved';
      var message = 'time not approved';
      MailApp.sendEmail(employeeEmail, subject, message);
      sheet.getRange(i + beginningRow, COLUMN_NUMBER.NOTIFIED)
          .setValue('NOTIFIED');
    } else if (approvalStatus == 'APPROVED') {
      var managerEmail = rangeValues[i][COLUMN_NUMBER.MANAGER_EMAIL -
        COLUMN_NUMBER.EMAIL];
      var managerCal = CalendarApp.getCalendarById(managerEmail);

      // create calendar event
      var event = managerCal.createEvent('APPROVED VACATION TIME FOR ' +
        employeeName, startDate, endDate, {
        description: 'Your vacation time from ' +
                                            startDate + ' to ' + endDate +
                                            ' has been approved! Enjoy!',
        guests: employeeEmail,
        sendInvites: true,
      });
      sheet.getRange(i + beginningRow, COLUMN_NUMBER.NOTIFIED).setValue('NOTIFIED');
    }
  }
}
