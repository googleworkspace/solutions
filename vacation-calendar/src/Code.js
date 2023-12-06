/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Set the ID of the team calendar to add events to. You can find the calendar's
// ID on the settings page.
var TEAM_CALENDAR_ID = 'ENTER_TEAM_CALENDAR_ID_HERE';
// Set the email address of the Google Group that contains everyone in the team.
// Ensure the group has less than 500 members to avoid timeouts.
var GROUP_EMAIL = 'ENTER_GOOGLE_GROUP_EMAIL_HERE';

var KEYWORDS = ['vacation', 'ooo', 'out of office', 'offline'];
var MONTHS_IN_ADVANCE = 3;

/**
 * Setup the script to run automatically every hour.
 */
function setup() {
  var triggers = ScriptApp.getProjectTriggers();
  if (triggers.length > 0) {
    throw new Error('Triggers are already setup.');
  }
  ScriptApp.newTrigger('sync').timeBased().everyHours(1).create();
  // Run the first sync immediately.
  sync();
}

/**
 * Look through the group members' public calendars and add any
 * 'vacation' or 'out of office' events to the team calendar.
 */
function sync() {
  // Define the calendar event date range to search.
  var today = new Date();
  var maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + MONTHS_IN_ADVANCE);

  // Determine the time the the script was last run.
  var lastRun = PropertiesService.getScriptProperties().getProperty('lastRun');
  lastRun = lastRun ? new Date(lastRun) : null;

  // Get the list of users in the Google Group.
  var users = GroupsApp.getGroupByEmail(GROUP_EMAIL).getUsers();

  // For each user, find events having one or more of the keywords in the event
  // summary in the specified date range. Import each of those to the team
  // calendar.
  var count = 0;
  users.forEach(function(user) {
    var username = user.getEmail().split('@')[0];
    KEYWORDS.forEach(function(keyword) {
      var events = findEvents(user, keyword, today, maxDate, lastRun);
      events.forEach(function(event) {
        if (importEvent(username, event)) {
          count++;
        }
      }); // End foreach event.
    }); // End foreach keyword.
  }); // End foreach user.

  PropertiesService.getScriptProperties().setProperty('lastRun', today);
  console.log('Imported ' + count + ' events');
}

/**
 * Imports the given event from the user's calendar into the shared team
 * calendar.
 * @param {string} username The team member that is attending the event.
 * @param {Calendar.Event} event The event to import.
 */
function importEvent(username, event) {
  event.summary = '[' + username + '] ' + event.summary;
  event.organizer = {
    id: TEAM_CALENDAR_ID,
  };
  event.attendees = [];

  // If the event is not of type 'default', it can't be imported, so it needs
  // to be changed.
  if (event.eventType != 'default') {
    event.eventType = 'default';
    delete event.outOfOfficeProperties;
    delete event.focusTimeProperties;
  }
  
  console.log('Importing: %s', event.summary);
  try {
    Calendar.Events.import(event, TEAM_CALENDAR_ID);
  } catch (e) {
    console.error('Error attempting to import event: %s. Skipping.',
        e.toString());
  }
}


/**
 * In a given user's calendar, look for occurrences of the given keyword
 * in events within the specified date range and return any such events
 * found.
 * @param {Session.User} user The user to retrieve events for.
 * @param {string} keyword The keyword to look for.
 * @param {Date} start The starting date of the range to examine.
 * @param {Date} end The ending date of the range to examine.
 * @param {Date} optSince A date indicating the last time this script was run.
 * @return {Calendar.Event[]} An array of calendar events.
 */
function findEvents(user, keyword, start, end, optSince) {
  var params = {
    q: keyword,
    timeMin: formatDateAsRFC3339(start),
    timeMax: formatDateAsRFC3339(end),
    showDeleted: true,
  };
  if (optSince) {
    // This prevents the script from examining events that have not been
    // modified since the specified date (that is, the last time the
    // script was run).
    params.updatedMin = formatDateAsRFC3339(optSince);
  }
  var pageToken = null;
  var events = [];
  do {
    params.pageToken = pageToken;
    var response;
    try {
      response = Calendar.Events.list(user.getEmail(), params);
    } catch (e) {
      console.error('Error retriving events for %s, %s: %s; skipping',
          user, keyword, e.toString());
      continue;
    }
    events = events.concat(response.items.filter(function(item) {
      return shoudImportEvent(user, keyword, item);
    }));
    pageToken = response.nextPageToken;
  } while (pageToken);
  return events;
}

/**
 * Determines if the given event should be imported into the shared team
 * calendar.
 * @param {Session.User} user The user that is attending the event.
 * @param {string} keyword The keyword being searched for.
 * @param {Calendar.Event} event The event being considered.
 * @return {boolean} True if the event should be imported.
 */
function shoudImportEvent(user, keyword, event) {
  // Filter out events where the keyword did not appear in the summary
  // (that is, the keyword appeared in a different field, and are thus
  // is not likely to be relevant).
  if (event.summary.toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
    return false;
  }
  if (!event.organizer || event.organizer.email == user.getEmail()) {
    // If the user is the creator of the event, always import it.
    return true;
  }
  // Only import events the user has accepted.
  if (!event.attendees) return false;
  var matching = event.attendees.filter(function(attendee) {
    return attendee.self;
  });
  return matching.length > 0 && matching[0].responseStatus == 'accepted';
}

/**
 * Return an RFC3339 formated date String corresponding to the given
 * Date object.
 * @param {Date} date a Date.
 * @return {string} a formatted date string.
 */
function formatDateAsRFC3339(date) {
  return Utilities.formatDate(date, 'UTC', 'yyyy-MM-dd\'T\'HH:mm:ssZ');
}
