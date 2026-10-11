/* ============================================================
   YUVORA — site.js (v4 "THE OPEN STUDIO")
   Shared behaviour: nav, footer enhancement, reveal-on-scroll,
   content rendering (posters / features / ledger / people),
   forms. Vanilla JS, no dependencies. Reduced-motion respected.
   Nothing here loops continuously.
   ============================================================ */
import { SITE, FORM_TYPES } from './config.js';
import { hubBySlug, confirmedEvents, sampleEvents, confirmedProjects, sampleProjects, sampleWorkshops, confirmedWorkshops, teamRoles, teamMembers } from './data.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function fmtDate(iso) {
  const d = new Date(iso);
  const mon = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(d).toUpperCase();
  const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(d);
  const full = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  }).format(d);
  return { mon, day, full };
}

/* ---------- Illustrative photos ----------
   Every photo is generic stock (NOT Yuvora people/places) and is
   badged on-page. If the file fails to load, the <img> removes
   itself and the designed gradient behind it shows instead —
   no broken-image icons, no layout shift (aspect-ratio is fixed). */
function photo(src, alt, w = 1200, h = 675) {
  if (!src) return '';
  return `<img src="${esc(src)}" alt="${esc(alt || '')}" width="${w}" height="${h}" loading="lazy" decoding="async" onerror="this.remove()">`;
}

const SOCIAL_LABELS = {
  instagram: 'Instagram', youtube: 'YouTube', discord: 'Discord',
  github: 'GitHub', x: 'X', linkedin: 'LinkedIn',
};
function socialLabel(key) {
  return SOCIAL_LABELS[String(key).toLowerCase()] ||
    String(key).charAt(0).toUpperCase() + String(key).slice(1);
}

/* ---------- Scroll progress bar ---------- */
(function initScrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---------- Mobile nav ---------- */
(function initNav() {
  const header = $('#siteHeader');
  const toggle = $('#navToggle');
  if (!header || !toggle) return;
  const close = () => {
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-links a', header).forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); toggle.blur(); } });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });

  const here = window.location.pathname.replace(/\/index\.html?$/, '/');
  $$('.nav-links a', header).forEach((a) => {
    const target = new URL(a.getAttribute('href'), window.location.origin).pathname;
    if (target !== '/' && (here === target || here.startsWith(target))) a.setAttribute('aria-current', 'page');
    if (target === '/' && (here === '/' || here.endsWith('index.html'))) a.setAttribute('aria-current', 'page');
  });
})();

/* ---------- Footer year, placeholders, enhancement ---------- */
(function initMeta() {
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  $$('[data-contact-email]').forEach((el) => {
    if (SITE.contactEmail) {
      el.innerHTML = `<a href="mailto:${esc(SITE.contactEmail)}">${esc(SITE.contactEmail)}</a>`;
    } else {
      el.textContent = 'Contact details coming soon — check back shortly.';
    }
  });

  $$('[data-socials]').forEach((el) => {
    const entries = Object.entries(SITE.socials || {});
    if (!entries.length) {
      el.innerHTML = `<span class="soon">Official socials will be linked here once announced.</span>`;
      return;
    }
    el.innerHTML = entries
      .map(([name, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(socialLabel(name))}</a></li>`)
      .join('');
  });

  // Give every page the same composed sign-off (homepage opts out
  // with data-no-cta because its join strip already closes the page).
  $$('.site-footer').forEach((foot) => {
    if ($('.footer-cta', foot) || foot.hasAttribute('data-no-cta')) return;
    const wrap = foot.querySelector(':scope > .container');
    const cta = document.createElement('div');
    cta.className = 'container footer-cta';
    cta.innerHTML = `<a class="big" href="/collaborate/#join">Start with hello <span class="arr">↗</span></a>`;
    if (wrap) foot.insertBefore(cta, wrap);
    else foot.prepend(cta);
  });
})();

/* ---------- Reveal on scroll ---------- */
(function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
  items.forEach((el) => io.observe(el));
})();

/* ---------- Survey invitation modal ----------
   Content + timing live in SITE.survey (config.js) — set
   `enabled: false` there to turn it off. Shown ONCE per browsing
   session (sessionStorage) after a delay, only while the tab is
   visible. Focus moves into the dialog on open and returns on close;
   Escape, backdrop click, and both buttons dismiss. No animation
   when reduced-motion is preferred. Never claims a submission. */
(function initSurvey() {
  const cfg = SITE.survey || {};
  if (!cfg.enabled || !cfg.url) return;
  let dismissed = false;
  try { dismissed = window.sessionStorage.getItem(cfg.storageKey || 'yuvora-survey-dismissed') === '1'; } catch { dismissed = false; }
  if (dismissed) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'survey-backdrop';
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <div class="survey-modal" role="dialog" aria-modal="true" aria-labelledby="surveyTitle">
      <button class="survey-close" type="button" aria-label="Dismiss survey invitation">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <p class="kicker"><span class="coord">◆</span> ${esc(cfg.label || 'Survey')}</p>
      <h2 id="surveyTitle">${esc(cfg.heading || '')}</h2>
      <p class="survey-text">${esc(cfg.description || '')}</p>
      <div class="survey-actions">
        <a class="btn btn-signal" href="${esc(cfg.url)}" target="_blank" rel="noopener">${esc(cfg.buttonText || 'Take the Survey')} <span aria-hidden="true">↗</span></a>
        <button class="survey-later" type="button">${esc(cfg.laterText || 'Maybe Later')}</button>
      </div>
      ${cfg.note ? `<p class="survey-note">${esc(cfg.note)}</p>` : ''}
    </div>`;
  document.body.appendChild(backdrop);

  const modal = $('.survey-modal', backdrop);
  const closeBtn = $('.survey-close', backdrop);
  const laterBtn = $('.survey-later', backdrop);
  let lastFocus = null;

  const remember = () => {
    try { window.sessionStorage.setItem(cfg.storageKey || 'yuvora-survey-dismissed', '1'); } catch { /* private mode: show at most once per load */ }
  };
  const open = () => {
    if (!backdrop.hidden) return;
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => backdrop.classList.add('open'));
    closeBtn.focus({ preventScroll: true });
  };
  const close = () => {
    if (backdrop.hidden) return;
    remember();
    backdrop.classList.remove('open');
    backdrop.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };

  closeBtn.addEventListener('click', close);
  laterBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  // Keep focus inside while open (lightweight trap for a single dialog).
  document.addEventListener('focusin', (e) => {
    if (!backdrop.hidden && !modal.contains(e.target)) { e.stopPropagation(); closeBtn.focus(); }
  }, true);

  window.setTimeout(() => {
    if (document.visibilityState === 'visible') open();
    else {
      const onVis = () => {
        if (document.visibilityState === 'visible') { document.removeEventListener('visibilitychange', onVis); open(); }
      };
      document.addEventListener('visibilitychange', onVis);
    }
  }, Math.max(0, Number(cfg.delayMs) || 0));
})();
/* ---------- Card builders (content-driven) ---------- */
function hubTag(slug) {
  const hub = hubBySlug(slug);
  return `<span class="tag"><span class="dot" style="--tag-dot:${hub.color};background:${hub.color}"></span>${esc(hub.name)}</span>`;
}

/* AA-safe small-text colors per hub (fills stay canonical in data.js). */
const HUB_INK = { tech: '#1F5FD6', sporting: '#1E7A4E', esports: '#6A3ECF', future: '#A85A1C' };
function hubInk(slug) {
  const hub = hubBySlug(slug);
  return hub.ink || HUB_INK[slug] || 'var(--ink-soft)';
}

/* ---------- Hub tile photos (progressive enhancement) ----------
   Tiles keep their full static content (links work with JS off);
   this only injects the illustrative photo header from data.js,
   so image URLs stay centralized for the owner to swap. */
(function enhanceHubTiles() {
  $$('.tile[href^="/hubs/"]').forEach((tile) => {
    if ($('.tile-photo', tile)) return;
    const m = (tile.getAttribute('href') || '').match(/^\/hubs\/([^/]+)\/$/);
    if (!m) return;
    const hub = hubBySlug(m[1]);
    if (!hub || hub.slug !== m[1] || !hub.image) return;
    const art = document.createElement('span');
    art.className = 'tile-photo';
    art.setAttribute('aria-hidden', 'true');
    art.innerHTML = `${photo(hub.image, '', 800, 450)}<span class="photo-tag">Illustrative photo</span>`;
    const old = $('.tile-art', tile);
    if (old) old.replaceWith(art);
    else tile.insertBefore(art, tile.firstChild);
  });
})();

function eventPoster(ev, i = 0) {
  const hub = hubBySlug(ev.hub);
  const { mon, day, full } = fmtDate(ev.dateISO);
  const statusLabel = { upcoming: 'Upcoming', running: 'Running', completed: 'Completed' }[ev.status] || 'Upcoming';
  return `
  <article class="poster" style="--hub:${hub.color};--hub-ink:${hubInk(ev.hub)}">
    ${ev.image ? `<div class="poster-photo" aria-hidden="true">${photo(ev.image, '', 800, 450)}</div>` : ''}
    <div class="poster-top">
      <p class="poster-date"><small>${mon} · ${esc(hub.name)}</small>${day}</p>
      <span class="poster-index">${String(i + 1).padStart(2, '0')}</span>
    </div>
    <h3>${esc(ev.title)}</h3>
    <div class="poster-meta">
      <span class="status status-${esc(ev.status)}"><span class="dot"></span>${statusLabel}</span>
      ${ev.sample ? '<span class="sample-flag">sample</span>' : ''}
    </div>
    <p>${esc(ev.description)}</p>
    <div class="poster-foot">
      <span class="venue"><time datetime="${esc(ev.dateISO)}">${esc(full)}</time> · ${esc(ev.venue)}</span>
      ${ev.sample
        ? '<span style="font-size:.84rem;color:var(--ink-soft)">Demo layout — signups open with real events.</span>'
        : `<a class="u-link" style="font-size:.95rem" href="${esc(ev.link || '/events/')}">Details <span class="arr">→</span></a>`}
    </div>
  </article>`;
}

function projectFeature(p, i) {
  const hub = hubBySlug(p.hub);
  const visual = p.image
    ? `<div class="feature-photo" aria-hidden="true">${photo(p.image, '', 800, 600)}${p.sample ? '<span class="photo-tag">Illustrative photo</span>' : ''}</div>`
    : `<div class="feature-visual" style="background:${hub.tint};background-image:radial-gradient(${hub.color}44 1.6px, transparent 1.6px);background-size:18px 18px">
      <svg class="motif" viewBox="0 0 48 48" fill="none" stroke="${hub.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="2" fill="#fff" stroke="#171717" stroke-width="3"/><path d="M18 20l-4 4 4 4M30 20l4 4-4 4M27 17l-6 14"/></svg>
      <span class="ghost-num" aria-hidden="true">0${i + 1}</span>
      ${p.sample ? '<span class="sample-flag" style="position:absolute;top:1rem;left:1rem">sample</span>' : ''}
    </div>`;
  return `
  <article class="feature reveal${i % 2 ? ' flip' : ''}">
    ${visual}
    <div class="feature-body">
      ${hubTag(p.hub)}
      <h3>${esc(p.title)}</h3>
      <p class="byline">by ${esc(p.creator)}</p>
      <p class="desc">${esc(p.description)}</p>
      ${p.sample ? '<p><span class="sample-flag">sample — layout preview</span></p>' : ''}
      ${p.link ? `<a class="u-link" href="${esc(p.link)}" rel="noopener">View project <span class="arr">→</span></a>` : ''}
    </div>
  </article>`;
}

function openBench({ bench, title, text, actions }) {
  return `
  <div class="field-empty reveal">
    <p class="kicker"><span class="coord">${bench}</span> Open log</p>
    <h3>${title}</h3>
    <p>${text}</p>
    <div class="invite-row">${actions}</div>
  </div>`;
}

const ICONS = {
  spark: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3c1.8 13 6.5 17.7 19.5 19.5-13 1.8-17.7 6.5-19.5 19.5C22.2 29 17.5 24.3 4.5 22.5 17.5 20.7 22.2 16 24 3z" fill="#3284FF"/><circle cx="37" cy="11" r="5" fill="#FFCA36" stroke="#171717" stroke-width="2.5"/></svg>',
};

/* ---------- Events ---------- */
(function renderEvents() {
  const preview = $('[data-render="events-preview"]');
  if (preview) {
    const live = confirmedEvents.slice(0, 2);
    preview.innerHTML = live.length
      ? `<div class="poster-grid">${live.map((e, i) => eventPoster(e, i)).join('')}</div>`
      : openBench({
        bench: 'L 01',
        title: 'Nothing on the calendar yet.',
        text: 'Season 01 is being set up. Once dates lock, they appear here with venues and registration — propose the first one.',
        actions: '<a class="btn btn-sm btn-signal" href="/collaborate/">Propose an event</a><a class="btn btn-sm btn-ghost" href="/hubs/">Explore the hubs</a>',
      });
  }

  const full = $('[data-render="events-full"]');
  if (full) {
    if (confirmedEvents.length) {
      full.innerHTML = `<div class="poster-grid">${confirmedEvents.map((e, i) => eventPoster(e, i)).join('')}</div>`;
    } else {
      full.innerHTML = `
        ${openBench({
          bench: 'L 02',
          title: 'No confirmed events yet.',
          text: 'We are setting up the first season of sessions, matches and game nights. Once dates lock, they appear here with venues, eligibility and registration.',
          actions: '<a class="btn btn-sm btn-signal" href="/collaborate/">Propose an event</a><a class="btn btn-sm btn-ghost" href="/hubs/">Explore the hubs</a>',
        })}
        <h3 class="h3" style="margin:2.5rem 0 1.2rem">Poster preview <span class="sample-flag">samples</span></h3>
        <div class="poster-grid">${sampleEvents.map((e, i) => eventPoster(e, i)).join('')}</div>`;
    }
  }
})();

/* ---------- Projects ---------- */
(function renderProjects() {
  $$('[data-render="projects"]').forEach((el) => {
    const limit = parseInt(el.dataset.limit || '0', 10);
    const live = limit ? confirmedProjects.slice(0, limit) : confirmedProjects;
    if (live.length) {
      el.innerHTML = live.map(projectFeature).join('');
      return;
    }
    const samples = limit ? sampleProjects.slice(0, limit) : sampleProjects;
    el.innerHTML = (samples.length
      ? `<p class="kicker"><span class="coord">Pv 00</span> Layout preview — samples, not real projects</p>
         <div>${samples.map(projectFeature).join('')}</div>`
      : '')
      + openBench({
        bench: 'L 01',
        title: 'The shelf is empty — for now.',
        text: 'Built a website, won a match, shipped a game, made something you are proud of? Nothing here is fabricated — every future entry credits its real creator, with approval.',
        actions: '<a class="btn btn-sm btn-signal" href="/collaborate/">Submit your project</a><a class="btn btn-sm btn-ghost" href="/hubs/">Find your hub</a>',
      });
  });
})();

/* ---------- Workshops ledger ---------- */
(function renderWorkshops() {
  const board = $('[data-render="workshops"]');
  if (!board) return;
  const cols = [
    { key: 'ongoing', title: 'Ongoing', cls: 'status-ongoing', empty: 'Nothing running right now. Scheduled sessions will show up here.' },
    { key: 'evaluation', title: 'Under Evaluation', cls: 'status-evaluation', empty: 'No submissions under review. Review criteria will be published before the process begins.' },
    { key: 'completed', title: 'Completed', cls: 'status-completed', empty: 'Finished work will be celebrated here.' },
  ];
  const items = [...confirmedWorkshops, ...sampleWorkshops];
  board.innerHTML = cols.map((col) => {
    const list = items.filter((w) => w.status === col.key);
    const rows = list.map((w) => `
      <li>
        <h4>${esc(w.title)}</h4>
        <p>${esc(w.detail)}</p>
        <div class="ledger-side">${hubTag(w.hub)}${w.sample ? '<span class="sample-flag">sample</span>' : ''}</div>
      </li>`).join('');
    return `<div class="ledger-group">
      <header><h3>${col.title}</h3><span class="status ${col.cls}"><span class="dot"></span>${list.length}</span></header>
      ${rows ? `<ul class="ledger">${rows}</ul>` : `<p class="standfirst" style="margin-top:.4rem">${col.empty}</p>`}
    </div>`;
  }).join('');
})();

/* ---------- Team ----------
   Real members (teamMembers) render first as editorial features —
   leads get a distinctive treatment. Vacant roles whose title is
   already held by a member are hidden, the rest render as open
   slots. No members yet → honest "crew assembling" state. */
function initials(name) {
  return String(name || '?').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}
function memberLinks(links) {
  const entries = Object.entries(links || {});
  if (!entries.length) return '';
  return `<p class="member-links">${entries
    .map(([label, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`)
    .join('')}</p>`;
}
(function renderTeam() {
  const grid = $('[data-render="team"]');
  if (!grid) return;
  const members = teamMembers.filter((m) => m && m.name && m.role);
  const held = new Set(members.map((m) => String(m.role).toLowerCase()));
  const open = teamRoles.filter((r) => !held.has(String(r.role).toLowerCase()));
  const people = members.map((m, i) => `
    <article class="crew-card reveal${m.lead ? ' crew-lead' : ''}">
      <div class="crew-photo" aria-hidden="true">
        ${m.photo
          ? `<img src="${esc(m.photo)}" alt="" width="320" height="320" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('img-failed');this.remove()">`
          : ''}
        <span class="crew-mono">${esc(initials(m.name))}</span>
        <span class="crew-index">0${i + 1}</span>
      </div>
      <div class="crew-body">
        <p class="role">${esc(m.role)}${m.lead ? ' · <span class="lead-tag">Lead</span>' : ''}</p>
        <h3>${esc(m.name)}</h3>
        ${m.bio ? `<p class="bio">${esc(m.bio)}</p>` : ''}
        ${memberLinks(m.links)}
      </div>
    </article>`).join('');
  const slots = open.map((r) => `
    <div class="crew-card crew-open reveal">
      <div class="crew-photo" aria-hidden="true">
        <span class="crew-mono">?</span>
      </div>
      <div class="crew-body">
        <p class="role">${esc(r.role)} · <span class="open-tag">Open role</span></p>
        <h3>Profile coming soon</h3>
        <p class="bio">${esc(r.note)} Real names and photos appear only with approval.</p>
      </div>
    </div>`).join('');
  grid.innerHTML = (members.length
    ? `<p class="kicker"><span class="coord">C 00</span> The crew — real members, approved profiles</p>
       <div class="crew-list">${people}</div>` : '')
    + (open.length
      ? `<p class="kicker" style="margin-top:2.5rem"><span class="coord">C 01</span> Open roles — come claim one</p>
         <div class="crew-list">${slots}</div>` : '');
})();

/* ---------- Collaborate form ---------- */
(function initForm() {
  const form = $('[data-collab-form]');
  if (!form) return;

  const typeSelect = $('#fieldType');
  if (typeSelect) {
    typeSelect.innerHTML = '<option value="">Choose one…</option>' +
      FORM_TYPES.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
    if (window.location.hash === '#join') {
      const join = [...typeSelect.options].find((o) => /member/i.test(o.value));
      if (join) typeSelect.value = join.value;
    }
  }

  const setError = (id, msg) => {
    const field = $(`[data-field="${id}"]`);
    if (!field) return;
    const input = $('input, select, textarea', field);
    if (msg) {
      field.classList.add('invalid');
      if (input) input.setAttribute('aria-invalid', 'true');
      const err = $('.error-msg', field);
      if (err) err.textContent = msg;
    } else {
      field.classList.remove('invalid');
      if (input) input.removeAttribute('aria-invalid');
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company_website) { showSuccess(true); return; }

    let ok = true;
    if (!String(data.name || '').trim() || String(data.name).trim().length < 2) { setError('name', 'Please tell us your name.'); ok = false; } else setError('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email || '').trim())) { setError('email', 'Enter a valid email so we can reply.'); ok = false; } else setError('email');
    if (!data.type) { setError('type', 'Choose the closest proposal type.'); ok = false; } else setError('type');
    if (!String(data.message || '').trim() || String(data.message).trim().length < 20) { setError('message', 'Give us a little detail — at least 20 characters.'); ok = false; } else setError('message');
    if (!ok) { $('.field.invalid input, .field.invalid select, .field.invalid textarea')?.focus(); return; }

    const btn = $('[type="submit"]', form);
    btn.disabled = true;
    btn.textContent = 'Sending…';

    if (SITE.formEndpoint) {
      try {
        const res = await fetch(SITE.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: data.name, email: data.email, organization: data.org || '', type: data.type, message: data.message }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showSuccess(false);
      } catch {
        btn.disabled = false;
        btn.textContent = 'Send proposal →';
        alert('Sending failed. Please try again later, or reach us via the contact details on this page.');
      }
    } else {
      await new Promise((r) => setTimeout(r, 600));
      showSuccess(true);
    }
  });

  function showSuccess(demo) {
    const wrap = $('#formWrap');
    if (!wrap) return;
    wrap.innerHTML = `
      <div class="form-success" role="status">
        <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#DFF5E9" stroke="#171717" stroke-width="3"/><path d="M15 24.5l6.5 6.5L33 18" fill="none" stroke="#171717" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <h3 class="h3">Thanks, proposal received${demo ? ' (demo)' : ''}!</h3>
        <p style="color:var(--ink-soft);max-width:52ch">${
          demo
            ? 'This is a <strong>demonstration</strong> — nothing was sent anywhere. Once the team connects a form service, submissions here will be delivered for real.'
            : 'Your proposal is on its way. We reply to every genuine proposal — usually within a week.'}
        </p>
        <div class="invite-row"><a class="btn btn-sm btn-ghost" href="/hubs/">Explore the hubs meanwhile</a></div>
      </div>`;
    wrap.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
  }
})();
