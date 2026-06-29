export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
        <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded mb-10" />
        
        {/* Filter buttons skeleton */}
        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
          ))}
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-80" />
          ))}
        </div>
      </div>
    </div>
  );
}
