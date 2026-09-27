/**
 * Every photograph on the site, by slot.
 *
 * All slots are placeholders for now (src: null) — the church will supply the photos.
 * To use a photo: put the file in /public/images/ and set `src`, e.g. '/images/hero.jpg'.
 * `shape` is the recommended orientation; `note` describes what works best in that spot.
 */
export type ImageSlot = {
  src: string | null;
  /** Optional portrait crop used on phones (art direction). */
  srcMobile?: string;
  /** Optional muted, looping video shown over the photo (the photo acts as its poster). */
  video?: string;
  /** Optional portrait video for phones. */
  videoMobile?: string;
  label: string;
  shape: 'landscape' | 'portrait' | 'square';
  note: string;
};

export const images = {
  heroBackground: { src: '/images/hero-wide-poster.jpg', srcMobile: '/images/hero-tall-poster.jpg', video: '/videos/hero-wide.mp4', videoMobile: '/videos/hero-tall.mp4', label: 'Hero background', shape: 'landscape', note: 'Looping film: choir beneath the cross, then the celebration (District Convocation 2026, IMG_1509 / 1700 / 1699). Posters are its first frames.' },
  lifeWorship: { src: '/images/life-worship-poster.jpg', video: '/videos/life-worship.mp4', label: 'Life — Worship', shape: 'portrait', note: 'Woman in yellow worshipping (District Convocation 2026, IMG_1471).' },
  lifePrayer: { src: '/images/life-prayer-poster.jpg', video: '/videos/life-prayer.mp4', label: 'Life — Prayer', shape: 'portrait', note: 'Woman in green praying (District Convocation 2026 vigil, IMG_1465).' },
  lifePraise: { src: '/images/life-praise-poster.jpg', video: '/videos/life-praise.mp4', label: 'Life — Praise', shape: 'portrait', note: 'Dancing in praise (District Convocation 2026, IMG_1679).' },
  lifeMusic: { src: '/images/life-music-poster.jpg', video: '/videos/life-music.mp4', label: 'Life — Music', shape: 'portrait', note: 'The choir beneath the cross (District Convocation 2026, IMG_1514).' },
  lifeWord: { src: '/images/life-word-poster.jpg', video: '/videos/life-word.mp4', label: 'Life — The Word', shape: 'portrait', note: 'The pastor preaching at the pulpit (District Convocation 2026, IMG_1500).' },
  lifeSundaySchool: { src: '/images/life-sunday-school-poster.jpg', video: '/videos/life-sunday-school.mp4', label: 'Life — Sunday School', shape: 'portrait', note: 'Young people leading at the front (IMG_1349).' },
  lifeChildren: { src: '/images/life-children-poster.jpg', video: '/videos/life-children.mp4', label: 'Life — Children', shape: 'portrait', note: 'A little girl dancing (District Convocation 2026, IMG_1698).' },
  lifeTeens: { src: '/images/life-teens-poster.jpg', video: '/videos/life-teens.mp4', label: 'Life — Teens', shape: 'portrait', note: 'Teenagers leading songs (District Convocation 2026, IMG_1712).' },
  lifeYouth: { src: '/images/life-youth-poster.jpg', video: '/videos/life-youth.mp4', label: 'Life — Youth', shape: 'portrait', note: 'Youth worshipping (District Convocation 2026, IMG_1728).' },
  lifeUshers: { src: '/images/life-ushers-poster.jpg', video: '/videos/life-ushers.mp4', label: 'Life — Ushers', shape: 'portrait', note: 'Ushers in yellow coming out to dance (District Convocation 2026, IMG_1675).' },
  lifeCelebration: { src: '/images/life-celebration-poster.jpg', video: '/videos/life-celebration.mp4', label: 'Life — Celebration', shape: 'portrait', note: 'Jumping and dancing (District Convocation 2026, IMG_1701).' },
  pastorFemi: { src: '/images/pastor-femi.jpg', label: 'Rev. Dr. Femi Ogbonmide', shape: 'portrait', note: 'Frame from a Foursquare Grand Assembly Ilupeju YouTube short (qBqjY_truKI). Replace with an official portrait when available.' },
  pastorYinka: { src: '/images/pastor-yinka.jpg', label: 'Pst. Mrs. Yinka Ogbonmide', shape: 'portrait', note: 'Frame from a Foursquare Grand Assembly Ilupeju YouTube short (IH0-tNVkFlQ). Replace with an official portrait when available.' },
  sermon: { src: '/images/sermon-poster.jpg', video: '/videos/sermon.mp4', label: 'Featured sermon', shape: 'landscape', note: 'Our pastor preaching at the pulpit (District Convocation 2026, IMG_1500). Grows to full screen.' },
  event3: { src: '/images/event-convention-2026.jpg', srcMobile: '/images/event-convention-2026-tall.jpg', label: 'Event — National Convention', shape: 'landscape', note: 'Official 71st Annual Convention flyer (foursquarenigconvention.com).' },
  visit: { src: '/images/visit-sanctuary.jpg', label: 'Visit us background', shape: 'landscape', note: 'Our sanctuary, full for the District Convocation 2026 (IMG_1573). Replace with an outside photo of the church building when available.' },
} satisfies Record<string, ImageSlot>;

export type ImageKey = keyof typeof images;
