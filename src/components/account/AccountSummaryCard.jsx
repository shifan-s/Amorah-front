import PropTypes from 'prop-types';

function AccountSummaryCard({ label, value, helper }) {
  return (
    <section className="border border-amorah-border bg-amorah-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-brown">{label}</p>
      <p className="mt-3 font-heading text-3xl font-semibold text-amorah-black">{value}</p>
      {helper ? <p className="mt-2 text-sm text-amorah-brown">{helper}</p> : null}
    </section>
  );
}

AccountSummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  helper: PropTypes.string,
};

export default AccountSummaryCard;
