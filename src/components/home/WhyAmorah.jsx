import { FiCreditCard, FiScissors, FiSun, FiWind } from 'react-icons/fi';
import Container from '../common/Container.jsx';

const features = [
  { title: 'Breathable Cotton Fabrics', icon: <FiWind aria-hidden="true" /> },
  { title: 'Thoughtful Fits', icon: <FiScissors aria-hidden="true" /> },
  { title: 'Small-Batch Collections', icon: <FiSun aria-hidden="true" /> },
  { title: 'Secure Razorpay Payments', icon: <FiCreditCard aria-hidden="true" /> },
];

function WhyAmorah() {
  return (
    <section className="bg-amorah-white py-14 sm:py-16">
      <Container>
        <div className="grid gap-0 border-y border-amorah-border md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="border-amorah-border py-6 md:border-r md:px-6 md:last:border-r-0">
              <span className="text-2xl text-amorah-sage">{feature.icon}</span>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-amorah-maroon">{feature.title}</h2>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default WhyAmorah;
