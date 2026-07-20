import { useEffect, useMemo, useState } from 'react';
import { FiExternalLink, FiLayers, FiPlus, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminEmptyState from '../components/AdminEmptyState.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import AdminStatCard from '../components/AdminStatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { getAdminCategories } from '../services/adminCategoryService.js';
import { getProducts } from '../services/adminProductService.js';

function AdminDashboardPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.all([getAdminCategories(), getProducts({ limit: 100, sort: 'newest' })])
      .then(([categoryResult, productResult]) => {
        if (!mounted) return;
        setCategories(categoryResult.categories);
        setProducts(productResult.products);
        setError('');
      })
      .catch(() => {
        if (!mounted) return;
        setError('Admin dashboard data is unavailable right now.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      totalProducts: products.length,
      activeProducts: products.filter((product) => product.status === 'active').length,
      draftProducts: products.filter((product) => product.status === 'draft').length,
      archivedProducts: products.filter((product) => product.status === 'archived').length,
      lowStockProducts: products.filter((product) => Number(product.totalStock || 0) <= 5).length,
      categories: categories.length,
    }),
    [categories.length, products],
  );
  const recentProducts = products.slice(0, 5);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Admin Dashboard"
        description="A quiet control room for Amorah product, category and media preparation."
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-32 animate-pulse border border-[#DED2C5] bg-[#FFFDF8]" />
          ))}
        </div>
      ) : error ? (
        <AdminEmptyState title="API unavailable" message={error} actionLabel="Manage Products" actionTo="/admin/products" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AdminStatCard label="Total Products" value={stats.totalProducts} />
            <AdminStatCard label="Active Products" value={stats.activeProducts} />
            <AdminStatCard label="Draft Products" value={stats.draftProducts} />
            <AdminStatCard label="Archived Products" value={stats.archivedProducts} />
            <AdminStatCard label="Low Stock Products" value={stats.lowStockProducts} helper="Five units or fewer" />
            <AdminStatCard label="Categories" value={stats.categories} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
            <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-[#302925]">Recent Products</h2>
                <Link className="text-sm font-semibold text-[#672F3B] hover:text-[#302925]" to="/admin/products">
                  Manage
                </Link>
              </div>
              {recentProducts.length ? (
                <div className="mt-4 divide-y divide-[#DED2C5]">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <p className="font-semibold text-[#302925]">{product.name}</p>
                        <p className="text-sm text-[#6F6259]">{product.mainCategory?.name || 'No category'} · Stock {product.totalStock || 0}</p>
                      </div>
                      <StatusBadge tone={product.status === 'active' ? 'active' : product.status === 'archived' ? 'warning' : 'inactive'}>
                        {product.status}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#6F6259]">No products have been created yet.</p>
              )}
            </section>

            <section className="border border-[#DED2C5] bg-[#FFFDF8] p-5">
              <h2 className="text-lg font-semibold text-[#302925]">Quick Actions</h2>
              <div className="mt-4 grid gap-3">
                <Link className="flex min-h-11 items-center gap-3 bg-[#672F3B] px-4 text-sm font-semibold text-white" to="/admin/products/new">
                  <FiPlus aria-hidden="true" />
                  Add Product
                </Link>
                <Link className="flex min-h-11 items-center gap-3 border border-[#DED2C5] px-4 text-sm font-semibold text-[#302925]" to="/admin/products">
                  <FiTag aria-hidden="true" />
                  Manage Products
                </Link>
                <Link className="flex min-h-11 items-center gap-3 border border-[#DED2C5] px-4 text-sm font-semibold text-[#302925]" to="/admin/categories">
                  <FiLayers aria-hidden="true" />
                  Manage Categories
                </Link>
                <a className="flex min-h-11 items-center gap-3 border border-[#DED2C5] px-4 text-sm font-semibold text-[#302925]" href="/" target="_blank" rel="noreferrer">
                  <FiExternalLink aria-hidden="true" />
                  View Store
                </a>
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminDashboardPage;
