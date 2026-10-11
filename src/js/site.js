/* ============================================================
   YUVORA — site.js (v3 "SIGNAL IN THE DARK")
   Shared behaviour: nav (transparent over the opening frame),
   footer enhancement, reveal-on-scroll, constellation drift,
   content rendering (posters / features / ledger / people),
   forms. Vanilla JS, no dependencies. Reduced-motion respected.
   ============================================================ */
import { SITE, FORM_TYPES } from './config.js';
import { hubBySlug, confirmedEvents, sampleEvents, confirmedProjects, sampleWorkshops, confirmedWorkshops, teamRoles } from './data.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

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

/* ---------- Nav: transparent over the opening frame, solid after ---------- */
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

  const hero = $('.hero-dark');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
    if (hero) {
      header.classList.toggle('transparent', window.scrollY < hero.offsetHeight - 90);
    } else {
      header.classList.remove('transparent');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
      .map(([name, url]) => `<li><a href="${esc(url)}" rel="noopener">${esc(name)}</a></li>`)
      .join('');
  });

  // Give every page the same composed sign-off.
  $$('.site-footer').forEach((foot) => {
    if ($('.footer-cta', foot)) return;
    const wrap = foot.querySelector(':scope > .container');
    const cta = document.createElement('div');
    cta.className = 'container footer-cta';
    cta.innerHTML = `<p class="scene"><span class="no">✳</span> Different interests. Same energy.</p>
      <a class="big" href="/collaborate/#join">Start with hello <span class="arr">↗</span></a>`;
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

/* ---------- Constellation: gentle pointer drift ---------- */
(function initHero() {
  const stage = $('#artStage');
  if (!stage) return;
  if (!finePointer || prefersReducedMotion) return;
  const layers = $$('[data-depth]', stage);
  if (!layers.length) return;
  const hero = stage.closest('.hero-dark') || stage;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    layers.forEach((l) => {
      const d = parseFloat(l.dataset.depth || '0');
      l.style.translate = `${(-x * d * 18).toFixed(1)}px ${(-y * d * 18).toFixed(1)}px`;
    });
  });
  hero.addEventListener('pointerleave', () => {
    layers.forEach((l) => { l.style.translate = '0px 0px'; });
  });
})();

/* ---------- Card builders (content-driven) ---------- */
function hubTag(slug) {
  const hub = hubBySlug(slug);
  return `<span class="tag"><span class="dot" style="--tag-dot:${hub.color};background:${hub.color}"></span>${esc(hub.name)}</span>`;
}

function eventPoster(ev, i = 0) {
  const hub = hubBySlug(ev.hub);
  const { mon, day, full } = fmtDate(ev.dateISO);
  const statusLabel = { upcoming: 'Upcoming', running: 'Running', completed: 'Completed' }[ev.status] || 'Upcoming';
  return `
  <article class="poster" style="--hub:${hub.color}">
    <div class="poster-top">
      <p class="poster-date"><small>${mon} · ${esc(hub.name)}</small>${day}</p>
      <span class="poster-index">${String(i + 1).padStart(2, '0')}</span>
    </div>
    <h3>${esc(ev.title)}</h3>
    <div class="poster-meta">
      <span class="status status-${esc(ev.status)}"><span class="pulse"></span>${statusLabel}</span>
      ${ev.sample ? '<span class="sample-flag">sample</span>' : ''}
    </div>
    <p>${esc(ev.description)}</p>
    <div class="poster-foot">
      <span class="venue"><time datetime="${esc(ev.dateISO)}">${esc(full)}</time> · ${esc(ev.venue)}</span>
      ${ev.sample
        ? '<span style="font-size:.84rem;color:var(--ink-faint)">Demo layout — signups open with real events.</span>'
        : `<a class="u-link" style="font-size:.95rem" href="${esc(ev.link || '/events/')}">Details <span class="arr">→</span></a>`}
    </div>
  </article>`;
}

function featuredPoster() {
  return `
  <article class="poster poster-big">
    <span class="slate">✳ Season 01</span>
    <p class="ghost-word" aria-hidden="true">SOON</p>
    <h3>The first season is loading…</h3>
    <p>Build nights, match days, game nights, workshops. Dates lock here first — with venues, eligibility and registration. Sample posters beside this one show the layout; they are not real events.</p>
    <div class="poster-foot">
      <span class="status status-upcoming"><span class="pulse"></span>Announced soon</span>
      <a class="u-link" style="font-size:.95rem;color:var(--paper-strong)" href="/events/">How events work <span class="arr">→</span></a>
    </div>
  </article>`;
}

function projectFeature(p, i) {
  const hub = hubBySlug(p.hub);
  return `
  <article class="feature reveal${i % 2 ? ' flip' : ''}">
    <div class="feature-visual" style="background:${hub.tint};background-image:radial-gradient(${hub.color}44 1.6px, transparent 1.6px);background-size:18px 18px">
      <svg class="motif" viewBox="0 0 48 48" fill="none" stroke="${hub.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="2" fill="#fff" stroke="#171717" stroke-width="3"/><path d="M18 20l-4 4 4 4M30 20l4 4-4 4M27 17l-6 14"/></svg>
      <span class="ghost-num" aria-hidden="true">0${i + 1}</span>
      ${p.sample ? '<span class="sample-flag" style="position:absolute;top:1rem;left:1rem">sample</span>' : ''}
    </div>
    <div class="feature-body">
      ${hubTag(p.hub)}
      <h3>${esc(p.title)}</h3>
      <p class="byline">by ${esc(p.creator)}</p>
      <p class="desc">${esc(p.description)}</p>
      ${p.link ? `<a class="u-link" href="${esc(p.link)}" rel="noopener">View project <span class="arr">→</span></a>` : ''}
    </div>
  </article>`;
}

function openCall({ title, text, actions }) {
  return `
  <div class="open-call reveal">
    <div>
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
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
    preview.innerHTML = featuredPoster() + (live.length
      ? live.map((e, i) => eventPoster(e, i + 1)).join('')
      : sampleEvents.slice(0, 2).map((e, i) => eventPoster(e, i + 1)).join(''));
  }

  const full = $('[data-render="events-full"]');
  if (full) {
    if (confirmedEvents.length) {
      full.innerHTML = `<div class="poster-grid">${confirmedEvents.map((e, i) => eventPoster(e, i)).join('')}</div>`;
    } else {
      full.innerHTML = `
        <div class="empty-state">
          <h3>No confirmed events yet.</h3>
          <p>We are setting up the first season of sessions, matches and game nights. Once dates lock, they appear here with venues, eligibility and registration.</p>
          <div class="invite-row"><a class="btn btn-sm btn-primary" href="/collaborate/">Propose an event</a><a class="btn btn-sm btn-ghost" href="/hubs/">Explore the hubs</a></div>
        </div>
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
    } else {
      el.innerHTML = openCall({
        title: 'The shelf is empty — for now.',
        text: 'Built a website, won a match, shipped a game, made something you are proud of? Nothing here is fabricated — every future entry credits its real creator, with approval.',
        actions: '<a class="btn btn-sm btn-sun" href="/collaborate/">Submit your project</a><a class="btn btn-sm btn-ghost" href="/hubs/">Find your hub</a>',
      });
    }
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
      <header><h3>${col.title}</h3><span class="status ${col.cls}"><span class="pulse"></span>${list.length}</span></header>
      ${rows ? `<ul class="ledger">${rows}</ul>` : `<p class="standfirst" style="margin-top:.4rem">${col.empty}</p>`}
    </div>`;
  }).join('');
})();

/* ---------- Team ---------- */
(function renderTeam() {
  const grid = $('[data-render="team"]');
  if (!grid) return;
  const tints = ['#E3EDFF', '#DFF5E9', '#EAE2FD', '#FFEADB', '#FFF3D6'];
  grid.innerHTML = teamRoles.map((m, i) => `
    <div class="member-card reveal">
      <div class="member-avatar" style="--avatar-bg:${tints[i % tints.length]}" aria-hidden="true">?</div>
      <p class="role">${esc(m.role)}</p>
      <h3>Profile coming soon</h3>
      <p class="bio">${esc(m.note)} Real names and photos appear only with approval.</p>
    </div>`).join('');
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
            ? 'This is a <strong>demonstration</strong> — nothing was sent anywhere. Once the team connects a form service (see <code>src/js/config.js</code>), submissions here will be delivered for real.'
            : 'Your proposal is on its way. We reply to every genuine proposal — usually within a week.'}
        </p>
        <div class="invite-row"><a class="btn btn-sm btn-ghost" href="/hubs/">Explore the hubs meanwhile</a></div>
      </div>`;
    wrap.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
  }
})();
