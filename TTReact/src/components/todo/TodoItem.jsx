const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <li className={`todo-item ${todo.done ? "done" : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span>{todo.text}</span>
      </label>
      <button className="todo-delete" onClick={() => onDelete(todo.id)}>
        Xóa
      </button>
    </li>
  );
};

export default TodoItem;
