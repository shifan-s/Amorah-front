import PropTypes from 'prop-types';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { deleteUploadedImage, uploadProductImages } from '../../services/adminUploadService.js';
import { createEmptySize, createEmptyVariant, createFormKey } from '../../utils/productFormDefaults.js';
import { slugify } from '../../utils/productPayload.js';
import ProductVariantCard from './ProductVariantCard.jsx';

const maxImagesPerColour = 3;

function reorder(items, index, direction) {
  const next = [...items];
  const target = index + direction;

  if (target < 0 || target >= next.length) {
    return next;
  }

  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function normalizePrimary(images) {
  if (!images.length) return images;

  if (!images.some((image) => image.isPrimary)) {
    return images.map((image, index) => ({ ...image, isPrimary: index === 0, sortOrder: index }));
  }

  let primaryFound = false;
  return images.map((image, index) => {
    if (image.isPrimary && !primaryFound) {
      primaryFound = true;
      return { ...image, sortOrder: index };
    }
    return { ...image, isPrimary: false, sortOrder: index };
  });
}

function ProductVariantManager({
  form,
  errors,
  updateForm,
  setNewlyUploadedPublicIds,
  setRemovedExistingPublicIds,
  onUploadStateChange,
}) {
  const updateVariants = (updater) => {
    updateForm((current) => ({ ...current, variants: updater(current.variants) }));
  };

  const addVariant = () => updateVariants((variants) => [...variants.map((variant) => ({ ...variant, expanded: false })), createEmptyVariant()]);
  const toggleVariant = (variantIndex) =>
    updateVariants((variants) => variants.map((variant, index) => (index === variantIndex ? { ...variant, expanded: !variant.expanded } : variant)));
  const removeVariant = (variantIndex) =>
    updateVariants((variants) => {
      const removed = variants[variantIndex];
      const existingPublicIds = (removed.images || []).filter((image) => image.existing && image.publicId).map((image) => image.publicId);
      const newPublicIds = (removed.images || []).filter((image) => !image.existing && image.publicId).map((image) => image.publicId);
      if (existingPublicIds.length) setRemovedExistingPublicIds((ids) => [...ids, ...existingPublicIds]);
      if (newPublicIds.length) {
        Promise.allSettled(newPublicIds.map((publicId) => deleteUploadedImage(publicId))).then((results) => {
          if (results.some((result) => result.status === 'rejected')) {
            toast.error('A removed unsaved image could not be deleted.');
          }
        });
        setNewlyUploadedPublicIds((ids) => ids.filter((publicId) => !newPublicIds.includes(publicId)));
      }
      return variants.filter((_, index) => index !== variantIndex);
    });
  const moveVariant = (variantIndex, direction) => updateVariants((variants) => reorder(variants, variantIndex, direction));
  const updateVariant = (variantIndex, field, value) =>
    updateVariants((variants) => variants.map((variant, index) => (index === variantIndex ? { ...variant, [field]: value } : variant)));

  const addImages = (variantIndex, images) =>
    updateVariants((variants) =>
      variants.map((variant, index) => {
        if (index !== variantIndex) return variant;
        if (variant.images.length + images.length > maxImagesPerColour) {
          toast.error('Each colour can contain a maximum of three images.');
          return variant;
        }
        const usedPoses = new Set(variant.images.map((image) => image.pose));
        const missingPoses = ['front', 'side', 'back'].filter((pose) => !usedPoses.has(pose));
        const mappedImages = images.map((image, imageIndex) => ({
          ...image,
          pose: missingPoses[imageIndex],
          key: createFormKey('image'),
          sortOrder: variant.images.length + imageIndex,
          isPrimary: variant.images.length === 0 && imageIndex === 0,
          existing: false,
        }));
        setNewlyUploadedPublicIds((ids) => [...ids, ...mappedImages.map((image) => image.publicId).filter(Boolean)]);
        return { ...variant, images: normalizePrimary([...variant.images, ...mappedImages]) };
      }),
    );

  const changeImage = (variantIndex, imageIndex, field, value) =>
    updateVariants((variants) =>
      variants.map((variant, index) => {
        if (index !== variantIndex) return variant;
        if (field === 'move') {
          return { ...variant, images: normalizePrimary(reorder(variant.images, imageIndex, value)) };
        }
        if (field === 'isPrimary') {
          const selected = variant.images[imageIndex];
          const reorderedImages = [selected, ...variant.images.filter((_, index) => index !== imageIndex)];
          return { ...variant, images: normalizePrimary(reorderedImages.map((image, index) => ({ ...image, isPrimary: index === 0 }))) };
        }
        const images = variant.images.map((image, index) => {
          return index === imageIndex ? { ...image, [field]: value } : image;
        });
        return { ...variant, images: normalizePrimary(images) };
      }),
    );

  const removeImage = (variantIndex, imageIndex) =>
    updateVariants((variants) =>
      variants.map((variant, index) => {
        if (index !== variantIndex) return variant;
        const removed = variant.images[imageIndex];
        const colourName = variant.colourName || `colour ${variantIndex + 1}`;
        const confirmed = window.confirm(`Delete this image from ${colourName}? Save the product to permanently remove existing Cloudinary images.`);

        if (!confirmed) {
          return variant;
        }

        if (removed?.publicId) {
          if (removed.existing) setRemovedExistingPublicIds((ids) => [...ids, removed.publicId]);
          else {
            deleteUploadedImage(removed.publicId).catch(() => toast.error('The removed unsaved image could not be deleted.'));
            setNewlyUploadedPublicIds((ids) => ids.filter((publicId) => publicId !== removed.publicId));
          }
        }
        return { ...variant, images: normalizePrimary(variant.images.filter((_, index) => index !== imageIndex)) };
      }),
    );

  const replaceImage = async (variantIndex, imageIndex, file) => {
    const variant = form.variants[variantIndex];
    const currentImage = variant?.images?.[imageIndex];

    if (!variant || !currentImage || !file) {
      return { ok: false, message: 'Choose an image to replace this preview.' };
    }

    onUploadStateChange(true);

    try {
      const altPrefix = currentImage.alt || `Amorah ${form.name || 'product'} in ${variant.colourName || 'this colour'}`;
      const result = await uploadProductImages([file], slugify(`${form.name}-${variant.colourName}`), altPrefix);

      if (result.failures.length) {
        const failed = result.failures[0];
        const detail = failed.errors?.[0];
        const reason = failed.message || (typeof detail === 'string' ? detail : 'the upload failed');
        return { ok: false, message: `Image could not be replaced because ${reason}.` };
      }

      const uploadedImage = result.uploadedImages[0];
      if (!uploadedImage) {
        return { ok: false, message: 'Image could not be replaced. Please try again.' };
      }

      const replacement = {
        ...uploadedImage,
        key: createFormKey('image'),
        alt: uploadedImage.alt || currentImage.alt,
        pose: currentImage.pose,
        sortOrder: imageIndex,
        isPrimary: Boolean(currentImage.isPrimary),
        existing: false,
      };

      updateVariants((variants) =>
        variants.map((item, index) => {
          if (index !== variantIndex) return item;
          const images = item.images.map((image, index) => (index === imageIndex ? replacement : image));
          return { ...item, images: normalizePrimary(images) };
        }),
      );

      if (currentImage.publicId) {
        if (currentImage.existing) {
          setRemovedExistingPublicIds((ids) => [...ids, currentImage.publicId]);
        } else {
          deleteUploadedImage(currentImage.publicId).catch(() => toast.error('The replaced unsaved image could not be deleted.'));
          setNewlyUploadedPublicIds((ids) => ids.filter((publicId) => publicId !== currentImage.publicId));
        }
      }

      if (replacement.publicId) {
        setNewlyUploadedPublicIds((ids) => [...ids, replacement.publicId]);
      }

      return { ok: true, message: 'Image replaced.' };
    } finally {
      onUploadStateChange(false);
    }
  };

  const changeSize = (variantIndex, sizeIndex, field, value) =>
    updateVariants((variants) =>
      variants.map((variant, index) => {
        if (index !== variantIndex) return variant;
        return {
          ...variant,
          sizes: variant.sizes.map((size, index) => (index === sizeIndex ? { ...size, [field]: value } : size)),
        };
      }),
    );
  const addSize = (variantIndex, name) =>
    updateVariants((variants) => variants.map((variant, index) => (index === variantIndex ? { ...variant, sizes: [...variant.sizes, createEmptySize(name)] } : variant)));
  const replaceSizes = (variantIndex, sizeNames) => {
    const confirmed = window.confirm(
      'Replace this colour size matrix? Existing size stock values for this colour will be removed. Continue only after recording current stock.',
    );

    if (!confirmed) {
      return;
    }

    updateVariants((variants) =>
      variants.map((variant, index) =>
        index === variantIndex ? { ...variant, sizes: sizeNames.map(createEmptySize) } : variant,
      ),
    );
  };
  const removeSize = (variantIndex, sizeIndex) =>
    updateVariants((variants) => variants.map((variant, index) => (index === variantIndex ? { ...variant, sizes: variant.sizes.filter((_, index) => index !== sizeIndex) } : variant)));

  return (
    <div className="grid gap-6">
      <section className="grid gap-5 border border-[#DED2C5] bg-[#FAF6EE] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#302925]">Product Colours</h2>
            <p className="mt-1 text-sm text-[#6F6259]">
              Add the available colours and upload images that belong to each colour.
            </p>
          </div>
          <button type="button" onClick={addVariant} className="inline-flex min-h-11 items-center gap-2 bg-[#672F3B] px-4 text-sm font-semibold text-white">
            <FiPlus aria-hidden="true" />
            Add Colour
          </button>
        </div>
        {errors.variants ? <p className="text-sm text-amorah-error">{errors.variants}</p> : null}
        {form.variants.map((variant, index) => (
          <ProductVariantCard
            key={variant.key}
            form={form}
            variant={variant}
            variantIndex={index}
            variantCount={form.variants.length}
            errors={errors}
            onUpdate={updateVariant}
            onToggle={toggleVariant}
            onRemove={removeVariant}
            onMove={moveVariant}
            onImagesUploaded={addImages}
            onImageChange={changeImage}
            onImageRemove={removeImage}
            onImageReplace={replaceImage}
            onSizeChange={changeSize}
            onSizeAdd={addSize}
            onSizeRemove={removeSize}
            onSizePresetReplace={replaceSizes}
            onUploadStateChange={onUploadStateChange}
          />
        ))}
      </section>
    </div>
  );
}

ProductVariantManager.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  setNewlyUploadedPublicIds: PropTypes.func.isRequired,
  setRemovedExistingPublicIds: PropTypes.func.isRequired,
  onUploadStateChange: PropTypes.func.isRequired,
};

export default ProductVariantManager;
