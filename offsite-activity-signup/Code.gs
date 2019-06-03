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

var NUM_ITEMS_TO_RANK = 5;
var ACTIVITIES_PER_PERSON = 2;
var NUM_TEST_USERS = 150;

/**
 * Add custom menu items when opening the sheet.
 */
function onOpen() {
  var menu = SpreadsheetApp.getUi().createMenu("Activities");
  menu.addItem("Create form", "buildForm_");
  menu.addItem("Generate test data", "generateTestData_");
  menu.addItem("Assign activities", "assignActivities_");
  menu.addToUi();
}

/**
 * Builds a form based on the "Activity Schedule" sheet. The form
 * asks attendees to rank their top N choices of activities, where
 * N is defined by NUM_ITEMS_TO_RANK.
 */
function buildForm_() {  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activities = loadActivitySchedule_(ss).map(function(activity) {
    return activity.description;
  });
  if (ss.getFormUrl()) {
    var msg = "Form already exists. Unlink the form and try again.";
    SpreadsheetApp.getUi().alert(msg);
    return;
  }
  var form = FormApp.create("Activity Signup")
  .setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId())
  .setRequireLogin(true)
  .setAllowResponseEdits(true)
  .setLimitOneResponsePerUser(true)
  .setCollectEmail(true);
  var sectionHelpText = Utilities.formatString("Please choose your top %d activities",
                                               NUM_ITEMS_TO_RANK);
  form.addSectionHeaderItem()
    .setTitle("Activity choices")
    .setHelpText(sectionHelpText);
  for (var i = 0; i < NUM_ITEMS_TO_RANK; ++i) {
    var question = Utilities.formatString("%s choice", toOrdinal_(i + 1));
    form.addListItem()
    .setTitle(question)
    .setChoiceValues(activities);
  }
  form.addListItem()
    .setTitle("Assign other activities if choices are not available?")
    .setChoiceValues(["Yes", "No"]);
}

/**
 * Assigns activities using a random priority/random serial dictatorship approach. The results
 * are then populated into two new sheets, one listing activities per person, the other listing
 * the rosters for each activity.
 */
function assignActivities_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activities = loadActivitySchedule_(ss);
  var activityIds = activities.map(function(activity) { 
    return activity.id
  });
  var attendees = loadAttendeeResponses_(ss, activityIds);
  assignWithRandomPriority_(attendees, activities, 2);
  writeAttendeeAssignments_(ss, attendees);
  writeActivityRosters_(ss, activities);
}

/**
 * Select activities via random priority.
 */
function assignWithRandomPriority_(attendees, activities, numActivitiesPerPerson) {
  var activitiesById = activities.reduce(function(obj, activity) {
    obj[activity.id] = activity;
    return obj;
  }, {});
  for (var i = 0; i < numActivitiesPerPerson; ++i) {
    var randomizedAttendees = shuffleArray_(attendees);
    randomizedAttendees.forEach(function(attendee) {
      makeChoice_(attendee, activitiesById);
    });
  }
}

/**
 * Attempt to assign an activity for an attendee based on their preferences
 * and current schedule.
 */
function makeChoice_(attendee, activitiesById) {
  for(var i in attendee.preferences) {
    var activity = activitiesById[attendee.preferences[i]];
    if (!activity) {
      continue;
    }
    var canJoin = checkAvailability_(attendee, activity);
    if (canJoin) {
      attendee.assigned.push(activity);
      activity.roster.push(attendee);
      return;
    }
  }
}

/**
 * Checks that an activity has capacity and doesn't conflict with
 * previously assigned activities.
 */
function checkAvailability_(attendee, activity) {
  if (activity.capacity <= activity.roster.length) {
    return false;
  }
  var timesConflict = attendee.assigned.some(function(assignedActivity) {
    return !(assignedActivity.startAt.getTime() > activity.endAt.getTime() || activity.startAt.getTime() > assignedActivity.endAt.getTime());
  });
  if (timesConflict) {
    return false;
  }
  return true;
};

/**
 * Populates a sheet with the assigned activities for each attendee.
 */
function writeAttendeeAssignments_(ss, attendees) {
  var sheetName = 'Activities by person';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clear();
  sheet.appendRow(["Email address", "Activities"]);
  sheet.getRange("B1:1").merge();
  attendees.forEach(function(attendee) {
    var assignedActivities = attendee.assigned.map(function(activity) {
      return activity.description;
    });
    var row = [attendee.email].concat(assignedActivities);
    sheet.appendRow(row);
  });
  sheet.setFrozenRows(1);
  sheet.getRange("1:1").setFontWeight("bold");
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

/**
 * Populates a sheet with the rosters for each activity.
 */
function writeActivityRosters_(ss, activities) {
  var sheetName = 'Activity rosters';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  sheet.clear();
  var rows = [];
  // Format each roster as a column in the sheet
  activities.forEach(function(activity, colIndex) {
    if (!rows[0]) {
      rows[0] = fillArray_([], activities.length, '');
    }
    rows[0][colIndex] = activity.description;
    activity.roster.forEach(function(attendee, rowIndex) {
      if (!rows[rowIndex+1]) {
        rows[rowIndex+1] = fillArray_([], activities.length, '');
      }
      rows[rowIndex+1][colIndex] = attendee.email;
    });
  });
  rows.forEach(function(row) {
    sheet.appendRow(row);
  });
  sheet.setFrozenRows(1);
  sheet.getRange("1:1").setFontWeight("bold");
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

/**
 * Loads the activity schedule.
 */
function loadActivitySchedule_(ss) {
  var timeZone = ss.getSpreadsheetTimeZone();
  var sheet = ss.getSheetByName('Activity Schedule');
  var rows = sheet.getSheetValues(2, 1, sheet.getLastRow() - 1, sheet.getLastRow());
  var activities = rows.map(function(row, index) {
    var name = row[0];
    var startAt = new Date(row[1]);
    var endAt = new Date(row[2]);
    var capacity = parseInt(row[3]);
    var formattedStartAt= Utilities.formatDate(startAt, timeZone, "EEE hh:mm a");
    var formattedEndAt = Utilities.formatDate(endAt, timeZone, "hh:mm a");
    var description = Utilities.formatString("%d: %s (%s-%s)", index, name, formattedStartAt, formattedEndAt);
    return {
      id: index,
      name: name,
      description: description,
      capacity: capacity,
      startAt: startAt,
      endAt: endAt,
      roster: []
    }
  });
  return activities;
}

/**
 * Loads the attendeee response data
 */
function loadAttendeeResponses_(ss, allActivityIds) {
  var sheet = findResponseSheetForForm_(ss);
  if (!sheet || sheet.getLastRow() == 1) {
    return undefined;
  }  
  var rows = sheet.getSheetValues(2, 1, sheet.getLastRow() - 1, sheet.getLastRow());
  var attendees = rows.map(function(row) {
    var _ = row.shift(); // Ignore timestamp
    var email = row.shift();
    var autoAssign = row.pop(); 
    var preferences = row.map(function(pick) {
      var match = pick.match(/(\d+):.*/);
      if (!match) {
        return undefined;
      }
      return parseInt(match[1]);
    });    
    if (autoAssign == 'Yes') {
      // If auto assigning additional activites, append a randomized
      // list of all the activities. These will then be considered
      // as if the attendee ranked them.
      var additionalChoices = shuffleArray_(allActivityIds.slice(0));
      preferences = preferences.concat(additionalChoices);
    }    
    return {
      email: email,
      preferences: preferences,
      assigned: []
    };
  });
  return attendees;
}

/**
 * Simulates a large number of users responding to the form. This enables users
 * to quickly experience the full solution without having to collect sufficient
 * form responses through other means.
 */
function generateTestData_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findResponseSheetForForm_(ss);
  if (!sheet) {
    var msg = "No response sheet found. Create the form and try again.";
    SpreadsheetApp.getUi().alert(msg);
  }
  if (sheet.getLastRow() > 1) {
    var msg = "Response sheet is not empty, can not generate test data. Remove responses and try again.";
    SpreadsheetApp.getUi().alert(msg);
    return;
  }
  var activities = loadActivitySchedule_(ss).map(function(activity) {
    return activity.description;
  });
  var createResponseRow = function(email, choices) {
    return [new Date(), email].concat(choices).concat(["Yes"]);
  }
  for (var i = 0; i < NUM_TEST_USERS; ++i) {
    var choices = shuffleArray_(activities).slice(0, 5);
    var email = Utilities.formatString("person%d@example.com", i);
    var row = createResponseRow(email, choices);
    sheet.appendRow(row);
  }
}

/**
 * Copies and randomizes an array
 */
function shuffleArray_(array) {
  var clone = array.slice(0);
  for (var i = clone.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = clone[i];
    clone[i] = clone[j];
    clone[j] = temp;
  }
  return clone;
}

/**
 * Formats an number as an ordinal.
 */
function toOrdinal_(i) {
  // From https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number/13627586
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

/**
 * Locates the sheet containing the form responses.
 */
function findResponseSheetForForm_(ss) {
  var formUrl = ss.getFormUrl();
  if (!ss || !formUrl) {
    return undefined;
  }
  var sheets = ss.getSheets();
  for (var i in sheets) {
    if (sheets[i].getFormUrl() === formUrl) {
      return sheets[i];
    }
  }
  return undefined;
}

/**
 * Fills an array with a value ([].fill() not supported in Apps Script.)
 */
function fillArray_(arr, length, value) {
  for (var i = 0; i < length; ++i) {
    arr[i] = value;
  }
  return arr;
}

