import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { products as mockProducts } from "../data/products";

const ProductGallery = () => {
  const { isLoggedIn } = useAuth();
  const { totalItems } = useCart();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Cửa hàng
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {mockProducts.length} sản phẩm - Khám phá và mua sắm
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {!isLoggedIn && (
              <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium">
                Đăng nhập để thêm vào giỏ hàng
              </span>
            )}
            {isLoggedIn && totalItems > 0 && (
              <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">
                🛒 {totalItems} sản phẩm trong giỏ
              </span>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* If no products */}
        {mockProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 dark:text-gray-500">
              Chưa có sản phẩm nào.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;
