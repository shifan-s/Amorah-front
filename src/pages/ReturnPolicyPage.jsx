import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';

const sections = [
  {
    title: 'Return window',
    copy: 'Return windows and eligibility are governed by the published Amorah policy for the product and order status.',
  },
  {
    title: 'Condition of returned items',
    copy: 'Items should be unused, unwashed, free from fragrance or stains and returned with original tags and packaging. Final quality-check standards must be documented by the operations team.',
  },
  {
    title: 'Non-returnable items',
    copy: 'Final sale products, altered garments, intimate items or visibly used pieces may be excluded from returns after business review.',
  },
  {
    title: 'Refunds',
    copy: 'Refunds should be initiated only after the returned item passes quality inspection. Payment gateway timelines must be finalised with the backend flow.',
  },
  {
    title: 'Exchanges',
    copy: 'Size or colour exchanges may be supported depending on stock availability. The final exchange workflow must be reviewed with inventory and order management requirements.',
  },
  {
    title: 'Damaged or incorrect products',
    copy: 'Customers should contact support with order details and clear photos if an item arrives damaged or incorrect. Resolution rules must be approved before launch.',
  },
];

function ReturnPolicyPage() {
  return (
    <>
      <Seo
        title="Return Policy | Amorah by N-ZAN Designs"
        description="Read Amorah return, refund and exchange guidance for customer orders."
        path="/return-policy"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Return Policy', path: '/return-policy' },
        ]}
      />

      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container size="md">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-error">
              Returns and exchanges
            </p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              Return Policy
            </h1>
            <p className="mt-5 text-base leading-8 text-amorah-brown">
              Review Amorah return and refund guidance before placing an order. Refunds are handled through the secure
              backend payment flow.
            </p>
          </section>

          <section className="mt-8 grid gap-4">
            {sections.map((section) => (
              <article key={section.title} className="border border-amorah-border bg-amorah-white p-5 sm:p-6">
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

export default ReturnPolicyPage;
