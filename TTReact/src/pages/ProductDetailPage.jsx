import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm")
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        navigate("/404")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleAddToCart = () => {
    addToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) return <div className="loading">Đang tải chi tiết sản phẩm...</div>
  if (!product) return null

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Quay lại danh sách
      </button>

      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="product-info">
          <span className="category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
          <div className="product-actions">
            <button 
              className={`btn-add-cart ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {addedToCart ? '✓ Đã thêm vào giỏ hàng' : '🛒 Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
