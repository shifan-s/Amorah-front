import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const primaryLinkClasses =
  'amorah-focus inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-maroon bg-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-white transition hover:border-amorah-black hover:bg-amorah-black';
const secondaryLinkClasses =
  'amorah-focus inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-white px-6 text-sm font-semibold tracking-[0.08em] text-amorah-white transition hover:bg-amorah-white hover:text-amorah-maroon';

function HeroBanner({ image, alt }) {
  return (
    <section className="relative h-[calc(100svh-4rem)] min-h-[34rem] overflow-hidden bg-amorah-black text-amorah-white sm:h-[calc(100svh-4.5rem)] sm:min-h-[40rem] lg:h-[calc(100vh-5.25rem)] lg:min-h-[44rem]">
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-amorah-black/78 via-amorah-black/44 to-amorah-black/12" />
      <div className="relative mx-auto flex h-full max-w-[1500px] items-end px-4 py-12 sm:px-6 sm:py-16 lg:px-10 xl:px-14">
        <div className="max-w-2xl pb-4 sm:pb-8 lg:pb-12">

          <h1 className="mt-5 font-heading text-5xl font-semibold leading-[0.96] text-amorah-white sm:text-6xl lg:text-7xl">
            AMORAH
          </h1>
          <p className="mt-6 max-w-xl text-2xl leading-7 text-amorah-white/90">
         Where Style Becomes Your Identity.
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-amorah-white/85">
            Inspired by Kerala’s timeless artistry, our collections unite heritage techniques with refined, modern silhouettes.
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-amorah-white/85">
            Made in India from carefully selected fabrics, every design is created to feel effortless, express confidence, and leave a lasting impression.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop" className={`${primaryLinkClasses} w-full sm:w-auto`}>
              Explore Collection
            </Link>
            <Link to="/contact" className={`${secondaryLinkClasses} w-full sm:w-auto`}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

HeroBanner.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default HeroBanner;
