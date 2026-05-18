# BlueShop - Tổng kết Logic và Functions

## 1. ProductContext (src/context/ProductContext.jsx)

### State
- `products`: Danh sách sản phẩm (lưu localStorage)
- Initial data từ `src/data/products.js`

### Functions

```javascript
// Thêm sản phẩm mới
addProduct(product)
- Tạo product mới với id = Date.now()
- rating mặc định = 0
- quantity: từ form, mặc định = 0
- inStock: true nếu quantity > 0, false nếu quantity = 0

// Cập nhật sản phẩm
updateProduct(id, updatedProduct)
- Tìm product theo id
- Cập nhật quantity và inStock tự động dựa trên quantity mới

// Xóa sản phẩm
deleteProduct(id)
- Lọc bỏ sản phẩm có id tương ứng
```

## 2. Cấu trúc Product

```javascript
{
  id: number,
  name: string,
  price: number,
  category: string,        // "Laptop" | "Phone" | "Tablet" | "Accessories"
  image: string,          // URL ảnh
  description: string,
  rating: number,
  quantity: number,       // Số lượng trong kho
  inStock: boolean        // true nếu quantity > 0
}
```

## 3. Trang Home (src/pages/Home.jsx)

### Logic
- Hiển thị tất cả sản phẩm
- Mỗi sản phẩm hiển thị: ảnh, danh mục, trạng thái (Còn hàng/Hết hàng), tên, mô tả, giá
- Chỉ có nút XÓA sản phẩm (không có thêm/sửa)

### Components
- Hero section với nút "Khám phá ngay" -> /inventory
- Danh sách sản phẩm dạng list

## 4. Trang Inventory (src/pages/Inventory.jsx)

### Logic
- Tìm kiếm theo tên sản phẩm
- Lọc theo danh mục
- CRUD sản phẩm (Thêm, Sửa, Xóa)

### State
- `searchTerm`: Từ khóa tìm kiếm
- `categoryFilter`: Danh mục được chọn
- `isModalOpen`: Trạng thái modal
- `editProduct`: Sản phẩm đang sửa (null nếu thêm mới)

### Functions
```javascript
handleEdit(product)      // Mở modal sửa
handleAddNew()           // Mở modal thêm mới
handleDelete(id, name)   // Xóa sản phẩm (confirm trước)
handleCloseModal()       // Đóng modal
formatPrice(price)       // Format giá sang VND (VD: 45,000,000đ)
```

### UI
- Toolbar: Search, Filter danh mục, Nút Thêm sản phẩm
- Danh sách: Hình ảnh, Tên, Giá, Danh mục, Tồn kho ("Còn X sản phẩm")
- Nút Sửa/Xóa mỗi sản phẩm
- Footer: Tổng số sản phẩm

## 5. AddProductModal (src/components/AddProductModal.jsx)

### Props
- `isOpen`: Trạng thái mở
- `onClose`: Hàm đóng modal
- `editProduct`: Sản phẩm đang sửa (null nếu thêm mới)

### Form Fields
1. Tên sản phẩm (text, required)
2. Giá (number, required, min=0)
3. Danh mục (select: Laptop/Phone/Tablet/Accessories)
4. Link ảnh (url)
5. Mô tả (textarea)
6. Số lượng trong kho (number, required, min=0)

### Logic
- Dùng useEffect để set form data khi modal mở hoặc editProduct thay đổi
- Submit: Gọi addProduct hoặc updateProduct tùy editProduct
- Close: Reset form về giá trị mặc định

## 6. Routing (src/App.jsx)

```javascript
/               -> Home
/inventory      -> Inventory
```

## 7. Components chính

### Header (src/components/Header.jsx)
- Logo "BlueShop" -> /
- Link "Trang chủ" -> /
- Link "Kho sản phẩm" -> /inventory

### Footer (src/components/Footer.jsx)
- Copyright footer

## 8. CSS Files

- `src/css/Home.css` - Trang chủ
- `src/css/Inventory.css` - Trang kho
- `src/css/AddProductModal.css` - Modal thêm/sửa
- `src/css/Header.css` - Header
- `src/css/Footer.css` - Footer

## 9. LocalStorage Keys

- `products`: Lưu danh sách sản phẩm (JSON)

## 10. Luồng hoạt động

### Thêm sản phẩm
1. Click "Thêm sản phẩm" ở Inventory
2. Modal mở ra với form trống
3. Điền thông tin (tên, giá, danh mục, ảnh, mô tả, số lượng)
4. Submit -> gọi addProduct(productData)
5. ProductContext cập nhật state -> lưu localStorage
6. Modal đóng, danh sách cập nhật

### Sửa sản phẩm
1. Click icon sửa ở sản phẩm
2. Modal mở ra với form pre-filled
3. Sửa thông tin
4. Submit -> gọi updateProduct(id, productData)
5. ProductContext cập nhật state -> lưu localStorage

### Xóa sản phẩm
1. Click icon xóa
2. Confirm dialog
3. Gọi deleteProduct(id)
4. ProductContext cập nhật state -> lưu localStorage

### Logic Còn hàng/Hết hàng
- `inStock = quantity > 0`
- Trang Home hiển thị "Còn hàng" / "Hết hàng" dựa trên inStock
- Trang Inventory hiển thị "Còn X sản phẩm" dựa trên quantity


## 11. CSS Position

Trong CSS, `position` dùng để xác định cách phần tử được định vị (đặt vị trí) trên trang web. Có 5 loại chính:

### 1. `static` (mặc định)

```css
position: static;
```

- Đây là trạng thái mặc định của mọi thẻ HTML.
- Phần tử nằm theo luồng bình thường của trang.
- `top`, `left`, `right`, `bottom` **không hoạt động**.

```css
.box {
  position: static;
  top: 20px; /* KHÔNG có tác dụng */
}
```

📌 Dùng khi không cần định vị đặc biệt.

---

### 2. `relative`

```css
position: relative;
```

- Phần tử vẫn giữ vị trí gốc trong layout.
- Nhưng có thể dịch chuyển bằng: `top`, `left`, `right`, `bottom`

```css
.box {
  position: relative;
  top: 20px;
  left: 30px;
}
```

➡ Nghĩa là: dịch xuống 20px, dịch sang phải 30px.

📌 Đặc điểm quan trọng: vị trí cũ vẫn được giữ chỗ.

📌 Thường dùng: làm mốc cho `absolute`.

---

### 3. `absolute`

```css
position: absolute;
```

- Phần tử bị đưa ra khỏi luồng bình thường.
- **Không còn chiếm chỗ nữa.**
- Định vị dựa trên:
  - Phần tử cha gần nhất có `position` khác `static`
  - Nếu không có → dựa vào `body`

```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 0;
  right: 0;
}
```

➡ `.child` sẽ nằm góc phải trên của `.parent`.

📌 Thường dùng: badge, icon, popup, menu, overlay.

---

### 4. `fixed`

```css
position: fixed;
```

- Giống `absolute`
- Nhưng **bám theo màn hình trình duyệt**.
- Cuộn trang vẫn đứng yên.

```css
.header {
  position: fixed;
  top: 0;
}
```

➡ Header luôn nằm trên cùng dù scroll.

📌 Thường dùng: navbar, nút chat, nút back to top.

---

### 5. `sticky`

```css
position: sticky;
```

- Kết hợp giữa `relative` và `fixed`.
- Bình thường như `relative`
- Khi scroll tới vị trí chỉ định → chuyển thành `fixed`

```css
.menu {
  position: sticky;
  top: 0;
}
```

➡ Khi cuộn tới menu: menu sẽ dính trên đầu trang.

📌 Thường dùng: menu dính, sidebar dính, tiêu đề bảng.

---

### So sánh nhanh

| Loại | Chiếm chỗ? | Bám theo gì? | Scroll |
|------|-----------|--------------|--------|
| `static` | ✅ | luồng thường | cuộn bình thường |
| `relative` | ✅ | vị trí gốc của nó | cuộn |
| `absolute` | ❌ | cha gần nhất có position | cuộn |
| `fixed` | ❌ | màn hình trình duyệt | đứng yên |
| `sticky` | ✅ | cha + màn hình | dính khi cuộn |
