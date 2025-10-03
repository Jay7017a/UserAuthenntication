import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!username || !password) return setErr("Please enter both fields");
    try {
      await login(username, password);
      nav("/");
    } catch (error) {
      setErr("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {err && <div className="text-red-500 mb-2">{err}</div>}
      <input className="w-full p-2 border rounded mb-2" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
      <input className="w-full p-2 border rounded mb-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      <p className="mt-3">No account? <Link to="/signup" className="text-blue-600">Sign up</Link></p>
    </form>
  );
}
