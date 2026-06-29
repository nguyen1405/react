# Phân Tích Tuần 10: Next.js App Router, SSR & SEO

> Tài liệu phân tích chi tiết — giảng giải cách học, định nghĩa & cách dùng từng khái niệm

---

## Mục Lục

1. [Tổng quan & Bối cảnh](#1-tổng-quan--bối-cảnh)
2. [Server Components vs Client Components](#2-server-components-vs-client-components)
3. [Root Layout & Metadata (SEO)](#3-root-layout--metadata-seo)
4. [Dynamic Routes & generateStaticParams](#4-dynamic-routes--generatestaticparams)
5. [Loading & Error UI Tự Động](#5-loading--error-ui-tự-động)
6. [Next.js Image Component](#6-nextjs-image-component)
7. [Route Handlers (API Routes)](#7-route-handlers-api-routes)
8. [Phương Pháp Học Theo Ngày](#8-phương-pháp-học-theo-ngày)

---

## 1. Tổng Quan & Bối Cảnh

### Next.js giải quyết vấn đề gì?

| Vấn đề React thuần | Giải pháp Next.js | Cách dùng |
|---|---|---|
| HTML rỗng → SEO kém | **SSR/SSG**: Server render HTML đầy đủ | File trong `app/` tự động SSR |
| Chưa fetch → trang trắng | **Server Components**: fetch trên server | `async function Page() { const data = await fetch(...) }` |
| Routing phức tạp | **File-based routing** tự động | Tạo folder/file → tự thành route |
| Ảnh không tối ưu | **`<Image />`** component tự resize, WebP, lazy-load | `<Image src="" width={} height={} />` |
| Font load chậm | **`next/font`** tự optimize | `import { Inter } from "next/font/google"` |

### Cách học:

- **Hiểu bối cảnh**: React thuần gặp vấn đề gì → Next.js giải quyết ra sao.
- **Ghi nhớ bằng cặp đôi**: React_thuần ↔ Next.js_giải_pháp.
- **Thực hành**: Tạo 1 project mới với `create-next-app`, tự tay sửa `<img>` thành `<Image>` để thấy khác biệt.

---

## 2. Server Components vs Client Components

### Định nghĩa

| Loại | Chạy ở đâu | Bundle JS xuống client? | Dùng được gì? |
|---|---|---|---|
| **Server Component** (mặc định) | Server | ❌ Không | `async/await`, fetch DB, access token, render HTML |
| **Client Component** (`"use client"`) | Browser + Server (1 lần) | ✅ Có | `useState`, `useEffect`, `onClick`, browser API |

### Cách dùng chi tiết

**Server Component — khi nào dùng:**
```jsx
// ✅ Fetch data trực tiếp — không cần useEffect
async function ProductsPage() {
  const products = await fetch("https://api.example.com/products", {
    next: { revalidate: 3600 } // ISR: refresh mỗi giờ
  }).then(r => r.json());

  return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>;
}

// ✅ Đọc file, DB, token...
async function ProfilePage() {
  const user = await db.users.findUnique({ where: { id: session.userId } });
  return <div>{user.name}</div>;
}
```

**Client Component — khi nào dùng:**
```jsx
"use client";

// ✅ Tương tác người dùng
function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? "💖" : "🤍"}
    </button>
  );
}

// ✅ Browser-only API
function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return <button onClick={() => setDark(!dark)}>Toggle</button>;
}
```

### Quy tắc vàng

1. **Mặc định Server Component** — chỉ thêm `"use client"` khi thực sự cần
2. **Server component import client component** → OK
3. **Client component import server component** → ❌ Không được
4. **Giải pháp**: Server component là cha bao bọc, client component là con bên trong cho phần tương tác

```
ServerComponent (fetch data)        ← OK
├── ServerComponent (render text)
├── ClientComponent (button/input)  ← Cần "use client"

ClientComponent                     ← Cần "use client"
├── ❌ Không thể import server component vào đây
└── ✅ Có thể pass server data xuống qua props
```

---

## 3. Root Layout & Metadata (SEO)

### Định nghĩa

| Khái niệm | Định nghĩa | Cách dùng |
|---|---|---|
| **Root Layout** | File `app/layout.jsx` — bao toàn bộ ứng dụng | Chứa `<html>`, `<body>`, header, footer |
| **Static Metadata** | Object metadata cố định | `export const metadata = { title: "..." }` |
| **Dynamic Metadata** | Function metadata theo params | `export async function generateMetadata({ params }) { ... }` |
| **title.template** | Pattern tự động ghép title trang con | `"%s | TTS App"` → "About | TTS App" |
| **Open Graph** | Link preview cho Facebook, Zalo, Discord | `openGraph: { title, description, images }` |

### Cách dùng

**Root Layout:**
```jsx
// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: { default: "TTS App", template: "%s | TTS App" },
  description: "Hệ thống chuyển văn bản thành giọng nói",
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
        <header>...</header>
        <main>{children}</main>
        <footer>...</footer>
      </body>
    </html>
  );
}
```

**Dynamic Metadata (cho trang chi tiết):**
```jsx
// app/blog/[slug]/page.jsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,           // "Bài viết | TTS App" — nhờ template
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.coverImage],
    },
  };
}
```

### Cách học:

- Layout giống component nhưng **chỉ render 1 lần khi chuyển trang** → ko remount, giữ state.
- Static metadata: export 1 object. Dynamic metadata: export 1 async function.
- `title.template` áp dụng cho tất cả trang con — ko cần viết title thủ công từng trang.
- Dùng `%s` làm placeholder → tự động thay bằng title của trang con.

---

## 4. Dynamic Routes & generateStaticParams

### Định nghĩa

| Khái niệm | Định nghĩa | Cách dùng |
|---|---|---|
| **Dynamic Route** | Route chứa segment động, dùng `[]` | `[slug]` → `/blog/some-post`, `[id]` → `/products/123` |
| **`params`** | Prop chứa giá trị dynamic segment | `params.slug` nếu file trong `[slug]/`, `params.id` nếu file trong `[id]/` |
| **`generateStaticParams()`** | Khai báo danh sách params để build tĩnh (SSG) | Trả về array object, mỗi object tương ứng 1 giá trị params |
| **`notFound()`** | Trigger trang 404 | Gọi khi ko tìm thấy dữ liệu |

### Cách dùng

```jsx
// app/blog/[slug]/page.jsx
import { notFound } from "next/navigation";

// 1. Build tĩnh tất cả bài viết tại build time (SSG)
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
  // → [{ slug: "gioi-thieu-tts" }, { slug: "nextjs-la-gi" }, ...]
}

// 2. Trang chi tiết — params lấy từ URL
async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound(); // Hiển thị error.jsx hoặc not-found.jsx

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export default BlogPostPage;
```

### Cách học:

- `generateStaticParams` chỉ chạy **1 lần tại build time** → biến dynamic route thành static page.
- Nếu có 100 bài viết, build xong có 100 file HTML tĩnh → load siêu nhanh.
- Nếu thêm bài viết mới sau build, cần **ISR** (`revalidate`) hoặc rebuild.

---

## 5. Loading & Error UI Tự Động

### Định nghĩa

| File | Vai trò | Khi nào chạy? | Client/Server? |
|---|---|---|---|
| `loading.jsx` | Hiển thị spinner/skeleton | Khi page đang fetch data (await) | Server (mặc định) |
| `error.jsx` | Hiển thị lỗi + nút thử lại | Khi component throw error | **Bắt buộc** `"use client"` |
| `not-found.jsx` | Trang 404 | Khi gọi `notFound()` | Server |

### Cách dùng

```jsx
// app/products/loading.jsx — Next.js tự động show khi page chưa load xong
export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
}

// app/products/error.jsx — PHẢI có "use client"
"use client";
export default function Error({ error, reset }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-600">Có lỗi xảy ra!</h2>
      <p className="text-gray-500 mt-2">{error.message}</p>
      <button
        onClick={reset} // reload segment
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Thử lại
      </button>
    </div>
  );
}
```

### Cách học:

- **Convention over configuration**: Chỉ cần đặt file đúng tên trong thư mục segment → Next.js tự xử lý.
- `loading.jsx` bao page con + toàn bộ children segment.
- `error.jsx` nhận `reset` function — click reload segment mà ko mất state root layout.
- `error.jsx` không bắt lỗi trong layout cùng cấp → cần error.jsx ở layout cha.

---

## 6. Next.js Image Component

### Định nghĩa

```jsx
import Image from "next/image";

// Cách 1: Biết trước kích thước
<Image
  src="/products/laptop.jpg"
  alt="MacBook Pro"
  width={800}
  height={600}
  priority
/>

// Cách 2: Co dãn theo container (dùng fill)
<div className="relative w-full h-64">
  <Image
    src={product.image}
    alt={product.name}
    fill
    className="object-contain"
  />
</div>
```

### Các prop quan trọng

| Prop | Khi nào dùng? | Tác dụng |
|---|---|---|
| `width` + `height` | Ảnh có kích thước cố định | Ngăn CLS (Cumulative Layout Shift) |
| `fill` | Ảnh flexible theo container | Container **phải có** `position: relative` |
| `priority` | Ảnh LCP (trên fold) | Load ngay, ko lazy-load |
| `className="object-cover"` | Ảnh cắt vừa khung, giữ tỉ lệ | Dùng cho thumbnail |
| `className="object-contain"` | Ảnh thu nhỏ vừa khung | Dùng cho product image |
| `sizes` | Responsive images | `"(max-width: 768px) 100vw, 50vw"` |

### Cách học:

- **Luôn thay `<img>` bằng `<Image>`** — tự động WebP, lazy-load, responsive.
- `width` + `height` cho ảnh biết trước kích thước → layout ko bị nhảy.
- `fill` cho ảnh co dãn → **nhớ** container phải `relative`.
- `priority` chỉ dùng 1-2 ảnh trên fold (hero banner) — ảnh dưới fold tự lazy.

---

## 7. Route Handlers (API Routes)

### Định nghĩa

```js
// app/api/products/route.js
import { NextResponse } from "next/server";

// GET /api/products?page=1
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

### Cách dùng

| HTTP Method | Export function | Request parsing | Response |
|---|---|---|---|
| `GET` | `export async function GET(request)` | `request.url` → URL params | `NextResponse.json(data)` |
| `POST` | `export async function POST(request)` | `request.json()` → body | `NextResponse.json(data, { status })` |
| `PUT` | `export async function PUT(request)` | `request.json()` → body | `NextResponse.json(data)` |
| `DELETE` | `export async function DELETE(request)` | `request.nextUrl.searchParams` | `NextResponse.json({ success: true })` |

### Cách học:

- File `route.js` thay thế `pages/api/` cũ.
- Export **tên function = HTTP method**: `GET`, `POST`, `PUT`, `DELETE`.
- `NextResponse.json()` tương tự `res.json()` trong Express.
- Khác với Server Components, Route Handlers **không render UI** — chỉ trả về JSON.

---

## 8. Phương Pháp Học Theo Ngày

### Lộ trình 5 ngày

| Ngày | Chủ đề | Hành động cụ thể |
|---|---|---|
| **1** | Cài đặt + Cấu trúc App Router | Chạy `create-next-app`, tạo vài route tĩnh (`/`, `/about`, `/contact`), hiểu folder `app/` |
| **2** | Server vs Client Components | Tạo ProductPage (Server) fetch data, thêm LikeButton (Client), quan sát Network tab → thấy bundle khác nhau |
| **3** | Dynamic Routes + Loading/Error | Tạo `blog/[slug]/page.jsx`, thêm `loading.jsx` + `error.jsx` + `not-found.jsx` |
| **4** | SEO + Image + API | Thêm `generateMetadata`, thay `<img>` → `<Image>`, tạo `app/api/hello/route.js` |
| **5** | Hoàn thiện TTS Blog | Làm full bài tập cuối tuần |

### Checklist kiểm tra sau mỗi ngày

- [ ] Hiểu được khi nào dùng Server vs Client Component
- [ ] Tạo được route tĩnh và route động (`[slug]`)
- [ ] Biết cách thêm `loading.jsx` và `error.jsx`
- [ ] `generateMetadata` hoạt động đúng cho từng trang
- [ ] `<Image>` thay thế hoàn toàn `<img>`
- [ ] Tạo được API endpoint với Route Handler

---

## 9. Bài Tập TTS Blog — Hướng Dẫn Từng Bước

### Bước 1: Khởi tạo project

```bash
npx create-next-app@latest tts-blog
# Chọn: ESLint ✅ | Tailwind ✅ | App Router ✅
```

### Bước 2: Tạo dữ liệu tĩnh

```js
// src/data/posts.js
export const posts = [
  {
    slug: "gioi-thieu-tts",
    title: "Giới thiệu hệ thống Text-to-Speech",
    excerpt: "TTS là công nghệ chuyển đổi văn bản thành giọng nói...",
    content: "<p>Nội dung đầy đủ...</p>",
    author: "Phú Nguyễn",
    readTime: 5,
    category: "Hướng dẫn",
    publishedAt: "2026-01-15",
    coverImage: "https://picsum.photos/seed/tts1/1200/630",
  },
  // thêm 4-5 bài...
];
```

### Bước 3: Tạo các file

```
src/
├── app/
│   ├── layout.jsx           # Root layout + metadata
│   ├── page.jsx             # / — featured + 3 bài gần nhất
│   ├── loading.jsx          # Global loading
│   ├── not-found.jsx        # 404
│   ├── blog/
│   │   ├── page.jsx         # /blog — grid + filter category
│   │   ├── loading.jsx      # Blog page loading
│   │   └── [slug]/
│   │       ├── page.jsx     # /blog/[slug] — chi tiết + related
│   │       └── loading.jsx  # Detail loading
├── components/
│   ├── PostCard.jsx         # Card component
│   ├── SearchBar.jsx        # Client component (nếu có)
│   └── ThemeToggle.jsx      # Dark mode (bonus)
├── data/
│   └── posts.js             # Dữ liệu bài viết
```

### Bước 4: Kiểm tra

```bash
npm run build    # Kiểm tra SSG + generateStaticParams hoạt động
npm run dev      # Chạy thử
```

---

> **Tóm lại**: Next.js App Router là một paradigm shift. Học theo nguyên tắc **"mặc định là Server Components, thêm `"use client"` khi cần"**. File-based routing giúp code dễ maintain. Tập trung vào convention (tên file quyết định chức năng) và tận dụng sẵn có của framework.

