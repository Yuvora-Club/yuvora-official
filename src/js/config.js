/* ============================================================
   YUVORA — config.js
   Site-wide settings. THIS IS THE FILE TO EDIT when details
   become available — no layout changes needed.

   Missing integrations / details the owner still needs to provide:
   - contactEmail: official inbox for collaboration (leave "" to
     keep the "details coming soon" state instead of inventing one)
   - socials: add handles ONLY once they officially exist
   - formEndpoint: form-receiver URL (e.g. Formspree). While empty,
     the collaborate form runs in clearly-labelled demo mode and
     does NOT claim to deliver submissions.
   - affiliations: set `approved: true` + logo path only for
     verified partnerships (e.g. Hack Club). Never imply approval.
   ============================================================ */

export const SITE = {
  name: 'Yuvora',
  domain: 'yuvora.org',
  url: 'https://yuvora.org',
  tagline: 'Different interests. Same energy.',
  contactEmail: '', // TODO(owner): add official inbox, e.g. "hello@yuvora.org"
  socials: {
    // TODO(owner): fill in ONLY when the official accounts exist.
    // instagram: 'https://instagram.com/...',
    // youtube: 'https://youtube.com/@...',
    // discord: 'https://discord.gg/...',
    // github: 'https://github.com/...',
  },
  formEndpoint: '', // TODO(owner): paste form-receiver URL to go live.
  affiliations: [
    // { name: 'Hack Club', approved: false, note: 'Recognition appears here once affiliation is confirmed.' },
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
