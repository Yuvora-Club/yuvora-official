/* ============================================================
   YUVORA — data.js
   Content lives here, presentation lives in site.js / HTML.
   To publish something real, add an object to the matching
   `confirmed*` array — no layout edits needed.

   HONESTY RULES (do not break these):
   - Never move a sample into a `confirmed*` array.
   - Never add real names, numbers, sponsors or logos here
     unless verified. Placeholders stay placeholders.
   ============================================================ */

export const HUBS = [
  {
    slug: 'tech',
    name: 'Tech Hub',
    tagline: 'Build. Code. Create.',
    description:
      'For people who love making things with technology — coding, robotics, design, and everything in between. Bring curiosity; leave with something you built.',
    color: '#3284FF',
    tint: '#E3EDFF',
    sticker: 'hello, world!',
    activities: ['Coding sessions & build nights', 'Robotics & electronics tinkering', 'Design & creative tools', 'Show-and-tell demos'],
  },
  {
    slug: 'sporting',
    name: 'Sporting Hub',
    tagline: 'Play. Compete. Grow.',
    description:
      'For people who love the game — casual play, friendly matches, training together and learning through sport. All levels genuinely welcome.',
    color: '#26C878',
    tint: '#DFF5E9',
    sticker: 'game on!',
    activities: ['Casual play & practice sessions', 'Friendly inter-hub matches', 'Fitness & skill-building', 'Team spirit, zero pressure'],
  },
  {
    slug: 'esports',
    name: 'Esports & Gaming',
    tagline: 'Game. Connect. Compete.',
    description:
      'For players and fans — squad up for casual game nights, community tournaments and everything competitive, minus the toxicity.',
    color: '#8A55EF',
    tint: '#EAE2FD',
    sticker: 'gg, squad!',
    activities: ['Community game nights', 'Friendly tournaments', 'Watch parties & co-streams', 'New-player welcome lobbies'],
  },
  {
    slug: 'future',
    name: 'Future Hubs',
    tagline: 'More interests. More possibilities.',
    description:
      'Music, art, writing, entrepreneurship, science — whatever the community dreams up next. New hubs start here, proposed by members.',
    color: '#FF9148',
    tint: '#FFEADB',
    sticker: 'your idea here?',
    activities: ['Member-proposed interests', 'Pilot sessions & pop-ups', 'Cross-hub collaborations', 'Vote on what launches next'],
  },
];

/* ---------- Events ----------
   confirmedEvents is intentionally empty: there are no verified
   events yet, so the site renders an honest empty state.
   sampleEvents exist ONLY to preview the card design and are
   always badged "Sample" — never presented as real. */
export const confirmedEvents = [];

export const sampleEvents = [
  {
    title: 'Build Night: First Website',
    hub: 'tech',
    dateISO: '2026-11-08T15:00:00',
    venue: 'Sample venue · Room TBA',
    description:
      'A relaxed evening where beginners ship their first webpage and experienced builders help out. Laptops provided on request.',
    status: 'upcoming',
    sample: true,
  },
  {
    title: 'Sunday Kickabout',
    hub: 'sporting',
    dateISO: '2026-11-15T09:00:00',
    venue: 'Sample ground · Field TBA',
    description:
      'Casual football for every skill level. Bibs, ball and good vibes supplied — just bring shoes and water.',
    status: 'upcoming',
    sample: true,
  },
];

/* ---------- Projects ----------
   No verified member projects yet — the site renders an
   invitation instead of fabricating achievements. */
export const confirmedProjects = [];

/* ---------- Workshops & project status ----------
   The formal evaluation process is not established yet, so the
   board below shows sample items (badged) plus honest empty
   states. Replace with real items when the process exists. */
export const sampleWorkshops = [
  {
    title: 'Sample: Intro to Game Logic',
    hub: 'esports',
    status: 'ongoing',
    detail: 'Example of how an ongoing workshop will be listed once scheduling begins.',
    sample: true,
  },
  {
    title: 'Sample: Mini Hackwrap',
    hub: 'tech',
    status: 'completed',
    detail: 'Example of how a completed community project will be showcased.',
    sample: true,
  },
];

export const confirmedWorkshops = [];

/* ---------- Team ----------
   No published team members yet. Roles below are structural
   placeholders — NOT people. Never invent names or bios. */
export const teamRoles = [
  { role: 'Community Lead', vacant: true, note: 'Sets direction and keeps every hub thriving.' },
  { role: 'Tech Hub Organiser', vacant: true, note: 'Runs build nights, sessions and demos.' },
  { role: 'Sporting Hub Organiser', vacant: true, note: 'Plans play sessions and friendly matches.' },
  { role: 'Esports & Gaming Organiser', vacant: true, note: 'Hosts game nights and tournaments.' },
  { role: 'Events & Outreach', vacant: true, note: 'Coordinates events, schools and partners.' },
  { role: 'Volunteers', vacant: true, note: 'Photography, setup, mentoring — many ways in.' },
];

export function hubBySlug(slug) {
  return HUBS.find((h) => h.slug === slug) || HUBS[3];
}
