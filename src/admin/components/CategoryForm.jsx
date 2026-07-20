import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

const emptyForm = {
  categoryType: 'main',
  name: '',
  slug: '',
  description: '',
  parent: '',
  imageUrl: '',
  imageAlt: '',
  isFeatured: false,
  showOnHomepage: false,
  showInNavigation: true,
  displayOrder: 0,
  isActive: true,
};

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categoryToForm(category) {
  if (!category) {
    return emptyForm;
  }

  return {
    categoryType: category.level === 1 ? 'subcategory' : 'main',
    name: category.name || '',
    slug: category.slug || '',
    description: category.description || '',
    parent: category.parent?.id || '',
    imageUrl: category.image?.url || '',
    imageAlt: category.image?.alt || '',
    isFeatured: Boolean(category.isFeatured),
    showOnHomepage: Boolean(category.showOnHomepage),
    showInNavigation: Boolean(category.showInNavigation),
    displayOrder: category.displayOrder || 0,
    isActive: Boolean(category.isActive),
  };
}

function validateForm(form, mainCategories) {
  const nextErrors = {};

  if (form.name.trim().length < 2 || form.name.trim().length > 80) {
    nextErrors.name = 'Name must be between 2 and 80 characters.';
  }

  if (form.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) {
    nextErrors.slug = 'Slug must use lowercase letters, numbers and hyphens.';
  }

  if (form.description.length > 500) {
    nextErrors.description = 'Description must be at most 500 characters.';
  }

  if (form.categoryType === 'subcategory') {
    if (!form.parent) {
      nextErrors.parent = 'Choose a main category.';
    } else if (!mainCategories.some((category) => category.id === form.parent)) {
      nextErrors.parent = 'Parent must be an active main category.';
    }
  }

  if (form.imageUrl && !/^https?:\/\/.+/i.test(form.imageUrl)) {
    nextErrors.imageUrl = 'Image URL must start with http:// or https://.';
  }

  if (form.imageUrl && !form.imageAlt.trim()) {
    nextErrors.imageAlt = 'Image alt text is required when an image URL exists.';
  }

  if (!Number.isInteger(Number(form.displayOrder)) || Number(form.displayOrder) < 0) {
    nextErrors.displayOrder = 'Display order must be a whole number of at least 0.';
  }

  return nextErrors;
}

function CategoryForm({ mode, category, mainCategories, saving, backendErrors, onSubmit }) {
  const [form, setForm] = useState(() => categoryToForm(category));
  const [errors, setErrors] = useState({});
  const activeMainCategories = useMemo(
    () => mainCategories.filter((item) => item.level === 0 && item.isActive && item.id !== category?.id),
    [category?.id, mainCategories],
  );

  const updateField = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === 'categoryType' && value === 'main') {
        next.parent = '';
        next.showOnHomepage = current.showOnHomepage;
      }

      if (field === 'categoryType' && value === 'subcategory') {
        next.showOnHomepage = false;
      }

      if (field === 'name' && !current.slug) {
        next.slug = slugify(value);
      }

      return next;
    });
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form, activeMainCategories);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    const payload = {
      categoryType: form.categoryType,
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim(),
      parent: form.categoryType === 'subcategory' ? form.parent : undefined,
      isFeatured: form.isFeatured,
      showOnHomepage: form.categoryType === 'main' ? form.showOnHomepage : false,
      showInNavigation: form.showInNavigation,
      displayOrder: Number(form.displayOrder),
      isActive: form.isActive,
    };

    if (form.imageUrl.trim()) {
      payload.image = {
        url: form.imageUrl.trim(),
        publicId: '',
        alt: form.imageAlt.trim(),
      };
    }

    onSubmit(payload);
  };

  const fieldError = (field) => errors[field] || backendErrors[field];
  const isSubcategory = form.categoryType === 'subcategory';

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <div className="grid gap-5 border border-[#DED2C5] bg-[#FFFDF8] p-5 md:grid-cols-2">
        <div>
          <label htmlFor="category-type">Category Type</label>
          <select
            id="category-type"
            value={form.categoryType}
            onChange={(event) => updateField('categoryType', event.target.value)}
          >
            <option value="main">Main Category</option>
            <option value="subcategory">Subcategory</option>
          </select>
        </div>
        <div>
          <label htmlFor="category-name">Name</label>
          <input id="category-name" value={form.name} onChange={(event) => updateField('name', event.target.value)} />
          {fieldError('name') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('name')}</p> : null}
        </div>
        <div>
          <label htmlFor="category-slug">Slug</label>
          <input id="category-slug" value={form.slug} onChange={(event) => updateField('slug', slugify(event.target.value))} />
          {fieldError('slug') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('slug')}</p> : null}
        </div>
        <div>
          <label htmlFor="category-parent">Parent Category</label>
          <select
            id="category-parent"
            value={form.parent}
            onChange={(event) => updateField('parent', event.target.value)}
            disabled={!isSubcategory}
          >
            <option value="">No parent</option>
            {activeMainCategories.map((mainCategory) => (
              <option key={mainCategory.id} value={mainCategory.id}>
                {mainCategory.name}
              </option>
            ))}
          </select>
          {fieldError('parent') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('parent')}</p> : null}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="category-description">Description</label>
          <textarea
            id="category-description"
            rows="4"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
          />
          {fieldError('description') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('description')}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 border border-[#DED2C5] bg-[#FFFDF8] p-5 md:grid-cols-2">
        <div>
          <label htmlFor="category-image-url">Image URL</label>
          <input
            id="category-image-url"
            value={form.imageUrl}
            onChange={(event) => updateField('imageUrl', event.target.value)}
            placeholder="https://..."
          />
          {fieldError('imageUrl') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('imageUrl')}</p> : null}
        </div>
        <div>
          <label htmlFor="category-image-alt">Image Alt Text</label>
          <input id="category-image-alt" value={form.imageAlt} onChange={(event) => updateField('imageAlt', event.target.value)} />
          {fieldError('imageAlt') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('imageAlt')}</p> : null}
        </div>
        <p className="text-sm text-[#6F6259] md:col-span-2">Direct image upload will be available after media integration.</p>
        {form.imageUrl && /^https?:\/\/.+/i.test(form.imageUrl) ? (
          <div className="md:col-span-2">
            <img src={form.imageUrl} alt={form.imageAlt || 'Category preview'} className="h-40 w-full border border-[#DED2C5] object-cover" />
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 border border-[#DED2C5] bg-[#FFFDF8] p-5 md:grid-cols-2">
        <label className="mb-0 flex items-center gap-3">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => updateField('isFeatured', event.target.checked)} />
          Featured
        </label>
        <label className="mb-0 flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.showOnHomepage}
            disabled={isSubcategory}
            onChange={(event) => updateField('showOnHomepage', event.target.checked)}
          />
          Show on Homepage
        </label>
        <label className="mb-0 flex items-center gap-3">
          <input type="checkbox" checked={form.showInNavigation} onChange={(event) => updateField('showInNavigation', event.target.checked)} />
          Show in Navigation
        </label>
        <label className="mb-0 flex items-center gap-3">
          <input type="checkbox" checked={form.isActive} onChange={(event) => updateField('isActive', event.target.checked)} />
          Active
        </label>
        <div>
          <label htmlFor="category-display-order">Display Order</label>
          <input
            id="category-display-order"
            type="number"
            min="0"
            value={form.displayOrder}
            onChange={(event) => updateField('displayOrder', event.target.value)}
          />
          {fieldError('displayOrder') ? <p className="mt-2 text-sm text-amorah-error">{fieldError('displayOrder')}</p> : null}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={saving}
          className="min-h-11 bg-[#672F3B] px-6 text-sm font-semibold text-white outline-none hover:bg-[#302925] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[#672F3B] focus-visible:ring-offset-2"
        >
          {saving ? 'Saving...' : mode === 'edit' ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}

CategoryForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  category: PropTypes.object,
  mainCategories: PropTypes.arrayOf(PropTypes.object).isRequired,
  saving: PropTypes.bool,
  backendErrors: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

CategoryForm.defaultProps = {
  backendErrors: {},
};

export default CategoryForm;
