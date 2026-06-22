# Tuần 9: TanStack Query (React Query) - Server State Management

> **Mục tiêu:** Thay thế hoàn toàn pattern `useEffect + useState` để fetch API bằng TanStack Query — caching tự động, refetch thông minh, optimistic updates.

---

## 📚 1. Học gì? (Theory)

### 1.1 Vấn đề với useEffect + useState thuần

```jsx
// ❌ Pattern cũ - phải tự quản lý quá nhiều thứ
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // Vấn đề:
  // 1. Race condition khi component unmount trong khi đang fetch
  // 2. Không có cache - navigate đi rồi về → fetch lại từ đầu
  // 3. Không tự refresh khi user quay lại tab
  // 4. Phải tự quản lý loading/error state ở mọi component
  // 5. Khó implement pagination, optimistic updates
};
```

---

### 1.2 Cài đặt và Setup

```bash
npm install @tanstack/react-query
# Tùy chọn: DevTools để debug
npm install @tanstack/react-query-devtools
```

```jsx
// src/main.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // Data "tươi" trong 5 phút
      cacheTime: 10 * 60 * 1000,   // Cache tồn tại 10 phút
      retry: 2,                      // Retry 2 lần khi lỗi
      refetchOnWindowFocus: true,    // Refetch khi user quay lại tab
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    {/* Chỉ hiện DevTools trong development */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

---

### 1.3 `useQuery` - Lấy dữ liệu

```jsx
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

// ✅ Pattern mới - đơn giản và mạnh mẽ hơn nhiều
const ProductsPage = () => {
  const {
    data: products,    // Dữ liệu trả về
    isLoading,          // true khi chưa có data lần đầu
    isFetching,         // true khi đang fetch (kể cả background refetch)
    isError,
    error,
    refetch,            // Hàm để manual refetch
  } = useQuery({
    queryKey: ["products"],        // Key duy nhất cho query này (dùng để cache)
    queryFn: () => productService.getAll(), // Hàm fetch data
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message={error.message} />;

  return (
    <div>
      {/* isFetching: đang background refetch */}
      {isFetching && <span className="badge">Đang cập nhật...</span>}
      <ProductList products={products} />
      <button onClick={refetch}>Làm mới</button>
    </div>
  );
};
```

---

### 1.4 Query Key - Khóa cache thông minh

```jsx
// Query key phải là mảng, có thể lồng nhau
// React Query sẽ re-fetch khi queryKey thay đổi

// Fetch sản phẩm theo trang
const { data } = useQuery({
  queryKey: ["products", { page: 1, limit: 10 }], // Khi page/limit thay đổi → re-fetch
  queryFn: () => productService.getAll({ page: 1, limit: 10 }),
});

// Fetch chi tiết 1 sản phẩm theo ID
const { id } = useParams();
const { data: product } = useQuery({
  queryKey: ["products", id],    // Cache riêng cho từng ID
  queryFn: () => productService.getById(id),
  enabled: !!id,                  // Chỉ fetch khi id tồn tại
});

// Fetch sản phẩm với filters
const { data: filteredProducts } = useQuery({
  queryKey: ["products", "list", filters], // Khi filters đổi → fetch lại
  queryFn: () => productService.getAll(filters),
  keepPreviousData: true, // Giữ data cũ trong khi fetch mới (tốt cho pagination)
});
```

---

### 1.5 `useMutation` - Thay đổi dữ liệu

```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddProductForm = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newProduct) => productService.create(newProduct),

    // Sau khi mutation thành công
    onSuccess: (createdProduct) => {
      // Cách 1: Invalidate query → React Query sẽ tự fetch lại
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Cách 2: Update cache trực tiếp (không cần network request)
      queryClient.setQueryData(["products"], (oldData) => [
        ...(oldData || []),
        createdProduct,
      ]);

      alert("Thêm sản phẩm thành công!");
    },

    onError: (error) => {
      alert(`Lỗi: ${error.message}`);
    },
  });

  const handleSubmit = (formData) => {
    createMutation.mutate(formData); // Gọi mutation
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button
        type="submit"
        disabled={createMutation.isPending} // Disable khi đang gửi
      >
        {createMutation.isPending ? "Đang lưu..." : "Lưu sản phẩm"}
      </button>
    </form>
  );
};
```

---

### 1.6 Optimistic Updates (Cập nhật tức thì không cần chờ server)

```jsx
const toggleTodoMutation = useMutation({
  mutationFn: ({ id, done }) => todoService.update(id, { done }),

  // 1. Cập nhật cache TRƯỚC khi request hoàn thành (optimistic)
  onMutate: async ({ id, done }) => {
    // Hủy bất kỳ refetch nào đang chạy để tránh override
    await queryClient.cancelQueries({ queryKey: ["todos"] });

    // Lưu data cũ để rollback nếu cần
    const previousTodos = queryClient.getQueryData(["todos"]);

    // Cập nhật cache ngay lập tức
    queryClient.setQueryData(["todos"], (old) =>
      old.map(todo => todo.id === id ? { ...todo, done } : todo)
    );

    return { previousTodos }; // Context để dùng trong onError
  },

  // 2. Nếu server trả về lỗi → rollback về data cũ
  onError: (err, variables, context) => {
    queryClient.setQueryData(["todos"], context.previousTodos);
  },

  // 3. Dù thành công hay thất bại → đồng bộ với server
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

---

### 1.7 Infinite Scroll với `useInfiniteQuery`

```jsx
import { useInfiniteQuery } from "@tanstack/react-query";

const InfiniteProductList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      productService.getAll({ page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage, pages) => {
      // Trả về page tiếp theo, hoặc undefined nếu hết
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  // Gộp tất cả pages thành 1 mảng
  const products = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div>
      <ProductGrid products={products} />
      {hasNextPage && (
        <button
          onClick={fetchNextPage}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
        </button>
      )}
    </div>
  );
};
```

---

## 🛠 2. Thực hành gì?

1. Cài đặt `@tanstack/react-query` và `ReactQueryDevtools`.
2. Refactor `ProductsPage` từ `useEffect+useState` sang `useQuery`.
3. Refactor `ProductDetailPage` dùng `useQuery` với `queryKey: ["products", id]`.
4. Implement "Thêm sản phẩm" form với `useMutation`.

---

## 🏗️ 3. Bài thực hành tuần 9

**Yêu cầu: Xây dựng "Hệ thống quản lý ghi chú" (Note Manager)**

Dùng API giả lập từ JSONPlaceholder Posts.

**Tính năng:**
1. **Danh sách ghi chú**: `useQuery({ queryKey: ["notes"] })` lấy từ JSONPlaceholder.
2. **Tìm kiếm**: Filter theo tiêu đề bằng `useMemo` (không cần API).
3. **Thêm ghi chú**: `useMutation` → `POST /posts` → Optimistic update cache.
4. **Xóa ghi chú**: `useMutation` → `DELETE /posts/:id` → Remove khỏi cache.
5. **Chỉnh sửa**: Click vào ghi chú → show inline edit form → `useMutation` UPDATE.
6. **DevTools**: Mở Devtools để xem cache, queries đang chạy.

**Bonus - Infinite Scroll:**
- Implement "Load More" thay vì pagination thông thường, dùng `useInfiniteQuery`.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| TanStack Query Docs | [tanstack.com/query/latest](https://tanstack.com/query/latest) |
| Query Key Conventions | [tanstack.com/query/latest/docs/framework/react/guides/query-keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys) |

---
> ⏱️ **Ước tính:** 4-5 ngày | 🎯 **Tiêu chí:** Note Manager đủ CRUD, cache hoạt động đúng (navigate không refetch lại).
