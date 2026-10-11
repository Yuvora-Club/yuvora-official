/* ============================================================
   YUVORA — config.js — ★ START HERE TO UPDATE THE SITE ★
   Site-wide settings. THIS IS THE FILE TO EDIT when details
   become available — no layout changes needed.
   Full owner manual: see CONTENT_GUIDE.md in the project root.

   WHAT LIVES HERE:
   - contactEmail .... official inbox (mailto: links site-wide)
   - socials ......... official profiles ONLY (footer + contact lists)
   - survey .......... Google Forms popup (content, timing, on/off)
   - formEndpoint .... form-receiver URL (e.g. Formspree). While empty,
     the collaborate form runs in clearly-labelled demo mode and
     does NOT claim to deliver submissions.
   - affiliations .... set `approved: true` + logo path only for
     verified partnerships (e.g. Hack Club). Never imply approval.
   ============================================================ */

export const SITE = {
  name: 'Yuvora',
  domain: 'yuvora.org',
  url: 'https://yuvora.org',
  tagline: 'Different interests. Same energy.',
  // REAL: official club inbox. Shown as a mailto: link wherever
  // contact details appear. Leave "" to show "coming soon" instead.
  contactEmail: 'yuvoraclub.official@gmail.com',
  // REAL: official profiles only — never invent handles.
  // Keys map to pretty labels (instagram → "Instagram"); any other
  // key is capitalised automatically. Links open in a new tab.
  socials: {
    instagram: 'https://www.instagram.com/the_yuvora_club/',
    // youtube: 'https://youtube.com/@...',
    // discord: 'https://discord.gg/...',
    // github: 'https://github.com/...',
  },
  // Survey popup. Set `enabled: false` to turn it off entirely.
  // Shown ONCE per browsing session after `delayMs`, only while the
  // page is visible. Never claims responses were submitted.
  survey: {
    enabled: true,
    url: 'https://forms.gle/yqdtDEXpdZiPPtvU9',
    delayMs: 14000,
    storageKey: 'yuvora-survey-dismissed-v1',
    label: 'Help shape Yuvora',
    heading: 'Help us build something awesome.',
    description:
      "Tell us what you'd love to learn, build, and experience with Yuvora. Your feedback will help us plan upcoming activities and opportunities for the community.",
    buttonText: 'Take the Survey',
    laterText: 'Maybe Later',
    note: 'Takes you to our Google Form.',
  },
  formEndpoint: '', // TODO(owner): paste form-receiver URL to go live.
  affiliations: [
    // REAL (owner-confirmed): Hack Club officially recognised Yuvora
    // as a club; all Yuvora programs run under Hack Club.
    { name: 'Hack Club', approved: true, url: 'https://hackclub.com', note: 'All Yuvora programs run under Hack Club.' },
  ],
};

export const FORM_TYPES = [
  'Join as a member',
  'Partner with Yuvora',
  'Co-host an event',
  'Organise a workshop / competition',
  'Propose a new hub',
  'Volunteer',
  'Sponsorship inquiry',
  'Something else',
];
