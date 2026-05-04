import { useState } from "react";
import Flashcard from "./Flashcard";
import Navigation from "./Navigation";
import Progress from "./Progress";
import { flashcards as initialCards } from "../data/flashcards";
import "./FlashcardApp.css";

function FlashcardApp() {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMarkKnown = () => {
    const newCards = cards.filter((_, index) => index !== currentIndex);
    setCards(newCards);
    if (currentIndex >= newCards.length && newCards.length > 0) {
      setCurrentIndex(newCards.length - 1);
    }
  };

  const handleReset = () => {
    setCards(initialCards);
    setCurrentIndex(0);
  };

  if (cards.length === 0) {
    return (
      <div className="flashcard-app">
        <h1>Flashcard Học Từ Vựng</h1>
        <div className="empty-state">
          <p>Bạn đã học xong tất cả các card!</p>
          <button onClick={handleReset}>Học lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-app">
      <h1>Flashcard Học Từ Vựng</h1>
      <Progress currentIndex={currentIndex} total={cards.length} />
      <Flashcard card={cards[currentIndex]} />
      <Navigation
        currentIndex={currentIndex}
        total={cards.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onMarkKnown={handleMarkKnown}
        onReset={handleReset}
      />
    </div>
  );
}

export default FlashcardApp;
