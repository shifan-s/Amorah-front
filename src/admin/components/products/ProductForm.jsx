import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteUploadedImage } from '../../services/adminUploadService.js';
import { mapApiFieldErrors } from '../../services/adminProductService.js';
import useProductForm from '../../hooks/useProductForm.js';
import { buildProductPayload } from '../../utils/productPayload.js';
import ProductBasicInfoSection from './ProductBasicInfoSection.jsx';
import ProductCategorySection from './ProductCategorySection.jsx';
import ProductDetailsSection from './ProductDetailsSection.jsx';
import ProductFlagsSection from './ProductFlagsSection.jsx';
import ProductFormActions from './ProductFormActions.jsx';
import ProductPricingSection from './ProductPricingSection.jsx';
import ProductVariantManager from './ProductVariantManager.jsx';

function currentPublicIds(form) {
  return new Set(form.variants.flatMap((variant) => variant.images.map((image) => image.publicId).filter(Boolean)));
}

async function deletePublicIds(publicIds, warningMessage) {
  const uniqueIds = [...new Set(publicIds.filter(Boolean))];
  if (!uniqueIds.length) return;

  const results = await Promise.allSettled(uniqueIds.map((publicId) => deleteUploadedImage(publicId)));
  if (results.some((result) => result.status === 'rejected')) {
    toast.error(warningMessage);
  }
}

function ProductForm({ mode, initialForm, categories, saving, onSubmit, onArchive }) {
  const navigate = useNavigate();
  const {
    form,
    updateForm,
    errors,
    setErrors,
    dirty,
    setDirty,
    productStock,
    validate,
    newlyUploadedPublicIds,
    setNewlyUploadedPublicIds,
    removedExistingPublicIds,
    setRemovedExistingPublicIds,
  } = useProductForm(initialForm);
  const [uploadPending, setUploadPending] = useState(false);

  const mainCategories = useMemo(() => categories.filter((category) => category.level === 0 && category.isActive), [categories]);
  const subcategories = useMemo(
    () => categories.filter((category) => category.level === 1 && category.isActive && category.parent?.id === form.mainCategory),
    [categories, form.mainCategory],
  );
  const archived = form.status === 'archived';

  useEffect(() => {
    if (!dirty) return undefined;

    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => {
    if (form.subcategory && !subcategories.some((category) => category.id === form.subcategory)) {
      updateForm({ subcategory: '' });
    }
  }, [form.subcategory, subcategories, updateForm]);

  const updateField = (field, value) => {
    updateForm((current) => {
      const next = { ...current, [field]: value };
      if (field === 'mainCategory') {
        const compatible = categories.some((category) => category.id === current.subcategory && category.parent?.id === value);
        if (!compatible) next.subcategory = '';
      }
      return next;
    });
  };

  const addTag = (value) => {
    const tag = String(value || '').trim().toLowerCase();
    if (!tag) return;

    updateForm((current) => ({
      ...current,
      tagInput: '',
      tags: [...new Set([...current.tags, tag])].slice(0, 20),
    }));
  };

  const removeTag = (tag) => {
    updateForm((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }));
  };

  const expandFirstError = (firstPath) => {
    if (!firstPath.startsWith('variants.')) return;
    const variantIndex = Number(firstPath.split('.')[1]);
    updateForm((current) => ({
      ...current,
      variants: current.variants.map((variant, index) => ({ ...variant, expanded: index === variantIndex ? true : variant.expanded })),
    }));
  };

  const scrollToFirstError = () => {
    requestAnimationFrame(() => {
      const errorNode = document.querySelector('.text-amorah-error');
      errorNode?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const submit = async (status) => {
    if (saving) {
      return;
    }

    if (uploadPending) {
      toast.error('Finish image uploads before saving.');
      return;
    }

    const result = validate(status);
    if (!result.valid) {
      expandFirstError(result.firstPath);
      scrollToFirstError();
      toast.error('Please fix the highlighted fields.');
      return;
    }

    const payload = buildProductPayload(form, status);

    try {
      await onSubmit(payload);
      const savedIds = currentPublicIds(form);
      const removedNewPublicIds = newlyUploadedPublicIds.filter((publicId) => !savedIds.has(publicId));
      await deletePublicIds(removedNewPublicIds, 'Product saved, but a removed new upload could not be deleted.');
      await deletePublicIds(removedExistingPublicIds, 'Product saved, but an unused previous image could not be deleted.');
      setNewlyUploadedPublicIds([]);
      setRemovedExistingPublicIds([]);
      setDirty(false);
    } catch (error) {
      setErrors((current) => ({ ...current, ...mapApiFieldErrors(error) }));
      throw error;
    }
  };

  const cancel = async () => {
    if (dirty && !window.confirm('Discard unsaved product changes?')) {
      return;
    }

    if (newlyUploadedPublicIds.length && window.confirm('Delete newly uploaded unsaved images before leaving?')) {
      await deletePublicIds(newlyUploadedPublicIds, 'Some unsaved uploaded images could not be deleted.');
    }

    navigate('/admin/products');
  };

  if (mode === 'edit') {
    return (
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        {archived ? (
          <div className="border border-[#DED2C5] bg-[#FAF6EE] p-4 text-sm text-[#6F6259]">
            This product is archived. Change the product status before saving if it should return to the storefront.
          </div>
        ) : null}
        <ProductBasicInfoSection form={form} errors={errors} updateField={updateField} addTag={addTag} removeTag={removeTag} simplified />
        <ProductVariantManager
          form={form}
          errors={errors}
          updateForm={updateForm}
          setNewlyUploadedPublicIds={setNewlyUploadedPublicIds}
          setRemovedExistingPublicIds={setRemovedExistingPublicIds}
          onUploadStateChange={setUploadPending}
        />
        <ProductPricingSection form={form} errors={errors} updateField={updateField} />
        <ProductFlagsSection form={form} updateField={updateField} productStock={productStock} showMarketingFlags={false} />
        <ProductDetailsSection form={form} errors={errors} updateField={updateField} includeDiscoveryFields includeMarketingFlags />
        <ProductFormActions
          mode={mode}
          status={form.status}
          productStock={productStock}
          saving={saving}
          uploadPending={uploadPending}
          archived={archived}
          onSaveDraft={() => submit('draft')}
          onPublish={() => submit('active')}
          onSaveChanges={() => submit(form.status)}
          onArchive={onArchive}
          onCancel={cancel}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="grid gap-6">
        {archived ? (
          <div className="border border-[#DED2C5] bg-[#FAF6EE] p-4 text-sm text-[#6F6259]">
            This product is archived. Move it back to draft from the product list before normal editing.
          </div>
        ) : null}
        <ProductBasicInfoSection form={form} errors={errors} updateField={updateField} addTag={addTag} removeTag={removeTag} />
        <ProductCategorySection form={form} errors={errors} mainCategories={mainCategories} subcategories={subcategories} updateField={updateField} />
        <ProductPricingSection form={form} errors={errors} updateField={updateField} />
        <ProductDetailsSection form={form} updateField={updateField} />
        <ProductVariantManager
          form={form}
          errors={errors}
          updateForm={updateForm}
          setNewlyUploadedPublicIds={setNewlyUploadedPublicIds}
          setRemovedExistingPublicIds={setRemovedExistingPublicIds}
          onUploadStateChange={setUploadPending}
        />
        <ProductFlagsSection form={form} updateField={updateField} productStock={productStock} />
      </div>
      <ProductFormActions
        mode={mode}
        status={form.status}
        productStock={productStock}
        saving={saving}
        uploadPending={uploadPending}
        archived={archived}
        onSaveDraft={() => submit('draft')}
        onPublish={() => submit('active')}
        onArchive={onArchive}
        onCancel={cancel}
      />
    </div>
  );
}

ProductForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  initialForm: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  saving: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onArchive: PropTypes.func,
};

export default ProductForm;
