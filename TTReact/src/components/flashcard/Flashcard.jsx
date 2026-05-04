import { useState } from "react";
import "./Flashcard.css";

function Flashcard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-container" onClick={handleFlip}>
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <div className="flashcard-front">
          <h3>{card.front}</h3>
          <p className="hint">Click để xem định nghĩa</p>
        </div>
        <div className="flashcard-back">
          <p>{card.back}</p>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
