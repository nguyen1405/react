"use client";

import Link from "next/link";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedCategory
            ? "bg-blue-600 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        Tất cả
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/blog?category=${encodeURIComponent(category)}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
