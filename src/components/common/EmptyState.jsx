import PropTypes from 'prop-types';
import Button from './Button.jsx';

function EmptyState({ icon, title, description, actionLabel, onAction, className = '' }) {
  return (
    <section
      className={`border border-dashed border-amorah-border bg-amorah-white px-6 py-12 text-center ${className}`}
    >
      {icon ? (
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center bg-amorah-light text-2xl text-amorah-brown">
          {icon}
        </div>
      ) : null}
      <h2 className="font-heading text-2xl font-semibold text-amorah-black">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-amorah-brown">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="outline" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  className: PropTypes.string,
};

export default EmptyState;
