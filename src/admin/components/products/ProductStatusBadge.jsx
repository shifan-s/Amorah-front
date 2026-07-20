import PropTypes from 'prop-types';
import StatusBadge from '../StatusBadge.jsx';

const tones = {
  active: 'active',
  draft: 'inactive',
  archived: 'warning',
};

function ProductStatusBadge({ status }) {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft';

  return <StatusBadge tone={tones[status] || 'inactive'}>{label}</StatusBadge>;
}

ProductStatusBadge.propTypes = {
  status: PropTypes.string,
};

export default ProductStatusBadge;
