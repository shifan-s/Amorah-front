import PropTypes from 'prop-types';
import EmptyState from '../common/EmptyState.jsx';
import ProductCard from './ProductCard.jsx';
import ProductCardSkeleton from './ProductCardSkeleton.jsx';

function ProductGrid({ products, loading = false, onClearFilters }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 min-[420px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No pieces found"
        description="Try removing a filter or searching for a different style."
        actionLabel="Clear Filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 min-[420px]:grid-cols-2 min-[420px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  onClearFilters: PropTypes.func.isRequired,
};

export default ProductGrid;
