import { useEffect, useState } from "react";

const STORAGE_KEY = "week4-demo-value";

const LocalStorageDemo = () => {
  const [value, setValue] = useState("");
  const [savedValue, setSavedValue] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setValue(stored);
      setSavedValue(stored);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, value);
    setSavedValue(value);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setValue("");
    setSavedValue("");
  };

  return (
    <div className="storage-card">
      <label>
        Giá trị lưu trong localStorage:
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nhập một giá trị để lưu..."
        />
      </label>
      <div className="storage-actions">
        <button onClick={handleSave}>Lưu</button>
        <button onClick={handleClear}>Xóa</button>
      </div>
      <p>Giá trị đang lưu: <strong>{savedValue || "(chưa có giá trị)"}</strong></p>
    </div>
  );
};

export default LocalStorageDemo;
