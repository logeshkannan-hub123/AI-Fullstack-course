import "../css/CounrTask.css";

function TaskCount({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = total - completed;

  return (
    <div className="task-count">
      <p>Total Tasks : {total}</p>
      <p>Completed : {completed}</p>
      <p>Remaining : {remaining}</p>
    </div>
  );
}

export default TaskCount;
