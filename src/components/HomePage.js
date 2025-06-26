// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to ProfileMate</h1>
      <div className="mt-4">
        <Link to="/login" className="btn btn-primary mx-2">Login</Link>
        <Link to="/register" className="btn btn-success mx-2">Register</Link>
      </div>
    </div>
  );
};

export default HomePage;
