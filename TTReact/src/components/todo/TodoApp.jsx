import { useEffect, useMemo, useState } from "react";
import AddTodoForm from "./AddTodoForm";
import FilterBar from "./FilterBar";
import TodoList from "./TodoList";

const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  DONE: "done",
};

const TodoApp = () => {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });
  const [filter, setFilter] = useState(FILTERS.ALL);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, done: false, createdAt: new Date().toISOString() },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) => {
        if (filter === FILTERS.ACTIVE) return !todo.done;
        if (filter === FILTERS.DONE) return todo.done;
        return true;
      }),
    [todos, filter]
  );

  const activeCount = useMemo(
    () => todos.filter((todo) => !todo.done).length,
    [todos]
  );

  return (
    <div className="todo-app-card">
      <AddTodoForm onAdd={addTodo} />
      <FilterBar
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={{ total: todos.length, active: activeCount, done: todos.length - activeCount }}
      />
      <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <div className="todo-summary">
        <p>Đang có <strong>{todos.length}</strong> việc, <strong>{activeCount}</strong> việc chưa hoàn thành.</p>
        {todos.length > 0 && activeCount === 0 && (
          <p className="todo-success">🎉 Bạn đã hoàn thành tất cả!</p>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
