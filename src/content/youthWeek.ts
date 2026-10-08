/**
 * Youth Week — everything on /youth-week-2027 lives here. Edit this file to update the page.
 *
 * The day-by-day programme is deliberately NOT listed: it is still with the youth
 * committee. Add it here (and to the page) once it is agreed.
 */

export const youthWeek = {
  year: 2027,
  theme: 'Sent Ones',
  dates: '12 – 18 April 2027',
  dateMain: '12–18 Apr',
  dateSub: '2027',
  scriptures: [
    { ref: 'Isaiah 6:8', text: 'Here am I; send me.' },
    { ref: 'John 20:21', text: 'As my Father hath sent me, even so send I you.' },
  ],
  intro:
    'One week for the youth of Ilupeju Foursquare to go deep in the Word, grow closer to one another, and step out as people God has sent to our campuses, our workplaces, our streets and our families.',
} as const;

/** What the week holds, in broad strokes (no dates or speakers until the committee confirms them). */
export const expect = [
  { title: 'The Word', line: 'Interactive Bible study. Conversation, not lectures, and your questions answered.' },
  { title: 'Relationships', line: 'An honest panel on godly dating and marriage, with an anonymous question box.' },
  { title: 'Real life', line: 'Career sessions and real stories of setbacks, lessons and God’s faithfulness.' },
  { title: 'Prayer', line: 'The prayer walk returns.' },
  { title: 'Outreach', line: 'Taking the gospel and a helping hand into our community.' },
  { title: 'Fun', line: 'Football, games with prizes, a treasure hunt, karaoke and open mic.' },
];

export const ageRanges = ['13 – 17', '18 – 24', '25 – 30', '31 and above'] as const;

export const attendance = [
  'I am a member of Ilupeju Foursquare',
  'I attend another church',
  'I do not attend a church yet',
] as const;

/** Merch we are asking for feedback on: people tick the items they would buy. */
export const merch = [
  { key: 'tshirt', label: 'T-shirt' },
  { key: 'hoodie', label: 'Hoodie' },
  { key: 'cap', label: 'Cap' },
  { key: 'tote', label: 'Tote bag' },
] as const;

export type MerchKey = (typeof merch)[number]['key'];

/** Shape of one sign-up, as sent by the form and stored by /api/youth-signup. */
export type YouthSignup = {
  name: string;
  phone: string;
  email: string;
  ageRange: string;
  attendance: string;
  merch: MerchKey[];
  note: string;
};
