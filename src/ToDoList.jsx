import React, { useState, useEffect } from "react";
import "./ToDoList.css";

export default function ToDoList() {
    const [taskTitle, setTaskTitle] = useState("Short term pleasures");
    const [taskPriority, setTaskPriority] = useState("low");
    const [taskDescription, setTaskDescription] = useState("High Dopamine instability");
    const [taskList, setTaskList] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const [expandedTasks, setExpandedTasks] = useState({});  // Track expanded states

    // Priority Color Mapping
    const priorityColors = {
        low: "#616161",      // Gray
        medium: "#a341ff",   // Purple
        high: "#fa861a"      // Orange
    };

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            setTaskList(JSON.parse(savedTasks));  // Parse only if valid
        }
    }, []);

    // Save tasks to localStorage whenever taskList changes
    useEffect(() => {
        if (taskList.length > 0) {
            localStorage.setItem("tasks", JSON.stringify(taskList));
        }
    }, [taskList]);

    // Add Task Function
    function handleAddTask() {
        if (!taskTitle.trim() || !taskDescription.trim()) {
            alert("Title and description cannot be empty!");
            return;
        }

        const newTask = {
            title: taskTitle,
            priority: taskPriority,
            description: taskDescription,
        };

        const updatedTasks = [...taskList, newTask];
        setTaskList(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Save instantly

        setTaskTitle("");
        setTaskPriority("low");
        setTaskDescription("");
    }

    // Delete Task Function
    function handleDeleteTask(index) {
        const updatedTasks = taskList.filter((_, i) => i !== index);
        setTaskList(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Save instantly
    }

    // Toggle Expand Task Description
    function toggleExpand(index) {
        setExpandedTasks(prev => ({
            ...prev,
            [index]: !prev[index]  // Toggle expansion state
        }));
    }

    return (
        <div className={`container ${darkMode ? "dark-mode" : "light-mode"}`}>
            <div className="head">
                <h1>Task Manager</h1>
                <p>A dynamic  Task manager  with adaptive card resizing, persistent local storage, and a priority-based color system for efficient task management.</p>
            </div>
            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "😉 Light Mode" : "🌙 Dark Mode"}
            </button>
            <hr /><br />
            <div className="layout">
                {/* Task Input Section (Left Side) */}
                <div className="task-input-card">
                    <h2>Add New Task</h2>
                    <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task Title" />

                    <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>

                    <input type="text" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Task Description" />

                    <button onClick={handleAddTask}>Add Task</button>
                </div>

                {/* Task List Section (Right Side, Organized in Grid) */}
                <div className="task-list">
                    {taskList.map((task, index) => (
                        <div 
                            key={index} 
                            className="task-card" 
                            style={{ backgroundColor: priorityColors[task.priority] }}
                        >
                            <h3>{task.title.charAt(0).toUpperCase()+task.title.slice(1)}</h3>
                            <span className="priority-label">{task.priority.toUpperCase()}</span>
                            
                            {/* Description with Expand Feature */}
                            <p 
                                className={`task-description ${expandedTasks[index] ? "expanded" : ""}`}
                            >
                                {task.description}
                            </p>

                            {task.description.length > 50 && (
                                <button 
                                    className="expand-btn" 
                                    onClick={() => toggleExpand(index)}
                                >
                                    {expandedTasks[index] ? "Show Less" : "Show More"}
                                </button>
                            )}

                            <button className="delete-btn" onClick={() => handleDeleteTask(index)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
