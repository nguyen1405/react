# Tuần 5: Routing với React Router v6

> **Mục tiêu:** Xây dựng ứng dụng nhiều trang (SPA) với React Router, xử lý route động, protected route và nested layout.

---

## 📚 1. Học gì? (Theory)

### 1.1 SPA vs MPA

| | Multi-Page App (MPA) | Single Page App (SPA) |
|---|---|---|
| Điều hướng | Server trả về trang mới, reload toàn bộ | JS cập nhật URL và render component mới |
| Tốc độ | Chậm hơn (tải HTML mới) | Nhanh hơn (chỉ render phần thay đổi) |
| SEO | Tốt (mỗi trang = HTML riêng) | Cần thêm SSR (Next.js) để tốt SEO |
| UX | Nhấp nháy khi chuyển trang | Mượt mà, không reload |

---

### 1.2 Cài đặt và cấu trúc cơ bản

```bash
npm install react-router-dom
```

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```jsx
// src/App.jsx - Định nghĩa tất cả routes ở đây
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Route với Layout chung */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />          {/* /  */}
        <Route path="about" element={<AboutPage />} />  {/* /about */}
        <Route path="products" element={<ProductsPage />} /> {/* /products */}
        <Route path="products/:id" element={<ProductDetailPage />} /> {/* /products/123 */}
      </Route>

      {/* Route không dùng Layout */}
      <Route path="*" element={<NotFoundPage />} />     {/* Bất kỳ URL nào không khớp */}
    </Routes>
  );
}
```

---

### 1.3 Layout với Nested Routes và `<Outlet />`

```jsx
// src/components/layout/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet /> {/* Đây là nơi Route con được render */}
      </main>
      <Footer />
    </div>
  );
};

// Kết quả khi truy cập /about:
// <Header />
// <AboutPage /> ← render vào <Outlet />
// <Footer />
```

---

### 1.4 Navigation - Link, NavLink, useNavigate

```jsx
import { Link, NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý logout...
    navigate("/"); // Điều hướng về trang chủ bằng code
  };

  const goBack = () => navigate(-1); // Quay lại trang trước

  return (
    <header>
      {/* Link thông thường */}
      <Link to="/">Trang chủ</Link>

      {/* NavLink: tự động thêm class "active" khi URL khớp */}
      <NavLink
        to="/products"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Sản phẩm
      </NavLink>

      <NavLink to="/about">Giới thiệu</NavLink>

      <button onClick={handleLogout}>Đăng xuất</button>
      <button onClick={goBack}>← Quay lại</button>
    </header>
  );
};
```

---

### 1.5 Dynamic Routes và useParams

```jsx
// Route: <Route path="products/:id" element={<ProductDetailPage />} />

// src/pages/ProductDetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy giá trị từ URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        navigate("/404"); // Redirect nếu lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Re-fetch khi id thay đổi

  if (loading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Quay lại</button>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} />
      <p>{product.description}</p>
      <strong>{product.price}$</strong>
    </div>
  );
};
```

---

### 1.6 useSearchParams - Query String

```jsx
// URL: /products?category=electronics&sort=price
import { useSearchParams } from "react-router-dom";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy giá trị từ query string
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "default";

  // Cập nhật query string (không reload trang)
  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory, sort });
  };

  return (
    <div>
      <div>Đang lọc: {category}</div>
      <button onClick={() => handleCategoryChange("electronics")}>
        Electronics
      </button>
      <button onClick={() => handleCategoryChange("jewelry")}>
        Jewelry
      </button>
    </div>
  );
};
```

---

### 1.7 Protected Routes (Bảo vệ route cần đăng nhập)

```jsx
// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("token"); // Kiểm tra auth
  const location = useLocation(); // Lấy URL hiện tại

  if (!isLoggedIn) {
    // Redirect về trang login, lưu URL hiện tại để quay lại sau
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Dùng trong App.jsx:
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

// Sau khi login, quay lại trang gốc:
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    await login(credentials);
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    navigate(redirectTo, { replace: true });
  };
};
```

---

### 1.8 Nested Layout (Admin Layout riêng)

```jsx
// Cấu trúc route cho Admin
<Routes>
  {/* Public routes với MainLayout */}
  <Route path="/" element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path="products" element={<ProductsPage />} />
  </Route>

  {/* Admin routes với AdminLayout + ProtectedRoute */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<AdminDashboard />} />              {/* /admin */}
    <Route path="users" element={<AdminUsers />} />           {/* /admin/users */}
    <Route path="products" element={<AdminProducts />} />     {/* /admin/products */}
  </Route>
</Routes>
```

---

## 🛠 2. Thực hành gì?

1. Cài đặt `react-router-dom` và cấu hình `BrowserRouter` trong `main.jsx`.
2. Tạo thư mục `src/pages/` với 3 trang: `Home`, `Products`, `About`.
3. Tạo `Layout.jsx` với `Header` và `Outlet`.
4. Thêm `NavLink` vào Header với active style.
5. Tạo route động `/products/:id` và dùng `useParams`.

---

## 🏗️ 3. Bài thực hành tuần 5

**Yêu cầu: Hoàn thiện cấu trúc điều hướng cho "Shop Gallery"**

**Cấu trúc Route:**
```
/                 → HomePage (Giới thiệu + featured products)
/products         → ProductsPage (Danh sách tất cả sản phẩm)
/products/:id     → ProductDetailPage (Chi tiết 1 sản phẩm)
/cart             → CartPage (Giỏ hàng - hiện tại còn trống)
/about            → AboutPage (Giới thiệu shop)
/*                → NotFoundPage (Trang 404)
```

**Yêu cầu cụ thể:**
1. Tạo đủ 5 trang theo cấu trúc trên.
2. Header với NavLink highlight trang đang active.
3. Trang `ProductsPage` lấy dữ liệu từ `https://fakestoreapi.com/products` và hiển thị dạng grid.
4. Click vào sản phẩm → chuyển đến `ProductDetailPage` với `useParams` để fetch chi tiết.
5. Trang `ProductDetailPage` có nút "← Quay lại danh sách".
6. Trang 404 có nút "Về trang chủ".

**Tiêu chí đánh giá:**
- URL thay đổi khi navigate, không bị reload trang.
- F5 tại bất kỳ URL nào vẫn hoạt động (Vite cấu hình historyApiFallback).
- NavLink active style hoạt động đúng.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| React Router Docs | [reactrouter.com/en/main](https://reactrouter.com/en/main) |
| Tutorial chính thức | [reactrouter.com/en/main/start/tutorial](https://reactrouter.com/en/main/start/tutorial) |

---
> ⏱️ **Ước tính:** 3-4 ngày | 🎯 **Tiêu chí:** Điều hướng đa trang hoạt động mượt mà.