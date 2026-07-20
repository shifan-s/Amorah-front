import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '../common/Container.jsx';
import SectionHeading from '../common/SectionHeading.jsx';
import { imageAssets } from '../../data/imageAssets.js';
import { selectCategoryStatus, selectHomepageCategories, selectMainCategories } from '../../store/slices/categorySlice.js';

const primaryCollections = [
  {
    slug: 'ethnic-wear',
    caption: 'Graceful silhouettes for celebrations, rituals and everyday elegance.',
  },
  {
    slug: 'western-wear',
    caption: 'Modern separates and dresses for polished daily dressing.',
  },
  {
    slug: 'hijabs',
    caption: 'Elegant hijab styles selected for versatile styling.',
  },
];

function CategoryCardSkeleton({ index }) {
  return (
    <div className={`animate-pulse bg-amorah-light ${index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
      <div className={index < 2 ? 'aspect-[4/5] md:aspect-[5/4]' : 'aspect-[4/5]'} />
    </div>
  );
}

function CategoryGrid() {
  const homepageCategories = useSelector(selectHomepageCategories);
  const mainCategories = useSelector(selectMainCategories);
  const categoryStatus = useSelector(selectCategoryStatus);
  const loading = categoryStatus === 'idle' || categoryStatus === 'loading';
  const availableCategories = homepageCategories.length ? homepageCategories : mainCategories;
  const cards = primaryCollections
    .map((collection) => {
      const category = availableCategories.find(
        (item) => item.slug === collection.slug || item.name.toLowerCase() === collection.slug.replace(/-/g, ' '),
      );

      if (!category) {
        return null;
      }

      return {
        name: category.name,
        to: `/shop/${category.slug}`,
        description: category.description || collection.caption,
        image: category.image?.url ? { src: category.image.url, alt: category.image.alt || category.name } : imageAssets.editImages.cottonDresses,
      };
    })
    .filter(Boolean);

  if (!loading && cards.length === 0) {
    return null;
  }

  return (
    <section id="collections" className="scroll-mt-32 bg-amorah-white py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow="Shop by Collection"
          title="Three Ways to Begin"
          description="Start with Amorah's core edits, shown only when the active categories are available."
          align="center"
          className="mx-auto"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <CategoryCardSkeleton key={index} index={index} />)
            : cards.map((edit, index) => (
            <Link
              key={edit.name}
              to={edit.to}
              className="amorah-focus group relative block overflow-hidden bg-amorah-light"
            >
              <div className="aspect-[4/5]">
                <img
                  src={edit.image.src}
                  alt={edit.image.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-amorah-black/80 via-amorah-black/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-amorah-white sm:p-7">
                <h3 className="font-heading text-3xl font-semibold">{edit.name}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-amorah-white/85">{edit.description}</p>
                <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.16em]">Shop Collection</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default CategoryGrid;
