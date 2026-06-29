export const posts = [
  {
    slug: "gioi-thieu-tts",
    title: "Giới thiệu hệ thống Text-to-Speech",
    excerpt: "TTS (Text-to-Speech) là công nghệ chuyển đổi văn bản thành giọng nói, giúp người dùng nghe nội dung thay vì đọc.",
    content: `
      <h2>TTS là gì?</h2>
      <p>Text-to-Speech (TTS) là công nghệ chuyển đổi văn bản thành giọng nói tự nhiên. Với sự phát triển của AI, chất lượng giọng đọc TTS đã được cải thiện đáng kể, gần như không phân biệt được với giọng người thật.</p>
      
      <h2>Ứng dụng của TTS</h2>
      <ul>
        <li>Hỗ trợ người khiếm thị tiếp cận nội dung</li>
        <li>Tạo audio book từ văn bản</li>
        <li>Ứng dụng trong điều hướng GPS</li>
        <li>Trợ lý ảo thông minh</li>
      </ul>
      
      <h2>Lợi ích của TTS</h2>
      <p>TTS giúp tiết kiệm thời gian, cho phép người dùng nghe nội dung khi đang lái xe, chạy bộ, hoặc làm việc khác.</p>
    `,
    author: "Phú Nguyễn",
    readTime: 5,
    category: "Hướng dẫn",
    publishedAt: "2026-01-15",
    coverImage: "https://picsum.photos/seed/tts1/1200/630",
  },
  {
    slug: "huong-dan-su-dung-tts-blog",
    title: "Hướng dẫn sử dụng TTS Blog",
    excerpt: "Cách sử dụng TTS Blog để nghe các bài viết với giọng đọc tự nhiên.",
    content: `
      <h2>Bước 1: Truy cập trang</h2>
      <p>Mở trình duyệt và truy cập vào TTS Blog, chọn bài viết bạn muốn đọc.</p>
      
      <h2>Bước 2: Chọn giọng đọc</h2>
      <p>Chọn giọng đọc phù hợp từ danh sách các giọng có sẵn.</p>
      
      <h2>Bước 3: Nghe nội dung</h2>
      <p>Nhấn nút Play để bắt đầu nghe. Bạn có thể tạm dừng, tua lại hoặc điều chỉnh tốc độ.</p>
    `,
    author: "Phú Nguyễn",
    readTime: 3,
    category: "Hướng dẫn",
    publishedAt: "2026-01-20",
    coverImage: "https://picsum.photos/seed/tts2/1200/630",
  },
  {
    slug: "cong-nghe-ai-trong-tts",
    title: "Công nghệ AI trong TTS hiện đại",
    excerpt: "Tìm hiểu về các thuật toán Deep Learning giúp tạo ra giọng nói tự nhiên.",
    content: `
      <h2>Neural TTS</h2>
      <p>Các mô hình Neural TTS sử dụng Deep Learning để tạo ra giọng nói có ngữ điệu tự nhiên, khác biệt hoàn toàn với các phiên bản TTS cũ.</p>
      
      <h2>Transformer Architecture</h2>
      <p>Mô hình Transformer giúp xử lý ngữ cảnh tốt hơn, tạo ra giọng đọc có ý nghĩa hơn.</p>
    `,
    author: "Minh Hoàng",
    readTime: 7,
    category: "Công nghệ",
    publishedAt: "2026-01-25",
    coverImage: "https://picsum.photos/seed/tts3/1200/630",
  },
  {
    slug: "su-dung-voice-changer",
    title: "Hướng dẫn sử dụng Voice Changer",
    excerpt: "Cách tùy chỉnh giọng đọc với các hiệu ứng voice changer thú vị.",
    content: `
      <h2>Giới thiệu Voice Changer</h2>
      <p>Voice Changer cho phép bạn thay đổi giọng đọc với nhiều hiệu ứng khác nhau như robot, alien, cartoon...</p>
      
      <h2>Cách sử dụng</h2>
      <p>Chọn bài viết, sau đó chọn hiệu ứng từ menu. Nhấn Play để nghe kết quả.</p>
    `,
    author: "Lan Anh",
    readTime: 4,
    category: "Tính năng",
    publishedAt: "2026-02-01",
    coverImage: "https://picsum.photos/seed/tts4/1200/630",
  },
  {
    slug: "tich-hop-tts-vao-ung-dung",
    title: "Tích hợp TTS vào ứng dụng của bạn",
    excerpt: "Hướng dẫn tích hợp API TTS vào trang web hoặc ứng dụng di động.",
    content: `
      <h2>API TTS</h2>
      <p>Chúng tôi cung cấp API mạnh mẽ để tích hợp TTS vào ứng dụng của bạn với chi phí hợp lý.</p>
      
      <h2>Các bước tích hợp</h2>
      <ol>
        <li>Đăng ký tài khoản developer</li>
        <li>Lấy API key</li>
        <li>Gọi API với text cần chuyển đổi</li>
        <li>Nhận file audio phản hồi</li>
      </ol>
    `,
    author: "Phú Nguyễn",
    readTime: 6,
    category: "Phát triển",
    publishedAt: "2026-02-05",
    coverImage: "https://picsum.photos/seed/tts5/1200/630",
  },
  {
    slug: "cach-lua-chon-giong-doc-phu-hop",
    title: "Cách chọn giọng đọc phù hợp",
    excerpt: "Hướng dẫn chọn giọng đọc TTS phù hợp với nội dung và đối tượng người nghe.",
    content: `
      <h2>Các yếu tố cần cân nhắc</h2>
      <ul>
        <li>Đối tượng người nghe (trẻ em, người lớn, người cao tuổi)</li>
        <li>Nội dung bài viết (tin tức, hướng dẫn, giải trí)</li>
        <li>Ngữ cảnh sử dụng (học tập, giải trí, công việc)</li>
      </ul>
      
      <h2>Đề xuất</h2>
      <p>Nội dung học tập nên chọn giọng trầm ấm. Nội dung giải trí có thể chọn giọng vui tươi.</p>
    `,
    author: "Minh Hoàng",
    readTime: 4,
    category: "Mẹo hay",
    publishedAt: "2026-02-10",
    coverImage: "https://picsum.photos/seed/tts6/1200/630",
  },
];

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const post = getPostBySlug(slug);
  if (!post) return [];
  
  return posts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, limit);
}

export function getRecentPosts(limit = 3) {
  return [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getFeaturedPost() {
  return posts[0];
}

export function getCategories() {
  const categories = [...new Set(posts.map((post) => post.category))];
  return categories;
}

export function getPostsByCategory(category: string) {
  return posts.filter((post) => post.category === category);
}
