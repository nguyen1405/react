# Tuần 10: Next.js - App Router, SSR & SEO

> **Mục tiêu:** Làm chủ Next.js App Router, phân biệt Server/Client Components, tối ưu SEO và hiệu năng cho production.

---

## 📚 1. Học gì? (Theory)

### 1.1 Tại sao cần Next.js?

| Vấn đề của React thuần | Giải pháp Next.js |
|---|---|
| HTML rỗng khi chưa chạy JS → SEO kém | SSR/SSG: Server render HTML đầy đủ |
| Chưa fetch data → trang trắng/loading | Server Components: fetch trên server |
| Cấu hình routing phức tạp | File-based routing tự động |
| Không có Image optimization | `<Image />` component tự tối ưu |
| Font load chậm | `next/font` tối ưu font |

---

### 1.2 Khởi tạo Project

```bash
npx create-next-app@latest ten-project
# → Chọn: TypeScript? No | ESLint? Yes | Tailwind? Yes | App Router? Yes | import alias? No
```

**Cấu trúc thư mục App Router:**
```
src/
├── app/
│   ├── layout.jsx         # Root layout (áp dụng cho toàn app)
│   ├── page.jsx            # Trang /
│   ├── about/
│   │   └── page.jsx        # Trang /about
│   ├── blog/
│   │   ├── page.jsx        # Trang /blog (danh sách)
│   │   └── [slug]/
│   │       └── page.jsx    # Trang /blog/ten-bai-viet
│   ├── loading.jsx         # Loading UI tự động
│   ├── error.jsx           # Error boundary tự động
│   └── not-found.jsx       # Trang 404
├── components/
└── lib/
```

---

### 1.3 Server Components vs Client Components

```jsx
// ==============================
// SERVER COMPONENT (Mặc định)
// ==============================
// - Chạy trên Server, không gửi JS xuống client
// - Có thể fetch data trực tiếp (async/await)
// - Không dùng: useState, useEffect, onClick, browser API
// - Ưu điểm: Nhanh hơn, bundle nhỏ hơn, bảo mật hơn

// app/products/page.jsx
async function ProductsPage() {
  // Fetch thẳng, không cần useEffect!
  const products = await fetch("https://fakestoreapi.com/products", {
    next: { revalidate: 3600 } // Revalidate sau 1 giờ
  }).then(res => res.json());

  return (
    <div>
      <h1>Sản phẩm</h1>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// ==============================
// CLIENT COMPONENT
// ==============================
// Khi nào cần thêm "use client":
// - Dùng useState, useEffect, useRef, các hooks khác
// - Xử lý sự kiện (onClick, onChange, ...)
// - Dùng browser API (localStorage, window, ...)
// - Dùng thư viện chỉ chạy client-side

"use client"; // Phải ở dòng đầu tiên của file

import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }}
      placeholder="Tìm kiếm..."
    />
  );
}
```

---

### 1.4 Root Layout và Metadata

```jsx
// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] }); // Tự optimize font

// Metadata mặc định cho toàn app
export const metadata = {
  title: {
    default: "TTS App",           // Tiêu đề mặc định
    template: "%s | TTS App",     // Template cho các trang con
  },
  description: "Hệ thống chuyển văn bản thành giọng nói",
  keywords: ["TTS", "text to speech", "giọng nói"],
  authors: [{ name: "Phu" }],
  openGraph: {
    title: "TTS App",
    description: "Hệ thống chuyển văn bản thành giọng nói",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <header>
          {/* Navigation */}
        </header>
        <main>{children}</main>
        <footer>
          {/* Footer */}
        </footer>
      </body>
    </html>
  );
}
```

```jsx
// app/blog/[slug]/page.jsx - Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  return {
    title: post.title,           // "Tên bài viết | TTS App"
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.coverImage],
    },
  };
}
```

---

### 1.5 Dynamic Routes và generateStaticParams

```jsx
// app/blog/[slug]/page.jsx
import { notFound } from "next/navigation";

// Khai báo trước các route động tại build time (SSG)
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Trang chi tiết bài viết
async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) notFound(); // Trigger not-found.jsx

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

---

### 1.6 Loading và Error UI tự động

```jsx
// app/products/loading.jsx
// Next.js tự động hiện component này khi page đang fetch data
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
}

// app/products/error.jsx
"use client"; // Error component PHẢI là Client Component

export default function Error({ error, reset }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-gray-500 mt-2">{error.message}</p>
      <button
        onClick={reset} // Thử lại
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Thử lại
      </button>
    </div>
  );
}
```

---

### 1.7 Next.js Image Component

```jsx
import Image from "next/image";

// ✅ Dùng next/image thay vì <img> thông thường
// Lợi ích: Tự resize, lazy-load, convert sang WebP, tránh CLS
<Image
  src="/products/laptop.jpg"
  alt="MacBook Pro"
  width={800}     // Bắt buộc nếu không dùng fill
  height={600}
  priority        // Ưu tiên load (dùng cho LCP images)
  className="rounded-xl object-cover"
/>

// Ảnh full container (dùng fill)
<div className="relative w-full h-64">
  <Image
    src={product.image}
    alt={product.name}
    fill
    className="object-contain"
  />
</div>
```

---

### 1.8 Route Handlers (API Routes)

```js
// app/api/products/route.js - Tạo API endpoint trong Next.js
import { NextResponse } from "next/server";

// GET /api/products
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || 1;

  const products = await getProductsFromDB({ page });
  return NextResponse.json(products);
}

// POST /api/products
export async function POST(request) {
  const body = await request.json();
  const product = await createProduct(body);
  return NextResponse.json(product, { status: 201 });
}
```

---

## 🛠 2. Thực hành gì?

1. Tạo project Next.js mới với App Router.
2. Tạo route cơ bản: `/`, `/about`, `/blog`.
3. Setup Root Layout với Header và Footer.
4. Tạo dynamic route `/blog/[slug]` với `generateStaticParams`.
5. Tạo metadata động cho từng trang.

---

## 🏗️ 3. Bài thực hành tuần 10

**Yêu cầu: Xây dựng "TTS Blog" với Next.js App Router**

```js
// Dữ liệu bài viết tĩnh (src/data/posts.js)
export const posts = [
  {
    slug: "gioi-thieu-tts",
    title: "Giới thiệu hệ thống Text-to-Speech",
    excerpt: "TTS (Text-to-Speech) là công nghệ chuyển đổi văn bản thành giọng nói...",
    content: "Nội dung bài viết đầy đủ...",
    author: "Phú Nguyễn",
    readTime: 5,
    category: "Hướng dẫn",
    publishedAt: "2026-01-15",
    coverImage: "https://picsum.photos/seed/tts1/1200/630",
  },
  // ... thêm 4-5 bài
];
```

**Yêu cầu kỹ thuật:**
1. **Trang chủ** (`/`): Featured post + danh sách 3 bài gần nhất.
2. **Trang danh sách** (`/blog`): Tất cả bài viết dạng grid, filter theo category.
3. **Trang chi tiết** (`/blog/[slug]`): Nội dung đầy đủ + related posts.
4. **Metadata đầy đủ** cho mỗi trang (title, description, OG image).
5. **generateStaticParams** cho tất cả slugs.
6. **Loading UI** khi đang render.
7. **Next.js Image** cho tất cả ảnh.
8. Responsive bằng TailwindCSS.

**Bonus:**
- Implement Dark mode với `next-themes`.
- Thêm `sitemap.xml` tự động.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| Next.js Docs | [nextjs.org/docs](https://nextjs.org/docs) |
| App Router Migration | [nextjs.org/docs/app](https://nextjs.org/docs/app) |

---
> ⏱️ **Ước tính:** 4-5 ngày | 🎯 **Tiêu chí:** Blog chạy được, Lighthouse SEO score ≥ 90.
