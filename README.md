# Integrated DGR website preview

An institutional website preview for the **Liberia Institute for Integrated Development, Democracy, Rights & Governance**. It uses the supplied logo at `assets/dgr_logo.jpeg` and is intentionally configured as a no-index demonstration site.

## Run locally

```bash
npm install
npm run dev
```

Build a production bundle with `npm run build`, then test it with `npm run preview`.

## Admin dashboard, Neon, and submissions

The protected dashboard is available at `/admin`. Its sidebar provides live overview, detailed analytics, content studio, programs, news and press, resources, team, policies, inquiry, newsletter subscriber, and site settings areas. Contact forms, newsletter subscriptions, and anonymous page-view events are written to Neon through Vercel serverless functions. The dashboard reads the latest database data whenever it is refreshed.

The Neon database schema includes `admin_users`, `contact_submissions`, `newsletter_subscribers`, `analytics_events`, and `content_entries`. Analytics tracks anonymous sessions, page paths, referrer domains, and broad device categories without storing visitor names, emails, or IP addresses. The `api/` folder contains the serverless endpoints; browser code never receives the database URL or JWT secret.

### Vercel deployment

1. Import this folder into Vercel as a Vite project.
2. Add both variables from `.env.example` to **Production**, **Preview**, and **Development** in Vercel Project Settings → Environment Variables.
3. Deploy. Vercel detects `api/` as serverless functions and serves `dist/` for the frontend. `vercel.json` provides the SPA fallback.
4. Visit `/admin` and sign in with the administrator credentials delivered separately. Change the generated password after the first sign-in workflow is extended with password management.

Do not put `DATABASE_URL` or `ADMIN_JWT_SECRET` in a `VITE_` variable or commit a populated `.env` file.

## Content and launch hand-off

- The editable mock content model is in `src/data.js`. Navigation, sections, child pages, articles, resources, images, and the preview notice are centrally defined there.
- Replace remote illustrative image URLs in `src/data.js` with approved, licensed images. The gallery explicitly identifies the current images as illustrative.
- Put official approved documents in `public/` and add their links only after they are available. The preview deliberately has no fabricated downloads.
- Approved contact details are in the site footer and contact page. The embedded map points to Monrovia, Liberia.
- The contact form and newsletter now submit to the protected Neon-backed serverless API. Add a transactional email provider later if notifications in addition to dashboard access are required; keep any provider keys server-side.
- Set `site.demoMode` to `false`, remove/update the preview notice, and replace the `noindex,nofollow` meta directive in `index.html` only after all official content is approved. Configure the public host with a SPA fallback; `public/_redirects` includes a Netlify-compatible fallback rule.

## Notes

All program descriptions, profiles, policies, initiatives, articles, resources, dates, and course details are clearly marked sample/proposed content. No achievements, donors, contact details, enrollment, accreditations, or official documentation are claimed.
