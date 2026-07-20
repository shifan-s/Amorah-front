import { useMemo, useState } from 'react';
import { createEmptyProductForm } from '../utils/productFormDefaults.js';
import { firstErrorPath, validateProductForm } from '../utils/productFormValidation.js';

export default function useProductForm(initialForm) {
  const [form, setForm] = useState(() => initialForm || createEmptyProductForm());
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [newlyUploadedPublicIds, setNewlyUploadedPublicIds] = useState([]);
  const [removedExistingPublicIds, setRemovedExistingPublicIds] = useState([]);

  const productStock = useMemo(
    () =>
      form.variants.reduce(
        (total, variant) =>
          total +
          variant.sizes.reduce((variantTotal, size) => {
            if (variant.active === false || size.active === false) {
              return variantTotal;
            }

            return variantTotal + (Number.parseInt(size.stock, 10) || 0);
          }, 0),
        0,
      ),
    [form.variants],
  );

  const updateForm = (updater) => {
    setDirty(true);
    setForm((current) => (typeof updater === 'function' ? updater(current) : { ...current, ...updater }));
  };

  const validate = (status) => {
    const nextErrors = validateProductForm(form, status);
    setErrors(nextErrors);
    return {
      valid: Object.keys(nextErrors).length === 0,
      firstPath: firstErrorPath(nextErrors),
      errors: nextErrors,
    };
  };

  return {
    form,
    setForm,
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
  };
}
