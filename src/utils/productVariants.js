export const productColourMap = {
  Beige: '#E9DED2',
  Black: '#111111',
  Brown: '#4B3B35',
  Ivory: '#FAF8F4',
  'Light Grey': '#F3F3F3',
  'Muted Rose': '#C99A9A',
  Terracotta: '#B9684B',
  Sage: '#78866B',
  White: '#FFFFFF',
};

export const fallbackProductImage = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200" role="img" aria-label="Amorah product image unavailable">
  <rect width="900" height="1200" fill="#FAF6EE"/>
  <rect x="95" y="110" width="710" height="980" fill="#FFFDF8" stroke="#DED2C5" stroke-width="4"/>
  <path d="M450 245c55 0 94 35 104 86l84 44-56 120-54-24v385H372V471l-54 24-56-120 84-44c10-51 49-86 104-86z" fill="#E7D7C5" stroke="#B8A89A" stroke-width="8" stroke-linejoin="round"/>
  <path d="M398 323c18 22 35 33 52 33s34-11 52-33" fill="none" stroke="#672F3B" stroke-width="8" stroke-linecap="round"/>
  <text x="450" y="965" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="#672F3B">AMORAH</text>
  <text x="450" y="1028" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" letter-spacing="4" fill="#746A63">IMAGE COMING SOON</text>
</svg>
`)}`;

function normalizeImage(image, productName = 'Amorah product', colourName = '', index = 0) {
  if (typeof image === 'string') {
    return {
      id: `image-${index}`,
      url: image,
      alt: colourName ? `${productName} in ${colourName}` : productName,
      sortOrder: index,
      isPrimary: index === 0,
    };
  }

  return {
    id: image?.id || image?._id || image?.publicId || `image-${index}`,
    url: image?.url || fallbackProductImage,
    publicId: image?.publicId || '',
    pose: image?.pose || ['front', 'side', 'back'][index] || '',
    alt: image?.alt || (colourName ? `${productName} in ${colourName}` : productName),
    sortOrder: Number.isInteger(image?.sortOrder) ? image.sortOrder : index,
    isPrimary: Boolean(image?.isPrimary),
  };
}

function normalizeImageCollection(images = [], productName = 'Amorah product', colourName = '') {
  const normalized = images
    .map((image, index) => normalizeImage(image, productName, colourName, index))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (normalized.length && !normalized.some((image) => image.isPrimary)) {
    normalized[0].isPrimary = true;
  }

  return normalized;
}

export function handleProductImageError(event) {
  if (event.currentTarget.src !== fallbackProductImage) {
    event.currentTarget.src = fallbackProductImage;
  }
}

export function getColourVariants(product) {
  if (!product) {
    return [];
  }

  if (Array.isArray(product.variants) && product.variants.length > 0 && product.variants[0]?.colourName) {
    return product.variants.map((variant) => ({
      ...variant,
      colourHex: variant.colourHex || productColourMap[variant.colourName] || '#E5E5E5',
      images: normalizeImageCollection(variant.images || [], product.name, variant.colourName),
      sizes: variant.sizes || [],
    }));
  }

  if (Array.isArray(product.colourVariants) && product.colourVariants.length > 0) {
    return product.colourVariants.map((variant) => ({
      ...variant,
      colourHex: variant.colourHex || productColourMap[variant.colourName] || '#E5E5E5',
      images: normalizeImageCollection(variant.images || [], product.name, variant.colourName),
      sizes: variant.sizes || [],
    }));
  }

  return [];
}

export function getProductImages(product) {
  if (!product) {
    return [normalizeImage(fallbackProductImage)];
  }

  const directImages = Array.isArray(product.images) ? product.images : [];
  const normalizedImages = normalizeImageCollection(directImages, product.name);

  if (normalizedImages.length) {
    return normalizedImages;
  }

  if (product.primaryImage?.url) {
    return normalizeImageCollection([product.primaryImage], product.name);
  }

  if (product.image) {
    return normalizeImageCollection([product.image], product.name);
  }

  return [normalizeImage(fallbackProductImage, product.name)];
}

export function getColourVariant(product, colourName) {
  return getColourVariants(product).find((variant) => variant.colourName === colourName) || null;
}

export function getColourVariantStock(colourVariant) {
  return (colourVariant?.sizes || []).reduce((total, size) => total + Math.max(0, size.stock || 0), 0);
}

export function getFirstAvailableColourVariant(product) {
  const variants = getColourVariants(product);
  return variants.find((variant) => getColourVariantStock(variant) > 0) || variants[0] || null;
}

export function getPrimaryVariantImage(product, colourName = '') {
  const colourVariant = colourName ? getColourVariant(product, colourName) : getFirstAvailableColourVariant(product);
  const primaryImage = colourVariant?.images?.find((image) => image.pose === 'front') || colourVariant?.images?.[0];

  if (primaryImage) {
    return primaryImage;
  }

  return getProductImages(product)[0];
}

export function getVariant(product, selectedSize, selectedColour) {
  const colourVariant = getColourVariant(product, selectedColour);
  const size = colourVariant?.sizes?.find((candidate) => candidate.name === selectedSize);

  if (!colourVariant || !size) {
    return null;
  }

  return {
    ...colourVariant,
    size: selectedSize,
    sizeId: size.id || size._id || size.name,
    stock: size.stock,
  };
}

export function getVariantStock(product, selectedSize, selectedColour) {
  const colourVariant = getColourVariant(product, selectedColour);
  return colourVariant?.sizes?.find((size) => size.name === selectedSize)?.stock || 0;
}

export function isColourAvailable(product, colour, selectedSize = '') {
  const colourVariant = getColourVariant(product, colour);

  if (!colourVariant) {
    return false;
  }

  if (selectedSize) {
    return (colourVariant.sizes || []).some((size) => size.name === selectedSize && size.stock > 0);
  }

  return getColourVariantStock(colourVariant) > 0;
}

export function isSizeAvailable(product, size, selectedColour = '') {
  if (selectedColour) {
    return getVariantStock(product, size, selectedColour) > 0;
  }

  return getColourVariants(product).some((colourVariant) =>
    (colourVariant.sizes || []).some((variantSize) => variantSize.name === size && variantSize.stock > 0),
  );
}

export function getProductColours(product) {
  return getColourVariants(product).map((variant) => variant.colourName);
}

export function getProductSizes(product) {
  const variantSizes = [
    ...new Set(
      getColourVariants(product).flatMap((variant) => (variant.sizes || []).map((size) => size.name)),
    ),
  ];

  if (variantSizes.length) {
    return variantSizes;
  }

  if (Array.isArray(product?.sizes)) {
    return product.sizes.map((size) => (typeof size === 'string' ? size : size?.name)).filter(Boolean);
  }

  return [];
}

export function getProductStock(product) {
  const variants = getColourVariants(product);
  const variantStock = variants.reduce((total, variant) => total + getColourVariantStock(variant), 0);

  if (variantStock > 0 || variants.length) {
    return variantStock;
  }

  return Number(product?.totalStock ?? product?.stock ?? 0);
}
