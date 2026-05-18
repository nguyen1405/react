import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../css/Cart.css';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <ShoppingCart className="cart-empty-icon" />
            <h2 className="cart-empty-title">Giỏ hàng trống</h2>
            <p className="cart-empty-text">Hãy thêm sản phẩm vào giỏ hàng</p>
            <Link to="/" className="cart-continue-btn">
              <ArrowLeft className="w-4 h-4" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          <span className="cart-count">{getCartCount()} sản phẩm</span>
        </div>

        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image || `https://picsum.photos/seed/${item.id}/100/100`}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-price">{formatPrice(item.price)}</p>
              </div>
              <div className="cart-item-quantity">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="qty-btn"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="qty-btn"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="cart-item-subtotal">
                {formatPrice(item.price * item.quantity)}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="cart-item-remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <button onClick={clearCart} className="cart-clear-btn">
            <Trash2 className="w-4 h-4" />
            Xóa tất cả
          </button>
          <div className="cart-total">
            <span className="cart-total-label">Tổng cộng:</span>
            <span className="cart-total-price">{formatPrice(getCartTotal())}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
