import PropTypes from 'prop-types';

function ProductCategorySection({ form, errors, mainCategories, subcategories, updateField }) {
  return (
    <section className="grid gap-5 border border-[#DED2C5] bg-[#FFFDF8] p-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold text-[#302925]">Category</h2>
        <p className="mt-1 text-sm text-[#6F6259]">Subcategories are filtered using the selected main category.</p>
      </div>
      <div>
        <label htmlFor="main-category">Main Category</label>
        <select id="main-category" value={form.mainCategory} onChange={(event) => updateField('mainCategory', event.target.value)}>
          <option value="">Select main category</option>
          {mainCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.mainCategory ? <p className="mt-2 text-sm text-amorah-error">{errors.mainCategory}</p> : null}
      </div>
      <div>
        <label htmlFor="subcategory">Subcategory</label>
        <select id="subcategory" value={form.subcategory} onChange={(event) => updateField('subcategory', event.target.value)} disabled={!form.mainCategory}>
          <option value="">No subcategory</option>
          {subcategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

ProductCategorySection.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  mainCategories: PropTypes.arrayOf(PropTypes.object).isRequired,
  subcategories: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateField: PropTypes.func.isRequired,
};

export default ProductCategorySection;
