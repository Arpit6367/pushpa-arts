import Link from 'next/link';

export default function ProductCard({ product }) {
  const imageUrl = product.primary_image || product.first_image;

  return (
    <Link href={`/products/${product.slug}`} className="product-card" id={`product-${product.id}`}>
      <div className="product-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="no-image">Artistic Photography</div>
        )}
      </div>
      <div className="product-card-info">
        {product.category_name && (
          <div className="product-card-category">{product.category_name}</div>
        )}
        <h3 className="product-card-name">{product.name}</h3>
      </div>
    </Link>
  );
}
