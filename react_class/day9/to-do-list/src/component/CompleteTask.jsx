import "../css/CompleteTask.css";

function CompleteTask({ completeTask, index, completed }) {
  return (
    <button
      className={`complete-btn ${completed ? "undo" : ""}`}
      onClick={() => completeTask(index)}
    >
      {completed ? "Undo" : "Complete"}
    </button>
  );
}

export default CompleteTask;