import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-8xl mb-6 font-bold text-gray-200 dark:text-gray-700">404</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Trang không tìm thấy
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
