import "../css/DeleteTask.css";

function DeleteTask({ deleteTask, index }) {
  return (
    <button
      className="delete-btn"
      onClick={() => deleteTask(index)}
    >
      Delete
    </button>
  );
}

export default DeleteTask;