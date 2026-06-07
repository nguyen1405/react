import { useState } from "react";
import clsx from "clsx";

const navLinks = [
  { label: "Trang chủ", href: "#" },
  { label: "Tính năng", href: "#features" },
  { label: "Bảng giá", href: "#pricing" },
  { label: "Liên hệ", href: "#contact" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              VoiceAI
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Đăng nhập
            </a>
            <a
              href="#pricing"
              className="px-5 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
            >
              Dùng thử miễn phí
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "md:hidden border-t border-gray-200 bg-white transition-all duration-300 overflow-hidden",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
            <a
              href="#"
              className="block px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Đăng nhập
            </a>
            <a
              href="#pricing"
              className="block px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg text-center hover:bg-primary-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dùng thử miễn phí
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
