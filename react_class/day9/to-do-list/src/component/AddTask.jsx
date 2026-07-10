import { useState } from "react";
import "../css/AddTask.css";

function AddTask({ addTask }) {
  const [task, setTask] = useState("");

  function handleAdd() {
    addTask(task);
    setTask("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleAdd();
    }
  }

  return (
    <div className="add-task">
      <input
        type="text"
        placeholder="Enter a task"
        aria-label="Task Input"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleAdd} disabled={!task.trim()}>
        Add
      </button>
    </div>
  );
}

export default AddTask;
