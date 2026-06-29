import { Metadata } from "next";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";
import { posts, getCategories } from "@/data/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tất cả bài viết về công nghệ Text-to-Speech",
};

export default async function BlogPage(props: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const categories = getCategories();
  const selectedCategory = searchParams?.category || null;

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Khám phá các bài viết về công nghệ Text-to-Speech
        </p>
      </div>

      <CategoryFilter categories={categories} selectedCategory={selectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
            Không có bài viết nào trong danh mục này.
          </p>
        )}
      </div>
    </div>
  );
}
