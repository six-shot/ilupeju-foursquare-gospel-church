/**
 * All church content lives here — edit this file to update the website.
 *
 * `source` notes say where each verified fact came from. Anything marked
 * `verified: false` could NOT be confirmed online and is shown on the site as
 * "to be confirmed" / hidden until the church fills it in. Do not publish
 * invented details: replace the TODO values with real information first.
 */

import type { ImageKey } from './images';

export type Verified<T> = { value: T; verified: boolean; source?: string };

export const church = {
  name: {
    value: 'Ilupeju Foursquare Gospel Church',
    verified: true,
    source: 'Facebook page intro, facebook.com/foursquareilupeju',
  },
  shortName: 'Foursquare Ilupeju',
  denomination: {
    value: 'The Foursquare Gospel Church in Nigeria',
    verified: true,
    source: 'foursquare.org.ng',
  },
  address: {
    value: '33 Iseyin Street, Palm Grove, Lagos, Nigeria',
    verified: true,
    source: 'Facebook page contact info (listed as "33 Iseyin Street palm grove, Lagos")',
  },
  phone: { value: '0803 333 6834', verified: true, source: 'Facebook page contact info' },
  email: { value: 'foursquareilupejuchurch@gmail.com', verified: true, source: 'Facebook page contact info' },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=33+Iseyin+Street+Palm+Grove+Lagos',
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/foursquareilupeju/', verified: true },
    // TODO: add Instagram / YouTube handles once the church confirms them.
  ],
  theme: {
    value: 'A New Class of People',
    verified: true,
    source: 'Provided by the church',
  },
  district: {
    value: 'Ilupeju Missionary District',
    verified: true,
    source: 'District Convocation 2026 media supplied by the church media team',
  },
} as const;

/** Weekly programme — supplied by the church. */
export const services: { day: string; name: string; time: string; note?: string }[] = [
  { day: 'Sunday', name: 'First Service — The Next Gen Service', time: '7:30 – 9:30am' },
  { day: 'Sunday', name: 'Sunday School', time: '9:30 – 10:10am' },
  { day: 'Sunday', name: 'Second Service', time: '10:10am', note: 'Starts immediately after Sunday School' },
  { day: 'Tuesday', name: 'Hour of Dominion', time: '6:30 – 7:30pm' },
  { day: 'Wednesday', name: 'Digging Deep Bible Study', time: '6:30 – 8:00pm' },
  // TODO: confirm the Thursday start time (supplied as "6::0pm").
  { day: 'Thursday', name: 'Prayer Meeting', time: '6:30pm' },
];

/**
 * Pastors. Names supplied by the church (transferred from Foursquare Grand Assembly
 * Ilupeju, whose YouTube channel lists Rev. Femi Ogbonmide as Senior Pastor and whose
 * Instagram credits Pst. Mrs. Yinka Ogbonmide). Roles here: confirm/adjust as needed.
 */
export const leadership: { name: string; title: string; role: string; image: ImageKey }[] = [
  { name: 'Femi Ogbonmide', title: 'Rev. Dr.', role: 'Pastor', image: 'pastorFemi' },
  { name: 'Yinka Ogbonmide', title: 'Pst. Mrs.', role: 'Pastor', image: 'pastorYinka' },
];

/** National leadership (verified). */
export const denomination = {
  founded: { value: '4 November 1954', verified: true, source: 'Wikipedia — Foursquare Gospel Church in Nigeria' },
  generalOverseer: { value: 'Rev. Sam Aboyeji', verified: true, source: 'Wikipedia — Sam Aboyeji' },
  // The four-fold gospel the Foursquare emblem represents: cross, cup, dove, crown.
  foursquare: [
    { key: 'saviour', title: 'Saviour', line: 'Jesus Christ, the Saviour', symbol: 'cross' },
    { key: 'healer', title: 'Healer', line: 'Jesus Christ, the Healer', symbol: 'cup' },
    { key: 'baptizer', title: 'Baptizer', line: 'Jesus Christ, the Baptizer with the Holy Spirit', symbol: 'dove' },
    { key: 'king', title: 'King', line: 'Jesus Christ, the Soon-Coming King', symbol: 'crown' },
  ],
};

/**
 * Church life gallery. These describe what the photographs show (worship,
 * prayer, music, children, celebration). They are NOT a list of the church's
 * official ministries/departments — replace or rename them with the church's
 * real ministries when confirmed.
 */
export const life = [
  { title: 'Worship', line: 'Hearts lifted, voices as one.', image: 'lifeWorship' as ImageKey },
  { title: 'Praise', line: 'Dancing with all our might.', image: 'lifePraise' as ImageKey },
  { title: 'Prayer', line: 'On our knees, before the throne.', image: 'lifePrayer' as ImageKey },
  { title: 'Music', line: 'Voices raised as one choir.', image: 'lifeMusic' as ImageKey },
  { title: 'The Word', line: 'Rightly dividing the truth.', image: 'lifeWord' as ImageKey },
  { title: 'Sunday School', line: 'Studying the Scriptures together.', image: 'lifeSundaySchool' as ImageKey },
  { title: 'House Fellowship', line: 'Church in our homes, all week long.', image: 'lifeHouseFellowship' as ImageKey },
  { title: 'Children', line: 'Joy that cannot be contained.', image: 'lifeChildren' as ImageKey },
  { title: 'Teens', line: 'Growing up in the faith.', image: 'lifeTeens' as ImageKey },
  { title: 'Youth', line: 'A generation rising for God.', image: 'lifeYouth' as ImageKey },
  { title: 'Ushers', line: 'Serving with joy at every door.', image: 'lifeUshers' as ImageKey },
  { title: 'Celebration', line: 'Dancing before the Lord.', image: 'lifeCelebration' as ImageKey },
];

/**
 * Sermons — none could be verified online. The featured slot links to the
 * church's verified Facebook page (where it posts reels) until real sermons are added.
 */
export const sermons: {
  title: string; speaker: string; date: string; scripture?: string; image: ImageKey; href: string;
}[] = [
  // { title: 'TODO', speaker: 'TODO', date: 'TODO', scripture: 'TODO', image: 'sermon', href: 'https://…' },
];

/**
 * Events. The District Convocation details come from the district's own event media.
 * Entries with `verified: false` are NOT shown on the site — set to true once confirmed.
 */
export const events = [
  {
    kicker: 'The Foursquare Gospel Church in Nigeria',
    title: 'National Convention 2026',
    theme: 'Breaking New Grounds',
    date: '7–11 October 2026',
    dateMain: '7–11 Oct',
    dateSub: '2026',
    detail: 'Foursquare Camp, Ajebo, Ogun State.',
    image: 'event3' as ImageKey,
    verified: true, // foursquarenigconvention.com lists "October 7-11, 2026"
  },
  {
    kicker: 'Ilupeju Missionary District',
    title: 'District Convocation 2026',
    theme: 'New Height',
    date: '25–27 September 2026',
    dateMain: '25–27 Sept',
    dateSub: '2026',
    detail: 'A night vigil of worship, prayer and the Word, followed by the Grand Finale.',
    image: 'event1' as ImageKey,
    verified: true,
  },
  {
    kicker: 'District Convocation 2026',
    title: 'The Grand Finale',
    theme: 'New Height',
    date: '27 September 2026',
    dateMain: '27 Sept',
    dateSub: '2026',
    detail: 'The closing gathering of the convocation.',
    image: 'event2' as ImageKey,
    verified: true,
  },
];

export const nav = [
  { label: 'Story', href: '#story' },
  { label: 'Identity', href: '#identity' },
  { label: 'Life', href: '#life' },
  { label: 'Media', href: '#media' },
  { label: 'Events', href: '#events' },
  { label: 'Pastors', href: '#pastors' },
  { label: 'Services', href: '#services' },
  { label: 'Visit', href: '#visit' },
];
