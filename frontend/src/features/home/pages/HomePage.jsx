import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHome } from '../hooks/useHome';
import { useCollections } from '../../collections/hooks/useCollections';
import CategoryCarousel from '../components/CategoryCarousel';
import FeaturedProducts from '../components/FeaturedProducts';
import Collections from '../components/Collections';
import Features from '../components/Features';

const HomePage = () => {
  const { featuredProducts: products, isLoading, error, loadFeaturedProducts } = useHome();
  const { collections, loadCollections } = useCollections();
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    loadFeaturedProducts(4);
    loadCollections();

    // Load categories
    const loadCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();
        if (data.success) {
          const categoriesList = data.data.categories || data.data || [];
          setCategories(categoriesList);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-purple-300">havy</span>
              <span className="text-white">Store</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Khám phá những sản phẩm nội thất đẹp và hiện đại
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors"
              >
                Khám phá ngay
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <CategoryCarousel categories={categories} />

      {/* Featured Products */}
      <FeaturedProducts products={products} isLoading={isLoading} error={error} />

      {/* Collections */}
      <Collections collections={collections} />

      {/* Features */}
      <Features />
    </div>
  );
};

export default HomePage;
