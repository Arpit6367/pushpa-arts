import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="category-card" id={`category-${category.id}`}>
      <div 
        className="category-card-image" 
        style={{ 
          backgroundImage: category.image ? `url(${category.image})` : 'none'
        }}
      >
        {!category.image && <div className="no-image">Artistic Texture</div>}
      </div>
      <div className="category-card-overlay">
        <h3>{category.name}</h3>
        {category.description && (
          <p>{category.description}</p>
        )}
      </div>
    </Link>
  );
}
