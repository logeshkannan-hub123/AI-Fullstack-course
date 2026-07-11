import { useState } from "react";
import AddTask from "./AddTask";
import CompleteTask from "./CompleteTask";
import DeleteTask from "./DeleteTask";
import TaskCount from "./CountTask";
import ShowAllTask from "./ShowAllTask";
import ShowActiveTask from "./ShowActiveTask";
import ShowCompletedTask from "./ShowCompleteTask";
import "../css/App.css";

function App() {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([]);

  // Add Task
  function addTask(taskText) {
    // Remove extra spaces
    const cleanedTask = taskText.trim().replace(/\s+/g, " ");

    // Empty task
    if (!cleanedTask) return;

    // Maximum length
    if (cleanedTask.length > 100) {
      alert("Task cannot exceed 100 characters.");
      return;
    }

    // Duplicate check (case insensitive)
    const exists = tasks.some(
      (task) => task.text.toLowerCase() === cleanedTask.toLowerCase(),
    );

    if (exists) {
      alert("Task already exists.");
      return;
    }

    const newTask = {
      text: cleanedTask,
      completed: false,
    };

    setTasks([...tasks, newTask]);
  }

  // Complete Task
  function completeTask(index) {
    // Copy the tasks array
    let newTasks = [...tasks];

    // Check if the task is completed
    if (newTasks[index].completed === true) {
      newTasks[index].completed = false;
    } else {
      newTasks[index].completed = true;
    }

    // Update state
    setTasks(newTasks);
  }
  //   // Delete Task
  function deleteTask(index) {
    let newTasks = [];

    for (let i = 0; i < tasks.length; i++) {
      if (i !== index) {
        newTasks.push(tasks[i]);
      }
    }

    setTasks(newTasks);
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }

    if (filter === "active") {
      return !task.completed;
    }

    return true;
  });

  return (
    <div className="todo-app">
      <h1>Todo List</h1>

      <AddTask addTask={addTask} />

      <TaskCount tasks={tasks} />

      <div className="filter-buttons">
        <ShowAllTask filter={filter} setFilter={setFilter} />

        <ShowActiveTask filter={filter} setFilter={setFilter} />

        <ShowCompletedTask filter={filter} setFilter={setFilter} />
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {filteredTasks.map((task, index) => (
            <li key={index}>
              <span className={task.completed ? "completed" : ""}>
                {task.text}
              </span>

              <CompleteTask
                completeTask={completeTask}
                index={tasks.indexOf(task)}
                completed={task.completed}
              />

              <DeleteTask deleteTask={deleteTask} index={tasks.indexOf(task)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
