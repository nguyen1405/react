# React Hooks

## JavaScript Operators trong React

### 1. Toán tử `&&` (Logical AND)

Dùng để hiển thị có điều kiện, thường dùng thay cho ternary operator khi không cần else.

```jsx
{isLoggedIn && <UserProfile />}
// Nếu isLoggedIn là true → hiển thị UserProfile
// Nếu isLoggedIn là false → không hiển thị gì
```

**Ví dụ:**
```jsx
function Notification({ messages }) {
  return (
    <div>
      {messages.length > 0 && (
        <div className="badge">{messages.length} new messages</div>
      )}
    </div>
  );
}
```

### 2. Toán tử `||` (Logical OR)

Dùng để set giá trị mặc định.

```jsx
const name = user.name || 'Guest';
```

### 3. Toán tử `??` (Nullish Coalescing)

Chỉ dùng giá trị mặc định khi null hoặc undefined.

```jsx
const value = data ?? 'default';
// data là null/undefined → 'default'
// data là 0 hoặc '' → giữ nguyên giá trị
```

### 4. Toán tử `? :` (Ternary)

Dùng cho điều kiện có cả if và else.

```jsx
{isLoggedIn ? <UserProfile /> : <LoginButton />}
```

### 5. Toán tử `?.` (Optional Chaining)

Truy cập property an toàn, tránh lỗi khi object null/undefined.

```jsx
user?.profile?.name
data?.items?.[0]?.title
```

### 6. Toán tử `...` (Spread)

Copy hoặc merge arrays/objects.

```jsx
const newArray = [...oldArray, newItem];
const newObj = { ...oldObj, newKey: value };
```

---

## React Hooks

## 1. useState

```jsx
const [state, setState] = useState(initialValue);
```

Dùng để quản lý state trong functional component.

**Ví dụ:**
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## 2. useEffect

```jsx
useEffect(() => {
  // side effect code
  return () => {
    // cleanup code
  };
}, [dependencies]);
```

Dùng để xử lý side effects (gọi API, subscriptions, DOM manipulation).

**Ví dụ:**
```jsx
import { useEffect, useState } from 'react';

function UserData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{data?.name}</div>;
}
```

**Lưu ý:** Luôn sử dụng async/await trong useEffect để code dễ đọc và xử lý lỗi tốt hơn với try/catch.

**Dependencies:**
- `[]` - chạy 1 lần khi mount
- `[value]` - chạy khi `value` thay đổi
- không có - chạy mỗi khi re-render

---

## 3. useContext

```jsx
const value = useContext(MyContext);
```

Dùng để truy cập context mà không cần Consumer.

**Ví dụ:**
```jsx
const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

---

## 4. useReducer

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

Dùng khi state phức tạp với nhiều logic cập nhật.

**Ví dụ:**
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

---

## 5. useRef

```jsx
const ref = useRef(initialValue);
```

Dùng để truy cập DOM elements hoặc lưu trữ giá trị không gây re-render.

**Ví dụ:**
```jsx
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

---

## 6. useMemo

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Dùng để memoize giá trị tính toán, tránh tính toán lại không cần thiết.

---

## 7. useCallback

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

Dùng để memoize function, tránh tạo function mới mỗi lần re-render.

---

## 8. useImperativeHandle

```jsx
useImperativeHandle(ref, () => ({
  methodName: () => {}
}));
```

Dùng để expose các methods ra ngoài qua ref.

---

## 9. useLayoutEffect

Giống `useEffect` nhưng chạy đồng bộ sau khi DOM thay đổi.

---

## 10. Custom Hooks

Tạo hook riêng bằng cách kết hợp các hooks có sẵn.

**Ví dụ:**
```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

---

## React Tags (JSX Elements)

### 1. Block Elements (Thẻ khối)

```jsx
// <div> - Thẻ container chính, dùng để nhóm các element khác
function Container() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

// <section> - Dùng cho một phần nội dung liên quan
<section>
  <h2>Section Title</h2>
  <p>Section content...</p>
</section>

// <header> - Phần đầu trang hoặc phần đầu của một section
<header>
  <h1>Logo</h1>
  <nav>Menu</nav>
</header>

// <footer> - Phần chân trang
<footer>
  <p>&copy; 2024 Company</p>
</footer>

// <main> - Nội dung chính của trang
<main>
  <h1>Main Content</h1>
</main>

// <article> - Nội dung độc lập (bài viết, tin tức)
<article>
  <h2>Bài viết 1</h2>
  <p>Nội dung...</p>
</article>

// <aside> - Nội dung phụ, sidebar
<aside>
  <h3>Liên quan</h3>
  <ul>...</ul>
</aside>

// <nav> - Điều hướng, menu
<nav>
  <a href="/">Trang chủ</a>
  <a href="/about">Giới thiệu</a>
</nav>
```

### 2. Text Elements (Thẻ văn bản)

```jsx
// <span> - Container inline, dùng để style một phần của text
function TextExample() {
  return (
    <p>
      Đây là text có <span style={{ color: 'red' }}>màu đỏ</span>
    </p>
  );
}

// <p> - Đoạn văn bản
<p>Đây là một đoạn văn bản.</p>

// <h1> đến <h6> - Tiêu đề (h1 lớn nhất, h6 nhỏ nhất)
<h1>Tiêu đề lớn</h1>
<h2>Tiêu đề cấp 2</h2>
<h3>Tiêu đề cấp 3</h3>
<h4>Tiêu đề cấp 4</h4>
<h5>Tiêu đề cấp 5</h5>
<h6>Tiêu đề nhỏ</h6>
```

### 3. Form Elements (Thẻ biểu mẫu)

```jsx
// <form> - Container cho form, có onSubmit để xử lý submit
function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted');
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <button type="submit">Login</button>
    </form>
  );
}

// <input> - Trường nhập liệu, các type: text, password, email, number, checkbox, radio
<input type="text" placeholder="Nhập tên" />
<input type="password" />
<input type="email" />
<input type="number" />
<input type="checkbox" />
<input type="radio" name="gender" value="male" />

// <textarea> - Ô nhập liệu nhiều dòng
<textarea rows="4" placeholder="Nhập nội dung..." />

// <select> + <option> - Danh sách chọn
<select>
  <option value="vn">Việt Nam</option>
  <option value="us">United States</option>
</select>

// <button> - Nút bấm, có type: button, submit, reset
<button type="button">Click me</button>
<button type="submit">Submit</button>
<button type="reset">Reset</button>

// <label> - Nhãn cho input, dùng htmlFor để liên kết với input
<label htmlFor="username">Tên đăng nhập</label>
<input id="username" type="text" />
```

### 4. Media (Thẻ đa phương tiện)

```jsx
// <img> - Hiển thị hình ảnh
<img 
  src="/path/to/image.jpg" 
  alt="Mô tả hình ảnh" 
  width="200" 
  height="150" 
/>

// <audio> - Phát âm thanh
<audio controls>
  <source src="/music.mp3" type="audio/mpeg" />
</audio>

// <video> - Phát video
<video controls width="400">
  <source src="/video.mp4" type="video/mp4" />
</video>
```

### 5. Lists (Thẻ danh sách)

```jsx
// <ul> - Danh sách không có thứ tự (bullet points)
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

// <ol> - Danh sách có thứ tự (số)
<ol>
  <li>Bước 1</li>
  <li>Bước 2</li>
  <li>Bước 3</li>
</ol>

// <li> - Một item trong danh sách
function MenuExample() {
  const items = ['Home', 'About', 'Contact'];
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

### 6. Links & Images

```jsx
// <a> - Link, href là đường dẫn, target="_blank" để mở tab mới
<a href="https://google.com">Google</a>
<a href="/about">Về chúng tôi</a>
<a href="https://google.com" target="_blank" rel="noopener noreferrer">
  Mở tab mới
</a>
```

### 7. Props phổ biến

```jsx
// Event handlers - Xử lý sự kiện
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />
<form onSubmit={handleSubmit} />
<div onMouseEnter={handleMouseEnter} />
<div onKeyDown={handleKeyDown} />

// Classes & Styles - CSS
<div className="container active">
<div style={{ color: 'red', fontSize: 16, padding: 10 }}>

// Value bindings - Ràng buộc giá trị
<input value={text} onChange={e => setText(e.target.value)} />
<textarea value={text} />
<select value={selected} onChange={e => setSelected(e.target.value)}>
  <option value="a">A</option>
</select>

// Conditional rendering - Hiển thị có điều kiện
<div className={isActive ? 'active' : ''}>
<img src={url || '/default.png'} alt="image" />

// Disabled & Readonly
<input disabled />
<input readOnly value="Cannot edit" />
<button disabled>Cannot click</button>
```

### 8. Fragments

```jsx
// <Fragment> hoặc <> - Nhóm elements mà không thêm thẻ div thừa
function MyComponent() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}

// Khi cần key
import { Fragment } from 'react';
function List() {
  return items.map(item => (
    <Fragment key={item.id}>
      <h3>{item.name}</h3>
      <p>{item.desc}</p>
    </Fragment>
  ));
}
```

### 9. Portals

```jsx
// Render ra ngoài DOM tree (thường dùng cho modal, tooltip)
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

### 10. Lists & Keys

```jsx
// Luôn cần key khi render list để React theo dõi thay đổi
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

// Không dùng index làm key khi danh sách có thể thay đổi thứ tự
function BadExample({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>  // Không nên
      ))}
    </ul>
  );
}
```

### 2. Props phổ biến

```jsx
// Event handlers
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />
<form onSubmit={handleSubmit} />

// Classes & Styles
<div className="container">
<div style={{ color: 'red', fontSize: 16 }}>

// Value bindings
<input value={text} onChange={e => setText(e.target.value)} />
<textarea value={text} />

// Conditional rendering
<div className={isActive ? 'active' : ''}>
<img src={url || '/default.png'} alt="image" />
```

### 3. Fragments

```jsx
// Thay thế thẻ div không cần thiết
return (
  <>
    <Component1 />
    <Component2 />
  </>
);
```

### 4. Portals

```jsx
import { createPortal } from 'react-dom';

return createPortal(
  <Modal />,
  document.getElementById('modal-root')
);
```

### 5. Lists & Keys

```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## Tóm tắt

### JavaScript Operators

| Operator | Mục đích |
|----------|----------|
| `&&` | Hiển thị có điều kiện (không có else) |
| `\|\|` | Giá trị mặc định |
| `??` | Nullish coalescing |
| `? :` | Ternary operator |
| `?.` | Optional chaining |
| `...` | Spread operator |

### React Tags

| Tag | Mục đích |
|-----|----------|
| `<div>` | Container chính |
| `<span>` | Inline container |
| `<button>` | Nút bấm |
| `<input>` | Input field |
| `<form>` | Form |
| `<img>` | Hình ảnh |
| `<a>` | Link |
| `<ul>/<ol>/<li>` | Lists |
| `<Fragment>`/`<>` | Group elements không thẻ cha |
| `createPortal` | Render ra ngoài DOM |

### React Hooks

| Hook | Mục đích |
|------|----------|
| useState | Quản lý state |
| useEffect | Side effects |
| useContext | Truy cập context |
| useReducer | State phức tạp |
| useRef | DOM ref, mutable value |
| useMemo | Memoize giá trị |
| useCallback | Memoize function |