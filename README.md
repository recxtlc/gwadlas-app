# Gwadlas

Website for **Gwadlas**, a bespoke clothing house in Pretoria. It's a static site built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed to GitHub Pages.

Pages: Home, About, Services, Gallery, Book. Customers book a consultation slot through a Cal.com embed. There's no payment and no shop.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
```

Other commands:

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run build`   | Builds the static site into `dist/`           |
| `npm run preview` | Serves the built `dist/` folder locally        |
| `npm run check`   | Type-checks the Astro and TypeScript files     |

## Editing content

All text and image references live in `src/content/`. Edit these files; you don't need to touch the page code.

| File            | What's in it                                                        |
| --------------- | ------------------------------------------------------------------- |
| `site.json`     | Name, contact details, address, opening hours, navigation, footer   |
| `home.json`     | Home page hero, featured pieces, stats and call to action           |
| `about.json`    | Story, client quote and the people                                  |
| `services.json` | Appointment types, what we make (with "from" prices), the process   |
| `gallery.json`  | Every gallery piece: title, category, price, cloth, story, photo    |
| `book.json`     | Book page text                                                      |
| `photos.json`   | Image files and photographer credits                                |

**Adding a photo:** put the file in `public/images/`, add an entry to `src/content/photos.json` (for example `"photo-16": { "src": "/images/my-photo.jpg", "credit": "…", "href": "…" }`), then use `"photo-16"` wherever a `photo` is asked for. For your own photography, set `credit` to an empty string and remove the credit link in `src/components/Photo.astro`, or keep it for attribution.

**Colours and fonts** are defined once in `src/styles/global.css` under `@theme`.

## Editing in the browser (/admin)

The site includes [Decap CMS](https://decapcms.org) at `/admin` (there's also an "Edit site" link at the bottom of every page). The owner can add, edit and reorder gallery pieces, upload their photos, and change the Book page text and calendar link, all without touching code. Each save commits to GitHub, and the deploy workflow republishes the site within a few minutes. Settings are in `public/admin/config.yml`; the page itself is `src/pages/admin/index.astro`.

**Try it locally:**

```bash
npm run dev          # terminal 1
npm run cms          # terminal 2: the local editor helper (decap-server)
```

Then open http://localhost:4321/admin and click **Login**. Changes are written straight to your local files. Without `npm run cms` running, the editor tries to sign in with GitHub instead, which only works once the live setup below is done.

**Use it on the live site (one-time setup):**

1. In `public/admin/config.yml`, set `repo` to the real `owner/gwadlas-app`.
2. GitHub sign-in needs a small OAuth helper, because GitHub Pages can't hold a secret. The usual free option is a Cloudflare Worker such as [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth):
   - Create a GitHub OAuth App (**GitHub → Settings → Developer settings → OAuth Apps**). Set its callback URL to the Worker's `/callback` address.
   - Deploy the Worker with the OAuth App's client ID and secret.
   - Put the Worker's address in `base_url` in `config.yml`.
3. Anyone who should edit the site needs write access to the GitHub repository.

Uploaded photos land in `public/images/`. Gallery photos with no entry in `photos.json` show no credit, which is right for your own photography.

Visitors can't upload anything; the Book page asks clients to email reference photos instead.

## Adding the Cal.com booking widget

The Book page loads Cal.com's inline calendar (dark theme, purple accent) as soon as it knows your booking link.

1. Create a free account at [cal.com](https://cal.com) and an event type, for example "Consultation", 60 minutes.
2. Copy the event's link, e.g. `https://cal.com/gwadlas/consultation`.
3. Put the part after `https://cal.com/` into `calLink` in `src/content/book.json` (or in **/admin → Book page → Cal.com booking link**):
   ```json
   "calLink": "gwadlas/consultation",
   ```

Link to a single event (`username/event`), not just the username: an event shows the month calendar, while a username shows a list of events. The embed hides Cal.com's side panel with the host's name and photo; to keep a personal name out of booking pages and emails too, set the Cal.com profile name (**Settings → My account → Profile**) to "Gwadlas".

While `calLink` is empty, the page shows a placeholder asking people to email or call instead.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

One-time setup:

1. Create a GitHub repository named `gwadlas-app` and push this project:
   ```bash
   git remote add origin https://github.com/<your-user>/gwadlas-app.git
   git push -u origin main
   ```
2. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The next push (or **Actions → Deploy to GitHub Pages → Run workflow**) publishes the site at `https://<your-user>.github.io/gwadlas-app/`.

The workflow reads the base path from the Pages settings, so links work both on the `github.io/gwadlas-app/` address and on a custom domain with no code change.

## Custom domain (.co.za)

1. Register the domain with a South African registrar (for example Domains.co.za or Afrihost).
2. In the registrar's DNS settings:
   - For the apex domain (`gwadlas.co.za`), add four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
   - For `www`, add a `CNAME` record pointing to `<your-user>.github.io`.
3. In **Settings → Pages → Custom domain**, enter the domain and save. GitHub adds the DNS check; once it passes, tick **Enforce HTTPS**.
4. Re-run the deploy workflow so the build picks up the new domain and root base path.

DNS changes can take up to a day to spread.

## Project structure

```
src/
  components/   Header, Footer, Photo and shared page sections
  content/      Editable JSON content (see above)
  layouts/      BaseLayout: <head>, header and footer around every page
  lib/          Helpers for base-path-aware links and photo lookup
  pages/        index, about, services, gallery, book
  styles/       Tailwind import and design tokens
public/
  images/       Photos
```
