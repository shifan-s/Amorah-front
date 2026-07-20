import PropTypes from 'prop-types';

function AdminStatCard({ label, value, helper }) {
  return (
    <article className="border border-[#DED2C5] bg-[#FFFDF8] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6F6259]">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#302925]">{value}</p>
      {helper ? <p className="mt-2 text-sm text-[#6F6259]">{helper}</p> : null}
    </article>
  );
}

AdminStatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  helper: PropTypes.string,
};

export default AdminStatCard;
