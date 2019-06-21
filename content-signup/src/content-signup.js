// Links to send based on topics selected in form by user.
const TOPIC_URLS = {
    'Nutrition': 'https://docs.google.com/forms/d/e/1FAIpQLSch2B-ac_kS9ENNNlGeJK3Lba6Cs-UvjX5i4vNHjBnZYBv0kw/viewform',
    'Reprogramming Habits': 'https://docs.google.com/forms/d/e/1FAIpQLSch2B-ac_kS9ENNNlGeJK3Lba6Cs-UvjX5i4vNHjBnZYBv0kw/viewform',
    'Urban Food': 'https://docs.google.com/forms/d/e/1FAIpQLSch2B-ac_kS9ENNNlGeJK3Lba6Cs-UvjX5i4vNHjBnZYBv0kw/viewform',
    'Water Design': 'https://docs.google.com/forms/d/e/1FAIpQLSch2B-ac_kS9ENNNlGeJK3Lba6Cs-UvjX5i4vNHjBnZYBv0kw/viewform',
  };
  
  
  function Recipient(row) {
    // Parse topics of interest into a list (since there are multiple items that are saved in the row as blob text).
    let topics = [];
    let topicsCell = row[3];
    for (let topic in TOPIC_URLS) {
      if (topicsCell.includes(topic.toUpperCase())) {
        topics.push(topic);
      }
    }
  
    // Makes any row into a clean object.
    return {
      timestamp: Date.parse(row[0]),
      name: row[1],
      email: row[2],
      topics: topics,
      inMailingList: row[4].startsWith('Yes'),
      emailSentDate: Date.parse(row[5]),
    }
  }
  
  // Reviews each row to see who to send an email to.
  function sendCampaignEmails() {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    for (let [i, row] of sheet.getDataRange().getValues().entries()) {
      // Skip headers.
      if (i == 0)
        continue;
      
      // Create a recipient object from the row cells.
      let recipient = Recipient(row);
  
      // If an email was already sent, skip.
      if (recipient.emailSentDate)
        continue;
      
      // If there is at least one topic selected, send email to the recipient, with this subject and email body.
      if (recipient.topics.length > 0) {
        let emailBody = createEmailBody(recipient);
        MailApp.sendEmail({
          to: recipient.email,
          subject: "Howdy",
          htmlBody: emailBody,
        });
      }
      
      // Write the email sent date on the 'F' column.
      let now = new Date();
      sheet.getRange(`F${i+1}`).setValue(now.toString());
  
      // Logs activity.
      Logger.log(JSON.stringify(recipient));
    }
  }
  
  // Creates email body and includes the links based on topic.
  function createEmailBody(recipient) {
    let topicsHTML = '';
    for (let topic of recipient.topics) {
      let url = TOPIC_URLS[topic];
      topicsHTML += `<li><a href="${url}">${topic}</a></li>\n`;
    }
  
    return `Hi ${recipient.name},
  
  <p>This will help with some information:</p>
  <ul>
  ${topicsHTML}
  </ul>`;
  }
  