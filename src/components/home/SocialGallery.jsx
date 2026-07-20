import Container from '../common/Container.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { imageAssets } from '../../data/imageAssets.js';

function SocialGallery() {
  return (
    <section className="bg-amorah-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Style journal"
            title="Wear Amorah Your Way"
            description="An Instagram-style glimpse of cotton textures, ethnic details and soft everyday styling."
          />
          <a
            href="https://www.instagram.com/"
            className="amorah-focus text-sm font-semibold uppercase tracking-[0.14em] text-amorah-terracotta hover:text-amorah-maroon"
            rel="noreferrer"
          >
            Follow @amorah
          </a>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {imageAssets.socialGallery.map((image) => (
            <a key={image.src} href="https://www.instagram.com/" className="amorah-focus group block overflow-hidden bg-amorah-light" rel="noreferrer">
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default SocialGallery;
