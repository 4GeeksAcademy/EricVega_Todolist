import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const API_BASE_URL = "https://playground.4geeks.com/todo";
const USERNAME = "EricVega";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState("");

    // Fetch tasks using GET
    const fetchTasks = async () => {
        try {
            const task = {
                label: "Sample Task", // Cambia este texto por el que desees
                is_done: false, // Estado inicial de la tarea
            };
    
            const response = await fetch(`${API_BASE_URL}/todos/${USERNAME}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify(task), // Enviar objeto válido
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log("Tareas creadas:", data);
                setTasks([data]); // Si es necesario, actualiza el estado con la nueva tarea
            } else {
                const errorDetails = await response.json();
                console.error(`Error al crear tarea: ${response.status}`, errorDetails);
            }
        } catch (error) {
            console.error("Error al crear tarea:", error);
        } finally {
            setLoading(false);
        }
    };
    
    

    // Create user if not exists
    const createUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${USERNAME}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({ username: USERNAME }),
            });
    
            if (response.ok) {
                console.log("Usuario creado exitosamente");
            } else if (response.status === 400) {
                const errorDetails = await response.json();
                if (errorDetails.detail === "User already exists.") {
                    console.log("El usuario ya existe, procediendo a obtener las tareas.");
                } else {
                    console.error(`Error al crear usuario:`, errorDetails.detail);
                }
            } else {
                console.error(`Error desconocido al crear usuario: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
        } finally {
            // Siempre intentar obtener las tareas, incluso si el usuario ya existía
            fetchTasks();
        }
    };
    
    

    // Add a new task
    const addTask = async (todoId) => {
        if (!newTask.trim()) {
            console.log("El campo de tarea está vacío.");
            return;
        }
    
        const task = {
            label: newTask.trim(), // El texto de la tarea ingresada
            is_done: false, // Estado inicial de la tarea
        };
    
        // Si no se pasa un `todoId`, asumimos que es una nueva tarea
        const method = todoId ? "PUT" : "POST";
        const url = todoId
            ? `${API_BASE_URL}/todos/${todoId}` // Actualizar una tarea existente
            : `${API_BASE_URL}/todos/${USERNAME}`; // Crear una nueva tarea
    
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify(task), // Enviar el objeto como string JSON
            });
    
            if (response.ok) {
                const taskResponse = await response.json();
                console.log("Tarea añadida/actualizada exitosamente:", taskResponse);
    
                // Actualizar la lista de tareas
                if (todoId) {
                    // Si es una actualización, reemplazamos la tarea
                    setTasks((prevTasks) =>
                        prevTasks.map((task) =>
                            task.id === todoId ? taskResponse : task
                        )
                    );
                } else {
                    // Si es una nueva tarea, la añadimos
                    setTasks((prevTasks) => [...prevTasks, taskResponse]);
                }
    
                // Limpiar el input
                setNewTask("");
            } else {
                const errorDetails = await response.json();
                console.error(`Error al añadir/actualizar tarea: ${response.status}`, errorDetails);
            }
        } catch (error) {
            console.error("Error al añadir/actualizar tarea:", error);
        }
    };
     
    

    // Delete a task
    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
            });

            if (response.ok) {
                console.log("Task deleted successfully");
                setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
            } else {
                console.error(`Error deleting task: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    useEffect(() => {
        createUser(); // Ensure the user exists before fetching tasks
    }, []);

    if (loading) {
        return <div className="todo-container">Loading...</div>;
    }

    return (
        <div className="todo-container">
            <h1 className="title">Task List</h1>
            <div>
                <input
                    className="todo-input"
                    type="text"
                    placeholder="Add a task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <ul className="todo-list">
                    {tasks.length === 0 ? (
                        <li className="no-tasks">No tasks, add one!</li>
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


