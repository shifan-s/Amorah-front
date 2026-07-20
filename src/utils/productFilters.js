import {
  PRODUCT_FABRICS,
  PRODUCT_OCCASIONS,
  PRODUCT_SIZES,
  PRODUCT_STYLES,
  PRODUCT_TYPES,
} from '../constants/productOptions.js';
import { getProductColours, getProductSizes, getProductStock } from './productVariants.js';

export const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
];

export const filterParamKeys = [
  'mainCategory',
  'subcategory',
  'productType',
  'style',
  'fabric',
  'occasion',
  'size',
  'colour',
  'min',
  'max',
  'availability',
  'newArrival',
  'bestSeller',
  'sale',
  'sort',
];

export function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function titleFromSlug(value) {
  return String(value || '')
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function parseMultiValue(searchParams, key) {
  const directValues = searchParams.getAll(key);
  const values = directValues.length > 0 ? directValues : [searchParams.get(key)].filter(Boolean);

  return values
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getFiltersFromSearchParams(searchParams) {
  return {
    productType: searchParams.get('productType') || '',
    mainCategory: searchParams.get('mainCategory') || '',
    subcategory: searchParams.get('subcategory') || '',
    style: searchParams.get('style') || '',
    fabric: searchParams.get('fabric') || '',
    occasion: searchParams.get('occasion') || '',
    sizes: parseMultiValue(searchParams, 'size').map((value) => value.toUpperCase()),
    colours: parseMultiValue(searchParams, 'colour').map(slugify),
    min: Number(searchParams.get('min')) || 0,
    max: Number(searchParams.get('max')) || 10000,
    availability: searchParams.get('availability') === 'in-stock',
    newArrival: searchParams.get('newArrival') === 'true',
    bestSeller: searchParams.get('bestSeller') === 'true',
    sale: searchParams.get('sale') === 'true',
    sort: searchParams.get('sort') || 'recommended',
  };
}

export function getFilterOptions(products) {
  const colours = [...new Set(products.flatMap(getProductColours))].sort();
  const maxPrice = Math.max(...products.map((product) => product.regularPrice), 10000);
  const mainCategories = [
    ...new Map(
      products
        .map((product) => product.mainCategory)
        .filter(Boolean)
        .map((category) => [category.slug, category]),
    ).values(),
  ];
  const subcategories = [
    ...new Map(
      products
        .map((product) => product.subcategory)
        .filter(Boolean)
        .map((category) => [category.slug, category]),
    ).values(),
  ];

  return {
    mainCategories,
    subcategories,
    productTypes: PRODUCT_TYPES,
    styles: PRODUCT_STYLES,
    fabrics: PRODUCT_FABRICS,
    occasions: PRODUCT_OCCASIONS,
    sizes: PRODUCT_SIZES,
    colours,
    maxPrice,
  };
}

export function matchesSearch(product, query) {
  if (!query) {
    return true;
  }

  const term = query.toLowerCase();
  const searchable = [
    product.name,
    product.productType,
    product.style,
    product.fabric,
    product.occasion,
    product.shortDescription,
    product.description,
    product.fabricDetails,
    product.fit,
    ...product.tags,
  ]
    .join(' ')
    .toLowerCase();

  return searchable.includes(term);
}

function matchesSingleOption(productValue, filterValue) {
  return !filterValue || slugify(productValue) === filterValue;
}

function matchesCategory(category, filterValue) {
  return !filterValue || category?.slug === filterValue || category?.id === filterValue;
}

export function filterProducts(products, filters, query = '') {
  return products.filter((product) => {
    if (!product.active || !matchesSearch(product, query)) {
      return false;
    }

    if (!matchesCategory(product.mainCategory, filters.mainCategory)) return false;
    if (!matchesCategory(product.subcategory, filters.subcategory)) return false;
    if (!matchesSingleOption(product.productType, filters.productType)) return false;
    if (!matchesSingleOption(product.style, filters.style)) return false;
    if (!matchesSingleOption(product.fabric, filters.fabric)) return false;
    if (!matchesSingleOption(product.occasion, filters.occasion)) return false;

    if (filters.newArrival && !product.newArrival) return false;
    if (filters.bestSeller && !product.bestSeller) return false;
    if (filters.sale && !product.isOnSale) return false;

    if (filters.sizes.length > 0 && !filters.sizes.some((size) => getProductSizes(product).includes(size))) {
      return false;
    }

    if (
      filters.colours.length > 0 &&
      !filters.colours.some((colour) => getProductColours(product).some((productColour) => slugify(productColour) === colour))
    ) {
      return false;
    }

    const price = product.currentPrice ?? product.salePrice ?? product.regularPrice;
    if (price < filters.min || price > filters.max) {
      return false;
    }

    if (filters.availability && getProductStock(product) <= 0) {
      return false;
    }

    return true;
  });
}

export function sortProducts(products, sortBy = 'recommended') {
  const sorted = [...products];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival) || b.reviewCount - a.reviewCount);
    case 'best-selling':
      return sorted.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.reviewCount - a.reviewCount);
    case 'price-low-high':
      return sorted.sort((a, b) => (a.currentPrice ?? a.salePrice ?? a.regularPrice) - (b.currentPrice ?? b.salePrice ?? b.regularPrice));
    case 'price-high-low':
      return sorted.sort((a, b) => (b.currentPrice ?? b.salePrice ?? b.regularPrice) - (a.currentPrice ?? a.salePrice ?? a.regularPrice));
    case 'recommended':
    default:
      return sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.bestSeller) - Number(a.bestSeller) ||
          b.rating - a.rating,
      );
  }
}

export function filterAndSortProducts(products, filters, query = '') {
  return sortProducts(filterProducts(products, filters, query), filters.sort);
}
