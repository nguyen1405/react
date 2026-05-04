function Navigation({ currentIndex, total, onPrev, onNext, onMarkKnown, onReset }) {
  return (
    <div className="navigation">
      <button onClick={onPrev} disabled={currentIndex === 0}>
        ← Trước đó
      </button>
      <button onClick={onNext} disabled={currentIndex === total - 1}>
        Tiếp theo →
      </button>
      <div className="navigation-actions">
        <button className="btn-known" onClick={onMarkKnown}>
          Đánh dấu đã nhớ
        </button>
        <button className="btn-reset" onClick={onReset}>
          Học lại
        </button>
      </div>
    </div>
  );
}

export default Navigation;
