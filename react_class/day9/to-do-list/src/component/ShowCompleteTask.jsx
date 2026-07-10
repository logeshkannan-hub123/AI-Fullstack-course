import "../css/ShowCompleteTask.css";

function ShowCompletedTask({ filter, setFilter }) {
  return (
    <button
      className="filter-btn"
      onClick={() => setFilter("completed")}
      disabled={filter === "completed"}
    >
      Completed
    </button>
  );
}

export default ShowCompletedTask;
