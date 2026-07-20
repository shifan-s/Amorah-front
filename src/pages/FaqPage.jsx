import { useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Accordion from '../components/common/Accordion.jsx';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';

const faqs = [
  {
    topic: 'Orders',
    title: 'How do I know my order has been placed?',
    content: 'After checkout, you will see an order confirmation screen with your Amorah order number. A backend email confirmation will be added before launch.',
  },
  {
    topic: 'Orders',
    title: 'Can I edit my order after placing it?',
    content: 'For now, please contact the Amorah team as soon as possible. Once fulfilment begins, size, colour or address changes may not be possible.',
  },
  {
    topic: 'Payments',
    title: 'Which payment methods will Amorah support?',
    content: 'Amorah supports secure Razorpay online payments including UPI, credit card, debit card, net banking and supported wallets.',
  },
  {
    topic: 'Payments',
    title: 'Is my Razorpay payment information stored by Amorah?',
    content: 'No. Payment credentials should be handled securely by Razorpay and the backend payment flow. Secret keys must never be placed in frontend code.',
  },
  {
    topic: 'Shipping',
    title: 'How long does delivery take?',
    content: 'Standard delivery is expected to take 4 to 6 business days after dispatch. Remote locations may need additional time.',
  },
  {
    topic: 'Shipping',
    title: 'Is free shipping available?',
    content: 'Any shipping offer or charge will be shown during checkout after Amorah recalculates the order totals.',
  },
  {
    topic: 'Returns',
    title: 'Can I return an item?',
    content: 'Return eligibility depends on the published return policy, garment condition, tags and order status.',
  },
  {
    topic: 'Sizes',
    title: 'How do I choose the right size?',
    content: 'Use the Size Guide and compare your bust, waist and hip measurements with the recommended size table. If between sizes, choose based on your preferred fit.',
  },
  {
    topic: 'Product care',
    title: 'How should I wash Amorah garments?',
    content: 'Most pieces should be gently hand washed separately in cold water, dried in shade and ironed on low heat. Always check the care note on the product page.',
  },
  {
    topic: 'Accounts',
    title: 'Do I need an account to shop?',
    content: 'Checkout uses a customer account so saved addresses, orders and payment verification stay connected to you.',
  },
];

const topics = ['Orders', 'Payments', 'Shipping', 'Returns', 'Sizes', 'Product care', 'Accounts'];

function FaqPage() {
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('Orders');

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesTopic = activeTopic === 'All' || faq.topic === activeTopic;
      const matchesQuery =
        normalizedQuery === '' ||
        [faq.topic, faq.title, faq.content].join(' ').toLowerCase().includes(normalizedQuery);

      return matchesTopic && matchesQuery;
    });
  }, [activeTopic, query]);

  const accordionItems = filteredFaqs.map((faq) => ({
    title: `${faq.topic}: ${faq.title}`,
    content: <p>{faq.content}</p>,
  }));

  return (
    <>
      <Seo
        title="FAQ | Amorah by N-ZAN Designs"
        description="Find answers to common Amorah questions about orders, payments, shipping, returns, sizes, care and accounts."
        path="/faq"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
      />

      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container size="md">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Help centre</p>
            <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-amorah-brown">
              Find quick answers about orders, payments, shipping, returns, sizes, product care and customer accounts.
            </p>
          </section>

          <section className="mt-8 border border-amorah-border bg-amorah-white p-4 sm:p-5">
            <label className="block">
              <span className="text-sm font-semibold text-amorah-black">Search questions</span>
              <span className="mt-2 flex items-center gap-3 border border-amorah-border bg-amorah-white px-4 focus-within:border-amorah-black focus-within:ring-2 focus-within:ring-amorah-rose/40">
                <FiSearch className="shrink-0 text-amorah-brown" aria-hidden="true" />
                <input
                  className="border-0 px-0 shadow-none focus-visible:shadow-none"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search orders, returns, care..."
                />
              </span>
            </label>
          </section>

          <div className="mt-6 flex flex-wrap gap-2">
            {['All', ...topics].map((topic) => (
              <button
                key={topic}
                type="button"
                className={`amorah-focus border px-4 py-2 text-sm font-semibold transition ${
                  activeTopic === topic
                    ? 'border-amorah-black bg-amorah-black text-amorah-white'
                    : 'border-amorah-border bg-amorah-white text-amorah-brown hover:border-amorah-black hover:text-amorah-black'
                }`}
                onClick={() => setActiveTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>

          <section className="mt-6">
            {accordionItems.length > 0 ? (
              <Accordion items={accordionItems} defaultOpenIndex={0} />
            ) : (
              <EmptyState
                title="No questions found"
                description="Try a different search term or choose another FAQ topic."
                actionLabel="Clear Search"
                onAction={() => {
                  setQuery('');
                  setActiveTopic('All');
                }}
              />
            )}
          </section>
        </Container>
      </main>
    </>
  );
}

export default FaqPage;
