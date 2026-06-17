# Giải Thích Code & Liên Kết Giữa Các File

---

## 1. Sơ Đồ Luồng Dữ Liệu

```
User click / nhập liệu
       │
       ▼
  Component (Page/UI)
       │
       ├──→ useAuth() / useCart()  ←── Context Provider
       │         │
       │         └──→ localStorage
       │
       ├──→ useMemo / useCallback / useEffect
       │
       ├──→ Custom Hooks (useDebounce / usePagination)
       │
       └──→ Render UI
```

---

## 2. File Nào Gọi File Nào

### main.jsx (Entry Point)

```
main.jsx
  ├── BrowserRouter
  ├── AuthProvider      → Cung cấp user, login, logout
  ├── CartProvider      → Cung cấp cart items
  └── App
```

### App.jsx (Router)

```
App.jsx
  ├── Header
  └── Routes
        /          → LandingPage
        /shop      → ProductGallery
        /shop/:id  → ProductDetail
        /login     → LoginPage
        /cart      → ProtectedRoute → CartPage
```

### ProductGallery.jsx (Trang Shop - TUẦN 8)

```
ProductGallery.jsx
  ├── useState         → filters (search, category, sortBy)
  ├── useDebounce      → debouncedSearch (delay 500ms)
  ├── useMemo          → filteredProducts
  ├── usePagination    → currentData + phân trang
  ├── useAuth         → isLoggedIn
  ├── useCart          → totalItems
  └── ProductCard      → render từng sản phẩm
```

### ProductCard.jsx (ĐÃ TỐI ƯU)

```
ProductCard.jsx
  ├── memo()           → Chỉ re-render khi product thay đổi
  ├── useCallback      → handleAddToCart không tạo lại mỗi render
  ├── useAuth         → isLoggedIn
  └── useCart         → addItem
```

### LoginPage.jsx

```
LoginPage.jsx
  ├── useRef           → auto focus email input
  ├── useState         → form, errors, submitting
  └── useAuth         → login, isLoggedIn
```

### Header.jsx

```
Header.jsx
  ├── useDarkMode      → dark mode toggle
  ├── useAuth          → isLoggedIn, user, logout
  └── useCart          → totalItems
```

### ProtectedRoute.jsx

```
ProtectedRoute.jsx
  ├── useAuth          → isLoggedIn, loading
  └── Navigate         → redirect nếu chưa login
```

---

## 3. Custom Hooks Chi Tiết

### useDebounce.js

```javascript
// Input: value (string user gõ), delay (ms)
// Output: debouncedValue (chỉ update sau delay ms)

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

**Dùng ở:** ProductGallery - search debounce 500ms

---

### usePagination.js

```javascript
// Input: data (mảng), itemsPerPage (mỗi trang)
// Output: currentData, currentPage, totalPages, goNext, goPrev...

const usePagination = (data, itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return { currentData, currentPage, totalPages, goToPage, goNext, goPrev, canGoNext, canGoPrev };
};
```

**Dùng ở:** ProductGallery - chia 4 sản phẩm/trang

---

### useDarkMode.js

```javascript
const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, setDark];
};
```

**Dùng ở:** Header - toggle dark mode

---

## 4. Data Flow Chi Tiết

### Ví dụ 1: User gõ search

```
1. User gõ "tai" vào input
       │
2. setFilters({ ...filters, search: "tai" })
       │
3. useDebounce("tai", 500) bắt đầu timer 500ms
       │
4. Hết 500ms → debouncedSearch = "tai"
       │
5. useMemo chạy: filter products theo "tai"
       │
6. usePagination: reset về page 1, slice 4 items
       │
7. Render 4 ProductCard
```

### Ví dụ 2: User click "Thêm vào giỏ"

```
1. User click button "Thêm vào giỏ"
       │
2. handleAddToCart (useCallback) → kiểm tra isLoggedIn
       │
3. addItem(product) từ CartContext
       │
4. CartContext update items → localStorage.setItem
       │
5. Header re-render → badge totalItems cập nhật
```

### Ví dụ 3: User đăng nhập

```
1. User nhập email/password → click "Đăng nhập"
       │
2. LoginPage: validate → login(form)
       │
3. AuthContext: check credentials → setUser + localStorage
       │
4. Navigate về trang trước
       │
5. Header: hiển thị avatar + tên
       │
6. ProductCard: button "Thêm vào giỏ"
       │
7. ProtectedRoute: cho phép vào /cart
```

---

## 5. Context Providers

### AuthContext

```javascript
// Cung cấp:
user, isLoggedIn, loading, login(), logout()

// Dùng ở:
Header, ProductCard, ProductGallery, LoginPage, CartPage, ProtectedRoute
```

### CartContext

```javascript
// Cung cấp:
items, addItem(), removeItem(), updateQuantity(), clearCart(), totalItems, totalPrice

// Dùng ở:
Header, ProductCard, ProductGallery, CartPage
```

---

## 6. Cấu Trúc File

```
src/
├── main.jsx              → Entry point
├── App.jsx               → Router
│
├── components/
│   ├── Header.jsx        → Nav + Auth + Cart + Dark mode
│   ├── ProductCard.jsx   → memo + useCallback
│   ├── ProtectedRoute.jsx
│   └── ui/
│       ├── Button.jsx
│       └── Card.jsx
│
├── pages/
│   ├── LandingPage.jsx  → Hero + Shop CTA
│   ├── ProductGallery.jsx → useDebounce + useMemo + usePagination
│   ├── ProductDetail.jsx
│   ├── CartPage.jsx
│   └── LoginPage.jsx    → useRef auto focus
│
├── contexts/
│   ├── AuthContext.jsx  → Auth state
│   └── CartContext.jsx  → Cart state
│
├── hooks/
│   ├── useDebounce.js   → Delay search
│   ├── usePagination.js → Phân trang
│   ├── useFetch.js
│   └── useDarkMode.js
│
├── services/
│   ├── productService.js
│   └── authService.js
│
└── data/
    └── products.js      → Mock 8 sản phẩm
```

---

## 7. Từ Khoá

| Thuật ngữ | Giải thích |
|---|---|
| **React.memo** | Bọc component, chỉ re-render khi props thay đổi |
| **useMemo** | Cache kết quả tính toán, chỉ tính lại khi dependency đổi |
| **useCallback** | Cache function, tránh tạo lại mỗi render |
| **useRef** | Truy cập DOM không re-render, lưu giá trị mutable |
| **Custom Hook** | Function bắt đầu "use", dùng hook React bên trong |
| **useDebounce** | Chờ user ngừng thay đổi rồi mới xử lý |
| **usePagination** | Quản lý trạng thái phân trang |
| **Context** | Chia sẻ dữ liệu giữa components |
| **Provider** | Component cung cấp giá trị context |
| **localStorage** | Lưu dữ liệu trên trình duyệt, không mất khi refresh |
