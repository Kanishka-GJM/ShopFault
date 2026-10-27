import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, ImageOff } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProduct } = useShop();
  const [imageError, setImageError] = useState(false);

  // BUG E02: For product #4 ("AeroGlide Precision Ergonomic Mouse"), image is broken.
  const isBugE02Product = product.id === 4;

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      {/* Product Image Container */}
      <div className="product-image-container">
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        {isBugE02Product || imageError ? (
          // BUG E02: Broken product image rendered without fallback for designated product #4
          <div className="broken-image-placeholder" title="Image failed to load">
            <ImageOff size={38} className="broken-image-icon" />
            <span className="broken-image-text">Image Not Found (404)</span>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {/* Hover Quick View Overlay */}
        <div className="product-image-overlay">
          <button 
            className="quick-view-btn"
            onClick={() => setSelectedProduct(product)}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="product-content">
        <div className="product-category-row">
          <span className="product-category-tag">{product.category}</span>
          <div className="product-rating">
            <Star size={13} className="star-icon filled" />
            <span className="rating-score">{product.rating}</span>
            <span className="rating-count">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 
          className="product-title"
          onClick={() => setSelectedProduct(product)}
        >
          {product.name}
        </h3>

        <p className="product-short-desc">
          {product.description.slice(0, 80)}...
        </p>

        <div className="product-card-footer">
          <div className="price-container">
            <span className="price-symbol">₹</span>
            <span className="price-amount">{product.price.toLocaleString('en-IN')}</span>
          </div>

          {/* Add to Cart button */}
          {/* Note: Clicking does NOT immediately update navBadgeCount (BUG E03),
              and rapid clicking creates duplicate cart lines (BUG H05) */}
          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(product, 1)}
            id={`btn-add-to-cart-${product.id}`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
