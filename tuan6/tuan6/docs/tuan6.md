# Tuần 6: Styling chuyên sâu với TailwindCSS & Component Patterns

> **Mục tiêu:** Xây dựng giao diện đẹp, responsive chuyên nghiệp bằng TailwindCSS. Học cách tổ chức style component có thể tái sử dụng.

---

## 📚 1. Học gì? (Theory)

### 1.1 Setup TailwindCSS trong Vite

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Quét tất cả file trong src
  ],
  theme: {
    extend: {
      // Thêm màu sắc / font tùy chỉnh vào đây
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

```css
/* src/index.css - Thêm 3 dòng này vào đầu */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 1.2 Các nhóm class Tailwind quan trọng nhất

```jsx
// --- LAYOUT ---
<div className="flex items-center justify-between gap-4">
<div className="flex flex-col md:flex-row">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// --- SIZING & SPACING ---
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="h-screen min-h-[500px]">
<div className="p-4 py-8 px-6 mt-4 mb-2 space-y-4">

// --- TYPOGRAPHY ---
<h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
<p className="text-sm text-gray-500 truncate">
<span className="text-blue-600 hover:text-blue-800 underline">

// --- COLORS & BACKGROUNDS ---
<div className="bg-white dark:bg-gray-900">
<div className="bg-gradient-to-r from-blue-500 to-purple-600">
<div className="bg-blue-50 border border-blue-200">

// --- BORDERS & SHADOWS ---
<div className="rounded-xl border border-gray-200 shadow-md hover:shadow-lg">
<input className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">

// --- TRANSITIONS & ANIMATIONS ---
<button className="transition-all duration-300 ease-in-out transform hover:scale-105">
<div className="animate-spin animate-pulse animate-bounce">

// --- STATES ---
<button className="
  bg-blue-600 text-white
  hover:bg-blue-700          /* hover state */
  active:bg-blue-800         /* click state */
  focus:outline-none focus:ring-2 focus:ring-blue-500  /* focus state */
  disabled:opacity-50 disabled:cursor-not-allowed      /* disabled state */
  transition-colors duration-200
">
```

---

### 1.3 Responsive Design với Breakpoints

```jsx
// Mobile-first: Viết style cho mobile → thêm breakpoint cho màn lớn hơn
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px

// Product Grid - responsive
<div className="
  grid
  grid-cols-1      /* Mobile: 1 cột */
  sm:grid-cols-2   /* ≥640px: 2 cột */
  lg:grid-cols-3   /* ≥1024px: 3 cột */
  xl:grid-cols-4   /* ≥1280px: 4 cột */
  gap-4 md:gap-6
">

// Typography responsive
<h1 className="
  text-2xl         /* Mobile */
  md:text-3xl      /* Tablet */
  lg:text-4xl      /* Desktop */
  font-bold
">

// Hidden/Visible theo màn hình
<nav className="hidden md:flex"> {/* Ẩn mobile, hiện từ tablet */}
<button className="md:hidden"> {/* Hamburger menu - chỉ mobile */}
```

---

### 1.4 Conditional Classes - Xử lý class động

```jsx
// Cách 1: Template literal (dùng khi ít điều kiện)
const Button = ({ variant = "primary", disabled, children }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Cách 2: Dùng thư viện clsx/cn (khuyên dùng - tránh string rối)
import clsx from "clsx";
// npm install clsx

const Button = ({ variant = "primary", size = "md", disabled, children }) => (
  <button
    className={clsx(
      "font-medium rounded-lg transition-colors",
      {
        "px-3 py-1.5 text-sm": size === "sm",
        "px-4 py-2 text-base": size === "md",
        "px-6 py-3 text-lg": size === "lg",
      },
      {
        "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
        "bg-gray-100 text-gray-800 hover:bg-gray-200": variant === "secondary",
        "bg-red-600 text-white hover:bg-red-700": variant === "danger",
      },
      disabled && "opacity-50 cursor-not-allowed pointer-events-none"
    )}
    disabled={disabled}
  >
    {children}
  </button>
);
```

---

### 1.5 Xây dựng Design System - Component UI tái dùng

```jsx
// src/components/ui/Badge.jsx
const Badge = ({ children, variant = "default", size = "md" }) => {
  return (
    <span className={clsx(
      "inline-flex items-center font-medium rounded-full",
      {
        "px-2 py-0.5 text-xs": size === "sm",
        "px-2.5 py-0.5 text-sm": size === "md",
      },
      {
        "bg-gray-100 text-gray-700": variant === "default",
        "bg-green-100 text-green-700": variant === "success",
        "bg-red-100 text-red-700": variant === "error",
        "bg-yellow-100 text-yellow-700": variant === "warning",
        "bg-blue-100 text-blue-700": variant === "info",
      }
    )}>
      {children}
    </span>
  );
};

// src/components/ui/Input.jsx
const Input = ({ label, error, helperText, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={clsx(
          "w-full px-3 py-2 border rounded-lg text-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "transition-colors duration-200",
          error
            ? "border-red-500 focus:ring-red-500 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

---

### 1.6 Dark Mode với Tailwind

```js
// tailwind.config.js
export default {
  darkMode: "class", // Toggle bằng class "dark" trên <html>
  // ...
};
```

```jsx
// Toggle Dark Mode
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle("dark", newValue);
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-lg">
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

// Sử dụng dark: prefix
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
<p className="text-gray-600 dark:text-gray-400">Nội dung</p>
```

---

## 🛠 2. Thực hành gì?

1. Setup TailwindCSS vào project Shop Gallery từ tuần 5.
2. Tạo component `Button` với 4 variants: `primary`, `secondary`, `danger`, `ghost`.
3. Tạo component `Card` tái sử dụng với shadow và hover effect.
4. Build lại `Header` với navigation responsive (hamburger menu mobile).

---

## 🏗️ 3. Bài thực hành tuần 6

**Yêu cầu: Clone giao diện "Pricing Page" chuyên nghiệp**

```jsx
// Dữ liệu plans
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
    popular: true, // Nổi bật nhất
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
```

**Yêu cầu UI:**
1. Layout 3 cột trên desktop, 1 cột trên mobile.
2. Plan "Pro" nổi bật: phóng to nhẹ (`scale-105`), màu nền khác, badge "🔥 PHỔ BIẾN NHẤT".
3. Danh sách features có icon ✅ và limitations có icon ❌.
4. Giá format: "199.000đ / tháng".
5. Toggle chuyển đổi billing "Tháng" / "Năm" (giảm 20% khi chọn Năm).
6. Hover effect trên card: `hover:shadow-xl transition-shadow`.

**Tiêu chí đánh giá:**
- Giao diện đẹp, cân đối, không bị vỡ layout.
- Responsive tốt trên mobile.
- Toggle billing hoạt động đúng giá.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| TailwindCSS Docs | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Tailwind UI Components | [tailwindui.com](https://tailwindui.com) (tham khảo không mua) |
| clsx | [github.com/lukeed/clsx](https://github.com/lukeed/clsx) |

---
> ⏱️ **Ước tính:** 3-4 ngày | 🎯 **Tiêu chí:** Tự tạo được Pricing Page đẹp không cần template.
