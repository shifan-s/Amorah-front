import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Seo from '../components/common/Seo.jsx';
import ActiveFilterChips from '../components/product/ActiveFilterChips.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import SortDropdown from '../components/product/SortDropdown.jsx';
import { getProducts } from '../services/productService.js';
import { upsertProducts } from '../store/slices/productSlice.js';
import { getFiltersFromSearchParams } from '../utils/productFilters.js';

const pageSize = 12;

function SearchPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: pageSize, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const filters = useMemo(() => getFiltersFromSearchParams(searchParams), [searchParams]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (searchInput === query) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      const trimmed = searchInput.trim();

      if (trimmed) {
        nextParams.set('q', trimmed);
        nextParams.delete('page');
      } else {
        nextParams.delete('q');
        nextParams.delete('page');
      }

      setSearchParams(nextParams);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput, query, searchParams, setSearchParams]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setMeta({ page: 1, limit: pageSize, total: 0, totalPages: 1 });
      setError('');
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    async function loadResults() {
      try {
        setLoading(true);
        setError('');
        const result = await getProducts(
          {
            search: query.trim(),
            page,
            limit: pageSize,
            sort: filters.sort,
          },
          { signal: controller.signal },
        );

        if (controller.signal.aborted) {
          return;
        }

        setProducts(result.products);
        setMeta(result.meta);
        dispatch(upsertProducts(result.products));
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setProducts([]);
          setMeta({ page: 1, limit: pageSize, total: 0, totalPages: 1 });
          setError(requestError.message || 'Unable to search products');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadResults();

    return () => controller.abort();
  }, [dispatch, filters.sort, page, query]);

  const updateSort = (sort) => {
    const nextParams = new URLSearchParams(searchParams);
    if (sort === 'recommended') {
      nextParams.delete('sort');
    } else {
      nextParams.set('sort', sort);
    }
    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  const updatePage = (nextPage) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextPage > 1) {
      nextParams.set('page', String(nextPage));
    } else {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const handleChipRemove = (key) => {
    const nextParams = new URLSearchParams(searchParams);

    if (key === 'q') {
      nextParams.delete('q');
      setSearchInput('');
    }

    if (key === 'price') {
      nextParams.delete('min');
      nextParams.delete('max');
    }

    if (['availability', 'newArrival', 'bestSeller', 'sale', 'sort'].includes(key)) {
      nextParams.delete(key);
    }

    nextParams.delete('page');
    setSearchParams(nextParams);
  };

  return (
    <>
      <Seo
        title={query ? `Search results for ${query} | Amorah N-ZAN Designs` : 'Search | Amorah N-ZAN Designs'}
        description="Search Amorah product names, product types, styles, fabrics, occasions and tags."
        path={query ? `/search?q=${encodeURIComponent(query)}` : '/search'}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Search', path: '/search' },
        ]}
      />
      <main className="bg-amorah-ivory py-8 text-amorah-black sm:py-12">
        <Container>
          <section className="border border-amorah-border bg-amorah-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Search Amorah</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">Find your next favourite</h1>
            <p className="mt-3 text-sm text-amorah-brown">
              {query
                ? `${meta.total} ${meta.total === 1 ? 'result' : 'results'} for "${query}"`
                : 'Search product names, product types, styles, fabrics, occasions and tags.'}
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row" role="search" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="search-page-input" className="sr-only">
                Search products
              </label>
              <input
                id="search-page-input"
                type="search"
                value={searchInput}
                placeholder="Try floral, kurtis, dresses or rose..."
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <Button type="button" variant="outline" className="shrink-0" onClick={clearSearch}>
                Clear Filters
              </Button>
            </form>
          </section>

          <section className="mt-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <ActiveFilterChips
                filters={filters}
                query={query}
                onRemove={handleChipRemove}
                onClear={clearSearch}
              />
              <SortDropdown value={filters.sort} onChange={updateSort} />
            </div>

            {error ? (
              <EmptyState
                title="Unable to search products"
                description="The Amorah product service is unavailable right now. Please try again."
                actionLabel="Retry"
                onAction={() => updatePage(page)}
              />
            ) : query.trim() ? (
              <ProductGrid products={products} loading={loading} onClearFilters={clearSearch} />
            ) : (
              <EmptyState
                title="Search Amorah"
                description="Enter a product name, fabric, style, occasion or tag to begin."
              />
            )}

            {query.trim() && meta.totalPages > 1 ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button variant="outline" disabled={page <= 1} onClick={() => updatePage(page - 1)}>
                  Previous
                </Button>
                <span className="text-sm font-semibold text-amorah-brown">
                  Page {page} of {meta.totalPages}
                </span>
                <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => updatePage(page + 1)}>
                  Next
                </Button>
              </div>
            ) : null}
          </section>
        </Container>
      </main>
    </>
  );
}

export default SearchPage;
