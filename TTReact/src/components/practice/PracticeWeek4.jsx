import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import PageTitle from "./PageTitle";
import WindowSize from "./WindowSize";
import LocalStorageDemo from "./LocalStorageDemo";
import TodoApp from "../todo/TodoApp";
import "../../css/PracticeWeek4.css";

const PracticeWeek4 = () => {
  const [pageTitle, setPageTitle] = useState("Tuần 4 Practice - useEffect & localStorage");

  return (
    <div className="week4-page">
      <h2>Tuần 4: useEffect, localStorage và Todo List Pro</h2>

      <section className="exercise-card">
        <h3>1. Countdown Timer</h3>
        <p>Sử dụng <code>useEffect</code> và <code>setInterval</code> với cleanup.</p>
        <CountdownTimer initialSeconds={15} />
      </section>

      <section className="exercise-card">
        <h3>2. PageTitle</h3>
        <p>Component này cập nhật <code>document.title</code> theo prop <code>title</code>.</p>
        <PageTitle title={pageTitle} onTitleChange={setPageTitle} />
      </section>

      <section className="exercise-card">
        <h3>3. WindowSize</h3>
        <p>Hiển thị kích thước cửa sổ theo thời gian thực.</p>
        <WindowSize />
      </section>

      <section className="exercise-card">
        <h3>4. LocalStorage Demo</h3>
        <p>Đọc và ghi dữ liệu vào <code>localStorage</code> thủ công.</p>
        <LocalStorageDemo />
      </section>

      <section className="exercise-card todo-practice">
        <h3>5. Todo List Pro</h3>
        <p>Ứng dụng todo lưu trữ dữ liệu trong <code>localStorage</code> và hỗ trợ bộ lọc.</p>
        <TodoApp />
      </section>
    </div>
  );
};

export default PracticeWeek4;
