import PropTypes from 'prop-types';
import { FiArchive } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function AdminEmptyState({ title, message, actionLabel, actionTo }) {
  return (
    <div className="border border-[#DED2C5] bg-[#FFFDF8] p-8 text-center">
      <FiArchive className="mx-auto h-8 w-8 text-[#B9684B]" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-[#302925]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#6F6259]">{message}</p>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-5 inline-flex min-h-11 items-center justify-center bg-[#672F3B] px-5 text-sm font-semibold text-white outline-none transition hover:bg-[#302925] focus-visible:ring-2 focus-visible:ring-[#672F3B] focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

AdminEmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  actionTo: PropTypes.string,
};

export default AdminEmptyState;
