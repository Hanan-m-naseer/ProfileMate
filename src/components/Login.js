// src/components/Login.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Login to get token and user_id
     const res = await axios.post("http://localhost:8000/api/custom-login/", formData);
     const token = res.data.token;
     const userId = res.data.user_id;

if (!token || !userId) {
  console.error("Login failed to return token/user_id", res.data);
  setError("Login failed. Invalid response.");
  return;
}

localStorage.setItem("token", token);
localStorage.setItem("userId", userId);

      // Fetch profiles
      const profileRes = await axios.get("http://localhost:8000/api/profiles/", {
        headers: { Authorization: `Token ${token}` },
      });

      // Check if this user already has a profile
      const userProfile = profileRes.data.find(profile => profile.user === userId);

      if (userProfile) {
        localStorage.setItem("profileId", userProfile.id);
        navigate("/profile");
      } else {
        navigate("/profile-form");
      }

    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container mt-5 col-md-6">
      <h2 className="mb-4 text-center">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" name="username" className="form-control" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" required onChange={handleChange} />
        </div>
        <button className="btn btn-primary w-100">Login</button>
        <p className="mt-3 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
