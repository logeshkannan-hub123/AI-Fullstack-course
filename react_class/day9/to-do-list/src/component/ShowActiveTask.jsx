import "../css/ShowActiveTask.css";

function ShowActiveTask({ filter, setFilter }) {
  return (
    <button
      className="filter-btn"
      onClick={() => setFilter("active")}
      disabled={filter === "active"}
    >
      Active
    </button>
  );
}

export default ShowActiveTask;
