# Tuần 7: Axios, API Integration & Context API

> **Mục tiêu:** Gọi API chuyên nghiệp với Axios (interceptors, error handling), quản lý state toàn cục bằng Context API.

---

## 📚 1. Học gì? (Theory)

### 1.1 Axios vs Fetch

| | `fetch` | `axios` |
|---|---|---|
| Cài đặt | Có sẵn trong browser | `npm install axios` |
| JSON tự động | ❌ Cần `.json()` | ✅ Tự parse |
| Error handling | ❌ Không throw lỗi HTTP (4xx, 5xx) | ✅ Tự throw |
| Interceptors | ❌ Không có | ✅ Mạnh mẽ |
| Cancel request | Cần AbortController | Built-in `CancelToken` |
| Progress upload | ❌ | ✅ `onUploadProgress` |

```bash
npm install axios
```

---

### 1.2 Tạo Axios Instance

```js
// src/lib/axios.js (hoặc src/api/axiosConfig.js)
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.example.com",
  timeout: 30000, // 30 giây timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR ---
// Chạy trước khi request được gửi đi
axiosInstance.interceptors.request.use(
  (config) => {
    // Tự động đính token vào mọi request
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
// Chạy sau khi nhận response
axiosInstance.interceptors.response.use(
  // Xử lý response thành công (status 2xx)
  (response) => {
    return response.data; // Chỉ trả về phần data
  },
  // Xử lý lỗi (status 4xx, 5xx)
  async (error) => {
    const originalRequest = error.config;

    // Xử lý token hết hạn (401) - Automatic token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const { data } = await axios.post("/auth/refresh", { refreshToken });
        localStorage.setItem("access_token", data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return axiosInstance(originalRequest); // Thử lại request cũ
      } catch {
        // Refresh thất bại → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    // Convert lỗi sang format thống nhất
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Đã xảy ra lỗi không xác định";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
```

---

### 1.3 Service Layer Pattern (Tổ chức API calls)

```js
// src/services/productService.js
import api from "../lib/axios";

export const productService = {
  // GET /products
  getAll: (params) => api.get("/products", { params }),

  // GET /products/:id
  getById: (id) => api.get(`/products/${id}`),

  // POST /products
  create: (data) => api.post("/products", data),

  // PUT /products/:id
  update: (id, data) => api.put(`/products/${id}`, data),

  // DELETE /products/:id
  delete: (id) => api.delete(`/products/${id}`),
};

// src/services/authService.js
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/me"),
};

// Sử dụng trong component
import { productService } from "../services/productService";

useEffect(() => {
  productService.getAll({ page: 1, limit: 10 })
    .then(data => setProducts(data))
    .catch(err => setError(err.message));
}, []);
```

---

### 1.4 Custom Hook cho Data Fetching

```jsx
// src/hooks/useFetch.js - Hook tái dùng cho bất kỳ API call nào
import { useState, useEffect, useCallback } from "react";

const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

// Sử dụng
const ProductsPage = () => {
  const {
    data: products,
    loading,
    error,
    refetch
  } = useFetch(() => productService.getAll());

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return <ProductList products={products} />;
};
```

---

### 1.5 Context API - Quản lý Global State

**Khi nào dùng Context?**
- Auth state (user đăng nhập)
- Theme (dark/light mode)
- Ngôn ngữ (i18n)
- Shopping cart

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

// 1. Tạo Context với giá trị mặc định
const AuthContext = createContext(null);

// 2. Provider - Bao bọc toàn bộ app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Kiểm tra session hiện tại

  // Kiểm tra user đã đăng nhập chưa khi app khởi động
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          localStorage.removeItem("access_token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const { user, access_token } = await authService.login(credentials);
    localStorage.setItem("access_token", access_token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    logout,
  };

  // Không render app cho đến khi kiểm tra auth xong
  if (loading) return <div>Đang khởi động...</div>;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook để dùng Context dễ hơn
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
};
```

```jsx
// src/main.jsx - Bọc app bằng Provider
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

// Sử dụng trong bất kỳ component nào
const Header = () => {
  const { user, isLoggedIn, logout } = useAuth(); // Đơn giản!

  return (
    <header>
      {isLoggedIn ? (
        <>
          <span>Xin chào, {user.name}</span>
          <button onClick={logout}>Đăng xuất</button>
        </>
      ) : (
        <Link to="/login">Đăng nhập</Link>
      )}
    </header>
  );
};
```

---

### 1.6 Cart Context (Thực chiến)

```jsx
// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync cart vào localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Tăng số lượng nếu đã có
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
```

---

## 🛠 2. Thực hành gì?

1. Setup Axios instance với base URL và token interceptor.
2. Tạo `authService.js` và `productService.js`.
3. Setup `AuthContext` với fake login (lưu token vào localStorage).
4. Implement `CartContext` vào Shop Gallery.

---

## 🏗️ 3. Bài thực hành tuần 7

**Yêu cầu: Tích hợp Authentication vào Shop Gallery**

1. Tạo trang `LoginPage` với form email/password (dùng state controlled).
2. Hardcode logic login: nếu email là `admin@test.com` và password là `123456` → đăng nhập thành công.
3. Sau khi đăng nhập → lưu `{ name: "Admin", email: "..." }` vào `AuthContext`.
4. Header hiển thị tên user và nút "Đăng xuất" khi đã đăng nhập.
5. Route `/cart` là Protected Route (cần đăng nhập mới xem được).
6. Nút "Thêm vào giỏ" trên ProductCard: Nếu chưa đăng nhập → redirect đến `/login`.
7. Khi đăng xuất → xóa user khỏi context và redirect về `/`.

**Bonus:**
- Hiển thị loading spinner trong khi check auth.
- Form validation: email phải đúng định dạng, password ≥ 6 ký tự.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| Axios Docs | [axios-http.com/docs/intro](https://axios-http.com/docs/intro) |
| React Context | [react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context) |

---
> ⏱️ **Ước tính:** 4-5 ngày | 🎯 **Tiêu chí:** Auth flow Login/Logout hoạt động đúng.
