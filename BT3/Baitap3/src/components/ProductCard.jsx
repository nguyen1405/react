import { ShoppingCart, Star, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../css/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        {!product.inStock && (
          <div className="product-out-of-stock-overlay">
            <span className="out-of-stock-badge">Hết hàng</span>
          </div>
        )}
        {product.category && (
          <span className="product-category-badge">{product.category}</span>
        )}
      </div>
      
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <span className="product-price">{formatPrice(product.price)}</span>
          <div className="product-rating">
            <Star className="rating-star" />
            <span className="rating-text">{product.rating}</span>
          </div>
        </div>
        
        <div className="product-stock">
          {product.inStock ? (
            <CheckCircle className="stock-icon stock-in" />
          ) : (
            <XCircle className="stock-icon stock-out" />
          )}
          <span className={`stock-text ${product.inStock ? 'stock-in' : 'stock-out'}`}>
            {product.inStock ? 'Còn hàng' : 'Hết hàng'}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`add-to-cart-btn ${isAdded ? 'btn-success' : product.inStock ? 'btn-primary' : ''}`}
        >
          {isAdded ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Đã thêm vào giỏ hàng
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Thêm vào giỏ hàng
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;