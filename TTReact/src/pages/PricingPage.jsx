import { useState } from "react";
import clsx from "clsx";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Dành cho cá nhân mới bắt đầu",
    features: ["1.000 ký tự/ngày", "2 giọng đọc", "Tốc độ tiêu chuẩn", "Hỗ trợ email"],
    limitations: ["Không có API", "Không thể tải MP3"],
    cta: "Bắt đầu miễn phí",
    popular: false,
  },
  {
    name: "Pro",
    price: 199000,
    description: "Dành cho content creator và team nhỏ",
    features: [
      "50.000 ký tự/ngày",
      "10 giọng đọc",
      "Tốc độ cao",
      "API access",
      "Tải MP3",
      "Hỗ trợ 24/7",
    ],
    limitations: [],
    cta: "Dùng thử 7 ngày miễn phí",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 999000,
    description: "Dành cho doanh nghiệp với nhu cầu lớn",
    features: [
      "Không giới hạn ký tự",
      "Tất cả giọng đọc",
      "Tốc độ ưu tiên",
      "API không giới hạn",
      "Custom voice",
      "SLA cam kết",
      "Quản lý team",
    ],
    limitations: [],
    cta: "Liên hệ tư vấn",
    popular: false,
  },
];

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN");
};

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const getEffectivePrice = (basePrice) => {
    if (basePrice === 0) return 0;
    if (isYearly) {
      return Math.round(basePrice * 0.8);
    }
    return basePrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Chọn gói phù hợp
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Đơn giản, minh bạch. Bắt đầu miễn phí, nâng cấp khi cần.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span
            className={clsx(
              "text-sm font-medium",
              !isYearly ? "text-gray-900" : "text-gray-500"
            )}
          >
            Tháng
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={clsx(
              "relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300",
              isYearly ? "bg-blue-600" : "bg-gray-300"
            )}
          >
            <span
              className={clsx(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300",
                isYearly ? "translate-x-8" : "translate-x-1"
              )}
            />
          </button>
          <span
            className={clsx(
              "text-sm font-medium",
              isYearly ? "text-gray-900" : "text-gray-500"
            )}
          >
            Năm
          </span>
          {isYearly && (
            <Badge variant="success" size="sm">
              Giảm 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 items-start">
          {plans.map((plan) => {
            const effectivePrice = getEffectivePrice(plan.price);

            return (
              <Card
                key={plan.name}
                hover
                className={clsx(
                  "relative p-8",
                  plan.popular &&
                    "border-2 border-blue-500 md:scale-105 shadow-xl z-10"
                )}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge variant="popular" size="md">
                      🔥 PHỔ BIẾN NHẤT
                    </Badge>
                  </div>
                )}

                {/* Plan Name */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  {effectivePrice === 0 ? (
                    <span className="text-4xl font-bold text-gray-900">Miễn phí</span>
                  ) : (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(effectivePrice)}
                      </span>
                      <span className="text-gray-500">đ</span>
                      <span className="text-sm text-gray-500">/ tháng</span>
                    </div>
                  )}
                  {isYearly && effectivePrice > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      Thanh toán {formatPrice(effectivePrice * 12)}đ / năm
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Bao gồm
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✅</span>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-3 mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Không bao gồm
                    </p>
                    <ul className="space-y-3">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start gap-3">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">❌</span>
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
