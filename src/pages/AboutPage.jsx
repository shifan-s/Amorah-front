import { Link } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import Seo from '../components/common/Seo.jsx';
import aboutHeroImage from '../assets/images/Abo.jpeg';
import brandIconImage from '../assets/images/amorah-icon.png';
import collectionsVideo from '../assets/images/collectn.mp4';
import finaleImage from '../assets/images/fade.jpg';
import ourStoryImage from '../assets/images/ourstr.png';
import philosophyImage from '../assets/images/Philoo.png';

const storySections = [
  {
    title: 'Our Story',
    copy: [
      'What began as a simple vision to create clothing that transcends seasons grew into a label grounded in craftsmanship and purpose. We design garments that respect tradition while meeting the needs of today\u2019s life: clean silhouettes, subtle details, and fabrics chosen for comfort and longevity.',
      'We believe your wardrobe should serve you, not complicate your day. Our collections are intentionally designed as a cohesive foundation\u2014versatile pieces that transition effortlessly from morning commitments to evening quiet. It is about empowering you to feel confident, unrestricted, and entirely yourself in every moment.',
    ],
  },
  {
    title: 'Our Philosophy',
    copy: [
      'We value quiet luxury and thoughtful design. Rather than chasing trends, we prioritize versatility, fit, and lasting quality so each piece complements personal style and becomes a reliable wardrobe signature.',
      'We design not to overshadow the wearer, but to amplify them. A truly great garment should feel like a second skin\u2014empowering you with quiet confidence rather than demanding attention. By focusing on nuanced details and uncompromising comfort, our pieces are designed to adapt to the rhythm of your life, ensuring you always feel grounded, refined, and undeniably yourself.',
    ],
  },
  {
    title: 'Our Collections',
    copy: 'Curated for everyday life and special moments: elevated ethnicwear, contemporary western essentials, and modest styles. Key pieces include churidar sets, partywear, western co-ords, gowns, knee-length and short tops, shirts, premium denim, and a range of hijabs in jersey, shimmer, and georgette chiffon.',
  },
  {
    title: 'Craftsmanship',
    copy: 'We partner with skilled artisans in Kerala and across India, combining traditional techniques with precise tailoring. From pattern to finish, every stage is guided by care and attention to detail, ensuring garments feel as refined as they look.',
  },
  {
    title: 'Premium Materials',
    copy: 'We select fabrics for their drape, durability, and comfort: natural yarns, fine weaves, and carefully finished blends. Our material choices support longevity and a premium hand, so each garment improves with wear.',
  },
  {
    title: 'Our Promise',
    copy: 'We create clothing that inspires confidence and celebrates individuality. Committed to durability, authenticity, and considerate production, we make pieces meant to live in your wardrobe for years, not just a season.',
  },
];

const aboutImages = {
  hero: {
    src: aboutHeroImage,
    alt: 'Woman in refined Amorah styling wearing sunglasses and a white shirt',
    position: 'object-[center_18%]',
  },
  story: {
    src: ourStoryImage,
    alt: 'Tailored white suit campaign for Amorah N-ZAN Designs',
    position: 'object-[center_45%]',
  },
  brandIcon: {
    src: brandIconImage,
  },
  philosophy: {
    src: philosophyImage,
    alt: 'Refined Amorah clothing styled for everyday elegance',
    position: 'object-[center_35%]',
  },
  collections: {
    src: collectionsVideo,
    label: 'Amorah collection styling video',
    position: 'object-center',
  },
  finale: {
    src: finaleImage,
    alt: 'Amorah model in refined contemporary styling',
    position: 'object-[center_24%]',
  },
};

const valuesSections = storySections.slice(3);

function AboutPage() {
  const [ourStory, ourPhilosophy, ourCollections] = storySections;

  return (
    <>
      <Seo
        title="About Amorah | Amorah"
        description="Learn the story, philosophy, craftsmanship and quality promise behind Amorah ."
        path="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' },
        ]}
      />

      <main className="bg-amorah-ivory text-amorah-black">
        <section className="border-y border-amorah-border/80 bg-amorah-white">
          <Container className="grid min-h-[32rem] items-stretch gap-8 py-8 sm:py-12 lg:min-h-[40rem] lg:grid-cols-[0.82fr_1fr] lg:gap-14 lg:py-0">
            <div className="max-w-[42rem] pt-8 pb-4 sm:pt-10 lg:pt-24 lg:pb-16">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-maroon">
                Amorah 
              </p>
              <h1 className="mt-5 max-w-[16ch] font-heading text-[clamp(2.35rem,5vw,4.6rem)] font-semibold leading-[1.02] text-amorah-maroon sm:max-w-[17ch] lg:max-w-[16ch]">
                Designed for the Modern Woman.
                <span className="block">Inspired by Timeless Elegance.</span>
              </h1>
              <p className="mt-6 max-w-[39rem] text-base leading-8 text-amorah-brown sm:text-[1.05rem]">
                Rooted in Kerala craftsmanship, our collections blend local textile traditions with contemporary
                tailoring. Handcrafted in India from premium fabrics, every piece is made to be effortlessly worn and
                confidently remembered.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                <Link
                  to="/shop"
                  className="amorah-focus inline-flex min-h-12 items-center justify-center border border-amorah-maroon bg-amorah-maroon px-6 text-sm font-semibold uppercase tracking-[0.14em] text-amorah-white transition hover:border-amorah-black hover:bg-amorah-black sm:px-7"
                >
                  Explore Collection
                </Link>
                <Link
                  to="/contact"
                  className="amorah-focus inline-flex min-h-12 items-center justify-center border border-amorah-maroon px-6 text-sm font-semibold uppercase tracking-[0.14em] text-amorah-maroon transition hover:bg-amorah-maroon hover:text-amorah-white sm:px-7"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="h-full min-h-[28rem] overflow-hidden border-l border-amorah-border/80 lg:h-[50rem] lg:min-h-0">
              <img
                src={aboutImages.hero.src}
                alt={aboutImages.hero.alt}
                className={`h-full min-h-[28rem] w-full object-cover ${aboutImages.hero.position}`}
              />
            </div>
          </Container>
        </section>

        <Container>
          <section className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.92fr_1fr] lg:items-center lg:gap-16 xl:py-24">
            <figure className="overflow-hidden">
              <img
                src={aboutImages.story.src}
                alt={aboutImages.story.alt}
                loading="lazy"
                className={`aspect-[4/5] w-full object-cover ${aboutImages.story.position}`}
              />
            </figure>
            <div className="max-w-[40rem] lg:ml-auto">
              <span
                className="text-sm font-semibold uppercase tracking-[0.24em] text-amorah-terracotta"
                aria-hidden="true"
              >
                01
              </span>
              <h2
                className="mt-5 font-heading text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-none text-amorah-black"
                aria-label={ourStory.title}
              >
                <img
                  src={aboutImages.brandIcon.src}
                  alt=""
                  aria-hidden="true"
                  className="mr-[0.045em] inline-block h-[0.78em] w-auto max-w-none translate-y-[0.035em] object-contain"
                />
                <span aria-hidden="true">ur Story</span>
              </h2>
              <div className="mt-6 h-px w-20 bg-amorah-maroon/70" aria-hidden="true" />
              <div className="mt-6 space-y-5 text-base leading-8 text-amorah-brown sm:text-[1.05rem]">
                {ourStory.copy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <Link
                to="/shop"
                className="amorah-focus mt-8 inline-flex min-h-12 items-center justify-center border border-amorah-maroon bg-amorah-maroon px-7 text-sm font-semibold uppercase tracking-[0.14em] text-amorah-white transition hover:border-amorah-black hover:bg-amorah-black"
              >
                Shop Now
              </Link>
            </div>
          </section>
        </Container>

        <section className="border-y border-amorah-border/80 bg-amorah-light/70">
          <Container className="py-16 sm:py-20 xl:py-24">
            <div className="grid gap-8 lg:grid-cols-[0.34fr_1fr] lg:items-start">
              <div>
                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-amorah-terracotta">
                  <span aria-hidden="true">02</span>
                  <span className="hidden h-px flex-1 bg-amorah-border sm:block" aria-hidden="true" />
                </div>
                <figure className="mt-8 overflow-hidden">
                  <img
                    src={aboutImages.philosophy.src}
                    alt={aboutImages.philosophy.alt}
                    loading="lazy"
                    className={`aspect-[4/5] w-full object-cover ${aboutImages.philosophy.position}`}
                  />
                </figure>
              </div>
              <article className="border-l border-amorah-maroon/35 pl-6 sm:pl-10 lg:pl-14">
                <h2 className="max-w-[14ch] font-heading text-[clamp(2.5rem,6vw,5.25rem)] font-semibold leading-none text-amorah-maroon">
                  {ourPhilosophy.title}
                </h2>
                <div className="mt-7 max-w-[48rem] space-y-5 text-lg leading-9 text-amorah-brown">
                  {ourPhilosophy.copy.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </div>
          </Container>
        </section>

        <Container>
          <section className="grid gap-10 pt-10 pb-16 sm:pt-12 sm:pb-20 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-16 xl:pt-16 xl:pb-24">
            <div className="max-w-[42rem]">
              <span
                className="text-xs font-semibold uppercase tracking-[0.24em] text-amorah-terracotta"
                aria-hidden="true"
              >
                03
              </span>
              <h2 className="mt-5 font-heading text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-none text-amorah-black">
                {ourCollections.title}
              </h2>
              <div className="mt-6 h-px w-20 bg-amorah-maroon/70" aria-hidden="true" />
              <p className="mt-6 text-base leading-8 text-amorah-brown sm:text-[1.05rem]">{ourCollections.copy}</p>
            </div>
            <figure className="overflow-hidden lg:order-last">
              <video
                src={aboutImages.collections.src}
                aria-label={aboutImages.collections.label}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className={`aspect-[4/5] w-full object-cover ${aboutImages.collections.position}`}
              />
            </figure>
          </section>
        </Container>

        <section className="border-y border-amorah-border/80 bg-amorah-white">
          <Container className="py-16 sm:py-20 xl:py-24">
            <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
              {valuesSections.map((section, index) => (
                <article key={section.title} className="border-t border-amorah-border pt-6">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.24em] text-amorah-terracotta"
                    aria-hidden="true"
                  >
                    {String(index + 4).padStart(2, '0')}
                  </span>
                  <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight text-amorah-black sm:text-4xl">
                    {section.title}
                  </h2>
                  <div className="mt-5 h-px w-14 bg-amorah-maroon/70" aria-hidden="true" />
                  <p className="mt-5 text-sm leading-7 text-amorah-brown sm:text-base sm:leading-8">{section.copy}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-amorah-maroon text-amorah-white">
          <Container className="grid gap-0 lg:grid-cols-[0.92fr_1fr] lg:items-stretch">
            <figure className="min-h-[22rem] overflow-hidden lg:min-h-[34rem]">
              <img
                src={aboutImages.finale.src}
                alt={aboutImages.finale.alt}
                loading="lazy"
                className={`h-full min-h-[22rem] w-full object-cover lg:min-h-[34rem] ${aboutImages.finale.position}`}
              />
            </figure>
            <div className="flex items-center py-14 sm:py-16 lg:py-20 lg:pl-16">
              <div className="max-w-[40rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-beige">Amorah style</p>
                <p className="mt-4 font-heading text-[clamp(2.6rem,6vw,5.25rem)] font-semibold leading-none text-amorah-white">
                  Fashion fades.
                  <span className="block">Style remains.</span>
                </p>
                <p className="mt-6 max-w-[34rem] text-sm leading-7 text-amorah-beige sm:text-base sm:leading-8">
                  Every Amorah piece is designed to feel graceful, useful and memorable, whether chosen for everyday
                  confidence or a special moment.
                </p>
                <Link
                  to="/shop"
                  className="amorah-focus mt-8 inline-flex min-h-12 items-center justify-center border border-amorah-white bg-amorah-white px-6 text-sm font-semibold uppercase tracking-[0.14em] text-amorah-maroon transition hover:border-amorah-beige hover:bg-amorah-beige sm:px-7"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}

export default AboutPage;
