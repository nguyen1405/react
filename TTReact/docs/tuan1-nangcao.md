# Tuần 1: Modern JavaScript (ES6+) & Khởi tạo React với Vite

> **Mục tiêu:** Nắm vững toàn bộ cú pháp JavaScript hiện đại cần thiết cho React và setup môi trường phát triển chuẩn chuyên nghiệp.

---

## ⚡ Quick Recap (Trước khi bắt đầu)

| Concept | Cú pháp | Dùng khi nào |
|---|---|---|
| `const` | `const x = 1` | Biến không đổi |
| `let` | `let x = 1` | Biến cần gán lại |
| Arrow | `() => {}` | Callback, event handler |
| Destructuring | `const { a } = obj` | Trích xuất properties |
| Spread | `...arr` | Merge, copy |
| `.map()` | `arr.map(x => x*2)` | Render list |
| `.filter()` | `arr.filter(x => x>5)` | Lọc mảng |
| `.reduce()` | `arr.reduce((s,x)=>s+x,0)` | Tính tổng |

---

## 📚 1. Học gì? (Theory)

### 1.1 `let`, `const` và Block Scope

#### 🔍 So sánh trước & sau

```js
// ❌ CÁCH CŨ (ES5)
var name = "old";
var count = 0;
if (true) {
  var name = "new"; // LỖI NGHIÊM TRỌNG: gán đè biến bên ngoài!
}
console.log(name); // "new" - không như mong đợi!

// ✅ CÁCH MỚI (ES6)
let count = 0;
const user = { name: "Phu" };
if (true) {
  let count = 1;       // Biến mới - không ảnh hưởng bên ngoài
  const temp = "hi";   // Chỉ tồn tại trong block này
}
console.log(count); // 0 - an toàn
```

#### 🧠 Visual: Memory Model

```
┌─────────────────────────────────────────────────────────┐
│                    VAR (Function Scope)                │
├─────────────────────────────────────────────────────────┤
│  function demo() {                                     │
│    var x = 1;  ──┐                                    │
│                 ├──► Tồn tại trong toàn bộ function    │
│    if(true) {    │                                    │
│      var x = 2; ─┼──► Gán đè x = 1                  │
│    }              │                                    │
│    console.log(x); // 2                               │
│  }                                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  LET/CONST (Block Scope)              │
├─────────────────────────────────────────────────────────┤
│  {                             │                       │
│    let x = 1;  ──► Chỉ tồn tại trong block {} này       │
│  }                             │                       │
│  {                             │                       │
│    let x = 2;  ──► Hoàn toàn biệt lập với x = 1        │
│  }                             │                       │
└─────────────────────────────────────────────────────────┘
```

#### 🎯 Trong React

```jsx
// Component Counter đơn giản
function Counter() {
  const [count, setCount] = useState(0); // KHÔNG đổi -> dùng const

  const increment = () => {
    let newCount = count + 1; // CẦN gán lại -> dùng let
    setCount(newCount);
  };

  return <button onClick={increment}>{count}</button>;
}
```

> 💡 **Rule of thumb**: Luôn dùng `const`. Chỉ đổi sang `let` khi thực sự cần gán lại.

---

### 1.2 Arrow Functions

#### 🔍 So sánh trước & sau

```js
// ❌ CÁCH CŨ
function greet(name) {
  return "Hello " + name;
}

var greet = function(name) {
  return "Hello " + name;
};

// ✅ CÁCH MỚI
const greet = (name) => "Hello " + name;

const calculate = (a, b) => {
  const result = a + b;
  return result;
};
```

#### 🧠 Visual: `this` trong Arrow Function

```
┌─────────────────────────────────────────────────────────┐
│           Regular Function vs Arrow Function            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  const obj = {                                          │
│    name: "Phu",                                         │
│                                                         │
│    // Regular function - có `this` riêng                │
│    greet: function() {                                  │
│      console.log(this.name); // "Phu" ✅                │
│    },                                                   │
│                                                         │
│    // Arrow function - THỪA KẾ `this` từ cha           │
│    greetArrow: () => {                                    │
│      console.log(this.name); // undefined ❌             │
│    }                                                    │
│  };                                                     │
└─────────────────────────────────────────────────────────┘
```

#### 🎯 Trong React - KHÔNG cần `.bind(this)` !

```jsx
// ❌ KHÔNG CẦN bind với arrow function
class Button extends React.Component {
  state = { count: 0 };

  // Arrow function tự bind `this`
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return <button onClick={this.handleClick}>{this.state.count}</button>;
  }
}

// ❌ Cách cũ cần bind
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }
}
```

---

### 1.3 Destructuring (Cực kỳ phổ biến trong React)

#### 🔍 So sánh trước & sau

```js
// ❌ CÁCH CŨ
const user = { name: "Phu", age: 25, city: "HCM" };
const name = user.name;
const age = user.age;
const city = user.city;

// ✅ CÁCH MỚI
const { name, age, city } = user;
```

#### 🧠 Visual: Destructuring Types

```
┌─────────────────────────────────────────────────────────┐
│               OBJECT DESTRUCTURING                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  const user = { name: "Phu", age: 25, city: "HCM" };     │
│                                                         │
│  // Basic                                              │
│  const { name, age } = user;                           │
│       └────┬────┘                                     │
│         name = "Phu", age = 25                         │
│                                                         │
│  // Alias                                               │
│  const { name: userName, age: userAge } = user;        │
│            ────────────────                             │
│              đổi tên                                 │
│                                                         │
│  // Default value                                      │
│  const { role = "user" } = user;                       │
│                     ──────                            │
│               default nếu undefined                   │
│                                                         │
│  // Nested                                              │
│  const { address: { city } } = user;                  │
│                  ────────                             │
│             lấy sâu trong object                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               ARRAY DESTRUCTURING                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  const colors = ["red", "green", "blue"];               │
│                                                         │
│  const [first, second, third] = colors;                │
│              ──────── ─────── ──────                   │
│              colors[0]   colors[1]  colors[2]          │
│                                                         │
│  // Skip element                                        │
│  const [primary, , accent] = colors;                  │
│              ───────          ──────                   │
│             "red"      "blue"                          │
│                                                         │
│  // Rest pattern                                        │
│  const [first, ...rest] = colors;                      │
│                         ──────                         │
│                    ["green", "blue"]                   │
└─────────────────────────────────────────────────────────┘
```

#### 🎯 Trong React - Destructuring ở MỌT TUYẾT!

```jsx
// 1. useState - Array destructuring
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: "", email: "" });

// 2. Props destructuring
function UserCard({ name, email, age = 18 }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{age}</span>
    </div>
  );
}

// 3. React Router params
function ProductPage({ params }) {
  const { id } = useParams();
  // ...
}

// 4. API Response
function App() {
  const { data, loading, error } = useFetch("/api/user");
  // ...
}
```

---

### 1.4 Spread & Rest Operators

#### 🔍 So sánh trước & sau

```js
// ❌ CÁCH CŨ - Merge arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = arr1.concat(arr2);

// ❌ CÁCH CŨ - Copy object
const user = { name: "Phu", role: "user" };
const admin = Object.assign({}, user, { role: "admin" });

// ✅ CÁCH MỚI
const merged = [...arr1, ...arr2];
const admin = { ...user, role: "admin" };
```

#### 🧠 Visual: Spread Operator

```
┌─────────────────────────────────────────────────────────┐
│                  SPREAD OPERATOR (...)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  // Merge Arrays                                        │
│  const arr1 = [1, 2, 3];                              │
│  const arr2 = [4, 5, 6];                              │
│                                                         │
│  const merged = [...arr1, ...arr2];                    │
│  // Result: [1, 2, 3, 4, 5, 6]                         │
│                                                         │
│  // Copy + Modify Object                               │
│  const user = { name: "Phu", role: "user" };            │
│  const admin = { ...user, role: "admin" };              │
│  // Result: { name: "Phu", role: "admin" }            │
│                                                         │
│  // Add new properties                                  │
│  const updated = { ...user, age: 25 };                │
│  // Result: { name: "Phu", role: "user", age: 25 }     │
│                                                         │
└──────────────────────────────────────────────────��──────┘
```

#### 🎯 Trong React - RẤT PHỔ BIẾN

```jsx
// 1. Partial state update (KHÔNG overwrite!)
const [form, setForm] = useState({ name: "", email: "" });

// ❌ SAI - sẽ mất field "name"
// setForm({ email: "new@email.com" });

// ✅ ĐÚNG - giữ nguyên các field khác
setForm(prev => ({ ...prev, email: "new@email.com" }));

// 2. Merge objects
const defaults = { theme: "light", lang: "vi" };
const userPrefs = { theme: "dark" };
const config = { ...defaults, ...userPrefs };
// Result: { theme: "dark", lang: "vi" }

// 3. Clone array khi render
const [items, setItems] = useState([1, 2, 3]);
const addItem = (newItem) => {
  setItems(prev => [...prev, newItem]);
};
```

---

### 1.5 Template Literals

#### 🔍 So sánh trước & sau

```js
// ❌ CÁCH CŨ
const name = "Phu";
const score = 95;
console.log("Xin chào " + name + ", điểm của bạn là: " + score);

// ✅ CÁCH MỚI
console.log(`Xin chào ${name}, điểm của bạn là: ${score}`);

// Multi-line
const html = `
  <div>
    <h1>${name}</h1>
    <p>Điểm: ${score > 90 ? "Xuất sắc" : "Tốt"}</p>
  </div>
`;
```

---

### 1.6 Array Methods (Core của React Rendering)

#### 🧠 Visual: Data Flow

```
┌─────────────────────────────────────────────────────────┐
│            ARRAY METHODS - DATA FLOW                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  const products = [                                      │
│    { id: 1, name: "Laptop", price: 25000000 },          │
│    { id: 2, name: "Phone", price: 15000000 },          │
│    { id: 3, name: "Tablet", price: 10000000 },        │
│  ];                                                    │
│                                                         │
│  ┌─────────┐     ┌──────────┐     ┌─────────┐        │
│  │ .map()  │────►│ Filter   │────►│.reduce()│        │
│  │        │     │          │     │         │        │
│  │ biến đổi│     │ Lọc      │     │ Tổng hợp │        │
│  │ mỗi phần│     │ điều kiện│     │ thành 1  │        │
│  └─────────┘     └──────────┘     └─────────┘        │
│       │                 │                │               │
│       ▼                 ▼                ▼               │
│  ["Laptop",      [{Laptop,        35000000            │
│   "Phone",       Tablet}]                               │
│   "Tablet"]                                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 🎯 Trong React - RENDER LIST (QUAN TRỌNG NHẤT!)

```jsx
// ❌ SAI - React CẦN key duy nhất
function ProductList({ products }) {
  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name} - {p.price}</li>
      ))}
    </ul>
  );
}

// Thực hành:
// 1. Lọc sản phẩm hết hàng
const outOfStock = products.filter(p => !p.inStock);

// 2. Tính tổng tiền giỏ hàng
const total = cart.reduce((sum, item) => sum + item.price, 0);

// 3. Tìm sản phẩm
const product = products.find(p => p.id === parseId);
```

---

### 1.7 Modules (Import / Export)

#### 🧠 Visual: Import/Export Flow

```
┌─────────────────────────────────────────────────────────┐
│                 MODULES SYSTEM                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐        ┌──────────────────┐       │
│  │   utils.js       │        │   App.jsx         │       │
│  ├──────────────────┤        ├──────────────────┤       │
│  │ export const... │        │ import {...} from │       │
│  │ export const... │──────►│      "./utils"    │       │
│  │ export default  │        │                   │       │
│  └──────────────────┘        └──────────────────┘       │
│                                                         │
│  // Named Export                                        │
│  export const formatPrice = (p) => ...                  │
│  export const API_URL = "..."                          │
│                                                         │
│  // Default Export                                      │
│  export default function App() { ... }                │
│                                                         │
│  // Import                                            │
│  import App from "./App";        // default             │
│  import { formatPrice } from "./utils"; // named      │
│  import { formatPrice as fmt } from "./utils";        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 1.8 Promises & Async/Await

#### 🔍 So sánh trước & sau

```js
// ❌ CÁCH CŨ - Promise Chain
fetch("https://api.example.com/users")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// ✅ CÁCH MỚI - Async/Await
const getUsers = async () => {
  try {
    const res = await fetch("https://api.example.com/users");
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Lỗi:", error);
  }
};
```

#### 🧠 Visual: Async Flow

```
┌─────────────────────────────────────────────────────────┐
│               ASYNC/AWAIT FLOW                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  // Synchronous (đồng bộ)                              │
│  const data = fetchSync(url);  // Chờ xong mới tiếp    │
│  console.log(data);           // Executed sau fetch     │
│                                                         │
│  // Asynchronous (bất đồng bộ)                          │
│  const data = await fetch(url); // Chờ xong mới tiếp   │
│  console.log(data);              // Executed sau fetch     │
│                                                         │
│  // Non-blocking                                        │
│  fetch(url).then(data => console.log(data));            │
│  console.log("Chạy ngay!");  // Chạy trước              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 🎯 Trong React

```jsx
// Trong useEffect - FETCH DATA
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };
  fetchData();
}, []);
```

---

### 1.9 Short-circuit & Optional Chaining

#### 🔍 So sánh trước & sau

```js
// ❌ CÁCH CŨ
const user = null;
if (user && user.profile) {
  console.log(user.profile.name);
}

// ✅ CÁCH MỚI
console.log(user?.profile?.name); // undefined - an toàn

// Nullish fallback
const name = user?.name ?? "Khách";
```

#### 🧠 Visual: Optional Chaining

```
┌─────────────────────────────────────────────────────────┐
│            OPTIONAL CHAINING (?.)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  const user = null;                                    │
│                                                         │
│  // Không có ?.                                        │
│  // user.profile.name ❌ TypeError                      │
│                                                         │
│  // Với ?.                                             │
│  user?.profile?.name ✅ undefined (không lỗi)           │
│                                                         │
│  // Array                                              │
│  users?.[0]?.name                                      │
│                                                         │
│  // Method                                             │
│  user?.getName?.()                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 🎯 Trong React - Conditional Render

```jsx
// Short-circuit && cho conditional render
{isLoggedIn && <Dashboard />}

// Ternary cho 2 trường hợp
{isLoggedIn ? <Dashboard /> : <Login />}

// Optional chaining với API data
function UserProfile({ user }) {
  return (
    <div>
      <h2>{user?.name ?? "Khách"}</h2>
      <p>{user?.address?.city}</p>
    </div>
  );
}
```

---

### 1.10 Khởi tạo Project với Vite

**Tại sao Vite thay vì Create React App (CRA)?**

```
┌─────────────────────────────────────────────────────────┐
│                    VITE vs CRA                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  METRIC          │  VITE        │  CRA                 │
│  ───────────────┼───────���─���────┼─────────────         │
│  Dev start      │  < 1 sec     │  30-60 sec          │
│  HMR            │  Instant     │  Slow                │
│  Bundle         │  Rollup      │  Webpack             │
│  Production     │  Optimized  │  Larger             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

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

## 🏗️ 3. Bài thực hành tuần 1 (Nâng cao)

### Cấu trúc thư mục bài tập:
```
js-practice/
├── index.js
├── data/
│   └── mockData.js
└── exercises/
    ├── 1-destructuring.js
    ├── 2-array-methods.js
    ├── 3-async-await.js
    └── 4-react-integration.js
```

### 📝 Bài 1: Destructuring (Nâng cao)

```js
// ========== DATA MOCK ==========
const student = {
  id: 1001,
  fullName: "Nguyễn Văn Phu",
  scores: [8, 9, 7, 10],
  address: { city: "HCM", district: "Q1", ward: "Phường 1" },
  contacts: {
    email: "phu@email.com",
    phone: "0912345678"
  }
};

// ========== TODO ==========
// 1. Dùng destructuring lấy:
//    - fullName và id
//    - city từ address
//    - email từ contacts

// 2. Dùng nested destructuring lấy:
//    - email và phone cùng lúc
const { contact: { email, phone } } = user;

console.log(email); // nguyen@gmail.com
console.log(phone); // 0123456789

// 3. Dùng rest operator lấy MỌT THUỘC TÍNH,
//    các thuộc tính còn lại cho vào object mới
const { id, ...rest } = user;

console.log(id);   // 1
console.log(rest); // { name: "Nguyen", email: "...", phone: "..." }

// 4. Tính điểm trung bình dùng reduce
//    avg = scores.reduce((sum, score) => sum + score, 0) / scores.length

// 5. Tạo object "graduated" với:
//    - toàn bộ thuộc tính student
//    - thêm field "status: 'graduated'"
//    - thêm field "avgScore: <điểm TB>"
```

### 📝 Bài 2: Array Methods (Nâng cao)

```js
// ========== DATA MOCK ==========
const employees = [
  { id: 1, name: "Phu", dept: "IT", salary: 20000000, active: true },
  { id: 2, name: "An", dept: "Marketing", salary: 15000000, active: true },
  { id: 3, name: "Bình", dept: "IT", salary: 25000000, active: false },
  { id: 4, name: "Châu", dept: "IT", salary: 18000000, active: true },
  { id: 5, name: "Dũng", dept: "HR", salary: 12000000, active: true },
  { id: 6, name: "Hà", dept: "Marketing", salary: 16000000, active: false },
];

// ========== TODO ==========
// 1. Lọc nhân viên đang active TRONG PHÒNG IT
const itActive = employees.filter(e => e.dept === "IT" && e.active);

// 2. Tính tổng lương của nhân viên active
const totalSalary = employees
  .filter(e => e.active)
  .reduce((sum, e) => sum + e.salary, 0);

// 3. Tạo mảng tên nhân viên có lương > 18 triệu
const highEarners = employees
  .filter(e => e.salary > 18000000)
  .map(e => e.name);

// 4. Tìm nhân viên có id = 3
const found = employees.find(e => e.id === 3);

// 5. Challenge: Tính tổng lương theo từng phòng ban
// Output mong đợi: { IT: 63000000, Marketing: 31000000, HR: 12000000 }
const salaryByDept = employees.reduce((acc, e) => {
  acc[e.dept] = (acc[e.dept] || 0) + e.salary;
  return acc;
}, {});
```

### 📝 Bài 3: Async/Await (Nâng cao)

```js
// ========== MOCK API ==========
const fakeAPI = {
  users: [
    { id: 1, name: "Phu", posts: [1, 2] },
    { id: 2, name: "An", posts: [3] },
  ],
  posts: [
    { id: 1, title: "Post 1", userId: 1 },
    { id: 2, title: "Post 2", userId: 1 },
    { id: 3, title: "Post 3", userId: 2 },
  ]
};

// ========== TODO ==========
// 1. Viết function fetchUser(id) trả về user tương ứng
const fetchUser = async (id) => {
  // simulate delay
  await new Promise(r => setTimeout(r, 100));
  return fakeAPI.users.find(u => u.id === id);
};

// 2. Viết function fetchPosts(userId) trả về posts của user
const fetchPosts = async (userId) => {
  await new Promise(r => setTimeout(r, 100));
  return fakeAPI.posts.filter(p => p.userId === userId);
};

// 3. Viết function getUserWithPosts(userId)
//    Trả về object: { user: {...}, posts: [...] }
const getUserWithPosts = async (userId) => {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(userId);
  return { user, posts };
};

// 4. Challenge: Viết function getAllUsersWithPosts()
//    Lấy tất cả users và posts của họ
const getAllUsersWithPosts = async () => {
  // Gợi ý: Promise.all()
};
```

### 📝 Bài 4: React Integration

```jsx
// ========== TODO ==========

// 1. Tạo component TodoList với:
//    - State: danh sách todos từ mock data
//    - Render list todos dùng .map()
//    - Thêm tính năng toggle complete
//    - Thêm tính năng delete

const mockTodos = [
  { id: 1, text: "Học JS", completed: false },
  { id: 2, text: "Học React", completed: true },
  { id: 3, text: "Làm project", completed: false },
];

function TodoList() {
  const [todos, setTodos] = useState(mockTodos);

  const toggle = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const remove = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <ul>
      {todos.map(t => (
        <li key={t.id}>
          <span style={{
            textDecoration: t.completed ? "line-through" : "none"
          }}>
            {t.text}
          </span>
          <button onClick={() => toggle(t.id)}>
            {t.completed ? "Undo" : "Done"}
          </button>
          <button onClick={() => remove(t.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// 2. Tạo component FilterList:
//    - Hiển thị tất cả / Chỉ hiển thị completed / Chỉ hiển thị pending
```

---

## 🃏 Flashcards (Ôn lại nhanh)

### Q1: Khi nào dùng `const` vs `let`?

> **A:** Dùng `const` cho biến KHÔNG gán lại. Chỉ dùng `let` khi CẦN gán lại giá trị.

### Q2: Arrow function khác function thường ở điểm nào?

> **A:** Arrow function KHÔNG có `this` riêng - nó thừa kế từ scope cha. Rất hữu ích trong React event handlers.

### Q3: Dùng spread operator để làm gì?

> **A:** 
> - Merge arrays/objects: `[...a, ...b]`, `{...obj1, ...obj2}`
> - Copy without mutation
> - Partial update state trong React: `setForm(prev => ({ ...prev, field: value }))`

### Q4: Sự khác `map()` vs `filter()`?

> **A:** 
> - `map()`: Biến đổi MỖI phần tử → mảng mới cùng độ dài
> - `filter()`: Lọc theo điều kiện → mảng con (có thể ngắn hơn)

### Q5: Optional chaining (`?.`) để làm gì?

> **A:** Truy cập thuộc tính object mà không bị lỗi khi object/null/undefined. Trả về `undefined` thay vì crash.

---

## ✅ Checklist Hoàn Thành

- [ ] Hiểu và phân biệt được `var`/`let`/`const`
- [ ] Viết được arrow function với các cú pháp khác nhau
- [ ] Dùng thành thạo object/array destructuring
- [ ] Dùng spread operator để merge/copy objects và arrays
- [ ] Dùng được `.map()`, `.filter()`, `.reduce()`
- [ ] Viết được async/await function
- [ ] Dùng được optional chaining và nullish coalescing
- [ ] Tạo được project React với Vite
- [ ] Hoàn thành 4 bài thực hành
- [ ] Trả lời được tất cả flashcards

---

## 📖 Tài liệu tham khảo

| Tài nguyên | Link | Ghi chú |
|---|---|---|
| MDN Web Docs | [developer.mozilla.org](https://developer.mozilla.org) | Tài liệu JS chính thống |
| JavaScript.info | [javascript.info](https://javascript.info) | Giải thích cực dễ hiểu |
| Vite Docs | [vitejs.dev](https://vitejs.dev) | Docs chính thức Vite |
| ES6 Features | [es6 Features](https://es6.io) | Tổng hợp ES6 |

---

> ⏱️ **Ước tính thời gian:** 2-3 ngày học lý thuyết + 1-2 ngày thực hành.
> 🎯 **Tiêu chí hoàn thành:** Giải quyết xong bài thực hành KHÔNG cần tra cú pháp.