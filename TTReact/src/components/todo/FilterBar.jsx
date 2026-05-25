const FilterBar = ({ activeFilter, onFilterChange, counts }) => {
  return (
    <div className="todo-filter-bar">
      <div className="filter-buttons">
        <button
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => onFilterChange("all")}
        >
          Tất cả ({counts.total})
        </button>
        <button
          className={activeFilter === "active" ? "active" : ""}
          onClick={() => onFilterChange("active")}
        >
          Chưa xong ({counts.active})
        </button>
        <button
          className={activeFilter === "done" ? "active" : ""}
          onClick={() => onFilterChange("done")}
        >
          Hoàn thành ({counts.done})
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
