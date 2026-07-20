import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import CategoryForm from '../components/CategoryForm.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import { createCategory, getAdminCategories } from '../services/adminCategoryService.js';

function mapErrors(error) {
  const errors = {};
  error.response?.data?.errors?.forEach((item) => {
    errors[item.field] = item.message;
  });
  return errors;
}

function CategoryCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mainCategories, setMainCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const initialCategory = searchParams.get('type') === 'subcategory' ? { level: 1 } : null;

  useEffect(() => {
    getAdminCategories({ type: 'main', status: 'active' })
      .then((result) => setMainCategories(result.categories))
      .catch(() => toast.error('Unable to load main categories.'));
  }, []);

  const submit = async (payload) => {
    setSaving(true);
    setBackendErrors({});
    try {
      await createCategory(payload);
      toast.success('Category created');
      navigate('/admin/categories');
    } catch (error) {
      setBackendErrors(mapErrors(error));
      toast.error(error.response?.data?.message || 'Unable to create category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Category setup"
        title="Create Category"
        description="Create a main category or a one-level subcategory. Product assignment will come later."
      />
      <CategoryForm
        mode="create"
        category={initialCategory}
        mainCategories={mainCategories}
        saving={saving}
        backendErrors={backendErrors}
        onSubmit={submit}
      />
    </section>
  );
}

export default CategoryCreatePage;
