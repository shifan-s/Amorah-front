import { Link } from 'react-router-dom';
import Container from '../common/Container.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { imageAssets } from '../../data/imageAssets.js';

const occasions = [
  { title: 'Everyday Comfort', copy: 'Soft cotton shapes for unhurried routines.', to: '/shop?occasion=everyday', image: imageAssets.occasions.everyday },
  { title: 'Workwear', copy: 'Polished co-ords and kurtas that stay easy.', to: '/shop?occasion=workwear', image: imageAssets.occasions.workwear },
  { title: 'Festive Gatherings', copy: 'Ethnic details for celebrations with warmth.', to: '/shop?occasion=festive', image: imageAssets.occasions.festive },
  { title: 'Weekend Ease', copy: 'Relaxed pieces for travel, brunch and pause.', to: '/shop?occasion=casual', image: imageAssets.occasions.weekend },
];

function OccasionGrid() {
  return (
    <section className="bg-amorah-ivory py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Shop by occasion"
          title="Dressing for Real Moments"
          description="Choose by the way your day feels: easy, polished, celebratory or slow."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {occasions.map((occasion) => (
            <Link key={occasion.title} to={occasion.to} className="amorah-focus group block bg-amorah-white">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={occasion.image.src}
                  alt={occasion.image.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-2xl font-semibold text-amorah-maroon">{occasion.title}</h3>
                <p className="mt-2 text-sm leading-6 text-amorah-brown">{occasion.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default OccasionGrid;
