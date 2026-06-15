# Tuần 8: Performance Hooks, Custom Hooks & Dự án tháng 2

> **Mục tiêu:** Tối ưu hiệu năng ứng dụng với useMemo, useCallback, useRef; biết tạo Custom Hook tái sử dụng; tổng hợp kiến thức tháng 2.

---

## 📚 1. Học gì? (Theory)

### 1.1 Khi nào React re-render?

React re-render component khi:
1. **State** của component thay đổi.
2. **Props** nhận được thay đổi.
3. **Context** mà component đang subscribe thay đổi.
4. Component cha re-render (mặc định re-render toàn bộ component con).

```jsx
// Vấn đề: Parent re-render → tất cả Children re-render, dù props không đổi
const Parent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Phu");

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {/* ExpensiveChild re-render mỗi khi count tăng, dù name không đổi! */}
      <ExpensiveChild name={name} />
    </>
  );
};
```

---

### 1.2 `React.memo` - Memoize Component

```jsx
import { memo } from "react";

// Bọc component bằng memo để chỉ re-render khi props thực sự thay đổi
const ExpensiveChild = memo(({ name, onAction }) => {
  console.log("ExpensiveChild render");
  return <div onClick={onAction}>Hello {name}</div>;
});

// ⚠️ Lưu ý: Object và function luôn tạo reference mới mỗi lần render
// → memo vô tác dụng nếu truyền function/object inline
const Parent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Phu");

  // ❌ Sai: handleAction tạo mới mỗi lần Parent render → ExpensiveChild LUÔN re-render
  const handleAction = () => console.log("action");

  return <ExpensiveChild name={name} onAction={handleAction} />;
};
```

---

### 1.3 `useCallback` - Memoize Function

```jsx
import { useCallback } from "react";

const Parent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Phu");

  // ✅ useCallback: hàm chỉ tạo lại khi dependency thay đổi
  const handleAction = useCallback(() => {
    console.log("action with name:", name);
  }, [name]); // Chỉ tạo lại khi name thay đổi

  // Giờ ExpensiveChild chỉ re-render khi name thay đổi, không phải count
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild name={name} onAction={handleAction} />
    </>
  );
};

// Ứng dụng thực tế: Tránh re-create handlers trong danh sách lớn
const ProductList = ({ products }) => {
  const handleAddToCart = useCallback((productId) => {
    // Logic thêm vào giỏ
  }, []); // Không dependency → hàm không bao giờ tạo lại

  return products.map(p => (
    <ProductCard
      key={p.id}
      product={p}
      onAddToCart={handleAddToCart}
    />
  ));
};
```

---

### 1.4 `useMemo` - Memoize Giá trị tính toán

```jsx
import { useMemo } from "react";

const ProductsPage = ({ products, filters }) => {
  const { search, category, sortBy, minPrice, maxPrice } = filters;

  // ❌ Không dùng useMemo:
  // Mỗi lần component re-render (bất kỳ lý do gì) → tính toán lại toàn bộ
  // const filteredProducts = products
  //   .filter(p => /* ... */)
  //   .sort(/* ... */);

  // ✅ Dùng useMemo: Chỉ tính lại khi products hoặc filters thay đổi
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter theo search
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter theo category
    if (category !== "all") {
      result = result.filter(p => p.category === category);
    }

    // Filter theo giá
    result = result.filter(p =>
      p.price >= minPrice && p.price <= maxPrice
    );

    // Sort
    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

    return result;
  }, [products, search, category, sortBy, minPrice, maxPrice]);

  // Đếm kết quả (cũng memo hóa)
  const stats = useMemo(() => ({
    total: filteredProducts.length,
    inStock: filteredProducts.filter(p => p.inStock).length,
    totalValue: filteredProducts.reduce((sum, p) => sum + p.price, 0),
  }), [filteredProducts]);

  return (
    <div>
      <p>Tìm thấy {stats.total} sản phẩm ({stats.inStock} còn hàng)</p>
      <ProductGrid products={filteredProducts} />
    </div>
  );
};
```

---

### 1.5 `useRef` - Truy cập DOM không gây re-render

```jsx
import { useRef, useEffect } from "react";

const AutoFocusInput = () => {
  const inputRef = useRef(null);

  // Tự động focus khi component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Tự động focus" />;
};

// Lưu giá trị trước đó (previousValue pattern)
const Component = ({ value }) => {
  const prevValueRef = useRef(value);

  useEffect(() => {
    prevValueRef.current = value;
  });

  const prevValue = prevValueRef.current;
  console.log(`Trước: ${prevValue}, Hiện tại: ${value}`);
};

// Lưu timer ID để clear (không gây re-render khi thay đổi)
const Timer = () => {
  const timerRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
  };

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};
```

---

### 1.6 Custom Hooks - Tái sử dụng Logic

```jsx
// src/hooks/useDebounce.js
// Dùng cho search input: chờ user gõ xong 500ms rồi mới search
import { useState, useEffect } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // Cleanup
  }, [value, delay]);

  return debouncedValue;
};

// Sử dụng
const SearchBar = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // Chỉ gọi API sau 500ms user dừng gõ
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Tìm kiếm... (debounced 500ms)"
    />
  );
};

// src/hooks/usePagination.js
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
```

---

## 🛠 2. Dự án tháng 2: Shop Gallery Hoàn chỉnh

**Tổng hợp toàn bộ kiến thức Tháng 2: Routing, Tailwind, Axios, Context, Performance.**

### Tính năng đầy đủ:

| Tính năng | Concepts sử dụng |
|---|---|
| Multi-page routing | React Router v6, Nested Routes |
| Product list từ API | Axios, useEffect, Loading state |
| Filter + Search | useMemo, useDebounce, useSearchParams |
| Sort sản phẩm | useMemo (tính toán lại khi sort thay đổi) |
| Giỏ hàng | CartContext, localStorage |
| Đăng nhập / Đăng xuất | AuthContext, ProtectedRoute |
| Giao diện responsive | TailwindCSS, dark mode |
| Performance | React.memo, useCallback trên ProductCard |

### Checklist hoàn thành:
- [ ] Routes đầy đủ và điều hướng mượt.
- [ ] Search debounce 300ms, không gọi API liên tục.
- [ ] Filter và sort hoạt động kết hợp đúng.
- [ ] Giỏ hàng persist qua F5 (localStorage).
- [ ] Auth flow: Login → Protected routes → Logout.
- [ ] Responsive mobile (hamburger menu).
- [ ] Không có lỗi console và warning.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| useMemo Reference | [react.dev/reference/react/useMemo](https://react.dev/reference/react/useMemo) |
| useCallback Reference | [react.dev/reference/react/useCallback](https://react.dev/reference/react/useCallback) |
| React memo | [react.dev/reference/react/memo](https://react.dev/reference/react/memo) |

---
> ⏱️ **Ước tính:** 5-7 ngày cho cả dự án | 🎯 **Milestone 2:** Shop Gallery live, đầy đủ tính năng.
