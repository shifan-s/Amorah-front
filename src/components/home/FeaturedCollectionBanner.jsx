import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Container from '../common/Container.jsx';

function FeaturedCollectionBanner({ image }) {
  return (
    <section className="relative overflow-hidden bg-amorah-black py-20 text-amorah-white sm:py-24 lg:py-28">
      <img src={image} alt="The Ethnic Edit campaign" className="absolute inset-0 h-full w-full object-cover opacity-70" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-amorah-black/85 via-amorah-black/45 to-amorah-black/15" />
      <Container className="relative">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-beige">The Ethnic Edit</p>
          <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-amorah-white sm:text-5xl lg:text-6xl">
            Tradition, Reimagined for Today
            </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-amorah-white/88">
            Graceful prints, modern silhouettes and timeless details designed for celebrations and everyday moments alike.
          </p>
          <Link
            to="/shop?style=ethnic"
            className="amorah-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-white bg-amorah-white px-6 text-sm font-semibold tracking-[0.08em] text-amorah-maroon transition hover:bg-amorah-beige"
          >
            Explore Ethnic Wear
          </Link>
        </div>
      </Container>
    </section>
  );
}

FeaturedCollectionBanner.propTypes = {
  image: PropTypes.string.isRequired,
};

export default FeaturedCollectionBanner;
