// Set the ID of the team calendar to add events to. You can find the calendar's
// ID on the settings page.
var TEAM_CALENDAR_ID = 'ENTER_TEAM_CALENDAR_ID_HERE';
// Set the email address of the Google Group that contains everyone in the team.
var GROUP_EMAIL = 'ENTER_GOOGLE_GROUP_EMAIL_HERE';

var KEYWORDS = ['vacation', 'ooo', 'out of office', 'offline'];
var MONTHS_IN_ADVANCE = 3;

/**
 * Setup the script to run automatically every hour.
 */
function setup() {
  var triggers= ScriptApp.getProjectTriggers();
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
        event.summary = '[' + username + '] ' + event.summary;
        event.organizer = {
          id: TEAM_CALENDAR_ID
        };
        event.attendees = [];
        console.log('Importing: %s', event.summary);
        try {
          Calendar.Events.import(event, TEAM_CALENDAR_ID);
          count++;
        } catch (e) {
          console.error('Error attempting to import event: %s. Skipping.',
              e.toString());
        }
      }); // End foreach event.
    }); // End foreach keyword.
  }); // End foreach user.

  PropertiesService.getScriptProperties().setProperty('lastRun', today);
  console.log('Imported ' + count + ' events');
}

/**
 * In a given user's calendar, look for occurrences of the given keyword
 * in events within the specified date range and return any such events
 * found.
 * @param {string} user the user's primary email String.
 * @param {string} keyword the keyword String to look for.
 * @param {Date} start the starting Date of the range to examine.
 * @param {Date} end the ending Date of the range to examine.
 * @param {Date} opt_since a Date indicating the last time this script was run.
 * @return {object[]} an array of calendar event Objects.
 */
function findEvents(user, keyword, start, end, opt_since) {
  var params = {
    q: keyword,
    timeMin: formatDate(start),
    timeMax: formatDate(end),
    showDeleted: true
  };
  if (opt_since) {
    // This prevents the script from examining events that have not been
    // modified since the specified date (that is, the last time the
    // script was run).
    params['updatedMin'] = formatDate(opt_since);
  }
  var response;
  try {
    response = Calendar.Events.list(user.getEmail(), params);
  } catch (e) {
    console.error('Error retriving events for %s, %s: %s; skipping',
        user, keyword, e.toString());
    return [];
  }
  return response.items.filter(function(item) {
    // Filter out events where the keyword did not appear in the summary
    // (that is, the keyword appeared in a different field, and are thus
    // is not likely to be relevant).
    if (item.summary.toLowerCase().indexOf(keyword) < 0) {
      return false;
    }
    // If the event was created by someone other than the user, only include
    // it if the user has marked it as 'accepted'.
    if (item.organizer && item.organizer.email != user) {
      if (!item.attendees) return false;
      var matching = item.attendees.filter(function(attendee) {
        return attendee.self;
      });
      return matching.length > 0 && matching[0].responseStatus == 'accepted';
    }
    return true;
  });
}

/**
 * Return an RFC3339 formated date String corresponding to the given
 * Date object.
 * @param {Date} date a Date.
 * @return {string} a formatted date string.
 */
function formatDate(date) {
  return Utilities.formatDate(date, 'UTC', 'yyyy-MM-dd\'T\'HH:mm:ssZ');
}
