import PropTypes from 'prop-types';
import Container from '../common/Container.jsx';
import SectionHeading from '../common/SectionHeading.jsx';

function TestimonialsSection({ testimonials }) {
  return (
    <section className="bg-amorah-ivory py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Customer notes"
          title="Notes from the Amorah Community"
          description="Short reflections from women who reach for Amorah when comfort and grace both matter."
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <figure key={testimonial.id} className="bg-amorah-white p-6 shadow-[0_18px_45px_rgba(48,41,37,0.06)]">
              <blockquote className="font-heading text-2xl font-semibold leading-8 text-amorah-maroon">
                "{testimonial.quote}"
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-amorah-black">{testimonial.name}</span>
                <span className="block text-amorah-brown">{testimonial.location}</span>
                <span className="mt-1 block text-amorah-muted">{testimonial.productFocus}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

TestimonialsSection.propTypes = {
  testimonials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      quote: PropTypes.string.isRequired,
      productFocus: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default TestimonialsSection;
