import PropTypes from 'prop-types';

function AdminPageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#DED2C5] pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#672F3B]">{eyebrow}</p> : null}
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-[#302925] sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6259]">{description}</p> : null}
      </div>
      {action ? <div className="w-full shrink-0 [&>*]:w-full sm:w-auto sm:[&>*]:w-auto">{action}</div> : null}
    </div>
  );
}

AdminPageHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};

export default AdminPageHeader;
