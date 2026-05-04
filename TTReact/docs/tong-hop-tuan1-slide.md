#TUẦN 1: MODERN JAVASCRIPT (ES6+) & REACT CƠ BẢN
##Tổng hợp nội dung - Slide thuyết trình

---

#MỤC TIÊU
- Nắm vững cú pháp JavaScript hiện đại (ES6+) cho React
- Setup môi trường phát triển với Vite
- Hoàn thành bài thực hành cơ bản

---

#PHẦN 1: MODERN JAVASCRIPT

##1.1 Biến & Scope
| Khái niệm | Cú pháp | Ghi chú |
|-----------|---------|---------|
| const | `const x = 1` | Dùng cho biến KHÔNG đổi |
| let | `let x = 1` | Dùng cho biến CẦN gán lại |
| var | `var x = 1` | TRÁNH DÙNG - function scope |

```javascript
// Sai với var (gán đè biến bên ngoài)
var name = "old";
if (true) { var name = "new"; }
console.log(name); // "new" ❌

// Đúng với let/const
let count = 0;
if (true) { let count = 1; }
console.log(count); // 0 ✅
```

##1.2 Arrow Functions
```javascript
// Cách thường
function greet(name) { return "Hello " + name; }

// Arrow function
const greet = (name) => "Hello " + name;

// Quan trọng: Arrow KHÔNG có `this` riêng - inherit từ scope cha
```

##1.3 Destructuring
```javascript
// Object destructuring
const user = { name: "Phu", age: 25 };
const { name, age } = user;

// Array destructuring
const colors = ["red", "green", "blue"];
const [first, second] = colors;

// Dùng trong React useState
const [count, setCount] = useState(0);
```

##1.4 Spread & Rest
```javascript
// Spread - trải rộng
const arr1 = [1, 2, 3];
const merged = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Spread trong React - partial update
setForm(prev => ({ ...prev, name: "New" }));

// Rest - thu gom
const { name, ...rest } = { name: "Phu", age: 25 };
// rest = { age: 25 }
```

##1.5 Template Literals
```javascript
const name = "Phu";
// Thay vì "Hello " + name
console.log(`Xin chào ${name}!`);
```

##1.6 Array Methods
```javascript
const products = [
  { id: 1, name: "Laptop", price: 25000000, inStock: true },
  { id: 2, name: "Phone", price: 15000000, inStock: false },
];

// .map() - biến đổi mỗi phần tử, TRẢ VỀ MẢNG MỚI
const names = products.map(p => p.name);
// ["Laptop", "Phone"]

// .filter() - lọc theo điều kiện, TRẢ VỀ MẢNG CON
const available = products.filter(p => p.inStock);

// .find() - tìm phần tử ĐẦU TIÊN thỏa điều kiện
const phone = products.find(p => p.name === "Phone");

// .reduce() - tổng hợp thành 1 giá trị
const total = products.reduce((sum, p) => sum + p.price, 0);
```

##1.7 Async/Await
```javascript
// Thay vì Promise chain
fetch("/api/users")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Dùng async/await
const getUsers = async () => {
  try {
    const res = await fetch("/api/users");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
```

##1.8 Optional Chaining & Nullish
```javascript
const user = null;

// Thay vì user && user.profile
user?.profile?.name // undefined - an toàn

// Nullish coalescing
const name = user?.name ?? "Khách";
```

---

#PHẦN 2: SETUP PROJECT VITE

##2.1 Cài đặt Node.js
- Tải Node.js LTS từ nodejs.org

##2.2 Tạo Project
```bash
npm create vite@latest ten-project -- --template react
cd ten-project
npm install
npm run dev
```

##2.3 Cấu trúc thư mục
```
project/
├── src/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

---

#PHẦN 3: BÀI THỰC HÀNH

##Bài 1: Destructuring
```javascript
const student = {
  id: 1001,
  fullName: "Nguyễn Văn Phu",
  scores: [8, 9, 7, 10],
  address: { city: "HCM", district: "Q1" }
};
// TODO:
// 1. Lấy fullName và id
// 2. Lấy city từ address
// 3. Tính điểm trung bình (dùng reduce)
// 4. Tạo object "graduated"
```

##Bài 2: Array Methods
```javascript
const employees = [
  { id: 1, name: "Phu", dept: "IT", salary: 20000000, active: true },
  { id: 2, name: "An", dept: "Marketing", salary: 15000000, active: true },
  { id: 3, name: "Bình", dept: "IT", salary: 25000000, active: false },
];
// TODO:
// 1. Lọc nhân viên active trong IT
// 2. Tính tổng lương nhân viên active
// 3. Tạo mảng tên lương > 18 triệu
// 4. Tìm nhân viên id = 3
```

##Bài 3: Project Setup
- Tạo project Vite
- Viết component "Hello React!"
- Đổi title thành "TTS Learning"
- Tạo Greeting component

---

#PHẦN 4: CHECKLIST

- [ ] Hiểu var/let/const
- [ ] Viết được arrow function
- [ ] Dùng destructuring
- [ ] Dùng spread operator
- [ ] Dùng .map(), .filter(), .reduce()
- [ ] Viết async/await
- [ ] Tạo project Vite
- [ ] Hoàn thành bài thực hành

---

#TÀI LIỆU THAM KHẢO
- MDN Web Docs: developer.mozilla.org
- JavaScript.info: javascript.info
- Vite Docs: vitejs.dev

---

#CẢM ƠN
- Thời gian: 2-3 ngày lý thuyết + 1-2 ngày thực hành
- Tiêu chí: Làm xong bài thực hành KHÔNG cần tra cú pháp