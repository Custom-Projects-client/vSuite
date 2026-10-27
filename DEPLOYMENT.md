# vSuite - deploying to production

## 1. Build
```bash
npm install
npm run build -- --configuration production     # output: dist/agency-dark-angular/browser/
```
Upload the **contents** of `dist/agency-dark-angular/browser/` to the web root of the site (e.g. `public_html/`).
The project must be served from the domain root (`<base href="/">` in `src/index.html`).
If it must live in a sub-folder, build with `--base-href /folder/`.

## 2. Make every URL work (single-page app)
Refreshing `/product/vsuite-finance/billing` or `/book-demo` must open `index.html`. Already included in `public/`:

| Host | File (copied into the build automatically) |
|---|---|
| Apache / cPanel / shared hosting | `.htaccess` |
| IIS / Azure | `web.config` |
| Netlify / Cloudflare Pages | `_redirects` |
| Nginx | add `location / { try_files $uri $uri/ /index.html; }` to the server block |

Use HTTPS (the contact map and form service need it on a live site).

## 3. Forms (contact, book a demo, newsletter)
`src/app/core/mail.service.ts` sends to info@vishvadigitaltechnologies.com through FormSubmit.co.
* **Activate once:** submit any form on the LIVE site, then open the activation e-mail FormSubmit sends to
  info@vishvadigitaltechnologies.com (check Spam) and click **Activate Form**. Until then FormSubmit replies `success: "false"`.
* The reason for any failure is printed in the browser console (`[vSuite mail] ...`) and is in the `message` field of the
  request in DevTools -> Network.
* No activation e-mail wanted? Create a free key at https://web3forms.com and paste it into `WEB3FORMS_KEY` in `mail.service.ts`.

## 4. Before going live - checklist
* Replace the `#` social-media links (`src/app/core/site-data.ts`, footer) with real profile URLs.
* Open every page once, plus a product page -> "Request a Demo" -> submit the demo form, and the contact form.
* Submit each form once on the live domain so the FormSubmit activation e-mail is triggered.
