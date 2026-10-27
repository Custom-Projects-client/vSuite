import { Routes } from '@angular/router';

// One entry per page.
// - path: URL after the domain ('' = home)
// - title: browser tab text
// - data.bodyClass: CSS class set on <body> (theme styles use it)
// - loadComponent: lazy-loads the page only when visited
export const routes: Routes = [
  {
    path: '',
    title: 'vSuite | Vishva Digital Technologies',
    data: {
      bodyClass:
        'home page-template-default page page-id-58 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'about-us',
    title: 'About Us | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-295 page-child parent-pageid-707 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/about-us/about-us').then((m) => m.AboutUs),
  },
  {
    path: 'our-team',
    title: 'Our Team | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-435 page-child parent-pageid-707 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/our-team/our-team').then((m) => m.OurTeam),
  },
  {
    path: 'our-clients',
    title: 'Our Clients | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-402 page-child parent-pageid-707 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/our-clients/our-clients').then((m) => m.OurClients),
  },
  {
    path: 'services',
    title: 'Our Services | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-81 page-child parent-pageid-251 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/services/services').then((m) => m.Services),
  },
  {
    path: 'service-page',
    title: 'Service Page | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-371 page-child parent-pageid-251 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/service-page/service-page').then((m) => m.ServicePage),
  },
  {
    path: 'works',
    title: 'Our Works | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-254 page-child parent-pageid-364 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/works/works').then((m) => m.Works),
  },
  {
    path: 'blog',
    title: 'Our Blogs | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-548 page-child parent-pageid-545 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog),
  },
  {
    path: 'contact-us',
    title: 'Contact Us | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-11 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/contact-us/contact-us').then((m) => m.ContactUs),
  },
  {
    path: 'book-demo',
    title: 'Book a Demo | vSuite',
    data: {
      bodyClass:
        'page-template-default page page-id-11 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/book-demo/book-demo').then((m) => m.BookDemo),
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | vSuite',
    data: {
      doc: 'privacy',
      bodyClass:
        'page-template-default page page-id-11 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/legal/legal').then((m) => m.Legal),
  },
  {
    path: 'terms',
    title: 'Terms of Use | vSuite',
    data: {
      doc: 'terms',
      bodyClass:
        'page-template-default page page-id-11 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () => import('./pages/legal/legal').then((m) => m.Legal),
  },
  {
    path: 'works/our-work-1',
    title: 'Awesome Vector Items | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-173 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/our-work-1/our-work-1').then((m) => m.OurWork1),
  },
  {
    path: 'works/our-work-2',
    title: 'Branding Items | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-157 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/our-work-2/our-work-2').then((m) => m.OurWork2),
  },
  {
    path: 'works/our-work-3',
    title: 'All Items Pack | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-191 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/our-work-3/our-work-3').then((m) => m.OurWork3),
  },
  {
    path: 'works/100-best-items',
    title: '100+ Best Items | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-273 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/best-items/best-items').then((m) => m.BestItems),
  },
  {
    path: 'works/branding-tools',
    title: 'Branding Tools | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-274 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/branding-tools/branding-tools').then((m) => m.BrandingTools),
  },
  {
    path: 'works/fast-logo-items',
    title: 'Fast Logo Items | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-277 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/fast-logo-items/fast-logo-items').then((m) => m.FastLogoItems),
  },
  {
    path: 'works/lets-get-money',
    title: 'Lets Get Money | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-275 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/lets-get-money/lets-get-money').then((m) => m.LetsGetMoney),
  },
  {
    path: 'works/unbelievable-items',
    title: 'Unbelievable Items | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-276 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/unbelievable-items/unbelievable-items').then(
        (m) => m.UnbelievableItems,
      ),
  },
  {
    path: 'works/world-items',
    title: 'World Items | vSuite',
    data: {
      bodyClass:
        'thegem_pf_item-template-default single single-thegem_pf_item postid-272 wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/work-details/world-items/world-items').then((m) => m.WorldItems),
  },
  {
    path: 'blog/blog-post-1',
    title: 'Sticky Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-206 single-format-standard wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/blog-post-1/blog-post-1').then((m) => m.BlogPost1),
  },
  {
    path: 'blog/blog-post-2',
    title: 'Images Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-192 single-format-standard wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/blog-post-2/blog-post-2').then((m) => m.BlogPost2),
  },
  {
    path: 'blog/blog-post-4',
    title: 'Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-567 single-format-quote wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/blog-post-4/blog-post-4').then((m) => m.BlogPost4),
  },
  {
    path: 'blog/blog-post-4-2',
    title: 'Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-665 single-format-quote wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/blog-post-4-2/blog-post-4-2').then((m) => m.BlogPost4B),
  },
  {
    path: 'blog/blog-post-5',
    title: 'Images Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-569 single-format-standard wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/blog-post-5/blog-post-5').then((m) => m.BlogPost5),
  },
  {
    path: 'blog/blog-post-6',
    title: 'Images Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-571 single-format-standard wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/blog-post-6/blog-post-6').then((m) => m.BlogPost6),
  },
  {
    path: 'blog/text-blog-post',
    title: 'Text Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-219 single-format-standard wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/text-blog-post/text-blog-post').then((m) => m.TextBlogPost),
  },
  {
    path: 'blog/text-blog-post-2',
    title: 'Youtube Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-666 single-format-video wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/text-blog-post-2/text-blog-post-2').then((m) => m.TextBlogPost2),
  },
  {
    path: 'blog/text-blog-post-7',
    title: 'Text Blog Post | vSuite',
    data: {
      bodyClass:
        'post-template-default single single-post postid-573 single-format-standard wpb-js-composer js-comp-ver-6.0.5 vc_responsive',
    },
    loadComponent: () =>
      import('./pages/blog-posts/text-blog-post-7/text-blog-post-7').then((m) => m.TextBlogPost7),
  },
  // Unknown URL -> home
  // ---- Product menu: each module is a standalone HTML page shown by <app-product-view> ----
  { path: 'product', pathMatch: 'full', redirectTo: 'product/vsuite-finance/accounting' },
  { path: 'product/vsuite-finance', pathMatch: 'full', redirectTo: 'product/vsuite-finance/accounting' },
  { path: 'product/vsuite-workforce', pathMatch: 'full', redirectTo: 'product/vsuite-workforce/hr' },
  { path: 'product/vsuite-commerce', pathMatch: 'full', redirectTo: 'product/vsuite-commerce/ecommerce' },
  { path: 'product/vsuite-logistics', pathMatch: 'full', redirectTo: 'product/vsuite-logistics/processflow' },
  { path: 'product/vsuite-healthcare', pathMatch: 'full', redirectTo: 'product/vsuite-healthcare/hospital-management' },
  {
    path: 'product/vsuite-finance/accounting',
    title: 'vSuite Accounting | Vishva Digital Technologies',
    data: { bodyClass: 'product-view-page', src: 'assets/products/accounting.html' },
    loadComponent: () => import('./pages/product-view/product-view').then((m) => m.ProductView),
  },
  {
    path: 'product/vsuite-finance/billing',
    title: 'vSuite Billing | Vishva Digital Technologies',
    data: { bodyClass: 'product-view-page', src: 'assets/products/billing.html' },
    loadComponent: () => import('./pages/product-view/product-view').then((m) => m.ProductView),
  },
  {
    path: 'product/vsuite-workforce/hr',
    title: 'vSuite Human Resources | Vishva Digital Technologies',
    data: { bodyClass: 'product-view-page', src: 'assets/products/hr.html' },
    loadComponent: () => import('./pages/product-view/product-view').then((m) => m.ProductView),
  },
  {
    path: 'product/vsuite-workforce/payroll',
    title: 'vSuite Payroll | Vishva Digital Technologies',
    data: { bodyClass: 'product-view-page', src: 'assets/products/payroll.html' },
    loadComponent: () => import('./pages/product-view/product-view').then((m) => m.ProductView),
  },
  {
    path: 'product/vsuite-commerce/ecommerce',
    title: 'vSuite E-Commerce | Vishva Digital Technologies',
    data: { bodyClass: 'product-view-page', src: 'assets/products/ecommerce.html' },
    loadComponent: () => import('./pages/product-view/product-view').then((m) => m.ProductView),
  },
  {
    path: 'product/vsuite-logistics/processflow',
    title: 'vSuite ProcessFlow | Vishva Digital Technologies',
    data: { bodyClass: 'product-view-page', src: 'assets/products/processflow.html' },
    loadComponent: () => import('./pages/product-view/product-view').then((m) => m.ProductView),
  },
  {
    path: 'product/vsuite-healthcare/hospital-management',
    title: 'vSuite Hospital Management | Vishva Digital Technologies',
    data: { bodyClass: 'product-view-page', src: 'assets/products/hospital.html' },
    loadComponent: () => import('./pages/product-view/product-view').then((m) => m.ProductView),
  },
  { path: '**', redirectTo: '' },
];
