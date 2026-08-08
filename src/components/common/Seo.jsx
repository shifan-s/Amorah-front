import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import amorahLogo from '../../assets/images/amorah-logo.jpg';
import { getProductStock } from '../../utils/productVariants.js';

const siteName = 'Amorah N-ZAN Designs';
const siteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://www.amorah.online').replace(/\/$/, '');

function absoluteUrl(path = '/') {
  if (path.startsWith('http')) {
    return path;
  }

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

const defaultImage = absoluteUrl(amorahLogo);

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl || '/',
    logo: defaultImage,
  };
}

function breadcrumbSchema(items = []) {
  if (items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path || '/'),
    })),
  };
}

function productImageUrls(product) {
  if (product?.variants?.length) {
    return product.variants.flatMap((variant) =>
      (variant.images || []).map((image) => (typeof image === 'string' ? image : image.url)).filter(Boolean),
    );
  }

  return product?.images || [];
}

function productSchema(product, path) {
  if (!product) {
    return null;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: productImageUrls(product),
      url: absoluteUrl(path || `/product/${product.slug}`),
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.currentPrice ?? product.salePrice ?? product.regularPrice,
      availability: getProductStock(product) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: absoluteUrl(path || `/product/${product.slug}`),
    },
  };

  if (product.rating > 0 && product.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return schema;
}

function Seo({ title, description, path = '/', image = defaultImage, type = 'website', breadcrumbs = [], product }) {
  const canonicalUrl = absoluteUrl(path);
  const schemas = [organizationSchema(), breadcrumbSchema(breadcrumbs), productSchema(product, path)].filter(Boolean);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {schemas.map((schema, index) => (
        <script key={`${schema['@type']}-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

Seo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
    }),
  ),
  product: PropTypes.object,
};

export default Seo;
