# Tuần 4: useEffect, Bộ nhớ cục bộ & Dự án tháng 1

> **Mục tiêu:** Hiểu sâu `useEffect` để xử lý side effects, tích hợp localStorage, và tổng hợp kiến thức tháng 1 vào một dự án hoàn chỉnh.

---

## 📚 1. Học gì? (Theory)

### 1.1 Side Effects là gì?

Side Effect là bất kỳ tác vụ nào **ảnh hưởng ra ngoài phạm vi component**: gọi API, thay đổi DOM, set timer, subscribe sự kiện...

| Không phải Side Effect | Là Side Effect |
|---|---|
| Tính toán giá trị | Gọi `fetch()` |
| Render JSX | Cập nhật `document.title` |
| Xử lý event | `setTimeout` / `setInterval` |
| Lọc/map mảng | Đăng ký event listener |

---

### 1.2 Cú pháp `useEffect`

```jsx
import { useEffect } from "react";

// Cú pháp cơ bản
useEffect(
  () => {
    // Đây là nơi chạy side effect
    // ...

    // Return cleanup function (không bắt buộc)
    return () => {
      // Dọn dẹp khi component unmount hoặc trước khi effect chạy lại
    };
  },
  [/* Dependencies Array */]
);
```

---

### 1.3 Dependency Array - Phần quan trọng nhất

```jsx
// Case 1: Không có dependency array
// → Effect chạy SAU MỖI LẦN render (ít dùng, cẩn thận vòng lặp vô tận)
useEffect(() => {
  console.log("Chạy sau mỗi lần render");
});

// Case 2: Dependency array rỗng []
// → Effect chỉ chạy 1 LẦN sau khi component mount lần đầu
// → Giống componentDidMount trong class component
useEffect(() => {
  console.log("Chỉ chạy 1 lần khi mount");
  fetchUserData(); // Fetch data khi trang load
}, []);

// Case 3: Có dependencies
// → Effect chạy lại khi 1 trong các dependency thay đổi
const [userId, setUserId] = useState(1);

useEffect(() => {
  console.log("Chạy khi userId thay đổi:", userId);
  fetchUserById(userId);
}, [userId]); // Theo dõi userId

// Case 4: Nhiều dependencies
useEffect(() => {
  // Chạy lại khi page HOẶC search thay đổi
  fetchProducts({ page, search });
}, [page, search]);
```

---

### 1.4 Cleanup Function

```jsx
// --- Timer cleanup ---
useEffect(() => {
  const timer = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  // Cleanup: Clear timer khi component unmount
  // Nếu không cleanup → timer tiếp tục chạy dù component đã bị xóa → memory leak!
  return () => clearInterval(timer);
}, []);

// --- Event listener cleanup ---
useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize); // Bắt buộc cleanup!
  };
}, []);

// --- API request cleanup (AbortController) ---
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const res = await fetch("/api/products", {
        signal: controller.signal // Abort khi component unmount
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    }
  };

  fetchData();

  return () => controller.abort(); // Hủy request nếu component unmount
}, []);
```

---

### 1.5 Fetch dữ liệu với useEffect

```jsx
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Luôn tắt loading dù thành công hay thất bại
      }
    };

    fetchUsers();
  }, []); // Chỉ fetch 1 lần khi component mount

  // Xử lý 3 trạng thái
  if (loading) return <div className="spinner">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
};
```

---

### 1.6 Cập nhật `document.title`

```jsx
// Cập nhật tiêu đề tab trình duyệt theo state
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = `(${count}) Thông báo mới - TTS App`;
}, [count]); // Chạy lại mỗi khi count thay đổi
```

---

### 1.7 Web Storage - localStorage & sessionStorage

```jsx
// localStorage: Lưu trữ vĩnh viễn (không mất khi đóng tab)
// sessionStorage: Mất khi đóng tab

// -- Lưu dữ liệu --
localStorage.setItem("key", "value");
localStorage.setItem("user", JSON.stringify({ name: "Phu", role: "admin" }));

// -- Đọc dữ liệu --
const value = localStorage.getItem("key");
const user = JSON.parse(localStorage.getItem("user"));

// -- Xóa dữ liệu --
localStorage.removeItem("key");
localStorage.clear(); // Xóa tất cả

// -- Pattern phổ biến: Custom Hook useLocalStorage ---
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    // Lazy initializer: chỉ chạy 1 lần khi mount
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Cho phép value là function (như setState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Sử dụng useLocalStorage
const [todos, setTodos] = useLocalStorage("todos", []);
// → todos tự động đồng bộ với localStorage
```

---

### 1.8 Thứ tự render & useEffect

```
Component render lần đầu
    ↓
DOM được cập nhật (user thấy giao diện)
    ↓
useEffect(() => {...}, []) chạy
    ↓
State thay đổi (nếu có trong effect)
    ↓
Component re-render
    ↓
DOM được cập nhật
    ↓
useEffect chạy lại (nếu dependency thay đổi)
```

---

## 🛠 2. Thực hành gì?

1. Tạo một đồng hồ đếm ngược (Countdown Timer) - dùng `setInterval` trong `useEffect` với cleanup.
2. Tạo component `PageTitle` tự động cập nhật `document.title` theo prop `title` truyền vào.
3. Tạo component `WindowSize` hiển thị chiều rộng/chiều cao cửa sổ theo thời gian thực.
4. Thực hành đọc/ghi `localStorage` thủ công.

---

## 🏗️ 3. Dự án cuối tháng 1: Todo List Pro

**Đây là bài tổng kết toàn bộ kiến thức Tháng 1.**

### Tính năng bắt buộc:

| Tính năng | React concepts sử dụng |
|---|---|
| Thêm công việc mới | `useState` (form), `event.preventDefault()` |
| Hiển thị danh sách | `.map()`, `key` prop |
| Toggle hoàn thành | `useState` (array update), `filter/map` |
| Xóa công việc | `useState` (filter) |
| Lọc theo trạng thái | `useState` (activeFilter), `useMemo` |
| Lưu vào localStorage | `useEffect` (sync state to storage) |
| Đếm tasks còn lại | Tính toán từ state |

### Code scaffold (khung để bắt đầu):

```jsx
// src/App.jsx
import { useState, useEffect } from "react";

// Components cần tạo:
// - src/components/todo/AddTodoForm.jsx
// - src/components/todo/TodoList.jsx
// - src/components/todo/TodoItem.jsx
// - src/components/todo/FilterBar.jsx

const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  DONE: "done",
};

function App() {
  // State chính - danh sách todos
  const [todos, setTodos] = useState(() => {
    // Lazy initialization: đọc từ localStorage ngay từ đầu
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // State lọc
  const [filter, setFilter] = useState(FILTERS.ALL);

  // Sync todos vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Thêm todo mới
  const addTodo = (text) => {
    if (!text.trim()) return;
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, done: false, createdAt: new Date() },
    ]);
  };

  // Toggle done
  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo)
    );
  };

  // Xóa todo
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Lọc danh sách
  const filteredTodos = todos.filter(todo => {
    if (filter === FILTERS.ACTIVE) return !todo.done;
    if (filter === FILTERS.DONE) return todo.done;
    return true;
  });

  const activeCount = todos.filter(t => !t.done).length;

  return (
    <div className="app">
      <h1>📝 Todo List Pro</h1>
      <AddTodoForm onAdd={addTodo} />
      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={{ total: todos.length, active: activeCount }}
      />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
      {todos.length > 0 && activeCount === 0 && (
        <p className="success">🎉 Bạn đã hoàn thành tất cả!</p>
      )}
    </div>
  );
}
```

### Tiêu chí đánh giá:
- ✅ Dữ liệu không bị mất khi F5 trang (localStorage).
- ✅ 3 bộ lọc hoạt động đúng.
- ✅ Code tách component rõ ràng, không viết tất cả trong App.jsx.
- ✅ Không có lỗi console.
- ✅ Giao diện sạch sẽ, dễ dùng (minimal CSS).

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| useEffect Reference | [react.dev/reference/react/useEffect](https://react.dev/reference/react/useEffect) |
| You Might Not Need an Effect | [react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect) |

---
> ⏱️ **Ước tính:** 4-5 ngày | 🎯 **Milestone 1 hoàn thành khi:** Todo App chạy đầy đủ, không lỗi.