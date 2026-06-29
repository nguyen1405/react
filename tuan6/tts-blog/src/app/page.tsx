import Image from "next/image";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getFeaturedPost, getRecentPosts } from "@/data/posts";

export default function HomePage() {
  const featuredPost = getFeaturedPost();
  const recentPosts = getRecentPosts(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            TTS Blog
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Khám phá công nghệ chuyển văn bản thành giọng nói - 
            chia sẻ kiến thức, hướng dẫn và những ứng dụng thực tế của TTS.
          </p>
        </div>

        {/* Featured Post */}
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group block relative w-full h-[400px] rounded-2xl overflow-hidden"
        >
          <Image
            src={featuredPost.coverImage}
            alt={featuredPost.title}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className="text-xs font-medium text-blue-300 bg-blue-900/60 px-2.5 py-1 rounded-full">
              {featuredPost.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 mb-2">
              {featuredPost.title}
            </h2>
            <p className="text-gray-200 text-sm max-w-2xl line-clamp-2">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-300">
              <span>{featuredPost.author}</span>
              <span>&middot;</span>
              <time>{new Date(featuredPost.publishedAt).toLocaleDateString("vi-VN")}</time>
              <span>&middot;</span>
              <span>{featuredPost.readTime} phút đọc</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bài viết gần đây
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Xem tất cả &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.slice(1).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
