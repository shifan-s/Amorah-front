import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Container from '../common/Container.jsx';
import ProductCard from '../product/ProductCard.jsx';
import { imageAssets } from '../../data/imageAssets.js';
import { selectPublicCategories } from '../../store/slices/categorySlice.js';

function isHijabProduct(product) {
  const values = [
    product.name,
    product.productType,
    product.style,
    product.mainCategory?.name,
    product.mainCategory?.slug,
    product.subcategory?.name,
    product.subcategory?.slug,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return values.includes('hijab');
}

function HijabFeature({ products }) {
  const categories = useSelector(selectPublicCategories);
  const hijabCategory = categories.find(
    (category) => category.level === 0 && (category.slug?.includes('hijab') || category.name?.toLowerCase().includes('hijab')),
  );
  const hijabProducts = products.filter(isHijabProduct).slice(0, 3);

  if (!hijabCategory) {
    return null;
  }

  return (
    <section className="bg-amorah-light py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-terracotta">Hijab Edit</p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-amorah-maroon sm:text-5xl">
              Everyday Ease, Elevated
            </h2>
            <p className="mt-5 text-base leading-8 text-amorah-brown">
              Discover elegant hijabs in versatile shades for everyday styling and special occasions.
            </p>
            <Link
              to={`/shop/${hijabCategory.slug}`}
              className="amorah-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-maroon transition hover:bg-amorah-maroon hover:text-amorah-white"
            >
              Shop Hijabs
            </Link>
          </div>
          {hijabProducts.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {hijabProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <img
              src={hijabCategory.image?.url || imageAssets.editImages.cottonDresses.src}
              alt={hijabCategory.image?.alt || hijabCategory.name}
              className="aspect-[4/5] w-full object-cover lg:aspect-[5/4]"
              loading="lazy"
            />
          )}
        </div>
      </Container>
    </section>
  );
}

HijabFeature.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default HijabFeature;
