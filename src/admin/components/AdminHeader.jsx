import PropTypes from 'prop-types';
import { FiMenu } from 'react-icons/fi';

function AdminHeader({ user, onMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#DED2C5] bg-[#FAF6EE]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onMenu}
          className="grid h-11 w-11 place-items-center border border-[#DED2C5] bg-[#FFFDF8] text-[#302925] outline-none focus-visible:ring-2 focus-visible:ring-[#672F3B] lg:hidden"
          aria-label="Open admin menu"
        >
          <FiMenu aria-hidden="true" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#672F3B]">Back office</p>
          <p className="mt-1 text-sm text-[#6F6259]">Manage phase-one category controls.</p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[#302925]">{user?.fullName || 'Admin'}</p>
          <p className="text-xs text-[#6F6259]">{user?.email}</p>
        </div>
      </div>
    </header>
  );
}

AdminHeader.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
  }),
  onMenu: PropTypes.func.isRequired,
};

export default AdminHeader;
