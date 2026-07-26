import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Container from '../common/Container.jsx';
import promotionCardImage from '../../assets/images/grand-opening-banner.png';

const TOTAL_SLIDES = 2;

function TicketCutouts() {
  return (
    <>
      {/* Left cutouts */}
      <span
        aria-hidden="true"
        className="absolute -left-3 top-5 h-7 w-7 rounded-full bg-amorah-white"
      />

      <span
        aria-hidden="true"
        className="absolute -left-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-amorah-white"
      />

      <span
        aria-hidden="true"
        className="absolute -left-3 bottom-5 h-7 w-7 rounded-full bg-amorah-white"
      />

      {/* Right cutouts */}
      <span
        aria-hidden="true"
        className="absolute -right-3 top-5 h-7 w-7 rounded-full bg-amorah-white"
      />

      <span
        aria-hidden="true"
        className="absolute -right-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-amorah-white"
      />

      <span
        aria-hidden="true"
        className="absolute -right-3 bottom-5 h-7 w-7 rounded-full bg-amorah-white"
      />
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M7 4L13 10L7 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomePromotionStrip() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => {
        return (currentSlide + 1) % TOTAL_SLIDES;
      });
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const showSlide = (slideNumber) => {
    setActiveSlide(slideNumber);
  };

  const getSlideClasses = (slideNumber) => {
    if (activeSlide === slideNumber) {
      return 'translate-x-0 opacity-100';
    }

    if (slideNumber < activeSlide) {
      return 'pointer-events-none -translate-x-full opacity-0';
    }

    return 'pointer-events-none translate-x-full opacity-0';
  };

  return (
    <section
      className="bg-amorah-white py-7 sm:py-9 lg:py-12"
      aria-label="Amorah special offers"
    >
      <Container>
        <div className="relative grid min-h-[520px] w-full overflow-hidden rounded-[1.75rem] sm:min-h-[340px] sm:rounded-[2rem] md:min-h-[290px] lg:aspect-[15/2] lg:min-h-[185px]">
          {/* ==================================================
              SLIDE 1
          ================================================== */}
          <div
            aria-hidden={activeSlide !== 0}
            className={`col-start-1 row-start-1 h-full w-full transition-all duration-700 ease-in-out motion-reduce:transition-none ${getSlideClasses(
              0
            )}`}
          >
            <Link
              to="/shop"
              tabIndex={activeSlide === 0 ? 0 : -1}
              className="amorah-focus group relative block h-full w-full overflow-hidden rounded-[1.75rem] bg-[#fff4e5] sm:rounded-[2rem]"
            >
              {/* Mobile and tablet version */}
              <span className="grid h-full grid-rows-[315px_205px] bg-[#fff4e5] sm:grid-cols-[1.08fr_0.92fr] sm:grid-rows-1 lg:hidden">
                {/* Promotion content */}
                <span className="relative z-20 flex flex-col items-center justify-center px-5 py-6 text-center sm:items-start sm:px-8 sm:py-8 sm:text-left md:px-10">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amorah-brown sm:text-xs">
                    Amorah Opening Special
                  </span>

                  <span className="mt-3 font-promo text-4xl uppercase leading-[0.9] text-amorah-black sm:text-5xl md:text-6xl">
                    Grand
                    <br />
                    Opening
                  </span>

                  <span className="mt-4 flex items-end justify-center gap-2 sm:justify-start">
                    <span className="font-promo text-5xl leading-none text-amorah-black sm:text-6xl md:text-7xl">
                      ₹49
                    </span>

                    <span className="pb-1 text-base font-bold uppercase text-amorah-black sm:text-lg">
                      Only
                    </span>
                  </span>

                  <span className="mt-3 text-xs font-medium text-amorah-brown sm:text-sm md:text-base">
                    Limited Stock. Limited Time.
                  </span>

                  <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-amorah-black px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-amorah-black transition-colors duration-300 group-hover:bg-amorah-black group-hover:text-white sm:text-sm">
                    Shop Now
                    <ArrowIcon />
                  </span>
                </span>

                {/* Mobile and tablet model image */}
                <span className="relative min-h-[205px] overflow-hidden bg-[#f5b51b] sm:min-h-full">
                  <img
                    src={promotionCardImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full origin-right scale-[1.42] object-cover object-right transition-transform duration-700 group-hover:scale-[1.47] sm:scale-[1.2] sm:object-[92%_center] sm:group-hover:scale-[1.25] md:scale-[1.12] md:group-hover:scale-[1.16]"
                  />

                  {/* Covers the old button visible inside the banner image */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 z-10 w-[34%] bg-gradient-to-r from-[#f5b51b] via-[#f5b51b]/95 to-transparent sm:w-20 sm:from-[#fff4e5] sm:via-[#fff4e5]/90"
                  />

                  {/* Smooth top transition on mobile */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-[#fff4e5] via-[#ffc21c]/50 to-transparent sm:hidden"
                  />

                  {/* Subtle image overlay */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.03]"
                  />
                </span>
              </span>

              {/* Desktop version */}
              <span className="absolute inset-0 hidden lg:block">
                <img
                  src={promotionCardImage}
                  alt="Amorah grand opening offer — shop selected items at ₹49"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />

                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5"
                />
              </span>
            </Link>
          </div>

          {/* ==================================================
              SLIDE 2
          ================================================== */}
          <div
            aria-hidden={activeSlide !== 1}
            className={`col-start-1 row-start-1 h-full w-full transition-all duration-700 ease-in-out motion-reduce:transition-none ${getSlideClasses(
              1
            )}`}
          >
            <Link
              to="/shop?sort=newest"
              tabIndex={activeSlide === 1 ? 0 : -1}
              className="amorah-focus group relative grid h-full w-full content-center gap-6 overflow-hidden rounded-[1.75rem] bg-[#f8e7d1] px-6 py-8 pb-16 sm:rounded-[2rem] sm:px-10 md:grid-cols-[0.9fr_1.25fr] md:items-center md:gap-8 md:px-12 md:py-8 lg:grid-cols-[0.9fr_1.25fr_0.28fr] lg:gap-10 lg:px-14 lg:py-7"
            >
              <TicketCutouts />

              {/* Left content */}
              <span className="relative z-10 text-center md:text-left">
                <span className="block font-promo text-4xl uppercase leading-none tracking-[0.01em] text-amorah-terracotta sm:text-5xl md:text-4xl lg:text-5xl">
                  Amorah
                </span>

                <span className="mt-3 block text-xl font-medium text-amorah-black sm:text-2xl md:text-xl lg:text-2xl">
                  Opening Special Sale
                </span>
              </span>

              {/* Centre content */}
              <span className="relative z-10">
                <span className="flex min-h-24 flex-col items-center justify-center rounded-2xl bg-amorah-white px-5 py-4 text-center sm:px-6 md:min-h-20 md:flex-row">
                  <span className="mb-3 text-center text-xs font-semibold uppercase leading-tight tracking-[0.08em] text-amorah-brown sm:text-sm md:mb-0 md:mr-4 md:text-left">
                    We Welcome You
                    <br />
                    To Our Store
                  </span>

                  <span className="font-promo text-3xl uppercase tracking-[0.04em] text-amorah-black sm:text-4xl md:text-3xl lg:text-4xl">
                    Shop at ₹49
                  </span>
                </span>

                <span className="mt-3 block text-center text-sm text-amorah-brown sm:text-base">
                  Limited-Time Offer
                </span>
              </span>

              {/* Desktop right content */}
              <span
                aria-hidden="true"
                className="relative z-10 hidden font-promo text-8xl leading-none text-amorah-clay lg:block lg:justify-self-end"
              >
                Offer
              </span>
            </Link>
          </div>

          {/* ==================================================
              SLIDER DOTS
          ================================================== */}
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/85 px-3 py-2 shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={() => showSlide(0)}
              aria-label="Show Amorah grand opening image"
              aria-current={activeSlide === 0 ? 'true' : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === 0
                  ? 'w-7 bg-amorah-black'
                  : 'w-2 bg-amorah-black/35 hover:bg-amorah-black/60'
              }`}
            />

            <button
              type="button"
              onClick={() => showSlide(1)}
              aria-label="Show Amorah opening offer"
              aria-current={activeSlide === 1 ? 'true' : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === 1
                  ? 'w-7 bg-amorah-black'
                  : 'w-2 bg-amorah-black/35 hover:bg-amorah-black/60'
              }`}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HomePromotionStrip;