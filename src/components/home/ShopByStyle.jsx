import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '../common/Container.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { imageAssets } from '../../data/imageAssets.js';
import { selectPublicCategories } from '../../store/slices/categorySlice.js';

const preferredStyles = [
  'churidar-sets',
  'partywear',
  'co-ord-sets',
  'gowns',
  'tops',
  'jeans',
  'jersey-hijabs',
  'shimmer-hijabs',
];

function matchesPreferredStyle(category) {
  return preferredStyles.includes(category.slug);
}

function ShopByStyle() {
  const categories = useSelector(selectPublicCategories);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const styleLinks = categories
    .filter((category) => category.level === 1 && matchesPreferredStyle(category))
    .slice(0, 8)
    .map((category) => {
      const parent = categoryById.get(category.parent?.id || category.parent);
      return {
        id: category.id,
        name: category.name,
        to: parent ? `/shop/${parent.slug}?subcategory=${category.slug}` : '/shop',
        image: category.image?.url ? category.image : null,
      };
    });

  if (!styleLinks.length) {
    return null;
  }

  return (
    <section className="bg-amorah-ivory py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Shop by Style"
          title="Find Your Shape"
          description="A compact edit of real Amorah subcollections for faster browsing."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {styleLinks.map((style) => (
            <Link
              key={style.id}
              to={style.to}
              className="amorah-focus group overflow-hidden border border-amorah-border bg-amorah-white"
            >
              <div className="aspect-[4/5] overflow-hidden bg-amorah-light">
                <img
                  src={style.image?.url || imageAssets.editImages.cottonDresses.src}
                  alt={style.image?.alt || style.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  loading="lazy"
                />
              </div>
              <span className="block px-4 py-4 text-sm font-semibold text-amorah-black group-hover:text-amorah-maroon">
                {style.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default ShopByStyle;
