// Paste into Extensions > Apps Script of the Google Sheet that should hold the leads.
const NOTIFY_EMAIL = 'connect@p3q.in'; // inbox-only address, receives the alert
const CC_EMAIL = 'p3q.tech@gmail.com'; // Google account that owns the sheet
const HEADERS = ['Time', 'Source', 'Owner', 'Arena', 'City', 'Contact', 'Modules', 'PCs', 'Branches', 'Notes'];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      new Date(), d.Source || '', d.Owner || '', d.Arena || '', d.City || '',
      "'" + (d.Contact || ''), d.Modules || '', d.PCs || '', d.Branches || '', d.Notes || '',
    ]);
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      cc: CC_EMAIL,
      subject: 'New ArenaOS request: ' + (d.Arena || d.Owner || 'unknown'),
      body: Object.keys(d).map(function (k) { return k + ': ' + d[k]; }).join('\n'),
    });
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
