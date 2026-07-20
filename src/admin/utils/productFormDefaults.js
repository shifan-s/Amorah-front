export const clothingSizes = ['S', 'M', 'L', 'XL', 'XXL'];
export const hijabSizes = ['Free Size'];
export const defaultSizes = [...clothingSizes, ...hijabSizes];

export const productTypeOptions = [
  'Churidar Sets',
  'Partywear',
  'Western Co-ord Sets',
  'Gowns',
  'Knee-Length Tops',
  'Short Tops',
  'Shirts for Girls',
  'Jeans',
  'Jersey Hijabs',
  'Shimmer Hijabs',
  'Georgette Chiffon Hijabs',
];
export const styleOptions = ['Ethnic', 'Western', 'Hijab', 'Partywear', 'Contemporary', 'Casual', 'Occasion'];
export const fabricOptions = ['Cotton', 'Linen', 'Denim', 'Jersey', 'Shimmer', 'Georgette', 'Chiffon', 'Rayon', 'Other'];
export const occasionOptions = ['Everyday', 'Casual', 'Party', 'Festive', 'Occasion', 'Workwear'];

export function createFormKey(prefix = 'key') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptySize(sizeName = '') {
  return {
    key: createFormKey('size'),
    id: '',
    name: sizeName,
    stock: 0,
    active: true,
  };
}

export function createEmptyVariant() {
  return {
    key: createFormKey('variant'),
    id: '',
    sku: '',
    colourName: '',
    colourHex: '',
    images: [],
    sizes: clothingSizes.map(createEmptySize),
    active: true,
    expanded: true,
  };
}

export function createEmptyProductForm() {
  return {
    name: '',
    slug: '',
    skuPrefix: '',
    mainCategory: '',
    subcategory: '',
    productType: '',
    style: '',
    fabric: '',
    occasion: '',
    tags: [],
    tagInput: '',
    shortDescription: '',
    description: '',
    regularPrice: '',
    salePrice: '',
    fabricDetails: '',
    fit: '',
    careInstructions: '',
    metaTitle: '',
    metaDescription: '',
    variants: [createEmptyVariant()],
    status: 'draft',
    featured: false,
    newArrival: false,
    bestSeller: false,
  };
}

export function productToForm(product) {
  const form = createEmptyProductForm();

  return {
    ...form,
    name: product.name || '',
    slug: product.slug || '',
    skuPrefix: product.skuPrefix || '',
    mainCategory: product.mainCategory?.id || '',
    subcategory: product.subcategory?.id || '',
    productType: product.productType || '',
    style: product.style || '',
    fabric: product.fabric || '',
    occasion: product.occasion || '',
    tags: product.tags || [],
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    regularPrice: product.regularPrice ?? '',
    salePrice: product.salePrice ?? '',
    fabricDetails: product.fabricDetails || '',
    fit: product.fit || '',
    careInstructions: product.careInstructions || '',
    metaTitle: product.metaTitle || '',
    metaDescription: product.metaDescription || '',
    status: product.status || 'draft',
    featured: Boolean(product.featured),
    newArrival: Boolean(product.newArrival),
    bestSeller: Boolean(product.bestSeller),
    variants: (product.variants || []).map((variant) => ({
      key: createFormKey('variant'),
      id: variant.id || '',
      sku: variant.sku || '',
      colourName: variant.colourName || '',
      colourHex: variant.colourHex || '',
      images: (variant.images || []).map((image, imageIndex) => ({
        key: createFormKey('image'),
        id: image.id || '',
        url: image.url || '',
        publicId: image.publicId || '',
        alt: image.alt || '',
        sortOrder: image.sortOrder ?? imageIndex,
        isPrimary: Boolean(image.isPrimary),
        existing: true,
      })),
      sizes: (variant.sizes || []).map((size) => ({
        key: createFormKey('size'),
        id: size.id || '',
        name: size.name || '',
        stock: size.stock ?? 0,
        active: size.active !== false,
      })),
      active: variant.active !== false,
      expanded: true,
    })),
  };
}
