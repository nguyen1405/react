function Progress({ currentIndex, total }) {
  return (
    <div className="progress">
      <p>Card {currentIndex + 1} / {total}</p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default Progress;
