import Link from 'next/link';

export default function ProductCard({ product }) {
  const imageUrl = product.primary_image || product.first_image;

  return (
    <Link href={`/product-category/${product.category_slug || 'uncategorized'}/${product.slug}`} className="product-card reveal" id={`product-${product.id}`}>
      <div className="product-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="no-image">Artistic Photography</div>
        )}
        <div className="product-card-hover-overlay">
          <span className="view-detail-btn">View Details</span>
        </div>
      </div>
      <div className="product-card-info">
        {product.category_name && (
          <span className="product-card-category">{product.category_name}</span>
        )}
        <h3 className="product-card-name">{product.name}</h3>
      </div>
    </Link>
  );
}
