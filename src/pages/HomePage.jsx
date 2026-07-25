import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Seo from '../components/common/Seo.jsx';
import BrandBenefits from '../components/home/BrandBenefits.jsx';
import CategoryGrid from '../components/home/CategoryGrid.jsx';
import EditorialFeatureBanner from '../components/home/EditorialFeatureBanner.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';
import HeroBanner from '../components/home/HeroBanner.jsx';
import HijabFeature from '../components/home/HijabFeature.jsx';
import NewArrivals from '../components/home/NewArrivals.jsx';
import ShopByStyle from '../components/home/ShopByStyle.jsx';
import { imageAssets } from '../data/imageAssets.js';
import { getBestSellers, getFeaturedProducts, getNewArrivals } from '../services/productService.js';
import { upsertProducts } from '../store/slices/productSlice.js';

function HomePage() {
  const dispatch = useDispatch();
  const [sections, setSections] = useState({
    newArrivals: [],
    bestSellers: [],
    featured: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHomeProducts() {
      try {
        setLoading(true);
        const [newArrivalResult, bestSellerResult, featuredResult] = await Promise.all([
          getNewArrivals({ limit: 8 }, { signal: controller.signal }),
          getBestSellers({ limit: 8 }, { signal: controller.signal }),
          getFeaturedProducts({ limit: 8 }, { signal: controller.signal }),
        ]);

        if (controller.signal.aborted) {
          return;
        }

        const nextSections = {
          newArrivals: newArrivalResult.products,
          bestSellers: bestSellerResult.products,
          featured: featuredResult.products,
        };

        setSections(nextSections);
        dispatch(upsertProducts([...nextSections.newArrivals, ...nextSections.bestSellers, ...nextSections.featured]));
      } catch (error) {
        if (!controller.signal.aborted) {
          setSections({ newArrivals: [], bestSellers: [], featured: [] });
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadHomeProducts();

    return () => controller.abort();
  }, [dispatch]);

  return (
    <>
      <Seo
        title="Amorah | Premium Women's Clothing"
        description="Discover premium women's clothing from Amorah : dresses, co-ord sets, kurtis, ethnic wear and new arrivals."
        path="/"
        breadcrumbs={[{ name: 'Home', path: '/' }]}
      />
      <main className="bg-amorah-ivory text-amorah-black">
        <HeroBanner image={imageAssets.hero.src} alt={imageAssets.hero.alt} />
        <CategoryGrid />
        <NewArrivals products={sections.newArrivals.slice(0, 8)} loading={loading} />
        <EditorialFeatureBanner />
        <FeaturedProducts
          eyebrow="Featured Styles"
          title="Featured Styles"
          description="Backend-featured Amorah pieces selected for the storefront."
          products={
            sections.featured.filter((product) => !sections.newArrivals.some((item) => item.id === product.id)).length
              ? sections.featured.filter((product) => !sections.newArrivals.some((item) => item.id === product.id)).slice(0, 8)
              : sections.featured.slice(0, 8)
          }
          linkTo="/shop?sort=recommended"
          loading={loading}
        />
        <ShopByStyle />
        <HijabFeature products={[...sections.newArrivals, ...sections.featured, ...sections.bestSellers]} />
        <BrandBenefits />
      </main>
    </>
  );
}

export default HomePage;
