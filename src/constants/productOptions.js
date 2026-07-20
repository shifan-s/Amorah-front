export const PRODUCT_TYPES = [
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

export const PRODUCT_STYLES = [
  'Ethnic',
  'Western',
  'Hijab',
  'Partywear',
  'Contemporary',
  'Casual',
  'Occasion',
];

export const PRODUCT_FABRICS = [
  'Cotton',
  'Linen',
  'Denim',
  'Jersey',
  'Shimmer',
  'Georgette',
  'Chiffon',
  'Rayon',
  'Other',
];

export const PRODUCT_OCCASIONS = [
  'Everyday',
  'Casual',
  'Party',
  'Festive',
  'Occasion',
  'Workwear',
];

export const CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
export const HIJAB_SIZES = ['Free Size'];
export const PRODUCT_SIZES = [...CLOTHING_SIZES, ...HIJAB_SIZES];

export const CLIENT_CATALOGUE = [
  {
    name: 'Ethnic Wear',
    slug: 'ethnic-wear',
    subcategories: [
      { name: 'Churidar Sets', slug: 'churidar-sets' },
      { name: 'Partywear', slug: 'partywear' },
      { name: 'Gowns', slug: 'gowns' },
    ],
  },
  {
    name: 'Western Wear',
    slug: 'western-wear',
    subcategories: [
      { name: 'Western Co-ord Sets', slug: 'western-co-ord-sets' },
      { name: 'Knee-Length Tops', slug: 'knee-length-tops' },
      { name: 'Short Tops', slug: 'short-tops' },
      { name: 'Shirts for Girls', slug: 'shirts-for-girls' },
      { name: 'Jeans', slug: 'jeans' },
    ],
  },
  {
    name: 'Hijabs',
    slug: 'hijabs',
    subcategories: [
      { name: 'Jersey Hijabs', slug: 'jersey-hijabs' },
      { name: 'Shimmer Hijabs', slug: 'shimmer-hijabs' },
      { name: 'Georgette Chiffon Hijabs', slug: 'georgette-chiffon-hijabs' },
    ],
  },
];
