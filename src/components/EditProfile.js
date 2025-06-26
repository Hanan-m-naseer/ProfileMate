// src/components/EditProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    address: "",
    bio: "",
    linkedin: "",
    github: "",
    skills: "",
    image: null,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId");

    if (!token || !profileId) {
      setError("Not authenticated or profile not found.");
      return;
    }

    axios
      .get(`http://localhost:8000/api/profiles/${profileId}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setFormData({ ...res.data, image: null }); // Don't prefill image
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load profile.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value); // don't include empty/null fields
    });

    try {
      await axios.put(
        `http://localhost:8000/api/profiles/${profileId}/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="container mt-5 col-md-8">
      <h2 className="mb-4 text-center">Edit Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <div className="row g-3">
          {["name", "email", "age", "phone", "address", "bio", "linkedin", "github", "skills"].map((field) => (
            <div className="col-md-6" key={field}>
              <label className="form-label text-capitalize">{field}</label>
              <input
                type={field === "email" ? "email" : field === "age" ? "number" : "text"}
                name={field}
                value={formData[field] || ""}
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="col-md-6">
            <label className="form-label">Change Profile Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success mt-4 w-100">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
