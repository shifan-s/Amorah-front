import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

const sections = [
  {
    title: 'Shipping coverage',
    copy: 'Amorah plans to ship across serviceable PIN codes in India. Final coverage will depend on courier partners, warehouse readiness and backend fulfilment rules.',
  },
  {
    title: 'Processing timelines',
    copy: 'Orders are expected to be packed within 1 to 3 business days after online payment confirmation. Custom, limited or high-demand pieces may need more time.',
  },
  {
    title: 'Delivery timelines',
    copy: 'Standard delivery is expected to take 4 to 6 business days after dispatch. Metro cities may receive orders sooner, while remote locations may require additional time.',
  },
  {
    title: 'Shipping charges',
    copy: 'Shipping charges, if applicable, are calculated during checkout using backend-approved order totals.',
  },
  {
    title: 'Order tracking',
    copy: 'Tracking details will be shared after dispatch once backend order fulfilment and courier integrations are connected.',
  },
  {
    title: 'Delivery attempts',
    copy: 'Courier partners may attempt delivery more than once. Customers should keep their phone reachable and provide a complete address with PIN code.',
  },
];

function ShippingPolicyPage() {
  return (
    <>
      <Seo
        title="Shipping Policy | Amorah N-ZAN Designs"
        description="Review Amorah shipping coverage, processing, delivery timelines and checkout-calculated charges."
        path="/shipping-policy"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Shipping Policy', path: '/shipping-policy' },
        ]}
      />

      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container size="md">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-error">
              Shipping information
            </p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              Shipping Policy
            </h1>
            <p className="mt-5 text-base leading-8 text-amorah-brown">
              Review current shipping guidance for Amorah orders. Final delivery charges are confirmed during checkout
              before Razorpay payment.
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

export default ShippingPolicyPage;
