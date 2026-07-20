import PropTypes from 'prop-types';
import ProductCard from './ProductCard.jsx';

function RelatedProducts({ title = 'Related products', products }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amorah-brown">Amorah edit</p>
        <h2 className="mt-2 font-heading text-3xl font-semibold text-amorah-black">{title}</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

RelatedProducts.propTypes = {
  title: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RelatedProducts;
