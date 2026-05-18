# KẾ HOẠCH PHÁT TRIỂN CHỨC NĂNG GIỎ HÀNG (Shopping Cart)

## 1. Tổng quan

Chức năng giỏ hàng cho phép người dùng:
- Thêm sản phẩm vào giỏ từ danh sách sản phẩm
- Xem giỏ hàng trên trang riêng (`/cart`)
- Tăng/giảm số lượng sản phẩm trong giỏ
- Xóa sản phẩm khỏi giỏ
- Xem tổng tiền
- Dữ liệu giỏ hàng được lưu vào localStorage (không mất khi refresh)

---

## 2. Các file cần tạo mới

| # | File | Mục đích |
|---|------|----------|
| 1 | `src/context/CartContext.jsx` | Context quản lý state giỏ hàng |
| 2 | `src/pages/Cart.jsx` | Trang hiển thị giỏ hàng |
| 3 | `src/css/Cart.css` | CSS cho trang giỏ hàng |

---

## 3. Các file cần sửa

| # | File | Sửa gì |
|---|------|--------|
| 1 | `src/main.jsx` | Bọc app bằng `CartProvider` |
| 2 | `src/App.jsx` | Thêm route `/cart` |
| 3 | `src/components/Header.jsx` | Thêm icon giỏ hàng + badge số lượng |
| 4 | `src/css/Header.css` | CSS cho cart icon + badge |
| 5 | `src/components/ProductCard.jsx` | Kết nối nút "Thêm vào giỏ hàng" với CartContext |
| 6 | `src/pages/Home.jsx` | Thêm nút "Thêm vào giỏ hàng" trên mỗi card sản phẩm |

---

## 4. Phân tích chi tiết từng bước

### Bước 1: Tạo CartContext (Quản lý state giỏ hàng)

**File:** `src/context/CartContext.jsx`

**State:**
```js
const [cartItems, setCartItems] = useState([]);
// Mỗi item có dạng: { id, name, price, image, quantity }
```

**Các hàm cần có:**

| Hàm | Chức năng |
|-----|-----------|
| `addToCart(product)` | Thêm sản phẩm vào giỏ. Nếu đã có → tăng quantity +1 |
| `removeFromCart(productId)` | Xóa hoàn toàn sản phẩm khỏi giỏ |
| `increaseQuantity(productId)` | Tăng số lượng +1 |
| `decreaseQuantity(productId)` | Giảm số lượng -1. Nếu quantity = 1 → xóa luôn |
| `getCartTotal()` | Tính tổng tiền = sum(price × quantity) |
| `getCartCount()` | Tổng số lượng items trong giỏ |
| `clearCart()` | Xóa toàn bộ giỏ hàng |

**localStorage:**
- Key: `"cart"`
- Lưu mỗi khi `cartItems` thay đổi (dùng useEffect)
- Load lại khi app khởi động

**Cấu trúc Cart_Item:**
```js
{
  id: 1716012345678,       // ID sản phẩm
  name: "Laptop Gaming",   // Tên
  price: 25000000,         // Giá đơn vị
  image: "https://...",    // Ảnh
  quantity: 2,             // Số lượng trong giỏ
}
```

---

### Bước 2: Bọc App bằng CartProvider

**File:** `src/main.jsx`

```jsx
import { CartProvider } from './context/CartContext';

<ProductProvider>
  <CartProvider>
    <App />
  </CartProvider>
</ProductProvider>
```

---

### Bước 3: Thêm route /cart

**File:** `src/App.jsx`

```jsx
import Cart from './pages/Cart';

<Route path="/cart" element={<Cart />} />
```

---

### Bước 4: Thêm Cart Icon + Badge vào Header

**File:** `src/components/Header.jsx`

```txt
┌─────────────────────────────────────────────────┐
│  BlueShop    Trang chủ  Kho sản phẩm   🛒 (3)  │
└─────────────────────────────────────────────────┘
```

**Logic:**
- Import `useCart` từ CartContext
- Lấy `getCartCount()` để hiển thị badge
- Click icon → navigate đến `/cart`
- Nếu giỏ trống → không hiện badge

**CSS badge:**
```css
.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

### Bước 5: Kết nối nút "Thêm vào giỏ hàng" với CartContext

**File:** `src/components/ProductCard.jsx`

Hiện tại đã có nút và hàm `handleAddToCart`, nhưng `addToCart` lấy từ `ProductContext` (chưa implement). Cần đổi sang dùng `CartContext`:

```jsx
import { useCart } from '../context/CartContext';

const { addToCart } = useCart();

const handleAddToCart = () => {
  if (!product.inStock) return;
  addToCart(product);
  setIsAdded(true);
  setTimeout(() => setIsAdded(false), 1500);
};
```

**Trạng thái nút:**
| Trạng thái | Text | Màu |
|---|---|---|
| Còn hàng | 🛒 Thêm vào giỏ hàng | Xanh dương |
| Đã thêm (1.5s) | ✔ Đã thêm vào giỏ hàng | Xanh lá |
| Hết hàng | 🛒 Thêm vào giỏ hàng | Xám (disabled) |

---

### Bước 6: Thêm nút "Thêm vào giỏ hàng" trên trang Home

**File:** `src/pages/Home.jsx`

Hiện tại trang Home chỉ có nút Xóa. Cần thêm nút giỏ hàng:

```jsx
import { useCart } from '../context/CartContext';

const { addToCart } = useCart();

// Trong product-item-actions-home:
<button
  onClick={() => addToCart(product)}
  disabled={!product.inStock}
  className="action-btn-home cart"
>
  <ShoppingCart className="w-4 h-4" />
</button>
```

---

### Bước 7: Tạo trang Cart

**File:** `src/pages/Cart.jsx`

**Layout:**
```txt
┌─────────────────────────────────────────────────────┐
│  Header                                             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Giỏ hàng của bạn (3 sản phẩm)                    │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ [IMG]  Laptop Gaming                          │  │
│  │        25.000.000đ                            │  │
│  │        [-] 2 [+]        50.000.000đ    [🗑]  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ [IMG]  iPhone 15 Pro                          │  │
│  │        28.000.000đ                            │  │
│  │        [-] 1 [+]        28.000.000đ    [🗑]  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Tổng cộng:                        78.000.000đ     │
│                                                     │
│  [Xóa tất cả]              [Thanh toán]            │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer                                             │
└─────────────────────────────────────────────────────┘
```

**Khi giỏ hàng trống:**
```txt
┌─────────────────────────────────────────┐
│                                         │
│        🛒                               │
│   Giỏ hàng trống                       │
│   Hãy thêm sản phẩm vào giỏ hàng      │
│                                         │
│   [Tiếp tục mua sắm]                   │
│                                         │
└─────────────────────────────────────────┘
```

**Mỗi Cart Item hiển thị:**
| Thành phần | Mô tả |
|---|---|
| Ảnh sản phẩm | Thumbnail nhỏ |
| Tên sản phẩm | product.name |
| Giá đơn vị | Format VNĐ |
| Nút [-] | Giảm số lượng |
| Số lượng | Hiển thị quantity |
| Nút [+] | Tăng số lượng |
| Thành tiền | price × quantity |
| Nút xóa | Xóa item khỏi giỏ |

---

## 5. Flow hoạt động chi tiết

### Flow 1: Thêm sản phẩm vào giỏ

```txt
User click "Thêm vào giỏ hàng"
        │
        ▼
Kiểm tra product.inStock === true?
        │
    ┌───┴───┐
   NO      YES
    │       │
 (disabled) ▼
        addToCart(product) được gọi
        │
        ▼
    Kiểm tra: product đã có trong cart chưa?
        │
    ┌───┴───┐
   CÓ      CHƯA
    │       │
    ▼       ▼
 quantity++ Thêm mới với quantity = 1
        │
        ▼
    cartItems state cập nhật
        │
        ▼
    useEffect lưu vào localStorage
        │
        ▼
    Header badge cập nhật số lượng
        │
        ▼
    Nút đổi thành "✔ Đã thêm" (1.5s)
```

### Flow 2: Tăng/Giảm số lượng

```txt
User click [+] hoặc [-]
        │
    ┌───┴───┐
   [+]     [-]
    │       │
    ▼       ▼
 qty++   qty > 1?
            │
        ┌───┴───┐
       YES     NO (qty = 1)
        │       │
        ▼       ▼
     qty--   Xóa item khỏi cart
        │
        ▼
    Tổng tiền tự động tính lại
    Badge header cập nhật
    localStorage cập nhật
```

### Flow 3: Xóa sản phẩm khỏi giỏ

```txt
User click nút 🗑 (xóa)
        │
        ▼
removeFromCart(productId)
        │
        ▼
Lọc bỏ item có id tương ứng
        │
        ▼
cartItems cập nhật → re-render
Tổng tiền tính lại
Badge header giảm
localStorage cập nhật
```

---

## 6. Cấu trúc dữ liệu

### localStorage key: "cart"

```json
[
  {
    "id": 1,
    "name": "MacBook Pro 14\"",
    "price": 45000000,
    "image": "https://picsum.photos/seed/laptop/300/200",
    "quantity": 2
  },
  {
    "id": 2,
    "name": "iPhone 15 Pro",
    "price": 28000000,
    "image": "https://picsum.photos/seed/phone/300/200",
    "quantity": 1
  }
]
```

---

## 7. Thứ tự triển khai (Step by step)

| Bước | Công việc | Ưu tiên |
|------|-----------|---------|
| 1 | Tạo `CartContext.jsx` với đầy đủ hàm | 🔴 Cao |
| 2 | Bọc app bằng `CartProvider` trong `main.jsx` | 🔴 Cao |
| 3 | Thêm route `/cart` trong `App.jsx` | 🔴 Cao |
| 4 | Sửa `ProductCard.jsx` — kết nối `addToCart` từ CartContext | 🔴 Cao |
| 5 | Sửa `Home.jsx` — thêm nút giỏ hàng trên card | 🟡 Trung bình |
| 6 | Sửa `Header.jsx` — thêm cart icon + badge | 🟡 Trung bình |
| 7 | Tạo `Cart.jsx` — trang giỏ hàng đầy đủ | 🔴 Cao |
| 8 | Tạo `Cart.css` — style cho trang giỏ hàng | 🟡 Trung bình |
| 9 | Test toàn bộ flow | 🟢 Cuối |

---

## 8. Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| React Context API | Quản lý state giỏ hàng |
| useState + useEffect | State management + localStorage sync |
| react-router-dom | Route `/cart` |
| lucide-react | Icons (ShoppingCart, Plus, Minus, Trash2) |
| localStorage | Lưu trữ giỏ hàng |
| Intl.NumberFormat | Format giá VNĐ |

---

## 9. Giao diện đề xuất

### Màu sắc cho Cart

| Thành phần | Màu |
|---|---|
| Nút tăng/giảm | #2563EB (xanh dương) |
| Nút xóa item | #DC2626 (đỏ) |
| Badge giỏ hàng | #EF4444 (đỏ) |
| Tổng tiền | #1E293B (đen đậm) |
| Nút thanh toán | #2563EB (xanh dương) |
| Nút xóa tất cả | #DC2626 (đỏ) outline |
| Empty state text | #64748B (xám) |

---

## 10. Lưu ý quan trọng

1. **Không trùng lặp:** Khi thêm sản phẩm đã có trong giỏ → chỉ tăng quantity, KHÔNG tạo item mới
2. **Giảm về 0 = xóa:** Khi quantity giảm xuống 1 mà user bấm [-] → xóa luôn item
3. **Hết hàng = disabled:** Sản phẩm hết hàng không thể thêm vào giỏ
4. **Đồng bộ real-time:** Badge header luôn cập nhật khi giỏ thay đổi
5. **Persist data:** Giỏ hàng không mất khi refresh trang (localStorage)
6. **Format tiền VNĐ:** Luôn hiển thị đúng format (25.000.000đ)
