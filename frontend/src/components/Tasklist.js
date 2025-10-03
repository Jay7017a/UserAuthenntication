import React, { useEffect, useState } from "react";
import api from "../api/axios";

function TaskForm({ onCreated, editTask, onUpdated, onCancel }) {
  const [title, setTitle] = useState(editTask?.title ?? "");
  const [description, setDescription] = useState(editTask?.description ?? "");
  const [completed, setCompleted] = useState(editTask?.completed ?? false);

  useEffect(()=> {
    setTitle(editTask?.title ?? "");
    setDescription(editTask?.description ?? "");
    setCompleted(editTask?.completed ?? false);
  }, [editTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Title required");
    try {
      if (editTask) {
        const res = await api.put(tasks/${editTask.id}/, { title, description, completed });
        onUpdated(res.data);
      } else {
        const res = await api.post("tasks/", { title, description, completed });
        setTitle(""); setDescription(""); setCompleted(false);
        onCreated(res.data);
      }
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow">
      <div className="mb-2">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
      </div>
      <div className="mb-2">
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
      </div>
      <div className="mb-2 flex items-center">
        <input type="checkbox" checked={completed} onChange={(e)=>setCompleted(e.target.checked)} id="completed" className="mr-2" />
        <label htmlFor="completed">Completed</label>
      </div>
      <div className="flex gap-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editTask ? "Update" : "Create"}</button>
        {editTask && <button type="button" onClick={onCancel} className="bg-gray-400 px-4 py-2 rounded">Cancel</button>}
      </div>
    </form>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [completedFilter, setCompletedFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  const fetchTasks = async () => {
    try {
      let url = "tasks/?";
      if (search) url += search=${encodeURIComponent(search)}&;
      if (completedFilter !== "all") url += completed=${completedFilter === "completed" ? "true" : "false"}&;
      const res = await api.get(url);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=> {
    fetchTasks();
  }, [search, completedFilter]);

  const handleCreate = (task) => setTasks(prev => [task, ...prev]);
  const handleUpdate = (task) => {
    setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
    setEditing(null);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await api.delete(tasks/${id}/);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <TaskForm onCreated={handleCreate} editTask={editing} onUpdated={handleUpdate} onCancel={()=>setEditing(null)} />

      <div className="mb-4 flex gap-2">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search tasks..." className="p-2 border rounded flex-1" />
        <select value={completedFilter} onChange={(e)=>setCompletedFilter(e.target.value)} className="p-2 border rounded">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 && <div>No tasks</div>}
        {tasks.map(task => (
          <div key={task.id} className="p-3 bg-white rounded shadow flex justify-between items-start">
            <div>
              <div className="font-bold">{task.title} {task.completed && <span className="text-green-600">• done</span>}</div>
              <div className="text-sm text-gray-600">{task.description}</div>
              <div className="text-xs text-gray-400 mt-1">Created: {new Date(task.created_at).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setEditing(task)} className="text-sm bg-yellow-400 px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(task.id)} className="text-sm bg-red-500 px-2 py-1 rounded text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
