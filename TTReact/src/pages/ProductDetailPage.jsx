import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!res.ok) throw new Error("Khong tim thay san pham")
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

  if (loading) return <div className="loading">Dang tai chi tiet san pham...</div>
  if (!product) return null

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate(-1)} className="btn-back">
        Quay lai danh sach
      </button>

      <div className="product-detail">
        <img src={product.image} alt={product.title} />
        <div className="product-info">
          <span className="category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          <button className="btn-add-cart">Them vao gio hang</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
