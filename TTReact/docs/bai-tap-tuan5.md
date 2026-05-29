# Bai tap thuc hanh Tuan 5: React Router

## Hoan thanh

### Cau hinh
- [x] Cai dat react-router-dom
- [x] Cau hinh BrowserRouter trong main.jsx
- [x] Tao Routes trong App.jsx

### Pages (src/pages/)
- [x] HomePage.jsx - Trang chu
- [x] ProductsPage.jsx - Danh sach san pham (fetch tu fakestoreapi.com)
- [x] ProductDetailPage.jsx - Chi tiet san pham (useParams)
- [x] CartPage.jsx - Gio hang
- [x] AboutPage.jsx - Gioi thieu
- [x] NotFoundPage.jsx - Trang 404

### Layout
- [x] Layout.jsx - Header voi NavLink active, Outlet, Footer

### Route structure
```
/                   -> HomePage
/products           -> ProductsPage
/products/:id       -> ProductDetailPage
/cart               -> CartPage
/about              -> AboutPage
/*                  -> NotFoundPage
```

## Chay du an

```bash
npm run dev
```

## Kiem tra

- URL thay doi khi navigate, khong reload trang
- NavLink active style hoat dong
- Click san pham -> chuyen sang trang chi tiet
- Nut "Quay lai danh sach" hoat dong
- Trang 404 hien thi khi nhap URL sai
-âsdasdas
