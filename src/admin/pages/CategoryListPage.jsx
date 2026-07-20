import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminEmptyState from '../components/AdminEmptyState.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import AdminTable from '../components/AdminTable.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { deleteCategory, getAdminCategories, updateCategory } from '../services/adminCategoryService.js';

const columns = ['Image', 'Name', 'Type', 'Parent', 'Show on Home', 'Show in Navigation', 'Featured', 'Display Order', 'Status', 'Actions'];

function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    showOnHomepage: '',
    showInNavigation: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmCategory, setConfirmCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAdminCategories(filters);
      setCategories(result.categories);
      setError('');
    } catch {
      setError('Unable to load categories.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const childCountByParent = useMemo(() => {
    return categories.reduce((counts, category) => {
      if (category.parent?.id) {
        counts[category.parent.id] = (counts[category.parent.id] || 0) + 1;
      }
      return counts;
    }, {});
  }, [categories]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const toggleStatus = async (category) => {
    try {
      await updateCategory(category.id, { isActive: !category.isActive });
      toast.success(category.isActive ? 'Category deactivated' : 'Category activated');
      loadCategories();
    } catch {
      toast.error('Unable to update category status.');
    }
  };

  const confirmDelete = async () => {
    if (!confirmCategory) return;

    setDeleting(true);
    try {
      await deleteCategory(confirmCategory.id);
      toast.success('Category deactivated');
      setConfirmCategory(null);
      loadCategories();
    } catch {
      toast.error('Unable to deactivate category.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Manage main categories and one-level subcategories for navigation and homepage visibility."
        action={
          <Link
            to="/admin/categories/new"
            className="inline-flex min-h-11 items-center gap-2 bg-[#672F3B] px-5 text-sm font-semibold text-white outline-none hover:bg-[#302925] focus-visible:ring-2 focus-visible:ring-[#672F3B] focus-visible:ring-offset-2"
          >
            <FiPlus aria-hidden="true" />
            Add Category
          </Link>
        }
      />

      <div className="grid gap-4 border border-[#DED2C5] bg-[#FFFDF8] p-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <label htmlFor="category-search">Search</label>
          <input id="category-search" value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} />
        </div>
        <div>
          <label htmlFor="category-type-filter">Type</label>
          <select id="category-type-filter" value={filters.type} onChange={(event) => updateFilter('type', event.target.value)}>
            <option value="">All</option>
            <option value="main">Main Category</option>
            <option value="subcategory">Subcategory</option>
          </select>
        </div>
        <div>
          <label htmlFor="category-status-filter">Status</label>
          <select id="category-status-filter" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label htmlFor="category-home-filter">Homepage</label>
          <select id="category-home-filter" value={filters.showOnHomepage} onChange={(event) => updateFilter('showOnHomepage', event.target.value)}>
            <option value="">All</option>
            <option value="true">Shown</option>
            <option value="false">Hidden</option>
          </select>
        </div>
        <div>
          <label htmlFor="category-nav-filter">Navigation</label>
          <select id="category-nav-filter" value={filters.showInNavigation} onChange={(event) => updateFilter('showInNavigation', event.target.value)}>
            <option value="">All</option>
            <option value="true">Shown</option>
            <option value="false">Hidden</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-72 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" />
      ) : error ? (
        <AdminEmptyState title="Could not load categories" message={error} />
      ) : categories.length === 0 ? (
        <AdminEmptyState
          title="No categories found"
          message="Adjust filters or create the first main category for Amorah."
          actionLabel="Create Category"
          actionTo="/admin/categories/new"
        />
      ) : (
        <AdminTable columns={columns}>
          {categories.map((category) => (
            <tr key={category.id} className={category.level === 1 ? 'bg-[#FFFDF8]' : 'bg-white'}>
              <td className="px-4 py-4">
                {category.image?.url ? (
                  <img src={category.image.url} alt={category.image.alt || category.name} className="h-12 w-12 object-cover" />
                ) : (
                  <div className="grid h-12 w-12 place-items-center border border-[#DED2C5] bg-[#F3ECE3] text-xs text-[#6F6259]">None</div>
                )}
              </td>
              <td className="px-4 py-4">
                <p className="font-semibold text-[#302925]">{category.level === 1 ? `- ${category.name}` : category.name}</p>
                <p className="text-xs text-[#6F6259]">{category.slug}</p>
              </td>
              <td className="px-4 py-4">{category.level === 0 ? 'Main Category' : 'Subcategory'}</td>
              <td className="px-4 py-4">{category.parent?.name || '-'}</td>
              <td className="px-4 py-4">{category.showOnHomepage ? 'Yes' : 'No'}</td>
              <td className="px-4 py-4">{category.showInNavigation ? 'Yes' : 'No'}</td>
              <td className="px-4 py-4">{category.isFeatured ? <StatusBadge tone="featured">Featured</StatusBadge> : 'No'}</td>
              <td className="px-4 py-4">{category.displayOrder}</td>
              <td className="px-4 py-4">
                <StatusBadge tone={category.isActive ? 'active' : 'inactive'}>{category.isActive ? 'Active' : 'Inactive'}</StatusBadge>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/categories/${category.id}/edit`}
                    className="grid h-10 w-10 place-items-center border border-[#DED2C5] text-[#302925] outline-none hover:bg-[#F3ECE3] focus-visible:ring-2 focus-visible:ring-[#672F3B]"
                    aria-label={`Edit ${category.name}`}
                  >
                    <FiEdit2 aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleStatus(category)}
                    className="min-h-10 border border-[#DED2C5] px-3 text-xs font-semibold text-[#302925] outline-none hover:bg-[#F3ECE3] focus-visible:ring-2 focus-visible:ring-[#672F3B]"
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmCategory(category)}
                    className="grid h-10 w-10 place-items-center border border-[#DED2C5] text-[#672F3B] outline-none hover:bg-[#F3ECE3] focus-visible:ring-2 focus-visible:ring-[#672F3B]"
                    aria-label={`Deactivate ${category.name}`}
                  >
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <ConfirmDialog
        open={Boolean(confirmCategory)}
        title="Deactivate category?"
        message={`Categories with subcategories should not be silently removed. This action will deactivate ${
          confirmCategory?.name || 'this category'
        } and product relationships will be protected after product APIs are added. ${
          confirmCategory && childCountByParent[confirmCategory.id] ? 'This main category currently has subcategories.' : ''
        }`}
        confirmLabel="Deactivate"
        loading={deleting}
        onCancel={() => setConfirmCategory(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default CategoryListPage;
