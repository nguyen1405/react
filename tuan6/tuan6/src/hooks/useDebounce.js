import { useState, useEffect } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Đợi delay ms sau khi user ngừng gõ
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: xóa timer cũ khi value thay đổi
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
