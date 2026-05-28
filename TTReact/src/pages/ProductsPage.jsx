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
        console.error('Loi khi lay san pham:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <div className='loading'>Dang tai san pham...</div>

  return (
    <div className='products-page'>
      <h1>Danh sach san pham</h1>
      <div className='products-grid'>
        {products.map((product) => (
          <Link to={/products/} key={product.id} className='product-card'>
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p className='price'></p>
            <span className='category'>{product.category}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductsPage
