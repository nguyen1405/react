import { useEffect } from "react";

const PageTitle = ({ title, onTitleChange }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="page-title-card">
      <label>
        Tiêu đề trang:
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Nhập tiêu đề..."
        />
      </label>
      <p className="page-title-note">Tiêu đề trình duyệt hiện tại: <strong>{title}</strong></p>
    </div>
  );
};

export default PageTitle;
