# Phân Tích Tuần 9: TanStack Query (React Query) — Server State Management

> Tài liệu phân tích chi tiết — giảng giải cách học, định nghĩa & cách dùng từng khái niệm

---

## Mục Lục

1. [Tổng quan & Bối cảnh](#1-tổng-quan--bối-cảnh)
2. [Setup & QueryClient Configuration](#2-setup--queryclient-configuration)
3. [useQuery — Lấy dữ liệu](#3-usequery--lấy-dữ-liệu)
4. [Query Key — Khóa Cache Thông Minh](#4-query-key--khóa-cache-thông-minh)
5. [useMutation — Thay đổi dữ liệu](#5-usemutation--thay-đổi-dữ-liệu)
6. [Optimistic Updates — Cập nhật tức thì](#6-optimistic-updates--cập-nhật-tức-thì)
7. [useInfiniteQuery — Infinite Scroll](#7-useinfinitequery--infinite-scroll)
8. [Phương Pháp Học Theo Ngày](#8-phương-pháp-học-theo-ngày)
9. [Bài Tập Note Manager — Hướng Dẫn Từng Bước](#9-bài-tập-note-manager--hướng-dẫn-từng-bước)

---

## 1. Tổng Quan & Bối Cảnh

### TanStack Query giải quyết vấn đề gì?

| Vấn đề của `useEffect + useState` | Giải pháp TanStack Query |
|---|---|
| Phải tự quản lý `loading`, `error`, `data` ở mọi component | `useQuery` trả về sẵn `isLoading`, `isError`, `data`, `error` |
| Race condition khi unmount component giữa chừng fetch | Tự động cancel request khi component unmount |
| Navigate đi rồi về → fetch lại từ đầu, không cache | Cache tự động theo `queryKey`, navigate về không cần fetch lại |
| Không tự refresh khi user quay lại tab | `refetchOnWindowFocus: true` — tự động refetch |
| Pagination, Optimistic Updates code cực kỳ phức tạp | `useInfiniteQuery`, `onMutate` handle sẵn |

### Cách học:

- **Hiểu vấn đề trước**: Viết 1 component fetch data với `useEffect + useState` → thấy đau → mới thấy sức mạnh của TanStack Query.
- **TanStack Query ≠ Redux**: Nó quản lý **server state** (dữ liệu từ API), không phải client state (UI state, form state).
- **Nguyên tắc**: Cache là nguồn sự thật — ko cần gọi API lại nếu cache còn tươi.

---

## 2. Setup & QueryClient Configuration

### Định nghĩa

| Khái niệm | Định nghĩa | Cách dùng |
|---|---|---|
| **QueryClient** | Instance quản lý cache, retry, refetch cho toàn app | `new QueryClient({ defaultOptions: { queries: { ... } } })` |
| **QueryClientProvider** | React context provider — inject QueryClient vào toàn app | Bọc quanh `<App />` |
| **ReactQueryDevtools** | Chrome DevTools-like để debug cache, queries | Chỉ dùng trong development |
| **staleTime** | Thời gian data được coi là "tươi" (chưa cũ) | Mặc định 0ms — set lên 5-30 phút cho dữ liệu ít thay đổi |
| **cacheTime** | Thời gian cache tồn tại sau khi không còn component nào dùng | Mặc định 5 phút |
| **refetchOnWindowFocus** | Tự động refetch khi user quay lại tab | Mặc định `true` |

### Cách dùng

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 phút — data "tươi" trong 5p
      cacheTime: 10 * 60 * 1000,   // 10 phút — giữ cache 10p sau khi unmount
      retry: 2,                      // Retry 2 lần khi lỗi
      refetchOnWindowFocus: true,    // Tự động refetch
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

### Cách học:

- **staleTime** ≠ **cacheTime**:
  - `staleTime`: data còn "tươi" → ko fetch lại. Hết hạn → data "cũ" → sẽ refetch khi cần.
  - `cacheTime`: data giữ trong cache bao lâu sau khi ko component nào dùng. Hết hạn → xóa khỏi cache.
- **Công thức thực tế**: `staleTime = 5 phút`, `cacheTime = 10 phút` cho hầu hết API.
- **refetchOnWindowFocus**: Cực kỳ hữu ích cho production — user quay lại tab thấy data mới ngay.

---

## 3. useQuery — Lấy dữ liệu

### Định nghĩa

```jsx
const {
  data,         // Dữ liệu trả về từ queryFn
  isLoading,    // true khi chưa có data LẦN ĐẦU
  isFetching,   // true khi đang fetch (kể cả background refetch)
  isError,      // true khi có lỗi
  error,        // Object lỗi
  refetch,      // Hàm manual refetch
  isSuccess,    // true khi fetch thành công
  isStale,      // true khi data đã cũ (hết staleTime)
} = useQuery({
  queryKey: ["products"],         // Key duy nhất để cache
  queryFn: () => fetch("/api/products").then(r => r.json()), // Function fetch
  enabled: boolean,                // true → fetch, false → không fetch
  staleTime: number,               // Override default staleTime
  cacheTime: number,               // Override default cacheTime
  refetchInterval: number,         // Polling — tự động fetch mỗi X ms
  select: (data) => data.items,    // Transform data sau khi fetch
  keepPreviousData: boolean,       // Giữ data cũ khi fetch page mới
});
```

### Cách dùng — So sánh Pattern cũ vs mới

```jsx
// ❌ PATTERN CŨ: useEffect + useState
const ProductsPageOld = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  // Vấn đề: Ko cache, ko retry, ko cancel, ko refetch, phải tự quản lý 3 state
};

// ✅ PATTERN MỚI: useQuery
const ProductsPageNew = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAll(),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message={error.message} />;
  return <ProductList products={products} />;
  // Lợi ích: Cache tự động, retry, refetch, loading/error state có sẵn
};
```

### Phân biệt isLoading vs isFetching

| State | Ý nghĩa | Khi nào `true` |
|---|---|---|
| `isLoading` | Chưa có data lần đầu | Lần đầu tiên fetch, chưa có gì trong cache |
| `isFetching` | Đang có request API | Lần đầu + background refetch |

```
Lần đầu:
  isLoading = true, isFetching = true  → show spinner toàn trang

User navigate đi, quay lại (cache còn):
  isLoading = false (có data trong cache)
  isFetching = true (đang kiểm tra API)
  → ko cần spinner, chỉ hiển thị badge nhỏ "đang cập nhật..."

User focus lại tab:
  isLoading = false, isFetching = true → refetch background
  → ko ảnh hưởng UI, data tự cập nhật
```

### Cách học:

- `isLoading` → show spinner. `isFetching` → show badge nhỏ.
- `enabled: false` → tạm dừng query. Dùng khi fetch phụ thuộc vào điều kiện (vd: có ID mới fetch).
- `refetchInterval: 30000` → auto polling mỗi 30s (cực kỳ hữu ích cho real-time dashboard).

---

## 4. Query Key — Khóa Cache Thông Minh

### Định nghĩa

| Cấu trúc | Ví dụ | Khi nào re-fetch |
|---|---|---|
| **Đơn giản** | `["products"]` | Một lần duy nhất, dùng chung cache |
| **Có params** | `["products", { page, limit }]` | Khi `page` hoặc `limit` thay đổi |
| **Có ID** | `["products", id]` | Mỗi ID có cache riêng |
| **Phân cấp** | `["products", "list", filters]` | Rõ ràng, dễ invalidate từng phần |

### Cách dùng

```jsx
// 1. Danh sách sản phẩm — cache key là ["products"]
// Nếu bất kỳ component nào dùng key này đều share cache
useQuery({
  queryKey: ["products"],
  queryFn: () => productService.getAll(),
});

// 2. Chi tiết sản phẩm — mỗi id có cache riêng
// Khi id thay đổi, tự động fetch sản phẩm mới
const { id } = useParams();
useQuery({
  queryKey: ["products", id],    // ← id thay đổi → key thay đổi → fetch lại
  queryFn: () => productService.getById(id),
  enabled: !!id,                  // Không fetch khi chưa có id
});

// 3. Phân trang + lọc
const [page, setPage] = useState(1);
const [filters, setFilters] = useState({});
useQuery({
  queryKey: ["products", "list", page, filters],
  queryFn: () => productService.getAll({ page, ...filters }),
  keepPreviousData: true,  // Giữ data cũ khi chuyển trang
});
```

### Nguyên tắc Query Key Hierarchy

```
["products"]             ← Invalidate tất cả products
["products", "list"]     ← Invalidate danh sách (ko ảnh hưởng chi tiết)
["products", "list", 1]  ← Invalidate page 1
["products", 123]        ← Invalidate chi tiết sản phẩm 123
["products", 123, "reviews"] ← Invalidate reviews của sản phẩm 123
```

### Cách học:

- **Query key là mảng** — không phải string. Phần tử đầu là namespace, phần tử sau là identifier.
- **Nếu query key thay đổi → tự động re-fetch** (ko cần dependency array như `useEffect`).
- `enabled` kiểm soát khi nào fetch — dùng cho trường hợp fetch phụ thuộc vào user action (vd: click mới fetch).
- `keepPreviousData: true` — khi chuyển trang giữ data cũ trong lúc fetch, UI ko bị nhấp nháy.

---

## 5. useMutation — Thay đổi dữ liệu

### Định nghĩa

```jsx
const mutation = useMutation({
  mutationFn: (variables) => api.create(variables), // Hàm thay đổi data

  onSuccess: (data, variables, context) => {
    // ✅ Thành công — invalidate cache để đồng bộ
  },
  onError: (error, variables, context) => {
    // ❌ Thất bại — báo lỗi user
  },
  onSettled: (data, error, variables, context) => {
    // 🔄 Luôn chạy dù thành công hay thất bại
  },
});
```

### Cách dùng — CRUD Operations

```jsx
const queryClient = useQueryClient();

// 🟢 CREATE
const createMutation = useMutation({
  mutationFn: (newProduct) => productService.create(newProduct),
  onSuccess: () => {
    // Cách 1: Invalidate → tự động fetch lại danh sách
    queryClient.invalidateQueries({ queryKey: ["products"] });

    // Cách 2: Set cache trực tiếp (nhanh hơn, ko cần network)
    // queryClient.setQueryData(["products"], (old) => [...(old || []), newProduct]);
  },
});

// 🟡 UPDATE
const updateMutation = useMutation({
  mutationFn: ({ id, ...data }) => productService.update(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    // Có thể invalidate chi tiết sản phẩm nếu cần
    queryClient.invalidateQueries({ queryKey: ["products", id] });
  },
});

// 🔴 DELETE
const deleteMutation = useMutation({
  mutationFn: (id) => productService.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  },
});
```

### Quy tắc:

| Sau mutation | Nên làm | Giải thích |
|---|---|---|
| **Thành công** | `invalidateQueries` | Đánh dấu cache cũ → tự động fetch lại data mới |
| **Thành công (cần speed)** | `setQueryData` | Cập nhật cache trực tiếp, ko cần gọi API lại |
| **Thất bại** | `onError` xử lý + ko invalidate | Cache giữ nguyên data cũ |
| **Luôn luôn** | `onSettled` | Cleanup, log, etc. |

### Cách học:

- **Mutation ≠ Query**: Query đọc, Mutation ghi (C.U.D trong CRUD).
- `invalidateQueries` với queryKey → React Query tự fetch lại data mới.
- `mutate` vs `mutateAsync`: `mutate` ko trả về promise, `mutateAsync` trả về promise để bạn `await`.
- `isPending` → disable button khi đang gửi.

---

## 6. Optimistic Updates — Cập nhật tức thì

### Định nghĩa

**Optimistic Update**: Cập nhật UI **ngay lập tức** trước khi server phản hồi, rồi rollback nếu lỗi.

### Quy trình lifecycle

```
User click "Toggle done"
  │
  ▼
onMutate: ① Cancel refetch → ② Lưu data cũ → ③ Update cache ngay
  │
  ├─ Server thành công → onSettled: invalidate cache (đồng bộ)
  │
  └─ Server lỗi → onError: Rollback về data cũ
```

### Cách dùng

```jsx
const toggleTodoMutation = useMutation({
  mutationFn: ({ id, done }) => todoService.update(id, { done }),

  // BƯỚC 1 — Chạy NGAY TRƯỚC khi mutationFn
  onMutate: async ({ id, done }) => {
    // Hủy refetch đang chạy để tránh nó ghi đè cache
    await queryClient.cancelQueries({ queryKey: ["todos"] });

    // Lưu snapshot data cũ (để rollback nếu lỗi)
    const previousTodos = queryClient.getQueryData(["todos"]);

    // Update cache ngay — user thấy UI thay đổi tức thì
    queryClient.setQueryData(["todos"], (old) =>
      old.map(todo => todo.id === id ? { ...todo, done } : todo)
    );

    // Trả context để dùng trong onError
    return { previousTodos };
  },

  // BƯỚC 2 — Nếu lỗi → khôi phục data cũ
  onError: (err, variables, context) => {
    queryClient.setQueryData(["todos"], context.previousTodos);
  },

  // BƯỚC 3 — Dù thành công hay thất bại → đồng bộ lại với server
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

### Khi nào dùng Optimistic Updates?

| Dùng ✅ | Không dùng ❌ |
|---|---|
| Toggle (like, done, follow) | Form submit (cần validation từ server) |
| Upvote/downvote | Payment transaction |
| Thao tác nhanh, nhẹ | Upload file |
| User biết chắc 90% thành công | User cần biết kết quả chính xác |

### Cách học:

- `onMutate` chạy **trước** `mutationFn` — dùng để update cache ngay.
- Luôn `cancelQueries` trước để tránh race condition.
- Luôn snapshot data cũ và trả về từ `onMutate` → `context` trong `onError`.
- Luôn `onSettled` → `invalidateQueries` để cache đồng bộ với server.

---

## 7. useInfiniteQuery — Infinite Scroll

### Định nghĩa

```jsx
const {
  data,              // { pages: [...], pageParams: [...] }
  fetchNextPage,     // Gọi để load page tiếp theo
  fetchPreviousPage, // Gọi để load page trước
  hasNextPage,       // boolean — còn page tiếp không?
  isFetchingNextPage,// đang fetch page tiếp
  isFetching,        // đang fetch bất kỳ
} = useInfiniteQuery({
  queryKey: ["products", "infinite"],
  queryFn: ({ pageParam = 1 }) =>
    productService.getAll({ page: pageParam, limit: 12 }),
  getNextPageParam: (lastPage, allPages) => {
    // lastPage: data của page vừa fetch
    // allPages: tất cả pages đã fetch
    // Trả về pageParam tiếp theo, hoặc undefined nếu hết
    if (lastPage.hasMore) return allPages.length + 1;
    return undefined; // undefined → hasNextPage = false
  },
});
```

### Cách dùng

```jsx
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
      // Giả sử API trả về { items: [...], total: 50 }
      // pages.length = số pages đã load
      // Nếu còn items chưa load → return page tiếp
      return lastPage.items.length === 12 ? pages.length + 1 : undefined;
    },
  });

  // Gộp tất cả items từ các pages
  const products = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div>
      <ProductGrid products={products} />
      <button
        onClick={fetchNextPage}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? "Đang tải..." : "Xem thêm"}
      </button>
    </div>
  );
};
```

### So sánh Pagination vs Infinite Scroll

| Pagination (`keepPreviousData`) | Infinite Scroll (`useInfiniteQuery`) |
|---|---|
| Nút "1 2 3 ..." | Nút "Xem thêm" hoặc auto load khi scroll |
| Dữ liệu mỗi page riêng biệt | Dữ liệu gộp dần |
| Back button hoạt động tốt | Back button không chính xác |
| Dùng cho danh sách có số trang ít | Dùng cho feed, blog, social media |

### Cách học:

- `data.pages` là mảng các page — dùng `flatMap` để gộp.
- `getNextPageParam` quyết định có còn page tiếp không. Trả `undefined` → `hasNextPage = false`.
- Kết hợp với Intersection Observer cho auto-load khi scroll đến cuối.

---

## 8. Phương Pháp Học Theo Ngày

### Lộ trình 5 ngày

| Ngày | Chủ đề | Hành động cụ thể |
|---|---|---|
| **1** | Cài đặt + Hiểu vấn đề | `npm install @tanstack/react-query`, setup QueryClientProvider+Devtools. Viết 1 fetch với `useEffect` → thấy đau → chuyển sang `useQuery` |
| **2** | useQuery — query key | Refactor 3 component: danh sách, chi tiết, danh sách có filter. Debug Devtools để thấy cache hoạt động |
| **3** | useMutation — CRUD | Viết form thêm + xóa + sửa. Dùng `invalidateQueries` và `setQueryData` |
| **4** | Optimistic Updates | Thêm tính năng toggle (like/done) với optimistic update. Test rollback bằng cách tắt mạng |
| **5** | useInfiniteQuery + Hoàn thiện | Implement "Load More". Làm full Note Manager |

### Checklist kiểm tra

- [ ] Bỏ hoàn toàn `useEffect` cho fetch API — tất cả qua `useQuery`
- [ ] Query key có tổ chức — ko dùng key kiểu `["data"]` chung chung
- [ ] `staleTime` + `cacheTime` được set hợp lý
- [ ] Mutation luôn có `invalidateQueries` hoặc `setQueryData` sau thành công
- [ ] Optimistic updates có rollback bằng `previousData`
- [ ] DevTools hiển thị cache, query đang chạy
- [ ] Navigate đi rồi về — ko thấy loading spinner (cache hoạt động)

---

## 9. Bài Tập Note Manager — Hướng Dẫn Từng Bước

### Yêu cầu: Xây dựng "Hệ thống quản lý ghi chú" với JSONPlaceholder

### Bước 1: Setup

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Wrap `QueryClientProvider` quanh App.

### Bước 2: Tạo service layer

```js
// src/services/noteService.js
const BASE_URL = "https://jsonplaceholder.typicode.com";

export const noteService = {
  getAll: () =>
    fetch(`${BASE_URL}/posts`).then(res => res.json()),

  getById: (id) =>
    fetch(`${BASE_URL}/posts/${id}`).then(res => res.json()),

  create: (note) =>
    fetch(`${BASE_URL}/posts`, {
      method: "POST",
      body: JSON.stringify(note),
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json()),

  update: (id, note) =>
    fetch(`${BASE_URL}/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(note),
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json()),

  delete: (id) =>
    fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" }),
};
```

### Bước 3: Components

```jsx
// Danh sách notes — useQuery
function NoteList() {
  const { data: notes, isLoading, isError, error } = useQuery({
    queryKey: ["notes"],
    queryFn: noteService.getAll,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message={error.message} />;

  return notes.map(note => <NoteCard key={note.id} note={note} />);
}

// Thêm note — useMutation + Optimistic Update
function AddNoteForm() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newNote) => noteService.create(newNote),
    // Optimistic update
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]);
      queryClient.setQueryData(["notes"], (old) => [
        { ...newNote, id: Date.now() }, // ID tạm
        ...(old || []),
      ]);
      return { previousNotes };
    },
    onError: (err, newNote, context) => {
      queryClient.setQueryData(["notes"], context.previousNotes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    createMutation.mutate({
      title: form.get("title"),
      body: form.get("body"),
      userId: 1,
    });
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Tiêu đề" required />
      <textarea name="body" placeholder="Nội dung" required />
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Đang lưu..." : "Thêm ghi chú"}
      </button>
    </form>
  );
}
```

### Bước 4: Kiểm tra cache

Mở **ReactQueryDevtools** → kiểm tra:
- "notes" query trong cache
- `staleTime` hết hạn → chữ "stale" hiện
- Mutation thành công → invalidate → refetch

---

## Tổng Kết

### 3 nguyên tắc cốt lõi

1. **Query = đọc, Mutation = ghi** — `useQuery` cho GET, `useMutation` cho POST/PUT/DELETE
2. **Query key là identity** — key quyết định cache. Tổ chức key phân cấp, rõ ràng.
3. **Cache là nguồn sự thật** — ko fetch lại nếu cache còn tươi. Mutation xong → invalidate.

### Từ vựng quan trọng

| Thuật ngữ | Dịch | Ý nghĩa |
|---|---|---|
| `stale` | cũ, hết hạn | Data đã quá `staleTime` → cần refetch |
| `invalidate` | đánh dấu hết hạn | Làm cho query bị stale → tự refetch |
| `refetch` | fetch lại | Gọi API lấy data mới |
| `mutation` | thay đổi | Hành động thêm/sửa/xóa dữ liệu |
| `optimistic update` | cập nhật lạc quan | Update UI trước, rollback nếu lỗi |
| `cache` | bộ nhớ đệm | Dữ liệu được lưu tạm để tránh fetch lại |

> **Tóm lại**: TanStack Query loại bỏ hoàn toàn `useEffect` cho fetch API. Học nó là học cách **"tuyên bố" dữ liệu bạn cần thay vì "ra lệnh" fetch**. Query key là ID của cache, mutation là cách đồng bộ với server. Optimistic updates là "ăn gian" UX cho người dùng cảm thấy mượt mà hơn.

