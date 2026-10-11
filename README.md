# yuvora-official
The main official yuvora club website

## Yuvora website (Phase 1) — yuvora.org

Independent, student-led, multi-interest community. `Different interests. Same energy.`

**Stack:** Vite 7 multi-page app + vanilla HTML/CSS/JS. No frameworks, no database, no backend — static output in `dist/`, deployable to Vercel, Netlify, GitHub Pages, or any static host.

### Run locally

npm CLI is blocked as `.ps1` on some Windows setups — use `npm.cmd`:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev      # dev server (default http://localhost:5173)
& "C:\Program Files\nodejs\npm.cmd" run build    # production build → dist/
& "C:\Program Files\nodejs\npm.cmd" run preview  # preview the build
```

Or serve `dist/` with any static server after `run build`.

### Routes

`/` · `/hubs/` · `/hubs/tech/` · `/hubs/sporting/` · `/hubs/esports/` · `/hubs/future/` · `/events/` · `/projects/` · `/workshops/` · `/team/` · `/collaborate/` (+ `/collaborate/#join` pre-selects membership) · `404.html`

### Where to edit content (no layout changes needed)

- `src/js/config.js` — contact email, socials, form endpoint, affiliations. **Fill these in only when real details exist.**
- `src/js/data.js` — hubs, events, projects, workshops, team roles. Add real entries to the `confirmed*` arrays; `sample*` entries are layout previews and are always badged "Sample".
- `public/logo.svg`, `public/mark.svg`, `public/favicon.svg` — replace with the approved logo when ready (same filenames, no code changes).

### Honesty rules

- Never present samples/placeholders as real members, events, sponsors, or achievements.
- The collaborate form runs in **demo mode** until `formEndpoint` is set — it says so on the page.
- No social handles, emails, or legal pages are invented; missing items render as "coming soon".
