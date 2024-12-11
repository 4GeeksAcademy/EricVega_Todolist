import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const API_BASE_URL = "https://playground.4geeks.com/todo";
const USERNAME = "EricVega";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState("");

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${USERNAME}`);
            if (response.ok) {
                const data = await response.json();
                console.log("Tareas obtenidas:", data);
                setTasks(data);
            } else if (response.status === 404) {
                console.log("Usuario no encontrado. Creando usuario...");
                await createUser();
            } else {
                console.error("Error al obtener tareas:", response.statusText);
            }
        } catch (error) {
            console.error("Error al obtener tareas:", error);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${USERNAME}`, {
                method: "POST",
                headers: { accept: "application/json" },
                body: null,
            });
            if (response.ok) {
                console.log("Usuario creado exitosamente");
                setTasks([]);
            } else {
                console.error("Error al crear usuario:", response.statusText);
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    const addTask = async () => {
        if (newTask.trim()) {
            const task = { label: newTask.trim(), is_done: false };

            try {
                const response = await fetch(`${API_BASE_URL}/todos/${USERNAME}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                    },
                    body: JSON.stringify(task),
                });

                if (response.ok) {
                    const createdTask = await response.json();
                    console.log("Tarea creada:", createdTask);
                    setTasks([...tasks, createdTask]);
                    setNewTask("");
                } else {
                    const errorDetails = await response.json();
                    console.error("Error al añadir tarea:", response.status, errorDetails);
                }
            } catch (error) {
                console.error("Error al añadir tarea:", error);
            }
        }
    };

    const deleteTask = async (taskId) => {
        console.log("Eliminando tarea con ID:", taskId);
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
                method: "DELETE",
                headers: { accept: "application/json" },
            });

            if (response.ok) {
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            } else {
                const errorDetails = await response.json();
                console.error("Error al eliminar tarea:", response.status, errorDetails);
            }
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    if (loading) {
        return <div className="todo-container">Cargando...</div>;
    }

    return (
        <div className="todo-container">
            <h1 className="title">Lista de Tareas</h1>
            <div>
                <input
                    className="todo-input"
                    type="text"
                    placeholder="Añadir una tarea"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <ul className="todo-list">
                    {Array.isArray(tasks) && tasks.length === 0 ? (
                        <li className="no-tasks">No hay tareas, añadir tareas</li>
                    ) : (
                        tasks.map((task) => (
                            <li key={task.id} className="todo-item">
                                {task.label}
                                <button
                                    className="delete-button"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    ✖
                                </button>
                            </li>
                        ))
                    )}
                </ul>
                <div className="footer">
                    <span>{tasks.length} item{tasks.length !== 1 ? "s" : ""} left</span>
                </div>
            </div>
        </div>
    );
};

export default Home;


