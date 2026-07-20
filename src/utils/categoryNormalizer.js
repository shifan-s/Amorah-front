import { imageAssets } from '../data/imageAssets.js';

export const categoryFallbackImage = imageAssets.editImages.cottonDresses;

export function normalizeCategory(category = {}) {
  const image = category.image?.url
    ? {
        url: category.image.url,
        publicId: category.image.publicId || '',
        alt: category.image.alt || category.name || 'Amorah category',
      }
    : null;

  return {
    id: category.id || category._id || '',
    name: category.name || '',
    slug: category.slug || '',
    description: category.description || '',
    parent: category.parent || null,
    level: Number(category.level) || 0,
    image,
    isFeatured: Boolean(category.isFeatured),
    showOnHomepage: Boolean(category.showOnHomepage ?? category.showOnHome),
    showOnHome: Boolean(category.showOnHomepage ?? category.showOnHome),
    showInNavigation: Boolean(category.showInNavigation),
    displayOrder: Number(category.displayOrder) || 0,
    isActive: category.isActive !== false,
    children: [],
  };
}

export function sortCategories(categories = []) {
  return [...categories].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return a.name.localeCompare(b.name);
  });
}

export function attachSubcategories(categories = []) {
  const normalized = categories.map(normalizeCategory);
  const byId = new Map(normalized.map((category) => [category.id, { ...category, children: [] }]));
  const roots = [];

  normalized.forEach((category) => {
    const current = byId.get(category.id);
    const parentId = category.parent?.id;

    if (category.level === 1 && parentId && byId.has(parentId)) {
      byId.get(parentId).children.push(current);
      return;
    }

    if (category.level === 0) {
      roots.push(current);
    }
  });

  roots.forEach((category) => {
    category.children = sortCategories(category.children);
  });

  return sortCategories(roots);
}
