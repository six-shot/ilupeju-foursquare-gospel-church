/**
 * Youth Week 2027 — sign-ups from the website into a Google Sheet.
 *
 * 1. Create a new Google Sheet (e.g. "Youth Week 2027 — Sign-ups").
 * 2. In the sheet: Extensions → Apps Script. Delete what's there, paste this whole file, Save.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as: Me        Who has access: Anyone
 *    Click Deploy and allow the permissions.
 * 4. Copy the Web app URL and set it as YOUTH_SIGNUP_WEBHOOK
 *    (in .env.local for local testing, and in the hosting provider's environment variables).
 */

const HEADERS = [
  'Submitted', 'Name', 'Phone', 'Email', 'Age range', 'Church',
  'T-shirt', 'Hoodie', 'Cap', 'Tote bag', 'Note',
];

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  const wants = (key) => ((d.merch || []).indexOf(key) > -1 ? 'Yes' : '');
  sheet.appendRow([
    new Date(d.submittedAt), d.name, "'" + d.phone, d.email, d.ageRange, d.attendance,
    wants('tshirt'), wants('hoodie'), wants('cap'), wants('tote'), d.note,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
