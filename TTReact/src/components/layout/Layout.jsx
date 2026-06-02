import { Outlet, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const Layout = () => {
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  return (
    <div className='app-layout'>
      <header className='header'>
        <div className='logo'>
          <NavLink to='/'>Shop Gallery</NavLink>
        </div>
        <nav className='nav'>
          <NavLink 
            to='/' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Trang chủ
          </NavLink>
          <NavLink 
            to='/products' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Sản phẩm
          </NavLink>
          <NavLink 
            to='/cart' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Giỏ hàng
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
          <NavLink 
            to='/about' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Giới thiệu
          </NavLink>
        </nav>
      </header>
      
      <main className='main-content'>
        <Outlet />
      </main>
      
      <footer className='footer'>
        <p>&copy; 2026 Shop Gallery. Tất cả quyền được bảo lưu.</p>
      </footer>
    </div>
  )
}

export default Layout
