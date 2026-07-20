import PropTypes from 'prop-types';
import Badge from '../common/Badge.jsx';

function AddressCard({ address, onDelete, onEdit, onMakeDefault, busy }) {
  const name = address.name || address.fullName;
  const line1 = address.line1 || address.addressLine1;
  const line2 = address.line2 || [address.addressLine2, address.landmark].filter(Boolean).join(', ');
  const pinCode = address.pinCode || address.postalCode;
  const isDefault = address.default || address.isDefault;

  return (
    <article className="border border-amorah-border bg-amorah-white p-5">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-heading text-xl font-semibold text-amorah-black">{name}</h2>
        {isDefault ? <Badge variant="rose">Default</Badge> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-amorah-brown">
        {line1}
        <br />
        {line2 ? (
          <>
            {line2}
            <br />
          </>
        ) : null}
        {address.city}, {address.state} {pinCode}
      </p>
      <p className="mt-3 text-sm font-semibold text-amorah-black">+91 {address.mobile}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <button type="button" className="amorah-focus text-amorah-brown hover:text-amorah-black" onClick={onEdit}>
          Edit
        </button>
        {!isDefault ? (
          <button type="button" className="amorah-focus text-amorah-brown hover:text-amorah-black" onClick={onMakeDefault} disabled={busy}>
            Make default
          </button>
        ) : null}
        <button type="button" className="amorah-focus text-amorah-error hover:text-amorah-black" onClick={onDelete} disabled={busy}>
          Delete
        </button>
      </div>
    </article>
  );
}

AddressCard.propTypes = {
  address: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onMakeDefault: PropTypes.func,
  busy: PropTypes.bool,
};

AddressCard.defaultProps = {
  onDelete: () => {},
  onEdit: () => {},
  onMakeDefault: () => {},
  busy: false,
};

export default AddressCard;
