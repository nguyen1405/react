import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const LandingPage = () => (
  <>
    {/* Hero Section */}
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 dark:bg-primary-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 dark:bg-purple-700/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          Performance Hooks &{" "}
          <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Custom Hooks
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Tối ưu hiệu năng React với <strong>useMemo</strong>,{" "}
          <strong>useCallback</strong>, <strong>useRef</strong> và tạo{" "}
          <strong>Custom Hook</strong> tái sử dụng. Áp dụng vào dự án Shop
          Gallery hoàn chỉnh.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop">
            <Button variant="primary" size="lg">
              🚀 Xem demo Shop Gallery
            </Button>
          </Link>
          <a href="#shop-demo">
            <Button variant="ghost" size="lg">
              Tìm hiểu thêm ↓
            </Button>
          </a>
        </div>
      </div>
    </section>

    {/* Shop Demo CTA */}
    <section id="shop-demo" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-primary-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              🛒 Shop Gallery
            </h2>
            <p className="mt-4 text-base sm:text-lg text-primary-100 max-w-2xl mx-auto">
              Search debounce, Filter danh mục, Sort giá, Phân trang, Giỏ hàng, Đăng nhập
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
                >
                  🚀 Khám phá ngay
                </Button>
              </Link>
              <Link to="/cart">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  🛒 Xem giỏ hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default LandingPage;
