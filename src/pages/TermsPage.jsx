import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

const terms = [
  {
    title: 'Use of the website',
    copy: 'Customers should use the Amorah storefront for lawful shopping, account and support purposes only. Final acceptable-use wording must be reviewed before launch.',
  },
  {
    title: 'Product information',
    copy: 'Amorah aims to present accurate product names, prices, colours, sizes and availability. Minor differences in screen colour, fabric texture and fit may occur.',
  },
  {
    title: 'Pricing and availability',
    copy: 'Prices are displayed in Indian Rupees. Amorah may update pricing, promotions and product availability before an order is confirmed.',
  },
  {
    title: 'Orders and cancellations',
    copy: 'Order acceptance, cancellation windows and stock exceptions must be finalised with backend order management and customer-service processes.',
  },
  {
    title: 'Payments',
    copy: 'Razorpay online payment is the checkout payment method. Payment verification must happen through secure backend services before fulfilment.',
  },
  {
    title: 'Intellectual property',
    copy: 'Brand assets, product photography, copy, designs and storefront content belong to Amorah by N-ZAN Designs or their respective rights holders.',
  },
  {
    title: 'Limitation of liability',
    copy: 'Final limitation, warranty and dispute-resolution wording must be drafted or approved by a qualified legal advisor before launch.',
  },
];

function TermsPage() {
  return (
    <>
      <Seo
        title="Terms and Conditions | Amorah by N-ZAN Designs"
        description="Review Amorah terms and conditions for website use, products, orders, payments and intellectual property."
        path="/terms-and-conditions"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Terms and Conditions', path: '/terms-and-conditions' },
        ]}
      />

      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container size="md">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-error">
              Customer terms
            </p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              Terms and Conditions
            </h1>
            <p className="mt-5 text-base leading-8 text-amorah-brown">
              Review Amorah website, product, order and payment terms before shopping.
            </p>
          </section>

          <section className="mt-8 grid gap-4">
            {terms.map((term) => (
              <article key={term.title} className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
                <h2 className="font-heading text-2xl font-semibold text-amorah-black">{term.title}</h2>
                <p className="mt-3 text-sm leading-7 text-amorah-brown">{term.copy}</p>
              </article>
            ))}
          </section>
        </Container>
      </main>
    </>
  );
}

export default TermsPage;
