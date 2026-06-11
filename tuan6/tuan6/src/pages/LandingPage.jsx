import { Link } from "react-router-dom";
import PricingPage from "../components/PricingPage";
import Button from "../components/ui/Button";

const LandingPage = () => (
  <>
    {/* Hero Section */}
    <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
          Biến văn bản thành{" "}
          <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            giọng nói tự nhiên
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Công cụ chuyển text-to-speech hàng đầu Việt Nam. Đa giọng đọc,
          chất lượng studio, tích hợp API dễ dàng.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg">
            Dùng thử miễn phí
          </Button>
          <Button variant="ghost" size="lg">
            Xem demo →
          </Button>
        </div>
      </div>
    </section>

    {/* Pricing Section */}
    <PricingPage />

    {/* Link to tuan7 */}
    <div className="text-center pb-16 px-4">
      <div className="inline-flex items-center gap-3 px-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-200 dark:border-primary-800">
        <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">
          👉 Xem bài tập Tuần 7 — Shop Gallery (Auth + Context + Cart)
        </span>
        <Link
          to="/shop"
          className="px-3 py-1 text-xs font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Mở
        </Link>
      </div>
    </div>
  </>
);

export default LandingPage;
