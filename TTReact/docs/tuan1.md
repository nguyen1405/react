# Tuần 1: Modern JavaScript (ES6+) & Khởi tạo React với Vite

> **Mục tiêu:** Nắm vững toàn bộ cú pháp JavaScript hiện đại cần thiết cho React và setup môi trường phát triển chuẩn chuyên nghiệp.

---

## 📚 1. Học gì? (Theory)

### 1.1 `let`, `const` và Block Scope

```js
// var - function scope (tránh dùng trong dự án hiện đại)
var name = "old";

// let - block scope, có thể gán lại
let count = 0;
count = 1; // OK

// const - block scope, KHÔNG thể gán lại (nhưng object/array vẫn mutate được)
const user = { name: "Phu" };
user.name = "Updated"; // OK - mutation object nội bộ
// user = {};           // ERROR - không thể gán lại const
```

> 💡 **Rule of thumb**: Luôn dùng `const`. Chỉ đổi sang `let` khi thực sự cần gán lại.

---

### 1.2 Arrow Functions

```js
// Hàm thường
function greet(name) {
  return "Hello " + name;
}

// Arrow function - cú pháp ngắn gọn
const greet = (name) => "Hello " + name;

// Arrow với nhiều dòng
const calculate = (a, b) => {
  const result = a + b;
  return result;
};

// ⚠️ Khác biệt quan trọng: `this` trong Arrow Function
// Arrow function KHÔNG có `this` riêng - nó inherit từ scope cha
// Trong React, điều này rất hữu ích khi viết event handler
```

---

### 1.3 Destructuring (Cực kỳ phổ biến trong React)

```js
// --- Object Destructuring ---
const user = { name: "Phu", age: 25, city: "HCM" };

// Cách cũ
const name = user.name;
const age = user.age;

// Destructuring - gọn và rõ ràng hơn
const { name, age, city } = user;

// Đặt alias (tên mới)
const { name: userName, age: userAge } = user;

// Default value nếu thuộc tính undefined
const { name, role = "user" } = user;

// Nested destructuring
const response = { data: { user: { name: "Phu", token: "abc123" } } };
const { data: { user: { name, token } } } = response;

// --- Array Destructuring ---
const colors = ["red", "green", "blue"];
const [first, second, third] = colors;

// Skip phần tử
const [primary, , accent] = colors; // skip "green"

// useState trong React dùng array destructuring:
const [count, setCount] = useState(0);
```

---

### 1.4 Spread & Rest Operators

```js
// --- Spread (...) - Trải rộng ---
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Merge mảng (tạo mảng mới - KHÔNG thay đổi bản gốc)
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copy object và override
const user = { name: "Phu", role: "user" };
const admin = { ...user, role: "admin" }; // { name: "Phu", role: "admin" }

// Dùng trong setState của React (rất phổ biến)
const [form, setForm] = useState({ name: "", email: "" });
// Cập nhật một field mà không mất field kia:
setForm(prev => ({ ...prev, name: "New Name" }));

// --- Rest (...) - Thu gom ---
// Trong function params
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
sum(1, 2, 3, 4); // 10

// Trong destructuring
const { name, ...rest } = { name: "Phu", age: 25, city: "HCM" };
// rest = { age: 25, city: "HCM" }
```

---

### 1.5 Template Literals

```js
const name = "Phu";
const score = 95;

// Cách cũ
console.log("Xin chào " + name + ", điểm của bạn là: " + score);

// Template literals - dễ đọc hơn nhiều
console.log(`Xin chào ${name}, điểm của bạn là: ${score}`);

// Multi-line string
const html = `
  <div>
    <h1>${name}</h1>
    <p>Điểm: ${score > 90 ? "Xuất sắc" : "Tốt"}</p>
  </div>
`;
```

---

### 1.6 Array Methods (core của React rendering)

```js
const products = [
  { id: 1, name: "Laptop", price: 25000000, inStock: true },
  { id: 2, name: "Phone", price: 15000000, inStock: false },
  { id: 3, name: "Tablet", price: 10000000, inStock: true },
];

// .map() - Biến đổi từng phần tử, trả về mảng mới có cùng độ dài
// ❗ Dùng để render danh sách trong JSX
const names = products.map(p => p.name);
// ["Laptop", "Phone", "Tablet"]

// .filter() - Lọc phần tử thỏa điều kiện, trả về mảng con
const available = products.filter(p => p.inStock);
// [Laptop, Tablet]

// .find() - Tìm phần tử ĐẦU TIÊN thỏa điều kiện (return 1 object)
const phone = products.find(p => p.name === "Phone");

// .findIndex() - Tìm INDEX của phần tử
const idx = products.findIndex(p => p.id === 2); // 1

// .reduce() - Tổng hợp mảng thành 1 giá trị
const total = products.reduce((sum, p) => sum + p.price, 0);

// .some() - Kiểm tra ít nhất 1 phần tử thỏa điều kiện
const hasOutOfStock = products.some(p => !p.inStock); // true

// .every() - Kiểm tra TẤT CẢ phần tử thỏa điều kiện
const allInStock = products.every(p => p.inStock); // false

// Chaining - Kết hợp nhiều methods
const sumOfAvailableProducts = products
  .filter(p => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);
```

---

### 1.7 Modules (Import / Export)

```js
// --- Named Export ---
// file: utils.js
export const formatPrice = (price) => price.toLocaleString("vi-VN") + "đ";
export const API_URL = "https://api.example.com";

// --- Default Export ---
// file: ProductCard.jsx
const ProductCard = () => { /* ... */ };
export default ProductCard;

// --- Import ---
import ProductCard from "./ProductCard"; // default
import { formatPrice, API_URL } from "./utils"; // named
import { formatPrice as fmt } from "./utils"; // alias

// Import tất cả vào một object
import * as Utils from "./utils";
Utils.formatPrice(10000);
```

---

### 1.8 Promises & Async/Await

```js
// Promise chain - khó đọc khi nhiều step
fetch("https://api.example.com/users")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async/Await - dễ đọc như code đồng bộ
const getUsers = async () => {
  try {
    const res = await fetch("https://api.example.com/users");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi:", error);
  }
};

// Trong React, thường dùng với useEffect:
useEffect(() => {
  const fetchData = async () => {
    const data = await getUsers();
    setUsers(data);
  };
  fetchData();
}, []);
```

---

### 1.9 Short-circuit & Optional Chaining

```js
// Short-circuit - dùng nhiều trong JSX conditional render
const isLoggedIn = true;
isLoggedIn && console.log("Chào mừng!"); // "Chào mừng!"

// Optional Chaining (?.) - tránh lỗi undefined
const user = null;
// Không có ?. sẽ lỗi:
// console.log(user.profile.name); // TypeError!

// Với ?. - trả về undefined thay vì crash
console.log(user?.profile?.name); // undefined - an toàn

// Nullish Coalescing (??) - fallback khi null/undefined
const displayName = user?.name ?? "Khách";
```

---

### 1.10 Khởi tạo Project với Vite

**Tại sao Vite thay vì Create React App (CRA)?**
- ⚡ Khởi động dev server trong < 1 giây (CRA cần 30-60 giây).
- 🔥 HMR (Hot Module Replacement) cực nhanh.
- 📦 Bundle production tối ưu bằng Rollup.

```bash
# Tạo project mới
npm create vite@latest ten-project -- --template react

# Đi vào thư mục và cài dependencies
cd ten-project
npm install

# Chạy dev server
npm run dev
```

**Cấu trúc thư mục Vite chuẩn:**
```
ten-project/
├── public/           # File tĩnh không cần xử lý (favicon, images)
├── src/
│   ├── assets/       # Assets được import trong code (logo, icons)
│   ├── components/   # Các component tái dùng
│   ├── pages/        # Các component màn hình (từ tuần 5)
│   ├── App.jsx       # Component gốc
│   ├── App.css       # Style cho App
│   └── main.jsx      # Entry point - mount React vào DOM
├── index.html        # HTML template
└── package.json
```

---

## 🛠 2. Thực hành gì?

1. Cài đặt Node.js LTS từ [nodejs.org](https://nodejs.org).
2. Chạy lệnh `npm create vite@latest` để dựng project đầu tiên.
3. Xóa toàn bộ code mẫu trong `App.jsx`, giữ chỉ một component rỗng.
4. Mở DevTools → Console để thực hành các method JS.

---

## 🏗️ 3. Bài thực hành tuần 1

**Tạo file `js-practice/index.js` và hoàn thành các bài sau:**

```js
// ===== BÀI 1: DESTRUCTURING =====
// Cho object sau:
const student = {
  id: 1001,
  fullName: "Nguyễn Văn Phu",
  scores: [8, 9, 7, 10],
  address: { city: "HCM", district: "Q1" }
};

// TODO: Dùng destructuring để:
// 1. Lấy fullName và id
// 2. Lấy city từ address
// 3. Tính điểm trung bình từ scores (dùng reduce)
// 4. Tạo object mới "graduated" với toàn bộ thuộc tính student + thêm field "status: 'graduated'"

// ===== BÀI 2: ARRAY METHODS =====
const employees = [
  { id: 1, name: "Phu", dept: "IT", salary: 20000000, active: true },
  { id: 2, name: "An", dept: "Marketing", salary: 15000000, active: true },
  { id: 3, name: "Bình", dept: "IT", salary: 25000000, active: false },
  { id: 4, name: "Châu", dept: "IT", salary: 18000000, active: true },
];

// TODO:
// 1. Lọc nhân viên đang active trong phòng IT
// 2. Tính tổng lương của nhân viên active
// 3. Tạo mảng tên nhân viên có lương > 18 triệu
// 4. Tìm nhân viên có id = 3

// ===== BÀI 3: PROJECT SETUP =====
// Sau khi chạy Vite:
// 1. Xóa nội dung App.jsx, viết lại từ đầu với component hiện "Hello React!"
// 2. Đổi tiêu đề tab trình duyệt thành "TTS Learning" trong index.html
// 3. Tạo file src/components/Greeting.jsx hiển thị "Xin chào [tên bạn]"
// 4. Import Greeting vào App.jsx và render nó
```

**Kết quả mong đợi:**
- Trang web Vite chạy được tại `localhost:5173`.
- Component Greeting hiển thị đúng tên bạn.
- Không có lỗi nào trong Console.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link | Ghi chú |
|---|---|---|
| MDN Web Docs | [developer.mozilla.org](https://developer.mozilla.org) | Tài liệu JS chính thống |
| JavaScript.info | [javascript.info](https://javascript.info) | Giải thích cực dễ hiểu |
| Vite Docs | [vitejs.dev](https://vitejs.dev) | Docs chính thức Vite |

---
> ⏱️ **Ước tính thời gian:** 2-3 ngày học lý thuyết + 1-2 ngày thực hành.
> 🎯 **Tiêu chí hoàn thành:** Giải quyết xong bài thực hành KHÔNG cần tra cú pháp.