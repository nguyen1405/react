import { Link, useLocation } from 'react-router-dom';
import { Package, Home, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../css/Header.css';

const Header = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Package className="w-6 h-6" />
          </div>
          <span className="logo-text">BlueShop</span>
        </Link>

        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'nav-link-active' : 'nav-link-inactive'}`}
          >
            <Home className="w-4 h-4" />
            <span className="font-medium">Trang chủ</span>
          </Link>
          <Link
            to="/inventory"
            className={`nav-link ${isActive('/inventory') ? 'nav-link-active' : 'nav-link-inactive'}`}
          >
            <Package className="w-4 h-4" />
            <span className="font-medium">Kho sản phẩm</span>
          </Link>
          <Link
            to="/cart"
            className={`nav-link cart-link ${isActive('/cart') ? 'nav-link-active' : 'nav-link-inactive'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;