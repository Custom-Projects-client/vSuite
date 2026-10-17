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
   Related-product links go to that product page; every "Request a Demo" / "Contact" control opens the site's Contact Us form.
   The page runs inside an iframe, so it asks the parent site (postMessage) to change route; opened on its own it navigates directly. */
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
      'vcore': '/'
    };
    var FILE = { 'accounting': 'accounting', 'billing': 'billing', 'hr': 'hr', 'payroll': 'payroll', 'ecommerce': 'ecommerce', 'processflow': 'processflow' };
    var CONTACT = '/contact-us';
    var here = (location.pathname.split('/').pop() || '').replace('.html', '');

    function routeFile(r) {
      if (r === '/product/vsuite-finance') return 'accounting';
      if (r === '/product/vsuite-workforce') return 'hr';
      var last = r.split('/').pop(); return FILE[last] || '';
    }
    function norm(t) { return (t || '').replace(/[\u2192\u2014\u2013].*$/, '').replace(/\s+/g, ' ').trim().toLowerCase(); }
    function go(route) {
      if (route !== CONTACT && routeFile(route) === here) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (window.parent && window.parent !== window) window.parent.postMessage({ vsNav: route }, '*');
      else window.location.href = route;
    }

    // ----- which clicks mean "contact / demo" -----
    var CONTACT_SEL = [
      'a[href="#request-demo"]', 'a[href="#request-a-demo"]', 'a[href="#contact"]', 'a[href="#contact-options"]', 'a[href="#demo-panel"]',
      '#demo-request-button', '#demo-contact-button', '#demo-button',
      '[data-template-id="contact-link-placeholder"]', '[data-template-id="contact-placeholder"]',
      '[data-template-id="footer-contact"]', '[data-template-id="footer-contact-placeholder"]'
    ].join(',');
    var CONTACT_TEXT = /^(request a demo|contact|contact vishva digital technologies|discuss a demonstration|discuss your requirements|view contact information)\b/i;

    function contactTarget(el) {
      var hit = el.closest(CONTACT_SEL); if (hit) return hit;
      var c = el.closest('a, button');
      if (c && !c.closest('summary, .faq, .faq-list, [id^="faq"]') && c.getAttribute('aria-expanded') === null && CONTACT_TEXT.test((c.textContent || '').replace(/\s+/g, ' ').trim())) return c;
      return null;
    }
    // ----- related-product entries in the footer -----
    function productTarget(el) {
      var t = el.closest('footer a, footer li, footer .footer-placeholder'); if (!t) return null;
      var key = norm(t.textContent); return PRODUCTS.hasOwnProperty(key) ? { el: t, route: PRODUCTS[key] } : null;
    }

    d.addEventListener('click', function (e) {
      if (!e.target || !e.target.closest) return;
      var p = productTarget(e.target);
      if (p) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); go(p.route); return; }
      var c = contactTarget(e.target);
      if (c) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); go(CONTACT); }
    }, true);

    // make footer product entries look and behave like links (real href + target=_top as a no-JS fallback)
    function decorate() {
      [].slice.call(d.querySelectorAll('footer a, footer li, footer .footer-placeholder')).forEach(function (el) {
        var key = norm(el.textContent); if (!PRODUCTS.hasOwnProperty(key)) return;
        var route = PRODUCTS[key];
        if (el.tagName === 'A') { el.setAttribute('href', route); el.setAttribute('target', '_top'); }
        else { el.setAttribute('role', 'link'); el.setAttribute('tabindex', '0'); el.style.cursor = 'pointer';
          el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(route); } }); }
      });
      [].slice.call(d.querySelectorAll(CONTACT_SEL)).forEach(function (el) { if (el.tagName !== 'A' && el.tagName !== 'BUTTON') { el.style.cursor = 'pointer'; el.setAttribute('role', 'link'); el.setAttribute('tabindex', '0'); el.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); go(CONTACT); } }); } });
    }
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', decorate); else decorate();
  } catch (err) { if (window.console) console.warn('module-nav', err); }
})();
