import PropTypes from 'prop-types';

const styles = {
  active: 'border-[#78866B]/30 bg-[#78866B]/10 text-[#4E5D43]',
  inactive: 'border-[#B8A89A]/40 bg-[#F3ECE3] text-[#6F6259]',
  featured: 'border-[#B9684B]/30 bg-[#B9684B]/10 text-[#672F3B]',
  warning: 'border-[#A76B32]/30 bg-[#A76B32]/10 text-[#7A4C24]',
};

function StatusBadge({ children, tone = 'active' }) {
  return (
    <span className={`inline-flex items-center border px-2.5 py-1 text-xs font-semibold ${styles[tone] || styles.active}`}>
      {children}
    </span>
  );
}

StatusBadge.propTypes = {
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(['active', 'inactive', 'featured', 'warning']),
};

export default StatusBadge;
