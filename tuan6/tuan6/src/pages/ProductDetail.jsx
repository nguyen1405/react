import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import Button from "../components/ui/Button";
import { products } from "../data/products";

const formatPrice = (price) =>
  price.toLocaleString("vi-VN") + "đ";

const ProductDetail = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Không tìm thấy sản phẩm</p>
          <Link to="/shop" className="mt-2 inline-block text-sm text-primary-600 hover:underline">
            ← Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) return;
    addItem(product);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400 dark:text-gray-500">
          <Link to="/shop" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Cửa hàng
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <span className="inline-block w-fit px-3 py-1 text-xs font-semibold bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
              {product.category}
            </span>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            <p className="mt-4 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 tabular-nums">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500">đ</span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {isLoggedIn ? (
                <Button variant="primary" size="lg" onClick={handleAddToCart} className="w-full sm:w-auto">
                  Thêm vào giỏ hàng
                </Button>
              ) : (
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full">
                    Đăng nhập để mua
                  </Button>
                </Link>
              )}
              <Link to="/shop">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  ← Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
