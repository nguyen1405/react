import { useEffect, useState } from "react";

const WindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="window-size-card">
      <div>Chiều rộng: <strong>{size.width}px</strong></div>
      <div>Chiều cao: <strong>{size.height}px</strong></div>
    </div>
  );
};

export default WindowSize;
