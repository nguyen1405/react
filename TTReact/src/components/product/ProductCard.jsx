import '../../css/ProductCard.css'

const ProductCard = ({ name, price, category, rating, inStock, image }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        {!inStock && <span className="badge-out-of-stock">Hết hàng</span>}
        {rating >= 4.7 && <span className="badge-hot">⭐ Hot</span>}
      </div>
      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price.toLocaleString("vi-VN")}đ</p>
        <div className="product-rating">⭐ {rating}</div>
      </div>
    </div>
  );
};

export default ProductCard;