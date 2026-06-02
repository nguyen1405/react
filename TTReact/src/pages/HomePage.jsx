import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products?limit=4')
        const data = await res.json()
        setFeaturedProducts(data)
      } catch (err) {
        console.error('Lỗi:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Chào mừng đến Shop Gallery</h1>
        <p>Khám phá bộ sưu tập sản phẩm chất lượng cao với giá tốt nhất</p>
        <Link to="/products" className="btn-primary">
          Khám phá ngay →
        </Link>
      </section>

      <section className="featured">
        <h2>Sản phẩm nổi bật</h2>
        <p>Được khách hàng yêu thích nhất</p>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
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
        )}

        <div className="featured-cta">
          <Link to="/products" className="btn-secondary">
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
