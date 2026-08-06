import PropTypes from 'prop-types';
import Accordion from '../common/Accordion.jsx';

function fabricDescription(fabric, details) {
  const values = [fabric, details].map((value) => String(value || '').trim()).filter(Boolean);
  if (values.length < 2) return values[0] || '';

  const [fabricName, fabricDetails] = values;
  const normalizedName = fabricName.toLowerCase();
  const normalizedDetails = fabricDetails.toLowerCase();

  if (normalizedDetails.includes(normalizedName)) return fabricDetails;
  if (normalizedName.includes(normalizedDetails)) return fabricName;
  return `${fabricName}. ${fabricDetails}`;
}

function ProductInformation({ product }) {
  const items = [
    {
      title: 'Product Details',
      content: product.description,
    },
    product.fabric || product.fabricDetails ? {
      title: 'Fabric and Feel',
      content: fabricDescription(product.fabric, product.fabricDetails),
    } : null,
    product.fit ? {
      title: 'Fit',
      content: product.fit,
    } : null,
    product.productType && product.occasion && product.style ? {
      title: 'Style Notes',
      content: `${product.productType} styled for ${product.occasion.toLowerCase()} dressing with a ${product.style.toLowerCase()} mood.`,
    } : null,
    product.careInstructions ? {
      title: 'Care',
      content: product.careInstructions,
    } : null,
    {
      title: 'Shipping and Returns',
      content: 'Review the latest shipping and return policy pages before checkout. Final delivery totals are calculated by Amorah during checkout.',
    },
  ].filter(Boolean);

  return <Accordion items={items} className="mt-6" />;
}

ProductInformation.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductInformation;
