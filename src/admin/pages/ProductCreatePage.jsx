import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import ProductForm from '../components/products/ProductForm.jsx';
import { getAdminCategories } from '../services/adminCategoryService.js';
import { createProduct, getReadableApiError } from '../services/adminProductService.js';

function ProductCreatePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminCategories()
      .then((result) => setCategories(result.categories))
      .catch(() => toast.error('Unable to load categories.'));
  }, []);

  const submit = async (payload) => {
    setSaving(true);
    try {
      await createProduct(payload);
      toast.success(payload.status === 'active' ? 'Product published' : 'Product saved as draft');
      navigate('/admin/products');
    } catch (requestError) {
      toast.error(getReadableApiError(requestError, 'Unable to create product.'));
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <AdminPageHeader eyebrow="Product setup" title="Create Product" description="Build product details, colour variants, images and stock." />
      <ProductForm mode="create" categories={categories} saving={saving} onSubmit={submit} />
    </section>
  );
}

export default ProductCreatePage;
