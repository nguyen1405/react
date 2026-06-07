import Header from "./components/Header";
import PricingPage from "./components/PricingPage";
import Button from "./components/ui/Button";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Biến văn bản thành{" "}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              giọng nói tự nhiên
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
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

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 VoiceAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
