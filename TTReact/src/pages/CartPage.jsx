import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Giỏ hàng</h1>
        <div className="cart-empty">
          <p>Giỏ hàng của bạn đang trống.</p>
          <Link to="/products" className="btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Giỏ hàng</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-quantity">
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button 
                className="cart-item-remove"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Tạm tính:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Phí vận chuyển:</span>
            <span>Miễn phí</span>
          </div>
          <div className="cart-summary-row total">
            <span>Tổng cộng:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <button className="btn-checkout">Thanh toán</button>
          <button className="btn-clear" onClick={clearCart}>
            Xóa tất cả
          </button>
        </div>
      </div>

      <div className="cart-actions">
        <Link to="/products" className="btn-secondary">
          ← Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  )
}

export default CartPage
