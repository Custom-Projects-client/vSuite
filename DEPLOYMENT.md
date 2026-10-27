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

## 5. Notes from the website-feedback round
* **Map pin (footer "We are here" + Contact page):** both maps search for "Vishva Digital Technologies, 11/1G, 4th St, Durga Colony, Sembakkam, Chennai 600073".
  The Contact page also has an **Open in Google Maps** button that opens the exact pin from https://maps.app.goo.gl/ZhS3LMUN2NZNsH7i8.
  To embed that exact pin: Google Maps -> Share -> *Embed a map* -> copy the `src="..."` value and replace the `https://www.google.com/maps?q=...&output=embed` URL in
  `src/app/layout/footer/footer.html` and `src/app/pages/contact-us/contact-section.html`.
* **Forms (Contact, Book a Demo, Subscribe):** if the form service cannot deliver (FormSubmit not activated yet, no internet, blocked), the visitor now sees a clear message and
  their e-mail app opens with the message ready, so no enquiry is lost. Activate FormSubmit once (section 3) and messages arrive directly in the mailbox.
* **vSuite Hospital Management (vSuite Healthcare):** page `public/assets/products/hospital.html`, routes `/product/vsuite-healthcare/hospital-management`.
  The text and the images `logo-healthcare.jpg`, `product-healthcare.jpg`, `modules/logo-hospital-header.png` are **placeholders** - replace the files (same names) and edit the text when the real details are ready.
* **Blog:** the nine blog post detail pages still contain the theme's Lorem Ipsum text and are waiting for the real articles.
