# PHÂN TÍCH FRONTEND WEBSITE BÁN HÀNG

> **Cập nhật:** Trang chủ (Home) đã được bổ sung chức năng CRUD đầy đủ bao gồm: Thêm, Sửa, Xóa sản phẩm trực tiếp tại trang chủ.

# 1. Giới thiệu dự án

Dự án là một website bán hàng đơn giản với giao diện hiện đại, sử dụng màu xanh dương làm chủ đạo.
Website tập trung vào trải nghiệm người dùng:
- Gọn gàng
- Dễ nhìn
- Dễ thao tác
- Responsive trên nhiều thiết bị
- **CRUD sản phẩm (Thêm, Sửa, Xóa) ngay tại trang chủ**

---

# 2. Mục tiêu hệ thống

Website cần hỗ trợ:

- Hiển thị sản phẩm
- Thêm sản phẩm
- Sửa sản phẩm
- Xóa sản phẩm
- Quản lý kho sản phẩm
- Thêm vào giỏ hàng
- Đồng bộ dữ liệu giữa các trang
- Hiển thị dữ liệu động bằng React

---

# 3. Màu sắc giao diện

| Thành phần | Màu |
|---|---|
| Primary | #2563EB |
| Primary Hover | #1D4ED8 |
| Background | #F8FAFC |
| Text | #1E293B |
| Border | #E2E8F0 |
| Success | #16A34A |
| Success BG | #DCFCE7 |
| Error/Delete | #DC2626 |
| Error BG | #FEE2E2 |
| Edit/Info | #2563EB |
| Edit BG | #EFF6FF |

---

# 4. Cấu trúc website

Website gồm 3 trang chính:

## 4.1 Trang chủ (Home)

### Chức năng
- Hiển thị sản phẩm nổi bật
- Hiển thị danh sách sản phẩm
- **Thêm sản phẩm mới (nút + Thêm sản phẩm trong Hero)**
- **Sửa sản phẩm (nút Edit trên mỗi card)**
- **Xóa sản phẩm (nút Delete trên mỗi card)**
- Cho phép thêm vào giỏ hàng
- Hiển thị sản phẩm mới được thêm từ kho

### Layout

```txt
Header
--------------------------------
Hero Banner + Buttons (Khám phá / Thêm sản phẩm)
--------------------------------
Danh sách sản phẩm + Actions (Edit/Delete)
--------------------------------
Footer
```

### Mô tả chi tiết các nút actions trên card sản phẩm

Mỗi sản phẩm hiển thị tại trang chủ đều có 2 nút:
- **Edit (Sửa):** Bút chì màu xanh dương - Mở modal sửa thông tin sản phẩm
- **Delete (Xóa):** Thùng rác màu đỏ - Xác nhận và xóa sản phẩm

### Modal Thêm/Sửa sản phẩm

Khi click "Thêm sản phẩm" hoặc nút Edit:
- **Tiêu đề:** "Thêm sản phẩm mới" / "Sửa sản phẩm"
- **Form fields:**
  - Tên sản phẩm (input text)
  - Giá (input number)
  - Danh mục (select: Laptop, Phone, Tablet, Accessories)
  - Link ảnh (input url)
  - Mô tả (textarea)
- **Nút:** Hủy / Xác nhận

---

## 4.2 Trang kho sản phẩm (Inventory)

### Chức năng
- Quản lý sản phẩm
- Thêm sản phẩm
- Sửa sản phẩm
- Xóa sản phẩm

### Layout

```txt
Header
--------------------------------
Search + Add Product Button
--------------------------------
Danh sách sản phẩm dạng ngang
--------------------------------
Footer
```

---

## 4.3 Trang giỏ hàng (Cart)

### Chức năng
- Hiển thị sản phẩm đã thêm
- Tăng giảm số lượng
- Xóa sản phẩm
- Tính tổng tiền

### Layout

```txt
Header
--------------------------------
Cart Items
--------------------------------
Total Price
--------------------------------
Checkout Button
--------------------------------
Footer
```

---

# 5. Thiết kế Header

## Thành phần

### Logo
```txt
BlueShop
```

### Menu điều hướng
- Trang chủ
- Kho sản phẩm
- Giỏ hàng

### Icon
- Icon giỏ hàng
- Hiển thị số lượng sản phẩm

---

# 6. Hero Section

## Nội dung

```txt
🔥 Công nghệ mới nhất
Mua sắm tiện lợi giá tốt
```

## Buttons

```txt
[Khám phá ngay] [Thêm sản phẩm]
```

## Thiết kế
- Background gradient xanh dương
- Text trắng
- Bo góc lớn
- Shadow nhẹ
- 2 nút: Primary (trắng) và Secondary (outline trắng)

---

# 7. Thiết kế Product Card

## Thành phần

- Ảnh sản phẩm
- Tên sản phẩm
- Giá
- Rating
- Trạng thái còn hàng
- Button thêm vào giỏ hàng

---

## Hiệu ứng

### Hover
- Card nổi lên
- Shadow đẹp

### Click Add Cart
```txt
✔ Đã thêm vào giỏ hàng
```

---

# 8. Thiết kế trang kho sản phẩm

## Hiển thị dạng list ngang

Ví dụ:

```txt
-------------------------------------------------
[ IMAGE ]

Laptop Gaming
Giá: 25.000.000đ
Tồn kho: 5

[Sửa] [Xóa]
-------------------------------------------------
```

---

# 9. Chức năng thêm sản phẩm

## Nút thêm sản phẩm

```txt
+ Thêm sản phẩm
```

## Khi click

Hiển thị popup/modal gồm:
- Tên sản phẩm
- Giá
- Ảnh
- Mô tả
- Category

---

# 10. Đồng bộ dữ liệu giữa các trang

## Flow hoạt động

Ví dụ:

```txt
Kho sản phẩm:
+ Thêm Laptop Gaming
```

=> Dữ liệu products được cập nhật

=> Trang chủ tự render lại và hiển thị sản phẩm mới

---

# 11. Quản lý state

## Sử dụng Context API

### Chức năng
- Quản lý products
- Add product
- Update product
- Delete product

---

# 12. Sử dụng Mock Data tạm thời

Trong giai đoạn đầu frontend sẽ sử dụng dữ liệu mock cứng để hiển thị giao diện trước khi kết nối backend/API.

## File dữ liệu mẫu

```js
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

---

## Mục đích sử dụng Mock Data

Mock data giúp:
- Hiển thị giao diện nhanh
- Test UI trước khi có backend
- Dễ map dữ liệu bằng React
- Dễ phát triển component

---

## Cách sử dụng

Ví dụ:

```js
products.map((product) => (
  <ProductCard key={product.id} product={product} />
))
```

---

# 13. Cấu trúc thư mục React

```txt
src/
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── ProductList.jsx
│   ├── SidebarCart.jsx
│   └── AddProductModal.jsx
│
├── pages/
│   ├── Home.jsx      (đã tích hợp CRUD)
│   ├── Inventory.jsx
│   └── Cart.jsx
│
├── context/
│   └── ProductContext.jsx
│
├── css/             (CSS riêng cho từng component/page)
│   ├── Header.css
│   ├── Footer.css
│   ├── ProductCard.css
│   ├── ProductList.css
│   ├── SidebarCart.css
│   ├── AddProductModal.css
│   ├── Home.css
│   ├── Inventory.css
│   └── Cart.css
│
├── data/
│   └── products.js
│
├── App.jsx
└── main.jsx
```

---

# 14. Công nghệ sử dụng

## Frontend
- ReactJS
- Vite

## CSS
- Tailwind CSS

## Router
- React Router DOM

## Icon
- Lucide React

---

# 15. Responsive Design

## Desktop
- Grid 4 cột

## Tablet
- Grid 2 cột

## Mobile
- Grid 1 cột

---



# 17. Phong cách UI đề xuất

Website nên theo phong cách:
- Apple
- Tiki
- Stripe
- Vercel

Ưu điểm:
- Hiện đại
- Chuyên nghiệp
- Dễ nhìn
- Dễ mở rộng

---

# 18. Tính năng CRUD trên Trang chủ

## Tổng quan

Trang chủ (Home) giờ đã hỗ trợ đầy đủ CRUD cho sản phẩm:

### 1. Thêm sản phẩm (+ Thêm sản phẩm)
- **Vị trí:** Nút trong Hero section
- **Hành động:** Click mở modal với form trống
- **Form gồm:** Tên, Giá, Danh mục, Link ảnh, Mô tả

### 2. Sửa sản phẩm (Edit)
- **Vị trí:** Nút bút chì trên mỗi card sản phẩm
- **Màu:** Xanh dương (#2563EB) với nền xanh nhạt
- **Hành động:** Click mở modal với form đã điền sẵn thông tin

### 3. Xóa sản phẩm (Delete)
- **Vị trí:** Nút thùng rác trên mỗi card sản phẩm
- **Màu:** Đỏ (#DC2626) với nền đỏ nhạt
- **Hành động:** Click hiện confirm dialog trước khi xóa

## CSS cho Actions

```css
/* Edit Button */
.action-btn-home.edit {
  background: #eff6ff;
  color: #2563eb;
}
.action-btn-home.edit:hover {
  background: #dbeafe;
}

/* Delete Button */
.action-btn-home.delete {
  background: #fef2f2;
  color: #dc2626;
}
.action-btn-home.delete:hover {
  background: #fee2e2;
}
```

---

# 19. Kết luận

Website được thiết kế theo hướng:
- Hiện đại
- Dễ phát triển
- Dễ mở rộng backend
- Trải nghiệm người dùng tốt
- **CRUD đầy đủ ngay tại trang chủ**

Kiến trúc này phù hợp để:
- Học React
- Học Context API
- Kết nối API Spring Boot
- Làm đồ án
- Phát triển thành dự án thực tế