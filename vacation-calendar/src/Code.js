// FROM: https://developers.google.com/workspace/solutions/vacation-calendar
// FROM: https://gist.github.com/jc00ke/5b77c0fe7f6435061c37005731556b58

// Set the ID of the team calendar to add events to. You can find the calendar's
// ID on the settings page.
var TEAM_CALENDAR_ID = 'ENTER_TEAM_CALENDAR_ID_HERE';
// Include other Holiday calendars
var HOLIDAY_CALENDARS = new Map([
  // ['HCALENDAR_TITLE', 'HCALENDAR_URL'],
])
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
  var users = People.People.listDirectoryPeople({ "readMask": "names,emailAddresses", "sources": ["DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE"] }).people;

  // For each user, find outOfOffice events in the specified date range. Import each of those to the team
  // calendar.
  var count = 0;

  // User OOO
  users.forEach(function (user) {
    user.emailAddresses.forEach(function (email) {
      var user_email = email.value;
      var username = user_email.split('@')[0];  // Fallback "username"
      var user_names = user.getNames()
      if (user_names !== undefined && user_names.length > 0) {
        if (user_names.length > 1) {
          console.warn("User [", username, "] has multiple names, taking the first one.");
        }
        username = user_names[0].displayName;
      }
      // Only Company Emails
      if (user_email.split('@')[1] == GROUP_EMAIL.split('@')[1] && EMAILS_SKIP.indexOf(user_email) == -1) {
        //console.log('Checking: ', user_email);
        var events = findCalendarEvents(user_email, minDate, maxDate, lastRun, sie=sieOOO);
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

  // Holiday Calendars
  HOLIDAY_CALENDARS.forEach(function (hcid, hlabel) {
    //console.log("Checking Holidays @", hlabel);
    var events = findCalendarEvents(hcid, minDate, maxDate, lastRun, sie=sieAll);
    events.forEach(function (event) {
      var prefix = "Holiday @ " + hlabel;
      event.id = null;  // Generate a new event ID
      // TODO: Check Regional holidays (name ends with " ($LOCATION)")
      importEvent(prefix, event);
      count++;
    }); // End foreach event.
  });

  PropertiesService.getScriptProperties().setProperty('lastRun', today);
  console.log('Imported ' + count + ' events');
}

function cleanTeam() {
  var events = findCalendarEvents(TEAM_CALENDAR_ID, null, null, null, sie=sieAll);
  events.forEach(function (event) {
    console.log('Delete[%s]', event.id);
    Calendar.Events.remove(TEAM_CALENDAR_ID, event.id);
  });
}

/**
 * Imports the given event into the shared team calendar.
 * @param {string} eprefix: Event Prefix
 * @param {Calendar.Event} event The event to import.
 */
function importEvent(eprefix, event) {
  if (eprefix) {
    event.summary = '[' + eprefix + '] ' + event.summary;
  }
  event.organizer = {
    id: TEAM_CALENDAR_ID,
  };
  event.attendees = [];
  console.log('Importing[%s]: %s', event.id, event.summary);
  try {
    Calendar.Events.import(event, TEAM_CALENDAR_ID);
  } catch (e) {
    console.error('SKIP: Error attempting to import event: %s', e.toString());
  }
}

function findCalendarEvents(user, start, end, optSince, sie) {
  var params = {
  };
  if (start && end) {
    params['timeMin'] = formatDateAsRFC3339(start);
    params['timeMax'] = formatDateAsRFC3339(end);
    params['showDeleted'] = true;
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
    events = events.concat(response.items.filter(sie));
    pageToken = response.nextPageToken;
  } while (pageToken);
  return events;
}

// SIE: All
function sieAll(event) {
  return true;
}
// SIE: Out of Office Events
function sieOOO(event) {
  return event.eventType == "outOfOffice"
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
