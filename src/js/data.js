/* ============================================================
   YUVORA — data.js — ★ EDIT CONTENT HERE, NOT IN LAYOUTS ★
   Content lives here, presentation lives in site.js / HTML.
   To publish something real, add an object to the matching
   `confirmed*` array — no layout edits needed.
   Full owner manual: see CONTENT_GUIDE.md in the project root.

   HONESTY RULES (do not break these):
   - Never move a sample into a `confirmed*` array.
   - Never add real names, numbers, sponsors or logos here
     unless verified. Placeholders stay placeholders.
   - Every placeholder block below carries a `// PLACEHOLDER:` marker.
   - `image` URLs below are GENERIC ILLUSTRATIVE photos (Unsplash),
     NOT Yuvora members/events/projects. They are badged on-page and
     fenced for one-click replacement with real photos (see guide).
   ============================================================ */

// Generic illustrative photos (Unsplash, no attribution required).
// Swap any of these for real Yuvora photos later — same shape.
const U = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const HUBS = [
  {
    slug: 'tech',
    name: 'Tech Hub',
    tagline: 'Build. Code. Create.',
    blurb:
      'Coding, AI, robotics, design and tinkering — from your first webpage to full builds, with mentors beside you.',
    description:
      'For people who love making things with technology — coding, robotics, design, and everything in between. Bring curiosity; leave with something you built.',
    color: '#3284FF',
    tint: '#E3EDFF',
    ink: '#1F5FD6',
    // PLACEHOLDER image: generic circuit-board photo, NOT a Yuvora venue.
    image: U('photo-1518770660439-4636190af475'),
    imageAlt: 'Close-up of a glowing circuit board',
    activities: ['Coding sessions & build nights', 'Robotics & electronics tinkering', 'Design & creative tools', 'Show-and-tell demos'],
  },
  {
    slug: 'sporting',
    name: 'Sporting Hub',
    tagline: 'Play. Compete. Grow.',
    blurb:
      'Casual play, friendly matches, training together. All levels, genuinely.',
    description:
      'For people who love the game — casual play, friendly matches, training together and learning through sport. All levels genuinely welcome.',
    color: '#26C878',
    tint: '#DFF5E9',
    ink: '#1E7A4E',
    // PLACEHOLDER image: generic cycling-race photo, NOT a Yuvora match.
    image: U('photo-1517649763962-0c623066013b'),
    imageAlt: 'Cyclists racing together in a pack',
    activities: ['Casual play & practice sessions', 'Friendly inter-hub matches', 'Fitness & skill-building', 'Team spirit, zero pressure'],
  },
  {
    slug: 'esports',
    name: 'Esports & Gaming',
    tagline: 'Game. Connect. Compete.',
    blurb:
      'Game nights and community tournaments — competitive, minus the toxicity.',
    description:
      'For players and fans — squad up for casual game nights, community tournaments and everything competitive, minus the toxicity.',
    color: '#8A55EF',
    tint: '#EAE2FD',
    ink: '#6A3ECF',
    // PLACEHOLDER image: generic neon-arcade photo, NOT a Yuvora game night.
    image: U('photo-1511512578047-dfb367046420'),
    imageAlt: 'Neon arcade cabinets glowing in a dark room',
    activities: ['Community game nights', 'Friendly tournaments', 'Watch parties & co-streams', 'New-player welcome lobbies'],
  },
  {
    slug: 'future',
    name: 'Future Hubs',
    tagline: 'More interests. More possibilities.',
    blurb:
      'Music, art, writing, ventures — into something else entirely? Propose it and pilot the first session.',
    description:
      'Music, art, writing, entrepreneurship, science — whatever the community dreams up next. New hubs start here, proposed by members.',
    color: '#FF9148',
    tint: '#FFEADB',
    ink: '#A85A1C',
    // PLACEHOLDER image: generic desk-setup photo, NOT a Yuvora session.
    image: U('photo-1531297484001-80022131f5a1'),
    imageAlt: 'A laptop and notebook on a desk in warm light',
    activities: ['Member-proposed interests', 'Pilot sessions & pop-ups', 'Cross-hub collaborations', 'Vote on what launches next'],
  },
];

/* ---------- Events ----------
   confirmedEvents is intentionally empty: there are no verified
   events yet, so the site renders an honest empty state.
   PLACEHOLDER: sampleEvents exist ONLY to preview the card design
   and are always badged "Sample" — never presented as real. */
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
    // PLACEHOLDER image: generic code photo, NOT a Yuvora event.
    image: U('photo-1515879218367-8466d910aaa4'),
    imageAlt: 'Lines of code on a dark editor screen',
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
    // PLACEHOLDER image: generic runners photo, NOT a Yuvora match.
    image: U('photo-1461896836934-ffe607ba8211'),
    imageAlt: 'Runners training together on a track',
  },
];

/* ---------- Projects ----------
   No verified member projects yet — the site renders an
   invitation instead of fabricating achievements. */
export const confirmedProjects = [];

/* PLACEHOLDER: sampleProjects exist ONLY to preview the project
   layout and are always badged "Sample" — never presented as real
   member work. Delete them once the first real project ships. */
export const sampleProjects = [
  {
    title: 'Sample: My First Portfolio Site',
    hub: 'tech',
    creator: 'Sample creator',
    description:
      'Example of how a shipped member project will be showcased — title, maker, what it does, and where to see it.',
    sample: true,
    link: '',
    // PLACEHOLDER image: generic code photo, NOT a member project.
    image: U('photo-1555066931-4365d14bab8c'),
    imageAlt: 'Colorful code on a computer screen',
  },
  {
    title: 'Sample: Line-Follower Bot',
    hub: 'tech',
    creator: 'Sample creator',
    description:
      'Example of a hardware build write-up — what was attempted, what worked, and what the next version will try.',
    sample: true,
    link: '',
    // PLACEHOLDER image: generic electronics photo, NOT a member build.
    image: U('photo-1581091226825-a6a2a5aee158'),
    imageAlt: 'A student engineer working with a laptop',
  },
];

/* ---------- Workshops & project status ----------
   The formal evaluation process is not established yet, so the
   board below shows sample items (badged) plus honest empty
   states. Replace with real items when the process exists.
   PLACEHOLDER: sampleWorkshops are layout previews only. */
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
   placeholders — NOT people. Never invent names or bios.
   PLACEHOLDER: teamRoles render as vacant "Profile coming soon" rows. */
export const teamRoles = [
  { role: 'Community Lead', vacant: true, note: 'Sets direction and keeps every hub thriving.' },
  { role: 'Tech Hub Organiser', vacant: true, note: 'Runs build nights, sessions and demos.' },
  { role: 'Sporting Hub Organiser', vacant: true, note: 'Plans play sessions and friendly matches.' },
  { role: 'Esports & Gaming Organiser', vacant: true, note: 'Hosts game nights and tournaments.' },
  { role: 'Events & Outreach', vacant: true, note: 'Coordinates events, schools and partners.' },
  { role: 'Volunteers', vacant: true, note: 'Photography, setup, mentoring — many ways in.' },
];

/* ---------- Team members (real people only) ----------
   Add APPROVED members here and they render automatically on the
   team page with photo, bio and links. Shape per member:
     { name, role, bio, lead?, photo?, photoAlt?, links? }
   - lead: true gives a distinctive lead treatment (max 1–2 people).
   - photo/photoAlt: portrait URL + alt. Omit either and the card
     falls back to a monogram tile — never a stranger's face.
   - links: { label: url } e.g. { Instagram: 'https://…' }.
   Empty array = honest "crew assembling" state. Never invent entries. */
export const teamMembers = [
  // { name: 'Aarav Sharma', role: 'Community Lead', lead: true,
  //   bio: 'Second-year CS student. Runs build nights…',
  //   photo: '/photos/aarav.jpg', photoAlt: 'Portrait of Aarav Sharma',
  //   links: { Instagram: 'https://www.instagram.com/…' } },
];

export function hubBySlug(slug) {
  return HUBS.find((h) => h.slug === slug) || HUBS[3];
}
