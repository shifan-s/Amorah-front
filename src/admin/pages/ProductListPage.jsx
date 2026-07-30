import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminEmptyState from '../components/AdminEmptyState.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import ProductFilters from '../components/products/ProductFilters.jsx';
import ProductTable from '../components/products/ProductTable.jsx';
import { getAdminCategories } from '../services/adminCategoryService.js';
import { archiveProduct, deleteProduct, getProducts, getReadableApiError, updateProductStatus } from '../services/adminProductService.js';

const defaultFilters = {
  search: '',
  mainCategory: '',
  subcategory: '',
  status: '',
  productType: '',
  style: '',
  fabric: '',
  featured: '',
  newArrival: '',
  bestSeller: '',
  stockStatus: '',
  page: 1,
  limit: 20,
  sort: 'newest',
};

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [working, setWorking] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProducts(filters);
      setProducts(result.products);
      setMeta(result.meta);
      setError('');
    } catch {
      setError('Unable to load products.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    getAdminCategories()
      .then((result) => setCategories(result.categories))
      .catch(() => toast.error('Unable to load categories for filters.'));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const productCounts = useMemo(
    () => ({
      label: `${meta.total || products.length} product${(meta.total || products.length) === 1 ? '' : 's'}`,
    }),
    [meta.total, products.length],
  );

  const updateFilter = (field, value) => {
    setFilters((current) => {
      const next = { ...current, [field]: value, page: field === 'page' ? value : 1 };
      if (field === 'mainCategory') {
        const compatible = categories.some((category) => category.id === current.subcategory && category.parent?.id === value);
        if (!compatible) next.subcategory = '';
      }
      return next;
    });
  };

  const runStatusAction = async () => {
    if (!confirm) return;

    setWorking(true);
    try {
      if (confirm.action === 'archive') {
        await archiveProduct(confirm.product.id);
        toast.success('Product archived');
      } else if (confirm.action === 'delete') {
        await deleteProduct(confirm.product.id);
        toast.success('Product deleted permanently');
      } else {
        await updateProductStatus(confirm.product.id, confirm.status);
        toast.success(confirm.status === 'active' ? 'Product activated' : 'Product moved to draft');
      }
      setConfirm(null);
      loadProducts();
    } catch (requestError) {
      toast.error(getReadableApiError(requestError, 'Unable to update product.'));
    } finally {
      setWorking(false);
    }
  };

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        description={`Manage products, colour variants, image sets and stock. ${productCounts.label} found.`}
        action={
          <Link to="/admin/products/new" className="inline-flex min-h-11 items-center gap-2 bg-[#672F3B] px-5 text-sm font-semibold text-white">
            <FiPlus aria-hidden="true" />
            Add Product
          </Link>
        }
      />

      <ProductFilters filters={filters} categories={categories} onChange={updateFilter} />

      {loading ? (
        <div className="h-80 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" />
      ) : error ? (
        <AdminEmptyState title="Could not load products" message={error} />
      ) : products.length === 0 ? (
        <AdminEmptyState title="No products found" message="Adjust filters or create the first Amorah product." actionLabel="Add Product" actionTo="/admin/products/new" />
      ) : (
        <>
          <ProductTable
            products={products}
            onStatusChange={(product, status) =>
              setConfirm({
                action: 'status',
                status,
                product,
                title: status === 'active' ? 'Activate product?' : 'Move product to draft?',
                message:
                  status === 'active'
                    ? 'The backend will validate images, sizes, pricing and category assignment before publishing.'
                    : 'The product will be hidden from the storefront while it is in draft.',
              })
            }
            onArchive={(product) =>
              setConfirm({
                action: 'archive',
                product,
                title: 'Archive product?',
                message: `${product.name} will disappear from the storefront. This does not permanently delete product data.`,
              })
            }
            onDelete={(product) =>
              setConfirm({
                action: 'delete',
                product,
                title: 'Delete product permanently?',
                message: `${product.name} and its product data will be permanently deleted and cannot be recovered. Products used in an order cannot be deleted.`,
              })
            }
          />
          <div className="flex flex-col gap-3 border border-[#DED2C5] bg-[#FFFDF8] p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#6F6259]">
              Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button type="button" disabled={meta.page <= 1} onClick={() => updateFilter('page', meta.page - 1)} className="min-h-10 border border-[#DED2C5] px-4 text-sm font-semibold disabled:opacity-40">
                Previous
              </button>
              <button type="button" disabled={meta.page >= meta.totalPages} onClick={() => updateFilter('page', meta.page + 1)} className="min-h-10 border border-[#DED2C5] px-4 text-sm font-semibold disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title || 'Confirm action'}
        message={confirm?.message || ''}
        confirmLabel={confirm?.action === 'archive' ? 'Archive' : confirm?.action === 'delete' ? 'Delete permanently' : 'Confirm'}
        loading={working}
        onCancel={() => setConfirm(null)}
        onConfirm={runStatusAction}
      />
    </section>
  );
}

export default ProductListPage;
