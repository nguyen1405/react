# 📐 QUY CHUẨN THIẾT KẾ GIAO DIỆN WEB
### Bố cục – Phân màu – Chuẩn chỉnh toàn diện

---

## MỤC LỤC

1. [Tư duy thiết kế trước khi code](#1-tư-duy-thiết-kế-trước-khi-code)
2. [Hệ thống màu sắc (Color System)](#2-hệ-thống-màu-sắc-color-system)
3. [Typography – Chữ viết](#3-typography--chữ-viết)
4. [Bố cục & Layout](#4-bố-cục--layout)
5. [Spacing – Khoảng cách](#5-spacing--khoảng-cách)
6. [Components chuẩn](#6-components-chuẩn)
7. [Motion & Animation](#7-motion--animation)
8. [Accessibility – Tiếp cận](#8-accessibility--tiếp-cận)
9. [Responsive Design](#9-responsive-design)
10. [CSS Variables – Kiến trúc mã nguồn](#10-css-variables--kiến-trúc-mã-nguồn)
11. [Checklist trước khi xuất bản](#11-checklist-trước-khi-xuất-bản)
12. [Những lỗi phổ biến cần tránh](#12-những-lỗi-phổ-biến-cần-tránh)

---

## 1. Tư duy thiết kế trước khi code

Trước khi viết bất kỳ dòng CSS nào, cần xác định rõ:

| Câu hỏi | Ý nghĩa |
|---|---|
| **Mục đích** | Giao diện giải quyết vấn đề gì? Ai là người dùng? |
| **Tông điệu** | Nghiêm túc/chuyên nghiệp, vui tươi/trẻ trung, sang trọng/tối giản? |
| **Điểm nhớ** | Người dùng sẽ nhớ gì sau khi rời trang? |
| **Ràng buộc** | Framework nào? Hiệu suất? Trình duyệt hỗ trợ? |

### Các hướng thẩm mỹ phổ biến

- **Tối giản tinh tế** – Nhiều khoảng trắng, typography sắc sảo, ít màu
- **Maximalist sáng tạo** – Nhiều lớp, texture, hoạt ảnh phong phú
- **Brutalist/Raw** – Font thô, border rõ, contrast mạnh
- **Editorial/Magazine** – Grid bất đối xứng, ảnh lớn, typography táo bạo
- **Luxury/Refined** – Màu tối, serif font, chi tiết tinh xảo
- **Retro-futuristic** – Màu neon, hình học, hiệu ứng scan-line

> ⚡ **Nguyên tắc vàng**: Chọn một hướng rõ ràng và thực thi nhất quán. Thiết kế không có quan điểm là thiết kế dễ quên.

---

## 2. Hệ thống màu sắc (Color System)

### 2.1 Cấu trúc phân cấp màu

```
Màu nền (Background)     → 70% diện tích
Màu nội dung (Surface)   → 20% diện tích
Màu nhấn (Accent)        → 10% diện tích
```

### 2.2 Các vai trò màu cần định nghĩa

| Biến | Vai trò | Ví dụ |
|---|---|---|
| `--color-bg` | Nền toàn trang | `#0f0f0f` hoặc `#fafafa` |
| `--color-surface` | Nền card, panel | Nhạt hơn/tối hơn bg 5–10% |
| `--color-surface-raised` | Tooltip, dropdown | Nhạt hơn surface thêm 1 lớp |
| `--color-border` | Đường viền | Opacity thấp của text color |
| `--color-text-primary` | Văn bản chính | Contrast ≥ 7:1 với bg |
| `--color-text-secondary` | Văn bản phụ | Contrast ≥ 4.5:1 với bg |
| `--color-text-muted` | Placeholder, nhãn | Contrast ≥ 3:1 với bg |
| `--color-accent` | CTA, highlight | Màu thương hiệu |
| `--color-accent-hover` | Trạng thái hover | Đậm/nhạt hơn accent 15% |
| `--color-success` | Thông báo thành công | Xanh lá: `#22c55e` |
| `--color-warning` | Cảnh báo | Vàng: `#f59e0b` |
| `--color-error` | Lỗi | Đỏ: `#ef4444` |
| `--color-info` | Thông tin | Xanh dương: `#3b82f6` |

### 2.3 Quy tắc contrast (WCAG 2.1)

| Mức độ | Tỉ lệ tối thiểu | Ứng dụng |
|---|---|---|
| AA (văn bản thường) | **4.5 : 1** | Nội dung chính |
| AA (văn bản lớn ≥ 18px) | **3 : 1** | Tiêu đề |
| AAA (văn bản thường) | **7 : 1** | Tiêu chuẩn cao nhất |
| UI Components | **3 : 1** | Button, icon, border |

> 🔧 **Kiểm tra**: [https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/)

### 2.4 Tạo palette màu chuẩn

```css
/* Ví dụ: Light Theme */
:root {
  --color-bg:             #ffffff;
  --color-surface:        #f8f9fa;
  --color-surface-raised: #f1f3f5;
  --color-border:         rgba(0, 0, 0, 0.08);
  --color-text-primary:   #111827;
  --color-text-secondary: #4b5563;
  --color-text-muted:     #9ca3af;
  --color-accent:         #2563eb;
  --color-accent-hover:   #1d4ed8;
}

/* Dark Theme */
[data-theme="dark"] {
  --color-bg:             #0f172a;
  --color-surface:        #1e293b;
  --color-surface-raised: #334155;
  --color-border:         rgba(255, 255, 255, 0.08);
  --color-text-primary:   #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-text-muted:     #64748b;
  --color-accent:         #3b82f6;
  --color-accent-hover:   #60a5fa;
}
```

### 2.5 Không dùng màu đơn độc – Dùng màu theo ngữ cảnh

❌ **Sai**: Rải màu đều đặn không có trọng tâm
✅ **Đúng**: Màu nền trung tính → Surface trung tính → Accent nổi bật ít nhưng mạnh

---

## 3. Typography – Chữ viết

### 3.1 Nguyên tắc chọn font

- **Không dùng** Inter, Roboto, Arial, system-ui làm font chính cho thiết kế có cá tính
- **Ưu tiên** font có tính cách rõ ràng, phù hợp tông điệu dự án
- **Cặp đôi font**: 1 Display font (tiêu đề) + 1 Body font (nội dung)

| Phong cách | Font Tiêu đề gợi ý | Font Nội dung gợi ý |
|---|---|---|
| Sang trọng | Playfair Display, Cormorant | EB Garamond, Lora |
| Hiện đại mạnh | Syne, Bebas Neue | DM Sans, Plus Jakarta Sans |
| Kỹ thuật/Code | JetBrains Mono, Space Mono | IBM Plex Sans |
| Tối giản | Neue Haas Grotesk, Aktiv | Source Serif 4 |
| Sáng tạo | Fraunces, Cabinet Grotesk | Satoshi, General Sans |

### 3.2 Thang kích cỡ chữ (Type Scale)

Dùng thang **Major Third (1.25)** hoặc **Perfect Fourth (1.333)**:

```css
:root {
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px – baseline */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */
  --text-5xl:  3rem;      /* 48px */
  --text-6xl:  3.75rem;   /* 60px */
}
```

### 3.3 Line height & Letter spacing

```css
/* Line height */
--leading-tight:   1.25;   /* Tiêu đề lớn */
--leading-snug:    1.375;  /* Tiêu đề nhỏ */
--leading-normal:  1.5;    /* Nội dung chính */
--leading-relaxed: 1.625;  /* Bài viết dài */
--leading-loose:   2;      /* Caption, nhãn */

/* Letter spacing */
--tracking-tighter: -0.05em;  /* Display font lớn */
--tracking-tight:   -0.025em;
--tracking-normal:   0em;
--tracking-wide:     0.025em;
--tracking-wider:    0.05em;
--tracking-widest:   0.1em;   /* Uppercase label */
```

### 3.4 Hierarchy rõ ràng

```
H1 → Duy nhất 1 trên trang, to nhất, bold nhất
H2 → Tiêu đề section chính
H3 → Tiêu đề nhóm/card
H4 → Nhãn nhỏ trong component
Body → Nội dung đọc được
Caption → Mô tả hình ảnh, footnote
Label → Nhãn form, tag
```

---

## 4. Bố cục & Layout

### 4.1 Hệ thống Grid

```css
/* Grid 12 cột – chuẩn nhất */
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);         /* 16px */
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);   /* 24px */
}

/* Các preset layout phổ biến */
.col-full      { grid-column: span 12; }
.col-half      { grid-column: span 6;  }
.col-third     { grid-column: span 4;  }
.col-quarter   { grid-column: span 3;  }
.col-two-third { grid-column: span 8;  }
```

### 4.2 Breakpoints chuẩn

| Tên | Kích thước | Thiết bị |
|---|---|---|
| `xs` | < 480px | Điện thoại nhỏ |
| `sm` | 480px – 767px | Điện thoại lớn |
| `md` | 768px – 1023px | Tablet |
| `lg` | 1024px – 1279px | Laptop nhỏ |
| `xl` | 1280px – 1535px | Desktop |
| `2xl` | ≥ 1536px | Màn hình lớn |

### 4.3 Vùng màn hình (Screen Zones)

```
┌──────────────────────────────────────┐
│           HEADER / NAV               │  ← Cố định hoặc sticky, 60–80px
├──────────────────────────────────────┤
│                                      │
│           HERO / BANNER              │  ← 80–100vh, ấn tượng nhất
│                                      │
├──────────────────────────────────────┤
│    MAIN CONTENT    │   SIDEBAR       │  ← 8/4 hoặc 9/3 column split
│                    │                 │
├──────────────────────────────────────┤
│           FOOTER                     │  ← Thông tin phụ, links
└──────────────────────────────────────┘
```

### 4.4 Nguyên tắc bố cục

- **Visual hierarchy**: Phần quan trọng nhất = To nhất, tương phản nhất, ở trên cùng
- **F-Pattern**: Người đọc quét theo hình chữ F → Đặt thông tin quan trọng bên trái và trên
- **Z-Pattern**: Trang landing page → CTA ở cuối đường quét chữ Z
- **Breathing room**: Khoảng trắng = thành phần thiết kế, không phải "chỗ trống lãng phí"
- **Alignment**: Mọi thứ phải căn theo một trục rõ ràng

---

## 5. Spacing – Khoảng cách

### 5.1 Thang spacing (8pt Grid System)

```css
:root {
  --space-1:  0.25rem;  /*  4px */
  --space-2:  0.5rem;   /*  8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### 5.2 Quy tắc khoảng cách

| Quan hệ | Khoảng cách |
|---|---|
| Ký tự với ký tự trong cùng 1 element | `--space-1` đến `--space-2` |
| Nhãn với input | `--space-2` |
| Trong một component (padding) | `--space-3` đến `--space-4` |
| Giữa các item trong list | `--space-2` đến `--space-4` |
| Giữa các component | `--space-6` đến `--space-8` |
| Giữa các section | `--space-16` đến `--space-24` |

> 📏 **Quy tắc Proximity**: Các thứ liên quan → gần nhau. Các thứ không liên quan → xa nhau.

---

## 6. Components chuẩn

### 6.1 Button

```css
.btn {
  /* Structure */
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);

  /* Typography */
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: var(--tracking-wide);

  /* Interaction */
  cursor: pointer;
  transition: all 0.2s ease;

  /* Accessibility */
  min-height: 44px;    /* Touch target tối thiểu */
  min-width: 44px;
}

/* States bắt buộc */
.btn:hover   { background: var(--color-accent-hover); }
.btn:focus   { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.btn:active  { transform: scale(0.98); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
```

### 6.2 Form Input

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  min-height: 44px;
}
.input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  outline: none;
}
.input.error { border-color: var(--color-error); }
```

### 6.3 Card

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  /* Không dùng box-shadow mặc định – chỉ khi cần depth */
}
```

### 6.4 Border Radius

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-2xl:  24px;
--radius-full: 9999px;  /* Pill shape */
```

---

## 7. Motion & Animation

### 7.1 Nguyên tắc chuyển động

- **Mục đích**: Animation phải truyền đạt thông tin, không chỉ trang trí
- **Tốc độ**: 150–300ms cho micro-interaction; 400–600ms cho transition lớn
- **Easing**: `ease-out` cho element xuất hiện; `ease-in` cho element biến mất; `ease-in-out` cho chuyển tiếp
- **Không lạm dụng**: Mỗi trang chỉ nên có 1–2 animation nổi bật

### 7.2 Timing Functions chuẩn

```css
--ease-linear:   linear;
--ease-in:       cubic-bezier(0.4, 0, 1, 1);
--ease-out:      cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:   cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-spring:   cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 7.3 Accessibility cho animation

```css
/* Tôn trọng người dùng yêu cầu giảm chuyển động */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Accessibility – Tiếp cận

### 8.1 Checklist bắt buộc

- [ ] **Contrast ratio** đạt WCAG AA tối thiểu (4.5:1 text, 3:1 UI)
- [ ] **Focus visible**: Tất cả interactive element có focus indicator rõ ràng
- [ ] **Touch target**: Tối thiểu **44×44px** cho mọi interactive element
- [ ] **Alt text**: Tất cả ảnh có `alt` mô tả nội dung
- [ ] **Semantic HTML**: Dùng đúng tag (`<button>` không phải `<div>` cho nút bấm)
- [ ] **ARIA labels**: Thêm `aria-label` cho icon-only button
- [ ] **Skip links**: "Skip to main content" cho keyboard user
- [ ] **Heading order**: H1 → H2 → H3, không nhảy cấp
- [ ] **Color không phải phương tiện duy nhất**: Không chỉ dùng màu để phân biệt trạng thái

### 8.2 Semantic HTML structure

```html
<header role="banner">
  <nav aria-label="Navigation chính">...</nav>
</header>

<main id="main-content">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Tiêu đề section</h2>
  </section>
</main>

<aside aria-label="Nội dung liên quan">...</aside>
<footer role="contentinfo">...</footer>
```

---

## 9. Responsive Design

### 9.1 Mobile-First Approach

```css
/* Viết CSS cho mobile trước */
.component {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Sau đó mở rộng cho màn hình lớn hơn */
@media (min-width: 768px) {
  .component {
    flex-direction: row;
  }
}

@media (min-width: 1024px) {
  .component {
    gap: var(--space-8);
  }
}
```

### 9.2 Fluid Typography

```css
/* Font tự động scale theo viewport */
.heading-display {
  font-size: clamp(2rem, 5vw + 1rem, 5rem);
  /* Min: 32px | Fluid | Max: 80px */
}

.body-text {
  font-size: clamp(1rem, 1.5vw + 0.5rem, 1.125rem);
}
```

### 9.3 Fluid Spacing

```css
.section {
  padding-block: clamp(var(--space-12), 8vw, var(--space-24));
}
```

---

## 10. CSS Variables – Kiến trúc mã nguồn

### 10.1 Cấu trúc file CSS đề xuất

```
styles/
├── tokens.css          ← Tất cả CSS variables (màu, spacing, font)
├── reset.css           ← CSS reset / normalize
├── typography.css      ← Font, heading, body styles
├── layout.css          ← Grid, container, zone
├── components/
│   ├── button.css
│   ├── form.css
│   ├── card.css
│   └── nav.css
├── utilities.css       ← Helper classes
└── main.css            ← Import tất cả
```

### 10.2 Naming Convention

```css
/* Format: --[category]-[property]-[variant] */

/* Màu sắc */
--color-text-primary
--color-bg-surface
--color-accent-hover

/* Spacing */
--space-4
--space-section

/* Typography */
--text-base
--leading-normal
--tracking-wide

/* Components */
--btn-padding-x
--card-radius
--input-height
```

### 10.3 Template tokens đầy đủ

```css
:root {
  /* === COLORS === */
  --color-bg:             #ffffff;
  --color-surface:        #f8f9fa;
  --color-surface-raised: #f1f3f5;
  --color-border:         rgba(0,0,0,0.08);
  --color-text-primary:   #111827;
  --color-text-secondary: #4b5563;
  --color-text-muted:     #9ca3af;
  --color-accent:         #2563eb;
  --color-accent-hover:   #1d4ed8;
  --color-success:        #16a34a;
  --color-warning:        #d97706;
  --color-error:          #dc2626;

  /* === TYPOGRAPHY === */
  --font-display: 'Playfair Display', serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
  --text-5xl:  3rem;

  --leading-tight:   1.25;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;

  /* === SPACING === */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* === BORDER RADIUS === */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
  --shadow-md:  0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg:  0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl:  0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);

  /* === TRANSITIONS === */
  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   400ms;
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);

  /* === Z-INDEX === */
  --z-base:     0;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    300;
  --z-toast:    400;
  --z-tooltip:  500;
}
```

---

## 11. Checklist trước khi xuất bản

### Visual
- [ ] Palette màu nhất quán, dùng CSS variables
- [ ] Contrast ratio đạt WCAG AA
- [ ] Typography hierarchy rõ ràng
- [ ] Spacing nhất quán theo thang 8pt
- [ ] Không có phần tử nào "trôi nổi" không có alignment

### Functional
- [ ] Tất cả interactive state: hover, focus, active, disabled
- [ ] Form validation + error messages
- [ ] Loading states cho async actions
- [ ] Empty states khi không có dữ liệu
- [ ] Error pages (404, 500)

### Responsive
- [ ] Test trên mobile (320px, 375px, 414px)
- [ ] Test trên tablet (768px, 1024px)
- [ ] Test trên desktop (1280px, 1440px, 1920px)
- [ ] Text không bị overflow hoặc tràn container
- [ ] Touch target ≥ 44px trên mobile

### Accessibility
- [ ] Keyboard navigation hoạt động đầy đủ
- [ ] Screen reader test cơ bản
- [ ] Focus indicator visible
- [ ] ARIA labels đúng chỗ
- [ ] Không dùng `outline: none` mà không có replacement

### Performance
- [ ] Font chỉ load weight cần thiết
- [ ] Ảnh có `loading="lazy"` khi phù hợp
- [ ] CSS không có rule thừa
- [ ] Animation dùng `transform` và `opacity` (GPU-accelerated)

---

## 12. Những lỗi phổ biến cần tránh

| ❌ Sai | ✅ Đúng |
|---|---|
| Dùng màu cứng: `color: #333` | Dùng variable: `color: var(--color-text-primary)` |
| Font generic: Inter, Roboto mặc định | Font có cá tính phù hợp brand |
| Gradient tím trên nền trắng | Palette có quan điểm rõ ràng |
| Spacing tùy tiện: 13px, 17px | Spacing theo thang: 8, 12, 16, 24px |
| `<div onclick>` thay nút | `<button>` đúng semantic |
| `outline: none` trên focus | Custom focus style đẹp, visible |
| Chỉ màu để phân biệt trạng thái | Màu + icon + text kết hợp |
| Animation quá nhiều, lộn xộn | 1–2 animation có chủ đích |
| Layout cứng, không responsive | Mobile-first + fluid typography |
| Z-index hardcode: `z-index: 9999` | Z-index theo hệ thống layer |

---

*Tài liệu này được tổng hợp theo chuẩn WCAG 2.1, Material Design 3, Apple HIG, và các best practices từ cộng đồng frontend hiện đại.*

*Cập nhật: 2026*

