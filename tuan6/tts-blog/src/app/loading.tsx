export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        {/* Hero skeleton */}
        <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl mb-16" />
        
        {/* Posts skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-xl h-80" />
          ))}
        </div>
      </div>
    </div>
  );
}
