# Tuần 11: Testing, Form Validation & Deployment

> **Mục tiêu:** Viết Unit Test và Component Test chuyên nghiệp, xử lý form phức tạp với React Hook Form, và deploy ứng dụng lên production.

---

## 📚 1. Học gì? (Theory)

### 1.1 Tại sao cần Testing?

```
Không có test:
  Code → Deploy → Lỗi production → Fix khẩn cấp → Lỗi mới xuất hiện

Có test:
  Code → Test → Phát hiện lỗi sớm → Fix → Test pass → Deploy tự tin
```

**Pyramid Testing:**
```
         /\
        /  \       E2E Tests (ít nhất, chạy chậm nhất)
       /----\      Integration Tests (trung bình)
      /------\     Unit Tests (nhiều nhất, chạy nhanh nhất)
     /────────\
```

---

### 1.2 Cài đặt Vitest + React Testing Library

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

```js
// vite.config.js - Thêm cấu hình test
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",         // Giả lập trình duyệt
    globals: true,                 // Không cần import test, expect
    setupFiles: "./src/test/setup.js",
  },
});
```

```js
// src/test/setup.js
import "@testing-library/jest-dom"; // Thêm các matcher như toBeInTheDocument
```

---

### 1.3 Unit Test cơ bản (Vitest)

```js
// src/utils/formatters.js
export const formatPrice = (price) =>
  price.toLocaleString("vi-VN") + "đ";

export const truncateText = (text, max = 100) =>
  text.length > max ? text.slice(0, max) + "..." : text;

export const calculateDiscount = (original, discounted) => {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

// src/utils/formatters.test.js
import { describe, it, expect } from "vitest";
import { formatPrice, truncateText, calculateDiscount } from "./formatters";

describe("formatPrice", () => {
  it("format số thành chuỗi tiền tệ VNĐ", () => {
    expect(formatPrice(1000000)).toBe("1.000.000đ");
    expect(formatPrice(0)).toBe("0đ");
    expect(formatPrice(99000)).toBe("99.000đ");
  });
});

describe("truncateText", () => {
  it("không cắt khi text ngắn hơn max", () => {
    expect(truncateText("Hello", 100)).toBe("Hello");
  });

  it("cắt và thêm ... khi text quá dài", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
  });
});

describe("calculateDiscount", () => {
  it("tính đúng phần trăm giảm giá", () => {
    expect(calculateDiscount(100, 80)).toBe(20);
    expect(calculateDiscount(200, 150)).toBe(25);
  });

  it("trả về 0 khi original <= 0", () => {
    expect(calculateDiscount(0, 80)).toBe(0);
    expect(calculateDiscount(-10, 5)).toBe(0);
  });
});
```

---

### 1.4 Component Test với React Testing Library

```jsx
// src/components/ui/Button.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button Component", () => {
  it("render text đúng", () => {
    render(<Button>Click me</Button>);
    // Tìm element theo text
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("gọi onClick khi click", async () => {
    const handleClick = vi.fn(); // Mock function
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled khi có prop disabled", async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled(); // Không gọi khi disabled
  });

  it("render đúng variant class", () => {
    const { rerender } = render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-blue-600");

    rerender(<Button variant="danger">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });
});

// src/components/todo/AddTodoForm.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodoForm from "./AddTodoForm";

describe("AddTodoForm", () => {
  it("input rỗng khi mới render", () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    expect(screen.getByPlaceholderText("Thêm công việc...")).toHaveValue("");
  });

  it("gọi onAdd với giá trị đúng khi submit", async () => {
    const mockOnAdd = vi.fn();
    render(<AddTodoForm onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText("Thêm công việc...");
    await userEvent.type(input, "Học React");
    await userEvent.click(screen.getByRole("button", { name: "Thêm" }));

    expect(mockOnAdd).toHaveBeenCalledWith("Học React");
  });

  it("input reset về rỗng sau khi submit", async () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    const input = screen.getByPlaceholderText("Thêm công việc...");
    await userEvent.type(input, "Học React");
    await userEvent.click(screen.getByRole("button", { name: "Thêm" }));
    expect(input).toHaveValue("");
  });

  it("không submit khi input rỗng", async () => {
    const mockOnAdd = vi.fn();
    render(<AddTodoForm onAdd={mockOnAdd} />);
    await userEvent.click(screen.getByRole("button", { name: "Thêm" }));
    expect(mockOnAdd).not.toHaveBeenCalled();
  });
});
```

---

### 1.5 React Hook Form - Form phức tạp

```bash
npm install react-hook-form zod @hookform/resolvers
```

```jsx
// Zod schema - Validate toàn bộ form
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().min(2, "Tên tối thiểu 2 ký tự").max(50, "Tên quá dài"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
    .regex(/[0-9]/, "Phải có ít nhất 1 số"),
  confirmPassword: z.string(),
  phone: z.string().regex(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ").optional(),
  terms: z.boolean().refine(val => val === true, "Phải đồng ý điều khoản"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const {
    register,           // Đăng ký field
    handleSubmit,       // Wrap onSubmit
    formState: { errors, isSubmitting, isValid },
    watch,              // Theo dõi giá trị
    reset,              // Reset form
    setError,           // Set lỗi thủ công (từ server)
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
    mode: "onChange",   // Validate realtime khi gõ
  });

  const password = watch("password"); // Theo dõi password để show strength

  const onSubmit = async (data) => {
    try {
      await authService.register(data);
      reset(); // Reset form sau khi thành công
    } catch (error) {
      // Set lỗi từ server
      setError("email", { message: "Email này đã được đăng ký" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Họ và tên"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Mật khẩu"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        label="Xác nhận mật khẩu"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("terms")} />
        <span>Tôi đồng ý với điều khoản sử dụng</span>
      </label>
      {errors.terms && <p className="text-red-500">{errors.terms.message}</p>}

      <Button
        type="submit"
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
      </Button>
    </form>
  );
};
```

---

### 1.6 Deployment

```bash
# Build production
npm run build
# → Output: dist/ hoặc .next/

# Preview local
npm run preview
```

**Deploy lên Vercel (Khuyên dùng cho React/Next.js):**
1. Đẩy code lên GitHub.
2. Vào [vercel.com](https://vercel.com) → Import repository.
3. Cấu hình Environment Variables (nếu có).
4. Deploy tự động! Mỗi `git push` → tự deploy lên production.

**Biến môi trường:**
```env
# .env.local (không commit lên git)
VITE_API_URL=https://api.example.com
VITE_APP_NAME=TTS App

# Trong code
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🛠 2. Thực hành gì?

1. Chạy `npx vitest` trong dự án.
2. Viết test cho `formatPrice` và `calculateDiscount`.
3. Viết Component test cho `Button`.
4. Setup React Hook Form cho form Login.
5. Deploy Shop Gallery lên Vercel.

---

## 🏗️ 3. Bài thực hành tuần 11

**Phần A: Testing**

```js
// Viết đủ test cases cho:
// 1. Hàm logic: validateEmail, formatDate, groupByCategory
// 2. Component ProductCard - kiểm tra:
//    - Hiển thị tên, giá đúng
//    - Badge "Hết hàng" hiện khi inStock = false
//    - onClick được gọi khi click card
// 3. Component AddTodoForm - 4 test cases như ví dụ trên
```

**Phần B: Form nâng cao với React Hook Form**

Xây dựng form "Chuyển đổi TTS" với:
1. Textarea nhập văn bản (min 10 ký tự, max 5000 ký tự, đếm ký tự realtime).
2. Select chọn giọng đọc (required).
3. Select tốc độ đọc (0.5x, 1x, 1.5x, 2x).
4. Checkbox "Lưu vào lịch sử".
5. Validate với Zod và hiển thị lỗi inline.

**Phần C: Deploy**

1. Push code lên GitHub.
2. Deploy lên Vercel.
3. Cấu hình custom domain (nếu có).
4. Chạy Lighthouse audit → Báo cáo điểm số.

---

## 📖 Tài liệu tham khảo
| Tài nguyên | Link |
|---|---|
| Vitest Docs | [vitest.dev](https://vitest.dev) |
| React Testing Library | [testing-library.com/react](https://testing-library.com/docs/react-testing-library/intro) |
| React Hook Form | [react-hook-form.com](https://react-hook-form.com) |
| Vercel Deploy | [vercel.com/docs](https://vercel.com/docs) |

---
> ⏱️ **Ước tính:** 4-5 ngày | 🎯 **Tiêu chí:** ≥10 test cases pass, Form validation hoàn chỉnh, app live trên Vercel.
