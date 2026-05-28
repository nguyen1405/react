import { Outlet, NavLink } from 'react-router-dom'

const Layout = () => {
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
            Trang chu
          </NavLink>
          <NavLink 
            to='/products' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            San pham
          </NavLink>
          <NavLink 
            to='/cart' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Gio hang
          </NavLink>
          <NavLink 
            to='/about' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Gioi thieu
          </NavLink>
        </nav>
      </header>
      
      <main className='main-content'>
        <Outlet />
      </main>
      
      <footer className='footer'>
        <p>&copy; 2026 Shop Gallery. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
