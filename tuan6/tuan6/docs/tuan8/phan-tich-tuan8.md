# Phân Tích Chi Tiết Tuần 8: Performance Hooks & Custom Hooks

---

## Mục tiêu tuần 8

1. **Tối ưu hiệu năng** với `useMemo`, `useCallback`, `useRef`
2. **Tạo Custom Hook** tái sử dụng
3. **Tổng hợp kiến thức** dự án hoàn chỉnh

---

## 1. Cấu Trúc File Dự Án

```
tuan6/src/
├── main.jsx              # Entry point - wrap providers
├── App.jsx               # Router configuration
├── index.css             # Tailwind imports
│
├── components/
│   ├── Header.jsx        # Navigation + Auth state
│   ├── ProductCard.jsx   # Product display item
│   ├── PricingPage.jsx  # Pricing cards
│   ├── ProtectedRoute.jsx # Auth guard
│   ├── Spinner.jsx       # Loading spinner
│   └── ui/
│       ├── Button.jsx    # Reusable button
│       └── Card.jsx      # Reusable card
│
├── pages/
│   ├── LandingPage.jsx   # Home page
│   ├── ProductGallery.jsx # Shop page
│   ├── ProductDetail.jsx  # Product detail
│   ├── CartPage.jsx     # Cart page
│   └── LoginPage.jsx    # Login form
│
├── contexts/
│   ├── AuthContext.jsx  # Auth state + login/logout
│   └── CartContext.jsx  # Cart state + operations
│
├── hooks/
│   ├── useFetch.js      # Fetch data hook
│   └── useDarkMode.js   # Dark mode toggle
│
├── services/
│   ├── productService.js # Product API
│   └── authService.js    # Auth API
│
└── data/
    └── products.js      # Mock data
```

---

## 2. Quan Hệ Giữa Các File

### 2.1 Sơ đồ luồng dữ liệu

```
main.jsx
    │
    ├── BrowserRouter (react-router-dom)
    │       │
    │       └── App.jsx
    │               │
    │               ├── AuthProvider (context)
    │               │       │
    │               │       └── LoginPage ──→ AuthContext ──→ localStorage
    │               │
    │               ├── CartProvider (context)
    │               │       │
    │               │       └── CartPage ──→ CartContext ──→ localStorage
    │               │
    │               └── Routes
    │                       │
    │                       ├── /  → LandingPage
    │                       ├── /shop → ProductGallery
    │                       │               │
    │                       │               └── ProductCard → useAuth, useCart
    │                       │
    │                       ├── /shop/:id → ProductDetail
    │                       │
    │                       ├── /login → LoginPage
    │                       │
    │                       └── /cart → ProtectedRoute → CartPage
```

### 2.2 Chi tiết từng mối quan hệ

#### main.jsx → App.jsx
- Cung cấp context providers bọc quanh App
- Thứ tự: AuthProvider → CartProvider → App

#### App.jsx → Routes
- Định nghĩa các đường dẫn (paths)
- `/cart` được bọc bởi ProtectedRoute

#### AuthContext cung cấp
- `user`: thông tin user đang đăng nhập
- `isLoggedIn`: boolean kiểm tra đăng nhập
- `login()`: hàm đăng nhập
- `logout()`: hàm đăng xuất

#### CartContext cung cấp  
- `items`: mảng sản phẩm trong giỏ
- `addItem()`: thêm sản phẩm
- `removeItem()`: xóa sản phẩm
- `updateQuantity()`: cập nhật số lượng
- `totalItems`, `totalPrice`: thống kê

---

## 3. Giải Thích Chi Tiết Từng Hook

### 3.1 useMemo - Tránh Tính Toán Lại

**Vấn đề:** Mỗi khi component re-render, tất cả tính toán bên trong chạy lại.

**Giải pháp:**

```jsx
// src/pages/ProductGallery.jsx (Cần thêm useMemo)

// ❌ Không dùng useMemo - tính lại mỗi lần render
const filteredProducts = products
  .filter(p => p.price > 500000)
  .sort((a, b) => b.price - a.price);

// ✅ Dùng useMemo - chỉ tính khi dependency thay đổi
const filteredProducts = useMemo(() => {
  return products
    .filter(p => p.price > 500000)
    .sort((a, b) => b.price - a.price);
}, [products]);  // Chỉ chạy lại khi products thay đổi
```

**Cú pháp:**
```jsx
const value = useMemo(() => {
  // Logic tính toán
  return result;
}, [dependencies]);
```

### 3.2 useCallback - Tránh Tạo Lại Function

**Vấn đề:** Function được tạo mới mỗi lần parent re-render.

**Giải pháp:**

```jsx
// src/components/ProductCard.jsx (Cần thêm useCallback)

// ❌ Không dùng useCallback - tạo mới mỗi lần render
const handleAddToCart = () => {
  addItem(product);
};

// ✅ Dùng useCallback - giữ nguyên reference
const handleAddToCart = useCallback(() => {
  addItem(product);
}, [addItem, product]);
```

**Cú pháp:**
```jsx
const fn = useCallback(() => {
  // Logic
}, [dependencies]);
```

### 3.3 React.memo - Tránh Re-render Component

**Vấn đề:** Component con re-render khi parent re-render, dù props không đổi.

**Giải pháp:**

```jsx
// src/components/ProductCard.jsx

// ❌ Không dùng memo - re-render mỗi khi parent re-render
const ProductCard = ({ product }) => { ... };

// ✅ Dùng memo - chỉ re-render khi props thay đổi
import { memo } from "react";

const ProductCard = memo(({ product }) => { ... });
```

**Lưu ý quan trọng:** memo chỉ hoạt động nếu props là primitive hoặc stable reference. Function/object tạo mới mỗi render sẽ phá vở memo.

### 3.4 useRef - Truy Cập DOM Không Re-render

**Ứng dụng 1: Auto focus input**

```jsx
const AutoFocusInput = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
};
```

**Ứng dụng 2: Lưu giá trị trước đó**

```jsx
const PrevValue = ({ value }) => {
  const prevRef = useRef(value);

  useEffect(() => {
    prevRef.current = value;  // Cập nhật sau khi render
  }, [value]);

  return <div>Trước: {prevRef.current}, Hiện: {value}</div>;
};
```

**Ứng dụng 3: Lưu timer ID**

```jsx
const Timer = () => {
  const timerRef = useRef(null);  // Không trigger re-render
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
  };
};
```

---

## 4. Custom Hooks - Tái Sử Dụng Logic

### 4.1 useDebounce - Chờ Người Dùng Gõ Xong

```jsx
// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Đợi delay ms sau khi user ngừng gõ
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: xóa timer cũ khi value thay đổi
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
```

**Sử dụng:**

```jsx
// Trong component cần search debounced
const SearchBar = () => {
  const [search, setSearch] = useState("");
  
  // Chỉ update sau 500ms user không gõ
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Tìm kiếm..."
    />
  );
};
```

### 4.2 usePagination - Phân Trang

```jsx
// src/hooks/usePagination.js
import { useState, useMemo } from "react";

const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return {
    currentData,
    currentPage,
    totalPages,
    goToPage,
    goNext: () => goToPage(currentPage + 1),
    goPrev: () => goToPage(currentPage - 1),
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
  };
};

export default usePagination;
```

**Sử dụng:**

```jsx
const ProductList = ({ products }) => {
  const { 
    currentData, 
    currentPage, 
    totalPages, 
    goNext, 
    goPrev 
  } = usePagination(products, 4);

  return (
    <>
      {currentData.map(p => <ProductCard key={p.id} product={p} />)}
      
      <div className="flex gap-2">
        <button onClick={goPrev} disabled={currentPage === 1}>Prev</button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={goNext} disabled={currentPage === totalPages}>Next</button>
      </div>
    </>
  );
};
```

---

## 5. Bài Tập Thực Hành Chi Tiết

### Bước 1: Thêm useMemo vào ProductGallery

```jsx
// src/pages/ProductGallery.jsx
import { useMemo } from "react";

const ProductGallery = () => {
  const { isLoggedIn } = useAuth();
  const { totalItems } = useCart();

  // Thêm state cho filters
  const [filter, setFilter] = useState({ search: "", category: "all" });

  // ✅ Dùng useMemo cho filtered products
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];
    
    // Filter theo search
    if (filter.search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    
    // Filter theo category
    if (filter.category !== "all") {
      result = result.filter(p => p.category === filter.category);
    }
    
    return result;
  }, [filter.search, filter.category]);

  return (
    <div>
      {/* Search input */}
      <input 
        value={filter.search}
        onChange={(e) => setFilter(f => ({ ...f, search: e.target.value }))}
        placeholder="Tìm kiếm..."
      />
      
      {/* Products grid */}
      <div className="grid ...">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
```

### Bước 2: Thêm React.memo vào ProductCard

```jsx
// src/components/ProductCard.jsx
import { memo } from "react";

const formatPrice = (price) => price.toLocaleString("vi-VN") + "đ";

// ✅ Memo hóa component
const ProductCard = memo(({ product }) => {
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    addItem(product);
  }, [isLoggedIn, addItem, product, navigate]);

  return (
    <Link to={`/shop/${product.id}`} className="...">
      {/* JSX */}
    </Link>
  );
});

// Thêm displayName để debug dễ hơn
ProductCard.displayName = "ProductCard";

export default ProductCard;
```

### Bước 3: Tạo useDebounce hook

```jsx
// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

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

export default useDebounce;
```

### Bước 4: Áp dụng useDebounce vào search

```jsx
// src/pages/ProductGallery.jsx
import useDebounce from "../hooks/useDebounce";

const ProductGallery = () => {
  const [search, setSearch] = useState("");
  
  // ✅ Debounced search - chỉ update sau 500ms
  const debouncedSearch = useDebounce(search, 500);
  
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];
    
    if (debouncedSearch) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    
    return result;
  }, [debouncedSearch]);

  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm (debounced)..."
      />
      <div className="grid">
        {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};
```

### Bước 5: Thêm useRef cho auto focus

```jsx
// src/pages/LoginPage.jsx
import { useRef, useEffect } from "react";

const LoginPage = () => {
  const emailInputRef = useRef(null);

  // ✅ Auto focus vào email input khi mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  return (
    <form>
      <input
        ref={emailInputRef}
        name="email"
        type="email"
        placeholder="Email"
      />
      <input name="password" type="password" placeholder="Mật khẩu" />
    </form>
  );
};
```

---

## 6. Tổng Kết

| Hook/Concept | Công dụng | Khi nào dùng |
|---|---|---|
| `useMemo` | Cache giá trị tính toán | Filter, sort, reduce tốn kém |
| `useCallback` | Cache function reference | Truyền function làm props |
| `React.memo` | Cache component | Component con re-render không cần thiết |
| `useRef` | Mutable ref không re-render | Truy cập DOM, lưu timer |
| Custom Hook | Tái sử dụng logic | Logic dùng chung nhiều nơi |

---

## 7. Checklist Hoàn Thành

- [ ] Thêm `useMemo` vào ProductGallery cho filter/sort
- [ ] Thêm `React.memo` vào ProductCard
- [ ] Thêm `useCallback` cho handleAddToCart
- [ ] Tạo hook `useDebounce` và áp dụng vào search
- [ ] Tạo hook `usePagination` và áp dụng vào product list
- [ ] Thêm `useRef` cho auto focus input trong LoginPage

---

## 8. Chạy Kiểm Tra

```bash
cd /home/nguyen/projects/react/tuan6/tuan6
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`

Kiểm tra:
1. Search có debounce 500ms không?
2. Thử filter + sort sản phẩm
3. Đăng nhập, thêm vào giỏ, xem giỏ hàng
4. Dark mode có hoạt động không?
