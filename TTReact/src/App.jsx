import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import PricingPage from './pages/PricingPage'
import NotFoundPage from './pages/NotFoundPage'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='products' element={<ProductsPage />} />
        <Route path='products/:id' element={<ProductDetailPage />} />
        <Route path='cart' element={<CartPage />} />
        <Route path='pricing' element={<PricingPage />} />
        <Route path='about' element={<AboutPage />} />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
