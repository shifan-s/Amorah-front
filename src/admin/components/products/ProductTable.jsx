import PropTypes from 'prop-types';
import { FiArchive, FiEdit2, FiExternalLink, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminTable from '../AdminTable.jsx';
import StatusBadge from '../StatusBadge.jsx';
import ProductStatusBadge from './ProductStatusBadge.jsx';
import { formatINR } from '../../../utils/currency.js';

const columns = ['Image', 'Product', 'SKU', 'Main Category', 'Subcategory', 'Regular', 'Sale', 'Stock', 'Status', 'Flags', 'Updated', 'Actions'];

function primaryImage(product) {
  const activeVariant = product.variants?.find((variant) => variant.active) || product.variants?.[0];
  return activeVariant?.images?.find((image) => image.isPrimary) || activeVariant?.images?.[0];
}

function skuText(product) {
  const skus = (product.variants || []).map((variant) => variant.sku).filter(Boolean);
  if (!skus.length) return '-';
  if (skus.length === 1) return skus[0];
  return `${skus[0]} +${skus.length - 1}`;
}

function ProductTable({ products, onStatusChange, onArchive, onDelete }) {
  return (
    <AdminTable columns={columns}>
      {products.map((product) => {
        const image = primaryImage(product);
        return (
          <tr key={product.id} className="bg-white">
            <td className="px-4 py-4">
              {image?.url ? (
                <img src={image.url} alt={image.alt || product.name} className="h-14 w-12 object-cover" />
              ) : (
                <div className="grid h-14 w-12 place-items-center border border-[#DED2C5] bg-[#F3ECE3] text-xs text-[#6F6259]">None</div>
              )}
            </td>
            <td className="px-4 py-4">
              <p className="font-semibold text-[#302925]">{product.name}</p>
              <p className="text-xs text-[#6F6259]">{product.slug}</p>
            </td>
            <td className="px-4 py-4">{skuText(product)}</td>
            <td className="px-4 py-4">{product.mainCategory?.name || '-'}</td>
            <td className="px-4 py-4">{product.subcategory?.name || '-'}</td>
            <td className="px-4 py-4">{formatINR(product.regularPrice)}</td>
            <td className="px-4 py-4">{product.salePrice ? formatINR(product.salePrice) : '-'}</td>
            <td className="px-4 py-4">{product.totalStock ?? 0}</td>
            <td className="px-4 py-4">
              <ProductStatusBadge status={product.status} />
            </td>
            <td className="px-4 py-4">
              <div className="flex flex-wrap gap-1">
                {product.featured ? <StatusBadge tone="featured">Featured</StatusBadge> : null}
                {product.newArrival ? <StatusBadge tone="active">New</StatusBadge> : null}
                {product.bestSeller ? <StatusBadge tone="warning">Best</StatusBadge> : null}
                {!product.featured && !product.newArrival && !product.bestSeller ? '-' : null}
              </div>
            </td>
            <td className="px-4 py-4">{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-IN') : '-'}</td>
            <td className="px-4 py-4">
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/products/${product.id}/edit`} className="grid h-10 w-10 place-items-center border border-[#DED2C5]" aria-label={`Edit ${product.name}`}>
                  <FiEdit2 aria-hidden="true" />
                </Link>
                {product.status === 'active' ? (
                  <a href={`/product/${product.slug}`} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center border border-[#DED2C5]" aria-label={`View ${product.name} on storefront`}>
                    <FiExternalLink aria-hidden="true" />
                  </a>
                ) : null}
                {product.status === 'active' ? (
                  <button type="button" onClick={() => onStatusChange(product, 'draft')} className="min-h-10 border border-[#DED2C5] px-3 text-xs font-semibold">
                    Draft
                  </button>
                ) : (
                  <button type="button" onClick={() => onStatusChange(product, 'active')} className="min-h-10 border border-[#DED2C5] px-3 text-xs font-semibold">
                    Activate
                  </button>
                )}
                <button type="button" onClick={() => onArchive(product)} className="grid h-10 w-10 place-items-center border border-[#DED2C5] text-[#672F3B]" aria-label={`Archive ${product.name}`}>
                  <FiArchive aria-hidden="true" />
                </button>
                <button type="button" onClick={() => onDelete(product)} className="grid h-10 w-10 place-items-center border border-[#DED2C5] text-red-700" aria-label={`Delete ${product.name} permanently`}>
                  <FiTrash2 aria-hidden="true" />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </AdminTable>
  );
}

ProductTable.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProductTable;
