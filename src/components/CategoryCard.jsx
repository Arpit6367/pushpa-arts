import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/product-category/${category.slug_path || category.slug}`} className="category-card reveal" id={`category-${category.id}`}>

      <div 
        className="category-card-image" 
        style={{ 
          backgroundImage: category.image ? `url(${category.image})` : 'none'
        }}
      >
        {!category.image && <div className="no-image">Artistic Texture</div>}
      </div>
      <div className="category-card-overlay">
        <p className="category-card-count">Discovery Collection</p>
        <h3>{category.name}</h3>
        <span className="category-card-link">Shop Collection</span>
      </div>
    </Link>
  );
}
