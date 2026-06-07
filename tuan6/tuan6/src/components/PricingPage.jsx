import { useState } from "react";
import clsx from "clsx";
import Card from "./ui/Card";
import Button from "./ui/Button";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    description: "Dành cho cá nhân mới bắt đầu",
    features: [
      "1.000 ký tự/ngày",
      "2 giọng đọc",
      "Tốc độ tiêu chuẩn",
      "Hỗ trợ email",
    ],
    limitations: ["Không có API", "Không thể tải MP3"],
    cta: "Bắt đầu miễn phí",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 199000,
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
    monthlyPrice: 999000,
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

  const getPrice = (monthlyPrice) => {
    if (monthlyPrice === 0) return 0;
    if (isYearly) return Math.round(monthlyPrice * 0.8);
    return monthlyPrice;
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Bảng giá đơn giản, minh bạch
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Chọn gói phù hợp với nhu cầu của bạn. Bắt đầu miễn phí, nâng cấp
            bất cứ lúc nào.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={clsx(
              "text-sm font-medium transition-colors",
              !isYearly ? "text-gray-900" : "text-gray-400"
            )}
          >
            Tháng
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={clsx(
              "relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
              isYearly ? "bg-primary-600" : "bg-gray-300"
            )}
            role="switch"
            aria-checked={isYearly}
            aria-label="Chuyển đổi giữa thanh toán theo tháng và năm"
          >
            <span
              className={clsx(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                isYearly ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
          <span
            className={clsx(
              "text-sm font-medium transition-colors",
              isYearly ? "text-gray-900" : "text-gray-400"
            )}
          >
            Năm
          </span>
          {isYearly && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              Tiết kiệm 20%
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan) => {
            const price = getPrice(plan.monthlyPrice);

            return (
              <Card
                key={plan.name}
                hover
                padding="none"
                className={clsx(
                  "relative flex flex-col transition-all duration-300",
                  plan.popular
                    ? "border-2 border-primary-500 shadow-xl md:scale-105 z-10"
                    : "border-gray-200"
                )}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary-600 text-white shadow-lg whitespace-nowrap">
                      🔥 PHỔ BIẾN NHẤT
                    </span>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Plan Name */}
                  <h3
                    className={clsx(
                      "text-lg font-semibold",
                      plan.popular ? "text-primary-600" : "text-gray-900"
                    )}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 mb-6">
                    <div className="flex items-baseline gap-1">
                      {price === 0 ? (
                        <span className="text-4xl font-extrabold text-gray-900">
                          Miễn phí
                        </span>
                      ) : (
                        <>
                          <span className="text-4xl font-extrabold text-gray-900 tabular-nums">
                            {formatPrice(price)}
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            đ/tháng
                          </span>
                        </>
                      )}
                    </div>
                    {isYearly && price > 0 && (
                      <p className="mt-1 text-xs text-gray-400">
                        Thanh toán{" "}
                        <span className="font-semibold text-gray-600">
                          {formatPrice(price * 12)}
                        </span>
                        đ/năm
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    className="w-full mb-8"
                  >
                    {plan.cta}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Bao gồm
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm text-gray-700"
                        >
                          <span className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-green-100">
                            <svg
                              className="w-2.5 h-2.5 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-3">
                          Không bao gồm
                        </p>
                        <ul className="space-y-2.5">
                          {plan.limitations.map((limitation) => (
                            <li
                              key={limitation}
                              className="flex items-start gap-2.5 text-sm text-gray-400"
                            >
                              <span className="mt-0.5 flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-red-50">
                                <svg
                                  className="w-2.5 h-2.5 text-red-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingPage;
