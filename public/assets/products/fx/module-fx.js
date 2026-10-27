/* vSuite product modules - shared motion layer: scroll progress, scroll reveal (staggered), scroll-spy. */
(function () {
  try {
    var d = document, root = d.documentElement;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    // scroll progress bar + header shadow
    var bar = d.createElement('div'); bar.className = 'fx-progress'; d.body.appendChild(bar);
    var ticking = false;
    function onScroll() {
      ticking = false;
      var max = root.scrollHeight - window.innerHeight, y = window.pageYOffset || root.scrollTop;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
      root.classList.toggle('fx-scrolled', y > 8);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // scroll-spy: highlight the header link of the section being read
    if ('IntersectionObserver' in window) {
      var links = [].slice.call(d.querySelectorAll('header a[href^="#"]'));
      var map = {};
      links.forEach(function (a) {
        var id = a.getAttribute('href').slice(1); if (!id) return;
        var sec = d.getElementById(id); if (sec) (map[id] = map[id] || { sec: sec, links: [] }).links.push(a);
      });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove('fx-active'); });
          (map[e.target.id] || { links: [] }).links.forEach(function (a) { a.classList.add('fx-active'); });
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      Object.keys(map).forEach(function (k) { spy.observe(map[k].sec); });
    }

    if (reduce || !('IntersectionObserver' in window)) return;

    // scroll reveal for cards / section headings (hero has its own load animation; .reveal elements keep the page's own effect)
    var SEL = '.section-head,.section-copy,.section-intro,.showcase-head,.showcase-note,.card,.feature,.feature-card,.module,.step,.metric,' +
      '.benefit,.integration,.industry-card,.workflow-step,.value-card,.canva-card,.content-card,.showcase-card,.intelligence-card,.arch-card,' +
      '.outcome-item,.life-step,.mini-panel,.mock-card,.product,.ai-capability,.integration-node,.agent-step,.flow-step,.node,.info-panel,' +
      '.faq-item,.panel,.dash-panel,.canva-panel,.data-table,.svg-diagram,.diagram,figure,.image-card,.kpi-strip,.sample';
    var all = [].slice.call(d.querySelectorAll(SEL)).filter(function (el) {
      return !el.closest('header,footer,.hero') && !el.classList.contains('reveal') && !el.closest('.reveal');
    });
    var set = new Set(all);
    var els = all.filter(function (el) {            // outermost matches only
      for (var p = el.parentElement; p; p = p.parentElement) if (set.has(p)) return false;
      return true;
    });
    root.classList.add('fx-js');
    var seen = new Map();
    els.forEach(function (el) {
      var n = seen.get(el.parentElement) || 0; seen.set(el.parentElement, n + 1);
      el.style.setProperty('--fx-d', Math.min(n, 7) * 0.08 + 's');
      el.classList.add('fx-reveal');
      if (/^(FIGURE)$/.test(el.tagName) || el.classList.contains('image-card') || el.classList.contains('panel') || el.classList.contains('dash-panel')) el.classList.add('fx-zoom');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; io.unobserve(el); el.classList.add('fx-in');
        setTimeout(function () {                    // hand control back so hover transitions are not slowed by the reveal
          el.classList.remove('fx-reveal', 'fx-in', 'fx-zoom'); el.style.removeProperty('--fx-d');
        }, 1300);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } catch (err) { if (window.console) console.warn('module-fx', err); }
})();

/* ---- vSuite product modules: navigation bridge ----
   - vSuite product links (footer)      -> that product's page
   - "Request a Demo" / "Book a Demo"   -> the site's Book a Demo form (/book-demo), product pre-selected
   - "Contact" controls                 -> the site's Contact Us page (/contact-us)
   - the module logo                    -> smooth scroll back to this page's hero
   The page runs inside an iframe, so it asks the parent site (postMessage) to change route;
   opened on its own it navigates directly. */
(function () {
  try {
    var d = document;
    var PRODUCTS = {
      'vsuite accounting': '/product/vsuite-finance/accounting',
      'vsuite billing': '/product/vsuite-finance/billing',
      'vsuite finance': '/product/vsuite-finance',
      'vsuite payroll': '/product/vsuite-workforce/payroll',
      'vsuite human resources': '/product/vsuite-workforce/hr',
      'vsuite workforce': '/product/vsuite-workforce',
      'vsuite e-commerce': '/product/vsuite-commerce/ecommerce',
      'vsuite commerce': '/product/vsuite-commerce/ecommerce',
      'vsuite processflow': '/product/vsuite-logistics/processflow',
      'vsuite logistics': '/product/vsuite-logistics/processflow',
      'vsuite hospital management': '/product/vsuite-healthcare/hospital-management',
      'vsuite healthcare': '/product/vsuite-healthcare/hospital-management'
    };
    var FILE = { accounting: 1, billing: 1, hr: 1, payroll: 1, ecommerce: 1, processflow: 1, hospital: 1 };
    var CONTACT = '/contact-us';
    var here = (location.pathname.split('/').pop() || '').replace('.html', '');
    var DEMO = '/book-demo' + (FILE[here] ? '?product=' + here : '');

    function routeFile(r) {
      if (r === '/product/vsuite-finance') return 'accounting';
      if (r === '/product/vsuite-workforce') return 'hr';
      if (r === '/product/vsuite-healthcare') return 'hospital';
      if (r === '/product/vsuite-healthcare/hospital-management') return 'hospital';
      var last = r.split('/').pop(); return FILE[last] ? last : '';
    }
    function norm(t) { return (t || '').replace(/[\u2192\u2014\u2013].*$/, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
    function go(route) {
      if (route.charAt(0) === '/' && route !== CONTACT && route.indexOf('/book-demo') !== 0 && routeFile(route) === here) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (window.parent && window.parent !== window) window.parent.postMessage({ vsNav: route }, window.location.origin);
      else window.location.href = route;
    }

    var DEMO_TEXT = /^(request a demo|book a demo|book my demo|discuss a demonstration|discuss your requirements)/i;
    var CONTACT_TEXT = /^(contact|view contact information)/i;
    var DEMO_SEL = 'a[href="#request-demo"],a[href="#request-a-demo"],a[href="#demo-panel"],#demo-request-button,#demo-button';
    var CONTACT_SEL = 'a[href="#contact"],a[href="#contact-options"],#demo-contact-button,' +
      '[data-template-id="contact-link-placeholder"],[data-template-id="contact-placeholder"],[data-template-id="footer-contact"],[data-template-id="footer-contact-placeholder"]';

    function kind(el) {
      var c = el.closest('a, button');
      if (c && !c.closest('summary, .faq, .faq-list, [id^="faq"]') && c.getAttribute('aria-expanded') === null) {
        var t = (c.textContent || '').replace(/\s+/g, ' ').trim();
        if (DEMO_TEXT.test(t)) return 'demo';
        if (CONTACT_TEXT.test(t)) return 'contact';
      }
      if (el.closest(CONTACT_SEL)) return 'contact';
      if (el.closest(DEMO_SEL)) return 'demo';
      return '';
    }
    function productTarget(el) {
      var t = el.closest('footer a, footer li, footer .footer-placeholder'); if (!t) return null;
      var key = norm(t.textContent); return PRODUCTS.hasOwnProperty(key) ? PRODUCTS[key] : null;
    }
    function stop(e) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }

    d.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;
      var p = productTarget(e.target);
      if (p) { stop(e); go(p); return; }
      var k = kind(e.target);
      if (k) { stop(e); go(k === 'demo' ? DEMO : CONTACT); return; }
      var site = e.target.closest('a[href^="/"]');
      if (site && site.getAttribute('href').indexOf('//') !== 0) { stop(e); go(site.getAttribute('href')); return; }
      var logo = e.target.closest('header a.brand, header .brand a, header a[aria-label*="logo" i], header a[aria-label*="home" i], header a[aria-label*="overview" i]');
      if (logo) { stop(e); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    }, true);

    // real href + target=_top as a no-JS fallback; keyboard support for non-link elements
    function decorate() {
      [].slice.call(d.querySelectorAll('footer a, footer li, footer .footer-placeholder')).forEach(function (el) {
        var key = norm(el.textContent); if (!PRODUCTS.hasOwnProperty(key)) return;
        var route = PRODUCTS[key];
        if (el.tagName === 'A') { el.setAttribute('href', route); el.setAttribute('target', '_top'); }
        else if (!el.querySelector('a')) { el.setAttribute('role', 'link'); el.setAttribute('tabindex', '0'); el.style.cursor = 'pointer';
          el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(route); } }); }
      });
      [].slice.call(d.querySelectorAll(CONTACT_SEL)).forEach(function (el) {
        if (el.tagName !== 'A' && el.tagName !== 'BUTTON') { el.style.cursor = 'pointer'; el.setAttribute('role', 'link'); el.setAttribute('tabindex', '0');
          el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); go(CONTACT); } }); }
      });
    }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', decorate); else decorate();
  } catch (err) { if (window.console) console.warn('module-nav', err); }
})();
