import Image from "next/image";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: number;
  category: string;
  publishedAt: string;
  coverImage: string;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-gray-400">{post.readTime} phút đọc</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-400">{post.author}</span>
            <time className="text-xs text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}
