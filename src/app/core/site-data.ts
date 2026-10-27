// Site-wide data. Edit here -> header menu updates on every page.

export interface MenuItem {
  label: string;
  link: string; // router path, e.g. '/about-us'
  children?: MenuItem[]; // optional sub-menu
}

export const MENU: MenuItem[] = [
  {
    label: 'About Us',
    link: '/about-us',
    children: [
      { label: 'About Us', link: '/about-us' },
      { label: 'Our Team', link: '/our-team' },
      { label: 'Our Clients', link: '/our-clients' },
    ],
  },
  {
    label: 'Product',
    link: '/product',
    children: [
      {
        label: 'vSuite Finance',
        link: '/product/vsuite-finance',
        children: [
          { label: 'Accounting', link: '/product/vsuite-finance/accounting' },
          { label: 'Billing', link: '/product/vsuite-finance/billing' },
        ],
      },
      {
        label: 'vSuite Workforce',
        link: '/product/vsuite-workforce',
        children: [
          { label: 'Human Resources', link: '/product/vsuite-workforce/hr' },
          { label: 'Payroll', link: '/product/vsuite-workforce/payroll' },
        ],
      },
      {
        label: 'vSuite Commerce',
        link: '/product/vsuite-commerce',
        children: [{ label: 'E-Commerce', link: '/product/vsuite-commerce/ecommerce' }],
      },
      {
        label: 'vSuite Logistics',
        link: '/product/vsuite-logistics',
        children: [{ label: 'ProcessFlow', link: '/product/vsuite-logistics/processflow' }],
      },
      {
        label: 'vSuite Healthcare',
        link: '/product/vsuite-healthcare',
        children: [{ label: 'Hospital Management', link: '/product/vsuite-healthcare/hospital-management' }],
      },
    ],
  },
  // Hidden for now (uncomment to show the menu item again):
  // {
  //   label: 'Services',
  //   link: '/services',
  //   children: [
  //     { label: 'Our Services', link: '/services' },
  //     { label: 'Service Page', link: '/service-page' },
  //   ],
  // },
  // Hidden for now (uncomment to show the menu item again):
  // {
  //   label: 'Works',
  //   link: '/works',
  //   children: [
  //     { label: 'Our Works', link: '/works' },
  //     { label: 'Work Example 1', link: '/works/our-work-1' },
  //     { label: 'Work Example 2', link: '/works/our-work-2' },
  //     { label: 'Work Example 3', link: '/works/our-work-3' },
  //   ],
  // },
  { label: 'Blog', link: '/blog' },
  { label: 'Contact Us', link: '/contact-us' },
];

// Social icons in the menu. Replace '#' with your real profile URLs.
export const SOCIALS = [
  { name: 'Facebook', icon: 'facebook', url: '#' },
  { name: 'LinkedIn', icon: 'linkedin', url: '#' },
  { name: 'Twitter', icon: 'twitter', url: '#' },
  { name: 'Instagram', icon: 'instagram', url: '#' },
  { name: 'Pinterest', icon: 'pinterest', url: '#' },
  { name: 'YouTube', icon: 'youtube', url: '#' },
];
