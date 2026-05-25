import { useEffect, useState } from "react";

const CountdownTimer = ({ initialSeconds = 10 }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [inputValue, setInputValue] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setIsRunning(false);
    }
  }, [seconds]);

  const handleStart = () => {
    const next = Number(inputValue);
    if (Number.isNaN(next) || next <= 0) return;
    setSeconds(next);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
    setInputValue(initialSeconds);
  };

  return (
    <div className="countdown-card">
      <div className="countdown-display">{seconds}s</div>
      <div className="countdown-controls">
        <label>
          Start seconds:
          <input
            type="number"
            min="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <div className="countdown-buttons">
          <button onClick={handleStart}>Bắt đầu</button>
          <button onClick={handleStop}>Dừng</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
