import ProductCard from './ProductCard';
import '../css/ProductList.css';

const ProductList = ({ products, title, emptyMessage = "Không có sản phẩm nào" }) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {title && (
        <h2 className="product-list-title">{title}</h2>
      )}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;