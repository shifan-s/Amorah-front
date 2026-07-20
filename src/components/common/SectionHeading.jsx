import PropTypes from 'prop-types';

const alignments = {
  left: 'items-start text-left',
  center: 'items-center text-center',
};

function SectionHeading({ eyebrow, title, description, align = 'left', className = '' }) {
  return (
    <div className={`flex max-w-3xl flex-col gap-3 ${alignments[align]} ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-terracotta">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-semibold leading-tight text-amorah-maroon sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? <p className="text-base leading-7 text-amorah-brown">{description}</p> : null}
    </div>
  );
}

SectionHeading.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  align: PropTypes.oneOf(Object.keys(alignments)),
  className: PropTypes.string,
};

export default SectionHeading;
