import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminEmptyState from '../components/AdminEmptyState.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import CategoryForm from '../components/CategoryForm.jsx';
import {
  getAdminCategories,
  getAdminCategory,
  updateCategory,
} from '../services/adminCategoryService.js';

function mapErrors(error) {
  const errors = {};
  error.response?.data?.errors?.forEach((item) => {
    errors[item.field] = item.message;
  });
  return errors;
}

function CategoryEditPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backendErrors, setBackendErrors] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.all([getAdminCategory(categoryId), getAdminCategories({ type: 'main', status: 'active' })])
      .then(([categoryResult, mainResult]) => {
        if (!mounted) return;
        setCategory(categoryResult);
        setMainCategories(mainResult.categories);
      })
      .catch(() => {
        if (mounted) setError('Unable to load this category.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  const submit = async (payload) => {
    setSaving(true);
    setBackendErrors({});
    try {
      await updateCategory(categoryId, payload);
      toast.success('Category updated');
      navigate('/admin/categories');
    } catch (requestError) {
      setBackendErrors(mapErrors(requestError));
      toast.error(requestError.response?.data?.message || 'Unable to update category.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-72 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" />;
  }

  if (error || !category) {
    return <AdminEmptyState title="Category unavailable" message={error || 'Category not found.'} actionLabel="Back to Categories" actionTo="/admin/categories" />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Category setup"
        title={`Edit ${category.name}`}
        description="Update category visibility, status and display order."
      />
      <CategoryForm
        mode="edit"
        category={category}
        mainCategories={mainCategories}
        saving={saving}
        backendErrors={backendErrors}
        onSubmit={submit}
      />
    </section>
  );
}

export default CategoryEditPage;
