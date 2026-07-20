import { slugify } from './productPayload.js';

const urlPattern = /^https?:\/\/.+/i;
const hexPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function setError(errors, path, message) {
  if (!errors[path]) {
    errors[path] = message;
  }
}

function numberValue(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

function validateVariant(variant, index, errors, activeSubmit) {
  const prefix = `variants.${index}`;
  const sku = String(variant.sku || '').trim().toUpperCase();
  const colourName = String(variant.colourName || '').trim();
  const colourLabel = colourName || `Colour ${index + 1}`;

  if (!sku) {
    setError(errors, `${prefix}.sku`, 'SKU is required.');
  }

  if (!colourName) {
    setError(errors, `${prefix}.colourName`, 'Colour name is required.');
  } else if (colourName.length > 50) {
    setError(errors, `${prefix}.colourName`, 'Colour name must be at most 50 characters.');
  }

  if (variant.colourHex && !hexPattern.test(variant.colourHex)) {
    setError(errors, `${prefix}.colourHex`, 'Use a valid hex colour.');
  }

  const sizeNames = new Set();
  let hasActiveSize = false;
  (variant.sizes || []).forEach((size, sizeIndex) => {
    const sizePath = `${prefix}.sizes.${sizeIndex}`;
    const sizeName = String(size.name || '').trim().toLowerCase();
    const stock = Number(size.stock);

    if (!sizeName) {
      setError(errors, `${sizePath}.name`, 'Size name is required.');
    } else if (sizeNames.has(sizeName)) {
      setError(errors, `${sizePath}.name`, 'Size names must be unique inside a colour.');
    }
    sizeNames.add(sizeName);

    if (!Number.isInteger(stock) || stock < 0) {
      setError(errors, `${sizePath}.stock`, 'Stock must be a whole number of at least 0.');
    }

    if (size.active !== false) {
      hasActiveSize = true;
    }
  });

  if (variant.active !== false && !hasActiveSize) {
    setError(errors, `${prefix}.sizes`, 'Active colours need at least one active size.');
  }

  (variant.images || []).forEach((image, imageIndex) => {
    const imagePath = `${prefix}.images.${imageIndex}`;
    if (!urlPattern.test(image.url || '')) {
      setError(errors, `${imagePath}.url`, 'Image URL is invalid.');
    }
    if ((activeSubmit || variant.active !== false) && !String(image.alt || '').trim()) {
      setError(errors, `${imagePath}.alt`, 'Image alt text is required before publishing.');
    }
  });

  if (activeSubmit && variant.active !== false && !(variant.images || []).length) {
    setError(errors, `${prefix}.images`, `Add at least one image for ${colourLabel} before publishing.`);
  }

  if ((variant.images || []).length > 5) {
    setError(errors, `${prefix}.images`, 'You can upload a maximum of 5 images for each colour.');
  }
}

export function validateProductForm(form, submitStatus = form.status) {
  const errors = {};
  const activeSubmit = submitStatus === 'active';

  if (String(form.name || '').trim().length < 2 || String(form.name || '').trim().length > 150) {
    setError(errors, 'name', 'Product name must be between 2 and 150 characters.');
  }

  if (form.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugify(form.slug))) {
    setError(errors, 'slug', 'Slug must be lowercase and URL safe.');
  }

  if (!form.mainCategory) {
    setError(errors, 'mainCategory', 'Main category is required.');
  }

  if (!String(form.shortDescription || '').trim()) {
    setError(errors, 'shortDescription', 'Short description is required.');
  }

  if (!String(form.description || '').trim()) {
    setError(errors, 'description', 'Full description is required.');
  }

  const regularPrice = numberValue(form.regularPrice);
  const salePrice = numberValue(form.salePrice);

  if (regularPrice === null || Number.isNaN(regularPrice) || regularPrice < 0) {
    setError(errors, 'regularPrice', 'Regular price must be zero or greater.');
  }

  if (salePrice !== null) {
    if (Number.isNaN(salePrice) || salePrice < 0) {
      setError(errors, 'salePrice', 'Sale price must be zero or greater.');
    } else if (regularPrice !== null && salePrice >= regularPrice) {
      setError(errors, 'salePrice', 'Sale price must be lower than regular price.');
    }
  }

  if (!Array.isArray(form.variants) || !form.variants.length) {
    setError(errors, 'variants', 'At least one colour variant is required.');
  }

  const skus = new Set();
  const colours = new Set();
  let activeVariantCount = 0;

  (form.variants || []).forEach((variant, index) => {
    const sku = String(variant.sku || '').trim().toUpperCase();
    const colour = String(variant.colourName || '').trim().toLowerCase();

    if (sku) {
      if (skus.has(sku)) {
        setError(errors, `variants.${index}.sku`, 'SKUs must be unique inside this product.');
      }
      skus.add(sku);
    }

    if (colour) {
      if (colours.has(colour)) {
        setError(errors, `variants.${index}.colourName`, 'Colour names should be unique inside this product.');
      }
      colours.add(colour);
    }

    if (variant.active !== false) {
      activeVariantCount += 1;
    }

    validateVariant(variant, index, errors, activeSubmit);
  });

  if (activeSubmit && activeVariantCount === 0) {
    setError(errors, 'variants', 'An active product needs at least one active colour.');
  }

  return errors;
}

export function firstErrorPath(errors) {
  return Object.keys(errors)[0] || '';
}
