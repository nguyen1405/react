# Phân tích nội dung Tuần 7 & Hướng học

> **File gốc:** `docs/tuan7/tuan7.md`
> **Ngày phân tích:** 11/06/2026

---

## 1. Tổng quan nội dung Tuần 7

Tuần 7 tập trung vào 3 chủ đề cốt lõi:

| Chủ đề | Mô tả | Mức độ quan trọng |
|--------|-------|--------------------|
| **Axios** | HTTP client thay thế `fetch`, hỗ trợ interceptor, auto JSON parse, error handling | ⭐⭐⭐⭐⭐ |
| **Service Layer Pattern** | Tổ chức code API thành các service riêng biệt, dễ tái sử dụng | ⭐⭐⭐⭐ |
| **Context API** | Quản lý state toàn cục không cần Redux (Auth, Cart, Theme) | ⭐⭐⭐⭐⭐ |

---

## 2. Phân tích chi tiết từng phần

### 2.1 Axios vs Fetch - Tại sao nên dùng Axios?

| Tính năng | `fetch` | `axios` |
|-----------|---------|---------|
| JSON tự động | ❌ Cần `.json()` thủ công | ✅ Tự parse JSON |
| Error HTTP (4xx/5xx) | Không throw → phải check `res.ok` | ✅ Tự throw exception |
| Interceptors | ❌ Không có | ✅ Request & Response |
| Timeout | Cần AbortController | `timeout: 30000` đơn giản |
| Upload progress | ❌ | ✅ `onUploadProgress` |
| Base URL | Phải ghép thủ công | `axios.create({ baseURL })` |

**Định nghĩa cần nhớ:**

- **Axios Instance:** Tạo 1 instance cấu hình sẵn (base URL, timeout, headers) → dùng chung toàn app.
- **Request Interceptor:** Hook chạy TRƯỚC khi request gửi đi → thêm token, log, modify config.
- **Response Interceptor:** Hook chạy SAU khi nhận response → parse data, xử lý 401, refresh token.
- **Token Refresh Pattern:** Khi API trả 401 → tự động gọi refresh token → thử lại request cũ (trong suốt với UI).

### 2.2 Service Layer Pattern - Tổ chức code API

**Mục đích:** Tách biệt logic gọi API khỏi component UI.

```
src/
  lib/axios.js           ← Axios instance (cấu hình chung)
  services/
    authService.js        ← authService.login(), .logout(), .getProfile()
    productService.js     ← productService.getAll(), .getById(), .create()
  components/
    LoginPage.jsx         ← Gọi authService.login()
    ProductGallery.jsx    ← Gọi productService.getAll()
```

**Lợi ích:**
- Mỗi service chỉ chịu trách nhiệm 1 domain (auth, product, cart...)
- Component không cần biết chi tiết HTTP (method, URL, headers)
- Dễ test: mock service thay vì mock axios
- Dễ thay đổi: nếu API đổi endpoint → chỉ sửa 1 file service

### 2.3 Custom Hook useFetch - Tái sử dụng logic data fetching

```js
// Pattern: Hook trả về { data, loading, error, refetch }
const { data: products, loading, error, refetch } = useFetch(
  () => productService.getAll()
);
```

**3 trạng thái bắt buộc trong mọi data fetching:**
1. **loading** → hiển thị spinner/skeleton
2. **error** → hiển thị thông báo lỗi + nút retry
3. **data** → hiển thị nội dung

### 2.4 Context API - State toàn cục

**Flow Context API (3 bước):**

```
Bước 1: createContext(null)
Bước 2: Provider bọc toàn app, cấp value
Bước 3: useContext(Context) trong mọi component
```

**Khi nào nên dùng Context:**
- State cần dùng ở NHIỀU component KHÔNG cùng nhánh
- Ví dụ: user đăng nhập, giỏ hàng, theme, ngôn ngữ

**Khi nào KHÔNG nên dùng Context:**
- State chỉ dùng ở 1-2 component → dùng props drilling
- State thay đổi liên tục (animation, timer) → dùng local state
- Form state → local state + controlled components

**Pattern quan trọng - Custom Hook Wrapper:**
```js
// Thay vì useContext(AuthContext) + check null mỗi lần:
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw Error("Missing Provider");
  return ctx;
};
```

---

## 3. Hướng học - Thứ tự tiếp cận

### Ngày 1: Axios cơ bản (3 giờ)
1. Cài `npm install axios`
2. Tạo Axios Instance với baseURL, timeout
3. Test gọi API (GET, POST) bằng console.log
4. Học Response Interceptor → parse data, bắt lỗi

### Ngày 2: Interceptors + Token (3 giờ)
1. Thêm Request Interceptor → gắn token từ localStorage
2. Thêm Response Interceptor → xử lý 401, refresh token
3. Tổ chức service layer: `authService.js`, `productService.js`

### Ngày 3: useFetch Hook + Error Handling (2 giờ)
1. Viết `useFetch` custom hook
2. Áp dụng vào component: loading spinner, error message, retry button

### Ngày 4: Context API (3 giờ)
1. Tạo `AuthContext`: user state, login/logout, check localStorage
2. Bọc Provider vào `main.jsx`
3. Implement `useAuth()` hook
4. Tương tự cho `CartContext`

### Ngày 5: Tích hợp + Protected Routes (3 giờ)
1. Tạo `ProtectedRoute` component (redirect nếu chưa login)
2. Kết nối AuthContext vào Header
3. Tạo LoginPage với form validation
4. Test toàn bộ flow: Login → Header hiện tên → Cart yêu cầu auth → Logout

---

## 4. Các khái niệm cần định nghĩa rõ

| Khái niệm | Định nghĩa đơn giản |
|-----------|---------------------|
| **Axios Instance** | "Bản sao" axios đã cấu hình sẵn (baseURL, headers...) → export dùng chung toàn app |
| **Interceptor** | Middleware của axios: chặn request trước khi gửi và response trước khi trả về |
| **Service Layer** | Lớp trung gian giữa UI và API: component gọi `authService.login()` thay vì gọi axios trực tiếp |
| **Context** | "Kho chứa state toàn cục" của React → mọi component đều đọc được mà không cần truyền props |
| **Provider** | Component bao bọc cung cấp giá trị cho Context |
| **Consumer / useContext** | Cách component "đọc" giá trị từ Context |
| **Protected Route** | Route chỉ hiển thị khi user đã đăng nhập, ngược lại redirect đến /login |
| **Token Refresh** | Tự động lấy token mới khi token cũ hết hạn mà không cần user login lại |
| **Controlled Component** | Input có `value` và `onChange` do React state quản lý hoàn toàn |

---

## 5. Mô hình triển khai bài tập

```
                    ┌─────────────────────────────┐
                    │       BrowserRouter          │
                    │  ┌───────────────────────┐   │
                    │  │     AuthProvider      │   │
                    │  │  ┌─────────────────┐  │   │
                    │  │  │   CartProvider  │  │   │
                    │  │  │  ┌───────────┐  │  │   │
                    │  │  │  │   App     │  │  │   │
                    │  │  │  │  ├Header  │  │  │   │
                    │  │  │  │  ├Routes  │  │  │   │
                    │  │  │  │  └Footer  │  │  │   │
                    │  │  │  └───────────┘  │  │   │
                    │  │  └─────────────────┘  │   │
                    │  └───────────────────────┘   │
                    └─────────────────────────────┘

    Flow đăng nhập:
    LoginPage → authService.login() → AuthContext.login()
    → localStorage.setItem("access_token", ...)
    → setUser({ name: "Admin", ... })
    → Header re-render: hiện tên + nút Đăng xuất
    → ProtectedRoute: /cart được phép truy cập

    Flow đăng xuất:
    Header "Đăng xuất" → AuthContext.logout()
    → localStorage.removeItem("access_token")
    → setUser(null)
    → Header re-render: ẩn tên, hiện nút "Đăng nhập"
    → Navigate("/")
    → ProtectedRoute: /cart bị chặn → redirect /login
```

---

## 6. File đã triển khai trong dự án

| File | Chức năng |
|------|-----------|
| `src/lib/axios.js` | Axios instance + request/response interceptors |
| `src/services/authService.js` | Auth API: login, register, logout, getProfile |
| `src/services/productService.js` | Product CRUD API |
| `src/contexts/AuthContext.jsx` | Auth state + login/logout + useAuth() hook |
| `src/contexts/CartContext.jsx` | Cart state + add/remove/update + localStorage sync |
| `src/hooks/useFetch.js` | Custom hook { data, loading, error, refetch } |
| `src/components/ProtectedRoute.jsx` | Route guard: check auth → redirect nếu chưa login |
| `src/components/Spinner.jsx` | Loading spinner component |
| `src/components/ProductCard.jsx` | Product card + nút "Thêm vào giỏ" (check auth) |
| `src/pages/LoginPage.jsx` | Form login + validation + error handling |
| `src/pages/ProductGallery.jsx` | Grid sản phẩm (8 sản phẩm mock) |
| `src/pages/CartPage.jsx` | Giỏ hàng: items, quantity, total, remove |
| `src/data/products.js` | Mock data: 8 sản phẩm |

---

## 7. Tiêu chí hoàn thành

- [x] Auth login/logout hoạt động đúng
- [x] Header thay đổi khi đăng nhập (hiện tên + logout)
- [x] `/cart` là Protected Route (chỉ xem khi đã login)
- [x] Nút "Thêm vào giỏ" redirect `/login` nếu chưa đăng nhập
- [x] Form validation: email format, password ≥ 6 ký tự
- [x] Loading spinner khi check auth
- [x] Cart lưu vào localStorage (không mất khi refresh)

---

> ⏱️ **Tổng thời gian ước tính:** 14 giờ (4-5 ngày) | 🎯 **Kết quả:** Hiểu và tự triển khai được Auth + Cart Context từ đầu.
