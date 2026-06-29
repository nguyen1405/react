"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-6xl mb-6">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Có lỗi xảy ra!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
        {error.message || "Đã có lỗi không mong muốn. Vui lòng thử lại sau."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Thử lại
      </button>
    </div>
  );
}
