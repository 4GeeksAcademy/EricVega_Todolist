import React, { useState } from "react";
import "../../styles/index.css";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const handleAddTask = (e) => {
        if (e.key === "Enter" && newTask.trim() !== "") {
            setTasks([...tasks, newTask]);
            setNewTask("");
        }
    };

    const handleDeleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    return (
        <div className="todo-container">
            <h1 className="title">todos</h1>
            <div className="todo-input">
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleAddTask}
                />
            </div>
            <ul className="todo-list">
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                        <li key={index} className="todo-item">
                            <span>{task}</span>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteTask(index)}
                            >
                                ✖
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="no-tasks">No hay tareas, añadir tareas</li>
                )}
            </ul>
            <footer className="footer">
                {tasks.length > 0 && `${tasks.length} item${tasks.length > 1 ? "s" : ""} left`}
            </footer>
        </div>
    );
};

export default Home;
