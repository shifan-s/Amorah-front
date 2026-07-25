import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Container from '../common/Container.jsx';

function BrandStoryPreview({ image }) {
  return (
    <section className="bg-amorah-beige py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="aspect-[4/5] bg-amorah-light">
            <img src={image} alt="Amorah design details and feminine styling" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="lg:pl-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-terracotta">Our story</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-amorah-maroon sm:text-5xl">
              Clothing That Feels Like You
            </h2>
            <p className="mt-5 text-base leading-8 text-amorah-brown">
              Amorah creates feminine cotton and ethnic wear that balances tradition, comfort and
              contemporary style. Each collection is designed to feel personal, wearable and beautifully considered.
            </p>
            <Link
              to="/about"
              className="amorah-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-maroon transition hover:bg-amorah-maroon hover:text-amorah-white"
            >
              Discover Amorah
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

BrandStoryPreview.propTypes = {
  image: PropTypes.string.isRequired,
};

export default BrandStoryPreview;
