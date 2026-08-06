function trim(value) {
  return String(value ?? '').trim();
}

function slugify(value) {
  return trim(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeTags(tags) {
  return [...new Set((tags || []).map((tag) => trim(tag).toLowerCase()).filter(Boolean))].slice(0, 20);
}

function normalizeImages(images = []) {
  const orderedImages = images
    .filter((image) => image.url)
    .map((image, index) => ({
      ...(image.id ? { _id: image.id } : {}),
      url: trim(image.url),
      pose: trim(image.pose).toLowerCase(),
      publicId: trim(image.publicId),
      alt: trim(image.alt),
      sortOrder: index,
      isPrimary: Boolean(image.isPrimary),
    }));

  if (orderedImages.length && !orderedImages.some((image) => image.isPrimary)) {
    orderedImages[0].isPrimary = true;
  }

  let primaryFound = false;
  return orderedImages.map((image) => {
    if (image.isPrimary && !primaryFound) {
      primaryFound = true;
      return image;
    }

    return { ...image, isPrimary: false };
  });
}

function normalizeSizes(sizes = []) {
  return sizes
    .filter((size) => trim(size.name))
    .map((size) => ({
      ...(size.id ? { _id: size.id } : {}),
      name: trim(size.name),
      stock: Number.parseInt(size.stock, 10) || 0,
      active: size.active !== false,
    }));
}

function normalizeVariants(variants = []) {
  return variants.map((variant) => ({
    ...(variant.id ? { _id: variant.id } : {}),
    sku: trim(variant.sku).toUpperCase(),
    colourName: trim(variant.colourName),
    colourHex: trim(variant.colourHex),
    price: Number(variant.price),
    compareAtPrice: variant.compareAtPrice === '' || variant.compareAtPrice === null ? null : Number(variant.compareAtPrice),
    images: normalizeImages(variant.images),
    sizes: normalizeSizes(variant.sizes),
    active: variant.active !== false,
  }));
}

export function buildProductPayload(form, status) {
  const payload = {
    name: trim(form.name),
    slug: form.slug ? slugify(form.slug) : undefined,
    skuPrefix: trim(form.skuPrefix).toUpperCase() || undefined,
    mainCategory: form.mainCategory,
    subcategory: form.subcategory || null,
    productType: trim(form.productType),
    style: trim(form.style),
    fabric: trim(form.fabric),
    occasion: trim(form.occasion),
    tags: normalizeTags(form.tags),
    shortDescription: trim(form.shortDescription),
    description: trim(form.description),
    regularPrice: Number(form.regularPrice),
    salePrice: form.salePrice === '' || form.salePrice === null ? null : Number(form.salePrice),
    variants: normalizeVariants(form.variants),
    fabricDetails: trim(form.fabricDetails),
    fit: trim(form.fit),
    careInstructions: trim(form.careInstructions),
    status,
    featured: Boolean(form.featured),
    newArrival: Boolean(form.newArrival),
    bestSeller: Boolean(form.bestSeller),
    metaTitle: trim(form.metaTitle),
    metaDescription: trim(form.metaDescription),
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
}

export { slugify };
