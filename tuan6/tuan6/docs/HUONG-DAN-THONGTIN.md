# Hướng Dẫn Hiểu Code & Dự Án Shop Gallery

> Tổng hợp kiến thức từ tuần 6-8. File này giúp bạn hiểu toàn bộ dự án từ đầu đến cuối.

---

## 1. Đánh Giá Docs Hiện Tại

### ✅ Đã có đủ:

| File | Nội dung |
|------|----------|
| `docs/tuan6/tuan6.md` | TailwindCSS, Component Patterns |
| `docs/tuan6/tailwind-cheatsheet.md` | Tra cứu nhanh Tailwind |
| `docs/tuan7/tuan7.md` | Axios, API, Context API |
| `docs/tuan7/phan-tich-va-huong-hoc.md` | Phân tích chi tiết tuần 7 |
| `docs/tuan8/tuan8.md` | Performance Hooks, Custom Hooks |
| `docs/tuan8/giai-thich-code.md` | Giải thích code chi tiết |
| `docs/tuan8/phan-tich-tuan8.md` | Phân tích chi tiết tuần 8 |

### ⚠️ Cần bổ sung:
- File tổng hợp "dự án này làm gì" (file này)
- Flow chạy app từ đầu đến cuối

---

## 2. Dự Án Làm Gì?

### Shop Gallery - Ứng dụng thương mại điện tử

**Tính năng chính:**
1. **Xem sản phẩm** - Danh sách sản phẩm với filter, search, sort
2. **Chi tiết sản phẩm** - Xem thông tin chi tiết từng sản phẩm
3. **Giỏ hàng** - Thêm, xóa, cập nhật số lượng sản phẩm
4. **Đăng nhập/đăng xuất** - Authentication flow
5. **Admin** - Quản lý sản phẩm (thêm, sửa, xóa)
6. **Dark mode** - Chuyển đổi theme sáng/tối

**Demo credentials:**
- Email: `admin@test.com`
- Password: `Admin123`

---

## 3. Cấu Trúc File

```
tuan6/
├── src/
│   ├── main.jsx              # Entry point - khởi động app
│   ├── App.jsx              # Cấu hình routing
│   ├── index.css            # TailwindCSS
│   │
│   ├── components/          # UI Components tái sử dụng
│   │   ├── Header.jsx       # Thanh điều hướng
│   │   ├── ProductCard.jsx  # Card hiển thị sản phẩm
│   │   ├── ProtectedRoute.jsx# Bảo vệ route cần login
│   │   ├── PricingPage.jsx  # Trang pricing
│   │   ├── Spinner.jsx      # Loading spinner
│   │   └── ui/
│   │       ├── Button.jsx   # Nút bấm
│   │       └── Card.jsx     # Khung chứa nội dung
│   │
│   ├── pages/               # Các trang chính
│   │   ├── LandingPage.jsx  # Trang chủ
│   │   ├── ProductGallery.jsx# Trang danh sách sản phẩm
│   │   ├── ProductDetail.jsx # Trang chi tiết sản phẩm
│   │   ├── CartPage.jsx     # Trang giỏ hàng
│   │   ├── LoginPage.jsx    # Trang đăng nhập
│   │   └── AdminProducts.jsx# Trang quản lý sản phẩm
│   │
│   ├── contexts/            # Global State (Context API)
│   │   ├── AuthContext.jsx  # User đăng nhập
│   │   ├── CartContext.jsx  # Giỏ hàng
│   │   └── ProductContext.jsx# Danh sách sản phẩm
│   │
│   ├── hooks/               # Custom Hooks
│   │   ├── useFetch.js      # Gọi API
│   │   ├── useDebounce.js   # Chờ user ngừng gõ
│   │   ├── usePagination.js # Phân trang
│   │   └── useDarkMode.js   # Dark mode toggle
│   │
│   ├── services/            # Gọi API
│   │   ├── authService.js   # Auth API
│   │   └── productService.js# Product API
│   │
│   ├── lib/
│   │   └── axios.js         # Cấu hình Axios
│   │
│   └── data/
│       └── products.js      # Mock data (8 sản phẩm)
│
├── docs/                    # Tài liệu học tập
└── package.json            # Dependencies
```

---

## 4. Cách Chạy Dự Án

### Bước 1: Cài đặt
```bash
cd tuan6
npm install
```

### Bước 2: Chạy dev server
```bash
npm run dev
```

### Bước 3: Mở trình duyệt
Truy cập: `http://localhost:5173`

---

## 5. Luồng Dữ Liệu (Data Flow)

### A. Khi app khởi động

```
main.jsx
  │
  ├─→ BrowserRouter (điều hướng URL)
  │
  ├─→ AuthProvider
  │     └─→ Kiểm tra localStorage có "user" không
  │           └─→ Set state user → isLoggedIn = true/false
  │
  ├─→ ProductProvider
  │     └─→ Load products từ localStorage hoặc mock data
  │
  ├─→ CartProvider
  │     └─→ Load cart từ localStorage
  │
  └─→ App
        └─→ Render Header + Routes
```

### B. Khi user đăng nhập

```
LoginPage
  │
  ├─→ Nhập email/password
  │
  ├─→ Gọi authService.login()
  │     └─→ Kiểm tra credentials (admin@test.com / Admin123)
  │
  ├─→ AuthContext.login() 
  │     ├─→ Lưu token vào localStorage
  │     ├─→ Lưu user vào localStorage
  │     └─→ Set state user = { name: "Admin", email: "..." }
  │
  └─→ Header re-render
        ├─→ Hiển thị "Xin chào, Admin"
        └─→ Hiển thị nút "Đăng xuất"
```

### C. Khi user thêm sản phẩm vào giỏ

```
ProductCard → Nút "Thêm vào giỏ"
  │
  ├─→ Kiểm tra isLoggedIn
  │     └─→ Nếu chưa → Navigate("/login")
  │
  └─→ Nếu đã đăng nhập → useCart.addItem(product)
        │
        ├─→ CartContext.addItem()
        │     ├─→ Kiểm tra sản phẩm đã có trong giỏ chưa
        │     │     ├─→ Nếu có → tăng quantity
        │     │     └─→ Nếu không → thêm mới
        │     │
        │     └─→ Lưu vào localStorage
        │
        └─→ Header re-render → Hiển thị số lượng cart mới
```

### D. Khi user vào trang /cart

```
/cart → ProtectedRoute
  │
  ├─→ Kiểm tra isLoggedIn
  │     ├─→ Nếu true → Hiển thị CartPage
  │     │
  │     └─→ Nếu false → Navigate("/login")
  │
  └─→ CartPage
        └─→ Đọc items từ CartContext → Render danh sách
```

---

## 6. Các Khái Niệm Quan Trọng

### 6.1 Context API
- **Purpose:** Chia sẻ state giữa nhiều component không cần props drilling
- **Trong dự án:** AuthContext, CartContext, ProductContext

### 6.2 React Router
- **Purpose:** Điều hướng trang mà không tải lại trình duyệt
- **Trong dự án:** `/`, `/shop`, `/shop/:id`, `/login`, `/cart`, `/admin/products`

### 6.3 Axios Interceptors
- **Request Interceptor:** Thêm token vào mọi request trước khi gửi
- **Response Interceptor:** Xử lý lỗi, refresh token tự động

### 6.4 Custom Hooks
- **useDebounce:** Chờ user ngừng gõ 500ms mới xử lý (tránh gọi API liên tục)
- **usePagination:** Phân trang dữ liệu
- **useDarkMode:** Toggle dark/light theme

### 6.5 Performance Optimization
- **React.memo:** Chỉ re-render khi props thay đổi (ProductCard)
- **useMemo:** Cache kết quả tính toán (filteredProducts)
- **useCallback:** Cache function reference (handleAddToCart)

---

## 7. Thứ Tự Đọc Code Đề Xuất

### Nếu bạn mới bắt đầu:

1. **Đọc `main.jsx`** - Hiểu app khởi động thế nào
2. **Đọc `App.jsx`** - Hiểu có những route nào
3. **Đọc `contexts/AuthContext.jsx`** - Hiểu auth hoạt động
4. **Đọc `contexts/CartContext.jsx`** - Hiểu cart hoạt động
5. **Đọc `pages/ProductGallery.jsx`** - Hiểu cách hiển thị danh sách
6. **Đọc `components/ProductCard.jsx`** - Hiểu cách hiển thị sản phẩm

### Nếu bạn muốn tập trung vào một phần:

| Phần cần học | Đọc file |
|--------------|----------|
| TailwindCSS | `components/ui/*.jsx` + `tailwind-cheatsheet.md` |
| Routing | `App.jsx` |
| Auth | `contexts/AuthContext.jsx` + `pages/LoginPage.jsx` |
| Cart | `contexts/CartContext.jsx` + `pages/CartPage.jsx` |
| API + Axios | `lib/axios.js` + `services/*.js` |
| Performance | `components/ProductCard.jsx` + `pages/ProductGallery.jsx` |

---

## 8. Các Lỗi Thường Gặp

### Lỗi 1: "Component is not defined"
- Nguyên nhân: Import sai đường dẫn
- Cách sửa: Kiểm tra đường dẫn trong import

### Lỗi 2: "Cannot read properties of null"
- Nguyên nhân: Dùng useContext ngoài Provider
- Cách sửa: Đảm bảo component nằm trong Provider

### Lỗi 3: "Too many re-renders"
- Nguyên nhân: Gọi setState trong render
- Cách sửa: Di chuyển vào useEffect

### Lỗi 4: "Protected Route không hoạt động"
- Nguyên nhân: AuthContext chưa load xong mà đã check
- Cách sửa: Thêm loading state trong ProtectedRoute

---

## 9. Checklist Hiểu Code

Đánh dấu ✅ khi đã hiểu:

- [ ] Biết app khởi động từ file nào
- [ ] Biết các route có trong app
- [ ] Biết auth flow hoạt động thế nào
- [ ] Biết cart lưu vào đâu (localStorage)
- [ ] Biết cách filter/search sản phẩm
- [ ] Biết ProtectedRoute hoạt động thế nào
- [ ] Biết custom hooks dùng để gì

---

## 10. Tiếp Theo Nên Làm Gì?

1. **Thực hành:** Sửa code trong dự án, thêm tính năng mới
2. **Debug:** Thử gây lỗi rồi tìm cách sửa
3. **Mở rộng:** Thêm tính năng thanh toán, đánh giá sản phẩm
4. **Deploy:** Đưa lên Vercel/Netlify để chạy thử

---

## 11. Liên Hệ & Trợ Giúp

- TailwindCSS: https://tailwindcss.com/docs
- React Router: https://reactrouter.com
- React Docs: https://react.dev

---

*Cập nhật: 18/06/2026*
