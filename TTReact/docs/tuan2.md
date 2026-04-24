# Tuần 2: JSX, Props & Tư duy Component

> **Mục tiêu:** Hiểu và viết thành thạo JSX, truyền dữ liệu qua Props, tư duy phân tách giao diện thành các Component nhỏ tái sử dụng.

---

## 📚 1. Học gì? (Theory)

### 1.1 JSX là gì?

JSX là cú pháp **mở rộng của JavaScript** cho phép viết code trông giống HTML ngay trong file JS. Babel sẽ dịch JSX thành `React.createElement()` để trình duyệt hiểu được.

```jsx
// JSX (cách viết)
const element = <h1 className="title">Hello World</h1>;

// Babel dịch thành
const element = React.createElement(
  "h1",
  { className: "title" },
  "Hello World"
);
```

**Các quy tắc JSX khác HTML thông thường:**

```jsx
// 1. Phải có duy nhất 1 phần tử gốc (root element)
// ❌ Sai:
return (
  <h1>Title</h1>
  <p>Content</p>
);

// ✅ Dùng div wrapper:
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// ✅ Hoặc dùng Fragment (không tạo thêm DOM node):
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

// 2. Tất cả thẻ phải được đóng
// ❌ Sai: <img src="..." >
// ✅ Đúng: <img src="..." />

// 3. Dùng className thay vì class (class là từ khóa JS)
<div className="container">...</div>

// 4. Dùng htmlFor thay vì for
<label htmlFor="email">Email:</label>

// 5. Thuộc tính style là object, viết camelCase
// ❌ Sai: <div style="background-color: red; font-size: 16px">
// ✅ Đúng:
<div style={{ backgroundColor: "red", fontSize: "16px" }}>

// 6. Nhúng JS expression bằng dấu ngoặc nhọn {} 
const name = "Phu";
<h1>Xin chào, {name}!</h1>
<p>2 + 2 = {2 + 2}</p>
<p>Hôm nay: {new Date().toLocaleDateString("vi-VN")}</p>
```

---

### 1.2 Component là gì?

Component là **hàm JavaScript trả về JSX**. Mỗi component là một mảnh ghép độc lập của giao diện.

```jsx
// Cách đặt tên: PascalCase (chữ hoa đầu)
// File: src/components/UserCard.jsx

const UserCard = () => {
  return (
    <div className="card">
      <h2>Nguyễn Văn Phu</h2>
      <p>Frontend Developer</p>
    </div>
  );
};

export default UserCard;

// Dùng trong App.jsx
import UserCard from "./components/UserCard";

function App() {
  return (
    <div>
      <UserCard />
      <UserCard /> {/* Render lại nhiều lần */}
    </div>
  );
}
```

---

### 1.3 Props - Truyền dữ liệu vào Component

Props (Properties) là cơ chế **truyền dữ liệu từ Component cha xuống con** — luồng dữ liệu 1 chiều (one-way data flow).

```jsx
// Định nghĩa Component nhận props
const UserCard = ({ name, role, avatar, isOnline }) => {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{role}</p>
      {/* Conditional render */}
      {isOnline && <span className="badge-green">Online</span>}
    </div>
  );
};

// Truyền props khi sử dụng
function App() {
  return (
    <div>
      <UserCard
        name="Nguyễn Văn Phu"
        role="Frontend Developer"
        avatar="/images/phu.jpg"
        isOnline={true}
      />
      <UserCard
        name="Trần Thị An"
        role="Backend Developer"
        avatar="/images/an.jpg"
        isOnline={false}
      />
    </div>
  );
}
```

**Default Props - Giá trị mặc định:**

```jsx
const Button = ({ label = "Click me", color = "blue", onClick }) => {
  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// Dùng với default value
<Button onClick={() => alert("Clicked!")} />
// Hoặc override default
<Button label="Lưu lại" color="green" onClick={handleSave} />
```

---

### 1.4 Children Props

`props.children` cho phép truyền **nội dung JSX** lồng bên trong component, cực hữu ích để tạo các "wrapper" component.

```jsx
// Component Card wrapper
const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`card shadow-md rounded-lg p-4 ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-body">
        {children}  {/* Nội dung được truyền vào từ bên ngoài */}
      </div>
    </div>
  );
};

// Sử dụng Card như một container
function App() {
  return (
    <div>
      <Card title="Thông tin người dùng">
        <p>Tên: Nguyễn Văn Phu</p>
        <p>Email: phu@example.com</p>
      </Card>

      <Card title="Sản phẩm nổi bật" className="bg-blue-50">
        <img src="/laptop.jpg" alt="Laptop" />
        <p>Laptop Dell XPS 15</p>
        <button>Mua ngay</button>
      </Card>
    </div>
  );
}
```

---

### 1.5 Conditional Rendering (Render có điều kiện)

```jsx
const ProductCard = ({ name, price, inStock, rating }) => {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>{price.toLocaleString("vi-VN")}đ</p>

      {/* Cách 1: Toán tử && - render hoặc không render */}
      {!inStock && <span className="out-of-stock">Hết hàng</span>}
      {rating >= 4.5 && <span className="badge">⭐ Hot</span>}

      {/* Cách 2: Ternary - hiển thị một trong hai */}
      <button className={inStock ? "btn-primary" : "btn-disabled"}>
        {inStock ? "Thêm vào giỏ" : "Thông báo khi có hàng"}
      </button>

      {/* Cách 3: Biến JSX - dùng khi logic phức tạp */}
      {(() => {
        if (rating >= 4.5) return <span>🔥 Bán chạy</span>;
        if (rating >= 4.0) return <span>👍 Tốt</span>;
        return <span>Sản phẩm mới</span>;
      })()}
    </div>
  );
};
```

---

### 1.6 Render Danh sách với .map()

```jsx
const products = [
  { id: 1, name: "Laptop", price: 25000000 },
  { id: 2, name: "Phone", price: 15000000 },
  { id: 3, name: "Tablet", price: 10000000 },
];

const ProductList = () => {
  return (
    <ul>
      {products.map((product) => (
        // ❗ BẮT BUỘC phải có key - là ID duy nhất của item
        // key giúp React nhận diện và cập nhật hiệu quả
        <li key={product.id}>
          {product.name} - {product.price.toLocaleString()}đ
        </li>
      ))}
    </ul>
  );
};

// Tốt hơn: Tách thành component riêng
const ProductItem = ({ product }) => (
  <li key={product.id} className="product-item">
    <span>{product.name}</span>
    <strong>{product.price.toLocaleString()}đ</strong>
  </li>
);

const ProductList = ({ items }) => (
  <ul>
    {items.map((product) => (
      <ProductItem key={product.id} product={product} />
    ))}
  </ul>
);
```

> ⚠️ **Không dùng index làm key** (trừ khi danh sách tĩnh, không thay đổi thứ tự). Index có thể gây bug khi thêm/xóa/sắp xếp.

---

### 1.7 Tư duy phân tách Component

**Quy tắc phân tách:** Mỗi component chỉ làm 1 việc (Single Responsibility Principle).

```
App
├── Header
│   ├── Logo
│   ├── Navigation
│   └── UserAvatar
├── Main
│   ├── ProductFilter
│   └── ProductList
│       └── ProductCard (x nhiều)
└── Footer
```

```jsx
// Cấu trúc thư mục:
// src/
// ├── components/
// │   ├── layout/
// │   │   ├── Header.jsx
// │   │   └── Footer.jsx
// │   ├── product/
// │   │   ├── ProductCard.jsx
// │   │   └── ProductList.jsx
// │   └── ui/
// │       ├── Button.jsx
// │       └── Card.jsx
// └── App.jsx
```

---

## 🛠 2. Thực hành gì?

1. Dựng cấu trúc thư mục `components/` theo chuẩn trên.
2. Tạo component `Button.jsx` có props: `label`, `variant` (`primary`/`secondary`/`danger`), `onClick`.
3. Tạo component `Badge.jsx` hiển thị nhãn có màu sắc theo `type` (`success`/`warning`/`error`).
4. Thực hành truyền dữ liệu từ `App.jsx` xuống các component con.

---

## 🏗️ 3. Bài thực hành tuần 2

**Yêu cầu: Xây dựng trang "Cửa hàng sản phẩm" (Product Store)**

```js
// Dữ liệu mẫu (tạo file src/data/products.js)
export const products = [
  {
    id: 1,
    name: 'MacBook Pro 14"',
    price: 45000000,
    category: "Laptop",
    rating: 4.8,
    inStock: true,
    image: "https://picsum.photos/seed/laptop/300/200"
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: 28000000,
    category: "Phone",
    rating: 4.7,
    inStock: true,
    image: "https://picsum.photos/seed/phone/300/200"
  },
  {
    id: 3,
    name: "iPad Air",
    price: 16000000,
    category: "Tablet",
    rating: 4.5,
    inStock: false,
    image: "https://picsum.photos/seed/tablet/300/200"
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    price: 20000000,
    category: "Phone",
    rating: 4.3,
    inStock: true,
    image: "https://picsum.photos/seed/samsung/300/200"
  },
];
```

**Yêu cầu tính năng:**
1. Tạo component `ProductCard` nhận props: `name`, `price`, `category`, `rating`, `inStock`, `image`.
   - Hiển thị badge "Hết hàng" nếu `inStock = false`.
   - Hiển thị badge "⭐ Hot" nếu `rating >= 4.7`.
   - Format giá tiền kiểu VND: `45.000.000đ`.
2. Tạo component `ProductList` nhận mảng `products` và render danh sách `ProductCard`.
3. Tạo component `Header` có logo và tiêu đề trang.
4. Layout: Hiển thị sản phẩm dạng grid 2-3 cột bằng CSS.

**Cấu trúc component:**
```
App
├── Header
└── ProductList
    └── ProductCard (x4)
```

**Kết quả mong đợi:**
- 4 sản phẩm hiển thị dạng card đẹp.
- Sản phẩm hết hàng có badge đặc biệt.
- Sản phẩm rating cao có badge hot.
- Không lỗi console, không warning về `key`.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| React - Describing the UI | [react.dev/learn/describing-the-ui](https://react.dev/learn/describing-the-ui) |
| JSX In Depth | [legacy.reactjs.org/docs/jsx-in-depth.html](https://legacy.reactjs.org/docs/jsx-in-depth.html) |

---
> ⏱️ **Ước tính:** 3-4 ngày | 🎯 **Tiêu chí:** Tạo được trang Product Store không cần nhìn tutorial.
nvm là gì ?
Cách cài NVM khi gặp lỗi 'nvm' is not recognized
1. Tải NVM

Truy cập GitHub của nvm-windows:
https://github.com/coreybutler/nvm-windows/releases

Tải file:

nvm-setup.exe
2. Cài đặt NVM

Chạy file nvm-setup.exe và làm theo hướng dẫn:

Chọn thư mục cài NVM (có thể để mặc định)
Chọn thư mục Node.js (ví dụ: C:\Program Files\nodejs)
Nhấn Next → Install
3. Khởi động lại VS Code

Sau khi cài xong:

Tắt VS Code
Mở lại VS Code
4. Kiểm tra NVM

Mở Terminal trong VS Code và gõ:

nvm -v

Nếu hiện version → đã cài thành công

5. Nếu vẫn lỗi → kiểm tra PATH

Gõ:

where nvm

Nếu không ra đường dẫn → cần thêm PATH

6. Thêm PATH thủ công

Mở:

Edit environment variables

Thêm vào biến PATH:

C:\Users\<YourUser>\AppData\Roaming\nvm
C:\Program Files\nodejs

Ví dụ:

C:\Users\ADMIN\AppData\Roaming\nvm

Sau đó:

Save
Restart máy
7. Cài Node bằng NVM

Sau khi NVM hoạt động:

nvm install 18
nvm use 18
node -v

Nếu hiện version Node → OK

8. Lưu ý quan trọng
Nếu đã cài Node trước đó → nên gỡ để tránh lỗi
Nên dùng CMD hoặc PowerShell trong VS Code
Không nên dùng Git Bash (dễ lỗi với nvm-windows)
Tóm lại

Quy trình:

Tải nvm-setup.exe
Cài đặt
Restart VS Code
Kiểm tra nvm -v
Nếu lỗi → thêm PATH
Dùng nvm install và nvm use