import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Container from '../common/Container.jsx';
import ProductCard from '../product/ProductCard.jsx';
import ProductCardSkeleton from '../product/ProductCardSkeleton.jsx';
import SectionHeading from '../common/SectionHeading.jsx';

function FeaturedProducts({ title, eyebrow, description, products, linkTo = '/shop', loading = false }) {
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="bg-amorah-ivory py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <Link
            to={linkTo}
            className="amorah-focus text-sm font-semibold uppercase tracking-[0.14em] text-amorah-terracotta hover:text-amorah-maroon"
          >
            View all
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Container>
    </section>
  );
}

FeaturedProducts.propTypes = {
  title: PropTypes.string.isRequired,
  eyebrow: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkTo: PropTypes.string,
  loading: PropTypes.bool,
};

export default FeaturedProducts;
