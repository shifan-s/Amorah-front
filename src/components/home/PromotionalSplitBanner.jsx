import { Link } from 'react-router-dom';
import Container from '../common/Container.jsx';
import { imageAssets } from '../../data/imageAssets.js';

function PromotionalSplitBanner() {
  return (
    <section className="bg-amorah-light py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-terracotta">
              Designed with Intention
            </p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-amorah-maroon sm:text-5xl">
              Crafted for Comfort.
              <span className="block">Finished with Character.</span>
            </h2>
            <p className="mt-5 text-base leading-8 text-amorah-brown">
              At Amorah, we believe clothing should feel as beautiful as it looks. Our collections focus on breathable
              fabrics, graceful fits and thoughtful details that move naturally with you.
            </p>
            <Link
              to="/about"
              className="amorah-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-maroon transition hover:bg-amorah-maroon hover:text-amorah-white"
            >
              Our Story
            </Link>
          </div>
          <img
            src={imageAssets.editorial.craftsmanship.src}
            alt={imageAssets.editorial.craftsmanship.alt}
            className="aspect-[4/5] w-full object-cover lg:aspect-[5/4]"
            loading="lazy"
          />
        </div>
      </Container>
    </section>
  );
}

export default PromotionalSplitBanner;
