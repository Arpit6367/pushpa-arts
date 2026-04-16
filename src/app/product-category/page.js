'use client';
import { useState, useEffect } from 'react';
import CategoryCard from '@/components/CategoryCard';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories?active_only=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data.filter(c => !c.parent_id));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <div className="page-banner">
                <h1>Our <span className="gold-accent">Collections</span></h1>
                <div className="gold-line"></div>
                <div className="breadcrumb">
                    <a href="/">Home</a> <span>/</span> <span>Categories</span>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : categories.length > 0 ? (
                        <div className="categories-grid">
                            {categories.map(cat => (
                                <CategoryCard key={cat.id} category={cat} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h3>No categories available</h3>
                            <p>Please add categories from the admin panel.</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
