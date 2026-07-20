import Button from '../common/Button.jsx';
import Container from '../common/Container.jsx';

function NewsletterSection() {
  return (
    <section className="bg-amorah-maroon py-16 text-amorah-white sm:py-20 lg:py-24">
      <Container size="md">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-beige">Amorah letters</p>
          <h2 className="mt-4 font-heading text-4xl font-semibold text-amorah-white sm:text-5xl">
            A Little Amorah in Your Inbox
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-amorah-beige">
            Be the first to discover new cotton collections, ethnic edits and thoughtful style stories.
          </p>
          <form className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="home-newsletter-email" className="sr-only">
              Email address
            </label>
            <input id="home-newsletter-email" type="email" placeholder="you@example.com" className="border-amorah-white/20 bg-amorah-white text-amorah-black" />
            <Button type="submit" variant="secondary" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}

export default NewsletterSection;
