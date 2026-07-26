import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '../common/Container.jsx';
import { imageAssets } from '../../data/imageAssets.js';
import { selectPublicCategories } from '../../store/slices/categorySlice.js';

function findPartywearLink(categories) {
  const subcategory = categories.find((category) => category.level === 1 && category.slug?.includes('party'));
  const parentId = subcategory?.parent?.id || subcategory?.parent;
  const parent = categories.find((category) => category.id === parentId);

  if (subcategory && parent) {
    return `/shop/${parent.slug}?subcategory=${subcategory.slug}`;
  }

  return '/shop?occasion=partywear';
}

function EditorialFeatureBanner() {
  const categories = useSelector(selectPublicCategories);
  const linkTo = findPartywearLink(categories);

  return (
    <section className="bg-amorah-light py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid overflow-hidden bg-amorah-white lg:grid-cols-[0.92fr_1fr] lg:items-stretch">
          <div className="min-h-[280px] overflow-hidden lg:min-h-[360px]">
            <img
              src={imageAssets.editorial.ethnicCampaign.src}
              alt={imageAssets.editorial.ethnicCampaign.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex items-center p-6 sm:p-10 lg:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amorah-terracotta">The Occasion Edit</p>
              <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-amorah-maroon sm:text-5xl">
                Made for Moments That Matter
              </h2>
              <p className="mt-5 text-base leading-8 text-amorah-brown">
                Celebrate every special moment in timeless style. Discover thoughtfully curated partywear and elegant gowns designed with refined details, graceful silhouettes and effortless sophistication for weddings, festive gatherings and unforgettable evenings.
              </p>
              <Link
                to={linkTo}
                className="amorah-focus mt-8 inline-flex min-h-12 items-center justify-center rounded-sm border border-amorah-maroon bg-amorah-maroon px-6 text-sm font-semibold tracking-[0.08em] text-amorah-white transition hover:border-amorah-black hover:bg-amorah-black"
              >
                Discover Partywear
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default EditorialFeatureBanner;
