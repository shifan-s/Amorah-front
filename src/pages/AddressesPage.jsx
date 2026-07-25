import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddressCard from '../components/account/AddressCard.jsx';
import AddressForm from '../components/account/AddressForm.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import {
  createSavedAddress,
  deleteSavedAddress,
  getSavedAddresses,
  setDefaultSavedAddress,
  updateSavedAddress,
} from '../services/addressService.js';

function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [savingStatus, setSavingStatus] = useState('idle');
  const [error, setError] = useState('');
  const [editingAddress, setEditingAddress] = useState(null);

  const loadAddresses = async () => {
    setStatus('loading');
    setError('');

    try {
      setAddresses(await getSavedAddresses());
      setStatus('succeeded');
    } catch (requestError) {
      setError(requestError.message || 'Unable to load addresses.');
      setStatus('failed');
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const saveAddress = async (payload) => {
    setSavingStatus('saving');

    try {
      const nextAddresses = editingAddress
        ? await updateSavedAddress(editingAddress.id, payload)
        : await createSavedAddress(payload);
      setAddresses(nextAddresses);
      setEditingAddress(null);
      toast.success(editingAddress ? 'Address updated' : 'Address saved');
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to save address');
    } finally {
      setSavingStatus('idle');
    }
  };

  const deleteAddress = async (addressId) => {
    setSavingStatus('saving');

    try {
      setAddresses(await deleteSavedAddress(addressId));
      if (editingAddress?.id === addressId) setEditingAddress(null);
      toast.success('Address deleted');
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to delete address');
    } finally {
      setSavingStatus('idle');
    }
  };

  const makeDefault = async (addressId) => {
    setSavingStatus('saving');

    try {
      setAddresses(await setDefaultSavedAddress(addressId));
      toast.success('Default address updated');
    } catch (requestError) {
      toast.error(requestError.message || 'Unable to update default address');
    } finally {
      setSavingStatus('idle');
    }
  };

  return (
    <>
      <Seo
        title="Addresses | Amorah N-ZAN Designs"
        description="Manage Amorah saved addresses for checkout and account use."
        path="/account/addresses"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Account', path: '/account' },
          { name: 'Addresses', path: '/account/addresses' },
        ]}
      />
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Saved addresses</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-amorah-black">Addresses</h1>
        {status === 'loading' ? <p className="mt-6 text-sm text-amorah-brown">Loading addresses...</p> : null}
        {status === 'failed' ? (
          <div className="mt-6">
            <EmptyState title="Could not load addresses" description={error} />
            <button type="button" className="amorah-focus mt-4 text-sm font-semibold text-amorah-brown" onClick={loadAddresses}>
              Retry
            </button>
          </div>
        ) : null}
        {status === 'succeeded' && addresses.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                busy={savingStatus === 'saving'}
                onEdit={() => setEditingAddress(address)}
                onDelete={() => deleteAddress(address.id)}
                onMakeDefault={() => makeDefault(address.id)}
              />
            ))}
          </div>
        ) : null}
        {status === 'succeeded' && addresses.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No saved addresses" description="Add a delivery address to make checkout faster." />
          </div>
        ) : null}
        <div className="mt-8">
          <h2 className="mb-4 font-heading text-2xl font-semibold">{editingAddress ? 'Edit address' : 'Add a new address'}</h2>
          <AddressForm
            address={editingAddress}
            status={savingStatus}
            onSubmit={saveAddress}
            onCancel={() => setEditingAddress(null)}
          />
        </div>
      </section>
    </>
  );
}

export default AddressesPage;

