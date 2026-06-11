# TailwindCSS Cheatsheet & Deep Dive

> Dành cho React + Vite. Áp dụng cho dự án tuan6.

---

## 1. Setup nhanh (đã có trong project)

```bash
# Cài đặt
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# tailwind.config.js
content: ["./index.html", "./src/**/*.{js,jsx}"]

# index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 2. Mental Model: Cách đọc class Tailwind

```
{breakpoint}:  {modifier}-{property}-{value}
    ↑              ↑         ↑        ↑
  sm/md/lg     hover/      w/p/m/    số/color/
               focus/      text/     size/
               active/     bg/       rem
               dark/       border/
```

**Ví dụ:** `md:hover:bg-blue-600`
- `md:` → áp dụng từ 768px trở lên
- `hover:` → khi hover
- `bg-blue-600` → background màu xanh

---

## 3. Layout Bible

### Flexbox patterns thường dùng

```jsx
{/* Center content */}
<div className="flex items-center justify-center">

{/* Space between, wrap */}
<div className="flex flex-wrap items-center justify-between gap-4">

{/* Stretch items equal height */}
<div className="flex items-stretch">

{/* Column layout */}
<div className="flex flex-col md:flex-row">
```

### Grid patterns

```jsx
{/* Auto-fit cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

{/* Sidebar + Content */}
<div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">

{/* Fixed 3-column */}
<div className="grid grid-cols-3 gap-4">
```

### Container chuẩn (dùng trong project)

```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Nội dung */}
</div>
```

> `max-w-7xl = 1280px`. Các size khác: `max-w-lg` (1024px), `max-w-4xl` (896px), `max-w-2xl` (672px)

---

## 4. Spacing System (8pt Scale)

Tailwind dùng scale 4pt (1 = 4px), nhưng thực tế nên dùng scale 8pt cho consistent:

| Class  | Pixels | Dùng cho              |
|--------|--------|-----------------------|
| `p-2`  | 8px    | icon padding          |
| `p-3`  | 12px   | small spacing         |
| `p-4`  | 16px   | card padding (base)   |
| `p-6`  | 24px   | section padding       |
| `p-8`  | 32px   | large card padding    |
| `p-12` | 48px   | section spacing       |
| `p-16` | 64px   | hero section          |
| `p-24` | 96px   | page section          |

### Gap patterns

```jsx
gap-2  (8px)   → icons with text
gap-4  (16px)  → card grids
gap-6  (24px)  → section spacing
gap-8  (32px)  → large layout breaks
```

---

## 5. Typography System

### Size scale dùng trong project

```jsx
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">    {/* Hero title */}
<h2 className="text-3xl sm:text-4xl font-extrabold">                 {/* Section title */}
<h3 className="text-xl font-bold">                                    {/* Card title */}
<p className="text-base text-gray-600">                                {/* Body */}
<p className="text-sm text-gray-500">                                 {/* Muted */}
<span className="text-xs text-gray-400">                              {/* Label */}
```

### Font weight mapping

```jsx
font-normal  (400) → body text
font-medium  (500) → buttons, nav
font-semibold (600) → subtitles
font-bold    (700) → headings
font-extrabold (800) → hero titles
```

### Leading (line-height)

```jsx
leading-tight    (1.25)  → headings
leading-normal   (1.5)   → body
leading-relaxed  (1.625) → hero paragraphs
```

### Tracking (letter-spacing)

```jsx
tracking-tight   → headings (dùng mặc định)
tracking-wider   → uppercase labels
tracking-widest  → badges, tags
```

---

## 6. Color System

### Cách đọc màu Tailwind

```
bg-blue-500
    ↑    ↑
  màu   shade (50 → 900)

50 → lightest (nền)
100 → nhạt (badge bg)
200 → border nhạt
300 → border đậm
400 → icon, secondary text
500 → primary default
600 → primary hover
700 → active
800 → dark variant
900 → darkest
```

### Semantic colors (tự custom)

```js
// tailwind.config.js
colors: {
  primary: { 50→900 },   // Thương hiệu chính
  accent: { 50→900 },    // Màu nhấn
  neutral: { 50→900 },   // Xám trung tính
  success: { 50→900 },   // Xanh lá
  warning: { 50→900 },   // Vàng cam
  error: { 50→900 },     // Đỏ
}
```

### Pattern: Gradient text (đang dùng trong project)

```jsx
<span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
  giọng nói tự nhiên
</span>
```

---

## 7. Responsive Breakpoints (Mobile-first)

```jsx
// Luôn viết cho mobile trước, sau đó thêm breakpoint

{/* Stack trên mobile → hàng ngang trên desktop */}
<div className="flex flex-col md:flex-row">

{/* 1 cột mobile → 2 cột tablet → 3 cột desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

{/* Ẩn trên mobile, hiện trên desktop */}
<div className="hidden md:block">

{/* Hiện trên mobile, ẩn trên desktop */}
<div className="block md:hidden">
```

### Breakpoints cần nhớ

| Breakpoint | Width   | Target          |
|------------|---------|-----------------|
| (default)  | <640px  | Mobile          |
| `sm:`      | ≥640px  | Large phone     |
| `md:`      | ≥768px  | Tablet          |
| `lg:`      | ≥1024px | Desktop         |
| `xl:`      | ≥1280px | Large desktop   |
| `2xl:`     | ≥1536px | Ultra-wide      |

### Responsive typography pattern

```jsx
<h1 className="
  text-3xl       /* mobile: 30px */
  sm:text-4xl    /* ≥640px: 36px */
  lg:text-5xl    /* ≥1024px: 48px */
  xl:text-6xl    /* ≥1280px: 60px */
">
```

---

## 8. State Modifiers (cực kỳ quan trọng)

```jsx
<button className="
  bg-primary-600 text-white
  hover:bg-primary-700        /* di chuột vào */
  active:bg-primary-800       /* đang click */
  focus:ring-2 focus:ring-primary-500 focus:ring-offset-2  /* focus keyboard */
  disabled:opacity-50 disabled:cursor-not-allowed           /* disabled */
  transition-colors duration-200
">
```

### Focus ring pattern (chuẩn accessibility)

```jsx
// Input
<input className="
  border border-gray-300 rounded-lg
  focus:outline-none
  focus:ring-2 focus:ring-primary-500 focus:border-transparent
"/>

// Button
<button className="
  focus:outline-none
  focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
">
```

> **Luôn dùng** `focus:ring` thay vì xóa `outline` trơn. Giữ `focus-visible` cho keyboard users.

---

## 9. Dark Mode

### Config

```js
// tailwind.config.js
darkMode: "class",  // Toggle bằng class trên <html>
```

### Usage

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
<button className="bg-gray-100 dark:bg-gray-800">
```

### Toggle component

```jsx
const [dark, setDark] = useState(false);

useEffect(() => {
  document.documentElement.classList.toggle("dark", dark);
}, [dark]);

<button onClick={() => setDark(!dark)}>
  {dark ? "☀️" : "🌙"}
</button>
```

> **Project bạn đã config `darkMode: "class"`** nhưng chưa dùng. Đây là cơ hội nâng cấp!

---

## 10. Animations & Transitions

### Transition shorthand

```jsx
transition-all duration-300 ease-in-out
  ↑           ↑         ↑
  property    speed     easing
```

### Transition patterns

```jsx
{/* Color change */}
className="transition-colors duration-200"

{/* Transform (GPU加速) */}
className="transition-transform duration-300 hover:scale-105"

{/* Shadow */}
className="transition-shadow duration-300 hover:shadow-xl"

{/* Opacity + transform (recommended for performance) */}
className="transition-all duration-300 ease-out"
```

### Animation presets

```jsx
animate-spin      → loading spinner
animate-pulse     → skeleton loading
animate-bounce    → notification
animate-ping      → notification badge
```

### Custom animation

```js
// tailwind.config.js
extend: {
  keyframes: {
    "fade-in": {
      "0%": { opacity: "0", transform: "translateY(10px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
  },
  animation: {
    "fade-in": "fade-in 0.3s ease-out",
  },
}
```

```jsx
<div className="animate-fade-in">
```

---

## 11. Component Patterns (từ project)

### Pattern 1: Reusable Button

```jsx
// Đã có - xem Button.jsx
// Props: variant, size, disabled, className
// Variants: primary, secondary, danger, ghost
// Sizes: sm, md, lg
```

### Pattern 2: Reusable Card

```jsx
// Đã có - xem Card.jsx
// Props: hover, padding, className
// Padding: none, sm, md, lg
```

### Pattern 3: clsx pattern (conditional classes)

```jsx
import clsx from "clsx";

<div className={clsx(
  "base-class always-on",
  isActive && "bg-blue-600 text-white",   // condition
  variant === "primary" ? "bg-blue-500" : "bg-gray-500",  // ternary
  className  // external override
)}>
```

### Pattern 4: Polymorphic component (nâng cao)

```jsx
const Text = ({ as: Tag = "p", variant = "body", children }) => {
  const styles = {
    h1: "text-4xl font-bold",
    body: "text-base text-gray-600",
    caption: "text-sm text-gray-400",
  };
  return <Tag className={styles[variant]}>{children}</Tag>;
};
```

---

## 12. Common Pitfalls & Cách tránh

| ❌ Sai | ✅ Đúng | Lý do |
|--------|---------|-------|
| `p-5` (20px) | `p-4` (16px) hoặc `p-6` (24px) | Tailwind không có scale 20px |
| `text-gray-700` trên `bg-gray-800` | `text-gray-100` trên `bg-gray-800` | Tương phản kém |
| `flex gap-10` | `flex gap-8` hoặc `gap-12` | gap-10 = 40px (lẻ) |
| `w-[calc(100%-32px)]` | Dùng `p-4` + `w-full` | Tránh arbitrary value nếu có class |
| `font-semibold` cho mọi thứ | Dùng đúng `font-medium/bold/extrabold` | Thiếu hierarchy |
| `space-y-4` với flex | Dùng `gap-4` | `space-y` chỉ hoạt động với block |
| Z-index hardcode 9999 | Dùng `z-10`, `z-50`, `z-[100]` | Không kiểm soát được stacking |

---

## 13. Performance Tips

1. **Ưu tiên `transform` và `opacity` cho animation** → GPU加速, không gây reflow
2. **Dùng `content` config để purge CSS** → File production nhỏ hơn (đã tự động với Vite)
3. **Tránh arbitrary values** `w-[123px]` → Cache ít hiệu quả hơn
4. **`@apply` ít dùng** → Tốt hơn nên dùng component + clsx
5. **Font chỉ load weight cần** `400;500;600;700;800` (đã làm đúng)

---

## 14. Project Checklist từ code của bạn

| Hạng mục | Trạng thái |
|-----------|-----------|
| Tailwind + Vite setup | ✅ |
| Custom color palette | ✅ |
| Responsive design | ✅ |
| Reusable components | ✅ |
| Conditional classes (clsx) | ✅ |
| Focus states | ✅ |
| Hover/active states | ✅ |
| Mobile menu | ✅ |
| Dark mode config | ⚠️ Chưa dùng |
| Animations | ✅ |
| Gradient text | ✅ |
| Billing toggle | ✅ |

---

## 15. Tài nguyên học tiếp

- [TailwindCSS Docs (chính thức)](https://tailwindcss.com/docs) - Tra cứu nhanh
- [TailwindCSS Playground](https://play.tailwindcss.com/) - Test nhanh class
- [TailwindUI Components](https://tailwindui.com/) - Mẫu component (trả phí)
- [Flowbite](https://flowbite.com/) - Mẫu free
- [HyperUI](https://www.hyperui.dev/) - Mẫu open-source

---

*Tài liệu này tập trung vào các pattern thực tế trong dự án tuan6. Dùng để tra cứu nhanh khi code.*
