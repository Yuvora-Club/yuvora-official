# Yuvora Website — Content Guide

You can update almost everything on the site by editing **two files**.
No layout changes needed. If you can edit a list, you can run this site.

## The two files

| File | What lives there |
|------|------------------|
| `src/js/config.js` | Email, social links, survey popup, form endpoint |
| `src/js/data.js` | Hubs, events, projects, workshops, team |

After editing, rebuild so the changes go live:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run build
```

(Then deploy the `dist/` folder the same way you do today.)

---

## 1. Contact email & socials (`config.js` → `SITE`)

```js
contactEmail: 'yuvoraclub.official@gmail.com',
socials: {
  instagram: 'https://www.instagram.com/the_yuvora_club/',
},
```

- **Email** appears as a clickable `mailto:` link wherever contact
  details show. Set it to `""` to show "coming soon" instead.
- **Socials** appear in every footer. The key (`instagram`,
  `youtube`, `discord`, `github`…) becomes a pretty label
  automatically, and links open in a new tab. Add a line per
  profile. Only add profiles that really exist.

## 2. Survey popup (`config.js` → `SITE.survey`)

```js
survey: {
  enabled: true,                                   // false = popup never shows
  url: 'https://forms.gle/yqdtDEXpdZiPPtvU9',      // exact form link
  delayMs: 14000,                                  // wait 14s before showing
  storageKey: 'yuvora-survey-dismissed-v1',        // see below
  label: 'Help shape Yuvora',
  heading: 'Help us build something awesome.',
  description: '…',
  buttonText: 'Take the Survey',                   // opens the URL in a new tab
  laterText: 'Maybe Later',
  note: 'Takes you to our Google Form.',
},
```

- The popup appears **once per browsing session**, then remembers
  the dismissal. To show it again to everyone (e.g. a brand-new
  survey), change `storageKey` to something new like
  `'yuvora-survey-dismissed-v2'` — old dismissals are forgotten.
- It never claims a response was submitted; the button just opens
  your Google Form in a new tab.

## 3. Hubs (`data.js` → `HUBS`)

One object per hub. Fields: `slug` (must match the page folder, e.g.
`tech` → `/hubs/tech/`), `name`, `tagline`, `blurb` (short, for
tiles), `description`, `color` / `tint` / `ink` (brand colors),
`image` + `imageAlt`, `activities` (list).

- **To add a hub:** copy a whole `{ … }` block, change the values,
  and create its page folder. Everything else updates itself.
- **Images** are generic illustrative photos, clearly badged
  on-page. Replace any `image:` URL with a real club photo; keep the
  `imageAlt:` description accurate.

## 4. Events (`data.js` → `confirmedEvents`)

```js
{
  title: 'Build Night: First Website',
  hub: 'tech',                        // tech | sporting | esports | future
  dateISO: '2026-11-08T15:00:00',     // shown as "Sat 8 Nov, 3:00 pm"
  venue: 'Room 4, City Library',
  description: 'One or two honest sentences.',
  status: 'upcoming',                 // upcoming | running | completed
  image: 'https://…',                 // optional; omit for no photo
  imageAlt: '…',                      // describe the photo
  link: 'https://…',                  // optional registration/details link
},
```

- Add an object → it appears on `/events/` (and the homepage
  preview). Delete the object → it disappears. Nothing else to edit.
- `sampleEvents` below it are **layout previews, always badged
  "Sample"**. Never move one into `confirmedEvents`, and delete them
  once real events exist.

## 5. Projects (`data.js` → `confirmedProjects`, `sampleProjects`)

```js
{
  title: 'My Weather App',
  hub: 'tech',
  creator: 'Diya R.',                  // real name, with their approval
  description: 'What it does, in plain words.',
  image: 'https://…',                 // optional
  imageAlt: '…',
  link: 'https://…',                  // optional demo/repo link
},
```

- `sampleProjects` are badged previews. Delete them when the first
  real project ships.

## 6. Workshops (`data.js` → `confirmedWorkshops`, `sampleWorkshops`)

```js
{ title: 'Intro to Soldering', hub: 'tech', status: 'ongoing',
  detail: 'Saturdays in the lab; tools provided.', sample: false },
```

- `status` is `ongoing`, `evaluation`, or `completed` — the board
  groups items automatically. Samples are badged; same rules apply.

## 7. Team (`data.js` → `teamMembers`, `teamRoles`)

```js
{
  name: 'Aarav Sharma',              // real person, approved, or don't add
  role: 'Community Lead',
  bio: 'Second-year student. Runs build nights…',
  lead: true,                        // optional: distinctive lead styling
  photo: '/photos/aarav.jpg',        // optional; omit → monogram tile
  photoAlt: 'Portrait of Aarav Sharma',
  links: { Instagram: 'https://…' }, // optional, any labels
},
```

- Add to `teamMembers` → appears on `/team/` automatically.
- Omit `photo` (or if it fails to load) → initials tile, never a
  stranger's face. Omit `bio`/`links` → those lines hide cleanly.
- `teamRoles` lists **vacant** roles. If a member holds a role, that
  vacancy hides itself. Never invent names.

## 8. Images — rules in one place

- Every `image:` URL in `data.js` is a **generic illustrative**
  photo (currently Unsplash, no attribution required), badged
  on-page with "Illustrative photo" / "Sample" so nobody mistakes it
  for a real Yuvora photo.
- To replace one: put the real photo URL (or a `/photos/…` file)
  in the same field and update `imageAlt`. Same shape, no layout edits.
- If any image URL breaks, the site removes the broken frame and
  shows its designed gradient behind it — no broken-image icons, no
  layout jumps (ratios are fixed in CSS).

## 9. What NOT to do

- Don't add names, dates, sponsors, stats, or testimonials unless
  they're real and approved.
- Don't move `sample*` items into `confirmed*` arrays.
- Don't paste internal links (meeting invites, private docs, member
  phone numbers) anywhere in these files — everything here is public.
