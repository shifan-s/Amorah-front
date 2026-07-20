import { fallbackProductImage } from './productVariants.js';

function normalizeImage(image = {}, index = 0) {
  return {
    id: image.id || image._id || image.publicId || `image-${index}`,
    url: image.url || fallbackProductImage,
    publicId: image.publicId || '',
    alt: image.alt || 'Amorah product image',
    sortOrder: Number(image.sortOrder) || index,
    isPrimary: Boolean(image.isPrimary),
  };
}

function normalizeSize(size = {}) {
  return {
    id: size.id || size._id || size.name || '',
    name: size.name || '',
    stock: Number(size.stock) || 0,
    active: size.active !== false,
  };
}

function normalizeVariant(variant = {}) {
  const sizes = (variant.sizes || []).map(normalizeSize).filter((size) => size.active);
  const images = (variant.images || [])
    .map(normalizeImage)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const totalStock = sizes.reduce((total, size) => total + size.stock, 0);

  return {
    id: variant.id || variant._id || variant.sku || '',
    sku: variant.sku || '',
    colourName: variant.colourName || '',
    colourHex: variant.colourHex || '',
    images,
    sizes,
    active: variant.active !== false,
    totalStock,
  };
}

export function normalizeProduct(product = {}) {
  const regularPrice = Number(product.regularPrice) || 0;
  const currentPrice = Number(product.currentPrice ?? product.salePrice ?? product.regularPrice) || 0;
  const salePrice = product.salePrice === null || product.salePrice === undefined ? null : Number(product.salePrice);
  const variants = (product.variants || []).map(normalizeVariant).filter((variant) => variant.active);
  const images = (product.images || []).map(normalizeImage).sort((a, b) => a.sortOrder - b.sortOrder);
  const firstVariant = variants.find((variant) => variant.totalStock > 0) || variants[0];
  const primaryImage =
    firstVariant?.images.find((image) => image.isPrimary) ||
    firstVariant?.images[0] ||
    images.find((image) => image.isPrimary) ||
    images[0] ||
    normalizeImage(product.primaryImage);
  const totalStock = Number(product.totalStock) || variants.reduce((total, variant) => total + variant.totalStock, 0);

  return {
    id: product.id || product._id || '',
    name: product.name || '',
    slug: product.slug || '',
    mainCategory: product.mainCategory || null,
    subcategory: product.subcategory || null,
    productType: product.productType || '',
    style: product.style || '',
    fabric: product.fabric || '',
    occasion: product.occasion || '',
    tags: product.tags || [],
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    regularPrice,
    salePrice,
    currentPrice,
    isOnSale: salePrice !== null && salePrice < regularPrice,
    discountPercentage: Number(product.discountPercentage) || 0,
    variants,
    images,
    primaryImage,
    featured: Boolean(product.featured),
    newArrival: Boolean(product.newArrival),
    bestSeller: Boolean(product.bestSeller),
    ratingAverage: Number(product.ratingAverage) || 0,
    ratingCount: Number(product.ratingCount) || 0,
    rating: Number(product.ratingAverage) || 0,
    reviewCount: Number(product.ratingCount) || 0,
    totalStock,
    inStock: product.inStock ?? totalStock > 0,
    active: product.status ? product.status === 'active' : true,
    fabricDetails: product.fabricDetails || '',
    fit: product.fit || '',
    careInstructions: product.careInstructions || '',
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
