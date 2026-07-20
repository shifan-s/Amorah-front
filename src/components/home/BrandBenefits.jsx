import { FiCreditCard, FiHeadphones, FiPackage, FiShoppingBag } from 'react-icons/fi';
import Container from '../common/Container.jsx';

const benefits = [
  { title: 'Secure Razorpay Payments', icon: <FiCreditCard aria-hidden="true" /> },
  { title: 'Curated Fashion Collections', icon: <FiShoppingBag aria-hidden="true" /> },
  { title: 'Order Tracking', icon: <FiPackage aria-hidden="true" /> },
  { title: 'Customer Support', icon: <FiHeadphones aria-hidden="true" /> },
];

function BrandBenefits() {
  return (
    <section className="bg-amorah-white py-12 sm:py-14">
      <Container>
        <div className="grid border-y border-amorah-border sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-4 border-amorah-border py-5 sm:px-5 lg:border-r lg:last:border-r-0">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-amorah-border text-lg text-amorah-maroon">
                {benefit.icon}
              </span>
              <h2 className="text-sm font-semibold text-amorah-black">{benefit.title}</h2>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default BrandBenefits;
