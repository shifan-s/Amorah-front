import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
    title: 'Customer Service',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Shipping Policy', to: '/shipping-policy' },
      { label: 'Returns and Exchanges', to: '/return-policy' },
      { label: 'Size Guide', to: '/size-guide' },
    ],
  },
  {
    title: 'About Amorah',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms', to: '/terms-and-conditions' },
      { label: 'Account', to: '/account' },
    ],
  },
];

function Footer() {
  const navigationCategories = useSelector(selectNavigationCategories);
  const shopLinks = navigationCategories.length
    ? [
        { label: 'All Styles', to: '/shop' },
        { label: 'New Arrivals', to: '/shop?sort=newest' },
        ...navigationCategories.slice(0, 5).map((category) => ({ label: category.name, to: `/shop/${category.slug}` })),
      ]
    : footerSections[0].links;
  const sections = [{ ...footerSections[0], links: shopLinks }, ...footerSections.slice(1)];

  return (
    <footer className="border-t border-amorah-border bg-amorah-white text-amorah-black">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_2fr] lg:px-10 lg:py-16 xl:px-14">
        <div>
          <BrandLogo size="md" className="justify-start" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-amorah-brown">
            Premium women's fashion by N-ZAN Designs, curated across ethnic wear, western styles and elegant hijabs.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-2xl font-semibold text-amorah-maroon">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link className="amorah-focus text-sm font-medium text-amorah-brown hover:text-amorah-maroon" to={link.to}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-amorah-border px-4 py-5 sm:px-6 lg:px-10 xl:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 text-xs text-amorah-brown sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Amorah by N-ZAN Designs. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link className="amorah-focus hover:text-amorah-maroon" to="/privacy-policy">
              Privacy
            </Link>
            <Link className="amorah-focus hover:text-amorah-maroon" to="/terms-and-conditions">
              Terms
            </Link>
            <span>Secure online payment with Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
