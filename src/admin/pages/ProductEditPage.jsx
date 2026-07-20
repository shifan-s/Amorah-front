import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminEmptyState from '../components/AdminEmptyState.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import ProductForm from '../components/products/ProductForm.jsx';
import { getAdminCategories } from '../services/adminCategoryService.js';
import { archiveProduct, getProductById, getReadableApiError, updateProduct } from '../services/adminProductService.js';
import { productToForm } from '../utils/productFormDefaults.js';

function ProductEditPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.all([getProductById(productId), getAdminCategories()])
      .then(([product, categoryResult]) => {
        if (!mounted) return;
        setForm(productToForm(product));
        setCategories(categoryResult.categories);
      })
      .catch(() => {
        if (mounted) setError('Unable to load this product.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  const submit = async (payload) => {
    setSaving(true);
    try {
      await updateProduct(productId, payload);
      toast.success('Product updated successfully.');
      navigate('/admin/products');
    } catch (requestError) {
      toast.error(getReadableApiError(requestError, 'Unable to update product.'));
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    setSaving(true);
    try {
      await archiveProduct(productId);
      toast.success('Product archived');
      navigate('/admin/products');
    } catch (requestError) {
      toast.error(getReadableApiError(requestError, 'Unable to archive product.'));
    } finally {
      setSaving(false);
      setConfirmArchive(false);
    }
  };

  if (loading) {
    return <div className="h-80 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" />;
  }

  if (error || !form) {
    return <AdminEmptyState title="Product unavailable" message={error || 'Product not found.'} actionLabel="Back to Products" actionTo="/admin/products" />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader eyebrow="Product setup" title="Edit Product" description="Update the product information, images, price, stock, and available options." />
      <ProductForm mode="edit" initialForm={form} categories={categories} saving={saving} onSubmit={submit} onArchive={() => setConfirmArchive(true)} />
      <ConfirmDialog
        open={confirmArchive}
        title="Archive product?"
        message="The product will disappear from the storefront. This action does not permanently delete product data."
        confirmLabel="Archive"
        loading={saving}
        onCancel={() => setConfirmArchive(false)}
        onConfirm={archive}
      />
    </section>
  );
}

export default ProductEditPage;
