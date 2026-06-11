import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Already logged in → redirect
  if (isLoggedIn) {
    navigate(from, { replace: true });
    return null;
  }

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setSubmitting(true);
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Đăng nhập
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Đăng nhập để mua sắm và quản lý giỏ hàng
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-6 sm:p-8 space-y-5"
        >
          {/* Server Error */}
          {serverError && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@test.com"
              value={form.email}
              onChange={handleChange}
              className={`
                w-full px-4 py-2.5 text-sm rounded-xl border
                focus:outline-none focus:ring-2 transition-colors duration-200
                dark:bg-gray-700 dark:text-white
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-primary-500 focus:border-transparent"
                }
              `}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="123456"
              value={form.password}
              onChange={handleChange}
              className={`
                w-full px-4 py-2.5 text-sm rounded-xl border
                focus:outline-none focus:ring-2 transition-colors duration-200
                dark:bg-gray-700 dark:text-white
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-primary-500 focus:border-transparent"
                }
              `}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Hint */}
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-600 dark:text-blue-400">
            <p className="font-semibold mb-0.5">Tài khoản demo:</p>
            <p>Email: <code className="font-mono bg-blue-100 dark:bg-blue-900/40 px-1 rounded">admin@test.com</code></p>
            <p>Mật khẩu: <code className="font-mono bg-blue-100 dark:bg-blue-900/40 px-1 rounded">123456</code></p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" className="text-white" />
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
