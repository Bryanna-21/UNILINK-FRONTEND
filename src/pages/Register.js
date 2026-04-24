import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    universityId: ""
  });

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      window.location.href = "/";
    } catch {
      alert("Error registering");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <input placeholder="University ID" onChange={e => setForm({...form, universityId: e.target.value})} />

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
