import "../css/ShowallTask.css";

function ShowAllTask({ filter, setFilter }) {
  return (
    <button
      className="filter-btn"
      onClick={() => setFilter("all")}
      disabled={filter === "all"}
    >
      All Tasks
    </button>
  );
}

export default ShowAllTask;
