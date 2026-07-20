import Container from '../common/Container.jsx';

function HomeIntro() {
  return (
    <section className="bg-amorah-ivory py-14 sm:py-16 lg:py-20">
      <Container size="lg">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-terracotta">Amorah by N-ZAN Designs</p>
          <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-amorah-maroon sm:text-5xl">
            Curated for Every Side of You
          </h2>
          <p className="mt-5 text-base leading-8 text-amorah-brown">
            From graceful ethnic silhouettes to modern western styles and everyday hijabs, explore pieces selected for
            effortless dressing.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default HomeIntro;
