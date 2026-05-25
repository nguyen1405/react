import { useState } from "react";

const AddTodoForm = ({ onAdd }) => {
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(text);
    setText("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập công việc mới..."
      />
      <button type="submit">Thêm</button>
    </form>
  );
};

export default AddTodoForm;
