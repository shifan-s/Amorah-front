import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

const sections = [
  {
    title: 'Information we may collect',
    copy: 'Amorah may collect customer name, email, mobile number, shipping address, billing details, order history, wishlist activity and support messages after backend services are connected.',
  },
  {
    title: 'How information may be used',
    copy: 'Customer information may be used to process orders, provide customer support, manage accounts, personalise the storefront and improve product and service quality.',
  },
  {
    title: 'Payments',
    copy: 'Payment details should be handled by Razorpay and secure backend services. Amorah frontend code must never store Razorpay secret keys or sensitive payment credentials.',
  },
  {
    title: 'Cookies and analytics',
    copy: 'The final storefront may use cookies or analytics tools to understand site performance and customer journeys. Consent and disclosure requirements must be reviewed before launch.',
  },
  {
    title: 'Data sharing',
    copy: 'Customer information may be shared with courier partners, payment processors and service providers only where required to fulfil orders or provide support.',
  },
  {
    title: 'Customer rights',
    copy: 'Customers may be able to request access, correction or deletion of personal data depending on applicable law and final backend capabilities.',
  },
];

function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy | Amorah N-ZAN Designs"
        description="Read Amorah privacy policy content covering data collection, payments, cookies and customer rights."
        path="/privacy-policy"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy-policy' },
        ]}
      />

      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container size="md">
          <section className="border border-amorah-border bg-amorah-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-error">
              Privacy and data
            </p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-5 text-base leading-8 text-amorah-brown">
              Learn how Amorah handles customer information for accounts, orders, payments and support.
            </p>
          </section>

          <section className="mt-8 divide-y divide-amorah-border border border-amorah-border bg-amorah-white">
            {sections.map((section) => (
              <article key={section.title} className="p-5 sm:p-6">
                <h2 className="font-heading text-2xl font-semibold text-amorah-black">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-amorah-brown">{section.copy}</p>
              </article>
            ))}
          </section>
        </Container>
      </main>
    </>
  );
}

export default PrivacyPolicyPage;
