import React, { useState } from 'react';
import { X, Star, ShoppingCart, Check, Shield, Truck, RotateCcw, ImageOff } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!selectedProduct) return null;

  const isBugE02Product = selectedProduct.id === 4;

  const handleAddToCart = () => {
    addToCart(selectedProduct, Math.max(1, quantity));
    setSelectedProduct(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
      <div 
        className="product-detail-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button 
          className="modal-close-btn"
          onClick={() => setSelectedProduct(null)}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-grid">
          {/* Image Column */}
          <div className="modal-image-col">
            {isBugE02Product || imageError ? (
              <div className="modal-broken-image-box">
                <ImageOff size={48} className="broken-image-icon" />
                <p>Asset loading failed (404 Not Found)</p>
              </div>
            ) : (
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="modal-product-image"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Details Column */}
          <div className="modal-info-col">
            <span className="modal-category-tag">{selectedProduct.category}</span>
            <h2 className="modal-title">{selectedProduct.name}</h2>

            <div className="modal-rating-row">
              <div className="stars-wrapper">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={`star-icon ${i < Math.floor(selectedProduct.rating) ? 'filled' : ''}`} 
                  />
                ))}
              </div>
              <span className="modal-rating-val">{selectedProduct.rating} / 5</span>
              <span className="modal-reviews-txt">({selectedProduct.reviewsCount} customer reviews)</span>
            </div>

            <div className="modal-price-box">
              <span className="modal-price">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
              <span className="modal-stock-status">
                <Check size={14} /> In Stock ({selectedProduct.stock} units)
              </span>
            </div>

            <p className="modal-description">{selectedProduct.description}</p>

            {/* Feature Specs */}
            {selectedProduct.specs && (
              <div className="modal-specs-list">
                <h4>Product Highlights</h4>
                <ul>
                  {selectedProduct.specs.map((spec, idx) => (
                    <li key={idx}>
                      <span className="spec-bullet">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="modal-actions-area">
              <div className="quantity-counter">
                <button 
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>

              <button 
                className="modal-add-btn"
                onClick={handleAddToCart}
                id="modal-add-to-cart-btn"
              >
                <ShoppingCart size={17} />
                <span>Add to Cart — ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="modal-trust-row">
              <div className="trust-item">
                <Truck size={15} />
                <span>Express Delivery</span>
              </div>
              <div className="trust-item">
                <Shield size={15} />
                <span>Brand Warranty</span>
              </div>
              <div className="trust-item">
                <RotateCcw size={15} />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
