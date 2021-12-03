// FROM: https://developers.google.com/workspace/solutions/vacation-calendar
// FROM: https://gist.github.com/jc00ke/5b77c0fe7f6435061c37005731556b58

// Set the ID of the team calendar to add events to. You can find the calendar's
// ID on the settings page.
var TEAM_CALENDAR_ID = 'ENTER_TEAM_CALENDAR_ID_HERE';
// Set the email address of the Google Group that contains everyone in the team.
// Ensure the group has less than 500 members to avoid timeouts.
var GROUP_EMAIL = 'ENTER_GOOGLE_GROUP_EMAIL_HERE';
// Set some emails to ignore
var EMAILS_SKIP = [
]

var MONTHS_BEFORE = 3;
var MONTHS_IN_ADVANCE = 6;

/**
 * Setup the script to run automatically every hour.
 * Use `syncForce` to force collecting all events.
 */
function setup() {
  var triggers = ScriptApp.getProjectTriggers();
  if (triggers.length > 0) {
    throw new Error('Triggers are already setup.');
  }
  ScriptApp.newTrigger('syncSched').timeBased().everyHours(1).create();
  // Run the first sync immediately.
  syncForce();
}

function syncSched() {
  // Determine the time the the script was last run.
  var lastRun = PropertiesService.getScriptProperties().getProperty('lastRun');
  lastRun = lastRun ? new Date(lastRun) : null;

  return sync(lastRun)
}

function syncForce() {
  return sync(null);
}

/**
 * Look through the group members' public calendars and add any
 * 'vacation' or 'out of office' events to the team calendar.
 */
function sync(lastRun) {
  // Define the calendar event date range to search.
  var today = new Date();
  var minDate = new Date();
  var maxDate = new Date();
  minDate.setMonth(minDate.getMonth() - MONTHS_BEFORE);
  maxDate.setMonth(maxDate.getMonth() + MONTHS_IN_ADVANCE);
  //console.log('Date Range: ', minDate, ' => ', maxDate);

  // Get the list of users in the Google Group.
  var users = People.People.listDirectoryPeople({ "readMask": "emailAddresses", "sources": ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"] }).people;

  // For each user, find outOfOffice events in the specified date range. Import each of those to the team
  // calendar.
  var count = 0;

  users.forEach(function (user) {
    user.emailAddresses.forEach(function (email) {
      var user_email = email.value;
      var username = user_email.split('@')[0];
      // Only Company Emails
      if (user_email.split('@')[1] == GROUP_EMAIL.split('@')[1] && EMAILS_SKIP.indexOf(user_email) == -1) {
        console.log('Checking: ', user_email);
        var events = findOOOEvents(user_email, minDate, maxDate, lastRun);
        events.forEach(function (event) {
          importEvent(username, event);
          count++;
        }); // End foreach event.
      }
      else {
        // console.log('Skipping: ', user_email);
      }
    })
  });

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
  console.log('Importing: %s (%s)', event.summary, event.id);
  try {
    Calendar.Events.import(event, TEAM_CALENDAR_ID);
  } catch (e) {
    console.error('Error attempting to import event: %s. Skipping.',
      e.toString());
  }
}

/**
 * In a given user's calendar, look for outOfOffice events within the specified date range and return any such events
 * found.
 * @param {Session.User} user The user to retrieve events for.
 * @param {Date} start The starting date of the range to examine.
 * @param {Date} end The ending date of the range to examine.
 * @param {Date} optSince A date indicating the last time this script was run.
 * @return {Calendar.Event[]} An array of calendar events.
 */
function findOOOEvents(user, start, end, optSince) {
  var params = {
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
      console.log("Retrieving events for %s", user)
      response = Calendar.Events.list(user, params);
    } catch (e) {
      console.error('Error retriving events for %s: %s; skipping',
        user, e.toString());
      continue;
    }
    events = events.concat(response.items.filter(function (item) {
      return shoudImportEvent(user, item);
    }));
    pageToken = response.nextPageToken;
  } while (pageToken);
  return events;
}

/**
 * Determines if the given event should be imported into the shared team
 * calendar.
 * @param {Session.User} user The user that is attending the event.
 * @param {Calendar.Event} event The event being considered.
 * @return {boolean} True if the event should be imported.
 */
function shoudImportEvent(user, event) {
  var isOOO = event.eventType == "outOfOffice"
  //console.log("Event %s is OOO: %s", event.id, isOOO)
  /* // Old and Busted
  if (!event.organizer) {
    console.log("No organizer for event %s - %s", event.id, event.summary)
    return false
  }
  var organizerIsUser = event.organizer.email == user
  if (organizerIsUser && isOOO) {
    console.log("Event %s - %s should be imported", event.id, event.summary)
    return true;
  }
  console.log("Event %s - %s should not be imported", event.id, event.summary)
  */
  // New Hotness
  return isOOO
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
