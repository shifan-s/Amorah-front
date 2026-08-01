import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa';
import {
  FiArrowUpRight,
  FiMail,
} from 'react-icons/fi';

import BrandLogo from './BrandLogo.jsx';
import { selectNavigationCategories } from '../../store/slices/categorySlice.js';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { label: 'All Styles', to: '/shop' },
      { label: 'New Arrivals', to: '/shop?sort=newest' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Frequently Asked Questions', to: '/faq' },
      { label: 'Shipping Policy', to: '/shipping-policy' },
      { label: 'Returns & Exchanges', to: '/return-policy' },
      { label: 'Size Guide', to: '/size-guide' },
    ],
  },
  {
    title: 'About Amorah',
    links: [
      { label: 'Our Story', to: '/about' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms-and-conditions' },
      { label: 'My Account', to: '/account' },
    ],
  },
];

const contactSettings = {
  email:
    import.meta.env.VITE_AMORAH_SUPPORT_EMAIL ||
    import.meta.env.VITE_SUPPORT_EMAIL ||
    '',

  whatsappUrl:
    import.meta.env.VITE_AMORAH_WHATSAPP_URL ||
    import.meta.env.VITE_WHATSAPP_URL ||
    '',

  instagramUrl:
    import.meta.env.VITE_AMORAH_INSTAGRAM_URL ||
    import.meta.env.VITE_INSTAGRAM_URL ||
    '',

  facebookUrl:
    import.meta.env.VITE_AMORAH_FACEBOOK_URL ||
    import.meta.env.VITE_FACEBOOK_URL ||
    '',
};

function FooterLink({ link }) {
  return (
    <li>
      <Link
        to={link.to}
        className="amorah-focus group inline-flex items-center gap-1.5 text-sm leading-6 text-amorah-brown transition-colors duration-300 hover:text-amorah-maroon"
      >
        <span>{link.label}</span>

        <FiArrowUpRight
          className="translate-y-0.5 text-xs opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

function SocialLink({ href, label, icon }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="amorah-focus grid h-10 w-10 place-items-center rounded-full border border-amorah-border bg-amorah-white text-amorah-maroon transition-all duration-300 hover:-translate-y-1 hover:border-amorah-maroon hover:bg-amorah-maroon hover:text-amorah-white"
    >
      {icon}
    </a>
  );
}

function Footer() {
  const { pathname } = useLocation();
  const navigationCategories = useSelector(selectNavigationCategories);
  const currentYear = new Date().getFullYear();
  const showCustomerSupportStrip = pathname.replace(/\/+$/, '') !== '/contact';

  const shopLinks = navigationCategories.length
    ? [
        { label: 'All Styles', to: '/shop' },
        { label: 'New Arrivals', to: '/shop?sort=newest' },
        ...navigationCategories.slice(0, 5).map((category) => ({
          label: category.name,
          to: `/shop/${category.slug}`,
        })),
      ]
    : footerSections[0].links;

  const sections = [
    {
      ...footerSections[0],
      links: shopLinks,
    },
    ...footerSections.slice(1),
  ];

  const socialLinks = [
    {
      label: 'Instagram',
      href: contactSettings.instagramUrl,
      icon: <FaInstagram aria-hidden="true" />,
    },
    {
      label: 'Facebook',
      href: contactSettings.facebookUrl,
      icon: <FaFacebookF aria-hidden="true" />,
    },
    {
      label: 'WhatsApp',
      href: contactSettings.whatsappUrl,
      icon: <FaWhatsapp aria-hidden="true" />,
    },
  ];

  return (
    <footer className="border-t border-amorah-border bg-amorah-ivory text-amorah-black">
      {showCustomerSupportStrip ? (
        <div className="border-b border-amorah-border">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10 xl:px-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amorah-terracotta">
                Customer assistance
              </p>

              <h2 className="mt-2 font-heading text-2xl font-semibold text-amorah-maroon sm:text-3xl">
                Need help finding the perfect style?
              </h2>
            </div>

            <Link
              to="/contact"
              className="amorah-focus inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-sm border border-amorah-maroon bg-amorah-maroon px-6 text-sm font-semibold text-amorah-white transition-colors duration-300 hover:border-amorah-black hover:bg-amorah-black"
            >
              Contact our team
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : null}

      {/* Main footer */}
      <div className="mx-auto grid max-w-[1500px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1.9fr] lg:gap-16 lg:px-10 lg:py-20 xl:px-14">
        {/* Brand details */}
        <div className="max-w-md">
          <BrandLogo size="md" className="justify-start" />

          <p className="mt-6 max-w-sm text-sm leading-7 text-amorah-brown">
            Thoughtfully curated women&apos;s fashion Amorah 
            created for everyday elegance, meaningful celebrations and
            memorable moments.
          </p>

          {contactSettings.email ? (
            <a
              href={`mailto:${contactSettings.email}`}
              className="amorah-focus mt-6 inline-flex items-center gap-3 text-sm font-medium text-amorah-maroon transition-colors hover:text-amorah-black"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-amorah-border bg-amorah-white">
                <FiMail aria-hidden="true" />
              </span>

              <span>{contactSettings.email}</span>
            </a>
          ) : null}

          <div className="mt-7 flex items-center gap-3">
            {socialLinks.map((social) => (
              <SocialLink
                key={social.label}
                href={social.href}
                label={social.label}
                icon={social.icon}
              />
            ))}
          </div>
        </div>

        {/* Navigation sections */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-xl font-semibold text-amorah-maroon sm:text-2xl">
                {section.title}
              </h2>

              <div className="mt-3 h-px w-10 bg-amorah-terracotta" />

              <ul className="mt-5 space-y-2.5">
                {section.links.map((link) => (
                  <FooterLink
                    key={`${section.title}-${link.to}`}
                    link={link}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-amorah-maroon px-4 py-5 text-amorah-white sm:px-6 lg:px-10 xl:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-6 text-amorah-white/80">
            © {currentYear} Amorah. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-amorah-white/80">
            <Link
              to="/privacy-policy"
              className="amorah-focus transition-colors hover:text-amorah-white"
            >
              Privacy
            </Link>

            <Link
              to="/terms-and-conditions"
              className="amorah-focus transition-colors hover:text-amorah-white"
            >
              Terms
            </Link>

            <span className="hidden h-3 w-px bg-amorah-white/30 sm:block" />

            <span>Secure payments powered by Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
