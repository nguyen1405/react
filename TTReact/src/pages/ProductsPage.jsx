import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>

  return (
    <div className="products-page">
      <h1>Danh sách sản phẩm</h1>
      <div className="products-grid">
        {products.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id} className="product-card">
            <div className="product-card-image">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="product-card-info">
              <h3>{product.title}</h3>
              <p className="price">${product.price.toFixed(2)}</p>
              <span className="category">{product.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductsPage
