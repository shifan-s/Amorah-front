import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch } from 'react-icons/fi';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import SortDropdown from '../components/product/SortDropdown.jsx';
import { getCategoryBySlug } from '../services/categoryService.js';
import { getProducts } from '../services/productService.js';
import { PRODUCT_FABRICS, PRODUCT_OCCASIONS, PRODUCT_STYLES, PRODUCT_TYPES } from '../constants/productOptions.js';
import { selectMainCategories } from '../store/slices/categorySlice.js';
import { upsertProducts } from '../store/slices/productSlice.js';
import { getFiltersFromSearchParams, slugify, titleFromSlug } from '../utils/productFilters.js';

const pageSize = 12;

function buildSearchParams(filters, page = 1) {
  const params = new URLSearchParams();

  if (filters.mainCategory) params.set('mainCategory', filters.mainCategory);
  if (filters.subcategory) params.set('subcategory', filters.subcategory);
  if (filters.productType) params.set('productType', filters.productType);
  if (filters.style) params.set('style', filters.style);
  if (filters.fabric) params.set('fabric', filters.fabric);
  if (filters.occasion) params.set('occasion', filters.occasion);
  if (filters.sizes.length) params.set('size', filters.sizes.join(','));
  if (filters.colours.length) params.set('colour', filters.colours.join(','));
  if (filters.min > 0) params.set('min', String(filters.min));
  if (filters.max < 10000) params.set('max', String(filters.max));
  if (filters.availability) params.set('availability', 'in-stock');
  if (filters.newArrival) params.set('newArrival', 'true');
  if (filters.bestSeller) params.set('bestSeller', 'true');
  if (filters.sale) params.set('sale', 'true');
  if (filters.sort !== 'recommended') params.set('sort', filters.sort);
  if (page > 1) params.set('page', String(page));

  return params;
}

function getPageTitle(filters, category) {
  if (category) return category.name;
  if (filters.newArrival) return 'New Arrivals';
  if (filters.bestSeller) return 'Best Sellers';
  if (filters.subcategory) return titleFromSlug(filters.subcategory);
  if (filters.mainCategory) return titleFromSlug(filters.mainCategory);
  if (filters.productType) return titleFromSlug(filters.productType);
  if (filters.style) return `${titleFromSlug(filters.style)} Edit`;
  if (filters.fabric) return `${titleFromSlug(filters.fabric)} Edit`;
  if (filters.occasion) return `${titleFromSlug(filters.occasion)} Edit`;
  return 'Shop';
}

function optionValueFromSlug(options, value) {
  if (!value) {
    return '';
  }

  return options.find((option) => slugify(option) === value) || titleFromSlug(value);
}

function toApiParams(filters, categorySlug, page) {
  return {
    page,
    limit: pageSize,
    mainCategorySlug: categorySlug || filters.mainCategory,
    subcategorySlug: filters.subcategory,
    productType: optionValueFromSlug(PRODUCT_TYPES, filters.productType),
    style: optionValueFromSlug(PRODUCT_STYLES, filters.style),
    fabric: optionValueFromSlug(PRODUCT_FABRICS, filters.fabric),
    occasion: optionValueFromSlug(PRODUCT_OCCASIONS, filters.occasion),
    size: filters.sizes.join(','),
    colour: filters.colours.map(titleFromSlug).join(','),
    minPrice: filters.min > 0 ? filters.min : '',
    maxPrice: filters.max < 10000 ? filters.max : '',
    inStock: filters.availability ? true : '',
    newArrival: filters.newArrival ? true : '',
    bestSeller: filters.bestSeller ? true : '',
    sale: filters.sale ? true : '',
    sort: filters.sort,
  };
}

function ShopPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mainCategories = useSelector(selectMainCategories);
  const [searchInput, setSearchInput] = useState('');
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: pageSize, total: 0, totalPages: 1 });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');
  const [category, setCategory] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(Boolean(categorySlug));
  const [categoryError, setCategoryError] = useState('');

  const filters = useMemo(() => getFiltersFromSearchParams(searchParams), [searchParams]);
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const activeCategory = useMemo(() => {
    if (!categorySlug) {
      return null;
    }

    const categoryFromList = mainCategories.find((item) => item.slug === categorySlug);
    if (!category && categoryFromList) {
      return categoryFromList;
    }

    return category
      ? {
          ...category,
          children: categoryFromList?.children || category.children || [],
        }
      : null;
  }, [category, categorySlug, mainCategories]);
  const pageTitle = getPageTitle(filters, activeCategory);
  const pageDescription =
    activeCategory?.description ||
    'Shop Amorah western wear, partywear, ethnic wear, cotton comfort, dresses, kurtas, co-ord sets, jeans and shawls.';
  const selectedSubcategory = activeCategory?.children?.find((subcategory) => subcategory.slug === filters.subcategory);
  const invalidSubcategory = Boolean(activeCategory && filters.subcategory && !selectedSubcategory);

  useEffect(() => {
    if (!categorySlug) {
      setCategory(null);
      setCategoryError('');
      setCategoryLoading(false);
      return undefined;
    }

    let ignore = false;
    setCategoryLoading(true);
    setCategoryError('');

    getCategoryBySlug(categorySlug)
      .then((result) => {
        if (!ignore) {
          setCategory(result);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setCategory(null);
          setCategoryError(error.message || 'Category not found');
        }
      })
      .finally(() => {
        if (!ignore) {
          setCategoryLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [categorySlug]);

  useEffect(() => {
    if (categorySlug && (categoryLoading || categoryError)) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductError('');
        const result = await getProducts(toApiParams(filters, categorySlug, page), { signal: controller.signal });

        if (controller.signal.aborted) {
          return;
        }

        setProducts(result.products);
        setMeta(result.meta);
        dispatch(upsertProducts(result.products));
      } catch (error) {
        if (!controller.signal.aborted) {
          setProducts([]);
          setMeta({ page: 1, limit: pageSize, total: 0, totalPages: 1 });
          setProductError(error.message || 'Unable to load products');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, [categoryError, categoryLoading, categorySlug, dispatch, filters, page]);

  const replaceFilters = (nextFilters, nextPage = 1) => {
    setSearchParams(buildSearchParams(nextFilters, nextPage));
  };

  const updateFilter = (partial) => {
    const nextFilters = { ...filters, ...partial };
    if (Object.prototype.hasOwnProperty.call(partial, 'mainCategory')) {
      nextFilters.subcategory = '';
      if (partial.mainCategory) {
        navigate(`/shop/${partial.mainCategory}`);
        return;
      }
      navigate('/shop');
      return;
    }
    replaceFilters(nextFilters);
  };

  const handleClearFilters = () => {
    navigate(categorySlug ? `/shop/${categorySlug}` : '/shop');
    setSearchInput('');
  };

  return (
    <>
      <Seo
        title={`${pageTitle} | Amorah N-ZAN Designs`}
        description={pageDescription}
        path={categorySlug ? `/shop/${categorySlug}` : '/shop'}
        image={activeCategory?.image?.url}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: pageTitle, path: categorySlug ? `/shop/${categorySlug}` : '/shop' },
        ]}
      />
      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container>
          <section className="overflow-hidden border border-amorah-border bg-amorah-white">
            {categoryLoading ? (
              <div className="h-72 animate-pulse bg-amorah-light" />
            ) : (
              <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
                <div className="p-6 sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-terracotta">Amorah shop</p>
                  <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight text-amorah-maroon sm:text-6xl">
                    {pageTitle}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-amorah-brown">{pageDescription}</p>
                  {selectedSubcategory ? (
                    <p className="mt-3 text-sm font-semibold text-amorah-maroon">Showing {selectedSubcategory.name}</p>
                  ) : null}
                  <p className="mt-4 text-sm text-amorah-brown">
                    {meta.total} {meta.total === 1 ? 'piece' : 'pieces'} found
                  </p>
                </div>
                {activeCategory?.image?.url ? (
                  <img
                    src={activeCategory.image.url}
                    alt={activeCategory.image.alt || activeCategory.name}
                    className="hidden h-full min-h-72 w-full object-cover lg:block"
                    loading="lazy"
                  />
                ) : null}
              </div>
            )}

            <div className="border-t border-amorah-border p-4 sm:p-5">
              <form
                className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl"
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  const query = searchInput.trim();
                  if (query) {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                  }
                }}
              >
                <label htmlFor="shop-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="shop-search"
                  type="search"
                  value={searchInput}
                  placeholder="Search tops, jeans, kurtas, shawls..."
                  onChange={(event) => setSearchInput(event.target.value)}
                />
                <Button type="submit" className="shrink-0" aria-label="Search products">
                  <FiSearch aria-hidden="true" />
                  Search
                </Button>
              </form>
            </div>

            {activeCategory?.children?.length ? (
              <nav className="flex gap-3 overflow-x-auto border-t border-amorah-border p-4 sm:p-5" aria-label="Subcategories">
                <Link
                  to={`/shop/${activeCategory.slug}`}
                  className={`amorah-focus shrink-0 border px-4 py-2 text-sm font-semibold ${
                    !filters.subcategory
                      ? 'border-amorah-maroon bg-amorah-maroon text-amorah-white'
                      : 'border-amorah-border text-amorah-brown hover:text-amorah-maroon'
                  }`}
                >
                  View All
                </Link>
                {activeCategory.children.map((subcategory) => (
                  <Link
                    key={subcategory.id || subcategory.slug}
                    to={`/shop/${activeCategory.slug}?subcategory=${subcategory.slug}`}
                    className={`amorah-focus shrink-0 border px-4 py-2 text-sm font-semibold ${
                      filters.subcategory === subcategory.slug
                        ? 'border-amorah-maroon bg-amorah-maroon text-amorah-white'
                        : 'border-amorah-border text-amorah-brown hover:text-amorah-maroon'
                    }`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </nav>
            ) : null}
          </section>

          {categoryError ? (
            <EmptyState
              className="mt-8"
              title="Category not found"
              description="This collection may be inactive or the link may be incorrect."
              actionLabel="Return to Shop"
              onAction={() => navigate('/shop')}
            />
          ) : invalidSubcategory ? (
            <EmptyState
              className="mt-8"
              title="Subcategory unavailable"
              description="That subcategory does not belong to this collection."
              actionLabel="View Collection"
              onAction={() => navigate(`/shop/${activeCategory.slug}`)}
            />
          ) : (
            <div className="mt-8">
              <section>
                <div className="mb-5 flex justify-end">
                  <SortDropdown value={filters.sort} onChange={(sort) => updateFilter({ sort })} />
                </div>

                {productError ? (
                  <EmptyState
                    title="Unable to load products"
                    description="The Amorah product service is unavailable right now. Please try again."
                    actionLabel="Retry"
                    onAction={() => setSearchParams(new URLSearchParams(searchParams))}
                  />
                ) : (
                  <ProductGrid products={products} loading={loadingProducts} onClearFilters={handleClearFilters} />
                )}

                {meta.totalPages > 1 ? (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => replaceFilters(filters, page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-semibold text-amorah-brown">
                      Page {page} of {meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page >= meta.totalPages}
                      onClick={() => replaceFilters(filters, page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                ) : null}
              </section>
            </div>
          )}
        </Container>

      </main>
    </>
  );
}

export default ShopPage;
