import { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { createCategory } from '../../services/adminCategoryService.js';

const suggestedCategories = ['Western', 'Party Wear', 'Casual Wear', 'Modesty Wear'];

function normalizeCategoryName(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function MainCategoryQuickAdd({ categories, onCategoryCreated, onSelectCategory }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const addCategory = async (categoryName) => {
    const normalizedName = categoryName.trim();

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      toast.error('Category name must be between 2 and 80 characters.');
      return;
    }

    const existingCategory = categories.find(
      (category) => normalizeCategoryName(category.name) === normalizeCategoryName(normalizedName),
    );

    if (existingCategory) {
      onSelectCategory(existingCategory.id);
      setName('');
      toast.success(`${existingCategory.name} is already available and has been selected.`);
      return;
    }

    setSaving(true);
    try {
      const category = await createCategory({
        categoryType: 'main',
        name: normalizedName,
        isActive: true,
        showInNavigation: true,
        showOnHomepage: false,
        isFeatured: false,
      });

      if (!category?.id) {
        throw new Error('The category was created, but its details could not be loaded. Refresh the page before continuing.');
      }

      onCategoryCreated(category);
      onSelectCategory(category.id);
      setName('');
      toast.success(`${category.name} category created and selected.`);
    } catch (error) {
      const message = error.response?.data?.errors?.[0]?.message
        || error.response?.data?.message
        || error.message
        || 'Unable to create category.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="new-main-category" className="sr-only">New main category</label>
        <input
          id="new-main-category"
          type="text"
          value={name}
          maxLength={80}
          placeholder="Type a category, e.g. Ethnic Wear"
          list="suggested-main-categories"
          disabled={saving}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void addCategory(name);
            }
          }}
          className="min-h-11 min-w-0 flex-1 border border-[#DED2C5] bg-[#FFFDF8] px-3 text-sm text-[#302925] outline-none placeholder:text-[#8A7D73] focus-visible:ring-2 focus-visible:ring-[#672F3B]"
          aria-label="Type a new main category"
        />
        <datalist id="suggested-main-categories">
          {suggestedCategories.map((categoryName) => (
            <option key={categoryName} value={categoryName} />
          ))}
        </datalist>
        <button
          type="button"
          disabled={saving || !name.trim()}
          onClick={() => void addCategory(name)}
          className="min-h-11 border border-[#672F3B] px-4 text-sm font-semibold text-[#672F3B] outline-none hover:bg-[#672F3B] hover:text-white focus-visible:ring-2 focus-visible:ring-[#672F3B] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Add category'}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#6F6259]">Quick add:</span>
        {suggestedCategories.map((categoryName) => (
          <button
            key={categoryName}
            type="button"
            disabled={saving}
            onClick={() => void addCategory(categoryName)}
            className="min-h-9 border border-[#DED2C5] bg-[#FAF6EE] px-3 text-xs font-medium text-[#302925] outline-none hover:border-[#672F3B] focus-visible:ring-2 focus-visible:ring-[#672F3B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {categoryName}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#6F6259]">New categories are saved to Category Management and selected for this product.</p>
    </div>
  );
}

MainCategoryQuickAdd.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCategoryCreated: PropTypes.func.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default MainCategoryQuickAdd;
