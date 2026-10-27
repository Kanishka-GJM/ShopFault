import React, { useState } from 'react';
import { Search, SlidersHorizontal, Filter, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function CatalogPage() {
  const { products } = useShop();

  // Search input state
  const [searchInput, setSearchInput] = useState('');
  
  // Committed search query that actually filters products
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sorting state: 'featured' | 'price-asc' | 'price-desc' | 'rating'
  const [sortBy, setSortBy] = useState('featured');

  // BUG E01: Search button failure
  // When clicking the "Search" button, results do NOT update!
  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    // BUG E01: Intentionally fails to commit searchInput to activeSearchQuery.
    // Displayed product list remains unchanged.
    console.warn('[ShopFault Search] Search button clicked, filter dispatch missed.');
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearchQuery('');
  };

  // Filter & Sort Logic
  const getProcessedProducts = () => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter(p => {
        // BUG M01: Incorrect category filtering!
        // Selecting "Accessories" omits valid product #8 ("Artisan Genuine Leather Laptop Sleeve")
        if (selectedCategory === 'Accessories') {
          return p.category === 'Accessories' && p.id !== 8;
        }
        return p.category === selectedCategory;
      });
    }

    // Active Search Query filter (matches against activeSearchQuery, which BUG E01 fails to update on button click)
    if (activeSearchQuery.trim() !== '') {
      const q = activeSearchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sorting logic
    if (sortBy === 'price-asc') {
      // BUG M05: Incorrect price sorting!
      // Sorts prices alphabetically as strings instead of numerically:
      // "1299" comes before "799"
      list.sort((a, b) => a.price.toString().localeCompare(b.price.toString()));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  const displayedProducts = getProcessedProducts();

  return (
    <div className="catalog-page">
      {/* Clean, authentic e-commerce store banner */}
      <section className="catalog-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Official Electronics & Gear</span>
          <h1 className="hero-title">Curated Tech Essentials & Hardware</h1>
          <p className="hero-subtitle">
            Premium mechanical keyboards, studio-grade audio monitors, and desk accessories for creators and engineers.
          </p>
        </div>
      </section>

      {/* Control Bar: Search, Category Filters, Sort */}
      <section className="catalog-controls-container">
        {/* Search Bar */}
        <form className="search-bar-form" onSubmit={handleSearchButtonClick}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Search keyboards, headphones, chargers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              id="product-search-input"
            />
            {searchInput && (
              <button 
                type="button" 
                className="clear-search-btn" 
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* BUG E01: Search button fails to update search results when clicked */}
          <button 
            type="submit" 
            className="search-submit-btn" 
            id="search-submit-btn"
            onClick={handleSearchButtonClick}
          >
            Search
          </button>
        </form>

        {/* Filter & Sort Controls Row */}
        <div className="filters-sort-row">
          {/* Category Tabs: note the "4" pill badge has been removed as requested */}
          <div className="category-tabs" role="tablist">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                id={`cat-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="sort-dropdown-wrapper">
            <SlidersHorizontal size={15} className="sort-icon" />
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <select 
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured Collection</option>
              {/* BUG M05: Price Low to High sorts lexicographically */}
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="catalog-grid-section">
        <div className="results-header-row">
          <span className="results-count">
            Showing <strong>{displayedProducts.length}</strong> products
          </span>
          {selectedCategory !== 'All' && (
            <span className="active-filter-indicator">
              Category: <strong>{selectedCategory}</strong>
            </span>
          )}
        </div>

        {displayedProducts.length === 0 ? (
          <div className="no-results-box">
            <Filter size={36} className="no-results-icon" />
            <h3>No products found</h3>
            <p>Try resetting your search query or selecting a different category.</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSearchInput('');
                setActiveSearchQuery('');
                setSortBy('featured');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="product-grid" id="catalog-product-grid">
            {displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
