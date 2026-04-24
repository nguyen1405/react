# Tuần 3: State, Events & Vòng đời Component

> **Mục tiêu:** Làm chủ `useState` để xây dựng giao diện tương tác, hiểu cách React re-render và tránh các lỗi state phổ biến.

---

## 📚 1. Học gì? (Theory)

### 1.1 Tại sao cần State?

```jsx
// ❌ KHÔNG HOẠT ĐỘNG - biến thường không làm giao diện cập nhật
function Counter() {
  let count = 0; // biến bình thường trong JS

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => count++}>Tăng</button>
      {/* Nhấn nút thì count++ nhưng UI không cập nhật! */}
      {/* React không biết có gì thay đổi để re-render */}
    </div>
  );
}

// ✅ ĐÚNG - dùng useState
import { useState } from "react";

function Counter() {
  // useState trả về [giá trị hiện tại, hàm cập nhật]
  const [count, setCount] = useState(0); // 0 là giá trị khởi đầu

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Tăng</button>
      {/* Khi setCount gọi → React biết state thay đổi → re-render lại UI */}
    </div>
  );
}
```

**Cơ chế hoạt động:**
1. `setCount(newValue)` được gọi.
2. React lên lịch re-render component.
3. Hàm `Counter` chạy lại từ đầu với `count` = giá trị mới.
4. React so sánh Virtual DOM cũ và mới, update những phần thay đổi.

---

### 1.2 Cú pháp và cách dùng `useState`

```jsx
import { useState } from "react";

// Cú pháp: const [state, setState] = useState(initialValue);

// --- State là primitive (số, chuỗi, boolean) ---
const [count, setCount] = useState(0);
const [name, setName] = useState("");
const [isVisible, setIsVisible] = useState(false);

// Cập nhật thẳng
setCount(10);
setName("Phu");
setIsVisible(true);

// --- State là Object ---
const [user, setUser] = useState({
  name: "",
  email: "",
  age: 0,
});

// ⚠️ QUAN TRỌNG: Không mutate object trực tiếp
// ❌ Sai:
user.name = "Phu"; // không trigger re-render
setUser(user);     // React nhận cùng object reference → bỏ qua

// ✅ Đúng: Tạo object mới với spread
setUser({ ...user, name: "Phu" }); // Giữ email và age, chỉ đổi name

// --- State là Array ---
const [items, setItems] = useState([]);

// Thêm phần tử - tạo mảng mới
setItems([...items, newItem]);

// Xóa phần tử
setItems(items.filter(item => item.id !== targetId));

// Cập nhật phần tử
setItems(items.map(item =>
  item.id === targetId ? { ...item, done: true } : item
));
```

---

### 1.3 Updater Function (Functional Update)

```jsx
// Vấn đề với setState thông thường trong event async:
// Giả sử count = 0
<button onClick={() => {
  setCount(count + 1); // count = 0 → setCount(1)
  setCount(count + 1); // count vẫn = 0 (closure!) → setCount(1)
  setCount(count + 1); // count = 0 → setCount(1)
  // Kết quả: count = 1, không phải 3!
}}>

// ✅ Giải pháp: Updater function nhận state hiện tại nhất
<button onClick={() => {
  setCount(prev => prev + 1); // prev = 0 → 1
  setCount(prev => prev + 1); // prev = 1 → 2
  setCount(prev => prev + 1); // prev = 2 → 3
  // Kết quả: count = 3 ✓
}}>

// Áp dụng cho array:
const addItem = (newItem) => {
  setItems(prev => [...prev, newItem]);
};

const removeItem = (id) => {
  setItems(prev => prev.filter(item => item.id !== id));
};
```

---

### 1.4 Event Handling

```jsx
const FormExample = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // onClick
  const handleClick = () => {
    alert("Button clicked!");
  };

  // onChange - xử lý input
  const handleNameChange = (event) => {
    setName(event.target.value); // event.target.value là giá trị input
  };

  // onSubmit - xử lý form
  const handleSubmit = (event) => {
    event.preventDefault(); // Ngăn reload trang
    console.log("Submitted:", { name, message });
    // Reset form
    setName("");
    setMessage("");
  };

  // Truyền tham số vào event handler (dùng arrow function)
  const handleDelete = (id) => {
    console.log("Xóa item:", id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}           // Controlled component: giá trị = state
        onChange={handleNameChange}
        placeholder="Tên bạn"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Inline arrow function
        placeholder="Tin nhắn"
      />
      <button type="submit">Gửi</button>
      <button type="button" onClick={handleClick}>Click me</button>

      {/* Truyền tham số */}
      {[1, 2, 3].map(id => (
        <button key={id} onClick={() => handleDelete(id)}>
          Xóa {id}
        </button>
      ))}
    </form>
  );
};
```

---

### 1.5 Controlled vs Uncontrolled Components

```jsx
// --- Controlled Component (React kiểm soát giá trị) ---
// Input value = state, thay đổi = setState
const ControlledInput = () => {
  const [value, setValue] = useState("");

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

// Ưu điểm: Có thể validate ngay lập tức, sync với state dễ dàng
// Nhược điểm: Phải viết onChange cho mọi input

// --- Uncontrolled Component (DOM kiểm soát giá trị) ---
// Dùng ref để đọc giá trị khi cần (ít phổ biến hơn)
import { useRef } from "react";

const UncontrolledInput = () => {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };

  return (
    <>
      <input ref={inputRef} defaultValue="" />
      <button onClick={handleSubmit}>Lấy giá trị</button>
    </>
  );
};

// → Trong thực tế: Dùng Controlled cho form phức tạp
//                  Dùng thư viện React Hook Form để đơn giản hóa
```

---

### 1.6 Lifting State Up (Đẩy State lên)

Khi 2 component con cần **chia sẻ cùng một state**, hãy đưa state lên component cha chung gần nhất.

```jsx
// ❌ Sai: State rời rạc, không chia sẻ được
const ComponentA = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>A: {count}</button>;
};

const ComponentB = () => {
  // B không thể biết count của A là bao nhiêu
  return <p>Total: ???</p>;
};

// ✅ Đúng: Lift state lên Parent
const Parent = () => {
  const [count, setCount] = useState(0); // State ở parent

  return (
    <div>
      {/* Truyền state và setter xuống con qua props */}
      <ComponentA count={count} onIncrement={() => setCount(c => c + 1)} />
      <ComponentB total={count} />  {/* B nhận giá trị qua props */}
    </div>
  );
};

const ComponentA = ({ count, onIncrement }) => (
  <button onClick={onIncrement}>A: {count}</button>
);

const ComponentB = ({ total }) => (
  <p>Total: {total}</p>
);
```

---

### 1.7 Multiple State Variables vs Object State

```jsx
// Cách 1: Nhiều state riêng biệt (khuyên dùng khi ít fields)
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [age, setAge] = useState(0);

// Cách 2: State object (tốt cho form nhiều field)
const [formData, setFormData] = useState({
  name: "",
  email: "",
  age: 0,
  address: "",
});

// Helper để update một field
const handleChange = (field) => (e) => {
  setFormData(prev => ({ ...prev, [field]: e.target.value }));
};

// Sử dụng
<input value={formData.name} onChange={handleChange("name")} />
<input value={formData.email} onChange={handleChange("email")} />
```

---

## 🛠 2. Thực hành gì?

1. Tạo component `Toggle` - click để hiển thị/ẩn nội dung.
2. Tạo component `LikeButton` - click toggle giữa "Thích ❤️" và "Bỏ thích 🤍", đếm số lượt thích.
3. Tạo form đơn giản với 3 field, validate realtime (highlight đỏ khi trống).
4. Thực hành `lifting state up`: Tạo 2 input Độc lập → kết nối để một thay đổi thì input kia cũng thay đổi.

---

## 🏗️ 3. Bài thực hành tuần 3

**Yêu cầu: Xây dựng "Flashcard Học Từ Vựng"**

```js
// Dữ liệu mẫu (src/data/flashcards.js)
export const flashcards = [
  { id: 1, front: "Component", back: "Khối xây dựng cơ bản của React, là hàm JS trả về JSX" },
  { id: 2, front: "Props", back: "Dữ liệu truyền từ cha xuống con, chỉ đọc (read-only)" },
  { id: 3, front: "State", back: "Dữ liệu nội bộ của component, thay đổi gây re-render" },
  { id: 4, front: "Hook", back: "Hàm đặc biệt cho phép dùng tính năng React trong functional component" },
  { id: 5, front: "JSX", back: "Cú pháp mở rộng JS, trông như HTML, được Babel dịch thành createElement()" },
];
```

**Tính năng:**
1. Hiển thị Flashcard với mặt trước (từ vựng).
2. Click vào card → lật card → xem mặt sau (định nghĩa). State `isFlipped`.
3. Nút "Tiếp theo" → chuyển card kế tiếp. State `currentIndex`.
4. Nút "Trước đó" → quay lại card trước (disable khi ở card đầu).
5. Hiển thị tiến trình: "3 / 5".
6. **Nâng cao**: Nút "Đánh dấu đã nhớ" → lọc khỏi danh sách. Nút "Học lại" → reset.

**Tiêu chí đánh giá:**
- Lật card animation được (dùng CSS transition).
- Không có lỗi khi navigate qua lại.
- Code tách component rõ ràng: `Flashcard`, `Navigation`, `Progress`.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| React - Adding Interactivity | [react.dev/learn/adding-interactivity](https://react.dev/learn/adding-interactivity) |
| useState Reference | [react.dev/reference/react/useState](https://react.dev/reference/react/useState) |

---
> ⏱️ **Ước tính:** 3-4 ngày | 🎯 **Tiêu chí:** Build được Flashcard App hoàn toàn độc lập.