import { FiFeather, FiSun, FiWind } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Container from '../common/Container.jsx';
import { imageAssets } from '../../data/imageAssets.js';

const points = [
  { label: 'Breathable fabrics', icon: <FiWind aria-hidden="true" /> },
  { label: 'Comfortable silhouettes', icon: <FiFeather aria-hidden="true" /> },
  { label: 'Everyday elegance', icon: <FiSun aria-hidden="true" /> },
];

function CottonStorySection() {
  return (
    <section className="bg-amorah-light py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="overflow-hidden">
            <img
              src={imageAssets.editorial.cottonStory.src}
              alt={imageAssets.editorial.cottonStory.alt}
              className="aspect-[4/5] w-full object-cover lg:aspect-[5/4]"
              loading="lazy"
            />
          </div>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-terracotta">The Cotton Edit</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-amorah-maroon sm:text-5xl">
              Light on the Skin.
              <span className="block">Beautiful in Every Detail.</span>
            </h2>
            <p className="mt-5 text-base leading-8 text-amorah-brown">
              Explore breathable silhouettes, gentle textures and thoughtful designs created for warm days, relaxed
              moments and effortless everyday dressing.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {points.map((point) => (
                <div key={point.label} className="border-l border-amorah-border pl-4">
                  <span className="text-xl text-amorah-sage">{point.icon}</span>
                  <p className="mt-2 text-sm font-semibold text-amorah-black">{point.label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/shop?fabric=cotton"
              className="amorah-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-maroon bg-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-white transition hover:bg-amorah-black"
            >
              Explore Cotton Wear
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CottonStorySection;
