# Phân tích & Hướng dẫn Tuần 8

---

## 1. React Re-render

### Vấn đề
Khi parent re-render → tất cả children re-render theo, dù props không đổi.

### Khi nào React re-render?
1. State thay đổi
2. Props thay đổi
3. Context thay đổi
4. Parent re-render (mặc định)

### Hàm liên quan
- `useState` - trigger re-render khi gọi setXxx

### Code ví dụ
```jsx
const Parent = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild /> {/* Re-render mỗi lần count tăng */}
    </>
  );
};
```

### Cách làm
- Dùng `React.memo` để bọc component con

---

## 2. React.memo

### Công dụng
Memoize component, chỉ re-render khi props thực sự thay đổi.

### Hàm sử dụng
```jsx
import { memo } from "react";

const ExpensiveChild = memo(({ name, onAction }) => {
  return <div onClick={onAction}>Hello {name}</div>;
});
```

### Lưu ý
- Object và function luôn tạo reference mới mỗi lần render
- `memo` vô tác dụng nếu truyền function/object inline

### Cách làm
1. Import `memo` từ react
2. Bọc component: `const MyComponent = memo(({ props }) => { ... })`
3. Đảm bảo truyền primitive hoặc stable reference

---

## 3. useCallback

### Công dụng
Memoize function, tránh tạo lại function mỗi lần render.

### Hàm sử dụng
```jsx
import { useCallback } from "react";

const handleAction = useCallback(() => {
  console.log("action");
}, []); // Dependency array
```

### Tham số
- `useCallback(fn, dependencies)`
- `fn`: function cần memoize
- `dependencies`: mảng phụ thuộc - function tạo lại khi giá trị này thay đổi

### Cách làm
```jsx
// ❌ Sai - tạo mới mỗi lần render
const handleClick = () => console.log(count);

// ✅ Đúng - chỉ tạo lại khi count thay đổi
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

### Ứng dụng thực tế
- Trong danh sách sản phẩm lớn, tránh re-create handlers
```jsx
const handleAddToCart = useCallback((productId) => {
  addToCart(productId);
}, []); // Không dependency → không bao giờ tạo lại
```

---

## 4. useMemo

### Công dụng
Memoize giá trị tính toán, tránh tính toán lại mỗi lần render.

### Hàm sử dụng
```jsx
import { useMemo } from "react";

const filteredProducts = useMemo(() => {
  // Logic filter/sort
  return products.filter(p => p.price > 100);
}, [products, /* các dependency */]);
```

### Tham số
- `useMemo(() => computedValue, dependencies)`
- `() => value`: function tính toán
- `dependencies`: re-compute khi giá trị này thay đổi

### Cách làm
```jsx
// ❌ Tính lại mỗi lần render
const total = products.reduce((sum, p) => sum + p.price, 0);

// ✅ Chỉ tính khi products thay đổi
const total = useMemo(() => 
  products.reduce((sum, p) => sum + p.price, 0)
, [products]);
```

### Ứng dụng
- Filter + Sort sản phẩm
- Tính statistics (tổng, trung bình)
- Transform data

---

## 5. useRef

### Công dụng
- Truy cập DOM mà không gây re-render
- Lưu giá trị mutable không trigger re-render

### Hàm sử dụng
```jsx
import { useRef, useEffect } from "react";

const inputRef = useRef(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);
```

### Tham số
- `useRef(initialValue)`
- Trả về object có property `.current`

### Cách làm

**a) Truy cập DOM:**
```jsx
const AutoFocus = () => {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  return <input ref={inputRef} />;
};
```

**b) Lưu giá trị trước đó:**
```jsx
const PrevValue = ({ value }) => {
  const prevRef = useRef(value);
  
  useEffect(() => {
    prevRef.current = value;
  });
  
  return <div>Trước: {prevRef.current}, Hiện: {value}</div>;
};
```

**c) Lưu timer ID:**
```jsx
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
  
  return <button onClick={start}>Start</button>;
};
```

---

## 6. Custom Hooks

### Công dụng
Tái sử dụng logic stateful giữa nhiều components.

### Cách tạo

**a) useDebounce:**
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

**Sử dụng:**
```jsx
const SearchBar = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) fetchAPI(debouncedSearch);
  }, [debouncedSearch]);

  return <input value={search} onChange={e => setSearch(e.target.value)} />;
};
```

**b) usePagination:**
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

---

## Tổng kết

| Hook | Công dụng | Khi nào dùng |
|---|---|---|
| `React.memo` | Memoize component | Component con re-render không cần thiết |
| `useCallback` | Memoize function | Truyền function làm props |
| `useMemo` | Memoize giá trị | Tính toán tốn kém (filter, sort, reduce) |
| `useRef` | Mutable ref không re-render | Truy cập DOM, lưu timer, previous value |
| Custom Hook | Tái sử dụng logic | Logic dùng chung nhiều nơi |

---

## Bước thực hành

1. **Tạo hook `useDebounce`** - Áp dụng vào search input
2. **Tạo hook `usePagination`** - Áp dụng vào product list
3. **Thêm `useMemo`** vào filter/sort products
4. **Bọc `memo`** vào ProductCard
5. **Dùng `useCallback`** cho handlers trong ProductCard
6. **Thêm `useRef`** cho input focus hoặc scroll
