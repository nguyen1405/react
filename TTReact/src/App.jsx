import Header from './components/Header'
import ProductList from './components/ProductList'
import { products } from './data/products'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <h2>Danh sách sản phẩm</h2>
        <ProductList products={products} />
      </main>
    </div>
  )
}

export default App