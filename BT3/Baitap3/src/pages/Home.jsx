import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import '../css/Home.css';

const Home = () => {
  const { products, deleteProduct } = useProduct();
  const { addToCart } = useCart();

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="hero">
        <div className="hero-content">
          
          <h1 className="hero-title">Mua sắm tiện lợi giá tốt</h1>
          <p className="hero-description">
            Khám phá các sản phẩm công nghệ chất lượng cao với giá cả hợp lý
          </p>
          <div className="hero-actions">
            <Link to="/inventory" className="hero-btn hero-btn-secondary">
              <ArrowRight className="w-5 h-5" />
              Khám phá ngay
            </Link>
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="home-grid">
          <div className="home-products">
            <div className="section-header">
              <h2 className="section-title">Sản phẩm nổi bật</h2>
              <span className="product-count">{products.length} sản phẩm</span>
            </div>
            <div className="product-list-home">
              {products.length === 0 ? (
                <div className="empty-products">
                  <p>Chưa có sản phẩm nào.</p>
                </div>
              ) : (
                products.map(product => (
                  <div key={product.id} className="product-item-home">
                    <img
                      src={product.image || `https://picsum.photos/seed/${product.id}/300/200`}
                      alt={product.name}
                      className="product-item-image-home"
                    />
                    <div className="product-item-content-home">
                      <div className="product-item-header">
                        {product.category && (
                          <span className="product-category-badge">{product.category}</span>
                        )}
                        {product.inStock ? (
                          <span className="stock-badge stock-in">Còn hàng</span>
                        ) : (
                          <span className="stock-badge stock-out">Hết hàng</span>
                        )}
                      </div>
                      <h3 className="product-item-name-home">{product.name}</h3>
                      {product.description && (
                        <p className="product-item-desc-home">{product.description}</p>
                      )}
                      <div className="product-item-footer">
                        <div className="product-item-price-home">{formatPrice(product.price)}</div>
                        <div className="product-item-actions-home">
                          <button
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className="action-btn-home cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="action-btn-home delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;